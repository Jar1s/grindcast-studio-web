/**
 * Tracking Diagnostics Tool
 * 
 * Tento nástroj pomáha diagnostikovať problémy s trackingom.
 * Použitie: Otvorte konzolu v prehliadači a zavolajte checkTracking()
 */

export const checkTracking = () => {
  const results = {
    googleAnalytics: false,
    googleAds: false,
    facebookPixel: false,
    emailJS: false,
    errors: []
  };

  console.log('%c🔍 DIAGNOSTIKA TRACKINGU', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
  console.log('=====================================');

  // 1. Google Analytics
  if (typeof gtag !== 'undefined') {
    results.googleAnalytics = true;
    console.log('✅ Google Analytics: FUNGUJE');
    console.log('   - gtag je dostupný');
  } else {
    results.googleAnalytics = false;
    results.errors.push('Google Analytics (gtag) nie je dostupný');
    console.log('❌ Google Analytics: NEFUNGUJE');
    console.log('   - gtag nie je definovaný');
  }

  // 2. Google Ads Conversion
  if (typeof window.gtag_report_conversion === 'function') {
    results.googleAds = true;
    console.log('✅ Google Ads Conversion: FUNGUJE');
    console.log('   - gtag_report_conversion je dostupný');
  } else if (typeof gtag !== 'undefined') {
    results.googleAds = true;
    console.log('✅ Google Ads Conversion: FUNGUJE (fallback)');
    console.log('   - gtag je dostupný, môže použiť priamy gtag call');
  } else {
    results.googleAds = false;
    results.errors.push('Google Ads Conversion tracking nie je dostupný');
    console.log('❌ Google Ads Conversion: NEFUNGUJE');
    console.log('   - gtag_report_conversion nie je definovaný');
  }

  // 3. Facebook Pixel
  if (typeof fbq !== 'undefined') {
    results.facebookPixel = true;
    console.log('✅ Facebook Pixel: FUNGUJE');
    console.log('   - fbq je dostupný');
    
    // Skontrolovať, či je Pixel ID nastavený
    try {
      // Pokúsiť sa zistiť Pixel ID z localStorage alebo cookies
      const pixelId = window._fbq?.queue?.[0]?.[1] || 'Neznáme';
      if (pixelId === 'YOUR_PIXEL_ID' || pixelId === 'Neznáme') {
        console.log('⚠️  Facebook Pixel ID: MOŽNO NENASTAVENÝ');
        console.log('   - Skontrolujte, či ste nahradili YOUR_PIXEL_ID v index.html');
        results.errors.push('Facebook Pixel ID môže byť nenastavený (YOUR_PIXEL_ID)');
      } else {
        console.log(`   - Pixel ID: ${pixelId}`);
      }
    } catch (e) {
      console.log('⚠️  Facebook Pixel ID: NEDÁ SA OVERIŤ');
    }
  } else {
    results.facebookPixel = false;
    results.errors.push('Facebook Pixel (fbq) nie je dostupný - možno je blokovaný ad blockerom');
    console.log('❌ Facebook Pixel: NEFUNGUJE');
    console.log('   - fbq nie je definovaný');
    console.log('   - Možné príčiny:');
    console.log('     • Ad blocker blokuje Facebook Pixel');
    console.log('     • Pixel ID nie je nastavený (YOUR_PIXEL_ID)');
    console.log('     • CSP blokuje Facebook domény');
  }

  // 4. EmailJS
  if (typeof emailjs !== 'undefined') {
    results.emailJS = true;
    console.log('✅ EmailJS: FUNGUJE');
    console.log('   - emailjs je dostupný');
  } else {
    results.emailJS = false;
    results.errors.push('EmailJS nie je dostupný');
    console.log('❌ EmailJS: NEFUNGUJE');
    console.log('   - emailjs nie je definovaný');
  }

  // 5. Facebook Conversion Function
  if (typeof window.fb_report_conversion === 'function') {
    console.log('✅ Facebook Conversion Function: FUNGUJE');
    console.log('   - fb_report_conversion je dostupný');
  } else {
    console.log('⚠️  Facebook Conversion Function: NEDOSTUPNÝ');
    console.log('   - fb_report_conversion nie je definovaný');
    console.log('   - Použije sa fallback na priamy fbq call');
  }

  // 6. Skontrolovať UTM parametre
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  
  if (utmSource || utmMedium || utmCampaign) {
    console.log('✅ UTM Parametre: DETEGOVANÉ');
    console.log(`   - utm_source: ${utmSource || 'žiadny'}`);
    console.log(`   - utm_medium: ${utmMedium || 'žiadny'}`);
    console.log(`   - utm_campaign: ${utmCampaign || 'žiadny'}`);
  } else {
    console.log('ℹ️  UTM Parametre: ŽIADNE');
    console.log('   - Stránka bola navštívená priamo alebo bez UTM parametrov');
  }

  // 7. Skontrolovať sessionStorage pre UTM
  const storedUtmSource = sessionStorage.getItem('utm_source');
  const storedUtmMedium = sessionStorage.getItem('utm_medium');
  const storedUtmCampaign = sessionStorage.getItem('utm_campaign');
  
  if (storedUtmSource || storedUtmMedium || storedUtmCampaign) {
    console.log('✅ UTM Parametre v SessionStorage: ULOŽENÉ');
    console.log(`   - utm_source: ${storedUtmSource || 'žiadny'}`);
    console.log(`   - utm_medium: ${storedUtmMedium || 'žiadny'}`);
    console.log(`   - utm_campaign: ${storedUtmCampaign || 'žiadny'}`);
  }

  // 8. Skontrolovať CSP
  const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (metaCSP) {
    const cspContent = metaCSP.getAttribute('content');
    const hasFacebook = cspContent.includes('facebook.net') || cspContent.includes('facebook.com');
    const hasGoogle = cspContent.includes('google') || cspContent.includes('googletagmanager.com');
    
    if (hasFacebook && hasGoogle) {
      console.log('✅ Content Security Policy: OK');
      console.log('   - Facebook a Google domény sú povolené');
    } else {
      console.log('⚠️  Content Security Policy: MOŽNÝ PROBLÉM');
      if (!hasFacebook) {
        console.log('   - Facebook domény môžu byť blokované');
        results.errors.push('CSP možno blokuje Facebook domény');
      }
      if (!hasGoogle) {
        console.log('   - Google domény môžu byť blokované');
        results.errors.push('CSP možno blokuje Google domény');
      }
    }
  }

  // Zhrnutie
  console.log('=====================================');
  console.log('%c📊 ZHRNUTIE', 'color: #2196F3; font-size: 14px; font-weight: bold;');
  
  const allWorking = results.googleAnalytics && results.googleAds && results.facebookPixel && results.emailJS;
  
  if (allWorking) {
    console.log('%c✅ Všetko funguje správne!', 'color: #4CAF50; font-weight: bold;');
  } else {
    console.log('%c⚠️  Nájdené problémy:', 'color: #FF9800; font-weight: bold;');
    results.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
  }

  // Odporúčania
  console.log('=====================================');
  console.log('%c💡 ODORÚČANIA', 'color: #9C27B0; font-size: 14px; font-weight: bold;');
  
  if (!results.facebookPixel) {
    console.log('1. ⚠️  NASTAVTE FACEBOOK PIXEL ID');
    console.log('   - Choďte do Meta Events Manager');
    console.log('   - Skopírujte Pixel ID');
    console.log('   - Nahraďte YOUR_PIXEL_ID v index.html');
  }
  
  if (!results.googleAds) {
    console.log('2. ⚠️  SKONTROLUJTE GOOGLE ADS CONVERSION TRACKING');
    console.log('   - Choďte do Google Ads → Conversions');
    console.log('   - Skontrolujte, či je conversion action aktívna');
  }
  
  if (results.errors.length === 0) {
    console.log('✅ Všetko vyzerá dobre! Tracking by mal fungovať správne.');
  }

  return results;
};

// Automaticky spustiť diagnostiku pri načítaní (len v development móde)
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Pridať do window pre jednoduchý prístup z konzoly
  window.checkTracking = checkTracking;
  
  // Automaticky spustiť po 2 sekundách
  setTimeout(() => {
    console.log('%c💡 Tip: Zavolajte checkTracking() v konzole pre diagnostiku', 'color: #9C27B0; font-style: italic;');
  }, 2000);
}

export default checkTracking;







