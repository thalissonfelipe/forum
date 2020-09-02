window.addEventListener('load', function() {
    getCategory();
});

async function getCategory() {
    const category = getQueryParameter('category');
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    const response = await fetch(`/categories/${category}`, options);
    if (response.status === 200) {
        const responseJSON = await response.json();
        fillCategory(responseJSON);
    } else if (response.status === 401) {
        document.getElementById('logout-item').dispatchEvent(new Event('click'));
    } else if (response.status === 404) {
        location.href = '/web/public/not_found.html';
    }
}

function fillCategory(category) {
    let container = document.querySelector('.main-content');
    document.querySelector('.loader').style.display = 'none';

    container.insertAdjacentHTML('beforeend',
        '<div class="path category">' +
            '<i class="fa fa-home" aria-hidden="true"></i>' +
            '<div class="links">' +
                '<a href="/web/public/index.html">Página Inicial</a>' +
                '<span>/</span>' +
                '<a href="/web/public/categories.html">Categorias</a>' +
                '<span>/</span>' +
                '<a href="#">' + category.title + '</a>' +
            '</div>' +
        '</div>' +
        '<h2 class="category-name">' + category.title + '</h2>' +
        '<div class="grid last-posts grid-category-page-fix grid-mgm">' +
            '<header>' +
                '<h1>Posts</h1>' +
                '<ul>' +
                    '<li>Visitas</li>' +
                    '<li>Comentários</li>' +
                    '<li>Autor</li>' +
                '</ul>' +
            '</header>'
    );

    container = document.querySelector('.grid.last-posts');

    category.posts.map(post => {
        let author = !post.author ? 'Admin' : post.author.split(' ')[0];
        container.insertAdjacentHTML('beforeend',
            '<div class="row">' +
                '<div class="left-side">' +
                    '<img class="icon" src="' + getAvatarSrc(post.userImage, post.userImageType) + '" />' +
                    '<a href="/web/public/post.html?category=' + category.title + '&id=' + post.id  + '" class="title">' + post.title + '</a>' +
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
}
