import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { api } from '../api'

export default function LoginPage() {
  const { t, lang, setLang, dark, setDark, setUser } = useApp()
  const [email, setEmail] = useState('student@guideme.app')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.login({ email, password })
      setUser(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell cinematic-bg">
      <div className="auth-top-controls">
        <button className="ghost-btn" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>
          {lang === 'ar' ? 'EN' : 'AR'}
        </button>
        <button className="ghost-btn" onClick={() => setDark(!dark)}>
          {dark ? '☀️' : '🌙'}
        </button>
      </div>

      <form className="auth-card card reveal reveal-up" onSubmit={handleLogin}>
        <section className="auth-showcase sweep-light">
          <div>
            <div className="auth-brand-row">
              <div className="auth-brand-chip">GUIDE ME</div>
              <div className="auth-brand-chip">{lang === 'ar' ? 'الطالب أولاً' : 'Student First'}</div>
            </div>

            <div style={{ marginTop: 28 }}>
              <div className="auth-kicker">{lang === 'ar' ? 'منصة تعليمية فاخرة' : 'Luxury education platform'}</div>
              <h1>{lang === 'ar' ? <>تعلم<br />بأسلوب أرقى</> : <>Learn<br />with a richer feel</>}</h1>
              <p>
                {lang === 'ar'
                  ? 'واجهة راقية للحجز، متابعة الجلسات، وإدارة تجربة الطالب والمعلم ضمن نظام واحد أنيق وسهل العرض على الممولين أو المطورين.'
                  : 'A polished environment for booking, session tracking, and student-teacher management inside one elegant system ready to show to funders and developers.'}
              </p>
            </div>

            <div className="auth-metrics">
              <div className="auth-metric">
                <strong>45m</strong>
                <span>{lang === 'ar' ? 'مدة الجلسة الخاصة' : 'Private lesson duration'}</span>
              </div>
              <div className="auth-metric">
                <strong>AR/EN</strong>
                <span>{lang === 'ar' ? 'تبديل فوري للغة' : 'Instant bilingual UI'}</span>
              </div>
              <div className="auth-metric">
                <strong>24/7</strong>
                <span>{lang === 'ar' ? 'وصول مرن' : 'Flexible access'}</span>
              </div>
            </div>
          </div>

          <div className="auth-tiles">
            <div className="auth-tile">
              <strong>{lang === 'ar' ? 'ماذا يظهر داخل النظام؟' : 'What shows inside?'}</strong>
              <div className="auth-mini-list">
                <div>✨ {lang === 'ar' ? 'لوحة طالب فخمة' : 'Premium student dashboard'}</div>
                <div>📅 {lang === 'ar' ? 'حجز وموافقة متعددة المراحل' : 'Multi-stage booking approvals'}</div>
                <div>🎓 {lang === 'ar' ? 'تمييز واضح للمنح' : 'Scholarship-aware experience'}</div>
              </div>
            </div>
            <div className="auth-tile">
              <strong>{lang === 'ar' ? 'جاهز للعرض' : 'Ready to present'}</strong>
              <div className="auth-mini-list">
                <div>🟢 {lang === 'ar' ? 'طلاب' : 'Students'}</div>
                <div>🟡 {lang === 'ar' ? 'معلمون' : 'Teachers'}</div>
                <div>🟣 {lang === 'ar' ? 'إدارة' : 'Admin'}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-form-wrap">
          <h2>{lang === 'ar' ? 'تسجيل الدخول' : 'Sign in'}</h2>
          <p className="subtitle">
            {lang === 'ar'
              ? 'ادخل إلى نسخة Ultra Premium من GUIDE ME مع تصميم أفخم وتجربة عرض أقوى.'
              : 'Access the ultra premium GUIDE ME build with a more luxurious presentation.'}
          </p>

          <label>{t.email}</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.email} />

          <label>{t.password}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.password} />

          <div className="auth-row">
            <label className="remember-row">
              <input type="checkbox" defaultChecked /> {t.rememberMe}
            </label>
            <button type="button" className="link-btn">{t.forgotPassword}</button>
          </div>

          {error ? <div className="error-box">{error}</div> : null}

          <button className="primary-btn" disabled={loading}>
            {loading ? '...' : t.login}
          </button>

          <div className="demo-box">
            <strong>{lang === 'ar' ? 'حسابات التجربة' : 'Demo accounts'}</strong>
            <div className="demo-grid">
              <div className="demo-account">
                <strong>{lang === 'ar' ? 'طالب' : 'Student'}</strong>
                <div>student@guideme.app</div>
                <div>123456</div>
              </div>
              <div className="demo-account">
                <strong>{lang === 'ar' ? 'معلم' : 'Teacher'}</strong>
                <div>teacher@guideme.app</div>
                <div>123456</div>
              </div>
              <div className="demo-account">
                <strong>{lang === 'ar' ? 'إدارة' : 'Admin'}</strong>
                <div>admin@guideme.app</div>
                <div>123456</div>
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
  )
}
