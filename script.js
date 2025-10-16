document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('.scene');
  const [btnShop, btnWork] = document.querySelectorAll('.hero__toggle .pill');

  // Sign-Element erzeugen, falls nicht da
  let signImg = document.getElementById('signImg');
  if (!signImg) {
    signImg = document.createElement('img');
    signImg.id = 'signImg';
    signImg.className = 'sign-img';
    signImg.alt = 'Sign';
    scene.appendChild(signImg);
  }

  // Werte initialisieren
  let dkk = 0.0;
  let sek = 0.0;

  // Werte aus API laden
  fetch('https://im3.villelindskog.ch/unload.php')
    .then(res => res.json())
    .then(data => {
      let dkk = '0,0';
      let sek = '0,0';

      if (Array.isArray(data) && data.length > 0) {
        for (let i = data.length - 1; i >= 0; i--) {
          const entry = data[i];
          if (entry.currency && entry.currency.toUpperCase() === 'DKK' && dkk === '0,0' && entry.rate != null && entry.rate !== '') {
            dkk = formatCurrency(entry.rate);
          }
          if (entry.currency && entry.currency.toUpperCase() === 'SEK' && sek === '0,0' && entry.rate != null && entry.rate !== '') {
            sek = formatCurrency(entry.rate);
          }
          if (dkk !== '0,0' && sek !== '0,0') break;
        }
      }
      updateSignTexts(dkk, sek);
    })
    .catch(err => {
      console.error('API fetch error:', err);
      updateSignTexts('0,0', '0,0');
    });

  // Button-Logik
  btnWork?.addEventListener('click', () => {
    // "z'schaffe"
    if (sek > dkk) {
      signImg.src = 'img/sign_left.png';
    } else {
      signImg.src = 'img/sign_right.png';
    }
    signImg.style.opacity = 1;
  });

  btnShop?.addEventListener('click', () => {
    // "z'shoppe"
    if (sek > dkk) {
      signImg.src = 'img/sign_right.png';
    } else {
      signImg.src = 'img/sign_left.png';
    }
    signImg.style.opacity = 1;
  });
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