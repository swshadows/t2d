# Task 2 Do (T2D)

🌎 Aplicação Web com frontend e backend desenvolvidos com o intuito de melhorar a gerência de projetos em trabalhos colaborativos, usando uma interface moderna e intuitiva

**Indice**

1. [Documentação](#documentação-oficial)
2. [Inicialização](#inicialização)
   1. [Requisitos](#requisitos)
   2. [Backend](#backend)
   3. [Frontend](#frontend)
3. [Outros Links](#outros-links)

<div align='center'>
  <img src="./app-banner.png" width='500px' />
</div>

## Documentação Oficial

- 📄 Acesse a nossa [documentação oficial](./DOCUMENTATION.md)

## Inicialização

<div align=center>

### Requisitos

[Node.js](https://nodejs.org/) & [MariaDB](https://mariadb.org)

</div>

- Use os comandos para clonar o repositório

  ```bash
  git clone https://github.com/swshadows/t2d.git
  cd t2d
  ```

### Backend

- Crie um arquivo em `backend` chamado `.env`

  ```bash
  SESSION_SECRET="" # Pode ser uma string qualquer, ex: secret
  DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/t2d?schema=public" # Substitua USERNAME e PASSWORD pelo user e senha do seu banco
  FRONTEND_URL="http://localhost:5173" # O endereço que o frontend irá rodar
  ```

- Rode os seguintes comandos

  ```bash
  cd ./backend        # Acessa a pasta do backend
  npm install         # Instala as dependências
  npm run db:gen      # Gera as dependências do Prisma
  npm run db:migrate  # Inicializa o banco de dados
  npm run dev         # Inicializa a API da aplicação
  ```

- Veja mais detalhes da API no [README](./backend/README.md)

### Frontend

- Crie um arquivo em `frontend` chamado `.env`

  ```bash
  VITE_API_URL="http://localhost:3000" # O endereço que o backend está rodando
  ```

- Rode os seguintes comandos

  ```bash
  cd ./frontend   # Acessa a pasta do frontend
  npm install     # Instala as dependências
  npm run dev     # Inicializa o servidor Vue com Vite
  ```

- Veja mais detalhes da App no [README](./frontend/README.md)

## Outros Links

<div align="center">
  <a href="https://www.figma.com/file/CDndKafGEFGguqoAbOHAy6/t2d?node-id=0%3A1&t=uzCfg4433CiQfOc2-1">
    <img width=40 src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg">
    <p>Protótipo no Figma</p>
  </a>
</div>
