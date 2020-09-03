window.addEventListener('load', function() {
    handleRegister();
});

function handleRegister() {
    document.querySelector('#register-button').addEventListener('click', async (event) => {
        event.preventDefault();

        var errors = 0;

        const file = document.querySelector('input#photo').files[0];
        const name = document.querySelector('input#name').value;
        const username = document.querySelector('input#username').value;
        const password = document.querySelector('input#password').value;
        const email = document.querySelector('input#email').value;
        const registry = document.querySelector('input#registry').value;
        const phone = document.querySelector('input#phone').value;
        const course = document.querySelector('input#course').value;
        const semester = document.querySelector('input#semester').value;

        if (name === '' || !(/^[a-zA-Z" "ç]{3,40}/.test(name)) ) {  //name !== /^[A-Z a-z]{3,50}$/
            showWarningMessage('div-name', 'Nome inválido.', true);
            errors++;
        } if (username === '' || !(/^[a-z0-9_-]{3,20}$/.test(username)) ) {
            showWarningMessage('div-username', 'Usuário inválido. Usuário deve conter letras, números ou caracteres - ou _.', true);
            errors++;
        } if (password === '' || !(/.{8,}/.test(password))  ) {
            showWarningMessage('div-password', 'Senha inválida. Senha deve ter mais de 8 caracteres.', true);
            errors++;
        } if (email === '' ||  !(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) ) {
            showWarningMessage('div-email', 'Email inválido.', true);
            errors++;
        } if (registry === '' || !( /[0-9]{6}/.test(registry)) ) {
            showWarningMessage('div-registry', 'Matrícula inválida.', true);
            errors++;
        } if (phone === '' || !(/[0-9]{11}/.test(phone)) ) {
            showWarningMessage('div-phone', 'Telefone inválido. Insira 2 dígitos de ddd + 9 dígitos do telefone.', true);
            errors++;
        } if (course  === '' || !(/^[a-zA-Z" "ç]{3,40}/.test(course)) ) {
            showWarningMessage('div-input-group-1', 'Curso inválido.', true, true);
            errors++;
        } if (semester === '' || !(/[0-9]/.test(semester)) || ( semester > 20 || semester < 1  ) ) {
            showWarningMessage('div-input-group-2', 'Semestre inválido.', true);
            errors++;
        } else if (errors == 0) {
            const body = { name, username, password, email, registry, phone, course, semester };
            const formData = new FormData();
            for (const name in body) {
                formData.append(name, body[name]);
            }
            if (file) formData.append('file', file);
            const options = {
                method: 'POST',
                body: formData
            };

            const response = await fetch('/users', options);
            if (response.status === 200) {
                showWarningMessage('div-success', 'Cadastro realizado com sucesso!', true);
                document.getElementById('register-form').reset();
            } else if (response.status === 409) {
                const responseJSON = await response.json();
                showWarningMessage('div-input-group-1', responseJSON.message + ' Por favor, escolha outro.', true);
            }
        }
    });
}
