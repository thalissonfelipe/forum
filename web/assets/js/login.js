window.onload = function() {
    const currentTheme = localStorage.getItem('theme');

    if (!currentTheme) {
        document.documentElement.className = 'light-theme';
        localStorage.setItem('theme', 'light-theme');
    } else {
        document.documentElement.className = currentTheme;
    }
    

    const loginButton = document.querySelector('#login-button');

    loginButton.addEventListener('click', (event) => {
        event.preventDefault();
        const username = document.querySelector('#login-username').value;
        const password = document.querySelector('#login-password').value;

        if (username === '') {
            console.log('Preencha o campo usuário.');
        } else if (password === '') {
            console.log('Preencha o campo senha.');
        } else {
            localStorage.setItem('profile', 'aluno');
            location.href = '../public/index.html';
        }
    });
}