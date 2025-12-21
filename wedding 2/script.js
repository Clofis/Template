document.addEventListener('DOMContentLoaded', () => {
  const topImage = document.querySelector('.animate-top');
  const bottomImage = document.querySelector('.animate-bottom');
  const centerContent = document.querySelector('.animate-center');

  // set kondisi awal
  topImage.classList.add('enter-top');
  bottomImage.classList.add('enter-bottom');
  centerContent.classList.add('enter-center');

  // 1️⃣ bunga bawah
  setTimeout(() => {
    bottomImage.classList.add('enter-active');
  }, 200);

  // 2️⃣ bunga atas
  setTimeout(() => {
    topImage.classList.add('enter-active');
  }, 600);

  // 3️⃣ logo & teks
  setTimeout(() => {
    centerContent.classList.add('enter-active');
  }, 1000);
});


