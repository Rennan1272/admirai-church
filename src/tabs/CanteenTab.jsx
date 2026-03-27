import { CANTEEN_ITEMS, MONTHS } from '../data/initialData.js'
import { fmtDate } from '../utils/helpers.js'
import s from './CanteenTab.module.css'

export default function CanteenTab() {
  return (
    <div className={s.wrap}>
      <h3 className={s.sectionLabel}>CANTINA — PRÓXIMOS EVENTOS</h3>

      {CANTEEN_ITEMS.map((item) => {
        const d   = new Date(item.date)
        const mon = MONTHS[d.getMonth()].slice(0, 3).toUpperCase()
        return (
          <div key={item.id} className={s.card}>
            <div className={s.dateBox}>
              <span className={s.day}>{d.getDate()}</span>
              <span className={s.month}>{mon}</span>
            </div>
            <div className={s.info}>
              <div className={s.nameRow}>
                <span className={s.name}>{item.name}</span>
                <span className={s.price}>{item.price}</span>
              </div>
              <p className={s.desc}>{item.desc}</p>
              <span className={s.date}>📅 {fmtDate(item.date)}</span>
            </div>
          </div>
        )
      })}

      <div className={s.notice}>
        🔔 Você receberá notificações sobre novos itens da cantina.
      </div>
    </div>
  )
}
