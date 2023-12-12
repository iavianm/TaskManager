document.addEventListener('DOMContentLoaded', () => {
  const flash = document.querySelector('.close-flash');
  if (flash) {
    flash.addEventListener('click', (event) => {
      event.target.closest('.flash-container').remove();
    });
    setTimeout(() => {
      flash.closest('.flash-container').remove();
    }, 5000);
  }
});
