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
    const logoutItem = document.querySelector('#logout-item');

    if (logoutItem) {

        logoutItem.addEventListener('click', function(event) {
            localStorage.removeItem('profile');
        });
    
    }
}

function setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
}

function toggleTheme() {
   if (localStorage.getItem('theme') === 'theme-dark'){
       setTheme('theme-light');
   } else {
       setTheme('theme-dark');
   }
}

(function () {
   if (localStorage.getItem('theme') === 'theme-dark') {
       setTheme('theme-dark');
   } else {
       setTheme('theme-light');
   }
})();

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