# Assistente NFS-e — Padrão Nacional + ISSNet (v11)

Versão pronta para publicação no GitHub Pages.

## Alterações da v11

No perfil **Padrão Nacional — Emissor Nacional** (Rio de Janeiro), o **NBS permanece no fluxo independentemente da escolha sobre o destaque das tags da Reforma Tributária (IBS/CBS)**.

- **Destaque IBS/CBS = Sim**: mantém NBS e exibe também CST/cClassTrib, cIndOp e indDest, gerando o grupo `<IBSCBS>` no XML de apoio.
- **Destaque IBS/CBS = Não**: mantém o NBS visível, validado, exibido na ficha final e gerado em `<cNBS>`, mas oculta CST/cClassTrib, cIndOp e indDest e não gera o grupo `<IBSCBS>`.
- Alternar entre Sim e Não preserva o NBS já informado; somente os campos exclusivos da Reforma Tributária são limpos/ocultados.
- O NBS continua sendo validado contra a tabela nacional carregada no perfil do Rio.

A pesquisa do Rio por **cTribNac de 6 dígitos** continua disponível. Exemplo: `140501`.

O perfil **Padrão Nacional — Provedor ISSNet / Duque de Caxias** foi mantido com o comportamento anterior.

## GitHub Pages

Envie o arquivo `index.html` para a raiz do repositório e habilite o GitHub Pages para publicar a página.
