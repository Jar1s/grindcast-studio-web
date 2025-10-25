import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import "./App.css";
import heroImage from "./assets/hero.jpg";
import recordingThumbOne from "./assets/recording-1.jpg";
import recordingThumbTwo from "./assets/recording-2.jpg";
import lxcLogo from "./assets/lxc-logo.png";
import grindcastLogo from "./assets/grindcast-logo.png";
import detailWall from "./assets/detail-wall.jpg";
import detailMic from "./assets/detail-mic.jpg";
import mixer from "./assets/mixer.jpg";
import studioDetail from "./assets/studio-detail.jpg";
import heroTech from "./assets/hero-tech.jpg";
import recodeAudioCover from "./assets/recode-body-new.jpg";
import galleryStudio1 from "./assets/studio-space-1.jpg";
import galleryStudio2 from "./assets/studio-space-2.jpg";
import galleryStudio3 from "./assets/studio-space-3.jpg";

const CALENDLY_URL = "https://calendly.com/vas-calendly/podcast-studio";

const navigation = [
  { href: "#cennik", label: "Cenník" },
  { href: "#ponuka", label: "Ponuka" },
  { href: "#faq", label: "FAQ" },
  { href: "#kontakt", label: "Kontakt" },
];

const VAT_NOTE = "Cena s DPH";

const sessionOptions = [
  { id: "1h", label: "1 hodina", minutes: 60 },
  { id: "2h", label: "2 hodiny", minutes: 120 },
  { id: "3h", label: "3 hodiny", minutes: 180 },
];

const services = [
  {
    title: "Audio & video nahrávanie",
    description:
      "Štúdio vybavené profesionálnymi mikrofónmi, kamerami a svetlami pre podcasty, rozhovory a livestreamy.",
    icon: "🎙️",
  },
  {
    title: "Technická obsluha",
    description:
      "Náš technik pripraví scénu, postará sa o zvuk a obraz a dohliadne na priebeh celej nahrávacej session.",
    icon: "🛠️",
  },
  {
    title: "Postprodukcia",
    description:
      "Strih, mix, mastering, grading, titulky a export do požadovaných formátov v rámci balíka alebo na objednávku.",
    icon: "🎬",
  },
];

const faqs = [
  {
    question: "Čo je zahrnuté v cene prenájmu?",
    answer:
      "V balíku máte technika, 4 mikrofóny, 3 statické kamery, profesionálne osvetlenie a monitoring zvuku počas celej session.",
  },
  {
    question: "Ako rýchlo vieme dostať finálny výstup?",
    answer:
      "Pri balíkoch s postprodukciou posielame hotové video a audio spravidla do 3 pracovných dní. Reels dodávame v rovnakom čase, alebo podľa dohody expresne.",
  },
  {
    question: "Koľko ľudí sa zmestí do štúdia?",
    answer:
      "Počas nahrávania vedia pri stole sedieť štyria hostia.",
  },
  {
    question: "Môžeme si priniesť vlastného kameramana alebo techniku?",
    answer:
      "Áno. Štúdio je modulárne, takže vieme prispôsobiť rozloženie kamerám, ktoré si donesiete. Náš technik vám pomôže so zapojením aj so zvukom.",
  },
  {
    question: "Ako prebieha rezervácia termínu?",
    answer:
      "Vyberte si balík a dĺžku nahrávania, kliknite na Rezervovať a zvoľte voľný slot v Calendly. Po potvrdení vám do 24 hodín pošleme detailnú prípravu a checklist.",
  },
  {
    question: "Máme k dispozícii parkovanie a catering?",
    answer:
      "Parkovanie je možné priamo v areáli Melrose Apartments. Na želanie zabezpečíme kávový servis alebo občerstvenie cez našich partnerov.",
  },
];

const packages = [
  {
    title: "Základná postprodukcia",
    description:
      "Po nahrávaní dostanete všetky audio a video súbory + hrubý strih pripravený pre vašu ďalšiu úpravu.",
    pricing: {
      "1h": { price: "149 €", note: VAT_NOTE },
      "2h": { price: "239 €", note: VAT_NOTE },
      "3h": { price: "329 €", note: VAT_NOTE },
    },
    features: [
      "{durationMinutes} min nahrávanie + 30 min príprava",
      "Full HD záznam na 3 kamery",
      "Zvuk v štúdiovej kvalite (4 mikrofóny)",
      "Technik v štúdiu počas celého času",
    ],
  },
  {
    title: "Kompletná postprodukcia",
    description:
      "Dodáme kompletný audio aj video výstup pripravený na publikovanie.",
    pricing: {
      "1h": { price: "249 €", note: VAT_NOTE },
      "2h": { price: "339 €", note: VAT_NOTE },
      "3h": { price: "429 €", note: VAT_NOTE },
    },
    highlighted: true,
    features: [
      "{durationMinutes} min nahrávanie + 30 min príprava",
      "Finálny strih videa a audia vo Full HD",
      "Color grading a grafika",
      "Jedno kolo zapracovania pripomienok",
    ],
  },
  {
    title: "Kompletná postprodukcia Pro",
    description:
      "Okrem finálneho podcastu získate 4 vertikálne klipy s titulkami a grafikou pripravené na sociálne siete.",
    pricing: {
      "1h": { price: "299 €", note: VAT_NOTE },
      "2h": { price: "389 €", note: VAT_NOTE },
      "3h": { price: "479 €", note: VAT_NOTE },
    },
    features: [
      "{durationMinutes} min nahrávanie + 30 min príprava",
      "Finálny strih videa a audia vo Full HD",
      "Color grading a grafika",
      "4 vertikálne klipy s titulkami",
    ],
  },
];

const recordings = [
  {
    title: "Leader X Cast",
    description: "Nefiltrované príbehy a dimenzie vplyvných osobností sveta.",
    thumbnail: lxcLogo,
    url: "https://www.youtube.com/@jaroslavbircak",
  },
  {
    title: "Grindcast",
    description: "Ako sa pripraviť na podnikanie v roku 2025.",
    thumbnail: grindcastLogo,
    url: "https://www.youtube.com/@grindsetacademy",
  },
  {
    title: "ReCode Body Príbeh",
    description: "Audio kniha o zmene mindsetu a zdravom tele, ktorú sme vytvorili pre klienta.",
    thumbnail: recodeAudioCover,
    url: "https://www.mirkaluberdova.sk/recodebody/",
    isAudioBook: true,
  },
];

const hosts = [
];

function useScrollReveal(threshold = 0.25, delay = 0) {
  const controls = useAnimation();
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            controls.start({
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
            });
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    const node = ref.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) observer.unobserve(node);
      observer.disconnect();
    };
  }, [controls, threshold, delay]);

  return { ref, controls };
}

function App() {
  const [activeSession, setActiveSession] = useState(sessionOptions[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeSessionMeta =
    sessionOptions.find((option) => option.id === activeSession) || sessionOptions[0];
  const heroReveal = useScrollReveal(0.35);
  const pricingReveal = useScrollReveal(0.25, 0.1);
  const servicesReveal = useScrollReveal(0.25, 0.15);
  const recordingsReveal = useScrollReveal(0.2, 0.25);
  const galleryReveal = useScrollReveal(0.2, 0.3);
  const faqReveal = useScrollReveal(0.2, 0.35);
  const contactReveal = useScrollReveal(0.2, 0.4);


  return (
    <div className="page">
      <header className="top-bar" role="banner">
        <div className="logo" aria-label="Grindcast - Podcastové štúdio">
          <span className="logo-word">Grindcast</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="nav desktop-nav" role="navigation" aria-label="Hlavná navigácia">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} aria-label={`Prejsť na sekciu ${item.label}`}>
              {item.label}
            </a>
          ))}
          <a
            className="cta-button"
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Rezervovať termín v podcastovom štúdiu"
          >
            Rezervovať
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Otvoriť/zavrieť menu"
        >
          <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              className="mobile-nav"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {navigation.map((item) => (
                <a 
                  key={item.href} 
                  href={item.href} 
                  aria-label={`Prejsť na sekciu ${item.label}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                className="mobile-cta"
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Rezervovať termín v podcastovom štúdiu"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Rezervovať
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main role="main">
        <motion.section
          ref={heroReveal.ref}
          className="hero"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(7, 7, 9, 0.85), rgba(7, 7, 9, 0.45)), url(" +
              heroImage +
              ")",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={heroReveal.controls}
          aria-labelledby="hero-heading"
        >
          <div className="hero-text">
            <span className="overline">Prémiové podcastové štúdio</span>
            <h1 id="hero-heading">Nahrávajte obsah, ktorý znie aj vyzerá svetovo.</h1>
            <p>
              Profesionálne podcastové štúdio pre značky, agentúry aj autorov,
              ktorí chcú prvotriedny zvuk, obraz a servis v Bratislave.
            </p>
            <div className="hero-actions">
              <a
                className="cta-button"
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Dohodnúť termín v podcastovom štúdiu - otvorí sa v novom okne"
              >
                Dohodnúť termín
              </a>
              <a 
                className="secondary-button" 
                href="#cennik"
                aria-label="Prejsť na sekciu cenník"
              >
                Pozrieť cenník
              </a>
            </div>
          </div>
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              transition: { duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
            }}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            <motion.img
              src={heroTech}
              alt="Profesionálne štúdio vybavenie"
              loading="lazy"
              className="hero-visual-primary"
              initial={{ y: 20 }}
              animate={{ y: 0, transition: { duration: 1.2, delay: 0.3 } }}
            />
            <motion.img
              src={detailMic}
              alt="Profesionálny mikrofon"
              loading="lazy"
              className="hero-visual-secondary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 1, delay: 0.5 } }}
              whileHover={{ rotate: -2, scale: 1.05 }}
            />
            <motion.div
              className="hero-visual-glow"
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.05, 1],
              }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.section>

        <motion.section
          ref={galleryReveal.ref}
          className="section gallery"
          initial={{ opacity: 0, y: 40 }}
          animate={galleryReveal.controls}
          aria-labelledby="gallery-heading"
        >
          <div className="section-header">
            <span className="section-overline">Prostredie štúdia</span>
            <h2 id="gallery-heading">Nahliadnite do nášho priestoru</h2>
          </div>
          <div className="gallery-grid">
            {[galleryStudio1, galleryStudio2, galleryStudio3].map((imageSrc, index) => (
              <motion.figure
                key={imageSrc + index}
                initial={{ opacity: 0, y: 30 }}
                animate={galleryReveal.controls}
                whileHover={{ scale: 1.02, transition: { duration: 0.25 } }}
              >
                <img src={imageSrc} alt="Podcastové štúdio Bratislava" />
              </motion.figure>
            ))}
          </div>
        </motion.section>

        <motion.section
          ref={pricingReveal.ref}
          id="cennik"
          className="section pricing"
          initial={{ opacity: 0, y: 40 }}
          animate={pricingReveal.controls}
        >
          <div className="section-header">
            <span className="section-overline">Cenník</span>
            <h2>Vyberte si balík, ktorý vám najviac sedí</h2>
            <p className="pricing-subtitle single-line">
              Pri prvej návšteve získate <strong>25 % zľavu</strong> na ktorýkoľvek balík.
            </p>
          </div>
          <div className="pricing-tabs" role="tablist" aria-label="Dĺžka nahrávania">
            {sessionOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={option.id === activeSession}
                className={`pricing-tab${option.id === activeSession ? " active" : ""}`}
                onClick={() => setActiveSession(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="pricing-grid">
            {packages.map((pack) => (
              <motion.article
                key={pack.title}
                className={`pricing-card${pack.highlighted ? " highlighted" : ""}`}
                initial={{ opacity: 0, y: 40 }}
                animate={pricingReveal.controls}
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
              >
                <div className="pricing-card-header">
                  <h3>{pack.title}</h3>
                  <p>{pack.description}</p>
                </div>
                <div className="pricing-card-price">
                  {(() => {
                    const pricingForSession =
                      pack.pricing[activeSession] ||
                      pack.pricing[sessionOptions[0].id];
                    return (
                      <>
                        <strong>{pricingForSession?.price ?? "—"}</strong>
                        <span>{pricingForSession?.note ?? VAT_NOTE}</span>
                      </>
                    );
                  })()}
                </div>
                <a
                  className="cta-button"
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Rezervovať
                </a>
                <ul className="pricing-features">
                  {pack.features.map((feature) => {
                    const text = feature
                      .replace("{durationLabel}", activeSessionMeta.label)
                      .replace("{durationMinutes}", activeSessionMeta.minutes.toString());
                    return (
                      <li key={`${feature}-${activeSession}`}>
                        <span className="feature-icon" aria-hidden="true">
                          ✓
                        </span>
                        <span className="feature-text">{text}</span>
                      </li>
                    );
                  })}
                </ul>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          ref={servicesReveal.ref}
          id="ponuka"
          className="section"
          initial={{ opacity: 0, y: 40 }}
          animate={servicesReveal.controls}
        >
          <div className="section-header">
            <span className="section-overline">Čo všetko vybavíme</span>
            <h2>Kompletný servis pre vaše podcasty a videá</h2>
          </div>
          <div className="cards-grid">
            {services.map((service) => (
              <motion.article
                key={service.title}
                className="service-card"
                initial={{ opacity: 0, y: 30 }}
                animate={servicesReveal.controls}
                whileHover={{ translateY: -10, transition: { duration: 0.25 } }}
              >
                <span className="service-icon" aria-hidden="true">
                  {service.icon}
                </span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          ref={recordingsReveal.ref}
          className="section recordings"
          initial={{ opacity: 0, y: 40 }}
          animate={recordingsReveal.controls}
        >
          <div className="section-header">
            <span className="section-overline">Natáčali sme</span>
            <h2>Ukážky projektov, ktoré vznikli v našom štúdiu</h2>
          </div>
          <div className="recordings-grid">
            {recordings.map((item, index) => (
              <motion.a
                key={item.title}
                href={item.url}
                className={`recording-card${item.isAudioBook ? " recording-card--audiobook" : ""}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 40 }}
                animate={recordingsReveal.controls}
                whileHover={{ scale: 1.02, transition: { duration: 0.25 } }}
                aria-label={`${item.isAudioBook ? 'Pozrieť audio knihu' : 'Pozrieť video'}: ${item.title}`}
              >
                <img 
                  src={item.thumbnail} 
                  alt={`Náhľad pre ${item.title} - ${item.description}`} 
                  loading="lazy" 
                />
                <div className="recording-overlay">
                  <div className="recording-text">
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                    <span className="recording-label">
                      {item.isAudioBook ? "POZRIEŤ AUDIO KNIHU" : "POZRIEŤ VIDEO"}
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
          <div className="media-embed">
            <div className="media-embed-item">
              <h3>Vypočujte si audio podcast z nášho štúdia</h3>
              <iframe
                title="Spotify podcast ukážka"
                src="https://open.spotify.com/embed/episode/1BTeeUOHah25Dq77qrBEvc?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
            <div className="media-embed-item">
              <h3>Video podcast z nášho štúdia</h3>
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube-nocookie.com/embed/12xM50O3UlU?start=347"
                title="YouTube ukážka podcastu"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          ref={faqReveal.ref}
          id="faq"
          className="section faq"
          initial={{ opacity: 0, y: 40 }}
          animate={faqReveal.controls}
        >
          <div className="section-header">
            <span className="section-overline">Časté otázky</span>
            <h2>Opýtajte sa, radi poradíme</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 24 }}
                animate={faqReveal.controls}
              >
                <details>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          ref={contactReveal.ref}
          id="kontakt"
          className="section contact"
          initial={{ opacity: 0, y: 40 }}
          animate={contactReveal.controls}
        >
          <div className="contact-card">
            <div className="section-header">
              <span className="section-overline">Rezervácia štúdia</span>
              <h2>Rezervujte si termín v našom štúdiu</h2>
            </div>
            <div className="contact-details">
              <p>
                Kliknite na tlačidlo nižšie, rezervujte si termín priamo v Calendly a my
                vám do 24 hodín pošleme checklist aj potvrdenie nahrávania.
              </p>
              <p>
                Štúdio nájdete v objekte <strong>Melrose Apartments</strong> na adrese
                <strong> Betliarska 3769/12, 851 07 Petržalka</strong>. Parkovanie je
                dostupné priamo v areáli.
              </p>
              <a
                className="cta-button"
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Rezervovať termín
              </a>
            </div>
            <div className="contact-meta">
              <div className="contact-map">
                <iframe
                  title="Mapa Bratislava"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=17.0%2C48.1%2C17.2%2C48.2&layer=mapnik&marker=48.1486%2C17.1077"
                  width="100%"
                  height="300"
                  style={{ 
                    border: '1px solid rgba(241, 201, 76, 0.3)',
                    borderRadius: '12px'
                  }}
                />
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <strong>Grindcast Studio Bratislava</strong>
          <p>Profesionálny partner pre váš audio a video obsah.</p>
        </div>
          <div className="footer-contact">
            <a href="mailto:info@grindcaststudio.sk">info@grindcaststudio.sk</a>
            <span>+421 907 513 318</span>
          </div>
        <div className="footer-social">
          <a
            className="social-icon instagram"
            href="https://www.instagram.com/grindcaststudio/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Grindcast"
          >
            <img src="/grindcast-studio-web/icons/instagram.svg" alt="Instagram" />
          </a>
        </div>
        <p className="footer-meta">© {new Date().getFullYear()} Grindcast Studio Bratislava</p>
      </footer>
    </div>
  );
}

export default App;
