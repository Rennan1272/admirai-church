import { useState } from 'react'
import { canAccess } from '../utils/helpers.js'
import { fmtDate } from '../utils/helpers.js'
import s from './FundraisingTab.module.css'

const PIX_ACCOUNTS = [
  { label: 'PIX DA IGREJA',   key: 'igreja@admirai.com.br',  desc: 'Para dízimos e ofertas gerais' },
  { label: 'PIX DAS MISSÕES', key: 'missoes@admirai.com.br', desc: 'Para arrecadações missionárias' },
]

export default function FundraisingTab({ user, fundraising, setFundraising }) {
  const [tab, setTab]     = useState('campanhas')
  const [copied, setCopied] = useState({})
  const [form, setForm]   = useState({ theme: '', goal: '', pix: '', expires: '', objective: '' })

  const canCreate = canAccess(user.role, 'create_fundraising')

  const handleCopy = (key, id) => {
    try { navigator.clipboard.writeText(key) } catch (_) {}
    setCopied((prev) => ({ ...prev, [id]: true }))
    setTimeout(() => setCopied((prev) => ({ ...prev, [id]: false })), 2000)
  }

  const createCampaign = () => {
    if (!form.theme || !form.goal || !form.pix) return
    setFundraising([
      ...fundraising,
      {
        id: Date.now(),
        theme: form.theme,
        goal: parseFloat(form.goal),
        raised: 0,
        pix: form.pix,
        expires: form.expires,
        objective: form.objective,
      },
    ])
    setForm({ theme: '', goal: '', pix: '', expires: '', objective: '' })
    setTab('campanhas')
  }

  return (
    <div className={s.wrap}>
      {/* Tab bar */}
      <div className={s.tabBar}>
        {[['campanhas', 'CAMPANHAS'], ['pix', 'PIX DA IGREJA']].map(([k, l]) => (
          <button
            key={k}
            className={`${s.tabBtn} ${tab === k ? s.active : ''}`}
            onClick={() => setTab(k)}
          >{l}</button>
        ))}
        {canCreate && (
          <button
            className={`${s.tabBtn} ${tab === 'criar' ? s.activeOrange : s.orange}`}
            onClick={() => setTab('criar')}
            style={{ marginLeft: 'auto' }}
          >+ CRIAR</button>
        )}
      </div>

      <div className={s.content}>
        {/* Campanhas */}
        {tab === 'campanhas' && (
          <>
            <h3 className={s.sectionLabel}>ARRECADAÇÕES ATIVAS</h3>
            {fundraising.map((f) => {
              const pct = Math.min(100, Math.round((f.raised / f.goal) * 100))
              return (
                <div key={f.id} className={s.card}>
                  <div className={s.cardTop}>
                    <h4 className={s.cardTitle}>{f.theme}</h4>
                    <span className={s.pct}>{pct}%</span>
                  </div>
                  {f.objective && <p className={s.objective}>{f.objective}</p>}
                  <div className={s.progressTrack}>
                    <div className={s.progressFill} style={{ width: `${pct}%` }} />
                  </div>
                  <div className={s.statsRow}>
                    <span className={s.stat}>Arrecadado: <b>R$ {f.raised.toLocaleString('pt-BR')}</b></span>
                    <span className={s.stat}>Meta: <b>R$ {f.goal.toLocaleString('pt-BR')}</b></span>
                  </div>
                  {f.expires && (
                    <div className={s.expires}>⏱ Expira em: {fmtDate(f.expires)}</div>
                  )}
                  <div className={s.pixBox}>
                    <p className={s.pixLabel}>PIX DESTA CAMPANHA</p>
                    <div className={s.pixRow}>
                      <code className={s.pixKey}>{f.pix}</code>
                      <button
                        className={s.btnCopy}
                        onClick={() => handleCopy(f.pix, f.id)}
                      >
                        {copied[f.id] ? 'COPIADO!' : 'COPIAR'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}

        {/* PIX */}
        {tab === 'pix' && (
          <>
            <h3 className={s.sectionLabel}>PIX PARA OFERTAS</h3>
            {PIX_ACCOUNTS.map((p) => (
              <div key={p.label} className={s.card}>
                <p className={s.pixTitle}>{p.label}</p>
                <p className={s.pixDesc}>{p.desc}</p>
                <div className={s.pixValueRow}>
                  <code className={s.pixValLg}>{p.key}</code>
                  <button
                    className={s.btnCopyLg}
                    onClick={() => handleCopy(p.key, p.label)}
                  >
                    📋 {copied[p.label] ? 'COPIADO!' : 'COPIAR'}
                  </button>
                </div>
                <p className={s.pixHint}>Toque em COPIAR e cole no seu banco</p>
              </div>
            ))}
          </>
        )}

        {/* Criar campanha */}
        {tab === 'criar' && canCreate && (
          <>
            <h3 className={s.sectionLabel}>NOVA CAMPANHA DE ARRECADAÇÃO</h3>
            {[
              { label: 'TEMA DA CAMPANHA', key: 'theme', placeholder: 'Ex: Missão na África' },
              { label: 'VALOR DA META (R$)', key: 'goal', placeholder: 'Ex: 10000', type: 'number' },
              { label: 'PIX (chave)', key: 'pix', placeholder: 'Ex: missoes@igreja.com.br' },
              { label: 'DATA DE EXPIRAÇÃO', key: 'expires', type: 'date' },
            ].map((field) => (
              <div key={field.key} className={s.formField}>
                <label className={s.formLabel}>{field.label}</label>
                <input
                  className={s.formInput}
                  type={field.type || 'text'}
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder || ''}
                />
              </div>
            ))}
            <div className={s.formField}>
              <label className={s.formLabel}>OBJETIVO DA CAMPANHA</label>
              <textarea
                className={s.formTextarea}
                value={form.objective}
                onChange={(e) => setForm({ ...form, objective: e.target.value })}
                placeholder="Descreva o objetivo desta arrecadação..."
              />
            </div>
            <button className={s.btnSubmit} onClick={createCampaign}>CRIAR CAMPANHA</button>
          </>
        )}
      </div>
    </div>
  )
}
