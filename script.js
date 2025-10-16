document.addEventListener('DOMContentLoaded', () => {
  const hero  = document.querySelector('.hero');
  const scene = document.querySelector('.scene');
  const [btnShop, btnWork] = document.querySelectorAll('.hero__toggle .pill');

  // GIF-Element erzeugen, falls nicht da
  let bridgeGif = document.getElementById('bridgeGif');
  if (!bridgeGif) {
    bridgeGif = document.createElement('img');
    bridgeGif.id = 'bridgeGif';
    bridgeGif.className = 'bridge-gif';
    bridgeGif.alt = '';
    scene.appendChild(bridgeGif);
  }

  // Sign-Element erzeugen, falls nicht da
  let signImg = document.getElementById('signImg');
  if (!signImg) {
    signImg = document.createElement('img');
    signImg.id = 'signImg';
    signImg.className = 'sign-img';
    signImg.alt = 'Sign';
    scene.appendChild(signImg);
  }

  // Text-Elemente erzeugen, falls nicht da
  let signTextLeft = document.getElementById('signTextLeft');
  if (!signTextLeft) {
    signTextLeft = document.createElement('span');
    signTextLeft.id = 'signTextLeft';
    signTextLeft.className = 'sign-text sign-text--left';
    scene.appendChild(signTextLeft);
  }
  let signTextRight = document.getElementById('signTextRight');
  if (!signTextRight) {
    signTextRight = document.createElement('span');
    signTextRight.id = 'signTextRight';
    signTextRight.className = 'sign-text sign-text--right';
    scene.appendChild(signTextRight);
  }

  // *** DEINE Dateinamen mit "nach" ***
  const GIF_LEFT  = 'img/auto_faehrt_nach_links.gif';
  const GIF_RIGHT = 'img/auto_faehrt_nach_rechts.gif';
  const SIGN_LEFT  = 'img/sign_left.png';
  const SIGN_RIGHT = 'img/sign_right.png';

  // Fetch latest values from API and always use them if available, fallback is 0.0
  fetch('https://im3.villelindskog.ch/unload.php')
    .then(res => res.json())
    .then(data => {
      let dkk = '0,0';
      let sek = '0,0';

      if (Array.isArray(data) && data.length > 0) {
        // Find the latest entry for each currency using the rate field
        for (let i = data.length - 1; i >= 0; i--) {
          const entry = data[i];
          if (entry.currency && entry.currency.toUpperCase() === 'DKK' && dkk === '0,0' && entry.rate !== undefined && entry.rate !== null && entry.rate !== '') {
            dkk = formatCurrency(entry.rate);
          }
          if (entry.currency && entry.currency.toUpperCase() === 'SEK' && sek === '0,0' && entry.rate !== undefined && entry.rate !== null && entry.rate !== '') {
            sek = formatCurrency(entry.rate);
          }
          // Stop early if both found
          if (dkk !== '0,0' && sek !== '0,0') break;
        }
      }
      updateSignTexts(dkk, sek);
    })
    .catch(err => {
      console.error('API fetch error:', err);
      updateSignTexts('0,0', '0,0');
    });

  // Helper to format value as "7,9"
  function formatCurrency(val) {
    if (typeof val === 'string' && val.includes(',')) return val;
    let num = typeof val === 'number' ? val : parseFloat(String(val).replace(',', '.'));
    if (isNaN(num)) return '0,0';
    return num.toFixed(1).replace('.', ',');
  }

  function updateSignTexts(dkk, sek) {
    signTextLeft.innerHTML = `<span style="color:#fff;">${dkk}</span><br><span style="color:#C8102E;">DKK</span>`;
    signTextRight.innerHTML = `<span style="color:#FECB00;">${sek}</span><br><span style="color:#005293;">SEK</span>`;
  }

  function playGif(direction){
    const src = direction === 'left' ? GIF_LEFT : GIF_RIGHT;
    const signSrc = direction === 'left' ? SIGN_LEFT : SIGN_RIGHT;

    // PNG ausblenden, GIF zeigen
    hero.classList.add('show-gif');

    // GIF neu starten
    bridgeGif.style.opacity = 0;
    bridgeGif.src = '';
    requestAnimationFrame(() => {
      bridgeGif.onload  = () => { bridgeGif.style.opacity = 1; };
      bridgeGif.onerror = (e) => console.error('GIF nicht gefunden:', src, e);
      bridgeGif.src = `${src}?t=${Date.now()}`; // Cache-Buster
    });

    // Sign-Bild setzen
    signImg.style.opacity = 0;
    signImg.src = '';
    requestAnimationFrame(() => {
      signImg.onload = () => { signImg.style.opacity = 1; };
      signImg.onerror = (e) => console.error('Sign nicht gefunden:', signSrc, e);
      signImg.src = signSrc;
    });

    // Text anzeigen
    signTextLeft.style.opacity = 1;
    signTextRight.style.opacity = 1;
  }

  btnShop?.addEventListener('click',  () => playGif('left'));
  btnWork?.addEventListener('click', () => playGif('right'));

  console.log('[wired]', { btnShop: !!btnShop, btnWork: !!btnWork, scene: !!scene });
});

// Reset-Logik (falls noch nicht vorhanden)
function resetView(){
  const hero       = document.querySelector('.hero');
  const bridgeGif  = document.getElementById('bridgeGif');
  const signImg    = document.getElementById('signImg');
  const signTextLeft  = document.getElementById('signTextLeft');
  const signTextRight = document.getElementById('signTextRight');
  const badgeLeft  = document.getElementById('badgeLeft');
  const badgeRight = document.getElementById('badgeRight');
  const [btnShop, btnWork] = document.querySelectorAll('.hero__toggle .pill');

  // Zustände zurücksetzen
  hero?.classList.remove('results', 'show-gif');
  badgeLeft?.classList.remove('show');
  badgeRight?.classList.remove('show');
  btnShop?.classList.remove('is-active');
  btnWork?.classList.remove('is-active');

  // GIF stoppen/ausblenden
  if (bridgeGif){
    bridgeGif.classList.remove('show');
    bridgeGif.style.opacity = 0;
    bridgeGif.src = ''; // stoppt Animation
  }

  // Sign ausblenden
  if (signImg) {
    signImg.style.opacity = 0;
    signImg.src = '';
  }

  // Text ausblenden
  if (signTextLeft)  signTextLeft.style.opacity = 0;
  if (signTextRight) signTextRight.style.opacity = 0;

  // sanft nach oben scrollen
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Titel klickbar machen
document.querySelector('.hero__title')?.addEventListener('click', (e) => {
  e.preventDefault();
  resetView();
});

// Chart zügs
const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      }
    }
  },
};