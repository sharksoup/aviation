// Данные экспонатов
const aircrafts = [
    {
        id: "su27",
        title: "Су-27 'Фланкер'",
        category: "истребители",
        description: "Многоцелевой высокоманевренный всепогодный истребитель четвертого поколения.",
        specs: {
            year: "1977",
            crew: "1 человек",
            speed: "2500 км/ч"
        },
        image: "img/service/su27_card.png",
        video: "video/su27.mp4",
        detailPage: "jets/su27.html"
    },
    {
        id: "tu160",
        title: "Ту-160 'Белый лебедь'",
        category: "бомбардировщики",
        description: "Сверхзвуковой стратегический бомбардировщик-ракетоносец с изменяемой геометрией крыла.",
        specs: {
            year: "1981",
            crew: "4 человека",
            speed: "2230 км/ч"
        },
        image: "img/service/tu160_card.jpg",
        video: "video/tu160.mp4",
        detailPage: "jets/tu160.html"
    },
    {
        id: "su57",
        title: "Су-57 'Felon'",
        category: "истребители",
        description: "Многоцелевой высокоманевренный всепогодный истребитель пятого поколения с управляемым вектором тяги.",
        specs: {
            year: "2001",
            crew: "1 человек",
            speed: "2600 км/ч"
        },
        image: "img/service/su57_card.jpg",
        video: "video/su57.mp4",
        detailPage: "jets/su57.html"
    }
];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initNewsSlider();
    initAircraftCatalog();
});

// Слайдер новостей (без изменений)
function initNewsSlider() {
    const slider = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let slideInterval;
    const slideTime = 5000;

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

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            pauseSlider();
            goToSlide(index);
            startSlider();
        });
    });

    const sliderContainer = document.querySelector('.news-slider');
    sliderContainer.addEventListener('mouseenter', pauseSlider);
    sliderContainer.addEventListener('mouseleave', startSlider);

    startSlider();
}

// Каталог экспонатов
function initAircraftCatalog() {
    loadAircrafts();

    const filterButtons = document.querySelectorAll('.category-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadAircrafts(button.textContent);
        });
    });
}

// Загрузка экспонатов
function loadAircrafts(category = 'Все') {
    const container = document.getElementById('aircraft-container');
    container.innerHTML = '';

    const filteredAircrafts = category === 'Все' 
        ? aircrafts 
        : aircrafts.filter(a => a.category === category.toLowerCase());

    if (filteredAircrafts.length === 0) {
        container.innerHTML = '<p class="no-results">Экспонаты не найдены</p>';
        return;
    }

    filteredAircrafts.forEach(aircraft => {
        const card = document.createElement('div');
        card.className = 'aircraft-card';
        card.dataset.category = aircraft.category;
        
        card.innerHTML = `
            <a href="${aircraft.detailPage}">
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