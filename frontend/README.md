# 🤖 Backend T2D

## 🚌 Rotas da App

- ⚠ A aplicação roda por padrão em http://localhost:5173

| Rota             | Função                                                                                              | Precisa de Login? |
| :--------------- | :-------------------------------------------------------------------------------------------------- | :---------------: |
| `/`              | View inicial da app, com formulários para login e registro                                          |        ❌         |
| `/app`           | View principal, com projetos do usuário logado e documentos compartilhados com o mesmo              |        ✅         |
| `/app/:id`       | View de projeto com id = `:id`, com acesso a documentos do mesmo                                    |        ✅         |
| `/app/:pId/:dId` | View de documento com id = `dId`, pertencende ao projeto com id = `pId`, com renderizador Markdown  |        ✅         |
| `/user`          | View de informações do usuário logado                                                               |        ✅         |
| `/*`             | View para qualquer rota que não caia nas acima, usando `/:catchAll(.*)`. Essencialmente, a rota 404 |        ❌         |
