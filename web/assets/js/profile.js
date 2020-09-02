window.addEventListener('load', function() {
    redirectPage();
    getUser();
    handleUpdateInfo();
});

function getUser() {
    let statusCode;
    const registry = localStorage.getItem('registry');
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    fetch(`/users/${registry}`, options)
        .then((response) => {
            statusCode = response.status;
            return response.json();
        })
        .then((responseJSON) => {
            if (statusCode === 200) {
                fillProfile(responseJSON);
            }
        });
}

function fillProfile(user) {
    document.querySelector('input#name').value = user.name;
    document.querySelector('input#username').value = user.username;
    document.querySelector('input#email').value = user.email;
    document.querySelector('input#registry').value = user.registry;
    document.querySelector('input#phone').value = user.phone;
    document.querySelector('input#course').value = user.course;
    document.querySelector('input#semester').value = user.semester;

    if (localStorage.getItem('status') !== 'active') {
        document.querySelector('input#update').style.pointerEvents = 'none';
        document.querySelector('input#reset-password-button').style.pointerEvents = 'none';
    }
}

function handleUpdateInfo() {
    document.querySelector('input#update').addEventListener('click', function(event) {
        event.preventDefault();

        var errors = 0;

        const name = document.querySelector('input#name').value;
        const username = document.querySelector('input#username').value;
        const email = document.querySelector('input#email').value;
        const registry = document.querySelector('input#registry').value;
        const phone = document.querySelector('input#phone').value;
        const course = document.querySelector('input#course').value;
        const semester = document.querySelector('input#semester').value;

        if (name === '' || !(/^[A-Z a-z]{3,50}$/.test(name)) ) {  //name !== /^[A-Z a-z]{3,50}$/
            showWarningMessage('div-name', 'Nome inválido.', true);
            errors++;
        } if (username === '' || !(/^[a-z0-9_-]{3,20}$/.test(username)) ) {
            showWarningMessage('div-username', 'Usuário inválido. Usuário deve conter letras, números ou caracteres - ou _', true);
        } if (email === '' ||  !(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) ) {
            showWarningMessage('div-email', 'Email inválido.', true);
            errors++;
        } if (registry === '' || !( /[0-9]{6}/.test(registry)) ) {
            showWarningMessage('div-registry', 'Matrícula inválida.', true);
            errors++;
        } if (phone === '' || !(/[0-9]{11}/.test(phone)) ) {
            showWarningMessage('div-phone', 'Telefone inválido. Insira 2 dígitos de ddd + 9 dígitos do telefone', true);
            errors++;
        } if (course  === '' || !(/^[A-Za-z]{3,30}$/.test(course)) ) {
            showWarningMessage('div-course', 'Curso inválido.', true, true);
            errors++;
        } if (semester === '' || !(/[0-9]/.test(semester)) || ( semester > 20 || semester < 1  ) ) {
            showWarningMessage('div-semester', 'Semestre inválido.', true,true);
            errors++;
        }
        else if(errors == 0){


            const body = {
                name,
                username,
                email,
                phone,
                course,
                semester
            };

            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(body)
            };

            fetch(`/users/${registry}`, options)
                .then((response) => {
                    if (response.status === 200) {
                        showWarningMessage('div-message-response', 'Informações atualizadas com sucesso.');
                    } else if (response.status === 401) {
                        showWarningMessage('div-message-response', 'Erro interno.');
                    }
                });
        }
    });
}