window.addEventListener('load', function() {
    getPost();
});

async function getPost() {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    const response = await fetch(`/posts/${getQueryParameter('id')}`, options);
    if (response.status === 200) {
        const responseJSON = await response.json();
        fillPost(responseJSON);
    } else if (response.status === 401) {
        document.getElementById('logout-item').dispatchEvent(new Event('click'));
    } else if (response.status === 400 || response.status === 404) {
        location.href = '/web/public/not_found.html';
    }
}

function filterComments({ post, comments }) {
    // TODO
    let value = document.querySelector('#search').value.toLowerCase().trim();
    let filteredComments = comments.filter((comment) => {
        return comment.body.toLowerCase().indexOf(value) > -1;
    });
    if (filteredComments.length !== 0) {
        fillPost({ post, comments: filteredComments });
    }
};

function fillPost({ post, comments }) {
    const container = document.querySelector('.main-content');
    container.innerHTML = '';

    let author = post.user.profile === 'admin' ? 'Admin' : post.user.name.split(' ')[0];
    let spanPosts = post.user.profile === 'admin' ? '' : '<p class="posts">Total de posts: <span>' + post.user.posts + '</span></p>';
    let iconClass = localStorage.getItem('profile') === 'admin' ? 'button-icon can-update' : 'button-icon';
    let commentsIds = [];

    container.insertAdjacentHTML('beforeend',
        '<div class="header">' +
            '<div class="path">' +
                '<i class="fa fa-home" aria-hidden="true"></i>' +
                '<div class="links">' +
                    '<a href="/web/public/index.html">Página Inicial</a>' +
                    '<span>/</span>' +
                    '<a href="/web/public/categories.html">Categorias</a>' +
                    '<span>/</span>' +
                    '<a href="/web/public/category.html?category=' + getQueryParameter('category') + '">' + getQueryParameter('category') +'</a>' +
                '</div>' +
            '</div>' +
            '<h1>' + post.title + '</h1>' +
            '<div class="buttons">' +
                '<span id="cursor-disabled"><a id="reply-top" href="#reply-container" onclick="addComment()">Responder <i class="fa fa-reply" aria-hidden="true"></i></a></span>' +
                '<div class="search-container">' +
                    '<input type="text" id="search" autocomplete="off" placeholder="Procure aqui">' +
                    '<i class="fa fa-search" aria-hidden="true"></i>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="container">' +
            '<div class="post">' +
                '<i class="fa fa-quote-right" aria-hidden="true"></i>' +
                '<h1>' + post.title + '</h1>' +
                '<span>' + formatDatetime(post.createdAt) + '</span>' +
                '<p>' + post.body +'</p>' +
            '</div>' +
            '<div class="user-info">' +
                '<a class="' + iconClass + '" id="delete-post" onclick="deleteItem(\'posts\')"><i class="fa fa-trash-o" aria-hidden="true"></i></a>' +
                '<img class="icon" src="' + getAvatarSrc(post.user.profile, post.user.userImage, post.user.userImageType) + '" />' +
                '<span id="userid" data-id="' + post.user.id + '">' + author + '</span>' +
                spanPosts +
                '<p class="joined">Entrou: <span>' + formatDatetime(post.user.createdAt) + '</span></p>' +
            '</div>' +
        '</div>'
    );

    if (localStorage.getItem('status') !== 'active') {
        document.querySelector('#cursor-disabled').style.cursor = 'not-allowed';
        document.querySelector('#reply-top').style.pointerEvents = 'none';
    }

    comments.map(comment => {
        author = comment.user.profile === 'admin' ? 'Admin' : comment.user.name.split(' ')[0];
        spanPosts = comment.user.profile === 'admin' ? '' : '<p class="posts">Total de posts: <span>' + comment.user.posts + '</span></p>';
        commentsIds.push(comment.user.id);

        container.insertAdjacentHTML('beforeend',
            '<div class="container">' +
                '<div class="post">' +
                    '<i class="fa fa-quote-right" aria-hidden="true"></i>' +
                    '<h1>Re: ' + post.title + '</h1>' +
                    '<span>' + formatDatetime(comment.createdAt) + '</span>' +
                    '<p>' + comment.body +'</p>' +
                '</div>' +
                '<div class="user-info">' +
                    '<a class="' + iconClass + '" commentId="' + comment.id + '" id="' + comment.user.id + '" onclick="deleteItem(\'comments\', this)"><i class="fa fa-trash-o" aria-hidden="true"></i></a>' +
                    '<img class="icon" src="' + getAvatarSrc(comment.user.profile, comment.user.userImage, comment.user.userImageType) + '" />' +
                    '<span>' + author + '</span>' +
                    spanPosts +
                    '<p class="joined">Entrou: <span>' + formatDatetime(comment.user.createdAt) + '</span></p>' +
                '</div>' +
            '</div>'
        );
    });

    container.insertAdjacentHTML('beforeend',
        '<div id="reply-container" class="reply-container">' +
            '<div class="icons">' +
                '<i class="fa fa-bold" aria-hidden="true"></i>' +
                '<i class="fa fa-italic" aria-hidden="true"></i>' +
                '<i class="fa fa-underline" aria-hidden="true"></i>' +
                '<i class="fa fa-font" aria-hidden="true"></i>' +
                '<i class="fa fa-eraser" aria-hidden="true"></i>' +
            '</div>' +
            '<textarea name="reply-answer" id="reply-answer" placeholder="Deixe sua mensagem aqui"></textarea>' +
            '<div class="buttons">' +
            '<span id="cursor-disabled" class="send"><a id="reply-button">Responder <i class="fa fa-reply" aria-hidden="true"></i></a></span>' +
            '</div>' +
        '</div>'
    );

    (localStorage.getItem('profile') && localStorage.getItem('profile') !== 'admin') && checkUser(post.user.id, commentsIds);
}

function addComment() {
    if (!localStorage.getItem('profile')) {
        location.href = '/web/public/login.html';
        return;
    }
    
    const replyContainer = document.querySelector('.reply-container');
    replyContainer.style.display = 'block';

    document.querySelector('#reply-button').addEventListener('click', async () => {
        const commentBody = document.querySelector('#reply-answer');

        if (commentBody.value === '') {
            commentBody.focus();
            return;
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ commentBody: commentBody.value, postId: getQueryParameter('id'), category: getQueryParameter('category') })
        };

        const response = await fetch('/comments', options);
        if (response.status === 200) {
            replyContainer.style.display = 'none';
            getPost();
        } else if (response.status === 401) {
            document.getElementById('logout-item').dispatchEvent(new Event('click'));
        }
    });
}

async function deleteItem(type, anchor=null) {
    const url = anchor !== null ? `/${type}/${anchor.getAttribute('commentId')}` : `/${type}/${getQueryParameter('id')}`;
    const id = anchor !== null ? anchor.getAttribute('id') : document.getElementById('userid').getAttribute('data-id');
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ id })
    };

    const response = await fetch(url, options);
    if (response.status === 200) {
        if (!anchor) {
            location.href = `/web/public/category.html?category=${getQueryParameter('category')}`;
        } else {
            getPost();
        }
    } else if (response.status === 401) {
        document.getElementById('logout-item').dispatchEvent(new Event('click'));
    }
}

// Essa função habilita o delete do post/comment se ele for o dono
async function checkUser(postId, commentsIds) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    const response = await fetch(`/users/${localStorage.getItem('registry')}`, options);
    const { _id } = await response.json();

    if (_id === postId) {
        document.getElementById('delete-post').classList.add('can-update');
    }

    if (commentsIds.includes(_id)) {
        document.getElementById(_id).classList.add('can-update');
    }

}