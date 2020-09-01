window.addEventListener('load', function() {
    handleRegister();
});

function handleRegister() {
    const button = document.querySelector('#register-button');

    button.addEventListener('click', (event) => {
        event.preventDefault();

        const name = document.querySelector('input#name').value;
        const username = document.querySelector('input#username').value;
        const password = document.querySelector('input#password').value;
        const email = document.querySelector('input#email').value;
        const registry = document.querySelector('input#registry').value;
        const phone = document.querySelector('input#phone').value;
        const course = document.querySelector('input#course').value;
        const semester = document.querySelector('input#semester').value;

        if (name === '' || !(/^[A-Z a-z]{3,50}$/.test(name)) ) {  //name !== /^[A-Z a-z]{3,50}$/
            showWarningMessage('div-name', 'Nome inválido.', true);
        } if (username === '' || !(/^[a-z0-9_-]{3,20}$/.test(username)) ) {
            showWarningMessage('div-username', 'Usuário inválido. Usuário deve conter letras, números ou caracteres - ou _', true);
        } if (password === '' || !(/.{8,}/.test(password))  ) {
            showWarningMessage('div-password', 'Senha inválida. Senha deve ter mais de 8 caracteres', true);
        } if (email === '' ||  !(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) ) {
            showWarningMessage('div-email', 'Email inválido.', true);
        } if (registry === '' || !( /[0-9]{6}/.test(registry)) ) {
            showWarningMessage('div-registry', 'Matrícula inválida.', true);
        } if (phone === '' || !(/[0-9]{11}/.test(phone)) ) {
            showWarningMessage('div-phone', 'Telefone inválido. Insira 2 dígitos de ddd + 9 dígitos do telefone', true);
        } if (course  === '' || !(/^[A-Za-z]{3,30}$/.test(course)) ) {
            showWarningMessage('div-input-group-1', 'Curso inválido.', true, true);
        } if (semester === '' || !(/[0-9]/.test(semester)) || ( semester > 20 || semester < 1  ) ) {
            showWarningMessage('div-input-group-2', 'Semestre inválido.', true,true);
        } else {
            let statusCode;
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    username,
                    password,
                    email,
                    registry,
                    phone,
                    course,
                    semester
                })
            };

            fetch('/users', options)
                .then((response) => {
                    statusCode = response.status;
                    return response.json();
                })
                .then((responseJSON) => {
                    if (statusCode === 200) {
                        localStorage.setItem('profile', responseJSON.profile);
                        localStorage.setItem('registry', responseJSON.registry);
                        location.href = '/web/public/login.html';
                    }
                });
        }
    });
}
