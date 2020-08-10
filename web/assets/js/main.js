document.onreadystatechange = function() {
    const loginItem = document.querySelector('#login-item');
    const profileItem = document.querySelector('#profile-item');
    const logoutItem = document.querySelector('#logout-item');

    if (localStorage.getItem('profile') === 'aluno') {
        profileItem.style.display = 'inline';
        logoutItem.style.display = 'inline';
        loginItem.style.display = 'none';
    } else if (localStorage.getItem('profile') === 'admin') {
        console.log('...');
    } else {
        loginItem.style.display = 'inline';
        profileItem.style.display = 'none';
        logoutItem.style.display = 'none';
    }
};

window.onload = function() {
    const logoutItem = document.querySelector('#logout-item');

    logoutItem.addEventListener('click', function(event) {
        localStorage.removeItem('profile');
    });
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