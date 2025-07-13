const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// Este é o módulo de deploy para o nosso contrato
module.exports = buildModule("NotaFiscalLedgerModule", (m) => {
  // Dentro do módulo, pedimos para o Hardhat implantar nosso contrato "NotaFiscalLedger"
  const ledger = m.contract("NotaFiscalLedger");

  // O módulo retorna um objeto com o contrato implantado para referência futura
  return { ledger };
});