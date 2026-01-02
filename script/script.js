// ============================================================================
// WÄHRUNGSKURS VISUALISIERUNG - ÖRESUNDBRÜCKE
// Zeigt DKK/SEK Wechselkurse mit Animation und interaktivem Chart
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  
  // ============================================================================
  // KONSTANTEN & VARIABLEN
  // ============================================================================
  
  // DOM-Elemente
  const hero = document.querySelector('.hero');
  const scene = document.querySelector('.scene');
  const [btnShop, btnWork] = document.querySelectorAll('.hero__toggle .pill');
  
  // Bild-Pfade für die Animation
  const GIF_LEFT = 'img/auto_faehrt_nach_links.gif';
  const GIF_RIGHT = 'img/auto_faehrt_nach_rechts.gif';
  const SIGN_LEFT = 'img/sign_left.svg';
  const SIGN_RIGHT = 'img/sign_right.svg';
  
  // API-Endpunkt
  const API_URL = 'https://im3.villelindskog.ch/unload.php';
  
  
  // ============================================================================
  // DYNAMISCHE DOM-ELEMENTE ERSTELLEN
  // ============================================================================
  
  // GIF-Element für die Brücken-Animation
  let bridgeGif = document.getElementById('bridgeGif');
  if (!bridgeGif) {
    bridgeGif = document.createElement('img');
    bridgeGif.id = 'bridgeGif';
    bridgeGif.className = 'bridge-gif';
    bridgeGif.alt = '';
    scene.appendChild(bridgeGif);
  }
  
  // Schild-Bild für Währungsanzeige
  let signImg = document.getElementById('signImg');
  if (!signImg) {
    signImg = document.createElement('img');
    signImg.id = 'signImg';
    signImg.className = 'sign-img';
    signImg.alt = 'Sign';
    scene.appendChild(signImg);
  }
  
  // Text-Element links (DKK)
  let signTextLeft = document.getElementById('signTextLeft');
  if (!signTextLeft) {
    signTextLeft = document.createElement('span');
    signTextLeft.id = 'signTextLeft';
    signTextLeft.className = 'sign-text sign-text--left';
    scene.appendChild(signTextLeft);
  }
  
  // Text-Element rechts (SEK)
  let signTextRight = document.getElementById('signTextRight');
  if (!signTextRight) {
    signTextRight = document.createElement('span');
    signTextRight.id = 'signTextRight';
    signTextRight.className = 'sign-text sign-text--right';
    scene.appendChild(signTextRight);
  }
  
  
  // ============================================================================
  // HILFSFUNKTIONEN
  // ============================================================================
  
  /**
   * Formatiert einen Zahlenwert als Währung im deutschen Format (z.B. "7,9")
   * @param {string|number} val - Der zu formatierende Wert
   * @returns {string} Formatierter Wert mit Komma als Dezimaltrennzeichen
   */
  function formatCurrency(val) {
    // Wenn bereits korrekt formatiert, direkt zurückgeben
    if (typeof val === 'string' && val.includes(',')) return val;
    
    // In Zahl umwandeln
    let num = typeof val === 'number' ? val : parseFloat(String(val).replace(',', '.'));
    if (isNaN(num)) return '0,0';
    
    // Auf eine Dezimalstelle runden und Punkt durch Komma ersetzen
    return num.toFixed(1).replace('.', ',');
  }
  
  /**
   * Aktualisiert die Währungstexte auf dem Schild
   * @param {string} dkk - DKK Wechselkurs
   * @param {string} sek - SEK Wechselkurs
   */
  function updateSignTexts(dkk, sek) {
    signTextLeft.innerHTML = `<span style="color:#fff;">${dkk}</span><br><span style="color:#C8102E;">DKK</span>`;
    signTextRight.innerHTML = `<span style="color:#FECB00;">${sek}</span><br><span style="color:#005293;">SEK</span>`;
  }
  
  /**
   * Startet die GIF-Animation in die gewählte Richtung
   * @param {string} direction - Richtung der Animation ('left' oder 'right')
   */
  function playGif(direction) {
    const src = direction === 'left' ? GIF_LEFT : GIF_RIGHT;
    const signSrc = direction === 'left' ? SIGN_LEFT : SIGN_RIGHT;
    
    // PNG ausblenden und GIF-Modus aktivieren
    hero.classList.add('show-gif');
    
    // GIF neu laden und animieren
    bridgeGif.style.opacity = 0;
    bridgeGif.src = '';
    requestAnimationFrame(() => {
      bridgeGif.onload = () => { bridgeGif.style.opacity = 1; };
      bridgeGif.onerror = (e) => console.error('GIF nicht gefunden:', src, e);
      bridgeGif.src = `${src}?t=${Date.now()}`; // Cache-Buster für Neustart
    });
    
    // Schild-Bild setzen
    signImg.style.opacity = 0;
    signImg.src = '';
    requestAnimationFrame(() => {
      signImg.onload = () => { signImg.style.opacity = 1; };
      signImg.onerror = (e) => console.error('Sign nicht gefunden:', signSrc, e);
      signImg.src = signSrc;
    });
    
    // Währungstexte einblenden
    signTextLeft.style.opacity = 1;
    signTextRight.style.opacity = 1;
  }
  
  
  // ============================================================================
  // API-ABRUF: AKTUELLE WECHSELKURSE
  // ============================================================================
  
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      let dkk = '0,0';
      let sek = '0,0';
      
      // Neueste Einträge für jede Währung finden
      if (Array.isArray(data) && data.length > 0) {
        for (let i = data.length - 1; i >= 0; i--) {
          const entry = data[i];
          
          // DKK-Kurs suchen
          if (entry.currency && entry.currency.toUpperCase() === 'DKK' && 
              dkk === '0,0' && entry.rate !== undefined && entry.rate !== null && entry.rate !== '') {
            dkk = formatCurrency(entry.rate);
          }
          
          // SEK-Kurs suchen
          if (entry.currency && entry.currency.toUpperCase() === 'SEK' && 
              sek === '0,0' && entry.rate !== undefined && entry.rate !== null && entry.rate !== '') {
            sek = formatCurrency(entry.rate);
          }
          
          // Beide gefunden? Dann abbrechen
          if (dkk !== '0,0' && sek !== '0,0') break;
        }
      }
      
      updateSignTexts(dkk, sek);
    })
    .catch(err => {
      console.error('API-Fehler:', err);
      updateSignTexts('0,0', '0,0'); // Fallback bei Fehler
    });
  
  
  // ============================================================================
  // EVENT-LISTENER FÜR BUTTONS
  // ============================================================================
  
  // Button "Shop" (nach rechts)
  btnShop?.addEventListener('click', () => playGif('right'));
  
  // Button "Work" (nach links)
  btnWork?.addEventListener('click', () => playGif('left'));
  
  console.log('[wired]', { btnShop: !!btnShop, btnWork: !!btnWork, scene: !!scene });
  
  
  // ============================================================================
  // CHART.JS VISUALISIERUNG
  // ============================================================================
  
  (function initChart() {
    const canvas = document.getElementById('rateChart');
    const dropdown = document.getElementById('timeRangeSelect');
    
    // Prüfen ob Canvas und Chart.js vorhanden sind
    if (!canvas) {
      console.warn('#rateChart nicht gefunden — Chart wird nicht initialisiert.');
      return;
    }
    if (typeof Chart === 'undefined') {
      console.error('Chart.js ist nicht geladen.');
      return;
    }
    
    // Globale Variablen für Chart
    let allData = []; // Speichert alle API-Daten
    let chartInstance = null; // Aktuelle Chart-Instanz
    
    /**
     * Filtert Daten nach Zeitraum
     * @param {Array} data - Alle Datenpunkte
     * @param {number} days - Anzahl Tage zurück
     * @returns {Array} Gefilterte Daten
     */
    function filterDataByDays(data, days) {
      const now = new Date();
      const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
      
      return data.filter(item => {
        if (!item.timestamp) return false;
        const itemDate = new Date(item.timestamp);
        return itemDate >= cutoffDate && itemDate <= now;
      });
    }
    
    /**
     * Erstellt oder aktualisiert den Chart
     * @param {number} days - Anzahl Tage für Zeitraum
     */
    function updateChart(days) {
      const filteredData = filterDataByDays(allData, days);
      
      if (filteredData.length === 0) {
        console.warn('Keine Daten im gewählten Zeitraum');
        return;
      }
      
      // Daten nach Währung trennen
      const dkkData = filteredData.filter(i => i.currency && i.currency.toUpperCase() === 'DKK');
      const sekData = filteredData.filter(i => i.currency && i.currency.toUpperCase() === 'SEK');
      
      // Alle Zeitstempel sammeln und sortieren
      const labels = [...new Set(filteredData.map(i => i.timestamp).filter(Boolean))].sort();
      
      // Hilfsfunktion zum Parsen der Kurswerte
      const parseRate = v => {
        if (v == null || v === '') return null;
        const n = parseFloat(String(v).replace(',', '.'));
        return isNaN(n) ? null : n;
      };
      
      // Werte-Arrays für beide Währungen erstellen
      const dkkValues = labels.map(ts => {
        const e = dkkData.find(item => item.timestamp === ts);
        return e ? parseRate(e.rate) : null;
      });
      const sekValues = labels.map(ts => {
        const e = sekData.find(item => item.timestamp === ts);
        return e ? parseRate(e.rate) : null;
      });
      
      // Alten Chart entfernen
      if (chartInstance) {
        chartInstance.destroy();
      }
      
      // Labels formatieren (DD.MM.YYYY)
      const formattedLabels = labels.map(ts => {
        const date = new Date(ts);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
      });
      
      // Neuen Chart erstellen
      const ctx = canvas.getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: formattedLabels,
          datasets: [
            {
              label: 'DKK',
              data: dkkValues,
              borderColor: '#C8102E',
              backgroundColor: 'rgba(200,16,46,0.12)',
              tension: 0.3,
              spanGaps: true,
              fill: true,
              borderWidth: 3
            },
            {
              label: 'SEK',
              data: sekValues,
              borderColor: '#005293',
              backgroundColor: 'rgba(0,82,147,0.12)',
              tension: 0.3,
              spanGaps: true,
              fill: true,
              borderWidth: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { 
              position: 'left',
              align: 'start',
              display: true,
              labels: {
                usePointStyle: true,
                pointStyle: 'rect',
                padding: 8,
                font: {
                  size: 14,
                  weight: '600',
                  family: 'Inter'
                },
                color: '#ffffff',
                boxWidth: 12,
                boxHeight: 12,
                generateLabels: (chart) => {
                  const datasets = chart.data.datasets;
                  return datasets.map((dataset, i) => ({
                    text: dataset.label,
                    fillStyle: dataset.borderColor,
                    strokeStyle: dataset.borderColor,
                    lineWidth: 0,
                    hidden: !chart.isDatasetVisible(i),
                    index: i,
                    pointStyle: 'rect'
                  }));
                }
              }
            },
            title: { 
              display: false
            },
            tooltip: {
              enabled: true,
              mode: 'nearest',
              intersect: true,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#0a223a',
              bodyColor: '#0a223a',
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderWidth: 1,
              padding: 12,
              displayColors: true,
              titleFont: {
                size: 13,
                weight: '600'
              },
              bodyFont: {
                size: 12,
                weight: '500'
              },
              callbacks: {
                title: (context) => {
                  return context[0].label || '';
                },
                label: (context) => {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y;
                  return `${label}: ${value.toFixed(1)}`;
                }
              }
            }
          },
          scales: {
            x: { 
              display: true,
              grid: { 
                display: true,
                color: 'rgba(255,255,255,0.6)',
                lineWidth: 1
              },
              ticks: {
                color: '#0a223a',
                font: {
                  size: 11,
                  weight: '500'
                },
                maxRotation: 45,
                minRotation: 45
              },
              border: {
                color: '#ffffff',
                width: 2
              }
            },
            y: { 
              display: true,
              position: 'right',
              min: 0,
              max: 15,
              grid: { 
                display: true,
                color: 'rgba(255,255,255,0.6)',
                lineWidth: 1
              },
              ticks: {
                color: '#0a223a',
                font: {
                  size: 11,
                  weight: '500'
                }
              },
              border: {
                color: '#ffffff',
                width: 2
              },
              beginAtZero: true
            }
          },
          layout: {
            padding: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20
            }
          }
        }
      });
    }
    
    // Chart-Daten von API laden
    fetch(API_URL)
      .then(res => res.json())
      .then(apiData => {
        if (!Array.isArray(apiData) || apiData.length === 0) {
          console.warn('Keine Daten für Chart gefunden');
          return;
        }
        
        allData = apiData;
        
        // Chart initial verstecken
        canvas.style.display = 'none';
        
        // Dropdown-Listener: Chart zeigen wenn Zeitraum gewählt wird
        if (dropdown) {
          dropdown.addEventListener('change', (e) => {
            const selectedValue = e.target.value;
            if (selectedValue) {
              const selectedDays = parseInt(selectedValue);
              canvas.style.display = 'block';
              updateChart(selectedDays);
            } else {
              canvas.style.display = 'none';
            }
          });
        }
      })
      .catch(err => {
        console.error('Fehler beim Laden der Chart-Daten:', err);
      });
  })();
});


// ============================================================================
// RESET-FUNKTION
// ============================================================================

/**
 * Setzt alle Animationen und Ansichten zurück
 */
function resetView() {
  const hero = document.querySelector('.hero');
  const bridgeGif = document.getElementById('bridgeGif');
  const signImg = document.getElementById('signImg');
  const signTextLeft = document.getElementById('signTextLeft');
  const signTextRight = document.getElementById('signTextRight');
  const badgeLeft = document.getElementById('badgeLeft');
  const badgeRight = document.getElementById('badgeRight');
  const [btnShop, btnWork] = document.querySelectorAll('.hero__toggle .pill');
  
  // CSS-Klassen zurücksetzen
  hero?.classList.remove('results', 'show-gif');
  badgeLeft?.classList.remove('show');
  badgeRight?.classList.remove('show');
  btnShop?.classList.remove('is-active');
  btnWork?.classList.remove('is-active');
  
  // GIF stoppen und ausblenden
  if (bridgeGif) {
    bridgeGif.classList.remove('show');
    bridgeGif.style.opacity = 0;
    bridgeGif.src = '';
  }
  
  // Schild ausblenden
  if (signImg) {
    signImg.style.opacity = 0;
    signImg.src = '';
  }
  
  // Texte ausblenden
  if (signTextLeft) signTextLeft.style.opacity = 0;
  if (signTextRight) signTextRight.style.opacity = 0;
  
  // Sanft nach oben scrollen
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Titel anklicken = Reset
document.querySelector('.hero__title')?.addEventListener('click', (e) => {
  e.preventDefault();
  resetView();
});
