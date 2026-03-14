"use client"

import { useEffect, useRef, useCallback } from "react"

export default function MizuPage() {
  const loadingRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  const initAll = useCallback(() => {
    // ---- Loading Screen ----
    if (loadingRef.current) {
      const loader = loadingRef.current
      setTimeout(() => loader.classList.add("hidden"), 1200)
      setTimeout(() => {
        if (loader.parentNode) loader.remove()
      }, 1800)
    }

    // ---- Navbar Scroll ----
    const navbar = document.querySelector(".navbar")
    if (navbar) {
      const onScroll = () => {
        if (window.scrollY > 60) {
          navbar.classList.add("scrolled")
        } else {
          navbar.classList.remove("scrolled")
        }
      }
      window.addEventListener("scroll", onScroll, { passive: true })
    }

    // ---- Mobile Menu ----
    const toggle = document.querySelector(".menu-toggle")
    const mobileNav = document.querySelector(".mobile-nav")
    if (toggle && mobileNav) {
      toggle.addEventListener("click", () => {
        toggle.classList.toggle("active")
        mobileNav.classList.toggle("open")
        document.body.style.overflow = mobileNav.classList.contains("open") ? "hidden" : ""
      })
      mobileNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          toggle.classList.remove("active")
          mobileNav.classList.remove("open")
          document.body.style.overflow = ""
        })
      })
    }

    // ---- Smooth Scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const href = (this as HTMLAnchorElement).getAttribute("href")
        if (!href) return
        const target = document.querySelector(href)
        if (target) {
          const offset = 80
          const top = target.getBoundingClientRect().top + window.scrollY - offset
          window.scrollTo({ top, behavior: "smooth" })
        }
      })
    })

    // ---- Scroll Reveal (IntersectionObserver) ----
    const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale")
    if (reveals.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible")
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      )
      reveals.forEach((el) => observer.observe(el))
    }

    // ---- Back to Top Button ----
    const backBtn = document.querySelector(".back-to-top")
    if (backBtn) {
      window.addEventListener(
        "scroll",
        () => {
          if (window.scrollY > 600) {
            backBtn.classList.add("visible")
          } else {
            backBtn.classList.remove("visible")
          }
        },
        { passive: true }
      )
      backBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
      })
    }

    // ---- Custom Cursor (Desktop Only) ----
    if (window.matchMedia("(hover: hover)").matches && cursorRef.current) {
      const cursor = cursorRef.current
      let mouseX = 0,
        mouseY = 0
      let cursorX = 0,
        cursorY = 0

      document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX
        mouseY = e.clientY
      })

      function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15
        cursorY += (mouseY - cursorY) * 0.15
        cursor.style.left = cursorX + "px"
        cursor.style.top = cursorY + "px"
        requestAnimationFrame(animateCursor)
      }
      animateCursor()

      document.querySelectorAll("a, button, .flavor-card, .why-card, .review-card").forEach((el) => {
        el.addEventListener("mouseenter", () => cursor.classList.add("hover"))
        el.addEventListener("mouseleave", () => cursor.classList.remove("hover"))
      })
    }

    // ---- Counter Animation for Rating ----
    if (counterRef.current) {
      const counter = counterRef.current
      const target = parseFloat(counter.dataset.counter || "0")
      const duration = 1500
      let start: number | null = null

      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              requestAnimationFrame(function step(timestamp) {
                if (!start) start = timestamp
                const progress = Math.min((timestamp - start) / duration, 1)
                const eased = 1 - Math.pow(1 - progress, 3)
                counter.textContent = (target * eased).toFixed(1)
                if (progress < 1) {
                  requestAnimationFrame(step)
                }
              })
              counterObserver.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.5 }
      )
      counterObserver.observe(counter)
    }

    // ---- Flavor card tilt effect ----
    if (window.matchMedia("(hover: hover)").matches) {
      document.querySelectorAll(".flavor-card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const me = e as MouseEvent
          const rect = (card as HTMLElement).getBoundingClientRect()
          const x = me.clientX - rect.left
          const y = me.clientY - rect.top
          const centerX = rect.width / 2
          const centerY = rect.height / 2
          const rotateX = ((y - centerY) / centerY) * -4
          const rotateY = ((x - centerX) / centerX) * 4
          ;(card as HTMLElement).style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`
        })
        card.addEventListener("mouseleave", () => {
          ;(card as HTMLElement).style.transform = ""
        })
      })
    }

    // ---- Active Nav Link on Scroll ----
    const sections = document.querySelectorAll("section[id]")
    const navLinks = document.querySelectorAll('.navbar-links a[href^="#"]')
    if (sections.length && navLinks.length) {
      window.addEventListener(
        "scroll",
        () => {
          let current = ""
          sections.forEach((section) => {
            const sectionTop = (section as HTMLElement).offsetTop - 120
            if (window.scrollY >= sectionTop) {
              current = section.getAttribute("id") || ""
            }
          })
          navLinks.forEach((link) => {
            ;(link as HTMLElement).style.color = ""
            if (link.getAttribute("href") === "#" + current) {
              ;(link as HTMLElement).style.color = "var(--teal)"
            }
          })
        },
        { passive: true }
      )
    }
  }, [])

  useEffect(() => {
    initAll()
  }, [initAll])

  return (
    <>
      {/* Loading Screen */}
      <div className="loading-screen" ref={loadingRef}>
        <div className="loading-brand">
          Mizu<span>.</span>
        </div>
        <div className="loading-bar">
          <div className="loading-bar-inner" />
        </div>
      </div>

      {/* Custom Cursor */}
      <div className="custom-cursor" ref={cursorRef} />

      {/* ====== NAVBAR ====== */}
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="container">
          <a href="#hero" className="navbar-brand">
            Mizu<span>.</span>
          </a>
          <div className="navbar-links">
            <a href="#flavors">Flavors</a>
            <a href="#why-mizu">Why Mizu</a>
            <a href="#experience">Experience</a>
            <a href="#reviews">Reviews</a>
            <a href="#location">Location</a>
            <a href="#order" className="btn-nav-cta">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              Order Now
            </a>
          </div>
          <button className="menu-toggle" aria-label="Toggle menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className="mobile-nav" role="navigation" aria-label="Mobile navigation">
        <a href="#flavors">Flavors</a>
        <a href="#why-mizu">Why Mizu</a>
        <a href="#experience">Experience</a>
        <a href="#reviews">Reviews</a>
        <a href="#location">Location</a>
        <a href="#order" className="btn-primary">
          Order Now
        </a>
      </div>

      <main>
        {/* ====== HERO ====== */}
        <section className="hero section-padding" id="hero">
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge reveal">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
                Limited Seasonal Drop
              </div>
              <h1 className="hero-title reveal stagger-1">
                Ice Cream, <span className="accent">Reimagined</span> with Japanese Soul
              </h1>
              <p className="hero-subtitle reveal stagger-2">
                From the streets of Tokyo to your neighborhood. Artisan scoops crafted daily with authentic Japanese flavors and the finest natural ingredients.
              </p>
              <div className="hero-ctas reveal stagger-3">
                <a href="#flavors" className="btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m16 12-4-4-4 4" />
                    <path d="M12 16V8" />
                  </svg>
                  See Flavors
                </a>
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Order via WhatsApp
                </a>
              </div>
              <div className="hero-trust reveal stagger-4">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Handcrafted daily
                </span>
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 8c0-5-8-5-8 0v7a4 4 0 0 0 8 0Z" />
                    <path d="M13 17V5a3 3 0 0 1 6 0v3" />
                  </svg>
                  Natural ingredients
                </span>
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.1 17 3.1s.1 5.2-2 10.3A7 7 0 0 1 11 20z" />
                    <path d="M2 21c0-3 1.9-5.5 4.8-6.5" />
                  </svg>
                  Vegan options
                </span>
              </div>
            </div>
            <div className="hero-image reveal-scale stagger-2">
              <div className="hero-image-wrapper">
                <img src="/images/hero-icecream.jpg" alt="Japanese artisan ice cream cone with matcha, sakura and vanilla scoops" />
              </div>
            </div>
          </div>
        </section>

        {/* ====== MARQUEE STRIP ====== */}
        <div className="marquee-strip" aria-hidden="true">
          <div className="marquee-track" ref={marqueeRef}>
            <span>Matcha</span>
            <span>Sakura</span>
            <span>Black Sesame</span>
            <span>Yuzu Citrus</span>
            <span>Hojicha</span>
            <span>Ube Taro</span>
            <span>Mochi Vanilla</span>
            <span>Azuki Bean</span>
            <span>Matcha</span>
            <span>Sakura</span>
            <span>Black Sesame</span>
            <span>Yuzu Citrus</span>
            <span>Hojicha</span>
            <span>Ube Taro</span>
            <span>Mochi Vanilla</span>
            <span>Azuki Bean</span>
          </div>
        </div>

        {/* ====== WHY MIZU ====== */}
        <section className="why-mizu section-padding" id="why-mizu">
          <div className="container">
            <span className="section-label reveal">What Makes Us Different</span>
            <h2 className="section-title reveal stagger-1">Why Mizu?</h2>
            <p className="section-subtitle reveal stagger-2">Every scoop is a journey. We blend traditional Japanese craft with bold creativity to deliver flavors you won&apos;t find anywhere else.</p>
            <div className="why-grid">
              <div className="why-card reveal stagger-1">
                <div className="why-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3>Handcrafted Daily</h3>
                <p>Small batches churned fresh every morning. No mass production, ever.</p>
              </div>
              <div className="why-card reveal stagger-2">
                <div className="why-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.1 17 3.1s.1 5.2-2 10.3A7 7 0 0 1 11 20z" />
                    <path d="M2 21c0-3 1.9-5.5 4.8-6.5" />
                  </svg>
                </div>
                <h3>Natural Ingredients</h3>
                <p>Real matcha from Uji, genuine yuzu, authentic sakura. No shortcuts.</p>
              </div>
              <div className="why-card reveal stagger-3">
                <div className="why-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                </div>
                <h3>Japanese-Inspired</h3>
                <p>Unique flavors rooted in Japanese culinary tradition and culture.</p>
              </div>
              <div className="why-card reveal stagger-4">
                <div className="why-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 8c0-5-8-5-8 0v7a4 4 0 0 0 8 0Z" />
                    <path d="M13 17V5a3 3 0 0 1 6 0v3" />
                  </svg>
                </div>
                <h3>Vegan Options</h3>
                <p>Coconut and oat-milk bases that are just as creamy and indulgent.</p>
              </div>
              <div className="why-card reveal stagger-5">
                <div className="why-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3>No Preservatives</h3>
                <p>Zero artificial colors, flavors or preservatives. Pure, clean ice cream.</p>
              </div>
              <div className="why-card reveal stagger-6">
                <div className="why-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                </div>
                <h3>Seasonal Drops</h3>
                <p>Limited-edition flavors that celebrate each season. Get them before they melt away.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ====== PATTERN DIVIDER ====== */}
        <div className="pattern-divider" aria-hidden="true" />

        {/* ====== FLAVORS ====== */}
        <section className="flavors section-padding" id="flavors">
          <div className="container">
            <div className="section-header">
              <span className="section-label reveal">Our Selection</span>
              <h2 className="section-title reveal stagger-1">Featured Flavors</h2>
              <p className="section-subtitle reveal stagger-2">Each flavor tells a story. Crafted with intention, inspired by the streets of Japan.</p>
            </div>
            <div className="flavors-grid">
              <div className="flavor-card reveal stagger-1">
                <div className="flavor-card-image">
                  <img src="/images/flavor-matcha.jpg" alt="Matcha Supreme ice cream scoop" />
                  <span className="flavor-tag bestseller">Bestseller</span>
                </div>
                <div className="flavor-card-body">
                  <h3>Matcha Supreme</h3>
                  <p>Ceremonial-grade Uji matcha blended into a velvety, bittersweet dream.</p>
                </div>
              </div>
              <div className="flavor-card reveal stagger-2">
                <div className="flavor-card-image">
                  <img src="/images/flavor-sakura.jpg" alt="Sakura Blossom ice cream scoop" />
                  <span className="flavor-tag limited">Limited</span>
                </div>
                <div className="flavor-card-body">
                  <h3>Sakura Blossom</h3>
                  <p>Delicate cherry blossom petals folded into a silky, floral cream.</p>
                </div>
              </div>
              <div className="flavor-card reveal stagger-3">
                <div className="flavor-card-image">
                  <img src="/images/flavor-sesame.jpg" alt="Black Sesame ice cream scoop" />
                  <span className="flavor-tag bestseller">Bestseller</span>
                </div>
                <div className="flavor-card-body">
                  <h3>Black Sesame</h3>
                  <p>Roasted sesame seeds ground to perfection. Nutty, toasty, and unforgettable.</p>
                </div>
              </div>
              <div className="flavor-card reveal stagger-4">
                <div className="flavor-card-image">
                  <img src="/images/flavor-yuzu.jpg" alt="Yuzu Citrus Burst ice cream scoop" />
                  <span className="flavor-tag new">New</span>
                </div>
                <div className="flavor-card-body">
                  <h3>Yuzu Citrus Burst</h3>
                  <p>Bright, tangy yuzu sorbet that hits like a summer breeze in Osaka.</p>
                </div>
              </div>
              <div className="flavor-card reveal stagger-5">
                <div className="flavor-card-image">
                  <img src="/images/flavor-hojicha.jpg" alt="Hojicha Latte ice cream scoop" />
                  <span className="flavor-tag vegan">Vegan</span>
                </div>
                <div className="flavor-card-body">
                  <h3>Hojicha Latte</h3>
                  <p>Roasted green tea meets oat milk for a warm, smoky embrace in every bite.</p>
                </div>
              </div>
              <div className="flavor-card reveal stagger-6">
                <div className="flavor-card-image">
                  <img src="/images/flavor-ube.jpg" alt="Ube Taro Dream ice cream scoop" />
                  <span className="flavor-tag limited">Limited</span>
                </div>
                <div className="flavor-card-body">
                  <h3>Ube Taro Dream</h3>
                  <p>Rich purple yam with hints of vanilla. Naturally vibrant and irresistible.</p>
                </div>
              </div>
            </div>
            <div className="flavors-cta reveal">
              <a href="#order" className="btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
                View Full Menu
              </a>
            </div>
          </div>
        </section>

        {/* ====== EXPERIENCE ====== */}
        <section className="experience section-padding" id="experience">
          <div className="container">
            <div className="experience-image reveal-left">
              <img src="/images/experience.jpg" alt="Interior of Mizu ice cream shop with retro Japanese decor and neon signs" />
            </div>
            <div className="experience-content">
              <span className="section-label reveal">Step Inside</span>
              <h2 className="section-title reveal stagger-1">The Mizu Experience</h2>
              <p className="section-subtitle reveal stagger-2">More than ice cream &mdash; it&apos;s a time capsule. Our space is a love letter to Tokyo&apos;s golden era: vintage posters, warm wood, neon glows, and the unmistakable aroma of freshly churned cream.</p>
              <div className="experience-highlights">
                <div className="experience-highlight reveal stagger-3">
                  <div className="experience-highlight-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <circle cx="12" cy="10" r="3" />
                      <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                    </svg>
                  </div>
                  <div>
                    <h4>Retro Photo Corner</h4>
                    <p>Snap your scoop against our vintage Tokyo backdrop wall.</p>
                  </div>
                </div>
                <div className="experience-highlight reveal stagger-4">
                  <div className="experience-highlight-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    </svg>
                  </div>
                  <div>
                    <h4>Late-Night Scoops</h4>
                    <p>Open until midnight on weekends. Perfect for post-dinner cravings.</p>
                  </div>
                </div>
                <div className="experience-highlight reveal stagger-5">
                  <div className="experience-highlight-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <h4>Family-Friendly</h4>
                    <p>Kid scoops, high chairs, and a play corner. Everyone belongs here.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====== REVIEWS ====== */}
        <section className="reviews section-padding" id="reviews">
          <div className="container">
            <div className="reviews-header">
              <span className="section-label reveal">What People Say</span>
              <h2 className="section-title reveal stagger-1">Loved by Scoop Enthusiasts</h2>
            </div>
            <div className="reviews-rating-summary reveal stagger-2">
              <span className="reviews-rating-number" data-counter="4.9" ref={counterRef}>
                0.0
              </span>
              <div>
                <div className="reviews-rating-stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="reviews-rating-text">Based on 340+ reviews</span>
              </div>
            </div>
            <div className="reviews-grid">
              <div className="review-card reveal stagger-1">
                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <blockquote>&ldquo;The matcha flavor transported me straight to Kyoto. Absolutely the best ice cream I&apos;ve ever had.&rdquo;</blockquote>
                <div className="review-author">Sakura M.</div>
                <div className="review-location">San Jose, CA</div>
              </div>
              <div className="review-card reveal stagger-2">
                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <blockquote>&ldquo;I&apos;m vegan and their hojicha latte with oat milk is life-changing. Creamy, smoky, perfect.&rdquo;</blockquote>
                <div className="review-author">David K.</div>
                <div className="review-location">Brooklyn, NY</div>
              </div>
              <div className="review-card reveal stagger-3">
                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <blockquote>&ldquo;The vibe is incredible &mdash; retro Japanese decor, amazing ice cream, and the staff is so friendly. A must-visit!&rdquo;</blockquote>
                <div className="review-author">Emily T.</div>
                <div className="review-location">Austin, TX</div>
              </div>
            </div>
            <div className="reviews-link reveal">
              <a href="#" aria-label="Read more reviews on Google">
                {"Read more on Google \u2192"}
              </a>
            </div>
          </div>
        </section>

        {/* ====== LOCATION ====== */}
        <section className="location section-padding" id="location">
          <div className="container">
            <div className="location-info">
              <span className="section-label reveal">Find Us</span>
              <h2 className="section-title reveal stagger-1">Visit Mizu</h2>
              <p className="section-subtitle reveal stagger-2">We&apos;d love to see you. Come by for a scoop, stay for the vibes.</p>
              <div className="location-details">
                <div className="location-detail reveal stagger-3">
                  <div className="location-detail-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h4>Address</h4>
                    <p>
                      123 Sakura Lane, Little Tokyo
                      <br />
                      Los Angeles, CA 90012
                    </p>
                  </div>
                </div>
                <div className="location-detail reveal stagger-4">
                  <div className="location-detail-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <h4>Hours</h4>
                    <p>
                      Mon &ndash; Thu: 12pm &ndash; 10pm
                      <br />
                      Fri &ndash; Sun: 12pm &ndash; 12am
                    </p>
                  </div>
                </div>
                <div className="location-detail reveal stagger-5">
                  <div className="location-detail-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h4>Contact</h4>
                    <p>
                      +1 (555) 123-MIZU
                      <br />
                      hello@mizuicecream.com
                    </p>
                  </div>
                </div>
              </div>
              <div className="location-buttons reveal stagger-6">
                <a href="#" className="btn-outline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  Get Directions
                </a>
                <a href="tel:+15551236498" className="btn-outline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Call Now
                </a>
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
            <div className="location-map reveal-right">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.7152203584424!2d-118.2412!3d34.0497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c634253ddd51%3A0x9fa6e87cfe58e1f8!2sLittle+Tokyo%2C+Los+Angeles%2C+CA!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mizu Ice Cream location map"
              />
            </div>
          </div>
        </section>

        {/* ====== CTA STRIP ====== */}
        <section className="cta-strip" id="order">
          <div className="container">
            <span className="section-label reveal">Don&apos;t Miss Out</span>
            <h2 className="section-title reveal stagger-1">Seasonal Flavors Are Here</h2>
            <p className="cta-strip-subtitle reveal stagger-2">Limited batches, unlimited cravings. Once they&apos;re gone, they&apos;re gone.</p>
            <div className="cta-strip-buttons reveal stagger-3">
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="btn-light">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Order Now
              </a>
              <a href="#location" className="btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Visit Today
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ====== FOOTER ====== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <div className="footer-brand">
                Mizu<span>.</span>
              </div>
              <p className="footer-tagline">Japanese-inspired artisan ice cream. Handcrafted daily with love and the finest ingredients.</p>
              <div className="footer-socials" style={{ marginTop: "20px" }}>
                <a href="#" className="footer-social-link" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a href="#" className="footer-social-link" aria-label="TikTok">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
                <a href="#" className="footer-social-link" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-links">
              <div className="footer-links-col">
                <h5>Menu</h5>
                <a href="#flavors">Flavors</a>
                <a href="#">Seasonal Drops</a>
                <a href="#">Toppings</a>
                <a href="#">Beverages</a>
              </div>
              <div className="footer-links-col">
                <h5>Company</h5>
                <a href="#why-mizu">About Us</a>
                <a href="#">Careers</a>
                <a href="#">Press</a>
              </div>
              <div className="footer-links-col">
                <h5>Support</h5>
                <a href="#location">Contact</a>
                <a href="#">FAQ</a>
                <a href="#">Catering</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copyright">&copy; 2026 Mizu Ice Cream. All rights reserved.</span>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <button className="back-to-top" aria-label="Back to top">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
    </>
  )
}
