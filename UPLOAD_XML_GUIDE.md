# Funcionalidade de Upload de XML - NFe

## Visão Geral

A página de NFe agora suporta duas formas de registrar notas fiscais:

1. **Upload de Arquivo XML** - Processa automaticamente arquivos XML de NFe
2. **Inserção Manual** - Permite inserir dados manualmente

## Como Usar o Upload de XML

### 1. Preparação do Arquivo XML

O sistema aceita arquivos XML de NFe no formato padrão brasileiro. O arquivo deve conter:
- Número da nota fiscal (`<nNF>`)
- Valor total (`<vNF>`)
- Data de emissão (`<dhEmi>` ou `<dEmi>`)

### 2. Processo de Upload

1. Na página de NFe, localize a seção "Upload de Arquivo XML"
2. Clique em "Escolher arquivo" e selecione seu arquivo XML
3. Clique em "Processar XML"
4. O sistema extrairá automaticamente os dados e registrará a nota fiscal

### 3. Validações

O sistema realiza as seguintes validações:
- Verifica se o arquivo é um XML válido
- Extrai dados essenciais (número, valor, data)
- Valida formato da data
- Confirma autenticação do usuário

### 4. Estrutura XML Suportada

```xml
<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe">
    <NFe>
        <infNFe>
            <ide>
                <nNF>123456</nNF>
                <dhEmi>2025-01-08T10:30:00-03:00</dhEmi>
            </ide>
            <total>
                <ICMSTot>
                    <vNF>1500.00</vNF>
                </ICMSTot>
            </total>
        </infNFe>
    </NFe>
</nfeProc>
```

### 5. Alternativas de Estrutura

O sistema também suporta estruturas XML simplificadas:
- `<numero>` como alternativa para `<nNF>`
- `<valor>` como alternativa para `<vNF>`
- `<data>` como alternativa para `<dhEmi>`

## Funcionalidades Adicionais

### Feedback Visual
- Mensagens de sucesso em verde
- Mensagens de erro em vermelho
- Indicador de carregamento durante processamento

### Segurança
- Validação de autenticação por token
- Verificação de tipo de arquivo
- Parsing seguro de XML

### Compatibilidade
- Suporta formatos de data ISO 8601
- Conversão automática para formato brasileiro
- Tratamento de erros robusto

## Resolução de Problemas

### Erros Comuns

1. **"Arquivo XML inválido"**
   - Verifique se o arquivo é um XML bem formatado
   - Certifique-se de que não há caracteres especiais corrompidos

2. **"Não foi possível extrair dados essenciais"**
   - Verifique se o XML contém os campos obrigatórios
   - Confirme a estrutura do arquivo

3. **"Token de autenticação não encontrado"**
   - Faça login novamente na aplicação
   - Verifique se o token não expirou

### Arquivo de Exemplo

Um arquivo XML de exemplo está disponível em `/exemplo_nfe.xml` para testes.

## Melhorias Futuras

- Suporte para múltiplos arquivos XML
- Validação de assinatura digital
- Preview dos dados antes do registro
- Histórico de uploads

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Django REST Framework
- **Parsing**: DOMParser (nativo do navegador)
- **Autenticação**: Token-based authentication
