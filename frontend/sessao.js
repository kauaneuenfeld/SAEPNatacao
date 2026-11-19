const usuario = JSON.parse(localStorage.getItem('usuario'));
const expira = localStorage.getItem('expira');

if (!usuario) {
    window.location.href = 'login.html'; //niguem logado
} else if (!expira || Date.now() > number(expira)) {
    alert('Sua sessao expirou, faça login novamente');
    logout();
}

setInterval(() => { //confere a cada 30 segundos
    if (Date.now() > number(expira)) {
        alert('Sua sessao expirou, faça login novamente');
        logout();
    }
}, 30000);

function logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('expira');
    window.location.href = 'login.html';
}

function voltar() {
    window.location.href = 'principal.html';
}