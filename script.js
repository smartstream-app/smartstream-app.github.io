document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');

    // Scroll right when Next is clicked
    btnNext.addEventListener('click', () => {
        // Find the width of one image, plus the gap
        const scrollAmount = track.clientWidth * 0.85; 
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // Scroll left when Prev is clicked
    btnPrev.addEventListener('click', () => {
        const scrollAmount = track.clientWidth * 0.85;
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
});