# Maloev – Offerten & Rechnungen

Ein Werkzeug zum Erstellen von Offerten und Rechnungen als sauberes A4-PDF.
Läuft vollständig im Browser, ohne Server und ohne Konto. Alle Daten bleiben lokal.

**Online:** https://alekswithk.github.io/Maloev/

## Bedienung

1. Oben **Offerte**, **Rechnung** oder **Beides** wählen.
2. Felder ausfüllen – die Vorschau rechts aktualisiert sich sofort.
3. **Drucken / Als PDF speichern** → im Druckdialog „Als PDF sichern" wählen.
   Der Dateiname wird automatisch gesetzt, z. B. `Rechnung_RE-2026-02_Nordex 2 GmbH.pdf`.

## Was automatisch passiert

| Thema | Verhalten |
|---|---|
| Logo | Fest im Dokument eingebettet, auf jeder Seite, nicht entfernbar |
| Gültigkeit der Offerte | Offertdatum + 1 Monat (Monatsende wird korrekt gekappt) |
| Fälligkeitsdatum | Rechnungsdatum + Zahlungsfrist in Tagen |
| Referenz | „Offerte Nr. …" aus der Offertnummer |
| Nummern | Fortlaufend: Offerte `026373`, Rechnung `RE-2026-02` (Jahreswechsel setzt zurück) |
| Info-Texte | Aus Akontozahlung, Rabatt, Frist und Betrag erzeugt |
| Rundung | Endbetrag auf 0.05 (Rappenrundung), Zwischentotale rappengenau |

Automatikfelder lassen sich per Häkchen abschalten und dann von Hand überschreiben.

## Rechnungsformat

Die Rechnung folgt dem Aufbau der bestehenden Maloev-Rechnung:
Deckblatt mit Logo, „RECHNUNG", Absender, Empfänger und Meta-Tabelle;
danach „Rechnungsdetails" mit Positionen, Zwischentotalen, MWST, Akontozahlung
und „Total Offener Betrag", gefolgt von Info, Zahlung und Vielen Dank.

## QR-Rechnung anhängen

Unter **QR-Rechnung (Beilage)** den Einzahlungsschein hochladen – er wird als
letzte Seite mitgedruckt.

- **Bild** (PNG/JPG): funktioniert immer.
- **PDF**: wird beim Hochladen in ein Bild umgewandelt (via `vendor/pdf.min.mjs`).
  Das funktioniert nur, wenn die Seite über `http(s)` geöffnet ist – also über den
  Link oben. Beim Öffnen der Datei per Doppelklick (`file://`) blockiert der Browser
  das Nachladen; dort bitte ein Bild verwenden.

Ganzseitige Beilagen werden seitenfüllend gesetzt, schmale Zahlteil-Streifen
unten auf der Seite.

## Kunden & Archiv

Kunden lassen sich speichern und per Dropdown einsetzen. Fertige Dokumente können
ins Archiv gelegt, wieder geladen oder dupliziert werden (das Duplikat bekommt
automatisch neue Nummern und das heutige Datum). **Export (JSON)** sichert Archiv,
Kunden und Nummernkreise in eine Datei – empfehlenswert, da alles nur im
Browser-Speicher liegt und beim Löschen der Browserdaten verschwindet.

## Dateien

```
index.html    das komplette Werkzeug (Logo als Data-URL eingebettet)
oev_logo.png  Logo als Einzeldatei (Quelle des eingebetteten Bildes)
vendor/       pdf.js (Mozilla, Apache-2.0) – nur für den PDF-Upload
```
