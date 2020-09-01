window.addEventListener('load', function() {
    getUsers();

    // TODO: Fechar modal ao clicar fora
    // document.addEventListener('click', (event) => {
    //     console.log(event.target.closest)
    //     if (!event.target.closest.length && !event.target.id === 'user-modal') {
    //         console.log('okk')
    //       } 
    // });
});

function getUsers() {
    let statusCode;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    fetch('/users', options)
        .then((response) => {
            statusCode = response.status;
            return response.json();
        })
        .then((responseJSON) => {
            if (statusCode === 200) {
                fillUsers(responseJSON);
            }
        });
}

function fillUsers(users) {
    const container = document.querySelector('.grid.main-categories');

    users.map(user => {
        if (user.profile === 'common') {
            container.insertAdjacentHTML('beforeend',
                '<div class="row">' +
                    '<div class="left-side">' +
                        '<img class="icon" src="' + getAvatarSrc(user.image, user.imagetype) + '" />' +
                        '<div class="info">' +
                            '<a href="#" class="title" registry=' + user.registry + ' onclick="getUser(this)">' + user.name + '</a>' +
                            '<p class="description">' + user.course + '</p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="right-side">' +
                        '<ul>' +
                            '<li></li>' +
                            '<li class="number">' + user.posts + '</li>' +
                            '<li class="actions">' +
                                '<a href="#"><img src="/web/assets/img/alert.png" alt="Suspender usuário"></a>' +
                                '<a href="#"><img src="/web/assets/img/danger.png" alt="Banir usuário"></a>' +
                            '</li>' +
                        '</ul>' +
                    '</div>' +
                '</div>'
            );
        }
    });
}

function getUser(anchor) {
    const registry = anchor.getAttribute('registry');
    
    let statusCode;
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
                showModal(responseJSON);
            }
        });
}

function showModal(user) {
    document.getElementById('header-name').innerHTML = user.name;
    document.getElementById('status').innerHTML = 'ativo'.toUpperCase(); // TODO
    document.getElementById('username').innerHTML = user.username;
    document.getElementById('email').innerHTML = user.email;
    document.getElementById('createdAt').innerHTML = formatDatetime(user.created_at);
    document.getElementById('posts').innerHTML = user.posts;
    document.getElementById('user-modal').style.display = 'flex';
}

function hideModal() {
    document.getElementById('user-modal').style.display = 'none';
}