require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28", // Garanta que esta versão seja compatível com a do seu contrato
  networks: {
    // Adicionamos esta seção para a nossa rede Ganache
    ganache: {
      url: "http://127.0.0.1:7545", // O endereço que o Ganache mostra
    }
  }
};