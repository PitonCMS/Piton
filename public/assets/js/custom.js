// Navbar Scroll animate background
window.onscroll = () => {
  const nav = document.querySelector('#navbar');
  if (this.scrollY <= 10) nav.className = 'nav';
  else nav.className = 'nav scroll';
};