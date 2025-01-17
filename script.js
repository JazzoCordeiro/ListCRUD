// Variáveis
const modal = document.querySelector('.modalContainer')  // Seleciona o modal da página
const tbody = document.querySelector('tbody')  // Seleciona o corpo da tabela onde os itens serão exibidos
const sName = document.querySelector('#m-name')  // Campo de entrada para o nome
const sJob = document.querySelector('#m-job')  // Campo de entrada para o cargo
const sSalary = document.querySelector('#m-salary')  // Campo de entrada para o salário
const btnSave = document.querySelector('#saveButton')  // Botão de salvar

let itens  // Variável que armazena os itens da lista de salários
let id  // Variável que armazena o índice do item em edição


// Funções para manipulação do banco de dados (LocalStorage)

// Função para obter os itens do banco de dados (localStorage)
const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []

// Função para salvar os itens no banco de dados (localStorage)
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))


// Função para carregar os itens e exibir na tabela
function loadItens() {
    itens = getItensBD()  // Obtém os itens armazenados no LocalStorage
    tbody.innerHTML = ''  // Limpa a tabela antes de adicionar os itens novamente
    itens.forEach((item, index) => {
      insertItem(item, index)  // Para cada item, chama a função insertItem para exibir na tabela
    })
}

loadItens()  // Chama a função para carregar os itens na página quando o carregamento inicial acontece


// Função para inserir novos itens na tabela
function insertItem(item, index) {
    let tr = document.createElement('tr')  // Cria uma nova linha na tabela
    
    tr.innerHTML = `
      <td>${item.name}</td>  <!-- Exibe o nome do empregado -->
      <td>${item.job}</td>  <!-- Exibe a função ou cargo do empregado -->
      <td>R$ ${item.salary}</td>  <!-- Exibe o salário do empregado -->
      <td class="action">
        <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>  <!-- Botão para editar -->
      </td>
      <td class="action2">
        <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>  <!-- Botão para excluir -->
      </td>
    `
    tbody.appendChild(tr)  // Adiciona a linha criada à tabela
}

// Função para editar um item
function editItem(index) {
    openModal(true, index)  // Abre o modal no modo de edição, passando o índice do item a ser editado
}

// Função para excluir um item
function deleteItem(index) {
    itens.splice(index, 1)  // Remove o item do array
    setItensBD()  // Atualiza o banco de dados (localStorage) com os novos itens
    loadItens()  // Recarrega a tabela com os itens atualizados
}

// Função para abrir o modal (para adicionar ou editar itens)
function openModal(edit = false, index = 0) {
    modal.classList.add('active')  // Torna o modal visível
  
    // Fecha o modal ao clicar fora do conteúdo do modal
    modal.onclick = e => {
      if (e.target.className.indexOf('modalContainer') !== -1) {
        modal.classList.remove('active')
      }
    }
  
    // Preenche os campos do formulário com os dados do item em edição, se for o caso
    if (edit) {
      sName.value = itens[index].name  // Preenche o campo nome com o nome do item
      sJob.value = itens[index].job  // Preenche o campo função com a função do item
      sSalary.value = itens[index].salary  // Preenche o campo salário com o salário do item
      id = index  // Define o id para edição
    } else {
      // Limpa os campos caso seja um novo registro
      sName.value = ''
      sJob.value = ''
      sSalary.value = ''
    }
}

// Evento de clique no botão de salvar
btnSave.onclick = e => {
  
    // Valida se todos os campos estão preenchidos
    if (sName.value == '' || sJob.value == '' || sSalary.value == '') {
      return  // Se algum campo estiver vazio, não faz nada
    }
  
    e.preventDefault()  // Previne o comportamento padrão do formulário
  
    // Se um item está sendo editado (id está definido), atualiza o item
    if (id !== undefined) {
      itens[id].name = sName.value  // Atualiza o nome do item
      itens[id].job = sJob.value  // Atualiza a função do item
      itens[id].salary = sSalary.value  // Atualiza o salário do item
    } else {
      // Se não houver edição, cria um novo item e adiciona ao array
      itens.push({'name': sName.value, 'job': sJob.value, 'salary': sSalary.value})
    }

    setItensBD()  // Atualiza o banco de dados (localStorage)

    modal.classList.remove('active')  // Fecha o modal após salvar
    loadItens()  // Recarrega a tabela com os itens atualizados
    id = undefined  // Reseta o id para garantir que o próximo item seja tratado como novo
}
