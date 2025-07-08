# Guia de Teste - Sistema de Notas Fiscais com Blockchain

## Pré-requisitos

- Python 3.8+
- pip (gerenciador de pacotes Python)
- Navegador web moderno
- Git (para clonar o projeto)

## 1. Configuração do Backend (Django)

### 1.1 Navegar para o diretório do backend
```bash
cd /home/jf/RepositóriosGit/Blockchain/backend
```

### 1.2 Criar ambiente virtual (recomendado)
```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

### 1.3 Instalar dependências
```bash
pip install -r requirements.txt
```

### 1.4 Aplicar migrações do banco de dados
```bash
python manage.py migrate
```

### 1.5 Criar superusuário (admin)
```bash
python manage.py createsuperuser
```
- Username: admin
- Email: admin@example.com
- Password: admin123
- CNPJ: 12.345.678/0001-90

### 1.6 Iniciar servidor backend
```bash
python manage.py runserver
```
O servidor estará disponível em: http://localhost:8000

## 2. Configuração do Frontend

### 2.1 Abrir novo terminal e navegar para o frontend
```bash
cd /home/jf/RepositóriosGit/Blockchain/frontend
```

### 2.2 Iniciar servidor HTTP simples
```bash
# Python 3
python3 -m http.server 3000

# ou Python 2
python -m SimpleHTTPServer 3000

# ou usando Node.js (se instalado)
npx http-server -p 3000
```

O frontend estará disponível em: http://localhost:3000

## 3. Testando o Sistema

### 3.1 Primeiro Acesso - Registro de Usuário

1. Abra o navegador e vá para: http://localhost:3000
2. Clique em "Cadastrar" (ou vá para register.html)
3. Preencha os dados:
   - Username: usuario1
   - Email: usuario1@example.com
   - Password: senha123
   - CNPJ: 98.765.432/0001-10
4. Clique em "Cadastrar"

### 3.2 Login

1. Vá para a página de login (login.html)
2. Use as credenciais criadas:
   - Username: usuario1
   - Password: senha123
3. Clique em "Entrar"

### 3.3 Teste de Inserção Manual

1. Após o login, você será redirecionado para a página de NFe
2. Na seção "Inserção Manual", preencha:
   - Número da Nota: 123456
   - Valor: 1500.00
   - Data de Emissão: 2025-01-08
3. Clique em "Registrar"
4. Verifique se a nota aparece na lista abaixo

### 3.4 Teste de Upload XML

1. Use o arquivo `exemplo_nfe.xml` fornecido no projeto
2. Na seção "Upload de Arquivo XML", clique em "Escolher arquivo"
3. Selecione o arquivo `exemplo_nfe.xml`
4. Clique em "Processar XML"
5. Verifique se os dados foram extraídos e a nota registrada

### 3.5 Criando Arquivo XML de Teste Personalizado

Crie um arquivo `teste_nfe.xml` com o seguinte conteúdo:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe">
    <NFe>
        <infNFe>
            <ide>
                <nNF>789012</nNF>
                <dhEmi>2025-01-10T14:30:00-03:00</dhEmi>
            </ide>
            <total>
                <ICMSTot>
                    <vNF>2500.50</vNF>
                </ICMSTot>
            </total>
        </infNFe>
    </NFe>
</nfeProc>
```

## 4. Verificações de Teste

### 4.1 API Endpoints (usando curl ou Postman)

#### Login para obter token:
```bash
curl -X POST http://localhost:8000/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "usuario1", "password": "senha123"}'
```

#### Listar notas fiscais:
```bash
curl -X GET http://localhost:8000/api/notas/ \
  -H "Authorization: Token SEU_TOKEN_AQUI"
```

#### Criar nova nota:
```bash
curl -X POST http://localhost:8000/api/notas/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token SEU_TOKEN_AQUI" \
  -d '{"numero": "999999", "valor": 1000.00, "data_emissao": "2025-01-08"}'
```

### 4.2 Verificar no Admin Django

1. Vá para: http://localhost:8000/admin/
2. Faça login com as credenciais do superusuário
3. Navegue para "Notas" > "Nota fiscals"
4. Verifique se as notas foram registradas corretamente

## 5. Cenários de Teste

### 5.1 Teste de Validação

1. **Campos obrigatórios**: Tente submeter formulário sem preencher todos os campos
2. **Formato XML inválido**: Tente fazer upload de arquivo não-XML
3. **Dados inválidos**: Tente inserir valores negativos ou datas futuras
4. **Autenticação**: Tente acessar sem estar logado

### 5.2 Teste de Funcionalidades

1. **Múltiplas notas**: Registre várias notas e verifique a listagem
2. **Diferentes formatos de data**: Teste com diferentes formatos no XML
3. **Valores decimais**: Teste com valores que têm casas decimais
4. **Caracteres especiais**: Teste com números de nota contendo caracteres especiais

## 6. Solução de Problemas

### 6.1 Problemas Comuns

**Erro de CORS**: Verifique se o frontend está rodando na porta 3000 ou atualize as configurações de CORS no settings.py

**Erro de autenticação**: Verifique se o token está sendo enviado corretamente

**Erro de migração**: Execute `python manage.py migrate` novamente

**Erro de parsing XML**: Verifique se o arquivo XML está no formato correto

### 6.2 Logs de Debug

Para ver logs detalhados:
```bash
# No backend
python manage.py runserver --verbosity=2

# No frontend (console do navegador)
F12 -> Console -> veja erros JavaScript
```

## 7. Estrutura de Dados Esperada

### Modelo NotaFiscal:
- `numero`: String (máx. 20 caracteres)
- `valor`: Decimal (10 dígitos, 2 casas decimais)
- `data_emissao`: Data
- `hash`: String (64 caracteres) - gerado automaticamente
- `usuario`: Relacionamento com usuário logado

### Resposta da API:
```json
{
  "id": 1,
  "numero": "123456",
  "valor": "1500.00",
  "data_emissao": "2025-01-08",
  "hash": "a1b2c3d4e5f6..."
}
```

## 8. Próximos Passos

Após os testes básicos, você pode:
1. Implementar a funcionalidade de blockchain (descomentando o código)
2. Adicionar mais validações
3. Implementar edição e exclusão de notas
4. Adicionar relatórios e estatísticas
5. Implementar autenticação com JWT
