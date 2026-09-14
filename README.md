# Assistente NFS-e — Padrão Nacional + ISSNet (v10)

Versão pronta para publicação no GitHub Pages.

## Alterações da v10

No perfil **Padrão Nacional — Emissor Nacional** (Rio de Janeiro), foi incluída a pergunta:

**Haverá destaque das tags da Reforma Tributária (IBS/CBS)?**

- **Sim**: mantém o fluxo completo já existente, com NBS, CST/cClassTrib, cIndOp e indDest.
- **Não**: oculta os campos vinculados ao IBS/CBS, não exige NBS/CST/cClassTrib/cIndOp/indDest e não gera o grupo `<IBSCBS>` no XML de apoio.
- Enquanto o usuário não escolher Sim ou Não, o assistente informa que essa definição ainda está pendente.

A pesquisa do Rio por **cTribNac de 6 dígitos** continua disponível. Exemplo: `140501`.

O perfil **Padrão Nacional — Provedor ISSNet / Duque de Caxias** foi mantido com o comportamento anterior, sem essa pergunta e sem flexibilização da correlação.

## GitHub Pages

Envie o arquivo `index.html` para a raiz do repositório e habilite o GitHub Pages para publicar a página.
