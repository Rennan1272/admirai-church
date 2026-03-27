import { useState } from 'react'
import LoginScreen  from './components/LoginScreen.jsx'
import TopBar       from './components/TopBar.jsx'
import BottomNav    from './components/BottomNav.jsx'
import FeedTab       from './tabs/FeedTab.jsx'
import CalendarTab   from './tabs/CalendarTab.jsx'
import FundraisingTab from './tabs/FundraisingTab.jsx'
import CanteenTab    from './tabs/CanteenTab.jsx'
import ScheduleTab   from './tabs/ScheduleTab.jsx'
import AdminTab      from './tabs/AdminTab.jsx'
import {
  INITIAL_USERS,
  INITIAL_POSTS,
  INITIAL_FUNDRAISING,
  INITIAL_SCHEDULES,
} from './data/initialData.js'
import { hasScheduleAccess } from './utils/helpers.js'
import s from './App.module.css'

export default function App() {
  const [user, setUser]               = useState(null)
  const [tab, setTab]                 = useState('feed')
  const [posts, setPosts]             = useState(INITIAL_POSTS)
  const [fundraising, setFundraising] = useState(INITIAL_FUNDRAISING)
  const [schedules, setSchedules]     = useState(INITIAL_SCHEDULES)
  const [users, setUsers]             = useState(INITIAL_USERS)

  if (!user) return <LoginScreen onLogin={(u) => { setUser(u); setTab('feed') }} />

  return (
    <div className={s.app}>
      <TopBar user={user} onLogout={() => setUser(null)} />

      <main className={s.main}>
        {tab === 'feed'        && <FeedTab user={user} posts={posts} setPosts={setPosts} />}
        {tab === 'calendar'    && <CalendarTab />}
        {tab === 'fundraising' && (
          <FundraisingTab user={user} fundraising={fundraising} setFundraising={setFundraising} />
        )}
        {tab === 'canteen'     && <CanteenTab />}
        {tab === 'schedule'    && hasScheduleAccess(user.role) && (
          <ScheduleTab user={user} schedules={schedules} setSchedules={setSchedules} />
        )}
        {tab === 'admin'       && user.role === 'pastor' && (
          <AdminTab users={users} setUsers={setUsers} />
        )}
      </main>

      <BottomNav tab={tab} setTab={setTab} user={user} />
    </div>
  )
}
