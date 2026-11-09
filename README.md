# DevTech Academy - Gerenciamento de Alunos

Sistema web para cadastrar, listar, editar e excluir alunos, com relatórios sobre os dados cadastrados. Feito em JavaScript puro, sem CSS e sem bibliotecas, para o Estudo de Caso EC01.

## Como executar

Com o Docker instalado, na pasta do projeto:

```
docker compose up --build
```

Depois acesse http://localhost:8080. A pasta `src/` é montada dentro do container, então qualquer alteração no código aparece ao recarregar a página.

Os dados ficam em memória, como pede o enunciado, e são perdidos ao recarregar a página.

## Exercícios

Cada exercício está em um commit próprio, o que permite ver a evolução do sistema com `git log`.

| Exercício | Onde está no código |
| --- | --- |
| 1. CRUD com formulário e tabela | `src/index.html` e `src/js/app.js` |
| 2. Classe `Aluno` | `src/js/Aluno.js` |
| 3. Eventos, funções anônimas e arrow functions | `src/js/app.js`, seções "Operações de manipulação dos dados" e "Eventos" |
| 4. Relatórios com `filter`, `map`, `reduce`, `sort` e `forEach` | `src/js/app.js`, seção "Relatórios" |
