import { useState } from 'react'
import { CALENDAR_EVENTS, MONTHS, DAYS_SHORT, TYPE_ICONS } from '../data/initialData.js'
import s from './CalendarTab.module.css'
import { fmtDate } from '../utils/helpers.js'

export default function CalendarTab() {
  const [month, setMonth] = useState(3)
  const [year, setYear]   = useState(2025)

  const changeMonth = (dir) => {
    let m = month + dir
    let y = year
    if (m < 0)  { m = 11; y-- }
    if (m > 11) { m = 0;  y++ }
    setMonth(m); setYear(y)
  }

  const firstDay     = new Date(year, month, 1).getDay()
  const daysInMonth  = new Date(year, month + 1, 0).getDate()
  const monthEvents  = CALENDAR_EVENTS.filter((e) => {
    const d = new Date(e.date)
    return d.getFullYear() === year && d.getMonth() === month
  })

  const byDay = {}
  monthEvents.forEach((e) => {
    const d = new Date(e.date).getDate()
    if (!byDay[d]) byDay[d] = []
    byDay[d].push(e)
  })

  const typeColors = { culto: '#fff', oracao: '#aaa', infantil: '#ccc', cantina: '#FF8C00', evento: '#888' }

  return (
    <div className={s.wrap}>
      {/* Calendar header */}
      <div className={s.calHeader}>
        <div className={s.calNav}>
          <button className={s.arrow} onClick={() => changeMonth(-1)}>‹</button>
          <span className={s.monthLabel}>{MONTHS[month]} {year}</span>
          <button className={s.arrow} onClick={() => changeMonth(1)}>›</button>
        </div>

        {/* Day names */}
        <div className={s.grid}>
          {DAYS_SHORT.map((d) => (
            <div key={d} className={s.dayLabel}>{d}</div>
          ))}

          {/* Empty cells */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e${i}`} />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const evs = byDay[day]
            return (
              <div key={day} className={`${s.cell} ${evs ? s.hasEvents : ''}`}>
                <span className={`${s.dayNum} ${evs ? s.active : ''}`}>{day}</span>
                {evs && (
                  <span className={s.dots}>
                    {evs.map((e) => TYPE_ICONS[e.type] || '•').join('')}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Events list */}
      <div className={s.evList}>
        <h3 className={s.sectionLabel}>PROGRAMAÇÃO — {MONTHS[month].toUpperCase()}</h3>
        {monthEvents.length === 0 && (
          <p className={s.empty}>Nenhum evento neste mês.</p>
        )}
        {monthEvents.map((ev, i) => {
          const d = new Date(ev.date)
          return (
            <div key={i} className={s.eventRow}>
              <div className={s.dateBox}>
                <span className={s.evDay}>{d.getDate()}</span>
                <span className={s.evWd}>{DAYS_SHORT[d.getDay()]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div className={s.evTitle}>
                  <span>{TYPE_ICONS[ev.type] || ''}</span> {ev.title}
                </div>
                <div className={s.evTime}>🕐 {ev.time}</div>
              </div>
              <span
                className={s.evBadge}
                style={{ color: typeColors[ev.type] || '#888', borderColor: typeColors[ev.type] || '#444' }}
              >
                {ev.type}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
