# Assistente NFS-e — Duque de Caxias/RJ (v3)

Fluxo desta versão:

1. Cliente informa/seleciona o código do serviço municipal.
2. Cliente informa o NBS de 9 dígitos.
3. O site valida se o NBS é compatível com o cTribNac relacionado ao serviço municipal.
4. O site mostra somente CST/cClassTrib compatíveis.
5. O cliente informa onde/como o serviço ocorreu para escolher o cIndOp permitido.
6. Informa-se o município da prestação.

Não solicita CNPJ, CPF, razão social ou nome.

## GitHub Pages
Envie `index.html`, `styles.css`, `app.js` e `data.js` para a raiz do repositório.
Depois habilite Settings > Pages > Deploy from a branch > main > /(root).

O site é totalmente estático e não envia dados para servidor.

- Correção v4: a pesquisa do serviço aceita tanto cTribMun quanto cTribNac.
  Exemplo: pesquisar 140101 encontra o serviço municipal 1401 de Duque de Caxias.

- v5: a lista "Ver NBS compatíveis" ficou clicável; clicar em uma linha preenche o NBS e valida automaticamente.
- v5: adicionados "Copiar XML" e "Baixar XML" na ficha final.
- O XML gerado é um bloco de parametrização com serviço + IBS/CBS; não é uma DPS completa, pois o formulário não solicita identificação/valores.
