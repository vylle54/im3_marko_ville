# Wo lohnt sich's 🌉

Eine interaktive Webseite zum Vergleich von Wechselkursen zwischen Dänemark und Schweden mit dem Schweizer Franken als Basiswährung. Das Projekt visualisiert die Öresundbrücke zwischen Kopenhagen (DKK) und Malmö (SEK) und zeigt, wo Shopping oder Arbeiten sich am meisten lohnt.

## 📋 Projektübersicht

**Wo lohnt sich's** ist ein Wechselkurs-Vergleichstool mit folgenden Features:
- 🎨 Interaktive Animation mit der Öresundbrücke
- 💱 Live-Wechselkurse von CHF zu DKK und SEK
- 📊 Historische Datenvisualisierung mit Chart.js
- 🎯 Vergleich: Shopping vs. Arbeiten
- 📱 Responsive Design für alle Geräte

## 🚀 Technologien

### Frontend
- **HTML5** - Semantische Struktur
- **CSS3** - Custom Properties, Animationen, Responsive Design
- **JavaScript (ES6+)** - DOM-Manipulation, API-Calls, Event-Handling
- **Chart.js** - Interaktive Wechselkurs-Diagramme

### Backend (ETL-Pipeline)
- **PHP** - Server-seitige Logik
- **MySQL** - Datenbankpersistenz
- **PDO** - Sichere Datenbankzugriffe
- **cURL** - API-Requests

### Externe APIs
- **Open Exchange Rates API** (`open.er-api.com`) - Aktuelle Wechselkurse

## 📁 Projektstruktur

```
im3_marko_ville/
├── index.html              # Hauptseite
├── styles.css              # Alle Styles (strukturiert & dokumentiert)
├── script.js               # JavaScript-Logik
├── config.php              # Datenbank-Konfiguration
├── extract.php             # ETL: Daten von API holen
├── transform.php           # ETL: Daten aufbereiten
├── load.php                # ETL: Daten in DB speichern
├── unload.php              # API-Endpunkt für Frontend
├── img/                    # Bilder & GIFs
│   ├── kopenhagen.png
│   ├── malmoe.png
│   ├── bridge.png
│   ├── auto_faehrt_nach_links.gif
│   └── auto_faehrt_nach_rechts.gif
├── cheatsheets/            # PHP-Lernmaterialien
└── code-alongs/            # Übungsaufgaben
```

## 🔄 Datenfluss (ETL-Pipeline)

```
1. EXTRACT (extract.php)
   └── Holt aktuelle Wechselkurse von open.er-api.com
   └── Basis: CHF (Schweizer Franken)

2. TRANSFORM (transform.php)
   └── Filtert nur DKK und SEK
   └── Rundet Werte auf 1 Dezimalstelle

3. LOAD (load.php)
   └── Speichert Daten mit Timestamp in MySQL
   └── Tabelle: im3 (base_code, currency, rate, timestamp)

4. UNLOAD (unload.php)
   └── Stellt Daten als JSON für Frontend bereit
   └── Wird von script.js abgerufen
```

## 🎮 Funktionsweise

### 1. Hero-Sektion
- Zeigt Öresundbrücke zwischen Kopenhagen und Malmö
- Zwei Buttons: **z'shoppe** (Shopping) und **z'schaffe** (Arbeiten)
- Bei Klick: Animiertes Auto fährt über die Brücke
- Zeigt aktuelle Wechselkurse an

### 2. Chart-Visualisierung
- Dropdown-Menü zur Zeitraumauswahl (1-5 Wochen)
- Interaktiver Linien-Chart mit Chart.js
- Hover-Tooltips zeigen Datum, Währung und Wert
- Legende mit DKK (rot) und SEK (blau)
- Y-Achse: 0-15 (Wechselkurs-Bereich)
- X-Achse: Datum im Format DD.MM.YYYY

### 3. Responsive Design
- **Desktop**: Volle Breite mit allen Animationen
- **Tablet**: Angepasste Insel-Positionen
- **Smartphone**: Optimierte Touch-Targets (min. 44px)
- **Sehr kleine Geräte**: Buttons vertikal gestapelt

## 🛠️ Installation & Setup

### Voraussetzungen
- PHP 7.4 oder höher
- MySQL/MariaDB
- Webserver (Apache/Nginx)

### Schritte

1. **Repository klonen**
```bash
git clone https://github.com/username/im3_marko_ville.git
cd im3_marko_ville
```

2. **Datenbank erstellen**
```sql
CREATE DATABASE waehrungskurse;

CREATE TABLE im3 (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  base_code VARCHAR(3),
  currency TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  rate FLOAT
);
```

3. **Konfiguration anpassen**
```bash
cp config.template.php config.php
# config.php bearbeiten und DB-Zugangsdaten eintragen
```

4. **ETL-Pipeline ausführen**
```bash
php load.php  # Lädt Daten in die Datenbank
```

5. **Webserver starten**
```bash
# Mit PHP Built-in Server
php -S localhost:8000
```

6. **Browser öffnen**
```
http://localhost:8000
```

## 📊 Datenbank-Schema

```sql
Tabelle: im3
+-------------+-------------+------+-----+-------------------+
| Feld        | Typ         | Null | Key | Default           |
+-------------+-------------+------+-----+-------------------+
| id          | int(11)     | NO   | PRI | AUTO_INCREMENT    |
| base_code   | varchar(3)  | NO   |     |                   |
| currency    | text        | NO   |     |                   |
| timestamp   | timestamp   | NO   |     | CURRENT_TIMESTAMP |
| rate        | float       | NO   |     |                   |
+-------------+-------------+------+-----+-------------------+
```

## 🎨 Design-Entscheidungen

### Farbschema
- **Hintergrund**: Himmel-Gradient (hell- bis dunkelblau)
- **Buttons**: Helles Grün (`#c8f0d7`)
- **Chart**: Hellgrüner Hintergrund mit weißer Legende
- **DKK**: Rot (`#C8102E` - Farbe der dänischen Flagge)
- **SEK**: Blau (`#005293` - Farbe der schwedischen Flagge)

### Animationen
- **Schwebe-Effekt**: Buttons schweben sanft (6s Loop)
- **Hover**: Buttons heben sich an und werden größer
- **GIF**: Auto fährt über Brücke mit Cache-Buster für Neustart

### Accessibility
- ARIA-Labels für Screenreader
- Fokus-Ringe für Tastaturnavigation
- `prefers-reduced-motion` respektiert
- Touch-Targets mindestens 44x44px

## 👥 Team

- **Marko** - Entwicklung & Design
- **Ville** - Entwicklung & Backend

## 📄 Lizenz

© 2025 Wo lohnt sich's | Marko & Ville

---

**Projekt erstellt für**: IM3 Kurs  
**Datum**: Dezember 2025
