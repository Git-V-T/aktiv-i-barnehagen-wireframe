# Aktiv i barnehagen 2.0 — wireframe

Klikkbar mid-fidelity prototype basert på AIB-2.0-skissene for aktivibarnehagen.no.

**Språkvelger:** NO | EN i header (lagres i localStorage). Wireframe — innholdstekst er fortsatt norsk; valget viser hvordan i18n skal fungere i produksjon.

## Åpne lokalt

```bash
cd prototype
python3 -m http.server 5173
```

Deretter: http://localhost:5173/

## Navigasjon

| Fil | Innhold |
|-----|---------|
| `index.html` | Forside med to sirkler + prosjektstripe |
| `aktiviteter.html` | Filter + grid |
| `kompetanse.html` | Offentlig kompetanse + teaser til forskningsprosjekt |
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

- Låst innhold for deltakere i eventuelle nye forskningsprosjekt
- Samme innholdstyper som offentlig kompetanse
- Felt `visibility: offentlig | prosjekt` (+ prosjekt-relasjon)
- Ved ferdigstillelse: bytt synlighet — ikke kopier innhold
- Meny: diskret innlogging under Om/kontakt
- **Tilgang:** unik kode per barnehage i Strapi
- **Sporing:** tilgangskode ≠ `prosjekt_id`. Session + Plausible custom property (ikke i URL). Offline Excel: ID → barnehagenavn.
