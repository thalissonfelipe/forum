window.addEventListener('load', function() {
    getData();
});

async function getData() {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };
    const data = {};

    const categories = await fetch('/categories', options);
    const posts = await fetch('/posts', options);
    data.categories = await categories.json();
    data.posts = await posts.json();

    fillHome(data);
}

function fillCategoriesOptions(categories) {
    let s = '<option value="0">Selecione uma categoria</option>';

    categories.map(category => {
        s += `<option value="${category.title}">${category.title}</option>`;
    })

    return s;
}

function fillHome({ categories, posts }) {
    let container = document.querySelector('.main-content');
    container.innerHTML = '';

    // Adicionar novo post
    container.insertAdjacentHTML('beforeend',
        '<div class="grid main-categories">' +
            '<div id="reply-container" class="reply-container reply-container-home">' +
                '<h1 id="new-post">Novo post</h1>' +
                '<select name="categories-name" id="categories-name" required>' +
                    fillCategoriesOptions(categories) +
                '</select>' +
                '<input id="title-input" class="title-input" type="text" placeholder="Digite o título aqui" required autocomplete="off" />' +
                '<div class="icons">' +
                    '<i class="fa fa-bold" aria-hidden="true"></i>' +
                    '<i class="fa fa-italic" aria-hidden="true"></i>' +
                    '<i class="fa fa-underline" aria-hidden="true"></i>' +
                    '<i class="fa fa-font" aria-hidden="true"></i>' +
                    '<i class="fa fa-eraser" aria-hidden="true"></i>' +
                '</div>' +
                '<textarea name="reply-answer" id="reply-answer" class="reply-home" required placeholder="Deixe sua mensagem aqui"></textarea>' +
                '<div class="buttons">' +
                    '<a id="reply-button">Postar <i class="fa fa-location-arrow" aria-hidden="true"></i></a>' +
                '</div>' +
            '</div>' +

            '<header>' +
                '<a href="/web/public/categories.html">Principais categorias</a>' +
                '<ul>' +
                    '<li>Tópicos</li>' +
                    '<li>Comentários</li>' +
                    '<li>Last post</li>' +
                '</ul>' +
            '</header>'
    );

    container = document.querySelector('.grid.main-categories');
    const mainCategories = categories.sort(function(a, b) {
        return (b.topics.length + b.comments) - (a.topics.length + a.comments);
    }).slice(0, 5);

    // Principais categorias
    mainCategories.map(category => {
        let lastPost = category.lastPost ?
            '<li class="last-post">' +
                '<a href="/web/public/post.html?category=' + category.title + '&id=' + category.lastPost.id  + '" class="title">' + category.lastPost.title + '</a>' +
                '<p>by <span>' + category.lastPost.author.split(' ')[0] + '</span></p>' +
                '<span>' + formatDatetime(category.lastPost.createdAt) + '</span>' +
            '</li>' :
            '<li class="last-post"><a>0 posts</a></li>';

        container.insertAdjacentHTML('beforeend',
            '<div class="row categories">' +
                '<div class="left-side">' +
                '<img class="icon" src="' + getAvatarSrc(category.image, category.imagetype) + '" />' +
                    '<div class="info">' +
                        '<a href="/web/public/category.html?category=' + category.title + '" class="title">' + category.title + '</a>' +
                        '<p class="description">' + category.description + '</p>' +
                    '</div>' +
                '</div>' +
                '<div class="right-side">' +
                    '<ul>' +
                        '<li class="number">' + category.topics.length + '</li>' +
                        '<li class="number">' + category.comments + '</li>' +
                        lastPost +
                    '</ul>' +
                '</div>' +
            '</div>'
        );
    });

    container.insertAdjacentHTML('beforeend', '</div>');
    container = document.querySelector('.main-content');

    container.insertAdjacentHTML('beforeend',
        '<div class="grid last-posts">' +
            '<header>' +
                '<h1>Últimos posts</h1>' +
                '<ul>' +
                    '<li>Visitas</li>' +
                    '<li>Comentários</li>' +
                    '<li>Autor</li>' +
                '</ul>' +
            '</header>'
    );

    container = document.querySelector('.grid.last-posts');
    const lastPosts = posts.reverse().slice(0, 10);

    // Últimos posts
    lastPosts.map(post => {
        let author = post.profile === 'admin' ? 'Admin' : post.author.split(' ')[0];
        container.insertAdjacentHTML('beforeend',
            '<div class="row">' +
                '<div class="left-side">' +
                    '<img class="icon" src="' + getAvatarSrc(post.userImage, post.userImageType) + '" />' +
                    '<a href="/web/public/post.html?category=' + post.category + '&id=' + post._id  + '" class="title">' + post.title + '</a>' +
                '</div>' +
                '<div class="right-side">' +
                    '<ul>' +
                        '<li class="number">' + post.visits + '</li>' +
                        '<li class="number">' + post.comments + '</li>' +
                        '<li class="author">' +
                            '<a href="#">' + author + '</a>' +
                        '</li>' +
                    '</ul>' +
                '</div>' +
            '</div>'
        );
    });

    container.insertAdjacentHTML('beforeend', '</div>');
    container = document.querySelector('.main-content');

    const mostVisitedPosts = posts.sort(function(a, b) {
        return b.visits - a.visits;
    }).slice(0, 3);

    container.insertAdjacentHTML('beforeend',
        '<div class="trending">' +
            '<header class="trending-heading">Mais Acessados</header>'
    );

    container = document.querySelector('.trending');

    // Posts mais visitados
    mostVisitedPosts.map(post => {
        container.insertAdjacentHTML('beforeend',
            '<div class = "trending__item">' +
                '<a href="/web/public/post.html?category=' + post.category + '&id=' + post._id  + '" class="title">' + post.title + '</a>' +
                '<p class = "trending-info">' + post.body + '</p>' +
                '<p>by <span>' + post.author.split(' ')[0] + '</span></p>' +
                '<span class = "trending-date">' + formatDatetime(post.createdAt) + '</span>' +
                '<hr>' +
            '</div>'
        );
    });

    container.insertAdjacentHTML('beforeend',
        '</div>' +
        '<a id="reply-top" href="#new-post" onclick="addNewPost()" class="new-topic-container">' +
            '<i class="fa fa-plus" aria-hidden="true"></i>' +
            'TÓPICO' +
        '</a>'
    );

    handleTopicButton();
}

function addNewPost() {
    if (!localStorage.getItem('profile')) {
        location.href = '/web/public/login.html';
        return;
    }

    const replyContainer = document.querySelector('.reply-container');
    replyContainer.style.display = 'block';

    const button = document.querySelector('#reply-button');

    button.addEventListener('click', () => {
        const title = document.querySelector('#title-input');
        const body = document.querySelector('#reply-answer');
        const select = document.getElementById('categories-name');
        const category = select.options[select.selectedIndex].value;

        select.addEventListener('change', (event) => {
            event.target.style.border = '0.15rem solid var(--main)';
        });

        if (category === '0') {
            select.style.border = '0.15rem solid red';
        } else if (title.value === '') {
            title.focus();
        } else if (body.value === '') {
            body.focus();
        } else {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ title: title.value, body: body.value, category })
            };

            fetch('/posts', options)
                .then((response) => {
                    if (response.status === 200) {
                        replyContainer.style.display = 'none';
                        getData();
                    }
                });
        }
    });
}