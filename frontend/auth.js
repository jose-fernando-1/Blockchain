// Utilitários
function salvarUsuario(usuario) {
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

function carregarUsuario() {
  return JSON.parse(localStorage.getItem('usuario'));
}

// Cadastro
const cadastroForm = document.getElementById('cadastroForm');
if (cadastroForm) {
  cadastroForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const cnpj = document.getElementById('cnpj').value.trim();

    if (!username || !password || !cnpj) {
      alert('Preencha todos os campos!');
      return;
    }

    // Salva usuário com CNPJ
    salvarUsuario({ username, password, cnpj });
    alert('Usuário cadastrado com sucesso!');
    window.location.href = 'login.html';
  });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    const usuario = carregarUsuario();

    if (
      usuario &&
      usuario.username === username &&
      usuario.password === password
    ) {
      localStorage.setItem('logado', 'true');
      alert('Login realizado!');
      window.location.href = 'nfe.html';
    } else {
      alert('Usuário ou senha incorretos!');
    }
  });
}
