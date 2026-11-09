// Lista em memória com os alunos cadastrados (instâncias de Aluno).
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

const notificar = (mensagem) => {
  console.log(mensagem);
  alert(mensagem);
};

// Operações de manipulação dos dados

const lerFormulario = () => new Aluno(
  campoNome.value.trim(),
  Number(campoIdade.value),
  campoCurso.value,
  Number(campoNota.value),
);

const adicionarAluno = (aluno) => alunos.push(aluno);

const atualizarAluno = (atual, novo) => alunos.splice(alunos.indexOf(atual), 1, novo);

const removerAluno = (aluno) => alunos.splice(alunos.indexOf(aluno), 1);

// Formulário

const limparFormulario = () => {
  formulario.reset();
  alunoEmEdicao = null;
  botaoSalvar.textContent = 'Cadastrar';
  botaoCancelar.hidden = true;
};

const carregarNoFormulario = (aluno) => {
  campoNome.value = aluno.nome;
  campoIdade.value = aluno.idade;
  campoCurso.value = aluno.curso;
  campoNota.value = aluno.notaFinal;

  alunoEmEdicao = aluno;
  botaoSalvar.textContent = 'Salvar alterações';
  botaoCancelar.hidden = false;
  campoNome.focus();
};

// Tabela

const criarCelula = (texto) => {
  const celula = document.createElement('td');
  celula.textContent = texto;
  return celula;
};

const criarBotao = (rotulo, aoClicar) => {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.textContent = rotulo;
  botao.addEventListener('click', aoClicar);
  return botao;
};

const renderizarTabela = () => {
  corpoTabela.replaceChildren();

  if (alunos.length === 0) {
    const celula = criarCelula('Nenhum aluno cadastrado.');
    celula.colSpan = 6;
    const linha = document.createElement('tr');
    linha.appendChild(celula);
    corpoTabela.appendChild(linha);
    return;
  }

  alunos.forEach((aluno) => {
    const acoes = document.createElement('td');
    acoes.appendChild(criarBotao('Editar', function () {
      carregarNoFormulario(aluno);
    }));
    acoes.appendChild(criarBotao('Excluir', function () {
      removerAluno(aluno);
      if (aluno === alunoEmEdicao) {
        limparFormulario();
      }
      renderizarTabela();
      notificar(`Aluno excluído: ${aluno.toString()}`);
    }));

    const linha = document.createElement('tr');
    linha.appendChild(criarCelula(aluno.nome));
    linha.appendChild(criarCelula(aluno.idade));
    linha.appendChild(criarCelula(aluno.curso));
    linha.appendChild(criarCelula(aluno.notaFinal));
    linha.appendChild(criarCelula(aluno.isAprovado() ? 'Aprovado' : 'Reprovado'));
    linha.appendChild(acoes);
    corpoTabela.appendChild(linha);
  });
};

// Eventos dos botões do formulário

botaoSalvar.addEventListener('click', function (evento) {
  // Com dados inválidos, o próprio navegador exibe as mensagens de validação.
  if (!formulario.checkValidity()) {
    return;
  }
  evento.preventDefault();

  const aluno = lerFormulario();
  let mensagem;
  if (alunoEmEdicao === null) {
    adicionarAluno(aluno);
    mensagem = `Aluno cadastrado: ${aluno.toString()}`;
  } else {
    atualizarAluno(alunoEmEdicao, aluno);
    mensagem = `Aluno atualizado: ${aluno.toString()}`;
  }

  limparFormulario();
  renderizarTabela();
  notificar(mensagem);
});

botaoCancelar.addEventListener('click', function () {
  limparFormulario();
});

renderizarTabela();
