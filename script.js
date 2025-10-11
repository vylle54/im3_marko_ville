(() => {
    const buttons = document.querySelectorAll('.toggle__btn');
    const values = {
      shop: { DKK: 7.9, SEK: 11.8 },
      work: { DKK: 7.6, SEK: 12.1 }
    };
  
    function setMode(mode) {
      buttons.forEach(b => b.classList.toggle('is-active', b.dataset.mode === mode));
      document.querySelector('[data-currency="DKK"]').textContent = values[mode].DKK.toFixed(1);
      document.querySelector('[data-currency="SEK"]').textContent = values[mode].SEK.toFixed(1);
    }
  
    buttons.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
    setMode('shop');
  })();
  
  document.addEventListener('DOMContentLoaded', () => {
    const apiURL = "https://im3.villelindskog.ch/unload.php";

    fetch(apiURL)
      .then(response => response.json())
      .then(data => {
        console.log("Abgerufene Daten:", data);

        const ctx = document.getElementById('myChart').getContext('2d');
        