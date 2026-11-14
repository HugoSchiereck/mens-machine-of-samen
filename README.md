# Mens, Machine of Samen?

Interactief spel voor de ICT open dag. Bezoekers swipen kaarten en raden wie iets maakte: een **mens**, een **machine** of **samen**. Na elke kaart zien ze wat AI deed, wat de mens deed en welke ICT-banen erachter zitten. Aan het eind krijgen ze hun **ICT-match**: de baan die het best past bij wat ze leuk vonden. Het volledige concept staat in het conceptdocument van de groep (`mens-machine-of-samen.md`).

## Starten

Je hebt [Node.js](https://nodejs.org) 20 of nieuwer nodig.

```bash
npm install
npm run open-dag      # bouwt de app en start de server
```

De server laat zien op welk adres hij draait, bijvoorbeeld:

```
Telefoon:     http://192.168.1.23:4747
Groot scherm: http://localhost:4747/scherm
Team-stats:   http://localhost:4747/stats
```

- **Telefoon:** zelfde wifi als de laptop, scan de QR-code op het grote scherm.
- **Groot scherm:** open `/scherm` op de laptop aan de tv of beamer, F11 voor volledig scherm.
- **Poort bezet?** `PORT=4848 npm start`

> **Let op wifi:** schoolnetwerken (eduroam) blokkeren vaak verkeer tussen apparaten. Werkt de QR-code niet, zet dan een hotspot aan op een telefoon en verbind laptop en spelers daarmee. Test dit vóór de open dag op de echte locatie.

Ontwikkelen met automatisch herladen: `npm run dev` en open `http://localhost:5173`.

## Pagina's

| Adres | Wat |
|---|---|
| `/` | Het spel op de telefoon |
| `/scherm` | Groot scherm: QR-code, live percentages, ranglijst, ouders tegen scholieren, angst voor/na, populairste match, banen in de spotlight |
| `/stats` | Team-dashboard: alle metingen uit hoofdstuk 13, leukste onderwerpen, matches, gesprekken turven |
| `/kaarten` | Kaartenoverzicht: alle kaarten met vlakken en fouten, om coördinaten te controleren |

## Zo loopt een bezoek

1. **Lobby:** bijnaam, scholier of ouder, hobbywereld, nulmeting angst (1–5).
2. **8 kaarten**, 10 seconden per kaart. Swipe links = mens, rechts = machine, omhoog = samen.
3. **Onthulling** na elke kaart: antwoord, uitleg, vlakken (groen = AI, blauw = mens), banen achter deze kaart, hoe anderen stemden, tijd en resultaat.
4. **"Hoe leuk vind je dit onderwerp?" (1–5).** Eén tik is meteen de volgende kaart.
5. **Bonuskaart:** vind de fouten in een inlogpagina.
6. **Eindmeting** angst (1–5).
7. **Jouw ICT-match:** percentage, waarom, wat AI doet en wat jij blijft doen, startsalaris, vakken.
8. **Eindscherm:** score, matches, AI-radar, angst voor/na, making-of, ranglijst.
9. **Banen met toekomst:** alle banen, te filteren op onderwerp.

## Banen en de ICT-match

Alles staat in `src/data/banen.json`.

- **Onderwerpen:** elke kaart heeft één `onderwerp` (bijv. `websites-bouwen`, `beveiliging`, `ondernemen`). De bezoeker geeft per kaart aan hoe leuk hij dat onderwerp vindt.
- **Banen:** elke baan heeft `onderwerpen` met een gewicht van 0 tot 1. Een security-specialist is bijv. `beveiliging: 1, netwerken: 0.6`.
- **Match:** per baan het gewogen gemiddelde van hoe leuk je die onderwerpen vond. Heb je een onderwerp maar één keer beoordeeld of een deel van de onderwerpen niet gezien, dan schuift de score naar 50%. Zo geeft één toevallige 5 geen 100% match. Beoordelingen tellen over rondes heen: hoe meer je speelt, hoe zekerder de match.
- **Banen achter een kaart:** `onthulling.banen` in `kaarten.json`. Die lijst is los gekozen (wie werkt hieraan?), de match rekent via de onderwerpen (wat vind je leuk?).

### Startsalarissen

De startsalarissen staan in `banen.json`: bruto per maand bij 40 uur, voor starters (0–2 jaar ervaring), uit de Nationale Beroepengids (UX-designer: De Transparante Broker), geraadpleegd november 2026. Bij elke baan staan `bron`, `url` en, als de bron die noemt, de datum `bijgewerkt`. Het zijn indicaties, geen beloftes: het verschilt per werkgever en regio. De ICT-ondernemer heeft geen vast salaris; daar staat een `opmerking`. Laat de docent meekijken voor de open dag.

```json
"startsalaris": { "van": 2900, "tot": 3520, "niveau": "0–2 jaar ervaring", "bron": "Nationale Beroepengids", "geraadpleegd": "nov. 2026", "url": "https://..." }
```

## Verhaalkaarten

Twintig kaarten gaan over echte gebeurtenissen en systemen (media-id `verhaal`, status `echt`). Elke kaart heeft een eigen illustratie (`media.beeld`, getekend in `src/components/mockups/beelden/`) met onderaan een kort bijschrift: `label` en `tekst` (houd de tekst onder de ±85 tekens, er is maar 10 seconden). Optioneel: `citaat`, en `icoon` voor als er geen illustratie is. De bron staat in `onthulling.bron`. Ze hebben geen vlakken; de uitleg staat in `onthulling.kort` en `wieDoetWat`. Een illustratie toont de situatie, nooit het antwoord: geen mensen of robots die het werk doen en geen 'AI'-labels die niet in het verhaal staan. De langere teksten van vóór de illustraties staan in `_backup-voor-illustraties-2026-11-11/`.

Vier oude voorbeeldkaarten (kanker-scans, weersvoorspelling, var, muziek-jaaroverzicht) staan op `actief: false`, omdat een verhaalkaart hetzelfde onderwerp behandelt (`vervangenDoor`). Weer aanzetten: haal `actief: false` weg.

## Wat er nog moet gebeuren

**Alle kaartinhoud is voorbeeldinhoud.** De websites, flyer, brieven, code, pitch en illustraties zijn door AI (Claude) gemaakt als placeholder. Omdat het spel draait om eerlijk laten zien wie iets maakte, moet de groep ze vervangen door eigen werk, gemaakt en gelogd volgens hoofdstuk 9 (logboek per kaart). Op `/stats` en `/kaarten` zie je per kaart wat nog moet.

- [ ] **Tijden meten.** Alle tijdbalken staan op `null` en tonen "Tijd nog meten".
- [ ] **Echte prompts** bij elke making-of (`makingOf.prompt`, zet `promptIsVoorbeeld` op `false`).
- [ ] **Eigen versies** van de voetbalsite, flyer, sollicitatiebrief en code (AI-versie én eindversie, als screenshot).
- [x] **Startsalarissen** ingevuld met bron (zie hierboven). Laat de docent ze nog checken.
- [ ] **Docent controleert** de echte-wereldkaarten, de baanbeschrijvingen en de vakken. Zet daarna `gecontroleerdDoorDocent` op `true`.
- [ ] Het herfstgedicht is écht door AI geschreven, dus "machine" klopt.

## Een kaart toevoegen of aanpassen

Kaarten staan in `src/data/kaarten.json`. Een kaart gebruikt een screenshot of een ingebouwde mockup:

```json
"media": [{ "type": "image", "src": "/kaarten/voetbal-eind.png" }]
```

Zet afbeeldingen in `public/kaarten/`, staand **3:4** (bijv. 900 × 1200 px).

Vlakken en fouten gebruiken relatieve coördinaten van 0 tot 1 (`0,0` is linksboven):

```json
{ "x": 0.05, "y": 0.10, "b": 0.90, "h": 0.30, "door": "ai", "uitleg": "Layout en kleuren door AI" }
{ "x": 0.6, "y": 0.4, "straal": 0.06, "uitleg": "Knop onleesbaar", "vak": "UX-design" }
```

Andere velden: `antwoord` (`mens` / `machine` / `samen`), `onderwerp` (zie `banen.json`), `soort` (voor afwisseling), `categorie` (voor de AI-radar), `vraag`, `actief: false` om een kaart uit te zetten. Controleer het resultaat op `/kaarten`.

## Ontwerpsysteem (huisstijl Hogeschool Utrecht)

Alles bouwt op één bestand: `src/styles/systeem.css`. Kleuren en hoekafrondingen komen uit de CSS van hu.nl; het logo staat als `public/hu-logo.svg` en `public/hu-logo-klein.svg` (de officiële bestanden van hu.nl).

- **Logo:** in de kop van elk scherm, groot in de lobby, volledig op het grote scherm, en als favicon.
- **Kleur:** HU-blauw `#00A1E1`, donkerblauw `#006EAE` (knoppen: wit erop haalt het contrast), navy `#00004D`, rood `#E6302B` (alleen fouten), oranje `#E9650D`, babyblauw `#D9F1FB`, grijs `#F6F6F6`.
- **Betekenis:** mens = HU-blauw, machine = HU-navy, samen = HU-oranje. Vlakken op de kaarten: navy = AI, blauw = mens.
- **Type:** Avenir, net als hu.nl. Op iPhone en Mac zit Avenir Next ingebouwd; op andere apparaten valt het terug op Nunito Sans (meegeleverd, werkt offline). Code en prompts in Geist Mono.
- **Ruimte en vorm:** 4-puntsraster (`--s-1` t/m `--s-9`), 32 px tussen secties, kleine hoeken (4–16 px) zoals op hu.nl.
- **Onderdelen:** `btn` (primary, secondary, ghost), `tag`, `rijen`/`rij` (gegroepeerde lijst), `seg`, `balk`, `sheet`, `Schaal` (1–5), `Merk`/`HuLogo`. Gedeelde React-onderdelen staan in `src/components/Onderdelen.jsx`.
- **Principes:** één hoofdactie per scherm, onderaan binnen duimbereik; details pas op verzoek (baan-sheet); minstens 44 px tikvlak; tekstcontrast WCAG AA.
- **Logo-gebruik:** vraag voor de open dag even na bij HU Marketing & Communicatie of het zo mag; zij beheren de huisstijl.

## Techniek

- **Ronde:** `src/lib/spel.js` kiest 8 kaarten: ±30% mens, ±30% machine, ±40% samen, voorrang voor de hobbywereld, minstens twee making-ofs, nooit twee dezelfde soorten na elkaar.
- **Punten:** 100 per goed antwoord, tot 50 snelheidsbonus, ×1,5 bij 3 op rij, ×2 bij 5 op rij. Vind de fout: 100 per fout. Making-of: 50 per fout die je ook zag.
- **Offline:** elke stem en beoordeling gaat via een wachtrij op de telefoon en komt later alsnog binnen.
- **Server lokaal:** `server/index.js` gebruikt voor een snelle open-dag zonder database één bestand per dag in `data/JJJJ-MM-DD.json`.
- **Vercel:** de functies in `api/` slaan gebeurtenissen persistent op in Neon Postgres. Maak in Vercel een `DATABASE_URL` aan met de connection string van een Neon-database (inclusief `?sslmode=require`). Bij het eerste verzoek worden `spel_events` en de benodigde index automatisch aangemaakt; er is geen filesystem-opslag in productie. `/api/stats` wordt op het grote scherm en dashboard elke drie seconden gepolld (lokale SSE blijft beschikbaar).
- **Privacy:** alleen een bijnaam, met filter (`src/lib/bijnaam.js`).

## Nog niet gebouwd

- Gezamenlijke multiplayer-rondes die elke 3 minuten starten (iedereen speelt nu solo; het grote scherm laat wel live zien hoe iedereen stemt)
- Geluidskaarten
- "Maak je eigen kaart" met live AI
