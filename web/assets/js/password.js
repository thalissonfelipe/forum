window.addEventListener('load', function() {
    handleForgotPassword();
    handleChangePassword();
});

function handleForgotPassword() {
    const button = document.getElementById('send-button');

    button && (button.addEventListener('click', (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;

        if (email === '') {
            showWarningMessage('div-email', 'Email inválido.');
            return;
        }

        let statusCode;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email })
        };

        fetch('/forgot', options)
            .then((response) => {
                statusCode = response.status;
                return response.json();
            })
            .then((responseJSON) => {
                if (statusCode === 200) {
                    const a = document.getElementById('reset-password-link');
                    a.style.display = 'block';
                    a.setAttribute('href', responseJSON.resetPasswordLink);
                } else if (statusCode === 404) {
                    showWarningMessage('div-email', 'Email não cadastrado no sistema.');
                }
            });
    }));
}

function handleChangePassword() {
    const button = document.getElementById('reset-password-button');

    button && (button.addEventListener('click', (event) => {
        event.preventDefault();

        const password = document.getElementById('password').value;
        const repeatPassword = document.getElementById('repeat-password').value;

        if (password === '' || repeatPassword === '') {
            showWarningMessage('div-repeat-password', 'Senha inválida.');
            return;
        } else if (password !== repeatPassword) {
            showWarningMessage('div-repeat-password', 'A confirmação da senha não confere.');
            return;
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ password, registry: document.querySelector('input#registry').value })
        };

        let token = getQueryParameter('token');
        token = token ? token : 'token';

        fetch(`/reset/${token}`, options)
            .then((response) => {
                if (response.status === 200) {
                    showWarningMessage('div-repeat-password', 'Senha atualizada com sucesso.');
                } else if (response.status === 401) {
                    showWarningMessage('div-repeat-password', 'Prazo expirado. Solicite uma nova requisição para trocar sua senha.');
                }
            });
    }));
}