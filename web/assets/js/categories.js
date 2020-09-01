window.addEventListener('load', function() {
    getCategories();
});

function getCategories() {
    let statusCode;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    fetch('/categories', options)
        .then((response) => {
            statusCode = response.status;
            return response.json();
        })
        .then((responseJSON) => {
            if (statusCode === 200) {
                fillCategories(responseJSON);
            }
        });
}

function fillCategories(categories) {
    const container = document.querySelector('.grid.main-categories');

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
}
