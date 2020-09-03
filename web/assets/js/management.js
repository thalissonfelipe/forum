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

async function getUsers() {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    const response = await fetch('/users', options);
    if (response.status === 200) {
        const responseJSON = await response.json();
        fillUsers(responseJSON);
    } else if (response.status === 401) {
        document.getElementById('logout-item').dispatchEvent(new Event('click'));
    }
}

function fillUsers(users) {
    const container = document.querySelector('.grid.main-categories');
    document.querySelector('.loader').style.display = 'none';

    users.map(user => {
        if (user.profile === 'common') {
            container.insertAdjacentHTML('beforeend',
                '<div class="row">' +
                    '<div class="left-side">' +
                        '<img class="icon" src="' + getAvatarSrc(user.profile, user.image, user.imagetype) + '" />' +
                        '<div class="info">' +
                            '<a href="#" class="title" registry="' + user.registry + '" onclick="getUser(this)">' + user.name + '</a>' +
                            '<p class="description">' + user.course + '</p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="right-side">' +
                        '<ul>' +
                            '<li></li>' +
                            '<li class="number">' + user.posts + '</li>' +
                            '<li class="actions">' +
                                '<a id="' + user._id + '" onclick="modifyUser(\'suspended\', this)" href="#"><img src="/web/assets/img/alert.png" alt="Suspender usuário" title="Suspender usuário"></a>' +
                                '<a id="' + user._id + '" onclick="modifyUser(\'banned\', this)" href="#"><img src="/web/assets/img/danger.png" alt="Banir usuário" title="Banir usuário"></a>' +
                                '<a id="' + user._id + '" onclick="modifyUser(\'active\', this)" href="#"><img src="/web/assets/img/success.png" alt="Ativar usuário" title="Ativar usuário"></a>' +
                            '</li>' +
                        '</ul>' +
                    '</div>' +
                '</div>'
            );
        }
    });
}

async function getUser(anchor) {
    const registry = anchor.getAttribute('registry');
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    const response = await fetch(`/users/${registry}`, options);
    if (response.status === 200) {
        const responseJSON = await response.json();
        showModal(responseJSON);
    } else if (response.status === 401) {
        document.getElementById('logout-item').dispatchEvent(new Event('click'));
    }
}

function showModal(user) {
    const status = {
        'active': 'ATIVO',
        'suspended': 'SUSPENSO',
        'banned': 'BANIDO'
    };

    document.getElementById('header-name').innerHTML = user.name;
    document.getElementById('header-name').setAttribute('data-id', user._id);
    document.getElementById('status').innerHTML = status[user.status];
    document.getElementById('status').classList.add('user-' + Object.keys(status).find(k=>status[k]===status[user.status]));
    document.getElementById('username').innerHTML = user.username;
    document.getElementById('email').innerHTML = user.email;
    document.getElementById('createdAt').innerHTML = formatDatetime(user.created_at);
    document.getElementById('posts').innerHTML = user.posts;
    document.getElementById('user-modal').style.display = 'flex';
}

function hideModal() {
    document.getElementById('user-modal').style.display = 'none';
    document.getElementById('status').className = '';
}

async function modifyUser(status, anchor=null) {
    const id = !anchor ? document.getElementById('header-name').getAttribute('data-id') : anchor.getAttribute('id');
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ status, id })
    };

    const response = await fetch('/users', options);
    hideModal();
    if (response.status === 200) {
        const message = status === 'active' ? 'Usuário ativo.' : status === 'suspended' ? 'Usuário suspenso.' : 'Usuário banido.';
        showResponseModal(message);
    } else if (response.status === 401) {
        document.getElementById('logout-item').dispatchEvent(new Event('click'));
    } else {
        showResponseModal('Erro interno.');
    }
}