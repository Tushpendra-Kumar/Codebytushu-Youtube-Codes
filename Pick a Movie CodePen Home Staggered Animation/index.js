if(!CSS.supports('order', 'sibling-index()')) {
  const DIV = Array.from(document.querySelectorAll('div'));
  document.querySelector('main').addEventListener('change', (e) => {
      const IDX = DIV.indexOf(e.target.parentElement);
      DIV.slice(IDX + 1).forEach((div, idx, arr) => div.style.setProperty('--n', `${arr.length - idx}`));
      DIV.slice(0, IDX).forEach((div, idx) => div.style.setProperty('--n', `${idx + 1}`));
  });
  document.querySelector('.warning').removeAttribute('hidden');
}