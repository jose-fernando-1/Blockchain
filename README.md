# Projeto: Nota Fiscal com Blockchain e Bot de Telegram

Este projeto é uma aplicação web completa que demonstra como registrar o hash de notas fiscais em uma blockchain local para garantir sua integridade. Inclui um backend Django, um Smart Contract em Solidity e um bot de Telegram para consultas.

## Tecnologias Utilizadas

* **Backend:** Django, Django REST Framework
* **Blockchain:** Solidity, Hardhat, Ethers.js
* **Blockchain Local:** Ganache
* **Bot:** Python-telegram-bot
* **Banco de Dados:** SQLite3

## Pré-requisitos

* [Python](https://www.python.org/downloads/) (versão 3.10 ou superior)
* [Node.js e npm](https://nodejs.org/en/) (versão 18 ou superior)
* [Ganache](https://trufflesuite.com/ganache/) (aplicativo de desktop)

## Guia de Instalação e Inicialização

Siga estes passos na ordem correta para configurar e iniciar todos os componentes do projeto.

### 1. Clonar o Repositório (se aplicável)

Se estiver configurando em uma máquina nova, comece clonando o repositório.
```bash
git clone <url-do-seu-repositorio>
cd <nome-da-pasta-do-projeto>
```

### 2. Rodar a Blockchain Local

* Abra o aplicativo **Ganache**.
* Clique em **"QUICKSTART"** para iniciar um novo workspace. Mantenha o Ganache aberto durante todo o uso do sistema.

### 3. Implantar o Smart Contract

Com a blockchain rodando, precisamos implantar nosso contrato nela.

1.  Abra um terminal e navegue até a pasta `blockchain`:
    ```bash
    cd blockchain
    ```

2.  Instale as dependências do Node.js:
    ```bash
    npm install
    ```

3.  Faça o deploy do contrato na rede Ganache:
    ```bash
    npx hardhat ignition deploy ./ignition/modules/Deploy.js --network ganache
    ```

4.  **Guarde o resultado!** Copie o endereço do contrato que será exibido no terminal (ex: `0x...`). Você precisará dele no próximo passo.

### 4. Configurar e Rodar o Backend Django

Agora, vamos preparar o servidor principal da aplicação.

1.  Abra um **novo terminal** e navegue até a pasta `backend`:
    ```bash
    cd backend
    ```

2.  Crie e ative um ambiente virtual:
    ```bash
    # Criar o ambiente
    python -m venv env

    # Ativar no Windows
    .\env\Scripts\activate

    # Ativar no macOS/Linux
    # source env/bin/activate
    ```

3.  Instale as dependências do Python:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure as variáveis de ambiente:**
    * Abra o arquivo `backend/settings.py`.
    * Encontre a seção `CONFIGURAÇÃO DA BLOCKCHAIN`.
    * Cole o **endereço do Smart Contract** do passo 3 na variável `SMART_CONTRACT_ADDRESS`.
    * (Se aplicável) Cole o **Token do Bot do Telegram** na variável correspondente.

5.  Configure o banco de dados:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    python manage.py createsuperuser
    ```

6.  Inicie o servidor Django:
    ```bash
    python manage.py runserver
    ```
    O servidor estará rodando em `http://127.0.0.1:8000`.

### 5. Iniciar o Bot do Telegram

Para que o bot de consulta funcione, ele precisa rodar em seu próprio processo.

1.  Abra um **terceiro terminal**.
2.  Navegue até a pasta `backend` e ative o **mesmo ambiente virtual**:
    ```bash
    cd backend
    .\env\Scripts\activate
    ```

3.  Execute o script do bot:
    ```bash
    python telegram_bot.py
    ```
    O bot estará online e esperando por mensagens.

7. Para Rodar o FrontEnd e cadastrar novas notas fiscais:
    ```bash
      cd frontend
      python3 -m http.server 3000 --bind 127.0.0.1 
    ```
## Resumo da Operação

Para que o sistema completo funcione, você precisa ter **3 processos rodando em terminais separados** e o **aplicativo Ganache aberto**:

1.  **Ganache:** Aplicação rodando em segundo plano.
2.  **Terminal 1:** Servidor Django (`python manage.py runserver`).
3.  **Terminal 2:** Bot do Telegram (`python telegram_bot.py`).
4.  **Terminal 3:** Rodar o frontend para cadastrar novas notas fiscais
