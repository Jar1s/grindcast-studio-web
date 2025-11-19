import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import "./App.css";
import { useI18n } from "./i18n/I18nProvider";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import GoogleBusinessWidget from "./components/GoogleBusinessWidget";
import checkTracking from "./utils/trackingDiagnostics";
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

// Form field tracking function
const trackFormFieldInteraction = (fieldName, action) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'form_field_interaction', {
      'field_name': fieldName,
      'action': action, // 'focus', 'blur', 'change'
      'form_type': 'booking_form'
    });
  }
  if (typeof fbq !== 'undefined') {
    fbq('track', 'ViewContent', {
      content_name: `Form Field: ${fieldName}`,
      content_category: action
    });
  }
};

// Conversion funnel tracking function
const trackFunnelStep = (step, data = {}) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'funnel_step', {
      'funnel_step': step,
      'funnel_type': 'booking',
      ...data
    });
  }
  if (typeof fbq !== 'undefined') {
    fbq('track', 'ViewContent', {
      content_name: step,
      content_category: 'conversion_funnel',
      ...data
    });
  }
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
        'send_to': 'AW-17693861384/dyqACIPWiL0bEljMi_VB',
        'value': 1.0,
        'currency': 'EUR'
      });
    }
    
    // Track Facebook conversion - Odoslanie formulára
    if (typeof window.fb_report_conversion === 'function') {
      // Vypočítame hodnotu na základe vybranej služby
      const serviceValue = data['service-type']?.includes('pro') ? 299 : 
                          data['service-type']?.includes('kompletna') ? 249 : 149;
      window.fb_report_conversion('Lead', serviceValue, 'EUR');
    } else if (typeof fbq !== 'undefined') {
      // Fallback na priamy fbq call
      const serviceValue = data['service-type']?.includes('pro') ? 299 : 
                          data['service-type']?.includes('kompletna') ? 249 : 149;
      fbq('track', 'Lead', {
        value: serviceValue,
        currency: 'EUR',
        content_name: 'Booking Form Submission'
      });
    }
    
    // Track Google Analytics event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submission', {
        'form_type': 'booking_form',
        'form_name': 'booking',
        'value': 1
      });
    }
    
    // Track conversion funnel - form submitted
    trackFunnelStep('form_submitted', {
      service_type: data['service-type'],
      guests: data.guests,
      utm_source: sessionStorage.getItem('utm_source') || 'direct',
      utm_medium: sessionStorage.getItem('utm_medium') || 'none',
      utm_campaign: sessionStorage.getItem('utm_campaign') || 'none'
    });
    
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

function useScrollReveal(threshold = 0.25, delay = 0, language = 'sk') {
  const controls = useAnimation();
  const ref = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
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

    observerRef.current = observer;

    const node = ref.current;
    if (node) {
      // Check if element is already in viewport - if so, animate immediately
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isInViewport = 
        rect.top < viewportHeight * (1 - threshold) &&
        rect.bottom > viewportHeight * threshold;
      
      if (isInViewport) {
        // Element is already visible, animate immediately
        controls.start({
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
        });
      } else {
        // Element not in viewport, set initial state and observe
        controls.set({ opacity: 0, y: 40 });
        observer.observe(node);
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [controls, threshold, delay, language]);

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
    
    // ========== UTM PARAMETER TRACKING ==========
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    
      if (utmSource || utmMedium || utmCampaign) {
        if (typeof gtag !== 'undefined') {
          // Store UTM in custom parameters
          gtag('event', 'page_view_utm', {
            'utm_source': utmSource || 'direct',
            'utm_medium': utmMedium || 'none',
            'utm_campaign': utmCampaign || 'none'
          });
        }
      if (typeof fbq !== 'undefined') {
        fbq('track', 'PageView', {
          content_name: utmCampaign || 'direct',
          content_category: utmSource || 'direct'
        });
      }
      
      // Store in sessionStorage for conversion tracking
      sessionStorage.setItem('utm_source', utmSource || 'direct');
      sessionStorage.setItem('utm_medium', utmMedium || 'none');
      sessionStorage.setItem('utm_campaign', utmCampaign || 'none');
    }
    
    // ========== HEATMAP TRACKING (Click Positions) ==========
    const trackClick = (e) => {
      // Ignore clicks on form elements to avoid spam
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      const clickX = Math.round((e.clientX / window.innerWidth) * 100);
      const clickY = Math.round((e.clientY / window.innerHeight) * 100);
      const element = e.target.tagName;
      const elementText = e.target.textContent?.substring(0, 50) || '';
      const elementId = e.target.id || '';
      const elementClass = e.target.className || '';
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click_position', {
          'x_percent': clickX,
          'y_percent': clickY,
          'element_type': element,
          'element_id': elementId,
          'element_class': elementClass,
          'click_text': elementText
        });
      }
    };
    
    document.addEventListener('click', trackClick, { passive: true });
    
    // ========== FORM ABANDONMENT TRACKING ==========
    let formStartTime = null;
    let formFieldsStarted = new Set();
    let formAbandonmentTracked = false;
    let abandonmentTimeout = null;
    
    const form = document.querySelector('.booking-form');
    
    // Track when user starts filling form
    const handleFormFocus = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
          if (!formStartTime) {
            formStartTime = Date.now();
            if (typeof gtag !== 'undefined') {
              gtag('event', 'form_start', {
                'form_type': 'booking_form',
                'form_name': 'booking'
              });
            }
          if (typeof fbq !== 'undefined') {
            fbq('track', 'InitiateCheckout', {
              content_name: 'Booking Form Started'
            });
          }
        }
        formFieldsStarted.add(e.target.name);
      }
    };
    
    // Track form abandonment
    const handleFormBlur = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        // Clear previous timeout
        if (abandonmentTimeout) {
          clearTimeout(abandonmentTimeout);
        }
        
        // Track abandonment after 10 seconds of inactivity
        abandonmentTimeout = setTimeout(() => {
          if (form && !form.checkValidity() && formFieldsStarted.size > 0 && !formAbandonmentTracked) {
            const timeSpent = formStartTime ? Math.round((Date.now() - formStartTime) / 1000) : 0;
            formAbandonmentTracked = true;
            
              if (typeof gtag !== 'undefined') {
                gtag('event', 'form_abandonment', {
                  'form_type': 'booking_form',
                  'fields_started': formFieldsStarted.size,
                  'time_spent_seconds': timeSpent,
                  'last_field': e.target.name || 'unknown'
                });
              }
            if (typeof fbq !== 'undefined') {
              fbq('track', 'AddToCart', {
                content_name: 'Form Abandoned',
                value: formFieldsStarted.size,
                currency: 'EUR'
              });
            }
          }
        }, 10000); // Track after 10 seconds of inactivity
      }
    };
    
    if (form) {
      form.addEventListener('focus', handleFormFocus, true);
      form.addEventListener('blur', handleFormBlur, true);
    }
    
    // ========== TRACK USER ENGAGEMENT EVENTS ==========
    const trackButtonClick = (buttonText, location) => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'button_click', {
          'button_text': buttonText,
          'button_location': location
        });
      }
      if (typeof fbq !== 'undefined') {
        fbq('track', 'ViewContent', {
          content_name: buttonText,
          content_category: location
        });
      }
    };
    
    // Track CTA button clicks (excluding ones with onClick handlers)
    const ctaButtons = document.querySelectorAll('.cta-button:not([onclick]), .secondary-button:not([onclick])');
    ctaButtons.forEach(button => {
      button.addEventListener('click', () => {
        trackButtonClick(button.textContent.trim(), 'header_or_hero');
      });
    });
    
    // ========== TRACK SCROLL DEPTH ==========
    let maxScroll = 0;
    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        // Track milestones: 25%, 50%, 75%, 100%
        if ([25, 50, 75, 100].includes(scrollPercent)) {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll_depth', {
              'scroll_percent': scrollPercent,
              'scroll_depth': `${scrollPercent}%`
            });
          }
        }
      }
    };
    window.addEventListener('scroll', trackScroll, { passive: true });
    
    // ========== TRACK TIME ON PAGE ==========
    setTimeout(() => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
          'name': 'time_on_page',
          'value': 30
        });
      }
    }, 30000);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', trackClick);
      ctaButtons.forEach(button => {
        button.removeEventListener('click', trackButtonClick);
      });
      window.removeEventListener('scroll', trackScroll);
      
      // Cleanup form event listeners
      const formElement = document.querySelector('.booking-form');
      if (formElement) {
        formElement.removeEventListener('focus', handleFormFocus, true);
        formElement.removeEventListener('blur', handleFormBlur, true);
      }
      
      // Clear any pending timeouts
      if (abandonmentTimeout) {
        clearTimeout(abandonmentTimeout);
      }
    };
    
    // ========== TRACKING DIAGNOSTICS (Development only) ==========
    // Make checkTracking available globally for debugging
    if (typeof window !== 'undefined') {
      window.checkTracking = checkTracking;
      
      // Auto-run diagnostics in development mode after page load
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          console.log('%c💡 Tip: Zavolajte checkTracking() v konzole pre diagnostiku trackingu', 'color: #9C27B0; font-style: italic;');
        }, 2000);
      }
    }
  }, []);
  const activeSessionMeta =
    sessionOptions.find((option) => option.id === activeSession) || sessionOptions[0];
  const heroReveal = useScrollReveal(0.35, 0, language);
  const pricingReveal = useScrollReveal(0.25, 0.1, language);
  const reviewsReveal = useScrollReveal(0.25, 0.125, language);
  const servicesReveal = useScrollReveal(0.25, 0.15, language);
  const recordingsReveal = useScrollReveal(0.2, 0.25, language);
  const galleryReveal = useScrollReveal(0.2, 0.3, language);
  const faqReveal = useScrollReveal(0.2, 0.35, language);
  const contactReveal = useScrollReveal(0.2, 0.4, language);


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
            aria-label={`${t("common.ariaSection")} ${t("contact.title")}`}
          >
            {t("navigation.reservation")}
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
                aria-label={`${t("common.ariaSection")} ${t("contact.title")}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("navigation.book")}
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
            
            {/* Social Proof */}
            <div className="hero-social-proof">
              <span className="social-proof-item">
                <strong>{t("hero.socialProof.clients")}</strong>
              </span>
              <span className="social-proof-separator">•</span>
              <span className="social-proof-item">
                <strong>{t("hero.socialProof.recordings")}</strong>
              </span>
            </div>
            
            <div className="hero-actions">
              <a
                className="cta-button"
                href="#rezervacia"
                aria-label={t("common.ariaSection") + " " + t("contact.title")}
                onClick={() => {
                  // Conversion funnel tracking
                  trackFunnelStep('hero_cta_click');
                }}
              >
                <span className="cta-icon">📅</span>
                {t("hero.cta")}
              </a>
              <a 
                className="secondary-button" 
                href="#cennik"
                aria-label={t("common.ariaSection") + " " + t("pricing.title")}
                onClick={() => {
                  // Conversion funnel tracking
                  trackFunnelStep('hero_secondary_cta_click');
                }}
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
            <span className="section-overline">{t("gallery.overline")}</span>
            <h2 id="gallery-heading">{t("gallery.title")}</h2>
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
                  aria-label={`${t("common.ariaSection")} ${t("contact.title")}`}
                  onClick={() => {
                    trackFunnelStep('pricing_cta_click', { 
                      package: pack.title,
                      session: activeSession
                    });
                  }}
                >
                  {t("pricing.bookButton")}
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
                <h3>{t("contact.contactInfo")}</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">{t("contact.form.name")} {t("contact.form.required")}</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      placeholder={t("contact.form.namePlaceholder")}
                      onFocus={() => trackFormFieldInteraction('name', 'focus')}
                      onChange={() => trackFormFieldInteraction('name', 'change')}
                      onBlur={() => trackFormFieldInteraction('name', 'blur')}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">{t("contact.form.email")} {t("contact.form.required")}</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      placeholder={t("contact.form.emailPlaceholder")}
                      onFocus={() => trackFormFieldInteraction('email', 'focus')}
                      onChange={() => trackFormFieldInteraction('email', 'change')}
                      onBlur={() => trackFormFieldInteraction('email', 'blur')}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">{t("contact.form.phone")} {t("contact.form.required")}</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      required 
                      placeholder={t("contact.form.phonePlaceholder")}
                      onFocus={() => trackFormFieldInteraction('phone', 'focus')}
                      onChange={() => trackFormFieldInteraction('phone', 'change')}
                      onBlur={() => trackFormFieldInteraction('phone', 'blur')}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="billing">{t("contact.form.billing")} {t("contact.form.required")}</label>
                    <input 
                      type="text" 
                      id="billing" 
                      name="billing" 
                      required 
                      placeholder={t("contact.form.billingPlaceholder")}
                      onFocus={() => trackFormFieldInteraction('billing', 'focus')}
                      onChange={() => trackFormFieldInteraction('billing', 'change')}
                      onBlur={() => trackFormFieldInteraction('billing', 'blur')}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>{t("contact.bookingDetails")}</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="preferred-date">{t("contact.form.date")} {t("contact.form.required")}</label>
                    <input 
                      type="date" 
                      id="preferred-date" 
                      name="preferred-date" 
                      required 
                      min={new Date().toISOString().split('T')[0]}
                      onFocus={() => trackFormFieldInteraction('preferred-date', 'focus')}
                      onChange={() => trackFormFieldInteraction('preferred-date', 'change')}
                      onBlur={() => trackFormFieldInteraction('preferred-date', 'blur')}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="preferred-time">{t("contact.form.time")} {t("contact.form.required")}</label>
                    <select 
                      id="preferred-time" 
                      name="preferred-time" 
                      required
                      onFocus={() => trackFormFieldInteraction('preferred-time', 'focus')}
                      onChange={() => trackFormFieldInteraction('preferred-time', 'change')}
                      onBlur={() => trackFormFieldInteraction('preferred-time', 'blur')}
                    >
                      <option value="">{t("contact.form.timeSelect")}</option>
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
                    <label htmlFor="service-type">{t("contact.form.service")} {t("contact.form.required")}</label>
                    <select 
                      id="service-type" 
                      name="service-type" 
                      required
                      onFocus={() => trackFormFieldInteraction('service-type', 'focus')}
                      onChange={() => trackFormFieldInteraction('service-type', 'change')}
                      onBlur={() => trackFormFieldInteraction('service-type', 'blur')}
                    >
                      <option value="">{t("contact.form.serviceSelect")}</option>
                      <option value="1h-zakladna">{t("contact.serviceOptions.1h-zakladna")}</option>
                      <option value="2h-zakladna">{t("contact.serviceOptions.2h-zakladna")}</option>
                      <option value="3h-zakladna">{t("contact.serviceOptions.3h-zakladna")}</option>
                      <option value="1h-kompletna">{t("contact.serviceOptions.1h-kompletna")}</option>
                      <option value="2h-kompletna">{t("contact.serviceOptions.2h-kompletna")}</option>
                      <option value="3h-kompletna">{t("contact.serviceOptions.3h-kompletna")}</option>
                      <option value="1h-pro">{t("contact.serviceOptions.1h-pro")}</option>
                      <option value="2h-pro">{t("contact.serviceOptions.2h-pro")}</option>
                      <option value="3h-pro">{t("contact.serviceOptions.3h-pro")}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>{t("contact.additionalInfo")}</h3>
                <div className="form-group">
                  <label htmlFor="guests">{t("contact.form.guests")} {t("contact.form.required")}</label>
                  <input 
                    type="number" 
                    id="guests" 
                    name="guests" 
                    min="1" 
                    max="4" 
                    required
                    placeholder={t("contact.form.guestsPlaceholder")}
                    onFocus={() => trackFormFieldInteraction('guests', 'focus')}
                    onChange={() => trackFormFieldInteraction('guests', 'change')}
                    onBlur={() => trackFormFieldInteraction('guests', 'blur')}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">{t("contact.form.message")}</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="4" 
                    placeholder={t("contact.form.messagePlaceholder")}
                    onFocus={() => trackFormFieldInteraction('message', 'focus')}
                    onChange={() => trackFormFieldInteraction('message', 'change')}
                    onBlur={() => trackFormFieldInteraction('message', 'blur')}
                  ></textarea>
                </div>
              </div>

              <div className="form-submit">
                <button type="submit" className="cta-button">
                  {t("contact.form.submit")}
                </button>
                <p className="form-note">
                  {t("contact.form.note")}
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
            <a href="tel:+421907513318" className="footer-phone">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '0.5rem'}}>
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              +421 907 513 318
            </a>
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
