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

  // Text-Elemente erzeugen, falls nicht da
  let signTextLeft = document.getElementById('signTextLeft');
  if (!signTextLeft) {
    signTextLeft = document.createElement('span');
    signTextLeft.id = 'signTextLeft';
    signTextLeft.className = 'sign-text sign-text--left';
    signTextLeft.innerHTML = '7.9<br>DKK'; // <-- line break added
    scene.appendChild(signTextLeft);
  }
  let signTextRight = document.getElementById('signTextRight');
  if (!signTextRight) {
    signTextRight = document.createElement('span');
    signTextRight.id = 'signTextRight';
    signTextRight.className = 'sign-text sign-text--right';
    signTextRight.innerHTML = '11.8<br>SEK'; // <-- line break added
    scene.appendChild(signTextRight);
  }

  // *** DEINE Dateinamen mit "nach" ***
  const GIF_LEFT  = 'img/auto_faehrt_nach_links.gif';
  const GIF_RIGHT = 'img/auto_faehrt_nach_rechts.gif';
  const SIGN_LEFT  = 'img/sign_left.png';   // <-- Bild für links
  const SIGN_RIGHT = 'img/sign_right.png';  // <-- Bild für rechts

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