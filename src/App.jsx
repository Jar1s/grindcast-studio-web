import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import "./App.css";
import { useI18n } from "./i18n/I18nProvider";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import GoogleBusinessWidget from "./components/GoogleBusinessWidget";
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

const CALENDLY_URL = "https://calendly.com/grindcaststudio/new-meeting";

// Form validation and enhancement
const validateForm = (formData, t) => {
  const errors = {};
  
  if (!formData.name?.trim()) {
    errors.name = t("contact.validation.nameRequired");
  }
  
  if (!formData.email?.trim()) {
    errors.email = t("contact.validation.emailRequired");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = t("contact.validation.emailInvalid");
  }
  
  if (!formData.phone?.trim()) {
    errors.phone = t("contact.validation.phoneRequired");
  }
  
  if (!formData['preferred-date']) {
    errors['preferred-date'] = t("contact.validation.dateRequired");
  } else {
    const selectedDate = new Date(formData['preferred-date']);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors['preferred-date'] = t("contact.validation.datePast");
    }
  }
  
  if (!formData['preferred-time']) {
    errors['preferred-time'] = t("contact.validation.timeRequired");
  }
  
  if (!formData['service-type']) {
    errors['service-type'] = t("contact.validation.serviceRequired");
  }
  
  if (!formData.billing?.trim()) {
    errors.billing = t("contact.validation.billingRequired");
  }
  
  if (!formData.guests?.trim()) {
    errors.guests = t("contact.validation.guestsRequired");
  }
  
  return errors;
};

const createHandleFormSubmit = (t) => async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  
  const errors = validateForm(data, t);
  
  if (Object.keys(errors).length > 0) {
    // Show validation errors
    Object.keys(errors).forEach(fieldName => {
      const field = e.target.querySelector(`[name="${fieldName}"]`);
      if (field) {
        field.style.borderColor = '#e74c3c';
        field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
      }
    });
    
    alert(t("contact.validation.fillAllFields"));
    return false;
  }
  
  // Clear any previous error styling
  e.target.querySelectorAll('input, select, textarea').forEach(field => {
    field.style.borderColor = '';
    field.style.boxShadow = '';
  });
  
  // Submit via EmailJS
  try {
    await emailjs.send(
      'service_64040au',
      'template_r4zniu8',
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        billing: data.billing,
        'preferred-date': data['preferred-date'],
        'preferred-time': data['preferred-time'],
        'service-type': data['service-type'],
        guests: data.guests || '0',
        message: data.message || t("contact.messages.none")
      },
      'S3qDc0FdS4g1VH59l'
    );
    
    // Track Google Ads conversion - Odoslanie formulára pre potenciálnych zákazníkov
    // Používame funkciu gtag_report_conversion s ochranou proti dvojitému odpáleniu
    if (typeof window.gtag_report_conversion === 'function') {
      window.gtag_report_conversion();
    } else if (typeof gtag !== 'undefined') {
      // Fallback na priamy gtag call, ak funkcia nie je dostupná
      gtag('event', 'conversion', {
        'send_to': 'AW-17693861384/dyqACIPWiLObEIjMi_VB',
        'value': 1.0,
        'currency': 'EUR'
      });
    }
    
    alert(t("contact.messages.success"));
    e.target.reset();
  } catch (error) {
    console.error('EmailJS error:', error);
    alert(t("contact.messages.error"));
  }
};

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
    question: "Aké máme vybavenie v štúdiu?",
    answer:
      "Naše štúdio je vybavené 4x Rode Pod Mic mikrofónmi, 1x Rodecaster Pro 2 mixážnym pultom, profesionálnym štúdiovým osvetlením, 2x Sony Alpha ZV-E10 II kamerami a 1x Sony A6400 kamerou.",
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
      "Vyberte si balík a dĺžku nahrávania, kliknite na Rezervovať a vyplňte rezervačný formulár. Po odoslaní vám do 24 hodín pošleme detailnú prípravu a checklist.",
  },
  {
    question: "Kde sa dá zaparkovať a ako sa k nám dostanete MHD?",
    answer:
      "Parkovanie je dostupné priamo v areáli štúdia. MHD zastávka je v bezprostrednej blízkosti - autobusy a električky zastavujú na zastávke 'Betliarska', ktorá je len 2 minúty chôdze od štúdia.",
  },
];

const packages = [
  {
    title: "Základný záznam",
    description:
      "Po nahrávaní dostanete všetky audio a video súbory pripravené pre vašu ďalšiu úpravu.",
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
  const { t, language } = useI18n();
  const [activeSession, setActiveSession] = useState("1h");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get translated data based on language
  const navigation = [
    { href: "#cennik", label: t("navigation.pricing") },
    { href: "#ponuka", label: t("navigation.offer") },
    { href: "#faq", label: t("navigation.faq") },
    { href: "#kontakt", label: t("navigation.contact") },
  ];

  const sessionOptions = [
    { id: "1h", label: t("pricing.sessions.1h"), minutes: 60 },
    { id: "2h", label: t("pricing.sessions.2h"), minutes: 120 },
    { id: "3h", label: t("pricing.sessions.3h"), minutes: 180 },
  ];

  const services = [
    {
      title: t("services.recording.title"),
      description: t("services.recording.description"),
      icon: "🎙️",
    },
    {
      title: t("services.technical.title"),
      description: t("services.technical.description"),
      icon: "🛠️",
    },
    {
      title: t("services.postproduction.title"),
      description: t("services.postproduction.description"),
      icon: "🎬",
    },
  ];

  const faqs = t("faq.questions") || [];

  const recordings = [
    {
      title: "Leader X Cast",
      description: t("recordings.leaderXCast"),
      thumbnail: lxcLogo,
      url: "https://www.youtube.com/@jaroslavbircak",
    },
    {
      title: "Grindcast",
      description: t("recordings.grindcast"),
      thumbnail: grindcastLogo,
      url: "https://www.youtube.com/@grindsetacademy.",
    },
    {
      title: "ReCode Body Príbeh",
      description: t("recordings.recodeBody"),
      thumbnail: recodeAudioCover,
      url: "https://www.mirkaluberdova.sk/recodebody/",
      isAudioBook: true,
    },
  ];

  const packages = [
    {
      title: t("pricing.packages.basic.title"),
      description: t("pricing.packages.basic.description"),
      pricing: {
        "1h": { price: "149 €", note: t("pricing.vatNote") },
        "2h": { price: "239 €", note: t("pricing.vatNote") },
        "3h": { price: "329 €", note: t("pricing.vatNote") },
      },
      features: [
        t("pricing.packages.basic.features.recording"),
        t("pricing.packages.basic.features.cameras"),
        t("pricing.packages.basic.features.audio"),
        t("pricing.packages.basic.features.technician"),
      ],
    },
    {
      title: t("pricing.packages.complete.title"),
      description: t("pricing.packages.complete.description"),
      pricing: {
        "1h": { price: "249 €", note: t("pricing.vatNote") },
        "2h": { price: "339 €", note: t("pricing.vatNote") },
        "3h": { price: "429 €", note: t("pricing.vatNote") },
      },
      highlighted: true,
      features: [
        t("pricing.packages.complete.features.recording"),
        t("pricing.packages.complete.features.editing"),
        t("pricing.packages.complete.features.grading"),
        t("pricing.packages.complete.features.revisions"),
      ],
    },
    {
      title: t("pricing.packages.completePro.title"),
      description: t("pricing.packages.completePro.description"),
      pricing: {
        "1h": { price: "299 €", note: t("pricing.vatNote") },
        "2h": { price: "389 €", note: t("pricing.vatNote") },
        "3h": { price: "479 €", note: t("pricing.vatNote") },
      },
      features: [
        t("pricing.packages.completePro.features.recording"),
        t("pricing.packages.completePro.features.editing"),
        t("pricing.packages.completePro.features.grading"),
        t("pricing.packages.completePro.features.clips"),
      ],
    },
  ];

  // Date picker allows all days including weekends
  useEffect(() => {
    // No restrictions on weekends - booking available 7 days a week
  }, []);
  const activeSessionMeta =
    sessionOptions.find((option) => option.id === activeSession) || sessionOptions[0];
  const heroReveal = useScrollReveal(0.35);
  const pricingReveal = useScrollReveal(0.25, 0.1);
  const reviewsReveal = useScrollReveal(0.25, 0.125);
  const servicesReveal = useScrollReveal(0.25, 0.15);
  const recordingsReveal = useScrollReveal(0.2, 0.25);
  const galleryReveal = useScrollReveal(0.2, 0.3);
  const faqReveal = useScrollReveal(0.2, 0.35);
  const contactReveal = useScrollReveal(0.2, 0.4);


  return (
    <div className="page">
      <header className="top-bar" role="banner">
        <button 
          className="logo" 
          aria-label={t("hero.ariaLabelStudio")}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="logo-word">Grindcast</span>
        </button>
        
        {/* Desktop Navigation */}
        <nav className="nav desktop-nav" role="navigation" aria-label={t("common.ariaNav")}>
          {navigation.map((item) => (
            <a key={item.href} href={item.href} aria-label={`${t("common.ariaSection")} ${item.label}`}>
              {item.label}
            </a>
          ))}
          <a
            className="cta-button"
            href="#rezervacia"
            aria-label={`${t("common.ariaSection")} ${t("contact.title")}`}
          >
            {t("navigation.book")}
          </a>
        </nav>

        {/* Mobile Header */}
        <div className="mobile-header">
          <a
            className="mobile-rezervacia"
            href="#rezervacia"
            aria-label="Prejsť na sekciu kontakt a rezervácia"
          >
            Rezervácia
          </a>
          
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
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              className="mobile-nav"
              initial={{ right: "-100%" }}
              animate={{ right: "0" }}
              exit={{ right: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
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
                href="#rezervacia"
                aria-label="Prejsť na sekciu cenník"
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
            <span className="overline">{t("hero.overline")}</span>
            <h1 id="hero-heading">{t("hero.title")}</h1>
            <p>
              {t("hero.description")}
            </p>
            <div className="hero-actions">
              <a
                className="cta-button"
                href="#rezervacia"
                aria-label={t("common.ariaSection") + " " + t("contact.title")}
              >
                {t("hero.cta")}
              </a>
              <a 
                className="secondary-button" 
                href="#cennik"
                aria-label={t("common.ariaSection") + " " + t("pricing.title")}
              >
                {t("hero.ctaSecondary")}
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
              alt={t("common.altTech")}
              loading="eager"
              fetchpriority="high"
              className="hero-visual-primary"
              initial={{ y: 20 }}
              animate={{ y: 0, transition: { duration: 1.2, delay: 0.3 } }}
            />
            <motion.img
              src={detailMic}
              alt={t("common.altMic")}
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
                <img src={imageSrc} alt={t("gallery.alt")} />
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
            <span className="section-overline">{t("pricing.overline")}</span>
            <h2>{t("pricing.title")}</h2>
            <p className="pricing-subtitle single-line" dangerouslySetInnerHTML={{__html: t("pricing.discount")}} />
          </div>
          <div className="pricing-tabs" role="tablist" aria-label={t("pricing.sessionDuration")}>
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
                  href="#rezervacia"
                  aria-label="Rezervovať termín v podcastovom štúdiu"
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

        {/* Reviews Section */}
        <motion.section
          ref={reviewsReveal.ref}
          className="section"
          initial={{ opacity: 0, y: 40 }}
          animate={reviewsReveal.controls}
        >
          <GoogleBusinessWidget />
        </motion.section>

        <motion.section
          ref={servicesReveal.ref}
          id="ponuka"
          className="section"
          initial={{ opacity: 0, y: 40 }}
          animate={servicesReveal.controls}
        >
          <div className="section-header">
            <span className="section-overline">{t("services.overline")}</span>
            <h2>{t("services.title")}</h2>
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
            <span className="section-overline">{t("recordings.overline")}</span>
            <h2>{t("recordings.title")}</h2>
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
                aria-label={`${item.isAudioBook ? t("recordings.viewAudio") : t("recordings.viewVideo")}: ${item.title}`}
              >
                <img 
                  src={item.thumbnail} 
                  alt={`${item.title} - ${item.description}`} 
                  loading="lazy" 
                />
                <div className="recording-overlay">
                  <div className="recording-text">
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                    <span className="recording-label">
                      {item.isAudioBook ? t("recordings.viewAudio") : t("recordings.viewVideo")}
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
          <div className="media-embed">
            <div className="media-embed-item">
              <h3>{t("recordings.audioPodcast")}</h3>
              <iframe
                title="Spotify podcast ukážka"
                src="https://open.spotify.com/embed/episode/1BTeeUOHah25Dq77qrBEvc?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                onLoad={() => {}}
                onError={(e) => {
                  // Silently handle iframe loading errors
                  e.preventDefault();
                }}
              />
            </div>
            <div className="media-embed-item">
              <h3>{t("recordings.videoPodcast")}</h3>
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube-nocookie.com/embed/12xM50O3UlU?start=347"
                title="YouTube ukážka podcastu"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                onLoad={() => {}}
                onError={(e) => {
                  // Silently handle iframe loading errors
                  e.preventDefault();
                }}
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          ref={contactReveal.ref}
          className="section contact"
          initial={{ opacity: 0, y: 40 }}
          animate={contactReveal.controls}
        >
          <div id="rezervacia" className="contact-card">
            <div className="section-header">
            <span className="section-overline">{t("contact.overline")}</span>
            <h2>{t("contact.title")}</h2>
            </div>
            
            {/* Custom Booking Form */}
            <form 
              name="booking" 
              className="booking-form"
              onSubmit={createHandleFormSubmit(t)}
            >
              
              <div className="form-section">
                <h3>📞 Kontaktné informácie</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Meno a priezvisko *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      placeholder="Vaše meno a priezvisko"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      placeholder="vas@email.sk"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Telefónne číslo *</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      required 
                      placeholder="+421 123 456 789"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="billing">Fakturačné údaje (adresa alebo IČO) *</label>
                    <input 
                      type="text" 
                      id="billing" 
                      name="billing" 
                      required 
                      placeholder="Adresa bydliska alebo IČO"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>📅 Detaily rezervácie</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="preferred-date">Preferovaný dátum *</label>
                    <input 
                      type="date" 
                      id="preferred-date" 
                      name="preferred-date" 
                      required 
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="preferred-time">Preferovaný čas *</label>
                    <select id="preferred-time" name="preferred-time" required>
                      <option value="">Vyberte čas</option>
                      <option value="07:00">07:00</option>
                      <option value="07:30">07:30</option>
                      <option value="08:00">08:00</option>
                      <option value="08:30">08:30</option>
                      <option value="09:00">09:00</option>
                      <option value="09:30">09:30</option>
                      <option value="10:00">10:00</option>
                      <option value="10:30">10:30</option>
                      <option value="11:00">11:00</option>
                      <option value="11:30">11:30</option>
                      <option value="12:00">12:00</option>
                      <option value="12:30">12:30</option>
                      <option value="13:00">13:00</option>
                      <option value="13:30">13:30</option>
                      <option value="14:00">14:00</option>
                      <option value="14:30">14:30</option>
                      <option value="15:00">15:00</option>
                      <option value="15:30">15:30</option>
                      <option value="16:00">16:00</option>
                      <option value="16:30">16:30</option>
                      <option value="17:00">17:00</option>
                      <option value="17:30">17:30</option>
                      <option value="18:00">18:00</option>
                      <option value="18:30">18:30</option>
                      <option value="19:00">19:00</option>
                      <option value="19:30">19:30</option>
                      <option value="20:00">20:00</option>
                      <option value="20:30">20:30</option>
                      <option value="21:00">21:00</option>
                      <option value="21:30">21:30</option>
                      <option value="22:00">22:00</option>
                      <option value="22:30">22:30</option>
                      <option value="23:00">23:00</option>
                      <option value="23:30">23:30</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="service-type">Typ služby *</label>
                    <select id="service-type" name="service-type" required>
                      <option value="">Vyberte službu</option>
                      <option value="1h-zakladna">1h - Základný záznam (149€)</option>
                      <option value="2h-zakladna">2h - Základný záznam (239€)</option>
                      <option value="3h-zakladna">3h - Základný záznam (329€)</option>
                      <option value="1h-kompletna">1h - Kompletná postprodukcia (249€)</option>
                      <option value="2h-kompletna">2h - Kompletná postprodukcia (339€)</option>
                      <option value="3h-kompletna">3h - Kompletná postprodukcia (429€)</option>
                      <option value="1h-pro">1h - Kompletná postprodukcia Pro (349€)</option>
                      <option value="2h-pro">2h - Kompletná postprodukcia Pro (449€)</option>
                      <option value="3h-pro">3h - Kompletná postprodukcia Pro (549€)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>💬 Dodatočné informácie</h3>
                <div className="form-group">
                  <label htmlFor="guests">Počet hostí *</label>
                  <input 
                    type="number" 
                    id="guests" 
                    name="guests" 
                    min="1" 
                    max="4" 
                    required
                    placeholder="Koľko ľudí bude v štúdiu?"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Vaša správa alebo otázka</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="4" 
                    placeholder="Máte nejaké špeciálne požiadavky alebo otázky?"
                  ></textarea>
                </div>
              </div>

              <div className="form-submit">
                <button type="submit" className="cta-button">
                  📅 Odoslať rezervačnú požiadavku
                </button>
                <p className="form-note">
                  Po odoslaní formulára vás budeme kontaktovať do 24 hodín na potvrdenie termínu.
                </p>
              </div>
            </form>
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
            <span className="section-overline">{t("faq.overline")}</span>
            <h2>{t("faq.title")}</h2>
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
      </main>

      <footer id="kontakt" className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <strong>Grindcast Studio Bratislava</strong>
            <p>
              Melrose Apartments<br />
              Betliarska 3769/12<br />
              851 07 Bratislava – Petržalka<br />
              Slovenská republika
            </p>
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
              aria-label={t("footer.ariaLabel")}
            >
              <img src="/icons/instagram.svg" alt="Instagram" />
            </a>
          </div>
          <div className="footer-language">
            <LanguageSwitcher />
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-meta">© {new Date().getFullYear()} Grindcast Studio Bratislava</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
