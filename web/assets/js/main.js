document.onreadystatechange = function() {
    const loginItem = document.querySelector('#login-item');
    const profileItem = document.querySelector('#profile-item');
    const managementItem = document.querySelector('#management-item');
    const logoutItem = document.querySelector('#logout-item');

    if (loginItem && profileItem && logoutItem && managementItem) {
        if (localStorage.getItem('profile') === 'common') {
            profileItem.style.display = 'inline';
            logoutItem.style.display = 'inline';
            loginItem.style.display = 'none';
        } else if (localStorage.getItem('profile') === 'admin') {
            profileItem.style.display = 'none';
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
    handleTheme();
    handleLogout();
    handleFontSize();
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

function handleTopicButton() {
    if (localStorage.getItem('status') !== 'active') {
        document.querySelector('#cursor-disabled').style.cursor = 'not-allowed';
        document.querySelector('.tooltip').classList.add('tooltip-on');
        document.querySelector('.new-topic-container').classList.add('new-topic-container-disabled');
        document.querySelector('.new-topic-container').style.pointerEvents = 'none';
    }

    document.querySelector('.new-topic-container').addEventListener('click', (event) => {
        if (!localStorage.getItem('profile')) {
            location.href = '/web/public/login.html';
            return;
        } 
    });
}

function handleLogout() {
    const logout = document.querySelector('#logout-item');

    if (logout) {
        logout.addEventListener('click', function() {
            localStorage.removeItem('profile');
            localStorage.removeItem('status');
            localStorage.removeItem('registry');
            location.href = '/web/public/login.html';
        });
    }
}

function handleFontSize() {
    const normal = document.querySelector('#normalize-font-btn');
    const increase = document.querySelector('#increase-font-btn');
    const decrease = document.querySelector('#decrease-font-btn');

    normal && (normal.addEventListener('click', normalizeFontSize));
    increase && (increase.addEventListener('click', increaseFontSize));
    decrease && (decrease.addEventListener('click', decreaseFontSize));
}

function handleTheme() {
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
}

function showWarningMessage(id, message, changeInputColor=false, isInputGroup=false) {
    // TODO: mudar cor do texto e da borda
    const div = document.querySelector('#' + id);
    const span = div.children[1];
    
    // if (!isInputGroup) {
    //     const input = div.previousElementSibling.children[0];
    // } else {
    //     const input = div; // TODO
    // }
    
    div.style.visibility = 'visible';
    span.innerHTML = message;
}

function hideWarningMessage(id) {
    const div = document.querySelector('#' + id);
    const span = div.children[1];
    //const input = div.previousElementSibling.children[0];

    div.style.visibility = 'hidden';
    span.innerHTML = '';
   // input.style.borderBottomColor = 'var(--text)';
}

function getQueryParameter(variable) {
    let query = decodeURIComponent(window.location.search.substring(1));
    let vars = query.split('&');

    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return (false);
}

function formatTime (date) {
    let hour = addZeroBefore(date.getHours());
    let minutes =  addZeroBefore(date.getMinutes());
    let seconds = addZeroBefore(date.getSeconds());
    let formattedTime = `${hour}:${minutes}:${seconds}`;

    return formattedTime;
}

function formatDatetime(datetime) {
    const date = new Date(datetime);

    let day = addZeroBefore(date.getDate());
    let month = capitalize(date.toLocaleString('pt-br', { month: 'long' }));
    let year = date.getFullYear();
    let formattedDate = `${day} de ${month} de ${year}, ${formatTime(date)}`;

    return formattedDate;
}

function addZeroBefore(n) {
    return n < 10 ? '0' + n : n;
}

function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}

function increaseFontSize() {
    const root = document.documentElement;
    let size = Number(root.style.getPropertyValue('--font-size'));
    if (!size)  size = 1;
    size += 0.07;
    if (size > 1.3) size = 1.3; 
    root.style.setProperty('--font-size', size);
}

function decreaseFontSize() {
    const root = document.documentElement;
    let size = Number(root.style.getPropertyValue('--font-size'));
    if (!size) size = 1;
    size -= 0.07;
    if (size < 0.8) size = 0.8;
    root.style.setProperty('--font-size', size);
}

function normalizeFontSize() {
    const root = document.documentElement;
    root.style.setProperty('--font-size', 1);
}

function getAvatarSrc(profile, buffer, bufferType) {
    let src;

    if (buffer) {
        let b64encoded = btoa(String.fromCharCode.apply(null, buffer.data));
        src = `data:${bufferType};base64,${b64encoded}`;
    } else {
        src = profile === 'admin' ? '/web/assets/img/default-avatar-admin.png' : '/web/assets/img/default-avatar.png';
    }

    return src;
}

function redirectPage() {
    if (localStorage.getItem('profile') === 'admin') {
        location.href = '/web/public/index.html';
    }
    return;
}

function showResponseModal(message) {
    document.getElementById('response-modal').style.display = 'flex';
    document.getElementById('response-modal-message').innerHTML = message;

    setTimeout(function() {
        document.getElementById('response-modal').style.display = 'none';
    }, 3000);
}

function hideResponseModal() {
    document.getElementById('response-modal').style.display = 'none';
}

function showConfirmModal(message) {
    document.getElementById('confirm-modal').style.display = 'flex';
    document.getElementById('confirm-modal-message').innerHTML = message;

    setTimeout(function() {
        document.getElementById('confirm-modal').style.display = 'none';
    }, 3000);

}

function hideConfirmModal() {
    document.getElementById('confirm-modal').style.display = 'none';
}
