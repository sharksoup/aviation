// Инициализация слайдера галереи
document.addEventListener('DOMContentLoaded', function() {
    initGallerySlider();
    smoothScroll();
});

    // Инициализация полноэкранного просмотра
    initFullscreenView();

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

// Открывающиеся изображения

function initFullscreenView() {
    // Создаем элементы для полноэкранного просмотра
    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-overlay';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-fullscreen';
    closeBtn.innerHTML = '&times;';
    
    const img = document.createElement('img');
    img.className = 'fullscreen-image';
    
    const caption = document.createElement('div');
    caption.className = 'fullscreen-caption';
    
    overlay.appendChild(img);
    overlay.appendChild(caption);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    
    // Находим все изображения с классом zoomable-image
    const zoomableImages = document.querySelectorAll('.zoomable-image');
    
    zoomableImages.forEach(image => {
        image.addEventListener('click', function(e) {
            if (e.target.tagName === 'IMG') {
                const imgSrc = this.querySelector('img').src;
                const imgAlt = this.querySelector('img').alt;
                
                img.src = imgSrc;
                caption.textContent = imgAlt;
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Закрытие по клику на overlay или кнопку
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay || e.target === closeBtn) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}