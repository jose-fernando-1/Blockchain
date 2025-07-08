// Função para mostrar mensagens de feedback
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    // Remove mensagens anteriores
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Adiciona nova mensagem
    document.body.insertBefore(messageDiv, document.querySelector('h3'));
    
    // Remove mensagem após 5 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Função para processar XML da NFe
function processarXML(xmlContent) {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
        
        // Verificar se houve erro no parsing
        if (xmlDoc.querySelector('parsererror')) {
            throw new Error('Arquivo XML inválido');
        }
        
        // Extrair dados do XML (adaptado para estrutura NFe)
        const numero = xmlDoc.querySelector('nNF')?.textContent || 
                      xmlDoc.querySelector('numero')?.textContent || '';
        
        const valor = xmlDoc.querySelector('vNF')?.textContent || 
                     xmlDoc.querySelector('valor')?.textContent || '';
        
        const dataEmissao = xmlDoc.querySelector('dhEmi')?.textContent || 
                           xmlDoc.querySelector('dEmi')?.textContent || 
                           xmlDoc.querySelector('data')?.textContent || '';
        
        // Converter data para formato YYYY-MM-DD se necessário
        let dataFormatada = '';
        if (dataEmissao) {
            const dataObj = new Date(dataEmissao);
            if (!isNaN(dataObj.getTime())) {
                dataFormatada = dataObj.toISOString().split('T')[0];
            }
        }
        
        return {
            numero: numero,
            valor: valor,
            dataEmissao: dataFormatada
        };
    } catch (error) {
        console.error('Erro ao processar XML:', error);
        throw error;
    }
}

// Função para registrar nota fiscal
async function registrarNotaFiscal(dadosNota) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token de autenticação não encontrado');
        }
        
        const response = await fetch('http://localhost:8000/api/notas/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(dadosNota)
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao registrar nota fiscal:', error);
        throw error;
    }
}

// Função para carregar notas existentes
async function carregarNotas() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token de autenticação não encontrado');
        }
        
        const response = await fetch('http://localhost:8000/api/notas/', {
            headers: {
                'Authorization': `Token ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const notas = await response.json();
        const listaNotas = document.getElementById('listaNotas');
        listaNotas.innerHTML = '';
        
        notas.forEach(nota => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Número:</strong> ${nota.numero} | 
                <strong>Valor:</strong> R$ ${nota.valor} | 
                <strong>Data:</strong> ${nota.data_emissao} | 
                <strong>Hash:</strong> ${nota.hash}
            `;
            listaNotas.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao carregar notas:', error);
        showMessage('Erro ao carregar notas existentes', 'error');
    }
}

// Event listener para upload de XML
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('xmlFile');
    const file = fileInput.files[0];
    
    if (!file) {
        showMessage('Por favor, selecione um arquivo XML', 'error');
        return;
    }
    
    if (!file.name.toLowerCase().endsWith('.xml')) {
        showMessage('Por favor, selecione um arquivo XML válido', 'error');
        return;
    }
    
    try {
        showMessage('Processando arquivo XML...', 'loading');
        
        const fileContent = await file.text();
        const dadosNota = processarXML(fileContent);
        
        // Validar dados extraídos
        if (!dadosNota.numero || !dadosNota.valor) {
            throw new Error('Não foi possível extrair dados essenciais do XML');
        }
        
        // Registrar nota fiscal
        await registrarNotaFiscal(dadosNota);
        
        showMessage('Nota fiscal registrada com sucesso!', 'success');
        
        // Limpar formulário
        fileInput.value = '';
        
        // Recarregar lista de notas
        await carregarNotas();
        
    } catch (error) {
        console.error('Erro:', error);
        showMessage(`Erro ao processar arquivo: ${error.message}`, 'error');
    }
});

// Event listener para inserção manual
document.getElementById('notaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const numeroNota = document.getElementById('numeroNota').value;
    const valorNota = document.getElementById('valorNota').value;
    const dataEmissao = document.getElementById('dataEmissao').value;
    
    if (!numeroNota || !valorNota || !dataEmissao) {
        showMessage('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    try {
        const dadosNota = {
            numero: numeroNota,
            valor: parseFloat(valorNota.replace(',', '.')),
            data_emissao: dataEmissao
        };
        
        await registrarNotaFiscal(dadosNota);
        
        showMessage('Nota fiscal registrada com sucesso!', 'success');
        
        // Limpar formulário
        document.getElementById('numeroNota').value = '';
        document.getElementById('valorNota').value = '';
        document.getElementById('dataEmissao').value = '';
        
        // Recarregar lista de notas
        await carregarNotas();
        
    } catch (error) {
        console.error('Erro:', error);
        showMessage(`Erro ao registrar nota: ${error.message}`, 'error');
    }
});

// Carregar notas ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarNotas();
});
