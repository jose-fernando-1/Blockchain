// Utilitários
function obterToken() {
  return localStorage.getItem('token');
}

function estaLogado() {
  const token = obterToken();
  return token !== '';
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

// Cadastro
const cadastroForm = document.getElementById('cadastroForm');
if (cadastroForm) {
  cadastroForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const cnpj = document.getElementById('cnpj').value.trim();
    const email = document.getElementById('email').value.trim();
    const first_name = document.getElementById('first_name').value.trim();
    const last_name = document.getElementById('last_name').value.trim();

    if (!username || !password || !cnpj || !email || !first_name || !last_name) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          email,
          cnpj,
          first_name,
          last_name
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Usuário cadastrado com sucesso!');
        window.location.href = 'login.html';
      } else {
        const errorData = await response.json();
        alert(`Erro ao cadastrar usuário: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      alert('Erro de conexão com o servidor!');
      console.error('Erro:', error);
    }
  });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        localStorage.setItem('token', data.token || '');
        alert('Login realizado!');
        window.location.href = 'nfe.html';
      } else {
        const errorData = await response.json();
        alert(`Erro ao fazer login: ${errorData.message || 'Usuário ou senha incorretos!'}`);
      }
    } catch (error) {
      alert('Erro de conexão com o servidor!');
      console.error('Erro:', error);
    }
  });
}
