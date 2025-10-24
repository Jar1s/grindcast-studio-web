# Podcast Studio Bratislava

Jednostránkový web v Reacte pre podcastové štúdio v Bratislave. Projekt je postavený na [Vite](https://vitejs.dev/) a pripravený na nasadenie na GitHub Pages.

## Lokálny vývoj

1. Nainštalujte závislosti:
   ```bash
   npm install
   ```
2. Spustite vývojársky server:
   ```bash
   npm run dev
   ```
   Aplikácia beží na `http://localhost:5173`.

## Build

```bash
npm run build
```

Výstup nájdete v priečinku `dist/`.

## Nasadenie na GitHub Pages

1. Uistite sa, že máte vytvorený vzdialený repozitár na GitHube v tvare `uzivatel/uzivatel.github.io` alebo `uzivatel/nazov-repozitara`.
2. Ak nasadzujete na `uzivatel.github.io`, v súbore `vite.config.js` môžete ponechať `base: "/"`.  
   Pre projektové repozitáre zmeňte `base` nasledovne:
   ```js
   export default defineConfig({
     plugins: [react()],
     base: "/nazov-repozitara/",
   });
   ```
3. Spustite build:
   ```bash
   npm run build
   ```
4. Deploy príkaz odošle obsah `dist/` do vetvy `gh-pages`:
   ```bash
   npm run deploy
   ```
5. V nastaveniach GitHubu povoľte GitHub Pages pre vetvu `gh-pages`.

## Úprava obsahu

Texty, sekcie a odkazy sú v súbore `src/App.jsx`. Globálne štýly sú v `src/App.css` a `src/styles.css`.

- URL pre rezerváciu (Calendly) je v konštante `CALENDLY_URL` v `src/App.jsx`.
- Embed mapy využíva Google Maps URL. Ak máte vlastný embed kód, nahraďte hodnotu v `iframe`.
- Cenník nájdete v poli `packages` v `src/App.jsx`. Ceny podľa dĺžky sú definované v mapách `pricing` a dostupné dĺžky upravíte v `sessionOptions`.
- Videá v sekcii „Natáčali sme“ sú v poli `recordings` v `src/App.jsx`. Pre každý projekt upravte `title`, `description`, `thumbnail` a `url`.
- Hostia v sekcii „Naši hostia“ sú v poli `hosts` v `src/App.jsx`. Aktualizujte mená, popisy a fotografie podľa vašich projektov.
- Animácie sú riešené cez [Framer Motion](https://www.framer.com/motion/) – pri pridávaní nových sekcií môžete použiť `useScrollReveal` helper v `src/App.jsx`.
