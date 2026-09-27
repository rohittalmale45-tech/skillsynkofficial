'use client'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { LANGS, translate } from '@/lib/i18n'
import Image from 'next/image'
import {
  LayoutDashboard, BarChart3, ScanText, GitCompare, AlertTriangle, MapPin,
  GraduationCap, Building2, FileText, Settings, LogOut, Shield,
  TrendingUp, TrendingDown, Activity, ArrowUpRight, ArrowDownRight, Sparkles,
  ChevronRight, Briefcase, BookOpen, Target, Loader2, Plus, ExternalLink,
  Youtube, Library, Award, Home, ChevronLeft, Globe,
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

// ---------- helpers ----------
const api = async (path, opts = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''

  const res = await fetch(`${baseUrl}/api/${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...opts,
  })

  if (!res.ok) {
    throw new Error(
      (await res.json().catch(() => ({}))).error || 'Request failed'
    )
  }

  return res.json()
}

const downloadFile = (name, content, mime = 'application/json') => {
  const blob = new Blob([typeof content === 'string' ? content : JSON.stringify(content, null, 2)], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = name; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 500)
}

// ---------- global app context (language + location) ----------
const AppCtx = createContext({ lang: 'en', t: (k) => k, district: 'all', districts: [], districtName: 'All Maharashtra' })
const useApp = () => useContext(AppCtx)
// builds "?district=xyz" (or "") for API calls
const dq = (district, first = true) => district && district !== 'all' ? `${first ? '?' : '&'}district=${district}` : ''

// ---------- nav ----------
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['gov','institute','employer','student'] },
  { id: 'lmi', label: 'Labour Market Intelligence', icon: BarChart3, roles: ['gov','institute','employer'] },
  { id: 'job-analyzer', label: 'AI Job Analyzer', icon: ScanText, roles: ['gov','employer','institute'] },
  { id: 'course-alignment', label: 'Course Alignment', icon: GitCompare, roles: ['gov','institute'] },
  { id: 'skill-gap', label: 'Skill Gap Analysis', icon: AlertTriangle, roles: ['gov','institute','employer'] },
  { id: 'district', label: 'District Skill Planning', icon: MapPin, roles: ['gov'] },
  { id: 'student', label: 'Student Career Navigator', icon: GraduationCap, roles: ['student','gov','institute'] },
  { id: 'employer', label: 'Employer Skill Demand', icon: Building2, roles: ['employer','gov'] },
  { id: 'reports', label: 'Reports', icon: FileText, roles: ['gov','institute'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['gov','institute','employer','student'] },
]
const ROLE_META = {
  gov: { title: 'Government / Admin', icon: Shield, accent: 'bg-blue-600' },
  institute: { title: 'Training Institute', icon: BookOpen, accent: 'bg-emerald-600' },
  employer: { title: 'Employer / Industry', icon: Briefcase, accent: 'bg-amber-600' },
  student: { title: 'Student', icon: GraduationCap, accent: 'bg-violet-600' },
}

// ---------- small ui ----------
const StatCard = ({ label, value, delta, deltaLabel, icon: Icon, tone = 'default' }) => {
  const toneMap = { default:'text-slate-900', pos:'text-emerald-600', neg:'text-rose-600', warn:'text-amber-600', blue:'text-blue-700' }
  return (
    <Card className="border-slate-200"><CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-500 font-medium">{label}</div>
          <div className={`text-3xl font-bold mt-2 ${toneMap[tone]}`}>{value}</div>
          {delta != null && <div className={`text-xs mt-2 flex items-center gap-1 ${delta>=0?'text-emerald-600':'text-rose-600'}`}>{delta>=0?<ArrowUpRight className="h-3 w-3" />:<ArrowDownRight className="h-3 w-3" />}{Math.abs(delta)}% {deltaLabel||''}</div>}
        </div>
        {Icon && <div className="h-10 w-10 rounded-md bg-slate-100 grid place-items-center"><Icon className="h-5 w-5 text-slate-600" /></div>}
      </div>
    </CardContent></Card>
  )
}
const PriorityBadge = ({ p }) => {
  const m = { Critical:'bg-rose-100 text-rose-700 border-rose-200', High:'bg-orange-100 text-orange-700 border-orange-200', Medium:'bg-amber-100 text-amber-700 border-amber-200', Low:'bg-yellow-100 text-yellow-700 border-yellow-200', Aligned:'bg-emerald-100 text-emerald-700 border-emerald-200', Oversupply:'bg-sky-100 text-sky-700 border-sky-200' }
  return <span className={`text-xs px-2 py-0.5 rounded border ${m[p]||m.Aligned}`}>{p}</span>
}
const TrendBadge = ({ t }) => {
  const m = { emerging:{c:'bg-violet-100 text-violet-700',i:Sparkles}, growing:{c:'bg-emerald-100 text-emerald-700',i:TrendingUp}, stable:{c:'bg-slate-100 text-slate-700',i:Activity}, declining:{c:'bg-rose-100 text-rose-700',i:TrendingDown} }
  const it = m[t]||m.stable; const I = it.i
  return <span className={`text-xs px-2 py-0.5 rounded inline-flex items-center gap-1 ${it.c}`}><I className="h-3 w-3" />{t}</span>
}

// ---------- Learning Resources ----------
const ResourceList = ({ resources }) => {
  if (!resources) return null
  const Group = ({ title, items, icon: Icon, tone }) => (
    <div>
      <div className={`text-xs uppercase font-semibold tracking-wider mb-2 flex items-center gap-1 ${tone}`}><Icon className="h-3.5 w-3.5" />{title}</div>
      <div className="space-y-1.5">
        {items.map((r,i) => (
          <a key={i} href={r.url} target="_blank" rel="noreferrer" className="flex items-start justify-between gap-2 border border-slate-200 rounded-md p-2 hover:border-blue-400 hover:bg-blue-50/50 transition">
            <div>
              <div className="text-sm font-medium text-slate-900">{r.title}</div>
              {r.provider && <div className="text-[11px] text-slate-500">{r.provider}</div>}
            </div>
            <div className="flex items-center gap-1">
              {r.badge && <Badge variant="outline" className="text-[10px]">{r.badge}</Badge>}
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Group title="Government Courses" items={resources.government} icon={Award} tone="text-blue-700" />
      <Group title="Private / MOOC" items={resources.private} icon={Library} tone="text-emerald-700" />
      <Group title="YouTube (Free)" items={resources.youtube} icon={Youtube} tone="text-rose-600" />
    </div>
  )
}

const ResourcesDialog = ({ open, onClose, skill }) => {
  const [data, setData] = useState(null)
  useEffect(() => { if (open && skill) { setData(null); api(`resources?skill_id=${skill.skill_id || skill.id}`).then(setData) } }, [open, skill])
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-700" />Learning Resources · {skill?.skill || skill?.name}</DialogTitle>
          <DialogDescription>Government-approved, private (MOOC) and free YouTube courses to build this skill.</DialogDescription>
        </DialogHeader>
        {!data ? <div className="grid place-items-center h-40"><Loader2 className="h-5 w-5 animate-spin text-slate-400" /></div> : <ResourceList resources={data} />}
      </DialogContent>
    </Dialog>
  )
}

// ---------- Views ----------
const DashboardView = () => {
  const { t, district, districtName } = useApp()
  const [stats, setStats] = useState(null); const [demand, setDemand] = useState([]); const [gaps, setGaps] = useState([]); const [districts, setDistricts] = useState([])
  useEffect(() => { setStats(null); Promise.all([api(`stats${dq(district)}`), api(`skill-demand${dq(district)}`), api(`skill-gaps${dq(district)}`), api('district-summary')]).then(([s,d,g,ds])=>{setStats(s);setDemand(d);setGaps(g);setDistricts(ds)}).catch(e=>toast.error(e.message)) }, [district])
  const industryBars = useMemo(() => { const m={}; for(const s of demand) m[s.category]=(m[s.category]||0)+s.demand; return Object.entries(m).map(([name,value])=>({name,value})) }, [demand])
  if (!stats) return <div className="grid place-items-center h-96"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
  const topDemand = demand.slice(0,10); const emerging = demand.filter(x=>x.trend==='emerging').slice(0,6); const gapChart = gaps.slice(0,10).map(g=>({skill:g.skill,Demand:g.demand,Coverage:g.coverage}))
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900" data-testid="dashboard-title">{district==='all' ? t('Maharashtra Skill Demand Overview') : `${districtName} — ${t('Skill Demand Overview')}`}</h1><p className="text-sm text-slate-600 mt-1">{district==='all' ? t('Real-time labour-market intelligence across 10 districts and 8 industries.') : t('Real-time labour-market intelligence for the selected district.')}</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={t('Total Jobs Analyzed')} value={stats.total_jobs_analyzed} icon={Briefcase} tone="blue" delta={12} deltaLabel="vs last qtr" />
        <StatCard label={t('Total Skills Tracked')} value={stats.total_skills} icon={Target} />
        <StatCard label={t('High-Demand Skills')} value={stats.high_demand_skills} icon={TrendingUp} tone="pos" delta={8} />
        <StatCard label={t('Emerging Skills')} value={stats.emerging_skills} icon={Sparkles} tone="blue" delta={22} />
        <StatCard label={t('Critical Skill Gaps')} value={stats.critical_skill_gaps} icon={AlertTriangle} tone="neg" delta={-5} />
        <StatCard label={t('Courses Needing Updates')} value={stats.courses_requiring_updates} icon={BookOpen} tone="warn" />
        <StatCard label={t('Oversupplied Courses')} value={stats.oversupplied_courses} icon={TrendingDown} />
        <StatCard label={t('Undersupplied Courses')} value={stats.undersupplied_courses} icon={TrendingUp} tone="warn" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-base">{t('Top 10 Demanded Skills')} ({district==='all' ? t('All Maharashtra') : districtName})</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={300}><BarChart data={topDemand} layout="vertical" margin={{left:20}}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis type="number" domain={[0,100]} /><YAxis type="category" dataKey="skill" width={110} tick={{fontSize:11}} /><Tooltip /><Bar dataKey="demand" fill="#2563eb" radius={[0,4,4,0]} /></BarChart></ResponsiveContainer>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">{t('Top Emerging Skills')}</CardTitle></CardHeader><CardContent className="space-y-3">
          {emerging.map(e => <div key={e.skill_id} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0"><div><div className="font-medium text-slate-900 text-sm">{e.skill}</div><div className="text-xs text-slate-500">{e.category}</div></div><div className="flex items-center gap-2"><span className="text-sm font-semibold text-slate-700">{e.demand}</span><TrendBadge t={e.trend} /></div></div>)}
        </CardContent></Card>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-base">{t('Skill Supply vs Demand')}</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={300}><BarChart data={gapChart}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="skill" tick={{fontSize:10}} angle={-25} textAnchor="end" height={70} /><YAxis /><Tooltip /><Legend /><Bar dataKey="Demand" fill="#2563eb" /><Bar dataKey="Coverage" fill="#10b981" /></BarChart></ResponsiveContainer>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">{t('Industry-wise Demand')}</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={300}><PieChart><Pie data={industryBars} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>{industryBars.map((_,i)=><Cell key={i} fill={['#2563eb','#0891b2','#7c3aed','#db2777','#16a34a','#dc2626','#f59e0b','#475569'][i%8]} />)}</Pie><Tooltip /><Legend wrapperStyle={{fontSize:11}} /></PieChart></ResponsiveContainer>
        </CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="text-base">{t('District-wise Skill Demand Intensity')}</CardTitle></CardHeader><CardContent>
        <ResponsiveContainer width="100%" height={280}><BarChart data={districts}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="district" tick={{fontSize:11}} /><YAxis /><Tooltip /><Bar dataKey="demand_intensity" name="Demand Intensity" fill="#2563eb" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer>
      </CardContent></Card>
    </div>
  )
}

const LMIView = () => {
  const { t, district, districtName } = useApp()
  const [demand, setDemand] = useState([]); const [industries, setIndustries] = useState([])
  const [fInd, setFInd] = useState('all')
  useEffect(() => { Promise.all([api(`skill-demand${dq(district)}`), api('industries')]).then(([d,i])=>{setDemand(d);setIndustries(i)}) }, [district])
  const emerging = demand.filter(d=>d.trend==='emerging'); const declining = demand.filter(d=>d.trend==='declining')
  const trendData = useMemo(() => { const top=demand.slice(0,4); return Array.from({length:12}).map((_,m)=>{ const r={month:['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'][m]}; top.forEach(t=>{r[t.skill]=Math.max(20,t.demand-20+Math.round(Math.sin(m/2+t.demand)*8)+m)}); return r }) }, [demand])
  return (<div className="space-y-6">
    <div className="flex items-start justify-between flex-wrap gap-3">
      <div><h1 className="text-2xl font-bold">{t('Labour Market Intelligence')}</h1><p className="text-sm text-slate-600 mt-1">{district==='all' ? t('Statewide trends across skills, industries and districts.') : `${districtName} · ${t('Real-time labour-market intelligence for the selected district.')}`}</p></div>
      <div className="flex gap-2">
        <Select value={fInd} onValueChange={setFInd}><SelectTrigger className="w-44"><SelectValue placeholder="Industry" /></SelectTrigger><SelectContent><SelectItem value="all">All industries</SelectItem>{industries.map(i=><SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent></Select>
        <Badge variant="outline" className="h-9 px-3 gap-1"><MapPin className="h-3.5 w-3.5" />{district==='all' ? t('All Maharashtra') : districtName}</Badge>
      </div>
    </div>
    <div className="grid md:grid-cols-3 gap-4">
      <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-600" />Top Demanded</CardTitle></CardHeader><CardContent className="space-y-2">{demand.slice(0,8).map(d=><div key={d.skill_id} className="flex justify-between text-sm"><span>{d.skill}</span><span className="font-semibold">{d.demand}</span></div>)}</CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-violet-600" />Emerging</CardTitle></CardHeader><CardContent className="space-y-2">{emerging.slice(0,8).map(d=><div key={d.skill_id} className="flex justify-between text-sm"><span>{d.skill}</span><Badge variant="secondary">{d.category}</Badge></div>)}</CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingDown className="h-4 w-4 text-rose-600" />Declining</CardTitle></CardHeader><CardContent className="space-y-2">{declining.map(d=><div key={d.skill_id} className="flex justify-between text-sm"><span>{d.skill}</span><Badge variant="outline">{d.category}</Badge></div>)}</CardContent></Card>
    </div>
    <Card><CardHeader><CardTitle className="text-base">12-Month Demand Trend (Top Skills)</CardTitle></CardHeader><CardContent>
      <ResponsiveContainer width="100%" height={300}><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend />{demand.slice(0,4).map((t,i)=><Line key={t.skill_id} type="monotone" dataKey={t.skill} stroke={['#2563eb','#7c3aed','#16a34a','#dc2626'][i]} strokeWidth={2} dot={false} />)}</LineChart></ResponsiveContainer>
    </CardContent></Card>
    <Card><CardHeader><CardTitle className="text-base">Full Skill Demand Table</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Skill</TableHead><TableHead>Category</TableHead><TableHead>Trend</TableHead><TableHead className="text-right">Demand</TableHead></TableRow></TableHeader><TableBody>{demand.map(d=><TableRow key={d.skill_id}><TableCell className="font-medium">{d.skill}</TableCell><TableCell>{d.category}</TableCell><TableCell><TrendBadge t={d.trend} /></TableCell><TableCell className="text-right font-semibold">{d.demand}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
  </div>)
}

const JobAnalyzerView = () => {
  const { t } = useApp()
  const [text, setText] = useState('CNC Programmer required with 3-5 years experience in CNC programming, Siemens NX, AutoCAD, PLC and industrial automation. Knowledge of quality control and lean manufacturing preferred.')
  const [result, setResult] = useState(null); const [loading, setLoading] = useState(false); const [resSkill, setResSkill] = useState(null)
  const analyze = async () => { setLoading(true); try { const r=await api('job-analysis',{method:'POST',body:JSON.stringify({text})}); setResult(r); toast.success('Analysis complete') } catch(e){toast.error(e.message)} finally{setLoading(false)} }
  return (<div className="space-y-6">
    <div><h1 className="text-2xl font-bold">{t('AI Job Analyzer')}</h1><p className="text-sm text-slate-600 mt-1">{t('Paste a job description to extract skills, industry & learning resources.')}</p></div>
    <Card><CardHeader><CardTitle className="text-base">Job Description</CardTitle></CardHeader><CardContent className="space-y-3">
      <Textarea rows={8} value={text} onChange={e=>setText(e.target.value)} className="font-mono text-sm" />
      <Button onClick={analyze} disabled={loading}>{loading?<Loader2 className="h-4 w-4 animate-spin mr-2" />:<ScanText className="h-4 w-4 mr-2" />}Analyze Job</Button>
    </CardContent></Card>
    {result && <>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-1"><CardHeader><CardTitle className="text-base">Overview</CardTitle></CardHeader><CardContent className="space-y-3 text-sm">
          <div><div className="text-slate-500 text-xs uppercase">Job Role</div><div className="font-semibold">{result.job_role}</div></div>
          <div><div className="text-slate-500 text-xs uppercase">Industry</div><div className="font-semibold">{result.industry}</div></div>
          <div><div className="text-slate-500 text-xs uppercase">Experience</div><div className="font-semibold">{result.experience_hint}</div></div>
          <div><div className="text-slate-500 text-xs uppercase">Proficiency</div><div className="font-semibold">{result.proficiency}</div></div>
          <div><div className="text-slate-500 text-xs uppercase">Emerging Tech</div><div className="flex flex-wrap gap-1 mt-1">{result.emerging_technologies.length?result.emerging_technologies.map(e=><Badge key={e} className="bg-violet-100 text-violet-700 hover:bg-violet-100">{e}</Badge>):<span className="text-slate-500">None</span>}</div></div>
        </CardContent></Card>
        <Card className="md:col-span-2"><CardHeader><CardTitle className="text-base">Required Skills · Click a skill for courses</CardTitle></CardHeader><CardContent className="space-y-2">
          {result.required_skills.map(s => (
            <button key={s.id} onClick={()=>setResSkill({skill_id:s.id, skill:s.name})} className="w-full text-left space-y-1 hover:bg-slate-50 p-1 rounded">
              <div className="flex justify-between text-sm"><span className="font-medium">{s.name}</span><span className="text-slate-500 flex items-center gap-1">{s.importance}/100 <TrendBadge t={s.trend} /> <BookOpen className="h-3 w-3 text-blue-600" /></span></div>
              <Progress value={s.importance} />
            </button>
          ))}
          {result.required_skills.length===0 && <div className="text-sm text-slate-500">No known skills matched.</div>}
        </CardContent></Card>
      </div>
    </>}
    <ResourcesDialog open={!!resSkill} onClose={()=>setResSkill(null)} skill={resSkill} />
  </div>)
}

const CourseAlignmentView = () => {
  const { t } = useApp()
  const [courses, setCourses] = useState([]); const [industries, setIndustries] = useState([]); const [districts, setDistricts] = useState([])
  const [courseId, setCourseId] = useState(''); const [industry, setIndustry] = useState(''); const [district, setDistrict] = useState('all')
  const [result, setResult] = useState(null); const [resSkill, setResSkill] = useState(null)
  useEffect(() => { Promise.all([api('courses'),api('industries'),api('districts')]).then(([c,i,d])=>{setCourses(c);setIndustries(i);setDistricts(d);setCourseId(c[0]?.id);setIndustry(c[0]?.industry)}) }, [])
  useEffect(() => { if (courseId) api(`course-alignment?course_id=${courseId}&industry=${industry||''}`).then(setResult) }, [courseId,industry])
  const filteredCourses = district==='all'?courses:courses.filter(c=>c.district===district)
  return (<div className="space-y-6">
    <div><h1 className="text-2xl font-bold">{t('Course Alignment')}</h1><p className="text-sm text-slate-600 mt-1">{t('Compare a course curriculum against industry-required skills.')}</p></div>
    <Card><CardContent className="p-4 grid md:grid-cols-3 gap-3">
      <div><Label className="text-xs">District</Label><Select value={district} onValueChange={setDistrict}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All districts</SelectItem>{districts.map(d=><SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div>
      <div><Label className="text-xs">Course</Label><Select value={courseId} onValueChange={setCourseId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{filteredCourses.map(c=><SelectItem key={c.id} value={c.id}>{c.name} — {c.institute}</SelectItem>)}</SelectContent></Select></div>
      <div><Label className="text-xs">Compare vs Industry</Label><Select value={industry} onValueChange={setIndustry}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{industries.map(i=><SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent></Select></div>
    </CardContent></Card>
    {result && <>
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Alignment Score" value={`${result.alignment_score}%`} tone={result.alignment_score>=70?'pos':result.alignment_score>=50?'warn':'neg'} icon={Target} />
        <StatCard label="Covered Skills" value={result.covered_skills.length} tone="pos" />
        <StatCard label="Missing Skills" value={result.missing_skills.length} tone="warn" />
        <StatCard label="Emerging Gaps" value={result.emerging_skills.length} tone="blue" icon={Sparkles} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-base text-emerald-700">Current Curriculum (Covered)</CardTitle></CardHeader><CardContent className="space-y-2">{result.covered_skills.map(c=><div key={c.skill_id} className="flex justify-between items-center text-sm"><span>{c.skill}</span><div className="flex items-center gap-2"><TrendBadge t={c.trend} /><span className="font-semibold">{c.importance}</span></div></div>)}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base text-rose-700">Industry Required (Missing) · Click for courses</CardTitle></CardHeader><CardContent className="space-y-2">{result.missing_skills.map(c=><button key={c.skill_id} onClick={()=>setResSkill(c)} className="w-full flex justify-between items-center text-sm hover:bg-slate-50 p-1 rounded"><span>{c.skill}</span><div className="flex items-center gap-2"><TrendBadge t={c.trend} /><span className="font-semibold">{c.importance}</span><BookOpen className="h-3 w-3 text-blue-600" /></div></button>)}</CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="text-base">Recommended Curriculum Updates</CardTitle></CardHeader><CardContent><ol className="space-y-2 text-sm list-decimal list-inside">{result.recommendations.map((r,i)=><li key={i} className="text-slate-700">{r}</li>)}</ol></CardContent></Card>
    </>}
    <ResourcesDialog open={!!resSkill} onClose={()=>setResSkill(null)} skill={resSkill} />
  </div>)
}

const SkillGapView = () => {
  const { t, district } = useApp()
  const [gaps, setGaps] = useState([]); const [priority, setPriority] = useState('all'); const [resSkill, setResSkill] = useState(null)
  useEffect(() => { api(`skill-gaps${dq(district)}`).then(setGaps) }, [district])
  const filtered = priority==='all'?gaps:gaps.filter(g=>g.priority===priority)
  const chartData = gaps.slice(0,12).map(g=>({skill:g.skill,Demand:g.demand,Coverage:g.coverage,Gap:g.gap}))
  return (<div className="space-y-6">
    <div><h1 className="text-2xl font-bold">{t('Skill Gap Analysis')}</h1><p className="text-sm text-slate-600 mt-1">{t('Industry Demand − Course Coverage = Skill Gap · Click any skill for learning resources')}</p></div>
    <Card><CardHeader><CardTitle className="text-base">Industry Demand vs Course Coverage</CardTitle></CardHeader><CardContent>
      <ResponsiveContainer width="100%" height={330}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="skill" tick={{fontSize:10}} angle={-30} textAnchor="end" height={90} /><YAxis /><Tooltip /><Legend /><Bar dataKey="Demand" fill="#2563eb" /><Bar dataKey="Coverage" fill="#10b981" /><Bar dataKey="Gap" fill="#f97316" /></BarChart></ResponsiveContainer>
    </CardContent></Card>
    <div className="flex items-center gap-3"><Label>Filter by priority:</Label><Select value={priority} onValueChange={setPriority}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent>{['all','Critical','High','Medium','Low','Aligned','Oversupply'].map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
    <Card><CardContent className="p-0"><Table>
      <TableHeader><TableRow><TableHead>Skill</TableHead><TableHead>Category</TableHead><TableHead>Demand</TableHead><TableHead>Coverage</TableHead><TableHead>Gap</TableHead><TableHead>Priority</TableHead><TableHead>Courses</TableHead></TableRow></TableHeader>
      <TableBody>
        {filtered.map(g=><TableRow key={g.skill_id}>
          <TableCell className="font-medium">{g.skill}</TableCell>
          <TableCell><span className="text-xs text-slate-600">{g.category}</span></TableCell>
          <TableCell><div className="flex items-center gap-2"><Progress value={g.demand} className="w-24" /><span className="text-xs w-8">{g.demand}</span></div></TableCell>
          <TableCell><div className="flex items-center gap-2"><Progress value={g.coverage} className="w-24" /><span className="text-xs w-8">{g.coverage}</span></div></TableCell>
          <TableCell className={g.gap>0?'text-rose-600 font-semibold':'text-emerald-600 font-semibold'}>{g.gap>0?'+':''}{g.gap}</TableCell>
          <TableCell><PriorityBadge p={g.priority} /></TableCell>
          <TableCell><Button size="sm" variant="outline" onClick={()=>setResSkill(g)}><BookOpen className="h-3 w-3 mr-1" />View</Button></TableCell>
        </TableRow>)}
      </TableBody>
    </Table></CardContent></Card>
    <ResourcesDialog open={!!resSkill} onClose={()=>setResSkill(null)} skill={resSkill} />
  </div>)
}

const DistrictView = () => {
  const [summary, setSummary] = useState([]); const [selected, setSelected] = useState(null); const [detail, setDetail] = useState(null)
  const { t, district } = useApp()
  useEffect(() => { api('district-summary').then(s=>{setSummary(s);setSelected(district!=='all' ? district : s[0]?.district_id)}) }, [])
  useEffect(() => { if (district!=='all') setSelected(district) }, [district])
  useEffect(() => { if (selected) api(`district-analytics?district=${selected}`).then(setDetail) }, [selected])
  const maxIntensity = Math.max(...summary.map(s=>s.demand_intensity),1)
  const minLat=15.5,maxLat=22.5,minLon=72.5,maxLon=80.5
  const proj = (lat,lon) => ({ x:((lon-minLon)/(maxLon-minLon))*100, y:(1-(lat-minLat)/(maxLat-minLat))*100 })
  return (<div className="space-y-6">
    <div><h1 className="text-2xl font-bold">{t('District Skill Planning')}</h1><p className="text-sm text-slate-600 mt-1">{t('Click a district for detailed planning analytics.')}</p></div>
    <div className="grid md:grid-cols-5 gap-4">
      <Card className="md:col-span-2"><CardHeader><CardTitle className="text-base">Maharashtra — Demand Intensity Map</CardTitle></CardHeader><CardContent>
        <div className="relative bg-slate-50 border border-slate-200 rounded-md h-[380px] overflow-hidden">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none"><path d="M 8,45 L 18,30 L 32,25 L 48,22 L 62,25 L 78,32 L 92,42 L 90,58 L 82,70 L 68,78 L 52,82 L 38,80 L 24,72 L 12,60 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.3" /></svg>
          {summary.map(d=>{ const{x,y}=proj(d.lat,d.lon); const it=d.demand_intensity/maxIntensity; const size=14+it*22; return (
            <button key={d.district_id} onClick={()=>setSelected(d.district_id)} className="absolute -translate-x-1/2 -translate-y-1/2" style={{left:`${x}%`,top:`${y}%`}}>
              <div className={`rounded-full grid place-items-center transition ${selected===d.district_id?'ring-4 ring-blue-300':''}`} style={{width:size,height:size,backgroundColor:`rgba(37, 99, 235, ${0.35+it*0.55})`,border:'2px solid #1d4ed8'}}><span className="text-[9px] font-bold text-white">{d.critical_gaps}</span></div>
              <div className="absolute left-1/2 -translate-x-1/2 mt-1 text-[10px] font-semibold whitespace-nowrap">{d.district}</div>
            </button>
          )})}
          <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 bg-white/80 px-2 py-1 rounded">Bubble = intensity · Number = critical gaps</div>
        </div>
      </CardContent></Card>
      <div className="md:col-span-3 space-y-4">{detail ? <>
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Training Capacity" value={detail.training_capacity.toLocaleString()} tone="blue" />
          <StatCard label="Courses in District" value={detail.courses_in_district} />
          <StatCard label="Critical Gaps" value={detail.critical_gaps.length} tone="neg" />
          <StatCard label={t('Emerging Skills')} value={detail.emerging_skills.length} tone="blue" icon={Sparkles} />
        </div>
        <Card><CardHeader><CardTitle className="text-base">{detail.district.name} · {detail.district.region}</CardTitle></CardHeader><CardContent className="grid md:grid-cols-2 gap-4">
          <div><div className="text-xs uppercase text-slate-500 font-medium mb-2">Top Industries</div><div className="space-y-2">{detail.top_industries.map(i=><div key={i.id} className="flex justify-between text-sm"><span>{i.name}</span><div className="flex items-center gap-2 w-32"><Progress value={i.weight} /><span className="text-xs w-8 text-right">{i.weight}%</span></div></div>)}</div></div>
          <div><div className="text-xs uppercase text-slate-500 font-medium mb-2">Recommended Priorities</div><div className="space-y-1 text-sm">{detail.recommended_priorities.map((p,i)=><div key={i} className="flex items-center gap-2"><Target className="h-3 w-3 text-blue-600" />{p}</div>)}</div></div>
          <div><div className="text-xs uppercase text-slate-500 font-medium mb-2">Undersupplied</div><div className="flex flex-wrap gap-1">{detail.undersupplied_courses.map(u=><Badge key={u} variant="destructive" className="text-xs">{u}</Badge>)}</div></div>
          <div><div className="text-xs uppercase text-slate-500 font-medium mb-2">Oversupplied</div><div className="flex flex-wrap gap-1">{detail.oversupplied_courses.length?detail.oversupplied_courses.map(u=><Badge key={u} variant="secondary" className="text-xs">{u}</Badge>):<span className="text-xs text-slate-500">None</span>}</div></div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Demand vs Local Supply</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={220}><BarChart data={detail.top_skills}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="skill" tick={{fontSize:10}} angle={-25} textAnchor="end" height={70} /><YAxis /><Tooltip /><Legend /><Bar dataKey="demand" name="Demand" fill="#2563eb" /><Bar dataKey="supply" name="Local Supply" fill="#10b981" /></BarChart></ResponsiveContainer>
        </CardContent></Card>
      </> : <div className="grid place-items-center h-64"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>}</div>
    </div>
  </div>)
}

const StudentView = () => {
  const [industries, setIndustries] = useState([]); const [districts, setDistricts] = useState([]); const [skills, setSkills] = useState([])
  const [form, setForm] = useState({ education:'Diploma', district:'', current_skills:[], desired_industry:'', desired_role:'' })
  const [result, setResult] = useState(null); const [loading, setLoading] = useState(false); const [resources, setResources] = useState([])
  const { t, district } = useApp()
  useEffect(() => { Promise.all([api('industries'),api('districts'),api('skills')]).then(([i,d,s])=>{setIndustries(i);setDistricts(d);setSkills(s);setForm(f=>({...f,district:district!=='all'?district:d[0]?.id,desired_industry:i[0]?.id}))}) }, [])
  useEffect(() => { if (district!=='all') setForm(f=>({...f,district})) }, [district])
  const toggleSkill = (n) => setForm(f=>({...f,current_skills:f.current_skills.includes(n)?f.current_skills.filter(x=>x!==n):[...f.current_skills,n]}))
  const submit = async () => {
    setLoading(true)
    try {
      const r = await api('student-profile',{method:'POST',body:JSON.stringify(form)}); setResult(r)
      const ids = r.skill_gaps.slice(0,6).map(g=>g.skill_id).join(',')
      if (ids) { const res = await api(`resources?skill_ids=${ids}`); setResources(res) } else setResources([])
      toast.success('Career path generated with learning resources')
    } catch(e){ toast.error(e.message) } finally{setLoading(false)}
  }
  return (<div className="space-y-6">
    <div><h1 className="text-2xl font-bold">{t('Student Career Navigator')}</h1><p className="text-sm text-slate-600 mt-1">{t('Personalised skill-gap & learning path with real courses.')}</p></div>
    <div className="grid md:grid-cols-2 gap-4">
      <Card><CardHeader><CardTitle className="text-base">Your Profile</CardTitle></CardHeader><CardContent className="space-y-3">
        <div><Label>Education</Label><Select value={form.education} onValueChange={v=>setForm(f=>({...f,education:v}))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['10th','12th','ITI','Diploma','B.Tech','B.Sc','MBA','M.Tech'].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
        <div><Label>District</Label><Select value={form.district} onValueChange={v=>setForm(f=>({...f,district:v}))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{districts.map(d=><SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div>
        <div><Label>Desired Industry</Label><Select value={form.desired_industry} onValueChange={v=>setForm(f=>({...f,desired_industry:v}))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{industries.map(i=><SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent></Select></div>
        <div><Label>Desired Job Role</Label><Input value={form.desired_role} onChange={e=>setForm(f=>({...f,desired_role:e.target.value}))} placeholder="e.g. Data Analyst" /></div>
        <div><Label>Current Skills (tap)</Label>
          <div className="flex flex-wrap gap-1 mt-2 max-h-40 overflow-auto p-2 border rounded">{skills.map(s=><button key={s.id} type="button" onClick={()=>toggleSkill(s.name)} className={`text-xs px-2 py-1 rounded border ${form.current_skills.includes(s.name)?'bg-blue-600 text-white border-blue-600':'bg-white border-slate-200 hover:border-blue-400'}`}>{s.name}</button>)}</div>
        </div>
        <Button onClick={submit} disabled={loading}>{loading?<Loader2 className="h-4 w-4 animate-spin mr-2" />:<Target className="h-4 w-4 mr-2" />}Generate Career Path</Button>
      </CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Job Readiness</CardTitle></CardHeader><CardContent>
        {result ? <div className="space-y-4">
          <div className="text-center"><div className="text-5xl font-bold text-blue-700">{result.job_readiness}%</div><div className="text-sm text-slate-600 mt-1">Readiness for {industries.find(i=>i.id===form.desired_industry)?.name}</div></div>
          <Progress value={result.job_readiness} className="h-3" />
          <Separator />
          <div><div className="text-xs uppercase text-slate-500 font-medium mb-2">Recommended Skills</div><div className="flex flex-wrap gap-1">{result.recommended_skills.map(s=><Badge key={s} className="bg-amber-100 text-amber-700 hover:bg-amber-100">{s}</Badge>)}</div></div>
          <div><div className="text-xs uppercase text-slate-500 font-medium mb-2">Personalised Learning Path</div><div className="space-y-2">{result.learning_path.map(l=><div key={l.step} className="flex items-center justify-between border rounded p-2 text-sm"><div className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-blue-600 text-white grid place-items-center text-xs font-bold">{l.step}</div>{l.skill}</div><div className="text-xs text-slate-500">~{l.est_weeks} wks</div></div>)}</div></div>
          <div><div className="text-xs uppercase text-slate-500 font-medium mb-2">Relevant Roles</div>{result.relevant_roles.map(r=><div key={r.id} className="flex justify-between text-sm border-b py-1"><span>{r.title} · {r.company}</span><span className="text-slate-500">{r.salary}</span></div>)}</div>
        </div> : <div className="text-sm text-slate-500 text-center py-16">Fill the profile and generate your path.</div>}
      </CardContent></Card>
    </div>
    {resources.length > 0 && (
      <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-blue-700" />Recommended Courses to Bridge Your Skill Gaps</CardTitle><CardDescription>Government (Skill India / PMKVY / MSSDS) · Private (Coursera, Udemy) · YouTube (free)</CardDescription></CardHeader>
        <CardContent className="space-y-6">
          {resources.map(r => (
            <div key={r.skill_id} className="border-t pt-4 first:border-0 first:pt-0">
              <div className="font-semibold mb-3 text-slate-900">{r.skill}</div>
              <ResourceList resources={r} />
            </div>
          ))}
        </CardContent>
      </Card>
    )}
  </div>)
}

const EmployerView = () => {
  const [industries, setIndustries] = useState([]); const [districts, setDistricts] = useState([]); const [skills, setSkills] = useState([]); const [subs, setSubs] = useState([])
  const [form, setForm] = useState({ company:'', industry:'', district:'', role:'', experience:'2-4 yrs', salary_min:'', salary_max:'', skills:[] })
  const { t, district } = useApp()
  useEffect(() => { Promise.all([api('industries'),api('districts'),api('skills'),api('employer-requirements')]).then(([i,d,s,e])=>{setIndustries(i);setDistricts(d);setSkills(s);setSubs(e);setForm(f=>({...f,industry:i[0]?.id,district:district!=='all'?district:d[0]?.id}))}) }, [])
  useEffect(() => { if (district!=='all') setForm(f=>({...f,district})) }, [district])
  const toggleSkill = (id) => setForm(f=>({...f,skills:f.skills.includes(id)?f.skills.filter(x=>x!==id):[...f.skills,id]}))
  const submit = async () => { try { await api('employer-requirements',{method:'POST',body:JSON.stringify(form)}); toast.success('Requirement submitted'); const rows=await api('employer-requirements'); setSubs(rows); setForm(f=>({...f,company:'',role:'',skills:[]})) } catch(e){toast.error(e.message)} }
  return (<div className="space-y-6">
    <div><h1 className="text-2xl font-bold">{t('Employer Skill Demand')}</h1><p className="text-sm text-slate-600 mt-1">{t('Submit hiring requirements — feeds statewide labour-market intelligence.')}</p></div>
    <div className="grid md:grid-cols-2 gap-4">
      <Card><CardHeader><CardTitle className="text-base">Post a Requirement</CardTitle></CardHeader><CardContent className="space-y-3">
        <div><Label>Company</Label><Input value={form.company} onChange={e=>setForm(f=>({...f,company:e.target.value}))} placeholder="e.g. Bharat Forge" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Industry</Label><Select value={form.industry} onValueChange={v=>setForm(f=>({...f,industry:v}))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{industries.map(i=><SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>District</Label><Select value={form.district} onValueChange={v=>setForm(f=>({...f,district:v}))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{districts.map(d=><SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <div><Label>Job Role</Label><Input value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} placeholder="e.g. CNC Programmer" /></div>
        <div className="grid grid-cols-3 gap-3">
          <div><Label>Experience</Label><Input value={form.experience} onChange={e=>setForm(f=>({...f,experience:e.target.value}))} /></div>
          <div><Label>Min (LPA)</Label><Input value={form.salary_min} onChange={e=>setForm(f=>({...f,salary_min:e.target.value}))} placeholder="4" /></div>
          <div><Label>Max (LPA)</Label><Input value={form.salary_max} onChange={e=>setForm(f=>({...f,salary_max:e.target.value}))} placeholder="8" /></div>
        </div>
        <div><Label>Required Skills</Label><div className="flex flex-wrap gap-1 mt-2 max-h-40 overflow-auto p-2 border rounded">{skills.map(s=><button key={s.id} type="button" onClick={()=>toggleSkill(s.id)} className={`text-xs px-2 py-1 rounded border ${form.skills.includes(s.id)?'bg-blue-600 text-white border-blue-600':'bg-white border-slate-200 hover:border-blue-400'}`}>{s.name}</button>)}</div></div>
        <Button onClick={submit}><Plus className="h-4 w-4 mr-2" />Submit Requirement</Button>
      </CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Recent Submissions</CardTitle></CardHeader><CardContent>
        {subs.length===0 && <div className="text-sm text-slate-500">No submissions yet.</div>}
        <div className="space-y-2">{subs.map(s=><div key={s.id} className="border rounded p-3">
          <div className="flex justify-between"><div className="font-semibold text-sm">{s.role||'Role'} · {s.company}</div><Badge variant="outline">{industries.find(i=>i.id===s.industry)?.name}</Badge></div>
          <div className="text-xs text-slate-500 mt-1">{districts.find(d=>d.id===s.district)?.name} · {s.experience} · ₹{s.salary_min}-{s.salary_max} LPA</div>
          <div className="flex flex-wrap gap-1 mt-2">{(s.skills||[]).map(id=><span key={id} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{skills.find(sk=>sk.id===id)?.name}</span>)}</div>
        </div>)}</div>
      </CardContent></Card>
    </div>
  </div>)
}

const ReportsView = () => {
  const { t } = useApp()
  const REPORTS = [
    { id:'skill-demand', title:'Skill Demand Report', desc:'Statewide skill demand across categories' },
    { id:'skill-gap', title:'Skill Gap Report', desc:'Demand vs coverage with priority' },
    { id:'curriculum', title:'Curriculum Alignment Report', desc:'Course-to-industry alignment scores' },
    { id:'emerging', title:'Emerging Skills Report', desc:'Skills to prioritise' },
    { id:'oversupply', title:'Oversupply Report', desc:'Where training exceeds demand' },
    { id:'district-training', title:'District Training Report', desc:'Per-district capacity & gaps' },
  ]
  const [active, setActive] = useState('skill-demand'); const [data, setData] = useState(null)
  useEffect(() => { setData(null); api(`reports/${active}`).then(setData) }, [active])
  const exportJson = () => { if (data) { downloadFile(`${active}-report.json`, data); toast.success('Report downloaded') } }
  const exportCsv = () => {
    if (!data?.rows?.length) return
    const keys = Object.keys(data.rows[0])
    const csv = [keys.join(','), ...data.rows.map(r => keys.map(k => { const v = r[k]; const s = Array.isArray(v)?v.join('; '):typeof v==='object'?JSON.stringify(v):String(v??''); return `"${s.replace(/"/g,'""')}"` }).join(','))].join('\n')
    downloadFile(`${active}-report.csv`, csv, 'text/csv'); toast.success('CSV downloaded')
  }
  return (<div className="space-y-6">
    <div className="flex justify-between items-start flex-wrap gap-3">
      <div><h1 className="text-2xl font-bold">{t('Reports')}</h1><p className="text-sm text-slate-600 mt-1">{t('Decision-support reports for planners.')}</p></div>
      <div className="flex gap-2"><Button variant="outline" onClick={exportCsv}><FileText className="h-4 w-4 mr-2" />Export CSV</Button><Button variant="outline" onClick={exportJson}><FileText className="h-4 w-4 mr-2" />Export JSON</Button></div>
    </div>
    <div className="grid md:grid-cols-3 gap-3">{REPORTS.map(r=><button key={r.id} onClick={()=>setActive(r.id)} className={`text-left border rounded-lg p-4 transition ${active===r.id?'border-blue-600 bg-blue-50':'border-slate-200 bg-white hover:border-blue-300'}`}><div className="font-semibold text-sm">{r.title}</div><div className="text-xs text-slate-600 mt-1">{r.desc}</div></button>)}</div>
    <Card><CardHeader><CardTitle className="text-base">{REPORTS.find(r=>r.id===active)?.title}</CardTitle>{data && <CardDescription>Generated: {new Date(data.generated_at).toLocaleString()}</CardDescription>}</CardHeader><CardContent>
      {!data ? <div className="grid place-items-center h-40"><Loader2 className="h-5 w-5 animate-spin text-slate-400" /></div> : <Table><TableHeader><TableRow>{Object.keys(data.rows[0]||{}).map(k=><TableHead key={k}>{k.replace(/_/g,' ')}</TableHead>)}</TableRow></TableHeader><TableBody>{data.rows.map((row,i)=><TableRow key={i}>{Object.values(row).map((v,j)=><TableCell key={j}>{Array.isArray(v)?v.join(', '):typeof v==='object'?JSON.stringify(v):String(v)}</TableCell>)}</TableRow>)}</TableBody></Table>}
    </CardContent></Card>
  </div>)
}

const RoleSelect = ({ role, onChange, className = '' }) => {
  const { t } = useApp()
  return (
    <Select value={role} onValueChange={onChange}>
      <SelectTrigger className={className} data-testid="role-select"><SelectValue /></SelectTrigger>
      <SelectContent>
        {Object.entries(ROLE_META).map(([id, m]) => <SelectItem key={id} value={id}>{t(m.title)}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}

// Language picker (used in header + welcome screen)
const LangSelect = ({ lang, onChange, dark = false }) => (
  <Select value={lang} onValueChange={onChange}>
    <SelectTrigger data-testid="lang-select" className={`h-8 w-[118px] text-xs gap-1 ${dark ? 'bg-slate-800 border-slate-700 text-slate-100' : ''}`}>
      <Globe className="h-3.5 w-3.5 shrink-0 opacity-70" /><SelectValue />
    </SelectTrigger>
    <SelectContent>{LANGS.map(l => <SelectItem key={l.id} value={l.id}>{l.label}</SelectItem>)}</SelectContent>
  </Select>
)

// Location / district picker (header)
const LocationSelect = ({ district, districts, onChange }) => {
  const { t } = useApp()
  return (
    <Select value={district} onValueChange={onChange}>
      <SelectTrigger data-testid="location-select" className="h-8 w-[170px] text-xs gap-1">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-700" /><SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('All Maharashtra')}</SelectItem>
        {districts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}

const SettingsView = ({ role, onRoleChange }) => {
  const { t } = useApp()
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">{t('Settings')}</h1><p className="text-sm text-slate-600 mt-1">{t('Platform configuration.')}</p></div>
      <Card><CardHeader><CardTitle className="text-base">{t('View as')}</CardTitle><CardDescription>{t('Switch role to see the modules available to each stakeholder.')}</CardDescription></CardHeader><CardContent className="space-y-3 text-sm">
        <div className="max-w-xs"><Label>{t('Role')}</Label><RoleSelect role={role} onChange={onRoleChange} /></div>
        <div className="flex justify-between border-b pb-2 pt-2"><span className="text-slate-500">{t('Access')}</span><Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{t('Open · No sign-in required')}</Badge></div>
        <div className="flex justify-between"><span className="text-slate-500">{t('Database')}</span><Badge variant="outline">MongoDB</Badge></div>
      </CardContent></Card>
    </div>
  )
}

// ---------- Welcome / role selection (first screen) ----------
const HERO_IMG = 'https://images.unsplash.com/photo-1690356107685-3725367f6f3f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxza2lsbCUyMHRyYWluaW5nJTIwd29ya3Nob3B8ZW58MHx8fHwxNzg4NjA2MDc5fDA&ixlib=rb-4.1.0&q=85&w=1400'
const ROLE_CARDS = [
  { id: 'student',   label: 'Student',              desc: 'Find in-demand skills, build your career path & get courses', ring: 'hover:border-violet-500 hover:bg-violet-50', iconBg: 'bg-violet-100 text-violet-700' },
  { id: 'gov',       label: 'Government',           desc: 'State-wide labour-market intelligence & district planning',  ring: 'hover:border-blue-600 hover:bg-blue-50',     iconBg: 'bg-blue-100 text-blue-700' },
  { id: 'institute', label: 'Training Institute',   desc: 'Align courses with industry demand & close skill gaps',      ring: 'hover:border-emerald-600 hover:bg-emerald-50', iconBg: 'bg-emerald-100 text-emerald-700' },
  { id: 'employer',  label: 'Employer / Industry',  desc: 'Post skill requirements & analyse job descriptions with AI', ring: 'hover:border-amber-500 hover:bg-amber-50',   iconBg: 'bg-amber-100 text-amber-700' },
]

const WelcomeScreen = ({ onSelect, lang, onLang }) => {
  const { t } = useApp()
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col" data-testid="welcome-screen">
      {/* Govt strip */}
      <div className="bg-slate-900 text-slate-200 text-xs">
        <div className="max-w-5xl mx-auto px-4 h-11 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2"><span className="inline-block h-3 w-5 rounded-[2px] bg-gradient-to-b from-orange-500 via-white to-green-600" /><span>महाराष्ट्र शासन | Government of Maharashtra</span></div>
          <div className="flex items-center gap-3"><span className="hidden sm:inline">Smart India Hackathon · SIH26134</span><LangSelect lang={lang} onChange={onLang} dark /></div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-3xl overflow-hidden border-slate-200 shadow-xl">
          <div className="relative h-44 sm:h-56">
            <img src={HERO_IMG} alt="Skill training in Maharashtra" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
            <div className="absolute bottom-3 left-4 sm:left-6 flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-white p-1 grid place-items-center overflow-hidden shadow"><img src="/logo.jpeg" alt="SkillSync" className="h-full w-full object-contain" /></div>
              <div className="text-white"><div className="text-lg font-bold leading-tight">SkillSync Maharashtra</div><div className="text-[11px] opacity-90">कौशल्य विकास · {t('Skill Development Platform')}</div></div>
            </div>
          </div>

          <CardContent className="p-5 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900 leading-tight">{t('Bridging Industry Demand')}<br className="hidden sm:block" /> {t('with Future-Ready Skills.')}</h1>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">{t('AI-powered labour-market intelligence for Maharashtra. Discover in-demand skills, close curriculum gaps and plan careers — district by district.')}</p>

            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{t('Continue as')}</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {ROLE_CARDS.map(c => { const Icon = ROLE_META[c.id].icon; return (
                  <button key={c.id} onClick={() => onSelect(c.id)} data-testid={`role-card-${c.id}`}
                    className={`group text-left flex items-start gap-3 p-4 rounded-xl border-2 border-slate-200 bg-white transition ${c.ring}`}>
                    <div className={`h-11 w-11 shrink-0 rounded-full grid place-items-center ${c.iconBg}`}><Icon className="h-5 w-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 flex items-center gap-1">{t(c.label)}<ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition" /></div>
                      <div className="text-xs text-slate-600 mt-0.5 leading-snug">{t(c.desc)}</div>
                    </div>
                  </button>
                )})}
              </div>
            </div>

            <p className="mt-6 text-[11px] text-slate-500 text-center">{t('Prototype · No sign-in required · You can switch role anytime from the sidebar')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ---------- Root ----------
const ROLE_KEY = 'skillsync_role', LANG_KEY = 'skillsync_lang', DIST_KEY = 'skillsync_district'
const App = () => {
  const [role, setRoleState] = useState(null)
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState('dashboard')
  const [lang, setLangState] = useState('en')
  const [district, setDistrictState] = useState('all')
  const [districts, setDistricts] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ROLE_KEY); if (saved && ROLE_META[saved]) setRoleState(saved)
      const l = localStorage.getItem(LANG_KEY); if (l && LANGS.find(x => x.id === l)) setLangState(l)
      const d = localStorage.getItem(DIST_KEY); if (d) setDistrictState(d)
    } catch {}
    setReady(true)
    api('districts').then(setDistricts).catch(() => {})
  }, [])

  const t = (k) => translate(lang, k)
  const districtName = district === 'all' ? t('All Maharashtra') : (districts.find(d => d.id === district)?.name || district)
  const ctx = { lang, t, district, districts, districtName }

  const setLang = (l) => { setLangState(l); try { localStorage.setItem(LANG_KEY, l) } catch {} }
  const setDistrict = (d) => { setDistrictState(d); try { localStorage.setItem(DIST_KEY, d) } catch {}; toast.success(`${t('Location')}: ${d === 'all' ? t('All Maharashtra') : (districts.find(x => x.id === d)?.name || d)}`) }

  const setRole = (r) => {
    setRoleState(r)
    try { localStorage.setItem(ROLE_KEY, r) } catch {}
    if (!NAV.find(n => n.id === active)?.roles.includes(r)) setActive('dashboard')
    toast.success(`${t('Welcome')}, ${t(ROLE_META[r]?.title)}`)
  }
  const changeRole = () => { setRoleState(null); setActive('dashboard'); try { localStorage.removeItem(ROLE_KEY) } catch {} }

  if (!ready) return <div className="min-h-screen grid place-items-center bg-slate-50"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>
  if (!role) return <AppCtx.Provider value={ctx}><WelcomeScreen onSelect={setRole} lang={lang} onLang={setLang} /></AppCtx.Provider>

  const navItems = NAV.filter(n => n.roles.includes(role))
  const idx = Math.max(0, navItems.findIndex(n => n.id === active))
  const goPrev = () => setActive(navItems[(idx - 1 + navItems.length) % navItems.length].id)
  const goNext = () => setActive(navItems[(idx + 1) % navItems.length].id)
  const current = navItems[idx] || navItems[0]

  const view = (() => {
    switch (active) {
      case 'dashboard': return <DashboardView />
      case 'lmi': return <LMIView />
      case 'job-analyzer': return <JobAnalyzerView />
      case 'course-alignment': return <CourseAlignmentView />
      case 'skill-gap': return <SkillGapView />
      case 'district': return <DistrictView />
      case 'student': return <StudentView />
      case 'employer': return <EmployerView />
      case 'reports': return <ReportsView />
      case 'settings': return <SettingsView role={role} onRoleChange={setRole} />
      default: return <DashboardView />
    }
  })()
  const RoleIcon = ROLE_META[role]?.icon || Shield

  return (
    <AppCtx.Provider value={ctx}>
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="h-11 w-11 rounded-md bg-white p-0.5 grid place-items-center overflow-hidden"><img src="/logo.jpeg" alt="SkillSync" className="h-full w-full object-contain" /></div>
          <div><div className="font-bold leading-tight">SkillSync</div><div className="text-[10px] uppercase tracking-widest text-slate-400">Maharashtra</div></div>
        </div>
        <nav className="p-3 flex-1 overflow-y-auto">
          {navItems.map(n => (
            <button key={n.id} onClick={() => setActive(n.id)} data-testid={`nav-${n.id}`} className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-1 transition ${active===n.id?'bg-blue-600 text-white':'text-slate-300 hover:bg-slate-800'}`}>
              <n.icon className="h-4 w-4" /><span className="flex-1">{t(n.label)}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800 text-xs text-slate-400">
          <div className="mb-2 flex items-center gap-2"><RoleIcon className="h-4 w-4" /><span>{t('Viewing as')}</span></div>
          <RoleSelect role={role} onChange={setRole} className="h-8 bg-slate-800 border-slate-700 text-slate-100 text-xs" />
          <button onClick={changeRole} data-testid="change-role-btn" className="mt-2 w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-800"><LogOut className="h-3.5 w-3.5" />{t('Back to start')}</button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3">
          {/* Left: Home + Prev/Next + current module */}
          <div className="flex items-center gap-1">
            <Button variant={active==='dashboard'?'default':'ghost'} size="sm" className="h-8 gap-1.5" onClick={() => setActive('dashboard')} data-testid="home-btn" title={t('Home')}><Home className="h-4 w-4" /><span className="hidden lg:inline">{t('Home')}</span></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={goPrev} data-testid="prev-btn" title={t('Previous')}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={goNext} data-testid="next-btn" title={t('Next')}><ChevronRight className="h-4 w-4" /></Button>
            <div className="ml-2 hidden md:flex items-center gap-2 text-sm text-slate-600">
              <current.icon className="h-4 w-4 text-blue-700" /><span className="font-semibold text-slate-900" data-testid="current-module">{t(current.label)}</span>
              <span className="text-slate-400 text-xs">{idx + 1}/{navItems.length}</span>
            </div>
          </div>
          <div className="flex-1" />
          {/* Right: Location + Language + badge */}
          <div className="flex items-center gap-2">
            <LocationSelect district={district} districts={districts} onChange={setDistrict} />
            <LangSelect lang={lang} onChange={setLang} />
            <Badge className="hidden xl:inline-flex bg-blue-100 text-blue-700 hover:bg-blue-100">{t('Open Access · Demo')}</Badge>
          </div>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">{view}</div>
      </main>
    </div>
    </AppCtx.Provider>
  )
}

export default App
