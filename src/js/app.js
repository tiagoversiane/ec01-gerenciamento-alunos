// Lista em memória com os alunos cadastrados.
const alunos = [];

// Aluno carregado no formulário para edição (null quando é um novo cadastro).
let alunoEmEdicao = null;

const formulario = document.getElementById('formulario-aluno');
const campoNome = document.getElementById('nome');
const campoIdade = document.getElementById('idade');
const campoCurso = document.getElementById('curso');
const campoNota = document.getElementById('nota-final');
const botaoSalvar = document.getElementById('botao-salvar');
const botaoCancelar = document.getElementById('botao-cancelar');
const corpoTabela = document.getElementById('corpo-tabela');

function lerFormulario() {
  return {
    nome: campoNome.value.trim(),
    idade: Number(campoIdade.value),
    curso: campoCurso.value,
    notaFinal: Number(campoNota.value),
  };
}

function limparFormulario() {
  formulario.reset();
  alunoEmEdicao = null;
  botaoSalvar.textContent = 'Cadastrar';
  botaoCancelar.hidden = true;
}

function salvarAluno(evento) {
  // Com dados inválidos, o próprio navegador exibe as mensagens de validação.
  if (!formulario.checkValidity()) {
    return;
  }
  evento.preventDefault();

  if (alunoEmEdicao === null) {
    alunos.push(lerFormulario());
  } else {
    alunos.splice(alunos.indexOf(alunoEmEdicao), 1, lerFormulario());
  }

  limparFormulario();
  renderizarTabela();
}

function editarAluno(aluno) {
  campoNome.value = aluno.nome;
  campoIdade.value = aluno.idade;
  campoCurso.value = aluno.curso;
  campoNota.value = aluno.notaFinal;

  alunoEmEdicao = aluno;
  botaoSalvar.textContent = 'Salvar alterações';
  botaoCancelar.hidden = false;
  campoNome.focus();
}

function excluirAluno(aluno) {
  alunos.splice(alunos.indexOf(aluno), 1);

  if (aluno === alunoEmEdicao) {
    limparFormulario();
  }
  renderizarTabela();
}

function criarCelula(texto) {
  const celula = document.createElement('td');
  celula.textContent = texto;
  return celula;
}

function criarBotao(rotulo, aoClicar) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.textContent = rotulo;
  botao.onclick = aoClicar;
  return botao;
}

function renderizarTabela() {
  corpoTabela.replaceChildren();

  if (alunos.length === 0) {
    const celula = criarCelula('Nenhum aluno cadastrado.');
    celula.colSpan = 5;
    const linha = document.createElement('tr');
    linha.appendChild(celula);
    corpoTabela.appendChild(linha);
    return;
  }

  for (const aluno of alunos) {
    const acoes = document.createElement('td');
    acoes.appendChild(criarBotao('Editar', function () { editarAluno(aluno); }));
    acoes.appendChild(criarBotao('Excluir', function () { excluirAluno(aluno); }));

    const linha = document.createElement('tr');
    linha.appendChild(criarCelula(aluno.nome));
    linha.appendChild(criarCelula(aluno.idade));
    linha.appendChild(criarCelula(aluno.curso));
    linha.appendChild(criarCelula(aluno.notaFinal));
    linha.appendChild(acoes);
    corpoTabela.appendChild(linha);
  }
}

renderizarTabela();
