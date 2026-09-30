// src/app/p/[subdomain]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { FaFacebook, FaGlobe, FaInstagram, FaLinkedin, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa'

export const revalidate = 0

export default async function PsychologistPublicPage({
  params,
}: {
  params: Promise<{ subdomain: string }>
}) {
  const { subdomain } = await params

  const psychologist = await prisma.psychologist.findUnique({
    where: { subdomain },
    select: {
      name: true,
      bio: true,
      logo: true,
      phone: true,
      specialties: true,
      plans: {
    select: {
      name: true,
      price: true,
      description: true,
      features: true,
      highlighted: true,
      order: true,
      },
      orderBy: { order: 'asc' },
      },
      socialLinks: {
  select: {
    platform: true,
    url: true,
  },
},
    },
  })

  if (!psychologist) notFound()

  const { name, bio, logo, phone, specialties, plans, socialLinks } = psychologist

  const specialtyIcons: Record<string, string> = {
    Adolescencia: '🌱',
    Adultos: '☀️',
    'Adultos Mayores': '🍂',
    Pareja: '💛',
  }

  const platformIcons: Record<string, React.ReactNode> = {
  instagram: <FaInstagram/>,
  facebook: <FaFacebook/>,
  linkedin: <FaLinkedin/>,
  twitter: <FaTwitter/>,
  tiktok: <FaTiktok />,
  youtube: <FaYoutube />,
  website: <FaGlobe/>,
}

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: #FDFAF4; color: #1E2420; overflow-x: hidden; }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 3rem; height: 68px; background: rgba(253,250,244,.94); backdrop-filter: blur(14px); border-bottom: 1px solid #EDE0C8; }
        .nav-brand { font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 600; color: #1E2420; text-decoration: none; line-height: 1.2; }
        .nav-brand span { display: block; font-size: .7rem; font-family: 'DM Sans', sans-serif; font-weight: 300; color: #7D8C7A; letter-spacing: .14em; text-transform: uppercase; }
        .nav-links { display: flex; align-items: center; gap: 1.8rem; }
        .nav-links a { font-size: .83rem; color: #4A5548; text-decoration: none; letter-spacing: .04em; }
        .nav-links a:hover { color: #5C8260; }
        .btn-nav { background: #5C8260 !important; color: #fff !important; padding: .48rem 1.3rem; border-radius: 100px; font-weight: 500 !important; }
        .btn-nav:hover { background: #476648 !important; }

        .hero { min-height: 100vh; display: flex; align-items: center; padding-top: 68px; }
        .hero-left { padding: 5rem 3.5rem 5rem 5rem; display: flex; flex-direction: column; gap: 1.8rem; max-width: 700px; }
        .hero-tag { display: inline-flex; align-items: center; gap: .5rem; background: #EDE0C8; color: #476648; padding: .32rem .9rem; border-radius: 100px; font-size: .72rem; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; width: fit-content; }
        h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.4rem, 3.6vw, 3.6rem); line-height: 1.1; font-weight: 500; }
        h1 em { font-style: italic; color: #5C8260; }
        .hero-sub { font-size: 1rem; line-height: 1.8; color: #4A5548; max-width: 460px; font-weight: 300; }
        .hero-ctas { display: flex; gap: 1rem; align-items: center; }
        .btn-primary { background: #5C8260; color: #fff; padding: .82rem 1.8rem; border-radius: 100px; font-size: .88rem; font-weight: 500; text-decoration: none; box-shadow: 0 4px 16px rgba(92,130,96,.25); }
        .btn-ghost { color: #5C8260; font-size: .88rem; text-decoration: none; }
        .hero-stats { display: flex; gap: 2.5rem; padding-top: 1rem; border-top: 1px solid #EDE0C8; }
        .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 600; line-height: 1; }
        .stat-label { font-size: .72rem; color: #7D8C7A; letter-spacing: .05em; }
        .hero-right { height: 100%; min-height: 100vh; background: linear-gradient(160deg,#EDE0C8 0%,#D4BC9A 60%,#c8a97a 100%); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 2rem; }
        .photo-frame { position: relative; z-index: 1; width: 220px; height: 220px; border-radius: 50%; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,.18); background: linear-gradient(180deg,#D4BC9A 0%,#7A9E7E 100%); display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; color: #fff; font-size: .9rem; text-align: center; padding: 1.5rem; }

        section { padding: 5.5rem 5rem; }
        .stag { font-size: .7rem; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; color: #5C8260; margin-bottom: .8rem; }
        h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.9rem, 2.8vw, 2.6rem); font-weight: 500; line-height: 1.2; }
        h2 em { font-style: italic; color: #5C8260; }

        .about { background: #fff; }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
        .about-text { display: flex; flex-direction: column; gap: 1.4rem; }
        .about-text p { font-size: .97rem; line-height: 1.8; color: #4A5548; font-weight: 300; }
        .about-card { background: #F7F0E0; border-radius: 24px; padding: 2.5rem; display: flex; flex-direction: column; gap: 1.2rem; }
        .quote { font-family: 'Cormorant Garamond', serif; font-size: 1.55rem; font-style: italic; line-height: 1.5; }
        .quote::before { content: '"'; color: #7A9E7E; font-size: 2.5rem; line-height: 0; vertical-align: -.4em; margin-right: .15rem; }

        .esp { background: #FDFAF4; }
        .esp-head { margin-bottom: 2.8rem; }
        .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.4rem; }
        .card { background: #fff; border-radius: 20px; padding: 2rem; display: flex; flex-direction: column; gap: .9rem; border: 1px solid #EDE0C8; transition: transform .25s, box-shadow .25s, border-color .25s; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,.08); border-color: #7A9E7E; }
        .card-icon { width: 46px; height: 46px; border-radius: 13px; background: #F7F0E0; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
        .card h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.28rem; font-weight: 600; }
        .card p { font-size: .86rem; line-height: 1.7; color: #4A5548; font-weight: 300; }

        .precios { background: #1E2420; }
        .precios .stag { color: #7A9E7E; }
        .precios h2 { color: #fff; }
        .precios h2 em { color: #7A9E7E; }
        .precios-sub { font-size: .9rem; color: rgba(255,255,255,.45); margin-top: .4rem; margin-bottom: 2.8rem; }
        .precios-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.4rem; }
        .pc { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 20px; padding: 2rem; display: flex; flex-direction: column; gap: 1.1rem; position: relative; }
        .pc.featured { background: #5C8260; border-color: #7A9E7E; }
        .pc.featured::before { content: 'Más popular'; position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,.2); color: #fff; font-size: .68rem; font-weight: 500; letter-spacing: .08em; padding: .2rem .7rem; border-radius: 100px; }
        .ptipo { font-size: .75rem; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.55); }
        .pc.featured .ptipo { color: rgba(255,255,255,.8); }
        .pamount { font-family: 'Cormorant Garamond', serif; font-size: 2.8rem; font-weight: 600; color: #fff; line-height: 1; }
        .pamount sup { font-size: 1.1rem; vertical-align: top; margin-top: .4rem; display: inline-block; }
        .pamount .per { font-size: .9rem; font-family: 'DM Sans', sans-serif; font-weight: 300; color: rgba(255,255,255,.45); }
        .pdesc { font-size: .83rem; color: rgba(255,255,255,.5); line-height: 1.6; font-weight: 300; }
        .pc.featured .pdesc { color: rgba(255,255,255,.8); }
        .plist { list-style: none; display: flex; flex-direction: column; gap: .55rem; }
        .plist li { font-size: .83rem; color: rgba(255,255,255,.6); display: flex; gap: .5rem; }
        .plist li::before { content: '✓'; color: #7A9E7E; font-weight: 600; flex-shrink: 0; }
        .pc.featured .plist li { color: rgba(255,255,255,.9); }
        .pc.featured .plist li::before { color: rgba(255,255,255,.9); }
        .pbtn { margin-top: auto; padding: .78rem 1.5rem; border-radius: 100px; text-align: center; text-decoration: none; font-size: .83rem; font-weight: 500; display: block; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .pbtn-outline { background: transparent; border: 1px solid rgba(255,255,255,.2); color: #fff; }
        .pbtn-fill { background: #fff; color: #476648; }

        .contacto { background: #F7F0E0; }
        .contacto-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 4.5rem; align-items: start; margin-top: 2.8rem; }
        .contacto-info { display: flex; flex-direction: column; gap: 1.5rem; }
        .contacto-intro { font-size: .97rem; line-height: 1.8; color: #4A5548; font-weight: 300; }
        .dato { display: flex; align-items: flex-start; gap: 1rem; padding: 1.1rem; background: #fff; border-radius: 14px; border: 1px solid #EDE0C8; }
        .dato-icon { width: 38px; height: 38px; border-radius: 10px; background: #EDE0C8; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; color: inherit; }
        .dato-text strong { display: block; font-size: .75rem; font-weight: 500; color: #7D8C7A; letter-spacing: .06em; text-transform: uppercase; margin-bottom: .15rem; }
        .dato-text a, .dato-text span { font-size: .93rem; color: #1E2420; text-decoration: none; }
        .form-wrap { background: #fff; border-radius: 24px; padding: 2.2rem; border: 1px solid #EDE0C8; }
        .form-title { font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; font-weight: 500; margin-bottom: 1.4rem; }
        .fg { display: flex; flex-direction: column; gap: .35rem; margin-bottom: 1.1rem; }
        .fg label { font-size: .75rem; font-weight: 500; color: #7D8C7A; letter-spacing: .06em; text-transform: uppercase; }
        .fg input, .fg textarea, .fg select { padding: .75rem .9rem; border-radius: 10px; border: 1px solid #EDE0C8; background: #FDFAF4; font-family: 'DM Sans', sans-serif; font-size: .88rem; color: #1E2420; outline: none; width: 100%; }
        .fg input:focus, .fg textarea:focus, .fg select:focus { border-color: #7A9E7E; box-shadow: 0 0 0 3px rgba(122,158,126,.12); }
        .fg textarea { resize: vertical; min-height: 100px; }
        .frow { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .fsub { width: 100%; padding: .85rem; border-radius: 100px; background: #5C8260; color: #fff; border: none; font-family: 'DM Sans', sans-serif; font-size: .88rem; font-weight: 500; cursor: pointer; }
        .fsub:hover { background: #476648; }

        footer { background: #1E2420; color: rgba(255,255,255,.4); padding: 1.8rem 5rem; display: flex; align-items: center; justify-content: space-between; font-size: .78rem; }
        .footer-brand { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; color: rgba(255,255,255,.7); font-weight: 500; }
      `}</style>

      {/* NAVBAR */}
      <nav>
        <a href="#inicio" className="nav-brand">
          {name}
          <span>Psicólogo · Sesiones virtuales</span>
        </a>
        <div className="nav-links">
          <a href="#inicio">Inicio</a>
          {specialties.map((s) => (
            <a key={s} href="#esp">{s}</a>
          ))}
          <a href="#contacto" className="btn-nav">Reserva</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="inicio">
        <div className="hero-left">
          <span className="hero-tag">Psicología · Sesiones virtuales</span>
          <h1>Un espacio seguro para <em>reconectarte</em> contigo mismo</h1>
          <p className="hero-sub">
            {bio ?? 'Acompaño a personas en sus procesos de cambio, con un enfoque integrador y profundamente humano.'}
          </p>
          <div className="hero-ctas">
            <a href="#contacto" className="btn-primary">Reservar primera sesión</a>
            <a href="#sobre-mi" className="btn-ghost">Conoce más →</a>
          </div>
          <div className="hero-stats">
            <div><div className="stat-num">50'</div><div className="stat-label">Por sesión</div></div>
            <div><div className="stat-num">100%</div><div className="stat-label">Online</div></div>
          </div>
        </div>
      </section>

      {/* SOBRE MÍ */}
<section className="about" id="sobre-mi">
  <div className="about-grid">
    <div className="about-text">
      <p className="stag">Sobre mí</p>
      <h2>Psicólogo con enfoque <em>integrador</em></h2>
      <p>{bio ?? 'Próximamente...'}</p>
      <div className="about-card">
        <p className="quote">La terapia no es un lujo. Es aprender a habitarte.</p>
        <p style={{ fontSize: '.85rem', color: '#4A5548', lineHeight: 1.7, fontWeight: 300 }}>
          Las sesiones son un espacio de escucha sin juicios, donde puedes explorar lo que te preocupa con total confianza.
        </p>
      </div>
    </div>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
  width: '280px',
  height: '340px',
  borderRadius: '50% 50% 45% 45%',
  background: 'linear-gradient(180deg,#D4BC9A 0%,#7A9E7E 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '1rem',
  textAlign: 'center' as const,
  boxShadow: '0 16px 48px rgba(0,0,0,.15)',
  overflow: 'hidden',
}}>
  {logo
    ? <img src={logo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    : <>🖼 Foto de<br />{name}</>
  }
</div>
    </div>
  </div>
</section>

      {/* ESPECIALIDADES */}
      {specialties.length > 0 && (
        <section className="esp" id="esp">
          <div className="esp-head">
            <p className="stag">Especialidades</p>
            <h2>¿En qué te puedo <em>ayudar</em>?</h2>
          </div>
          <div className="cards">
            {specialties.map((s) => (
              <div key={s} className="card">
                <div className="card-icon">{specialtyIcons[s] ?? '🌿'}</div>
                <h3>{s}</h3>
                <p>Acompañamiento terapéutico especializado en {s.toLowerCase()}.</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PRECIOS */}
{plans.length > 0 && (
  <section className="precios" id="precios">
    <p className="stag">Tarifas</p>
    <h2>Precios <em>claros</em>, sin sorpresas</h2>
    {/* Solo mostrar si hay un plan gratuito */}
{plans.some(p => p.price === null || p.price === 0) && (
  <p className="precios-sub">Primera consulta gratuita de 20 minutos — sin compromiso.</p>
)}
    <div className="precios-grid" style={{
      gridTemplateColumns: `repeat(${Math.min(plans.length, 3)}, minmax(260px, 1fr))`,
      maxWidth: plans.length === 1 ? '360px' : plans.length === 2 ? '740px' : '100%',
      margin: '0 auto',
    }}>
      {plans.map((plan) => (
        <div key={plan.name} className={`pc${plan.highlighted ? ' featured' : ''}`}>
          <p className="ptipo">{plan.name}</p>
          <div className="pamount">
            {plan.price === null || plan.price ===0 ? 'Gratis': <><sup>€</sup>{plan.price}<span className="per"> / sesión</span></> }
          </div>
          {plan.description && <p className="pdesc">{plan.description}</p>}
          <ul className="plist">
            {plan.features.map((f) => <li key={f}>{f}</li>)}
          </ul>
          <a href="#contacto" className={`pbtn ${plan.highlighted ? 'pbtn-fill' : 'pbtn-outline'}`}>
             {plan.price === null || plan.price === 0 ? 'Solicitar ahora' : 'Reservar sesión'}
          </a>
        </div>
      ))}
    </div>
  </section>
)}

     {/* CONTACTO */}
<section className="contacto" id="contacto">
  <p className="stag">Contacto</p>
  <h2>El primer paso es el más <em>importante</em></h2>
  <div className="contacto-grid">
    <div className="contacto-info">
      <p className="contacto-intro">
        Escríbeme o reserva directamente. Respondo en menos de 24 horas. La primera consulta es gratuita y sin compromiso.
      </p>
      {phone && (
        <div className="dato">
          <div className="dato-icon">📱</div>
          <div className="dato-text">
            <strong>WhatsApp</strong>
            <a href={`https://wa.me/${phone.replace(/\D/g, '')}`}>{phone}</a>
          </div>
        </div>
      )}
      {socialLinks.map((link) => (
        <div key={link.platform} className="dato">
          <div className="dato-icon">{platformIcons[link.platform] ?? '🔗'}</div>
          <div className="dato-text">
            <strong>{link.platform}</strong>
            <a href={link.url} target="_blank" rel="noreferrer">{link.url}</a>
          </div>
        </div>
      ))}
    </div>
    <div className="form-wrap">
      <h3 className="form-title">Envíame un mensaje</h3>
      <div className="frow">
        <div className="fg"><label>Nombre</label><input type="text" placeholder="Tu nombre" /></div>
        <div className="fg"><label>Email</label><input type="email" placeholder="tu@email.com" /></div>
      </div>
      <div className="fg">
        <label>Motivo de consulta</label>
        <select>
          <option value="">Selecciona...</option>
          {specialties.map((s) => <option key={s}>{s}</option>)}
          <option>Otro</option>
        </select>
      </div>
      <div className="fg"><label>Mensaje</label><textarea placeholder="Cuéntame brevemente qué te gustaría trabajar..." /></div>
      <button className="fsub">Enviar mensaje →</button>
    </div>
  </div>
</section>

      {/* FOOTER */}
      <footer>
        <span className="footer-brand">{name} · Psicólogo</span>
        <span>© {new Date().getFullYear()} · Powered by PsiConsulta</span>
        <span>Política de privacidad</span>
      </footer>
    </>
  )
}