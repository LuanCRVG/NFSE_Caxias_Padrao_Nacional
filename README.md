# Assistente NFS-e — Padrão Nacional + ISSNet (v12)

Versão pronta para publicação no GitHub Pages.

## Alterações da v12

Foi reforçada a explicação visual para evitar confusão entre **cIndOp** e **Município da prestação**:

- **cIndOp**: agora o site explica claramente que o campo representa a **regra de localização da operação para fins de IBS/CBS**. Ele não informa, por si só, o município onde o serviço aconteceu.
- O rótulo do seletor foi alterado para **“Regra de localização da operação para IBS/CBS”**.
- Foi incluído um exemplo explicando que opções como **“Endereço do destinatário”** são critérios fiscais do IBS/CBS e não substituem o município da prestação.
- **Município da prestação**: agora o site explica que esse campo informa onde o serviço foi efetivamente realizado e corresponde ao `cLocPrestacao` da DPS.
- O site destaca que os dois campos são independentes e podem apontar para conceitos diferentes.

As regras da v11 foram preservadas:

- No Rio, o **NBS permanece no fluxo** mesmo quando o destaque IBS/CBS estiver marcado como “Não”.
- Com **IBS/CBS = Sim**, aparecem CST/cClassTrib, cIndOp e indDest.
- Com **IBS/CBS = Não**, apenas os campos exclusivos da Reforma são ocultados; o NBS continua sendo utilizado.
- A pesquisa do Rio por **cTribNac de 6 dígitos**, como `140501`, continua disponível.
- O perfil **ISSNet / Duque de Caxias** mantém o comportamento anterior.

## GitHub Pages

Envie o arquivo `index.html` para a raiz do repositório e habilite o GitHub Pages para publicar a página.
