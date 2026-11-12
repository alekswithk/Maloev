# Maloev – Offerten, Rechnungen & Quittungen

Ein Werkzeug zum Erstellen von Offerten, Rechnungen und Quittungen als sauberes A4-PDF.
Läuft im Browser, ohne eigenen Server. Ohne Anmeldung bleiben alle Daten lokal.
Mit **Mit Google anmelden** (unter ⚙ Einstellungen) werden Einstellungen, Kunden,
Archiv und Nummernkreise zusätzlich in Supabase gespeichert und zwischen Geräten
abgeglichen. Das offene Dokument bleibt pro Gerät.

Einrichtung: `supabase/schema.sql` einmal im SQL Editor ausführen, danach
`supabase/check.sql` zur Kontrolle (räumt seine Testdaten selbst weg).
Logik-Test des Abgleichs: `node merge.test.js`.

**Online:** https://alekswithk.github.io/Maloev/

## Ablauf

Oben wählen: **Offerte**, **Rechnung**, **Beides** oder **Quittung**. Darunter vier
Abschnitte, die man der Reihe nach durchgeht – jeder zeigt im Kopf, was drinsteht,
und bekommt ein Häkchen, sobald er vollständig ist:

| | Abschnitt | Inhalt |
|---|---|---|
| 1 | Kunde | Firma eintippen, gespeicherte Kunden werden vorgeschlagen |
| 2 | Positionen | Bezeichnung, Menge, Einheit, Preis – Betrag rechnet sich |
| 3 | Zahlung & Fristen | Nummern, Daten, MWST, Rabatt, Akontozahlung, Quittung |
| 4 | Prüfen & Drucken | Prüfliste, Bemerkung, QR-Beilage, Archiv |

Alles, was sich nie ändert – Firma, Adresse, UID, Bank, Standardtexte – steht
einmalig unter **⚙ Einstellungen**.

Zum Schluss **Drucken / Als PDF speichern** und im Druckdialog „Als PDF sichern"
wählen. Der Dateiname wird gesetzt, z. B. `Rechnung_RE-2026-02_Nordex 2 GmbH.pdf`.

## Was automatisch passiert

| Thema | Verhalten |
|---|---|
| Neues Dokument | Vergibt Nummer, setzt Datum auf heute und Fristen aus den Einstellungen |
| Logo | Fest eingebettet, auf jeder Seite, nicht entfernbar |
| Gültigkeit der Offerte | Offertdatum + eingestellte Monate (Monatsende wird gekappt) |
| Fälligkeitsdatum | Rechnungsdatum + Zahlungsfrist |
| Referenz | „Offerte Nr. …" aus der Offertnummer |
| Nummern | Offerte `026373`, Rechnung `RE-2026-02`, Quittung `QU-2026-01` (Jahreswechsel setzt zurück) |
| Erhaltener Betrag | Akontozahlung, sonst der offene Betrag der Rechnung |
| Info-Texte | Aus Akontozahlung, Rabatt und Frist erzeugt |
| Kunden | Werden beim Drucken gemerkt und später vorgeschlagen |
| Archiv | Jedes gedruckte Dokument wird automatisch abgelegt |
| Positionen | Leere Zeile hängt sich selbst an; Betrag = Menge × Preis |
| Rundung | Endbetrag auf 0.05, Zwischentotale rappengenau |

Jede Automatik lässt sich per Häkchen abschalten und von Hand überschreiben.
Beim Betrag einer Position gilt ein eingetippter Wert; **↺** stellt die
Berechnung wieder her.

## Prüfung vor dem Drucken

Abschnitt 4 sammelt, was fehlt oder unstimmig ist – fehlender Kunde, keine
Position, Datum verdreht, ungewöhnlicher MWST-Satz, IBAN mit falscher
Prüfziffer, UID im falschen Format, Akonto grösser als der Rechnungsbetrag.
Fehler blockieren den Druck nicht, sie werden nur vorher gezeigt.

## Quittung

Ist eine Rechnung bezahlt, macht **→ Quittung aus Rechnung** daraus den Beleg für
den Kunden: gleiche Daten, neue Nummer, Zahlungsdatum auf heute. Der Beleg nennt
Rechnungsnummer, Rechnungs-, Leistungs- und Zahlungsdatum, Referenz und MWST-Nr.,
darunter Betrag exkl. MWST, MWST, Rechnungsbetrag und – hervorgehoben – den
erhaltenen Betrag. Positionen listet er nicht auf, er verweist auf die Rechnung.

Der erhaltene Betrag stellt sich selbst ein: die Akontozahlung, sonst der offene
Betrag. Per Häkchen lässt er sich von Hand setzen, etwa bei einer Teilzahlung.
Bleibt etwas offen, steht der Restbetrag unter dem Summenblock, sonst der Satz,
dass die Rechnung vollständig beglichen ist.

## Das fertige Dokument

Offerte, Rechnung und Quittung teilen sich ein Layout: Logo und Titel oben, Absenderzeile,
Empfängerblock, Eckdaten rechts, Positionstabelle, Summenblock, Schlusstext und
eine Fusszeile mit Firmendaten und Seitenzahl. Schwarz-weiss gesetzt, damit es
auf jedem Drucker gleich aussieht.

Der Empfängerblock sitzt bei 20 mm von links und 47 mm von oben – der Beleg
passt gefaltet in ein Fensterkuvert C5/C6. Bei vielen Positionen bricht die
Tabelle um, wiederholt ihren Kopf und markiert die Folgeseiten als
„Fortsetzung".

Für einen klassischen Serif-Look lässt sich `--doc-font` in `index.html` auf
`"Times New Roman", Times, serif` umstellen.

## QR-Rechnung anhängen

Unter **QR-Rechnung (Beilage)** den Einzahlungsschein hochladen – er wird als
letzte Seite mitgedruckt und in den Info-Texten als Seitenverweis erwähnt.

- **Bild** (PNG/JPG): funktioniert immer.
- **PDF**: wird beim Hochladen in ein Bild umgewandelt (via `vendor/pdf.min.mjs`).
  Das braucht `http(s)` – also den Link oben. Beim Öffnen per Doppelklick
  (`file://`) blockiert der Browser das Nachladen; dort bitte ein Bild verwenden.

Ganzseitige Beilagen werden seitenfüllend gesetzt, schmale Zahlteil-Streifen
unten auf der Seite.

## Daten

Alles liegt im Browser (`localStorage`), getrennt nach Einstellungen, aktuellem
Beleg, Kunden, Archiv und Nummernkreisen. Archivierte Dokumente speichern die
Firmendaten mit, damit ein alter Beleg auch nach einem Bankwechsel unverändert
nachdruckt.

**Export (JSON)** unter Einstellungen sichert alles in eine Datei – empfehlenswert,
da die Daten beim Löschen der Browserdaten verschwinden.

## Dateien

```
index.html    das komplette Werkzeug (Logo als Data-URL eingebettet)
oev_logo.png  Logo als Einzeldatei (Quelle des eingebetteten Bildes)
vendor/       pdf.js (Mozilla, Apache-2.0) – nur für den PDF-Upload
.nojekyll     GitHub Pages liefert vendor/ sonst nicht aus
```
