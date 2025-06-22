// Данные экспонатов
const aircrafts = [
        {
        id: "su57",
        title: "Су-57 'Фельдмаршал'",
        category: "истребители",
        description: "Многоцелевой высокоманевренный всепогодный истребитель пятого поколения с управляемым вектором тяги.",
        specs: {
            year: "2001",
            crew: "1 человек",
            speed: "2600 км/ч"
        },
        image: "img/service/su57_card_3.png",
        video: "/media/cards/su57_card_video.mp4",
        detailPage: "jets/su57.html"
    },
    {
        id: "su34",
        title: "Су-34 'Утенок'",
        category: "истребители",
        description: "Российский многоцелевой истребитель 4++ поколения.",
        specs: {
            year: "1990",
            crew: "2 человека",
            speed: "1900 км/ч"
        },
        image: "img/service/su34_card.jpg",
        video: "/media/su34/su34_ooes.mp4",
        detailPage: "jets/su34.html"
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
        video: "/media/cards/tu160_card_video.mp4",
        detailPage: "jets/tu160.html"
    },
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
        image: "img/service/su27_card.jpg",
        video: "/media/cards/su27_card_video.mp4",
        detailPage: "jets/su27.html"
    },
    {
        id: "su35",
        title: "Су-35С 'Фланкер-Э'",
        category: "истребители",
        description: "Российский многоцелевой сверхманёвренный истребитель поколения 4++.",
        specs: {
            year: "2007",
            crew: "1 человек",
            speed: "2500 км/ч"
        },
        image: "img/service/su35_card.jpg",
        video: "/media/cards/su35_card_video.mp4",
        detailPage: "jets/su35.html"
    },
    {
        id: "tu22m3",
        title: "Ту-22М3 'Ответный удар'",
        category: "бомбардировщики",
        description: "Советский турбовинтовой стратегический бомбардировщик-ракетоносец.",
        specs: {
            year: "1972",
            crew: "6-7 человек",
            speed: "2300 км/ч"
        },
        image: "img/service/tu22m_card.jpg",
        video: "/media/tu22m3/tu22m3_video.mp4",
        detailPage: "jets/tu22m3.html"
    }
];




// Константы для пагинации
const ITEMS_PER_PAGE = 3;
let currentPage = 1;
let currentCategory = 'Все';
let currentSearchTerm = '';
let filteredAircrafts = [...aircrafts];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initNewsSlider();
    initAircraftCatalog();
    initSearch();
    initCategoryFilter();
    initPaginationButtons();
});

// Инициализация слайдера новостей
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

// Инициализация каталога
function initAircraftCatalog() {
    loadAircrafts();
}

// Инициализация поиска
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    const handleSearch = () => {
        currentSearchTerm = searchInput.value.toLowerCase();
        applyFilters();
    };

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
}

// Инициализация фильтра по категориям
function initCategoryFilter() {
    const filterButtons = document.querySelectorAll('.category-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.textContent;
            applyFilters();
        });
    });
}

// Инициализация кнопок пагинации
function initPaginationButtons() {
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadAircrafts();
            renderPagination();
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredAircrafts.length / ITEMS_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            loadAircrafts();
            renderPagination();
        }
    });
}

// Применение всех фильтров (категория + поиск)
function applyFilters() {
    currentPage = 1;
    
    // Фильтрация по категории
    filteredAircrafts = currentCategory === 'Все' 
        ? [...aircrafts] 
        : aircrafts.filter(a => a.category === currentCategory.toLowerCase());
    
    // Фильтрация по поисковому запросу
    if (currentSearchTerm) {
        filteredAircrafts = filteredAircrafts.filter(aircraft => 
            aircraft.title.toLowerCase().includes(currentSearchTerm) || 
            aircraft.description.toLowerCase().includes(currentSearchTerm)
        );
    }
    
    loadAircrafts();
    renderPagination();
}

// Загрузка и отображение экспонатов
function loadAircrafts() {
    const container = document.getElementById('aircraft-container');
    container.innerHTML = '';

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedAircrafts = filteredAircrafts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (paginatedAircrafts.length === 0) {
        container.innerHTML = '<p class="no-results">Экспонаты не найдены</p>';
        return;
    }

    paginatedAircrafts.forEach(aircraft => {
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

// Отрисовка пагинации
function renderPagination() {
    const totalPages = Math.ceil(filteredAircrafts.length / ITEMS_PER_PAGE);
    const pageNumbers = document.getElementById('page-numbers');
    pageNumbers.innerHTML = '';

    // Определяем диапазон отображаемых страниц
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Корректируем диапазон, если он слишком короткий
    if (endPage - startPage < 4) {
        if (currentPage < 3) {
            endPage = Math.min(5, totalPages);
        } else {
            startPage = Math.max(totalPages - 4, 1);
        }
    }

    // Кнопка первой страницы
    if (startPage > 1) {
        const firstPageBtn = createPageButton(1);
        pageNumbers.appendChild(firstPageBtn);
        if (startPage > 2) {
            pageNumbers.appendChild(createEllipsis());
        }
    }

    // Основные кнопки страницф
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = createPageButton(i);
        pageNumbers.appendChild(pageBtn);
    }

    // Кнопка последней страницы
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbers.appendChild(createEllipsis());
        }
        const lastPageBtn = createPageButton(totalPages);
        pageNumbers.appendChild(lastPageBtn);
    }

    // Обновляем состояние кнопок "Назад/Вперед"
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages || totalPages === 0;
}

// Создание кнопки страницы
function createPageButton(pageNumber) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = pageNumber;
    pageBtn.classList.toggle('active', pageNumber === currentPage);
    pageBtn.addEventListener('click', () => {
        currentPage = pageNumber;
        loadAircrafts();
        renderPagination();
    });
    return pageBtn;
}

// Создание разделителя (многоточия)
function createEllipsis() {
    const ellipsis = document.createElement('span');
    ellipsis.textContent = '...';
    ellipsis.style.padding = '0 5px';
    return ellipsis;
}