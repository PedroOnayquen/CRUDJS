const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sFuncao = document.querySelector('#m-funcao');
const sSalario = document.querySelector('#m-salario');
const btnSalvar = document.querySelector('#btnSalvar');

let itens = [];
let id;

// Função para abrir o modal
async function openModal(edit = false, index = 0) {
  modal.classList.add('active');

  // Fecha o modal se o clique for fora do conteúdo do modal
  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  };

  // Se edit for true, carrega os dados do item para edição
  if (edit) {
    const item = itens[index];
    sNome.value = item.nome;
    sFuncao.value = item.funcao;
    sSalario.value = item.salario;
    id = item.id; // Define o ID do item a ser editado
  } else {
    // Se não for edição, limpa os campos do formulário
    sNome.value = '';
    sFuncao.value = '';
    sSalario.value = '';
    id = undefined;
  }
}

// Função para abrir o modal em modo de edição
function editItem(index) {
  openModal(true, index);
}

// Função para excluir um item
async function deleteItem(index) {
  const item = itens[index];
  // Faz uma requisição DELETE para o servidor
  await fetch(`/funcionarios/${item.id}`, { method: 'DELETE' });
  loadItens(); // Recarrega a lista de itens
}

// Função para inserir um item na tabela
function insertItem(item, index) {
  let tr = document.createElement('tr');
  const salarioFormatado = item.salario.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

  // Define o conteúdo da linha da tabela
  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.funcao}</td>
    <td>R$ ${item.salario}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

// Função para salvar ou atualizar um item
btnSalvar.onclick = async e => {
  e.preventDefault();

  // Verifica se todos os campos estão preenchidos
  if (sNome.value === '' || sFuncao.value === '' || sSalario.value === '') {
    return;
  }

  // Cria o objeto de payload para a requisição
  const payload = {
    nome: sNome.value,
    funcao: sFuncao.value,
    salario: parseFloat(sSalario.value)
  };

  // Se id estiver definido, faz uma requisição PUT para atualizar o item
  if (id !== undefined) {
    await fetch(`/funcionarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } else {
    // Caso contrário, faz uma requisição POST para criar um novo item
    await fetch('/funcionarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  modal.classList.remove('active'); // Fecha o modal
  loadItens(); // Recarrega a lista de itens
};

// Função para carregar os itens da tabela
async function loadItens() {
  try {
    const response = await fetch('/funcionarios');
    itens = await response.json();
    tbody.innerHTML = ''; // Limpa a tabela antes de atualizar
    itens.forEach((item, index) => {
      insertItem(item, index);
    });
  } catch (error) {
    console.error('Erro ao carregar dados:', error); // Exibe erro no console se a requisição falhar
  }
}

// Carrega os itens quando a página é carregada
loadItens();
