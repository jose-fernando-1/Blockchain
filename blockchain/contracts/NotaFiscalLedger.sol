// SPDX-License-Identifier: MIT
// Esta linha é um identificador de licença, uma boa prática em Solidity.
pragma solidity ^0.8.28;

/**
 * @title NotaFiscalLedger
 * @dev Um contrato simples para servir como um "livro-razão" imutável
 * para os hashes de notas fiscais.
 */
contract NotaFiscalLedger {

    // Um array público de strings que irá armazenar todos os hashes.
    // Por ser 'public', o Solidity cria automaticamente uma função 'getter'
    // para que possamos ler os hashes de fora do contrato.
    string[] public hashes;

    // Um evento é como um "sinal" que o contrato emite para o mundo exterior.
    // Aplicações (como o nosso backend Django) podem "ouvir" esses eventos.
    event HashAdicionado(uint indexed id, string hash);

    /**
     * @dev Adiciona um novo hash de nota fiscal à blockchain.
     * @param _hash O hash SHA-256 da nota fiscal que queremos armazenar.
     */
    function adicionarHash(string memory _hash) public {
        // Adiciona o hash recebido ao final do array 'hashes'.
        hashes.push(_hash);
        
        // Emite o evento para notificar que um novo hash foi adicionado,
        // informando seu ID (que é o índice no array) e o próprio hash.
        emit HashAdicionado(hashes.length - 1, _hash);
    }

    /**
     * @dev Retorna a quantidade total de hashes que já foram armazenados.
     * Esta é uma função 'view', o que significa que ela apenas lê dados
     * e não custa "gás" (taxa da transação) para ser chamada.
     */
    function totalHashes() public view returns (uint) {
        return hashes.length;
    }
}