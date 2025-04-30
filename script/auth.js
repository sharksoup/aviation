function validateNotEmpty(...fields) {
    return fields.every(field => field.trim() !== '');
}

function setupLoginPage() {
    const loginBtn = document.getElementById('login');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const login = document.getElementById('login_form').value;
            const password = document.getElementById('password_form').value;

            if (!validateNotEmpty(login, password)) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            if (!login.includes('@')) {
                alert('Пожалуйста, введите корректный email');
                return;
            }

            window.location.href = 'main.html';
        });
    }
}

function setupRegisterPage() {
    const registerBtn = document.getElementById('register');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const name = document.getElementById('name_form').value;
            const surename = document.getElementById('surename_form').value;
            const password = document.getElementById('password_form').value;
            const mail = document.getElementById('mail_form').value;
            const phone = document.getElementById('phone_form').value;

            if (!validateNotEmpty(name, surename, password, mail, phone)) {
                alert('Пожалуйста, заполните все поля');
                return;
            }

            if (!mail.includes('@')) {
                alert('Пожалуйста, введите корректный email');
                return;
            }

            window.location.href = 'main.html';
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setupLoginPage();
    setupRegisterPage();
});