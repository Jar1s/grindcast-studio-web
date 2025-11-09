# Cloudflare Worker Setup - Google Reviews API

Tento dokument popisuje, ako nastaviť Cloudflare Worker pre automatické načítavanie recenzií z Google Places API.

## Prečo Cloudflare Worker?

- **Zadarmo** - Cloudflare Workers má generózny free tier (100,000 požiadaviek/deň)
- **Funguje s GitHub Pages** - nemusíte meniť hosting
- **Rieši CORS problémy** - Worker funguje ako proxy medzi frontendom a Google Places API
- **Rýchle** - Cloudflare má globálnu CDN sieť

## Krok za krokom:

### 1. Vytvorte Cloudflare účet
- Prejdite na: https://workers.cloudflare.com/
- Vytvorte si účet (zadarmo)

### 2. Prejdite na správne miesto
- V ľavom menu kliknite na **"Workers & Pages"** (NIE "Workers for Platforms")
- Alebo prejdite priamo na: https://dash.cloudflare.com/?to=/:account/workers
- Kliknite na **"Create application"** alebo **"Create Worker"**
- Vyberte **"Create Worker"** (nie "Workers for Platforms")
- Dajte mu názov (napr. `google-reviews`)
- Vložte kód z `cloudflare-worker.js`

### 3. Nastavte Environment Variable
- V Settings → Variables → Environment Variables
- Pridajte: `GOOGLE_PLACES_API_KEY` = `AIzaSyC_kpuGAFWGthkAwn_wB_qz4F00Bdhxll8`
- (Alebo použite váš vlastný API kľúč)

### 4. Deploy Worker
- Kliknite na "Deploy"
- Skopírujte URL Worker-a (napr. `https://google-reviews.your-username.workers.dev`)

### 5. Aktualizujte kód
- Otvorte: `src/components/GoogleBusinessWidget.jsx`
- Nájdite riadok 42: `const apiUrl = import.meta.env.PROD ? 'https://google-reviews.grindcast.workers.dev'`
- Nahraďte URL vašim Cloudflare Worker URL

### 6. Testovanie
- Spustite `npm run dev`
- Recenzie by sa mali automaticky načítať z Google Places API

## Alternatíva: Netlify Functions

Ak chcete použiť Netlify namiesto Cloudflare:
1. Presuňte hosting na Netlify
2. Netlify funkcie už sú vytvorené v `netlify/functions/google-reviews.js`
3. Netlify automaticky spustí funkcie pri deploymente

## Bezplatné riešenie (manuálne aktualizovanie)

Ak nechcete nastavovať Cloudflare Worker, môžete:
1. Manuálne aktualizovať recenzie v `src/components/GoogleBusinessWidget.jsx`
2. Komponenta automaticky použije fallback recenzie, ak API volanie zlyhá

