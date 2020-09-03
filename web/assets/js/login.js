window.onload = function() {
    setDefaultTheme();
    handleLogin();
}

function setDefaultTheme() {
    const currentTheme = localStorage.getItem('theme');

    if (!currentTheme) {
        document.documentElement.className = 'light-theme';
        localStorage.setItem('theme', 'light-theme');
    } else {
        document.documentElement.className = currentTheme;
    }
}

function handleLogin() {
    const button = document.querySelector('#login-button');

    button.addEventListener('click', async (event) => {
        event.preventDefault();

        hideWarningMessage('div-username');
        hideWarningMessage('div-password');

        const username = document.querySelector('#login-username').value;
        const password = document.querySelector('#login-password').value;

        if (username === '') {
            showWarningMessage('div-username', 'Usuário inválido.', true);
        } else if (password === '') {
            showWarningMessage('div-password', 'Senha inválida.', true);
        } else {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, password })
            };

            const response = await fetch('/login', options);
            if (response.status === 200) {
                const responseJSON = await response.json();
                localStorage.setItem('profile', responseJSON.profile);
                localStorage.setItem('registry', responseJSON.registry);
                localStorage.setItem('status', responseJSON.status);
                location.href = '/web/public/index.html';
            } else if (response.status === 401) {
                showWarningMessage('div-password', 'Usuário ou senha inválidos.', false);
            } else if (response.status === 403) {
                showWarningMessage('div-password', 'Você não tem permissão para fazer login porque você esstá banido do fórum.', false);
            } else {
                showWarningMessage('div-password', 'Erro no servidor. Tente novamente mais tarde.', false);
            }
        }
    });
}
