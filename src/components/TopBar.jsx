import { useState } from 'react'
import Logo from './Logo.jsx'
import { ROLE_LABELS } from '../data/initialData.js'
import { initials } from '../utils/helpers.js'
import s from './TopBar.module.css'

export default function TopBar({ user, onLogout }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={s.bar}>
      <div className={s.brand}>
        <Logo size={26} />
        <span>ADMIRAI</span>
      </div>

      <div className={s.profileWrap}>
        <button className={s.profileBtn} onClick={() => setOpen(!open)}>
          <div className={s.avatar}>{initials(user.name)}</div>
          <div className={s.info}>
            <span className={s.name}>{user.name.split(' ')[0]}</span>
            <span className={s.role}>{ROLE_LABELS[user.role]}</span>
          </div>
        </button>

        {open && (
          <div className={s.dropdown}>
            <div className={s.ddHeader}>
              <div className={s.ddName}>{user.name}</div>
              <div className={s.ddRole}>{ROLE_LABELS[user.role]}</div>
            </div>
            <button className={s.logoutBtn} onClick={() => { setOpen(false); onLogout() }}>
              🚪 Sair
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
