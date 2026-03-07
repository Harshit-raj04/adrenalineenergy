import { useEffect, useRef } from 'react'
import './App.css'

function App() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const sparks = []
    const SPARK_COUNT = 48
    let rafId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const makeSpark = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      r: Math.random() * 2.2 + 0.4,
      hue: Math.random() > 0.4 ? 185 : 60,
      alpha: Math.random() * 0.55 + 0.1,
    })

    const init = () => {
      sparks.length = 0
      for (let i = 0; i < SPARK_COUNT; i += 1) {
        sparks.push(makeSpark())
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      sparks.forEach((spark) => {
        spark.x += spark.vx
        spark.y += spark.vy

        if (
          spark.x < -10 ||
          spark.x > canvas.width + 10 ||
          spark.y < -10 ||
          spark.y > canvas.height + 10
        ) {
          Object.assign(spark, makeSpark())
        }

        ctx.beginPath()
        ctx.fillStyle = `hsla(${spark.hue}, 100%, 65%, ${spark.alpha})`
        ctx.arc(spark.x, spark.y, spark.r, 0, Math.PI * 2)
        ctx.fill()
      })

      rafId = window.requestAnimationFrame(draw)
    }

    const onResize = () => {
      resize()
      init()
    }

    resize()
    init()
    draw()

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      window.cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div className="energy-bg" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
        <canvas ref={canvasRef} id="spark-canvas" />
      </div>

      <header className="site-header">
        <div className="brand">
          VOLT<span>RUSH</span>
        </div>
        <nav>
          <a href="#flavors">Flavors</a>
          <a href="#features">Performance</a>
          <a href="#cta">Order</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="kicker">New Formula 2.0</p>
            <h1>
              Fuel The <span>Night Shift</span>
            </h1>
            <p>
              Zero sugar. Sharp focus. High-voltage citrus kick engineered for builders,
              gamers, and creators.
            </p>
            <div className="hero-actions">
              <button type="button">Pre-Order Pack</button>
              <a href="#features">See What&apos;s Inside</a>
            </div>
          </div>

          <div className="can-wrap" aria-label="Stylized energy drink can">
            <div className="can">
              <div className="can-shine" />
              <div className="can-logo">VOLT</div>
              <div className="can-stripe" />
              <div className="can-flavor">CITRUS SURGE</div>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <article>
            <h2>150mg Caffeine</h2>
            <p>Sustained release blend to keep focus locked for longer sessions.</p>
          </article>
          <article>
            <h2>B-Vitamin Stack</h2>
            <p>Energy metabolism support to cut through afternoon crashes.</p>
          </article>
          <article>
            <h2>Electrolyte Boost</h2>
            <p>Hydration support tuned for late-night sprints and workouts.</p>
          </article>
        </section>
      </main>

      <footer id="cta">
        <p>Drop incoming. Subscribe for launch pricing.</p>
        <form>
          <input type="email" placeholder="Enter your email" aria-label="Email" />
          <button type="submit">Notify Me</button>
        </form>
      </footer>
    </>
  )
}

export default App
