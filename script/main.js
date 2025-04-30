// Данные экспонатов
const aircrafts = [
    {
        id: 1,
        title: "Су-27 'Flanker'",
        category: "истребители",
        description: "Многоцелевой высокоманевренный всепогодный истребитель четвертого поколения.",
        specs: {
            year: "1977",
            crew: "1 человек",
            speed: "2500 км/ч"
        },
        image: "img/exhibits/su27.jpg",
        video: "video/su27.mp4"
    },
    {
        id: 2,
        title: "Ту-160 'Белый лебедь'",
        category: "бомбардировщики",
        description: "Сверхзвуковой стратегический бомбардировщик-ракетоносец с изменяемой геометрией крыла.",
        specs: {
            year: "1981",
            crew: "4 человека",
            speed: "2230 км/ч"
        },
        image: "img/exhibits/tu160.jpg",
        video: "video/tu160.mp4"
    }
];

// Слайдер новостей
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация слайдера
    const slider = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
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

    // Инициализация точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            pauseSlider();
            goToSlide(index);
            startSlider();
        });
    });

    // Пауза при наведении
    const sliderContainer = document.querySelector('.news-slider');
    sliderContainer.addEventListener('mouseenter', pauseSlider);
    sliderContainer.addEventListener('mouseleave', startSlider);

    // Запуск слайдера
    startSlider();

    // Загрузка экспонатов
    function loadAircrafts(category = 'все') {
        const container = document.getElementById('aircraft-container');
        container.innerHTML = '';

        const filteredAircrafts = category === 'все' 
            ? aircrafts 
            : aircrafts.filter(a => a.category.includes(category.toLowerCase()));

        filteredAircrafts.forEach(aircraft => {
            const card = document.createElement('div');
            card.className = 'aircraft-card';
            card.dataset.category = aircraft.category;
            
            card.innerHTML = `
                <a href="aircraft.html?id=${aircraft.id}">
                    <div class="card-content">
                        <div class="card-image">
                            <img src="${aircraft.image}" alt="${aircraft.title}">
                            <video class="card-video" autoplay loop muted>
                                <source src="${aircraft.video}" type="video/mp4">
                            </video>
                        </div>
                        <div class="card-text">
                            <span class="card-category">${aircraft.category.charAt(0).toUpperCase() + aircraft.category.slice(1)}</span>
                            <h3 class="card-title">${aircraft.title}</h3>
                            <p class="card-description">${aircraft.description}</p>
                            <div class="card-specs">
                                <span><strong>Год создания:</strong> ${aircraft.specs.year}</span>
                                <span><strong>Экипаж:</strong> ${aircraft.specs.crew}</span>
                                <span><strong>Макс. скорость:</strong> ${aircraft.specs.speed}</span>
                            </div>
                        </div>
                    </div>
                </a>
            `;
            
            container.appendChild(card);
        });
    }

    // Фильтрация экспонатов
    const filterButtons = document.querySelectorAll('.category-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadAircrafts(button.textContent);
        });
    });

    // Первоначальная загрузка
    loadAircrafts();
});