window.addEventListener('load', function() {
    getCategories();
});

async function getCategories() {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    const response = await fetch('/categories', options);
    if (response.status === 200) {
        const responseJSON = await response.json();
        fillCategories(responseJSON);
    } else if (response.status === 401) {
        document.getElementById('logout-item').dispatchEvent(new Event('click'));
    }
}

function fillCategories(categories) {
    const container = document.querySelector('.grid.main-categories');
    document.querySelector('.loader').style.display = 'none';

    categories.map(category => {
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
                    '<img class="icon" src="/web/assets/img/default-category.png" />' +
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
}
