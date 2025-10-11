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

  // *** DEINE Dateinamen mit "nach" ***
  const GIF_LEFT  = 'img/auto_faehrt_nach_links.gif';
  const GIF_RIGHT = 'img/auto_faehrt_nach_rechts.gif';

  function playGif(direction){
    const src = direction === 'left' ? GIF_LEFT : GIF_RIGHT;

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
  }

  btnShop?.addEventListener('click',  () => playGif('left'));
  btnWork?.addEventListener('click', () => playGif('right'));

  console.log('[wired]', { btnShop: !!btnShop, btnWork: !!btnWork, scene: !!scene });
});
// Reset-Logik (falls noch nicht vorhanden)
function resetView(){
  const hero       = document.querySelector('.hero');
  const bridgeGif  = document.getElementById('bridgeGif');
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

  // sanft nach oben scrollen
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Titel klickbar machen
document.querySelector('.hero__title')?.addEventListener('click', (e) => {
  e.preventDefault();
  resetView();
});
