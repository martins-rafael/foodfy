# Foodfy

<h4 align="center"> 
	🚧  Em construção...  🚧
</h4>

<p>Aprenda a construir os melhores pratos com receitas criadas por profissionais do mundo inteiro.</p>

<p>
  <img src="https://img.shields.io/badge/made%20by-RAFAEL%20MARTINS-6558C3?style=flat-square">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/martins-rafael/foodfy?color=6558C3&style=flat-square">
  <a href="https://opensource.org/licenses/MIT">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-6558C3?style=flat-square">
  </a>
  <a href="https://github.com/martins-rafael/foodfy/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/martins-rafael/foodfy?color=6558C3&style=flat-square">
  </a>
    <img src="https://img.shields.io/badge/status-EM%20DESENVOLVIMENTO-6558C3?style=flat-square">
</p>

<img align="right" src=".github/chef.png?raw=true" height="240">

## Tópicos 

[Sobre o Foodfy](#sobre-o-foodfy)

[Funcionalidades](#funcionalidades)

[Tecnologias](#tecnologias)

[Instalação e uso](#instalação-e-uso)

[Licença](#licença)

<br>

## Sobre o Foodfy

O Foodfy é uma aplicação web completa de gerenciamento de receitas, desenvolvida durante o bootcamp [LaunchBase](https://rocketseat.com.br/launchbase) da [Rocketseat](https://rocketseat.com.br/).

### Main
<p align="center">
  <img src=".github/main.gif" alt="página principal">
</p>

<br>

### Admin
<p align="center">
  <img src=".github/admin_recipes.png" alt="página admin receitas">
  <img src=".github/admin_chefs.png" alt="página admin chefs">
</p>

<br>

## Funcionalidades

- [X] Explore variados tipos de receitas.
- [X] Criar, visualizar, editar e apagar receitas e chefs.
- [X] Upload de imagems com Multer.
- [X] Pesquisar receitas.
- [X] Páginas dinâmicas com Nunjucks.
- [X] Banco de dados PostgreSQL.

<br>

## Tecnologias

As seguintes tecnologias foram utilizadas no desenvolvimento do projeto:

- [HTML](https://devdocs.io/html/)
- [CSS](https://devdocs.io/css/)
- [Javascript](https://devdocs.io/javascript/)
- [Node](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [PostgreSQL](https://www.postgresql.org/)

<br>

## Instalação e uso

Para rodar a aplicação, você precisa instalar o [Node](https://nodejs.org/en/) e o [Postgres](https://www.postgresql.org/).

Siga os passos abaixo:

```bash
# Abra um terminal e copie este repositório com o comando
$ git clone https://github.com/martins-rafael/foodfy.git
# ou use a opção de download.

# Entre na pasta com 
$ cd foodfy

# Instale as dependências
$ npm install

# Crie e importe o banco de dados
$ psql -U postgres -c "CREATE DATABASE foodfy"
$ psql -U postgres -d foodfy <foodfy.sql
# Você também pode criar e importar manualmente o banco de dados usando o Postbird ou pgAdmin.
    
# Conexão com o banco de dados:
# abra e edite o arquivo db.js dentro da pasta src/config com o seu user e password do Postgres.

# Rode a aplicação
$ npm start
```

<br>

## Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](/LICENSE) para mais detalhes.

---

Feito com :purple_heart: by [Rafael Martins](https://github.com/martins-rafael)
