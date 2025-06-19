// victorine.js
class Victorine {
    constructor() {
        this.results = JSON.parse(localStorage.getItem('victorineResults')) || [];
        this.currentQuiz = null;
        this.startTime = null;
        this.initialize();
    }

    initialize() {
        this.createQuizContainer();
        this.setupEventListeners();
        this.renderResultsOnMainPage();
    }

    createQuizContainer() {
    // Проверяем, что текущий URL не содержит 'index'
    if (window.location.pathname.includes('index')) {
        return; // Если это страница index, выходим из функции
    }
    const quizContainer = document.createElement('div');
    quizContainer.className = 'victorine-container';
    quizContainer.innerHTML = `
        <div class="victorine-modal">
            <div class="victorine-header">
                <h2>Викторина по самолету</h2>
                <button class="close-victorine">&times;</button>
            </div>
            <div class="victorine-body">
                <div class="user-info-form">
                    <input type="text" id="user-name" placeholder="Ваше имя" required>
                    <button id="start-quiz">Начать викторину</button>
                </div>
                <div class="quiz-content" style="display:none;">
                    <div class="question-container"></div>
                    <div class="quiz-progress"></div>
                    <button class="submit-quiz">Ответить</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(quizContainer);
 }

    setupEventListeners() {
        // Обработчики для викторины
        document.getElementById('start-quiz')?.addEventListener('click', () => this.startQuiz());
        document.querySelector('.close-victorine')?.addEventListener('click', () => this.closeQuiz());
        document.querySelector('.submit-quiz')?.addEventListener('click', () => this.handleAnswer());

        // Обработчики для фильтров на главной странице
        document.getElementById('victorine-aircraft-filter')?.addEventListener('change', () => 
            this.renderResultsOnMainPage());
        document.getElementById('victorine-sort')?.addEventListener('change', () => 
            this.renderResultsOnMainPage());
        document.getElementById('refresh-victorine')?.addEventListener('click', () => 
            this.renderResultsOnMainPage());
    }

    loadQuizForAircraft(aircraftId) {
        const quizzes = {
            'su27': {
                title: 'Викторина по Су-27 "Фланкер"',
                questions: [
                    {
                        question: 'В каком году совершил первый полет Су-27?',
                        options: ['1977', '1981', '1985', '1990'],
                        answer: 0
                    },
                    {
                        question: 'Какой маневр впервые продемонстрировал Су-27 на авиасалоне в Ле-Бурже?',
                        options: ['Кобра Пугачёва', 'Бочка', 'Петля Нестерова', 'Иммельман'],
                        answer: 0
                    },
                    {
                        question: 'Какое максимальное количество ракет "воздух-воздух" может нести Су-27?',
                        options: ['6', '8', '10', '12'],
                        answer: 2
                    }
                ]
            },
            'tu160': {
                title: 'Викторина по Ту-160 "Белый лебедь"',
                questions: [
                    {
                        question: 'Какова максимальная скорость Ту-160?',
                        options: ['2000 км/ч', '2230 км/ч', '2500 км/ч', '1800 км/ч'],
                        answer: 1
                    },
                    {
                        question: 'Сколько человек составляет экипаж Ту-160?',
                        options: ['2', '3', '4', '5'],
                        answer: 2
                    },
                    {
                        question: 'Какой тип вооружения является основным для Ту-160?',
                        options: ['Управляемые ракеты', 'Свободнопадающие бомбы', 'Крылатые ракеты', 'Ядерные бомбы'],
                        answer: 2
                    }
                ]
            },
            'su57': {
                title: 'Викторина по Су-57 "Felon"',
                questions: [
                    {
                        question: 'К какому поколению относится Су-57?',
                        options: ['4', '4++', '5', '5+'],
                        answer: 2
                    },
                    {
                        question: 'Какая особенность конструкции Су-57 обеспечивает его малозаметность?',
                        options: ['Форма планера', 'Радиопоглощающие материалы', 'Внутренние отсеки вооружения', 'Все перечисленные'],
                        answer: 3
                    },
                    {
                        question: 'Как называется двигатель второго этапа для Су-57?',
                        options: ['АЛ-31Ф', 'АЛ-41Ф1', 'Изделие 30', 'РД-33'],
                        answer: 2
                    }
                ]
            },
            'su34': {
                title: 'Викторина по Су-34 "Fullback"',
                questions: [
                    {
                        question: 'Какое неофициальное прозвище получил Су-34 из-за формы кабины?',
                        options: ['Гусь', 'Утенок', 'Пеликан', 'Альбатрос'],
                        answer: 1
                    },
                    {
                        question: 'Какая уникальная особенность кабины Су-34 отсутствует у других современных боевых самолетов?',
                        options: [
                            'Наличие туалета',
                            'Система кондиционирования', 
                            'Цветные дисплеи',
                            'Автопилот'
                        ],
                        answer: 0
                    },
                    {
                        question: 'На базе какого истребителя был разработан Су-34?',
                        options: [
                            'Су-27',
                            'МиГ-29', 
                            'Су-30',
                            'МиГ-31'
                        ],
                        answer: 0
                    },
                    {
                        question: 'Какова максимальная боевая нагрузка Су-34?',
                        options: [
                            '4000 кг',
                            '8000 кг', 
                            '12000 кг',
                            '15000 кг'
                        ],
                        answer: 2
                    },
                    {
                        question: 'Какое вооружение НЕ типично для Су-34?',
                        options: [
                            'Х-29',
                            'КАБ-1500', 
                            'Р-77',
                            'Р-37М'
                        ],
                        answer: 3
                    },
                    {
                        question: 'Какой двигатель установлен на Су-34?',
                        options: [
                            'АЛ-31Ф-М1',
                            'АЛ-41Ф1', 
                            'РД-33',
                            'ПС-90А'
                        ],
                        answer: 0
                    }
                ]
            }
 
        };

        this.currentQuiz = quizzes[aircraftId] || quizzes['su27'];
        document.querySelector('.victorine-header h2').textContent = this.currentQuiz.title;
        document.querySelector('.test_blank')?.addEventListener('click', () => this.openQuiz());
    }

    openQuiz() {
        document.querySelector('.victorine-container').style.display = 'flex';
        document.querySelector('.user-info-form').style.display = 'block';
        document.querySelector('.quiz-content').style.display = 'none';
        document.getElementById('user-name').value = '';
    }

    closeQuiz() {
        document.querySelector('.victorine-container').style.display = 'none';
    }

    startQuiz() {
        const userName = document.getElementById('user-name').value.trim();
        if (!userName) {
            alert('Пожалуйста, введите ваше имя');
            return;
        }

        this.userName = userName;
        this.startTime = new Date();
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.showQuestion();
    }

    showQuestion() {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const questionContainer = document.querySelector('.question-container');
        
        let optionsHTML = '';
        question.options.forEach((option, index) => {
            optionsHTML += `
                <label class="quiz-option">
                    <input type="radio" name="quiz-answer" value="${index}">
                    ${option}
                </label>
            `;
        });

        questionContainer.innerHTML = `
            <div class="quiz-question">${question.question}</div>
            <div class="quiz-options">${optionsHTML}</div>
        `;

        document.querySelector('.quiz-progress').textContent = 
            `Вопрос ${this.currentQuestionIndex + 1} из ${this.currentQuiz.questions.length}`;
        
        document.querySelector('.user-info-form').style.display = 'none';
        document.querySelector('.quiz-content').style.display = 'block';
    }

    handleAnswer() {
        const selectedOption = document.querySelector('input[name="quiz-answer"]:checked');
        if (!selectedOption) {
            alert('Пожалуйста, выберите ответ');
            return;
        }

        this.userAnswers.push(parseInt(selectedOption.value));
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex < this.currentQuiz.questions.length) {
            this.showQuestion();
        } else {
            this.finishQuiz();
        }
    }

    finishQuiz() {
        const endTime = new Date();
        const timeSpent = Math.floor((endTime - this.startTime) / 1000);
        const dateCompleted = endTime.toLocaleDateString('ru-RU');

        let correctAnswers = 0;
        this.currentQuiz.questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.answer) {
                correctAnswers++;
            }
        });

        const result = {
            aircraft: this.currentQuiz.title.replace('Викторина по ', ''),
            userName: this.userName,
            correctAnswers: correctAnswers,
            totalQuestions: this.currentQuiz.questions.length,
            timeSpent: timeSpent,
            date: dateCompleted,
            timestamp: endTime.getTime()
        };

        this.saveResult(result);
        this.showResults(result);
        this.renderResultsOnMainPage();
    }

    saveResult(result) {
        this.results.push(result);
        localStorage.setItem('victorineResults', JSON.stringify(this.results));
    }

    showResults(result) {
        const questionContainer = document.querySelector('.question-container');
        const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
        
        let message = '';
        if (percentage >= 80) {
            message = 'Отличный результат! Вы настоящий эксперт в авиации!';
        } else if (percentage >= 50) {
            message = 'Хороший результат! Вы хорошо разбираетесь в авиации!';
        } else {
            message = 'Попробуйте еще раз! Изучите материалы и возвращайтесь!';
        }

        questionContainer.innerHTML = `
            <div class="quiz-results">
                <h3>Результаты викторины</h3>
                <p>Поздравляем, ${result.userName}!</p>
                <p>${message}</p>
                <div class="result-score">
                    <span class="score-percentage">${percentage}%</span>
                    <span class="score-details">${result.correctAnswers} из ${result.totalQuestions} правильных ответов</span>
                </div>
                <p>Время прохождения: ${result.timeSpent} сек</p>
                <p>Дата: ${result.date}</p>
                <button class="close-results">Закрыть</button>
            </div>
        `;

        document.querySelector('.quiz-progress').textContent = '';
        document.querySelector('.submit-quiz').style.display = 'none';

        document.querySelector('.close-results').addEventListener('click', () => {
            this.closeQuiz();
        });
    }

    renderResultsOnMainPage() {
        if (!document.querySelector('.victorine-section')) return;

        const results = this.getSortedAndFilteredResults();
        this.updateStats(results);
        this.renderResultsTable(results);
    }

    getSortedAndFilteredResults() {
        const aircraftFilter = document.getElementById('victorine-aircraft-filter')?.value || 'all';
        const sortOption = document.getElementById('victorine-sort')?.value || 'date-desc';

        let filteredResults = [...this.results];

        // Фильтрация по самолету
        if (aircraftFilter !== 'all') {
            filteredResults = filteredResults.filter(result => 
                result.aircraft.toLowerCase().includes(aircraftFilter)
            );
        }

        // Сортировка
        switch (sortOption) {
            case 'date-desc':
                filteredResults.sort((a, b) => b.timestamp - a.timestamp);
                break;
            case 'date-asc':
                filteredResults.sort((a, b) => a.timestamp - b.timestamp);
                break;
            case 'score-desc':
                filteredResults.sort((a, b) => {
                    const aScore = a.correctAnswers / a.totalQuestions;
                    const bScore = b.correctAnswers / b.totalQuestions;
                    return bScore - aScore || b.timestamp - a.timestamp;
                });
                break;
            case 'time-asc':
                filteredResults.sort((a, b) => a.timeSpent - b.timeSpent || b.timestamp - a.timestamp);
                break;
        }

        return filteredResults;
    }

    updateStats(results) {
        document.getElementById('total-participants').textContent = results.length;
        
        if (results.length > 0) {
            const averageScore = results.reduce((sum, result) => {
                return sum + (result.correctAnswers / result.totalQuestions);
            }, 0) / results.length;
            
            const bestScore = Math.max(...results.map(result => 
                result.correctAnswers / result.totalQuestions
            ));
            
            document.getElementById('average-score').textContent = 
                (averageScore * 100).toFixed(1) + '%';
            document.getElementById('best-score').textContent = 
                (bestScore * 100).toFixed(1) + '%';
        } else {
            document.getElementById('average-score').textContent = '0%';
            document.getElementById('best-score').textContent = '0%';
        }
    }

    renderResultsTable(results) {
        const tbody = document.querySelector('#victorine-results tbody');
        tbody.innerHTML = '';

        if (results.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" style="text-align: center;">Нет результатов для отображения</td>`;
            tbody.appendChild(row);
            return;
        }

        results.forEach(result => {
            const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.userName}</td>
                <td>${result.aircraft}</td>
                <td>
                    <div class="score-bar-container">
                        <div class="score-bar" style="width: ${percentage}%"></div>
                        <span class="score-text">${result.correctAnswers}/${result.totalQuestions}</span>
                    </div>
                </td>
                <td>${result.timeSpent} сек</td>
                <td>${result.date}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Инициализация викторины при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const victorine = new Victorine();
    
    // Определяем ID самолета из URL или имени файла
    const pathParts = window.location.pathname.split('/');
    const aircraftPage = pathParts[pathParts.length - 1];
    const aircraftId = aircraftPage.split('.')[0];
    
    // Загружаем викторину для текущего самолета (если это страница самолета)
    if (aircraftPage && aircraftPage !== 'main.html' && aircraftPage !== 'index.html') {
        victorine.loadQuizForAircraft(aircraftId);
    }
});