document.onreadystatechange = function() {
    const loginItem = document.querySelector('#login-item');
    const profileItem = document.querySelector('#profile-item');
    const managementItem = document.querySelector('#management-item');
    const logoutItem = document.querySelector('#logout-item');

    if (loginItem && profileItem && logoutItem) {

        if (localStorage.getItem('profile') === 'aluno') {
            profileItem.style.display = 'inline';
            logoutItem.style.display = 'inline';
            loginItem.style.display = 'none';
        } else if (localStorage.getItem('profile') === 'admin') {
            profileItem.style.display = 'inline';
            managementItem.style.display = 'inline';
            logoutItem.style.display = 'inline';
            loginItem.style.display = 'none';
        } else {
            loginItem.style.display = 'inline';
            profileItem.style.display = 'none';
            managementItem.style.display = 'none';
            logoutItem.style.display = 'none';
        }
    }
};

window.onload = function() {
    // theme
    const toggleSwitch = document.querySelector('input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.className = currentTheme;
    
        if (currentTheme === 'dark-theme') {
            toggleSwitch.checked = true;
        }
    } else {
        document.documentElement.className = 'light-theme';
        localStorage.setItem('theme', 'light-theme');
    }

    toggleSwitch.addEventListener('click', toggleTheme, false);

    // logout
    const logoutItem = document.querySelector('#logout-item');

    if (logoutItem) {
        logoutItem.addEventListener('click', function(event) {
            localStorage.removeItem('profile');
        });
    }

    // reply
    const button = document.querySelector('#reply-top');

    button.addEventListener('click', replyPost);
}

function toggleTheme(e) {
    if (e.target.checked) {
        document.documentElement.className = 'dark-theme';
        localStorage.setItem('theme', 'dark-theme');
    }
    else {
        document.documentElement.className = 'light-theme';
        localStorage.setItem('theme', 'light-theme');
    }    
}

function togglePassword(id) {
    const icon = document.querySelector('#' + id);
    const parent = icon.parentNode;
    const password = parent.childNodes[1];

    if (password.type === 'password') {
        password.type = 'text';
    } else {
        password.type = 'password';
    }    
}

function replyPost() {
    const replyContainer = document.querySelector('.reply-container');
    replyContainer.style.display = 'block';

    const replyButton = document.querySelector('#reply-button');

    replyButton.addEventListener('click', () => {
        alert('OK');
        replyContainer.style.display = 'none';
    });
}