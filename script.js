document.addEventListener("DOMContentLoaded", function (event) {

  //ao carregar a página, gera a tabela com os clientes cadastrados no local storage
  gerarTabela();

  // Busca o CEP após o usuário sair do campo de entrada (SEU CÓDIGO ORIGINAL MANTIDO)
  let cep = document.getElementById("cep");
  let rua = document.getElementById("rua");
  let bairro = document.getElementById("bairro");
  let cidade = document.getElementById("cidade");
  let estado = document.getElementById("estado");

  cep.addEventListener("blur", function () {
    if (cep.value.length > 0) {
      let cepAPI = "https://viacep.com.br/ws/" + cep.value + "/json/";
      fetch(cepAPI) //faz a requisição http para api
        .then((response) => response.json()) //api responde em json e transforma pra JS
        .then((data) => {
          //obtendo os dados
          if (data.erro) {
            // é booleano
            // if (data.erro === "true") {
            throw new Error("CEP não encontrado");
          } else {
            rua.value = data.logradouro;
            bairro.value = data.bairro;
            cidade.value = data.localidade;
            estado.value = data.uf;
          }
        })
        .catch((error) => {
          rua.value = "";
          bairro.value = "";
          cidade.value = "";
          estado.value = "";
          alert("Erro ao buscar o CEP! \n" + error.message);
          cep.focus();
          cep.value = "";
        });
      //formata o campo de cep no formato 00000-000
      let valor = cep.value.replace(/\D/g, ""); // Remove tudo o que não é número
      if (valor.length <= 8) {
        cep.value = valor.replace(/(\d{5})(\d{3})/, "$1-$2"); // coloca a máscara com traço -
      }
    }
  });

  let formCliente = document.getElementById("formCliente");
  let listaClientes = document.getElementById("listaClientes");

  formCliente.addEventListener("submit", function (e) {
    e.preventDefault();

    btnAdicionar.disabled = true;
    btnAdicionar.innerHTML = "Processando...";

    statusArea.innerHTML = "";

    // Lista de etapas
    const etapas = [
      "1. Consultando CEP...",
      "2. Realizando análise de crédito...",
      "3. Gerando Avatar...",
      "4. Cadastro concluído!"
    ];

    let etapaAtual = 0;

    // Função para mostrar cada etapa com intervalo
    function mostrarEtapa() {
      if (etapaAtual < etapas.length) {
        const p = document.createElement("p");
        p.textContent = etapas[etapaAtual];
        statusArea.appendChild(p);

        setTimeout(() => {
          p.remove();
        }, 7000);

        etapaAtual++;
        setTimeout(mostrarEtapa, 1500); 
      } else {      
        btnAdicionar.disabled = false;
        btnAdicionar.innerHTML = "<strong>+ Adicionar</strong>";
        }    
    }

    mostrarEtapa();

    //le os campos do formulario
    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let plano = document.getElementById("plano").value;
    let cep = document.getElementById("cep").value;
    let rua = document.getElementById("rua").value;
    let bairro = document.getElementById("bairro").value;
    let cidade = document.getElementById("cidade").value;
    let estado = document.getElementById("estado").value;
    let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=random`;

    //configura avatar a ser salvo na tabela
    let novaLinha = document.createElement("tr");
    let tdAvatar = document.createElement("td");
    let imgAvatar = document.createElement("img");
    imgAvatar.src = avatarUrl;
    imgAvatar.classList.add("img-avatar");
    tdAvatar.appendChild(imgAvatar);
    tdAvatar.style.display = "flex";
    tdAvatar.style.justifyContent = "center";
    tdAvatar.style.alignItems = "center";

    let tdNome = document.createElement("td");
    tdNome.style.textAlign = "center";
    tdNome.textContent = nome;

    let tdEmail = document.createElement("td");
    tdEmail.style.textAlign = "center";
    tdEmail.textContent = email;

    let tdPlano = document.createElement("td");
    tdPlano.style.textAlign = "center";
    tdPlano.textContent = plano;
    //adiciona cores no tipo plano escolhido
    tdPlano.classList.add("plano" + plano);

    let tdAcoes = document.createElement("td");
    tdAcoes.style.textAlign = "center";
    // tdAcoes.textContent = "Excluir";
    tdAcoes.classList.add("tdAcoes");

    let btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.classList.add("btnEditar");

    let strongEditar = document.createElement("strong");
    strongEditar.textContent = "Editar";
    btnEditar.appendChild(strongEditar);

    let btnExcluir = document.createElement("img");
    btnExcluir.src = "./imgs/excluir.png";
    btnExcluir.alt = "Excluir";
    btnExcluir.classList.add("btnExcluir");

    // container para os botões (flex)
    let acoesBox = document.createElement("div");
    acoesBox.classList.add("acoesBox");

    acoesBox.appendChild(btnEditar);
    acoesBox.appendChild(btnExcluir);

    tdAcoes.appendChild(acoesBox);

    novaLinha.appendChild(tdAvatar);
    novaLinha.appendChild(tdNome);
    novaLinha.appendChild(tdEmail);
    novaLinha.appendChild(tdPlano);
    novaLinha.appendChild(tdAcoes);

    listaClientes.appendChild(novaLinha);

    //após adicionar o cliente na tabela, cria o objeto cliente e adiciona no local storage
    let objCliente = criaObjetoCliente(avatarUrl, nome, email, plano, cep, rua, bairro, cidade, estado);
    adicionaItemNoLocalStorage("cliente_db", objCliente);

    //eventos botões Editar e Excluir
    (btnEditar.addEventListener("click", () => {
      document.getElementById("nome").value = tdNome.textContent;
      document.getElementById("email").value = tdEmail.textContent;
      document.getElementById("plano").value = tdPlano.textContent;
      novaLinha.remove();
    }),
      btnExcluir.addEventListener("click", function () {
        novaLinha.remove();
      }));

    formCliente.reset();
  });
});


function criaObjetoCliente(avatarUrl, nome, email, plano, cep, rua, bairro, cidade, estado) {
  let cliente = {
    id: Date.now(), // Gera um ID único com base no timestamp
    avatarUrl: avatarUrl,
    nome: nome,
    email: email,
    plano: plano,
    cep: cep,
    rua: rua,
    bairro: bairro,
    cidade: cidade,
    estado: estado
  };
  return cliente;
}

function adicionaItemNoLocalStorage(chaveStorage, objeto) {

  let clientesExistentes = JSON.parse(localStorage.getItem(chaveStorage)) || [];
  clientesExistentes.push(objeto);
  localStorage.setItem(chaveStorage, JSON.stringify(clientesExistentes));
  //console.log(clientesExistentes);
  alert("Cliente adicionado ao Local Storage!");
  
}

function adicionaNovoClienteNaTabela(objeto) {
  let listaClientes = document.getElementById("listaClientes");
  
  // Cria nova linha
  let novaLinha = document.createElement("tr");
  
  // Avatar
  let tdAvatar = document.createElement("td");
  let imgAvatar = document.createElement("img");
  imgAvatar.src = objeto.avatarUrl;
  imgAvatar.classList.add("img-avatar");
  tdAvatar.appendChild(imgAvatar);
  tdAvatar.style.display = "flex";
  tdAvatar.style.justifyContent = "center";
  tdAvatar.style.alignItems = "center";
  
  // Nome
  let tdNome = document.createElement("td");
  tdNome.style.textAlign = "center";
  tdNome.textContent = objeto.nome;
  
  // Email
  let tdEmail = document.createElement("td");
  tdEmail.style.textAlign = "center";
  tdEmail.textContent = objeto.email;
  
  // Plano
  let tdPlano = document.createElement("td");
  tdPlano.style.textAlign = "center";
  tdPlano.textContent = objeto.plano;
  tdPlano.classList.add("plano" + objeto.plano);
  
  // Ações
  let tdAcoes = document.createElement("td");
  tdAcoes.style.textAlign = "center";
  tdAcoes.classList.add("tdAcoes");
  
  let btnEditar = document.createElement("button");
  btnEditar.type = "button";
  btnEditar.classList.add("btnEditar");
  let strongEditar = document.createElement("strong");
  strongEditar.textContent = "Editar";
  btnEditar.appendChild(strongEditar);
  
  let btnExcluir = document.createElement("img");
  btnExcluir.src = "./imgs/excluir.png";
  btnExcluir.alt = "Excluir";
  btnExcluir.classList.add("btnExcluir");
  
  let acoesBox = document.createElement("div");
  acoesBox.classList.add("acoesBox");
  acoesBox.appendChild(btnEditar);
  acoesBox.appendChild(btnExcluir);
  
  tdAcoes.appendChild(acoesBox);
  
  // Monta a linha
  novaLinha.appendChild(tdAvatar);
  novaLinha.appendChild(tdNome);
  novaLinha.appendChild(tdEmail);
  novaLinha.appendChild(tdPlano);
  novaLinha.appendChild(tdAcoes);
  
  listaClientes.appendChild(novaLinha);
  
  // Eventos dos botões
  btnEditar.addEventListener("click", () => {
    document.getElementById("nome").value = tdNome.textContent;
    document.getElementById("email").value = tdEmail.textContent;
    document.getElementById("plano").value = tdPlano.textContent;
    novaLinha.remove();
    removerDoLocalStorage(objeto.id);
  });
  
  btnExcluir.addEventListener("click", () => {
    novaLinha.remove();
    console.log("Removendo cliente com ID: " + objeto.id);
    removerDoLocalStorage(objeto.id);
  });
}

function removerDoLocalStorage(id) {
    let listaClientes = JSON.parse(localStorage.getItem('cliente_db')) || [];
    listaClientes = listaClientes.filter(cliente => cliente.id !== id);
    localStorage.setItem('cliente_db', JSON.stringify(listaClientes));
}

function gerarTabela() {
    // Recupera e converte
    const dados = JSON.parse(localStorage.getItem('cliente_db')) || [];
    const tabelaBody = document.getElementById('listaClientes');
    tabelaBody.innerHTML = ""; // Limpa a tabela antes de recriar
    dados.forEach(cliente => {
        adicionaNovoClienteNaTabela(cliente);
    });
    console.log("Gerando tabela com os seguintes dados do Local Storage:");
    console.log(dados);
}

const nomeUsuario = document.querySelector("#codigoUsuario");
const btnUsuario = document.querySelector("#validarUsuario");

// função Validar Usuário
btnUsuario.addEventListener("click", () => {
  let codigosAceitos = ["Adriana", "Debora", "Patricia", "Thales", "Rafael"];
  let usuarioDigitado = nomeUsuario.value.trim(); //tira espaços antes e depois

  //verifica se está vazio
  if (usuarioDigitado === "") {
    alert("Campo Usuário é obrigatório.");
    return;
  }

  //valida usuario da lista
  if (codigosAceitos.includes(usuarioDigitado)) {
    alert("Bem vindo(a) " + usuarioDigitado + "!");
  } else {
    alert("Usuário  " + usuarioDigitado + "não cadastrado , tente novamente!");
  }
});

//valida email
email.addEventListener("blur", () => {
  let tiraEspacoEmail = email.value.trim(); //tira espaçom antes e depois

  const validaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // até antes do ponto /^[^\s@]+@[^\s@]+\. valida tudo até o @ - Um ou mais caracteres que NÃO sejam espaço nem @

  if (tiraEspacoEmail !== "" && !validaEmail.test(tiraEspacoEmail)) {
    email.classList.add("invalido");
  } else {
    email.classList.remove("invalido");
  }
});

//campo  de busca
const campoBusca = document.querySelector("#busca");
const listaClientes = document.querySelector("#listaClientes");

campoBusca.addEventListener("input", () => {
  const textoMinusculo = campoBusca.value.trim().toLowerCase(); //considera o texto em minúsculo e sem espaço
  const clientesCadastrados = listaClientes.querySelectorAll("tr"); //considera todas as linhas da tabela (tr)

  clientesCadastrados.forEach(function (linhaTabela) {
    //percorro por todos os cadastros pra armazenar o contéudo na linhaTabela
    const textoLinha = linhaTabela.innerText.toLowerCase(); //pega todo texto da linha em minúsculo

    if (textoLinha.includes(textoMinusculo)) {
      linhaTabela.style.display = ""; //se o texto digitado contem na linha, mostra
    } else {
      linhaTabela.style.display = "none"; //se o texto digitado contem na linha, esconde
    }
  });
});
