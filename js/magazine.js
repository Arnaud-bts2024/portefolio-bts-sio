let pageFlip;

document.addEventListener('DOMContentLoaded', () => {
  const pageFlipElement = document.getElementById('book');

  pageFlip = new St.PageFlip(pageFlipElement, {
    width: 450,
    height: 600,
    size: 'fixed',
    minWidth: 320,
    maxWidth: 550,
    minHeight: 400,
    maxHeight: 700,
    maxShadowOpacity: 0.4,
    showCover: true,
    mobileScrollSupport: false
  });

  pageFlip.loadFromHTML(document.querySelectorAll('.page'));
});

function goToPage(pageIndex) {
  if (pageFlip) {
    pageFlip.flip(pageIndex);
  }
}
