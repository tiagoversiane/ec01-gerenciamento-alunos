// todos os alunos cadastrados ficam aqui
const alunos = [];

// aluno que está sendo editado (null = cadastro novo)
let alunoEmEdicao = null;

// guarda qual relatório está aberto pra ele atualizar sozinho
let relatorioAtual = null;

const formulario = document.getElementById('formulario-aluno');
const campoNome = document.getElementById('nome');
const campoIdade = document.getElementById('idade');
const campoCurso = document.getElementById('curso');
const campoNota = document.getElementById('nota-final');
const botaoSalvar = document.getElementById('botao-salvar');
const botaoCancelar = document.getElementById('botao-cancelar');
const corpoTabela = document.getElementById('corpo-tabela');
const tituloRelatorio = document.getElementById('titulo-relatorio');
const listaRelatorio = document.getElementById('lista-relatorio');

const notificar = (mensagem) => {
  console.log(mensagem);
  alert(mensagem);
};

// funções que mexem no array

const lerFormulario = () => new Aluno(
  campoNome.value.trim(),
  Number(campoIdade.value),
  campoCurso.value,
  Number(campoNota.value),
);

const adicionarAluno = (aluno) => alunos.push(aluno);

const atualizarAluno = (atual, novo) => alunos.splice(alunos.indexOf(atual), 1, novo);

const removerAluno = (aluno) => alunos.splice(alunos.indexOf(aluno), 1);

// formulário

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

// tabela

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
  corpoTabela.innerHTML = '';

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
      atualizarTela();
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

// relatórios

const calcularMedia = (campo) => {
  if (alunos.length === 0) {
    return [];
  }
  const soma = alunos.reduce((total, aluno) => total + aluno[campo], 0);
  const media = soma / alunos.length;
  return [media.toFixed(2)];
};

const relatorioAprovados = () => ({
  titulo: 'Alunos aprovados',
  linhas: alunos.filter((aluno) => aluno.isAprovado()).map((aluno) => aluno.toString()),
});

const relatorioMediaNotas = () => ({
  titulo: 'Média das notas finais',
  linhas: calcularMedia('notaFinal'),
});

const relatorioMediaIdades = () => ({
  titulo: 'Média das idades',
  linhas: calcularMedia('idade'),
});

const relatorioNomes = () => ({
  titulo: 'Nomes em ordem alfabética',
  linhas: alunos.map((aluno) => aluno.nome).sort((a, b) => a.localeCompare(b, 'pt-BR')),
});

const relatorioPorCurso = () => {
  const totais = alunos.reduce((contagem, aluno) => {
    contagem[aluno.curso] += 1;
    return contagem;
  }, { JavaScript: 0, Python: 0, Java: 0 });

  return {
    titulo: 'Quantidade de alunos por curso',
    linhas: [
      `JavaScript: ${totais.JavaScript}`,
      `Python: ${totais.Python}`,
      `Java: ${totais.Java}`,
    ],
  };
};

const renderizarRelatorio = () => {
  if (relatorioAtual === null) {
    return;
  }

  const relatorio = relatorioAtual();
  tituloRelatorio.textContent = relatorio.titulo;
  listaRelatorio.innerHTML = '';

  if (relatorio.linhas.length === 0) {
    listaRelatorio.innerHTML = '<li>Nenhum dado para exibir.</li>';
    return;
  }

  relatorio.linhas.forEach((linha) => {
    const item = document.createElement('li');
    item.textContent = linha;
    listaRelatorio.appendChild(item);
  });
};

const atualizarTela = () => {
  renderizarTabela();
  renderizarRelatorio();
};

// botões do formulário

botaoSalvar.addEventListener('click', function (evento) {
  // se tiver campo errado deixa o navegador avisar
  if (!formulario.checkValidity()) {
    return;
  }
  evento.preventDefault();

  // o required deixa passar nome só com espaços
  if (campoNome.value.trim() === '') {
    alert('Informe o nome do aluno.');
    return;
  }

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
  atualizarTela();
  notificar(mensagem);
});

botaoCancelar.addEventListener('click', function () {
  limparFormulario();
});

// botões dos relatórios

const abrirRelatorio = (relatorio) => {
  relatorioAtual = relatorio;
  renderizarRelatorio();
};

document.getElementById('botao-aprovados').addEventListener('click', function () {
  abrirRelatorio(relatorioAprovados);
});

document.getElementById('botao-media-notas').addEventListener('click', function () {
  abrirRelatorio(relatorioMediaNotas);
});

document.getElementById('botao-media-idades').addEventListener('click', function () {
  abrirRelatorio(relatorioMediaIdades);
});

document.getElementById('botao-nomes').addEventListener('click', function () {
  abrirRelatorio(relatorioNomes);
});

document.getElementById('botao-por-curso').addEventListener('click', function () {
  abrirRelatorio(relatorioPorCurso);
});

renderizarTabela();
