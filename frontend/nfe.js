let contadorProdutos = 1;

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    if (!estaLogado()) {
        alert('Você precisa fazer login para acessar esta página!');
        window.location.href = 'login.html';
        return;
    }
    
    // Event listeners
    document.getElementById('adicionarProduto').addEventListener('click', adicionarProduto);
    document.getElementById('calcularTotal').addEventListener('click', calcularTotal);
    document.getElementById('nfeForm').addEventListener('submit', enviarFormulario);
    
    // Calcular total automaticamente quando campos de produto mudarem
    document.addEventListener('input', function(e) {
        if (e.target.matches('[name*="Quantidade"], [name*="Preco"]')) {
            calcularTotal();
        }
    });
    
    // Inicializar o estado do campo valor total
    calcularTotal();
});

function adicionarProduto() {
    const produtosContainer = document.getElementById('produtos');
    const novoProduto = document.createElement('div');
    novoProduto.className = 'produto-item';
    
    novoProduto.innerHTML = `
        <div class="form-group">
            <label for="produto${contadorProdutos}Descricao">Descrição *:</label>
            <input type="text" id="produto${contadorProdutos}Descricao" name="produto${contadorProdutos}Descricao" required>
        </div>
        
        <div class="form-group">
            <label for="produto${contadorProdutos}Quantidade">Quantidade *:</label>
            <input type="number" id="produto${contadorProdutos}Quantidade" name="produto${contadorProdutos}Quantidade" min="1" required>
        </div>
        
        <div class="form-group">
            <label for="produto${contadorProdutos}Preco">Preço Unitário (R$) *:</label>
            <input type="number" id="produto${contadorProdutos}Preco" name="produto${contadorProdutos}Preco" step="0.01" min="0" required>
        </div>
        
        <button type="button" class="btn-remove" onclick="removerProduto(this)">Remover Produto</button>
    `;
    
    produtosContainer.appendChild(novoProduto);
    contadorProdutos++;
    calcularTotal(); // Atualizar o estado do campo valor total
}

function removerProduto(botao) {
    const produtoItem = botao.closest('.produto-item');
    const produtosContainer = document.getElementById('produtos');
    
    // Permitir remover todos os produtos agora
    produtoItem.remove();
    calcularTotal();
}

function calcularTotal() {
    const produtoItems = document.querySelectorAll('.produto-item');
    const valorTotalInput = document.getElementById('valorTotal');
    
    if (produtoItems.length === 0) {
        // Se não há produtos, permitir edição manual do valor
        valorTotalInput.removeAttribute('readonly');
        valorTotalInput.placeholder = 'Digite o valor total da nota fiscal';
        return;
    }
    
    // Se há produtos, calcular automaticamente e tornar readonly
    valorTotalInput.setAttribute('readonly', true);
    valorTotalInput.placeholder = '';
    
    let total = 0;
    produtoItems.forEach(function(item, index) {
        const quantidade = parseFloat(item.querySelector(`[name*="Quantidade"]`).value) || 0;
        const preco = parseFloat(item.querySelector(`[name*="Preco"]`).value) || 0;
        total += quantidade * preco;
    });
    
    valorTotalInput.value = total.toFixed(2);
}

function coletarDadosFormulario() {
    // Dados do cliente
    const cliente = {
        nome: document.getElementById('clienteNome').value,
        cpf: document.getElementById('clienteCpf').value,
        endereco: document.getElementById('clienteEndereco').value
    };
    
    // Dados dos produtos (opcional)
    const produtos = [];
    const produtoItems = document.querySelectorAll('.produto-item');
    
    produtoItems.forEach(function(item, index) {
        const descricao = item.querySelector(`[name*="Descricao"]`).value;
        const quantidade = parseInt(item.querySelector(`[name*="Quantidade"]`).value);
        const precoUnitario = parseFloat(item.querySelector(`[name*="Preco"]`).value);
        
        if (descricao && quantidade && precoUnitario) {
            produtos.push({
                descricao: descricao,
                quantidade: quantidade,
                preco_unitario: precoUnitario
            });
        }
    });
    
    const valor = document.getElementById('valorTotal').value;
    
    // Estrutura base da requisição
    const dadosRequisicao = {
        valor: valor
    };
    
    // Adicionar conteúdo apenas se tiver produtos ou se o cliente estiver preenchido
    if (produtos.length > 0 || cliente.nome || cliente.cpf || cliente.endereco) {
        dadosRequisicao.conteudo = {
            cliente: cliente
        };
        
        // Adicionar produtos apenas se existirem
        if (produtos.length > 0) {
            dadosRequisicao.conteudo.produtos = produtos;
        }
    }
    
    return dadosRequisicao;
}

async function enviarFormulario(event) {
    event.preventDefault();
    
    // Verificar se ainda está logado
    if (!estaLogado()) {
        alert('Sua sessão expirou. Faça login novamente.');
        window.location.href = 'login.html';
        return;
    }
    
    // Calcular total antes de enviar
    calcularTotal();
    
    const dados = coletarDadosFormulario();
    const resultadoDiv = document.getElementById('resultado');
    const token = obterToken();
    
    try {
        resultadoDiv.innerHTML = '<p>Enviando nota fiscal...</p>';
        
        const response = await fetch('http://127.0.0.1:8000/api/notas/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify(dados)
        });
        
        if (response.ok) {
            const resultado = await response.json();
            resultadoDiv.innerHTML = `
                <div class="sucesso">
                    <h3>Nota fiscal criada com sucesso!</h3>
                    <p><strong>ID:</strong> ${resultado.id}</p>
                    <p><strong>Valor:</strong> R$ ${resultado.valor}</p>
                    ${resultado.blockchain_tx ? `<p><strong>Hash Blockchain:</strong> ${resultado.blockchain_tx}</p>` : ''}
                </div>
            `;
            
            // Limpar formulário
            document.getElementById('nfeForm').reset();
            
            // Remover todos os produtos extras, deixando apenas 1
            const produtosContainer = document.getElementById('produtos');
            const produtoItems = produtosContainer.querySelectorAll('.produto-item');
            
            // Remover produtos extras (manter apenas o primeiro)
            for (let i = 1; i < produtoItems.length; i++) {
                produtoItems[i].remove();
            }
            
            // Resetar contador para 2 (próximo produto a ser adicionado)
            contadorProdutos = 2;
            
            calcularTotal();
        } else if (response.status === 401) {
            // Token inválido ou expirado
            alert('Sua sessão expirou. Faça login novamente.');
            logout();
        } else {
            const erro = await response.json();
            throw new Error(erro.detail || 'Erro ao criar nota fiscal');
        }
    } catch (error) {
        console.error('Erro:', error);
        resultadoDiv.innerHTML = `
            <div class="erro">
                <h3>Erro ao enviar nota fiscal</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Máscara para CPF
document.getElementById('clienteCpf').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    e.target.value = value;
});