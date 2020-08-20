document.onreadystatechange = function() {
    const loginItem = document.querySelector('#login-item');
    const profileItem = document.querySelector('#profile-item');
    const managementItem = document.querySelector('#management-item');
    const logoutItem = document.querySelector('#logout-item');

    if (loginItem && profileItem && logoutItem) {
        if (localStorage.getItem('profile') === 'common') {
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
            toggleSwitch && (toggleSwitch.checked = true);
        }
    } else {
        document.documentElement.className = 'light-theme';
        localStorage.setItem('theme', 'light-theme');
    }

    toggleSwitch && (toggleSwitch.addEventListener('click', toggleTheme, false));

    // reply
    const replyButton = document.querySelector('#reply-top');

    if (replyButton) {
        if (!localStorage.getItem('profile')) {
            replyButton.href = '/web/public/login.html';
            return;
        }
        replyButton.addEventListener('click', replyPost);
    }

    const addTopic = document.querySelector('.new-topic-container');

    if (addTopic) {
        if (!localStorage.getItem('profile')) {
            replyButton.href = '/web/public/login.html';
            return;
        }
    }

    handleLogout();
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

function handleLogout() {
    const logout = document.querySelector('#logout-item');

    if (logout) {
        logout.addEventListener('click', function() {
            localStorage.removeItem('profile');
        });
    }
}


function showWarningMessage(id, message, changeInputColor) {
    // TODO: mudar cor do texto e da borda
    const div = document.querySelector('#' + id);
    const span = div.children[1];
    const input = div.previousElementSibling.children[0];

    div.style.visibility = 'visible';
    span.innerHTML = message;
    changeInputColor && (input.style.borderBottomColor = 'red');
}

function hideWarningMessage(id) {
    const div = document.querySelector('#' + id);
    const span = div.children[1];
    const input = div.previousElementSibling.children[0];

    div.style.visibility = 'hidden';
    span.innerHTML = '';
    input.style.borderBottomColor = 'var(--text)';
}