import { useI18n } from '../i18n/I18nProvider';
import './LanguageSwitcher.css';

export function LanguageSwitcher() {
  const { language, switchLanguage } = useI18n();

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${language === 'sk' ? 'active' : ''}`}
        onClick={() => switchLanguage('sk')}
        aria-label="Switch to Slovak"
      >
        SK
      </button>
      <button
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => switchLanguage('en')}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}


