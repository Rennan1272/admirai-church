import { useState } from 'react'
import { ROLE_LABELS } from '../data/initialData.js'
import { initials } from '../utils/helpers.js'
import s from './FeedTab.module.css'

const TAG_COLORS = { Missões: '#FF8C00', Culto: '#fff', Louvor: '#aaa', Infantil: '#ddd', Post: '#666' }

export default function FeedTab({ user, posts, setPosts }) {
  const [newText, setNewText]   = useState('')
  const [showNew, setShowNew]   = useState(false)
  const [liked, setLiked]       = useState({})

  const handlePost = () => {
    if (!newText.trim()) return
    setPosts([
      {
        id: Date.now(),
        author: user.name,
        role: user.role,
        av: initials(user.name),
        time: 'agora',
        text: newText,
        likes: 0,
        comments: 0,
        tag: 'Post',
      },
      ...posts,
    ])
    setNewText('')
    setShowNew(false)
  }

  const toggleLike = (id) => {
    const isLiked = liked[id]
    setLiked((prev) => ({ ...prev, [id]: !isLiked }))
    setPosts((ps) =>
      ps.map((p) => (p.id === id ? { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 } : p))
    )
  }

  return (
    <div className={s.wrap}>
      {/* Page header */}
      <div className={s.pageHeader}>
        <span className={s.pageTitle}>INÍCIO</span>
        <button className={s.btnNew} onClick={() => setShowNew(!showNew)}>+ POST</button>
      </div>

      {/* New post composer */}
      {showNew && (
        <div className={s.composer}>
          <div className={s.composerTop}>
            <div className={s.avatarLg}>{initials(user.name)}</div>
            <div>
              <div className={s.composerName}>{user.name}</div>
              <div className={s.composerRole}>{ROLE_LABELS[user.role]}</div>
            </div>
          </div>
          <textarea
            className={s.textarea}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Compartilhe algo com a igreja..."
          />
          <div className={s.composerActions}>
            <button className={s.btnPublish} onClick={handlePost}>Publicar</button>
            <button className={s.btnCancel} onClick={() => setShowNew(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Posts */}
      {posts.map((post) => {
        const isLiked = liked[post.id]
        const tagColor = TAG_COLORS[post.tag] || '#888'
        return (
          <div key={post.id} className={s.postCard}>
            <div className={s.postTop}>
              <div className={s.avatarLg}>{post.av || initials(post.author)}</div>
              <div style={{ flex: 1 }}>
                <div className={s.postAuthorRow}>
                  <span className={s.postAuthor}>{post.author}</span>
                  <span className={s.tag} style={{ color: tagColor, borderColor: tagColor }}>{post.tag}</span>
                </div>
                <span className={s.postMeta}>{ROLE_LABELS[post.role] || post.role} · {post.time}</span>
              </div>
            </div>
            <p className={s.postText}>{post.text}</p>
            <div className={s.postFooter}>
              <button
                className={`${s.actionBtn} ${isLiked ? s.liked : ''}`}
                onClick={() => toggleLike(post.id)}
              >
                <span>{isLiked ? '❤️' : '🤍'}</span> {post.likes}
              </button>
              <button className={s.actionBtn}><span>💬</span> {post.comments}</button>
              <button className={s.actionBtn}><span>↗</span></button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
