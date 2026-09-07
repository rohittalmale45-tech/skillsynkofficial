// Curated learning-resource generator for every skill.
// Government sources: Skill India Digital / NSDC / PMKVY / MSSDS (Maharashtra).
// Private sources: Coursera / Udemy / Simplilearn / edX.
// YouTube: direct search URL.

const enc = (s) => encodeURIComponent(s)

// Special curated overrides (channel-specific / MOOC-specific)
const CURATED = {
  python: {
    youtube: [
      { title: 'Python for Beginners — CodeWithHarry (Hindi)', url: 'https://www.youtube.com/playlist?list=PLu0W_9lII9agwh1XjRt242xIpHhPT2llg' },
      { title: 'freeCodeCamp — Python Full Course', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw' },
    ],
  },
  plc: {
    youtube: [
      { title: 'RealPars — PLC Programming Basics', url: 'https://www.youtube.com/watch?v=xW6XW9zJZ_o' },
      { title: 'Learn PLC Programming (Hindi)', url: 'https://www.youtube.com/results?search_query=plc+programming+hindi' },
    ],
  },
  cnc: {
    youtube: [
      { title: 'CNC Programming Full Course', url: 'https://www.youtube.com/results?search_query=cnc+programming+full+course' },
      { title: 'G-code & M-code Tutorial', url: 'https://www.youtube.com/results?search_query=g+code+m+code+cnc+tutorial' },
    ],
  },
  react: {
    youtube: [
      { title: 'React JS Full Course — CodeWithHarry', url: 'https://www.youtube.com/playlist?list=PLu0W_9lII9ahR1blWXxgSlL4y9iQBnLpR' },
      { title: 'Scrimba React Bootcamp', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8' },
    ],
  },
  'solar-pv': {
    youtube: [
      { title: 'Solar PV Installation — Suryamitra', url: 'https://www.youtube.com/results?search_query=solar+pv+installation+suryamitra' },
    ],
  },
  gmp: {
    youtube: [
      { title: 'GMP for Pharma Beginners', url: 'https://www.youtube.com/results?search_query=gmp+pharma+training' },
    ],
  },
}

export function resourcesForSkill(skill) {
  const name = skill.name || skill
  const id = (skill.id || '').toLowerCase()
  const q = enc(name)

  const government = [
    { provider: 'Skill India Digital (NSDC)', title: `${name} — Government-recognised courses`, url: `https://www.skillindiadigital.gov.in/home?search=${q}`, badge: 'Govt' },
    { provider: 'PMKVY 4.0', title: `${name} training under Pradhan Mantri Kaushal Vikas Yojana`, url: `https://www.pmkvyofficial.org/#!/home`, badge: 'PMKVY' },
    { provider: 'MSSDS (Maharashtra)', title: `${name} — Maharashtra State Skill Development Society`, url: `https://kaushalya.mahaswayam.gov.in/`, badge: 'MSSDS' },
  ]
  const priv = [
    { provider: 'Coursera', title: `${name} — Coursera courses & specialisations`, url: `https://www.coursera.org/search?query=${q}`, badge: 'MOOC' },
    { provider: 'Udemy', title: `${name} — Udemy courses`, url: `https://www.udemy.com/courses/search/?q=${q}`, badge: 'MOOC' },
    { provider: 'Simplilearn', title: `${name} — Simplilearn`, url: `https://www.simplilearn.com/search?tag=${q}`, badge: 'Training' },
  ]
  const yt = (CURATED[id]?.youtube || []).slice()
  yt.push({ title: `Search: "${name} tutorial" on YouTube`, url: `https://www.youtube.com/results?search_query=${enc(name + ' tutorial')}` })
  yt.push({ title: `Hindi tutorials: ${name}`, url: `https://www.youtube.com/results?search_query=${enc(name + ' tutorial hindi')}` })

  return { skill_id: id, skill: name, government, private: priv, youtube: yt }
}
