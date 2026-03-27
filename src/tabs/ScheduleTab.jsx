import { useState } from 'react'
import { SCHED_TABS_BY_ROLE, TYPE_LABELS } from '../data/initialData.js'
import { canAccess, fmtDate } from '../utils/helpers.js'
import s from './ScheduleTab.module.css'

export default function ScheduleTab({ user, schedules, setSchedules }) {
  const tabs = SCHED_TABS_BY_ROLE[user.role] || []
  const [active, setActive]       = useState(tabs[0]?.[0] || 'musicos')
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState({ name: '', dates: '', type: '' })

  const canCreate = canAccess(user.role, 'create_schedule')

  if (!tabs.length) {
    return (
      <div className={s.empty}>
        <p>Você não tem escalas disponíveis.</p>
      </div>
    )
  }

  const entries = schedules[active] || []
  const visible = entries.filter(
    (e) => e.name === user.name || canCreate
  )

  const showType  = active === 'obreiros' || active === 'circulo'
  const typeOpts  =
    active === 'obreiros'
      ? [['portaria', 'Portaria'], ['santa_ceia', 'Santa Ceia']]
      : active === 'circulo'
      ? [['segunda', 'Segunda-Feira'], ['domingo', 'Domingo']]
      : []

  const handleAdd = () => {
    if (!form.name) return
    const dates = form.dates.split(',').map((d) => d.trim()).filter(Boolean)
    if (!dates.length) return
    const entry = { id: Date.now(), name: form.name, dates, ...(form.type ? { type: form.type } : {}) }
    setSchedules((prev) => ({ ...prev, [active]: [...(prev[active] || []), entry] }))
    setForm({ name: '', dates: '', type: '' })
    setShowForm(false)
  }

  return (
    <div className={s.wrap}>
      {/* Sub-tabs */}
      <div className={s.subTabs}>
        {tabs.map(([key, label]) => (
          <button
            key={key}
            className={`${s.subTab} ${active === key ? s.active : ''}`}
            onClick={() => { setActive(key); setShowForm(false) }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={s.content}>
        <div className={s.contentHeader}>
          <h3 className={s.sectionLabel}>ESCALA DO MÊS</h3>
          {canCreate && (
            <button className={s.btnAdd} onClick={() => setShowForm(!showForm)}>
              + ADICIONAR
            </button>
          )}
        </div>

        {/* Add form */}
        {showForm && canCreate && (
          <div className={s.form}>
            <div className={s.formField}>
              <label className={s.formLabel}>NOME DO MEMBRO</label>
              <input
                className={s.formInput}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nome completo"
              />
            </div>
            <div className={s.formField}>
              <label className={s.formLabel}>DATAS (YYYY-MM-DD, separadas por vírgula)</label>
              <input
                className={s.formInput}
                value={form.dates}
                onChange={(e) => setForm({ ...form, dates: e.target.value })}
                placeholder="2025-04-06, 2025-04-13"
              />
            </div>
            {showType && (
              <div className={s.formField}>
                <label className={s.formLabel}>TIPO</label>
                <select
                  className={s.formInput}
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  {typeOpts.map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
            )}
            <div className={s.formActions}>
              <button className={s.btnSave} onClick={handleAdd}>Salvar</button>
              <button className={s.btnCancel} onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </div>
        )}

        {/* Schedule entries */}
        {visible.length === 0 ? (
          <div className={s.emptyMsg}><p>Nenhuma escala cadastrada.</p></div>
        ) : (
          visible.map((entry, i) => (
            <div key={i} className={s.card}>
              <div className={s.cardHeader}>
                <span className={s.memberName}>{entry.name}</span>
                {entry.type && (
                  <span className={s.badge}>{TYPE_LABELS[entry.type] || entry.type}</span>
                )}
                {entry.role && (
                  <span className={s.badge}>{entry.role}</span>
                )}
              </div>
              <div className={s.dates}>
                {entry.dates.map((d) => (
                  <span key={d} className={s.datePill}>📅 {fmtDate(d)}</span>
                ))}
              </div>
              {entry.name === user.name && (
                <div className={s.myNote}>✓ Você está escalado nestas datas</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
