const cardsContainer = document.querySelector(".cards");
const cards = document.querySelectorAll(".card");
const total = cards.length;
const radius = 500; // radio del tubo
const curvature = 10; // ángulo de curvatura local

// Distribuye las cards en orden inverso
[...cards].reverse().forEach((card, i) => {
  const angle = (i / total) * Math.PI * 2;
  const y = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  
  const tilt = (Math.sin(angle) * curvature).toFixed(2);

  card.style.transform = `
    rotateX(${(angle * 180) / Math.PI}deg)
    translateZ(${radius}px)
    rotateY(${tilt}deg)
  `;
});

// Rotación con scroll
window.addEventListener("scroll", () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = window.scrollY / maxScroll;
  const rotation = scrollPercent * 360;
  cardsContainer.style.transform = `rotateX(${rotation}deg)`;
});

const backgrounds = [
  "https://cdn.prod.website-files.com/679185b32f76eb227e8b2d64/690e228d4e47784421489090_e94dfb12e66c3ad5ce888a87139fb6e1.jpg",
  "https://cdn.prod.website-files.com/679185b32f76eb227e8b2d64/68cc3546a30d418181506343_49154acfd6aa76f4bf21b4f4aac6d938.jpg",
  "https://cdn.prod.website-files.com/679185b32f76eb227e8b2d64/690e21bca5a1e6afcad44a90_1661362d69d4f83dbb9635d50fe19695.jpg",
  "https://cdn.prod.website-files.com/679185b32f76eb227e8b2d64/68cc3546430643d66ba5571a_c49ec3146d5ee88438a57615125aeb38.jpg",
  "https://cdn.prod.website-files.com/679185b32f76eb227e8b2d64/68cc34c5e8f1a1601339ac88_78b4d0a1169a170c3d8efda43133bca0.jpg",
  "https://cdn.prod.website-files.com/679185b32f76eb227e8b2d64/690e2269ff449135d95c027c_10cd22f7410c9c89996ef4459495caba.jpg"
];

cards.forEach((card, i) => {
  // Evita error si hay más cards que imágenes
  const bg = backgrounds[i % backgrounds.length];
  
  card.style.background = `
   url(${bg}) center/cover no-repeat
  `;

});