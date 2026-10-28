# Aktiv i barnehagen 2.0 · wireframe

Klikkbar mid-fidelity prototype basert på AIB-2.0-skissene for aktivibarnehagen.no.

**Språkvelger:** NO | EN i header (lagres i localStorage). Wireframe · innholdstekst er fortsatt norsk; valget viser hvordan i18n skal fungere i produksjon.

## GitHub Pages

| | URL |
|--|-----|
| **Live prototype** | https://Git-V-T.github.io/aktiv-i-barnehagen-wireframe/ |
| **Repo** | https://github.com/Git-V-T/aktiv-i-barnehagen-wireframe |

Nyttige sider på Pages:

- [Forside](https://Git-V-T.github.io/aktiv-i-barnehagen-wireframe/) · hero-toggle **Sirkler | Puslespill | Leken**
- [Idebank / aktiviteter](https://Git-V-T.github.io/aktiv-i-barnehagen-wireframe/aktiviteter.html)
- [Tema](https://Git-V-T.github.io/aktiv-i-barnehagen-wireframe/tema.html)
- [Vennskap – bli kjent](https://Git-V-T.github.io/aktiv-i-barnehagen-wireframe/tema-vennskap.html)
- [Kompetanseutvikling](https://Git-V-T.github.io/aktiv-i-barnehagen-wireframe/kompetanse.html) · toggle **Avdelinger | Katalog | Stier | Møter | Magasin**
- [Utviklingsarbeid](https://Git-V-T.github.io/aktiv-i-barnehagen-wireframe/kompetanse-utviklingsarbeid.html)
- [Kom i gang](https://Git-V-T.github.io/aktiv-i-barnehagen-wireframe/kompetanse-utviklingsarbeid-kom-i-gang.html)
- [Du må ha en plan](https://Git-V-T.github.io/aktiv-i-barnehagen-wireframe/kompetanse-utviklingsarbeid-plan.html)
- [Motstand](https://Git-V-T.github.io/aktiv-i-barnehagen-wireframe/kompetanse-utviklingsarbeid-motstand.html)
- [Pedagogiske prinsipper](https://Git-V-T.github.io/aktiv-i-barnehagen-wireframe/kompetanse-prinsipper.html)
- [Bevegelse, lek og utforskning](https://Git-V-T.github.io/aktiv-i-barnehagen-wireframe/kompetanse-tema.html)
- [Prosjektinnlogging](https://Git-V-T.github.io/aktiv-i-barnehagen-wireframe/prosjekt-login.html)

Oppdater Pages etter endringer: push til `main` (eller kjør `./setup-github-pages.sh`).

## Åpne lokalt

```bash
cd prototype
python3 -m http.server 5173
```

Deretter: http://localhost:5173/

## Kompetanseutvikling · fem varianter

På `kompetanse.html` (wireframe-toggle nederst til høyre):

| Variant | Ide |
|---------|-----|
| **Avdelinger** | Tre tematiske innganger (Utviklingsarbeid · Prinsipper · Bevegelse/lek/utforskning) |
| **Katalog** | Shopbar katalog med situasjonschipper, filter (format/område/tid) og søk |
| **Stier** | Guidede læringsstier med nummererte steg («følg rekkefølgen») |
| **Møter** | Tid først: ferdigpakker for personalmøte (~15 / ~30 / 60+ min) |
| **Magasin** | Redaksjonelt: fremhevet impuls + «Start her» / «Til personalmøtet» / liste |

Innhold speiler moveearly.no: 3 videoimpulser under utviklingsarbeid + 7 prinsipper som video/verksted + prinsipper som referanse.

## Navigasjon

| Fil | Innhold |
|-----|---------|
| `index.html` | Forside med hero-toggle **Sirkler \| Puslespill \| Leken** + prosjektstripe |
| `aktiviteter.html` | Filter + grid |
| `tema.html` | Temaoversikt (idebank) |
| `tema-vennskap.html` | Temaside: Vennskap – bli kjent |
| `kompetanse.html` | Hub med 5-veis variant-toggle |
| `kompetanse-utviklingsarbeid.html` | Modul 1: intro + oversikt over videoimpulser |
| `kompetanse-utviklingsarbeid-kom-i-gang.html` | Modul 2: video → lesestoff → verksted |
| `kompetanse-utviklingsarbeid-plan.html` | Modul 3: Du må ha en plan |
| `kompetanse-utviklingsarbeid-motstand.html` | Modul 4: Hvordan håndtere motstand? |
| `kompetanse-prinsipper.html` | De 7 pedagogiske prinsippene (referanse) |
| `kompetanse-tema.html` | Bevegelse, lek og utforskning · 7 prinsipper som video+verksted |
| `prosjekt-login.html` | Innlogging med unik barnehagekode |
| `prosjekt.html` | Låst forskningsprosjekt (hub) |
| `hefte.html` | Mitt aktivitetshefte (session) |
| `hefte-print.html` | Utskrift: forside + aktiviteter |

**Hefte (uten innlogging):** «Legg i hefte» på kort erstatter favoritter. Liste i `sessionStorage`. Skriv ut via print-side.

| Kode | prosjekt_id | Barnehage (offline) |
|------|-------------|---------------------|
| `solhaugen26` | 0234558 | Solhaugen |
| `bjorkelunden26` | 0234559 | Bjørkelunden |
| `furulia26` | 0234560 | Furulia |

## Nytt forskningsprosjekt (låst område)

Samme tankegang gjelder på ny stack (Payload + Cloudflare Workers / D1 / R2), bare med andre verktøynavn:

- Låst innhold for deltakere i eventuelle forskningsprosjekt
- Samme innholdstyper som offentlig kompetanse
- Felt `visibility: offentlig | prosjekt` (+ prosjekt-relasjon) i **Payload** (`mhfa-cms.no`)
- Ved ferdigstillelse: bytt synlighet, ikke kopier innhold
- Meny: diskret innlogging under Om/kontakt
- **Tilgang:** unik kode per barnehage i Payload (ikke felles prosjektpassord)
- **Session:** tilgangskode ≠ `prosjekt_id`. Etter innlogging lagres pseudonym `prosjekt_id` i session (ikke i URL)
- **Analytics:** plattformstandard er Cloudflare Web Analytics (ingen cookies). Custom property for `prosjekt_id` (som tidligere tenkt med Plausible) er ikke like rett frem der; behold ID i session + offline Excel (ID → barnehagenavn). Egne mål/funnels vurderes senere hvis forskningsoppfølging krever det
- **Hosting:** frontend på Cloudflare Workers (ikke Netlify)
