// Инициализация слайдера галереи
document.addEventListener('DOMContentLoaded', function() {
    initGallerySlider();
    smoothScroll();
});

// Слайдер галереи
function initGallerySlider() {
    const slider = document.querySelector('.gallery-slider .slider-container');
    const slides = document.querySelectorAll('.gallery-slider .slide');
    const dots = document.querySelectorAll('.gallery-slider .slider-dot');
    let currentSlide = 0;
    let slideInterval;
    const slideTime = 5000; // 5 секунд

    function goToSlide(n) {
        currentSlide = (n + slides.length) % slides.length;
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, slideTime);
    }

    function pauseSlider() {
        clearInterval(slideInterval);
    }

    // Инициализация точек навигации
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            pauseSlider();
            goToSlide(index);
            startSlider();
        });
    });

    // Пауза при наведении
    const sliderContainer = document.querySelector('.gallery-slider');
    sliderContainer.addEventListener('mouseenter', pauseSlider);
    sliderContainer.addEventListener('mouseleave', startSlider);

    // Запуск слайдера
    startSlider();
}

// Плавная прокрутка к якорям
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 90,
                    behavior: 'smooth'
                });
            }
        });
    });
}