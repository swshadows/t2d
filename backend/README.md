# 🤖 Backend T2D

## 🚌 Rotas da API

- ⚠ A aplicação roda por padrão em http://localhost:3000
  - A porta pode ser trocada mudando a varíavel `PORT` em `.env`
- `?` indica um parâmetro que pode estar vazio
- `:` indica um parâmetro do tipo `req.param`, passado na URL da requisição

### 🧑 Usuário

| Rota                   |   Tipo   | Payload JSON                                      | Função                                                                                                                            |
| :--------------------- | :------: | :------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------- |
| `/user/`               |  `GET`   | -                                                 | Pega informações do usuário logado                                                                                                |
| `/user/register`       |  `POST`  | `email`, `username`, `password`, `passwordRepeat` | Registra o usuário com `email`, `username`, e comparando `password` com `passwordRepeat`                                          |
| `/user/login`          |  `POST`  | `login`, `password`                               | Realiza login com `login` (pode ser email ou username) e comparando `password`                                                    |
| `/user/logout`         |  `POST`  | -                                                 | Realiza logout                                                                                                                    |
| `/user/:username`      |  `GET`   | -                                                 | Pega informações do usuário com nome `:username`                                                                                  |
| `/user/updateEmail`    |  `PUT`   | `email`                                           | Atualiza email do usuário logado com `email`                                                                                      |
| `/user/updateUsername` |  `PUT`   | `username`                                        | Atualiza username do usuário logado com `username`                                                                                |
| `/user/updatePassword` |  `PUT`   | `password`, `newPassword`, `newPasswordRepeat`    | Atualiza senha do usuário logado com `newPassword`, comparando senha antiga com `password` e a nova senha com `newPasswordRepeat` |
| `/user/delete`         | `DELETE` | -                                                 | Apaga usuário logado e todos os dados relacionados                                                                                |

### 📁 Projeto

| Rota                         |   Tipo   | Payload JSON   | Função                                                    |
| :--------------------------- | :------: | :------------- | :-------------------------------------------------------- |
| `/project/logged`            |  `GET`   | -              | Pega todos os projetos do usuário logado                  |
| `/project/create`            |  `POST`  | `name`, `desc` | Cria um projeto com `name` e `desc`                       |
| `/project/updateName`        |  `PUT`   | `name`, `id`   | Atualiza o nome do projeto com `name` onde id = `id`      |
| `/project/updateDescription` |  `PUT`   | `desc`, `id`   | Atualiza a descrição do projeto com `desc` onde id = `id` |
| `/project/delete`            | `DELETE` | `id`           | Apaga o projeto onde id = `id`                            |

### 📄 Documento

| Rota                          |   Tipo   | Payload JSON                          | Função                                                                                                                    |
| :---------------------------- | :------: | :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------ |
| `/doc/create`                 |  `POST`  | `name`, `desc`, `projectId`           | Cria um documento com `name` e `desc` onde id do projeto = `projectId`                                                    |
| `/doc/share`                  |  `POST`  | `username`, `projectId`, `documentId` | Compartilha o documento que tem id = `documentId` e pertence ao projeto com id = `projectId` com o usuário com `username` |
| `/doc/shared`                 |  `GET`   | -                                     | Pega todos os documentos compartilhados com o usuário logado                                                              |
| `/doc/:projectId`             |  `GET`   | -                                     | Pega todos os documentos do projeto com id = `:projectId`                                                                 |
| `/doc/revoke`                 |  `PUT`   | `projectId`, `documentId`             | Remove o acesso do usuário ao documento compartilhado com id = `documentId` que pertence ao projeto com id = `projectId`  |
| `/doc/updateName`             |  `PUT`   | `name`,`projectId`, `documentId`      | Atualiza o nome do projeto com `name` onde o id = `documentId` que pertencer ao projeto com `projectId`                   |
| `/doc/updateDescription`      |  `PUT`   | `desc`,`projectId`, `documentId`      | Atualiza a descrição do projeto com `desc` onde o id = `documentId` que pertencer ao projeto com `projectId`              |
| `/doc/delete`                 | `DELETE` | `projectId`, `documentId`             | Deleta o documento com id = `documentId` que pertence ao projeto com id = `projectId`                                     |
| `/doc/:projectId/:documentId` |  `GET`   | -                                     | Pega os dados do documento com id = `:documentId` que pertence ao projeto com id = `projectId`                            |
| `/doc/save`                   |  `POST`  | `content?`, `projectId`, `documentId` | Salva o `content` do documento com id = `documentId` que pertence ao projeto com id = `projectId`                         |
