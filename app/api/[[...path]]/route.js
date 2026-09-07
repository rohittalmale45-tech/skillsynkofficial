import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import {
  DISTRICTS, INDUSTRIES, SKILLS, COURSES, JOBS,
  INDUSTRY_SKILLS, DISTRICT_INDUSTRIES,
  computeSkillDemand, computeCourseCoverage, computeSkillGaps,
  computeDistrictAnalytics, computeCourseAlignment,
  analyzeJobDescription, studentRecommendation,
} from '@/lib/seed'
import { resourcesForSkill } from '@/lib/resources'
import { getRequestUser } from '@/lib/supabase/server'

// ---- Mongo (used for user submissions only; static data is served from seed) ----
let _client
async function getDb() {
  if (!_client) {
    _client = new MongoClient(process.env.MONGO_URL)
    await _client.connect()
  }
  const dbName = process.env.DB_NAME && process.env.DB_NAME !== 'your_database_name'
    ? process.env.DB_NAME : 'skillsync'
  return _client.db(dbName)
}

const json = (data, status = 200) => NextResponse.json(data, { status })
const err = (msg, status = 400) => NextResponse.json({ error: msg }, { status })

async function handle(request, method, path) {
  const url = new URL(request.url)
  const q = Object.fromEntries(url.searchParams)
  const seg = path || []
  const p0 = seg[0]

  try {
    // Health
    if (!p0 || p0 === 'health') return json({ ok: true, service: 'SkillSync Maharashtra API', ts: Date.now() })

    // Reference data
    if (p0 === 'districts' && method === 'GET') return json(DISTRICTS)
    if (p0 === 'industries' && method === 'GET') return json(INDUSTRIES)
    if (p0 === 'skills' && method === 'GET') return json(SKILLS)
    if (p0 === 'jobs' && method === 'GET') {
      let out = JOBS
      if (q.district) out = out.filter(j => j.district === q.district)
      if (q.industry) out = out.filter(j => j.industry === q.industry)
      return json(out)
    }
    if (p0 === 'courses' && method === 'GET') {
      let out = COURSES
      if (q.district) out = out.filter(c => c.district === q.district)
      if (q.industry) out = out.filter(c => c.industry === q.industry)
      return json(out)
    }
    if (p0 === 'course-skills' && method === 'GET') {
      const c = COURSES.find(x => x.id === q.course_id)
      if (!c) return err('course not found', 404)
      return json({ course: c, skills: c.skills.map(id => SKILLS.find(s => s.id === id)) })
    }
    if (p0 === 'job-skills' && method === 'GET') {
      const j = JOBS.find(x => x.id === q.job_id)
      if (!j) return err('job not found', 404)
      return json({ job: j, skills: j.skills.map(id => SKILLS.find(s => s.id === id)) })
    }

    // Analytics
    if (p0 === 'skill-demand' && method === 'GET') {
      const demand = computeSkillDemand(q.district || undefined)
      const maxD = Math.max(...Object.values(demand)) || 1
      const list = SKILLS.map(s => ({
        skill_id: s.id, skill: s.name, category: s.category, trend: s.trend,
        demand: Math.round(demand[s.id] / maxD * 100),
      })).sort((a,b) => b.demand - a.demand)
      return json(list)
    }

    if (p0 === 'stats' && method === 'GET') {
      const dist = q.district || undefined
      const gaps = computeSkillGaps(dist)
      const highDemand = gaps.filter(g => g.demand >= 60).length
      const emerging = dist ? gaps.filter(g => g.trend === 'emerging' && g.demand > 15).length : SKILLS.filter(s => s.trend === 'emerging').length
      const critical = gaps.filter(g => g.priority === 'Critical' || g.priority === 'High').length
      const scopedJobs = dist ? JOBS.filter(j => j.district === dist) : JOBS
      const scopedCourses = dist ? COURSES.filter(c => c.district === dist) : COURSES
      const coursesNeedingUpdates = scopedCourses.filter(c => {
        const align = computeCourseAlignment(c.id)
        return align && align.alignment_score < 65
      }).length
      const oversupplied = gaps.filter(g => g.priority === 'Oversupply').length
      const undersupplied = gaps.filter(g => g.priority === 'Critical' || g.priority === 'High').length
      return json({
        total_jobs_analyzed: scopedJobs.length,
        total_skills: SKILLS.length,
        district: dist || null,
        high_demand_skills: highDemand,
        emerging_skills: emerging,
        critical_skill_gaps: critical,
        courses_requiring_updates: coursesNeedingUpdates,
        oversupplied_courses: oversupplied,
        undersupplied_courses: undersupplied,
        districts_covered: dist ? 1 : DISTRICTS.length,
        industries_covered: INDUSTRIES.length,
        courses_in_scope: scopedCourses.length,
      })
    }

    if (p0 === 'district-analytics' && method === 'GET') {
      const id = q.district
      const data = computeDistrictAnalytics(id)
      if (!data) return err('district not found', 404)
      return json(data)
    }

    if (p0 === 'district-summary' && method === 'GET') {
      // Summary for map: demand intensity per district
      const list = DISTRICTS.map(d => {
        const a = computeDistrictAnalytics(d.id)
        const criticalCount = a.critical_gaps.length
        const emergingCount = a.emerging_skills.length
        const topIndustry = a.top_industries[0]?.name || 'N/A'
        // demand intensity = sum of top-skill demands
        const intensity = a.top_skills.reduce((s,x) => s + x.demand, 0)
        return {
          district_id: d.id, district: d.name, region: d.region,
          lat: d.lat, lon: d.lon,
          top_industry: topIndustry,
          critical_gaps: criticalCount,
          emerging_skills: emergingCount,
          training_capacity: d.training_capacity,
          demand_intensity: intensity,
        }
      })
      return json(list)
    }

    if (p0 === 'course-alignment' && method === 'GET') {
      const id = q.course_id
      const ind = q.industry
      const data = computeCourseAlignment(id, ind)
      if (!data) return err('course not found', 404)
      return json(data)
    }

    if (p0 === 'skill-gaps' && method === 'GET') {
      return json(computeSkillGaps(q.district || undefined))
    }

    // ---- Reports ----
    if (p0 === 'reports' && method === 'GET') {
      const kind = seg[1] || 'summary'
      if (kind === 'skill-demand') return json({ generated_at: new Date().toISOString(), rows: computeSkillGaps().map(g => ({ skill: g.skill, category: g.category, demand: g.demand, trend: g.trend })) })
      if (kind === 'skill-gap') return json({ generated_at: new Date().toISOString(), rows: computeSkillGaps() })
      if (kind === 'curriculum') return json({ generated_at: new Date().toISOString(), rows: COURSES.map(c => { const a = computeCourseAlignment(c.id); return { course: c.name, institute: c.institute, industry: a.industry_name, alignment_score: a.alignment_score, missing_high_priority: a.high_priority.length, recommendations: a.recommendations.slice(0,3) } }) })
      if (kind === 'emerging') return json({ generated_at: new Date().toISOString(), rows: SKILLS.filter(s => s.trend === 'emerging').map(s => ({ skill: s.name, category: s.category })) })
      if (kind === 'oversupply') return json({ generated_at: new Date().toISOString(), rows: computeSkillGaps().filter(g => g.priority === 'Oversupply' || g.priority === 'Aligned').slice(0,20) })
      if (kind === 'district-training') return json({ generated_at: new Date().toISOString(), rows: DISTRICTS.map(d => { const a = computeDistrictAnalytics(d.id); return { district: d.name, training_capacity: d.training_capacity, courses: a.courses_in_district, critical_gaps: a.critical_gaps.length, top_industry: a.top_industries[0]?.name } }) })
      return err('unknown report', 404)
    }

    // ---- POST endpoints ----
    if (p0 === 'job-analysis' && method === 'POST') {
      const body = await request.json()
      const result = analyzeJobDescription(body.text || body.description || '')
      // persist
      const db = await getDb()
      await db.collection('job_analyses').insertOne({ id: uuidv4(), input: body.text, result, created_at: new Date() })
      return json(result)
    }

    if (p0 === 'student-profile' && method === 'POST') {
      const body = await request.json()
      const result = studentRecommendation(body)
      const db = await getDb()
      await db.collection('students').insertOne({ id: uuidv4(), profile: body, recommendation: result, created_at: new Date() })
      return json(result)
    }

    if (p0 === 'employer-requirements' && method === 'POST') {
      const body = await request.json()
      const doc = { id: uuidv4(), ...body, created_at: new Date() }
      const db = await getDb()
      await db.collection('employer_skill_requirements').insertOne(doc)
      return json({ ok: true, id: doc.id })
    }
    if (p0 === 'employer-requirements' && method === 'GET') {
      const db = await getDb()
      const rows = await db.collection('employer_skill_requirements').find({}).sort({ created_at: -1 }).limit(50).toArray()
      return json(rows.map(({ _id, ...r }) => r))
    }

    // Learning resources for a single skill (?skill_id=...) or a list (?skill_ids=csv)
    if (p0 === 'resources' && method === 'GET') {
      if (q.skill_id) {
        const s = SKILLS.find(x => x.id === q.skill_id)
        if (!s) return err('skill not found', 404)
        return json(resourcesForSkill(s))
      }
      if (q.skill_ids) {
        const ids = q.skill_ids.split(',').map(x => x.trim()).filter(Boolean)
        const out = ids.map(id => {
          const s = SKILLS.find(x => x.id === id)
          return s ? resourcesForSkill(s) : null
        }).filter(Boolean)
        return json(out)
      }
      return json(SKILLS.slice(0, 10).map(resourcesForSkill))
    }

    // Profile (Supabase) — save role after signup
    if (p0 === 'profile' && method === 'POST') {
      const { user, error: uErr } = await getRequestUser(request)
      if (uErr || !user) return err('Unauthorized', 401)
      const body = await request.json()
      const role = body.role
      if (!['gov','institute','employer','student'].includes(role)) return err('Invalid role', 400)
      const db = await getDb()
      await db.collection('profiles').updateOne(
        { supabase_user_id: user.id },
        { $set: { role, email: user.email, updated_at: new Date() }, $setOnInsert: { supabase_user_id: user.id, created_at: new Date() } },
        { upsert: true }
      )
      return json({ ok: true, role, user_id: user.id })
    }
    if (p0 === 'profile' && method === 'GET') {
      const { user, error: uErr } = await getRequestUser(request)
      if (uErr || !user) return err('Unauthorized', 401)
      const db = await getDb()
      const prof = await db.collection('profiles').findOne({ supabase_user_id: user.id })
      return json({ user_id: user.id, email: user.email, role: prof?.role || null })
    }

    return err(`Not found: ${method} /api/${seg.join('/')}`, 404)
  } catch (e) {
    console.error('API error:', e)
    return err(e.message || 'Server error', 500)
  }
}

export async function GET(request, { params }) {
  const p = await params
  return handle(request, 'GET', p?.path || [])
}
export async function POST(request, { params }) {
  const p = await params
  return handle(request, 'POST', p?.path || [])
}
export async function PUT(request, { params }) {
  const p = await params
  return handle(request, 'PUT', p?.path || [])
}
export async function DELETE(request, { params }) {
  const p = await params
  return handle(request, 'DELETE', p?.path || [])
}
