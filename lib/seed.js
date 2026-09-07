// SkillSync Maharashtra — internally-consistent seed data
// Single source of truth used by API routes.

export const DISTRICTS = [
  { id: 'mumbai', name: 'Mumbai', region: 'Konkan', lat: 19.0760, lon: 72.8777, training_capacity: 42000 },
  { id: 'pune', name: 'Pune', region: 'Western Maharashtra', lat: 18.5204, lon: 73.8567, training_capacity: 38000 },
  { id: 'nagpur', name: 'Nagpur', region: 'Vidarbha', lat: 21.1458, lon: 79.0882, training_capacity: 21000 },
  { id: 'nashik', name: 'Nashik', region: 'North Maharashtra', lat: 19.9975, lon: 73.7898, training_capacity: 18500 },
  { id: 'aurangabad', name: 'Chh. Sambhajinagar', region: 'Marathwada', lat: 19.8762, lon: 75.3433, training_capacity: 16800 },
  { id: 'thane', name: 'Thane', region: 'Konkan', lat: 19.2183, lon: 72.9781, training_capacity: 24000 },
  { id: 'solapur', name: 'Solapur', region: 'Western Maharashtra', lat: 17.6599, lon: 75.9064, training_capacity: 11200 },
  { id: 'kolhapur', name: 'Kolhapur', region: 'Western Maharashtra', lat: 16.7050, lon: 74.2433, training_capacity: 12400 },
  { id: 'amravati', name: 'Amravati', region: 'Vidarbha', lat: 20.9374, lon: 77.7796, training_capacity: 9800 },
  { id: 'latur', name: 'Latur', region: 'Marathwada', lat: 18.4088, lon: 76.5604, training_capacity: 8600 },
]

export const INDUSTRIES = [
  { id: 'manufacturing', name: 'Manufacturing', color: '#2563eb' },
  { id: 'it', name: 'IT & ITES', color: '#0891b2' },
  { id: 'automotive', name: 'Automotive & EV', color: '#7c3aed' },
  { id: 'textile', name: 'Textile & Apparel', color: '#db2777' },
  { id: 'agri', name: 'Agri-Tech & Food Processing', color: '#16a34a' },
  { id: 'healthcare', name: 'Healthcare & Pharma', color: '#dc2626' },
  { id: 'renewable', name: 'Renewable Energy', color: '#f59e0b' },
  { id: 'logistics', name: 'Logistics & Warehousing', color: '#475569' },
]

// 40 skills across categories, each tagged with trend
export const SKILLS = [
  // IT & Data (10)
  { id: 'python', name: 'Python', category: 'IT', trend: 'growing' },
  { id: 'javascript', name: 'JavaScript', category: 'IT', trend: 'stable' },
  { id: 'react', name: 'React', category: 'IT', trend: 'growing' },
  { id: 'nodejs', name: 'Node.js', category: 'IT', trend: 'stable' },
  { id: 'aws', name: 'Cloud (AWS)', category: 'IT', trend: 'emerging' },
  { id: 'sql', name: 'SQL & Databases', category: 'IT', trend: 'stable' },
  { id: 'data-analytics', name: 'Data Analytics', category: 'IT', trend: 'growing' },
  { id: 'cybersecurity', name: 'Cybersecurity', category: 'IT', trend: 'emerging' },
  { id: 'devops', name: 'DevOps', category: 'IT', trend: 'growing' },
  { id: 'ml', name: 'Machine Learning', category: 'IT', trend: 'emerging' },
  // Manufacturing & Automotive (10)
  { id: 'cnc', name: 'CNC Programming', category: 'Manufacturing', trend: 'growing' },
  { id: 'plc', name: 'PLC Automation', category: 'Manufacturing', trend: 'growing' },
  { id: 'siemens-nx', name: 'Siemens NX', category: 'Manufacturing', trend: 'stable' },
  { id: 'autocad', name: 'AutoCAD', category: 'Manufacturing', trend: 'stable' },
  { id: 'solidworks', name: 'SolidWorks', category: 'Manufacturing', trend: 'stable' },
  { id: 'robotics', name: 'Industrial Robotics', category: 'Manufacturing', trend: 'emerging' },
  { id: 'welding', name: 'Manual Welding', category: 'Manufacturing', trend: 'declining' },
  { id: 'quality-control', name: 'Quality Control (ISO)', category: 'Manufacturing', trend: 'stable' },
  { id: 'lean', name: 'Lean Manufacturing', category: 'Manufacturing', trend: 'stable' },
  { id: 'six-sigma', name: 'Six Sigma', category: 'Manufacturing', trend: 'stable' },
  // Textile (4)
  { id: 'loom', name: 'Loom Operation', category: 'Textile', trend: 'declining' },
  { id: 'textile-design', name: 'Textile Design (CAD)', category: 'Textile', trend: 'growing' },
  { id: 'dyeing', name: 'Dyeing & Printing', category: 'Textile', trend: 'stable' },
  { id: 'fabric-qc', name: 'Fabric Quality Control', category: 'Textile', trend: 'stable' },
  // Agri & Food (4)
  { id: 'haccp', name: 'Food Safety (HACCP)', category: 'Agri', trend: 'growing' },
  { id: 'cold-chain', name: 'Cold Chain Logistics', category: 'Agri', trend: 'growing' },
  { id: 'precision-agri', name: 'Precision Agriculture', category: 'Agri', trend: 'emerging' },
  { id: 'soil-analytics', name: 'Soil Analytics', category: 'Agri', trend: 'emerging' },
  // Healthcare & Pharma (4)
  { id: 'gmp', name: 'GMP Compliance', category: 'Healthcare', trend: 'growing' },
  { id: 'pharma-qa', name: 'Pharma QA', category: 'Healthcare', trend: 'growing' },
  { id: 'bioprocessing', name: 'Bio-processing', category: 'Healthcare', trend: 'emerging' },
  { id: 'medical-coding', name: 'Medical Coding', category: 'Healthcare', trend: 'growing' },
  // Renewable Energy (4)
  { id: 'solar-pv', name: 'Solar PV Installation', category: 'Renewable', trend: 'emerging' },
  { id: 'wind', name: 'Wind Turbine Maintenance', category: 'Renewable', trend: 'growing' },
  { id: 'battery', name: 'Battery Technology', category: 'Renewable', trend: 'emerging' },
  { id: 'energy-audit', name: 'Energy Auditing', category: 'Renewable', trend: 'growing' },
  // Logistics (4)
  { id: 'warehouse-mgmt', name: 'Warehouse Management', category: 'Logistics', trend: 'growing' },
  { id: 'sap', name: 'SAP ERP', category: 'Logistics', trend: 'stable' },
  { id: 'supply-chain', name: 'Supply Chain Analytics', category: 'Logistics', trend: 'growing' },
  { id: 'ev-fleet', name: 'EV Fleet Operations', category: 'Logistics', trend: 'emerging' },
]

// Industry → skill demand strength (0..100). Determines Maharashtra-wide demand.
export const INDUSTRY_SKILLS = {
  manufacturing: { cnc:90, plc:88, 'siemens-nx':72, autocad:80, solidworks:65, robotics:78, welding:40, 'quality-control':82, lean:70, 'six-sigma':60 },
  it:            { python:92, javascript:85, react:80, nodejs:70, aws:88, sql:82, 'data-analytics':90, cybersecurity:86, devops:78, ml:84 },
  automotive:    { cnc:80, plc:82, 'siemens-nx':70, autocad:72, robotics:85, 'quality-control':75, lean:70, battery:88, 'ev-fleet':80, ml:60 },
  textile:       { loom:35, 'textile-design':78, dyeing:60, 'fabric-qc':70, 'quality-control':55, 'supply-chain':50, autocad:45 },
  agri:          { haccp:85, 'cold-chain':80, 'precision-agri':82, 'soil-analytics':70, 'supply-chain':60, sql:40, 'data-analytics':55 },
  healthcare:    { gmp:90, 'pharma-qa':88, bioprocessing:75, 'medical-coding':70, 'quality-control':72, 'data-analytics':55, sql:45 },
  renewable:     { 'solar-pv':92, wind:78, battery:85, 'energy-audit':70, plc:60, 'quality-control':55, cnc:40 },
  logistics:     { 'warehouse-mgmt':88, sap:80, 'supply-chain':85, 'ev-fleet':72, 'cold-chain':60, 'data-analytics':55, sql:45 },
}

// District → industry strength (multiplier for demand localization)
export const DISTRICT_INDUSTRIES = {
  mumbai:     { it:1.0, healthcare:0.8, logistics:0.85, manufacturing:0.5 },
  pune:       { it:0.95, automotive:1.0, manufacturing:0.9, renewable:0.6 },
  nagpur:     { logistics:0.9, manufacturing:0.7, agri:0.6, renewable:0.55 },
  nashik:     { agri:0.95, manufacturing:0.7, automotive:0.55, healthcare:0.5 },
  aurangabad: { automotive:0.85, healthcare:0.75, manufacturing:0.8, textile:0.4 },
  thane:      { logistics:0.85, manufacturing:0.7, it:0.65, healthcare:0.55 },
  solapur:    { textile:0.95, agri:0.65, manufacturing:0.4, renewable:0.5 },
  kolhapur:   { manufacturing:0.75, agri:0.7, automotive:0.6, textile:0.5 },
  amravati:   { agri:0.85, textile:0.55, renewable:0.7, manufacturing:0.35 },
  latur:      { agri:0.85, renewable:0.6, healthcare:0.45, manufacturing:0.3 },
}

export const COURSES = [
  { id: 'c1', name: 'Diploma in Mechanical Engineering', institute: 'Govt. Polytechnic Pune', district: 'pune', industry: 'manufacturing', seats: 1200, skills: ['cnc','autocad','solidworks','welding','quality-control','lean'] },
  { id: 'c2', name: 'B.Tech Computer Engineering', institute: 'VJTI Mumbai', district: 'mumbai', industry: 'it', seats: 1800, skills: ['python','javascript','sql','nodejs','react','data-analytics'] },
  { id: 'c3', name: 'ITI Electrician', institute: 'Govt. ITI Nagpur', district: 'nagpur', industry: 'manufacturing', seats: 900, skills: ['plc','solar-pv','quality-control'] },
  { id: 'c4', name: 'Diploma in Automation & Robotics', institute: 'COEP Pune', district: 'pune', industry: 'automotive', seats: 400, skills: ['plc','siemens-nx','robotics','autocad','quality-control'] },
  { id: 'c5', name: 'Textile Manufacturing', institute: 'Textile Institute Solapur', district: 'solapur', industry: 'textile', seats: 800, skills: ['loom','dyeing','fabric-qc','quality-control'] },
  { id: 'c6', name: 'Diploma in Food Technology', institute: 'MAFSU Nashik', district: 'nashik', industry: 'agri', seats: 350, skills: ['haccp','cold-chain','quality-control'] },
  { id: 'c7', name: 'Pharma QA Certification', institute: 'MGM Aurangabad', district: 'aurangabad', industry: 'healthcare', seats: 300, skills: ['gmp','pharma-qa','quality-control'] },
  { id: 'c8', name: 'Data Analytics Bootcamp', institute: 'MSBTE Pune', district: 'pune', industry: 'it', seats: 600, skills: ['python','sql','data-analytics'] },
  { id: 'c9', name: 'Renewable Energy Technician', institute: 'Skill India Amravati', district: 'amravati', industry: 'renewable', seats: 250, skills: ['solar-pv','wind','battery','energy-audit'] },
  { id: 'c10', name: 'Supply Chain & Logistics', institute: 'SIES Thane', district: 'thane', industry: 'logistics', seats: 500, skills: ['warehouse-mgmt','sap','supply-chain'] },
]

export const JOBS = [
  { id: 'j1', title: 'CNC Programmer', company: 'Bharat Forge', district: 'pune', industry: 'manufacturing', experience: '2-4 yrs', salary: '4.5 - 7.5 LPA', skills: ['cnc','siemens-nx','autocad','quality-control'] },
  { id: 'j2', title: 'PLC Automation Engineer', company: 'Tata Motors', district: 'pune', industry: 'automotive', experience: '3-5 yrs', salary: '6 - 10 LPA', skills: ['plc','siemens-nx','robotics','autocad'] },
  { id: 'j3', title: 'Full Stack Developer', company: 'TCS', district: 'mumbai', industry: 'it', experience: '1-3 yrs', salary: '5 - 9 LPA', skills: ['react','nodejs','javascript','sql','aws'] },
  { id: 'j4', title: 'Data Analyst', company: 'Infosys', district: 'pune', industry: 'it', experience: '0-2 yrs', salary: '4 - 7 LPA', skills: ['python','sql','data-analytics'] },
  { id: 'j5', title: 'Pharma QA Officer', company: 'Cipla', district: 'aurangabad', industry: 'healthcare', experience: '2-5 yrs', salary: '4 - 6 LPA', skills: ['gmp','pharma-qa','quality-control'] },
  { id: 'j6', title: 'Solar PV Technician', company: 'Adani Green', district: 'amravati', industry: 'renewable', experience: '1-3 yrs', salary: '3 - 5 LPA', skills: ['solar-pv','battery','energy-audit'] },
  { id: 'j7', title: 'Textile Design Executive', company: 'Raymond', district: 'solapur', industry: 'textile', experience: '2-4 yrs', salary: '3.5 - 5.5 LPA', skills: ['textile-design','dyeing','fabric-qc','autocad'] },
  { id: 'j8', title: 'Warehouse Operations Manager', company: 'Flipkart', district: 'thane', industry: 'logistics', experience: '3-6 yrs', salary: '6 - 9 LPA', skills: ['warehouse-mgmt','sap','supply-chain'] },
  { id: 'j9', title: 'EV Fleet Coordinator', company: 'BluSmart', district: 'mumbai', industry: 'logistics', experience: '2-4 yrs', salary: '5 - 8 LPA', skills: ['ev-fleet','battery','warehouse-mgmt','supply-chain'] },
  { id: 'j10', title: 'Food Safety Officer', company: 'Parle Products', district: 'nashik', industry: 'agri', experience: '2-5 yrs', salary: '4 - 6 LPA', skills: ['haccp','cold-chain','quality-control'] },
  { id: 'j11', title: 'Cybersecurity Analyst', company: 'Wipro', district: 'mumbai', industry: 'it', experience: '2-4 yrs', salary: '7 - 12 LPA', skills: ['cybersecurity','python','aws','sql'] },
  { id: 'j12', title: 'Precision Agri Consultant', company: 'Mahyco', district: 'latur', industry: 'agri', experience: '1-3 yrs', salary: '4 - 6 LPA', skills: ['precision-agri','soil-analytics','data-analytics'] },
  { id: 'j13', title: 'Industrial Robotics Engineer', company: 'Mahindra', district: 'aurangabad', industry: 'automotive', experience: '3-6 yrs', salary: '8 - 14 LPA', skills: ['robotics','plc','siemens-nx','python'] },
  { id: 'j14', title: 'Wind Turbine Technician', company: 'Suzlon', district: 'nashik', industry: 'renewable', experience: '2-4 yrs', salary: '4 - 6 LPA', skills: ['wind','energy-audit','quality-control'] },
  { id: 'j15', title: 'ML Engineer', company: 'Persistent', district: 'pune', industry: 'it', experience: '2-5 yrs', salary: '10 - 18 LPA', skills: ['ml','python','aws','data-analytics','sql'] },
]

// ---------- Derived analytics ----------

export function computeSkillDemand(districtId) {
  // Aggregate skill demand across industries × district-industry weights
  // If districtId is given, only that district's industry weights are used.
  const demand = {}
  for (const s of SKILLS) demand[s.id] = 0
  const districtSets = districtId && DISTRICT_INDUSTRIES[districtId]
    ? [DISTRICT_INDUSTRIES[districtId]] : Object.values(DISTRICT_INDUSTRIES)
  for (const [ind, skillMap] of Object.entries(INDUSTRY_SKILLS)) {
    // sum district weights for that industry
    let weight = 0
    for (const d of districtSets) weight += (d[ind] || 0)
    for (const [sk, val] of Object.entries(skillMap)) {
      demand[sk] += Math.round(val * weight)
    }
  }
  return demand
}

export function computeCourseCoverage(districtId) {
  const cov = {}
  for (const s of SKILLS) cov[s.id] = 0
  const list = districtId ? COURSES.filter(c => c.district === districtId) : COURSES
  for (const c of list) {
    for (const sk of c.skills) cov[sk] += c.seats
  }
  return cov
}

export function computeSkillGaps(districtId) {
  const demand = computeSkillDemand(districtId)
  const cov = computeCourseCoverage(districtId)
  // normalize each to 0..100 across skills for comparability
  const maxD = Math.max(...Object.values(demand)) || 1
  const maxC = Math.max(...Object.values(cov)) || 1
  return SKILLS.map(s => {
    const d = Math.round((demand[s.id] / maxD) * 100)
    const c = Math.round((cov[s.id] / maxC) * 100)
    const gap = d - c
    let priority = 'Aligned'
    if (gap >= 55) priority = 'Critical'
    else if (gap >= 35) priority = 'High'
    else if (gap >= 18) priority = 'Medium'
    else if (gap >= 5) priority = 'Low'
    else if (gap <= -20) priority = 'Oversupply'
    return { skill_id: s.id, skill: s.name, category: s.category, trend: s.trend, demand: d, coverage: c, gap, priority }
  }).sort((a,b) => b.gap - a.gap)
}

export function computeDistrictAnalytics(districtId) {
  const d = DISTRICTS.find(x => x.id === districtId)
  if (!d) return null
  const weights = DISTRICT_INDUSTRIES[districtId] || {}
  const topIndustries = Object.entries(weights).sort((a,b) => b[1]-a[1]).map(([id,w]) => ({ id, name: INDUSTRIES.find(i=>i.id===id)?.name, weight: Math.round(w*100) }))
  // Local skill demand
  const skillD = {}
  for (const s of SKILLS) skillD[s.id] = 0
  for (const [ind, w] of Object.entries(weights)) {
    const sm = INDUSTRY_SKILLS[ind] || {}
    for (const [sk, v] of Object.entries(sm)) skillD[sk] += v * w
  }
  // local supply from courses in this district
  const localCourses = COURSES.filter(c => c.district === districtId)
  const localSupply = {}
  for (const s of SKILLS) localSupply[s.id] = 0
  for (const c of localCourses) for (const sk of c.skills) localSupply[sk] += c.seats
  const maxD = Math.max(...Object.values(skillD)) || 1
  const maxS = Math.max(...Object.values(localSupply)) || 1
  const skillGaps = SKILLS.map(s => {
    const dem = Math.round(skillD[s.id]/maxD * 100)
    const sup = Math.round(localSupply[s.id]/maxS * 100)
    return { skill: s.name, skill_id: s.id, trend: s.trend, demand: dem, supply: sup, gap: dem - sup }
  }).sort((a,b) => b.gap - a.gap)
  const topSkills = skillGaps.filter(x => x.demand > 20).slice(0, 8)
  const emerging = skillGaps.filter(x => x.trend === 'emerging' && x.demand > 15).slice(0, 6)
  const critical = skillGaps.filter(x => x.gap >= 35).slice(0, 6)
  const under = skillGaps.filter(x => x.gap >= 25).slice(0, 5).map(x => x.skill)
  const over = skillGaps.filter(x => x.gap <= -15).slice(0, 5).map(x => x.skill)
  return {
    district: d,
    top_industries: topIndustries,
    top_skills: topSkills,
    emerging_skills: emerging,
    critical_gaps: critical,
    training_capacity: d.training_capacity,
    courses_in_district: localCourses.length,
    undersupplied_courses: under,
    oversupplied_courses: over,
    recommended_priorities: critical.slice(0,4).map(c => c.skill),
  }
}

export function computeCourseAlignment(courseId, industryId) {
  const course = COURSES.find(c => c.id === courseId)
  if (!course) return null
  const industry = industryId || course.industry
  const required = INDUSTRY_SKILLS[industry] || {}
  const requiredEntries = Object.entries(required).sort((a,b)=>b[1]-a[1])
  const covered = []
  const missing = []
  for (const [sk, imp] of requiredEntries) {
    const skill = SKILLS.find(s => s.id === sk)
    const item = { skill_id: sk, skill: skill?.name, importance: imp, trend: skill?.trend }
    if (course.skills.includes(sk)) covered.push(item)
    else missing.push(item)
  }
  const totalWeight = requiredEntries.reduce((a,[,v]) => a+v, 0)
  const coveredWeight = covered.reduce((a,c) => a + c.importance, 0)
  const score = Math.round((coveredWeight / totalWeight) * 100)
  const high = missing.filter(m => m.importance >= 75)
  const medium = missing.filter(m => m.importance >= 55 && m.importance < 75)
  const emerging = missing.filter(m => m.trend === 'emerging')
  const recommendations = [
    ...high.slice(0,4).map(h => `Add module: ${h.skill} — high industry importance (${h.importance})`),
    ...emerging.slice(0,3).map(e => `Introduce emerging tech: ${e.skill}`),
    ...(covered.filter(c => c.trend === 'declining').slice(0,2).map(d => `Reduce weight of declining skill: ${d.skill}`)),
  ]
  return {
    course, industry_id: industry,
    industry_name: INDUSTRIES.find(i=>i.id===industry)?.name,
    alignment_score: score,
    covered_skills: covered,
    missing_skills: missing,
    high_priority: high,
    medium_priority: medium,
    emerging_skills: emerging,
    recommendations,
  }
}

export function analyzeJobDescription(text) {
  const lower = (text || '').toLowerCase()
  const matched = []
  for (const s of SKILLS) {
    const key = s.name.toLowerCase().split(' ')[0]
    if (lower.includes(s.name.toLowerCase()) || lower.includes(s.id.replace('-', ' ')) || lower.includes(key)) {
      matched.push({ ...s, importance: Math.min(95, 60 + Math.floor(Math.random()*30)) })
    }
  }
  // dedupe
  const seen = new Set()
  const skills = matched.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true })
  // Infer industry by max matches
  const indScore = {}
  for (const [ind, sm] of Object.entries(INDUSTRY_SKILLS)) {
    indScore[ind] = 0
    for (const s of skills) if (sm[s.id]) indScore[ind] += sm[s.id]
  }
  const inferredIndustry = Object.entries(indScore).sort((a,b)=>b[1]-a[1])[0]?.[0] || null
  // Infer role from first keyword
  const rolePatterns = [
    { re: /cnc\s*program(mer)?/i, role: 'CNC Programmer' },
    { re: /plc\s*(engineer|automation)/i, role: 'PLC / Automation Engineer' },
    { re: /(full[\s-]?stack|frontend|backend)\s*developer/i, role: 'Software Developer' },
    { re: /data\s*analyst/i, role: 'Data Analyst' },
    { re: /(ml|machine\s*learning)\s*engineer/i, role: 'ML Engineer' },
    { re: /pharma\s*qa/i, role: 'Pharma QA Officer' },
    { re: /solar/i, role: 'Solar PV Technician' },
    { re: /warehouse/i, role: 'Warehouse Manager' },
    { re: /robotic/i, role: 'Robotics Engineer' },
    { re: /food\s*safety/i, role: 'Food Safety Officer' },
  ]
  const roleMatch = rolePatterns.find(r => r.re.test(text))?.role || (skills[0] ? `${skills[0].name} Specialist` : 'General Role')
  // Emerging tech
  const emerging = skills.filter(s => s.trend === 'emerging').map(s => s.name)
  return {
    job_role: roleMatch,
    industry: inferredIndustry ? INDUSTRIES.find(i=>i.id===inferredIndustry)?.name : 'General',
    industry_id: inferredIndustry,
    experience_hint: /(\d+)\s*[-–]\s*(\d+)\s*(year|yr)/i.exec(text)?.[0] || 'Not specified',
    required_skills: skills.slice(0, 12),
    emerging_technologies: emerging,
    proficiency: skills.length > 8 ? 'Senior' : skills.length > 4 ? 'Mid-level' : 'Entry-level',
    note: 'Rule-based extraction. Production AI (LLM-based) will be integrated in the next stage.',
  }
}

export function studentRecommendation(profile) {
  const currentSkills = (profile.current_skills || []).map(s => s.toLowerCase())
  const targetIndustry = profile.desired_industry
  const industryReq = INDUSTRY_SKILLS[targetIndustry] || {}
  const ranked = Object.entries(industryReq).sort((a,b)=>b[1]-a[1])
  const totalW = ranked.reduce((a,[,v])=>a+v,0)
  let covered = 0
  const gaps = []
  for (const [sk, imp] of ranked) {
    const skill = SKILLS.find(s => s.id === sk)
    const has = currentSkills.some(cs => cs.includes(skill?.name.toLowerCase() || sk) || (skill && cs.includes(skill.id)))
    if (has) covered += imp
    else gaps.push({ skill_id: sk, skill: skill?.name, importance: imp, trend: skill?.trend })
  }
  const readiness = Math.round((covered / totalW) * 100)
  const learningPath = gaps.slice(0,6).map((g,i) => ({ step: i+1, skill: g.skill, importance: g.importance, est_weeks: 4 + Math.floor(g.importance/25) }))
  const relevantRoles = JOBS.filter(j => j.industry === targetIndustry).slice(0,5)
  return {
    profile,
    job_readiness: readiness,
    current_profile_strength: currentSkills.length,
    skill_gaps: gaps.slice(0,10),
    recommended_skills: gaps.slice(0,6).map(g => g.skill),
    learning_path: learningPath,
    relevant_roles: relevantRoles,
    note: 'Baseline recommendation. AI-driven personalization coming in next stage.',
  }
}
