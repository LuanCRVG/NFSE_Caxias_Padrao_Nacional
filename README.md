# Assistente NFS-e — Padrão Nacional + ISSNet (v8)

Esta versão remove a ideia de que a regra pertence ao "Rio de Janeiro" e passa a trabalhar por MODELO DE INTEGRAÇÃO:

- Padrão Nacional — Emissor Nacional
- Padrão Nacional — Provedor ISSNet

A lógica continua a mesma da v7:
- No Emissor Nacional, NBS/CST/cClassTrib/cIndOp não ficam bloqueados pela correlação orientativa.
- No ISSNet, permanece a validação mais amarrada pela correlação do provedor.
- O município passa a ser um cadastro/configuração separado da regra de integração.
- Para adicionar outro município ao Emissor Nacional, basta cadastrar/importar sua tabela municipal correspondente.
- XML de apoio continua disponível.

Observação:
A tabela municipal atualmente incorporada no perfil Emissor Nacional é a planilha que foi fornecida para o Município do Rio de Janeiro. O nome da REGRA deixou de ser "Rio"; o município permanece como dado cadastral da tabela utilizada.
