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

        const name = document.querySelector('input#name').value;
        const username = document.querySelector('input#username').value;
        const email = document.querySelector('input#email').value;
        const registry = document.querySelector('input#registry').value;
        const phone = document.querySelector('input#phone').value;
        const course = document.querySelector('input#course').value;
        const semester = document.querySelector('input#semester').value;

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
    });
}