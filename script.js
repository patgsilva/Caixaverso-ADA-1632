document.addEventListener("DOMContentLoaded", function (event) {

  // ao carregar a página, gera a tabela com os clientes cadastrados no local storage
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
      let valor = cep.value.replace(/\D/g, ""); 
      if (valor.length <= 8) {
        cep.value = valor.replace(/(\d{5})(\d{3})/, "$1-$2"); 
      }
    }
  });

  function simularAnaliseCredito(nome, plano) {
    return new Promise((resolve, reject) => {
      if (plano !== "Gold") {
        resolve(); // Passa direto se não for Gold
      } else {
        setTimeout(() => {
          const chanceReprovacao = Math.random();
          if (chanceReprovacao <= 0.20) { // 20% de chance de erro
            reject(new Error(`Análise de crédito reprovada para o cliente ${nome} (Plano Gold).`));
          } else {
            resolve();
          }
        }, 5000); // Simula 5 segundos de espera
      }
    });
  }

  let formCliente = document.getElementById("formCliente");
  let listaClientes = document.getElementById("listaClientes");
  let btnAdicionar = document.getElementById("btnAdicionar");
  let statusArea = document.getElementById("statusArea");

  formCliente.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Bloqueia interações do usuário durante o processamento
    btnAdicionar.disabled = true;
    btnAdicionar.innerHTML = "Processando...";
    statusArea.className = "status loading";

    // Lê os campos do formulário
    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let plano = document.getElementById("plano").value;
    let cepValor = document.getElementById("cep").value.replace(/\D/g, "");
    let rua = document.getElementById("rua").value;
    let bairro = document.getElementById("bairro").value;
    let cidade = document.getElementById("cidade").value;
    let estado = document.getElementById("estado").value;

    try {
      // 1. Validar CEP na API (Garante que não salva CEP inválido)
      statusArea.textContent = "1. Consultando validação do CEP...";
      let responseCep = await fetch(`https://viacep.com.br/ws/${cepValor}/json/`);
      let dataCep = await responseCep.json();

      if (dataCep.erro) {
        throw new Error("O CEP informado não existe na base dos Correios.");
      }

      // 2. Análise de Crédito Simulada
      statusArea.textContent = `2. Realizando análise de crédito para o plano ${plano}...`;
      await simularAnaliseCredito(nome, plano);

      // 3. Processamento de Imagem
      statusArea.textContent = "3. Gerando Avatar e salvando dados...";
      let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=random`;

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
      tdPlano.classList.add("plano" + plano);

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

      novaLinha.appendChild(tdAvatar);
      novaLinha.appendChild(tdNome);
      novaLinha.appendChild(tdEmail);
      novaLinha.appendChild(tdPlano);
      novaLinha.appendChild(tdAcoes);

      listaClientes.appendChild(novaLinha);

      // Salva no LocalStorage
      let objCliente = criaObjetoCliente(avatarUrl, nome, email, plano, cepValor, rua, bairro, cidade, estado);
      adicionaItemNoLocalStorage("cliente_db", objCliente);

      // Eventos botões Editar e Excluir
      btnEditar.addEventListener("click", () => {
        document.getElementById("nome").value = tdNome.textContent;
        document.getElementById("email").value = tdEmail.textContent;
        document.getElementById("plano").value = tdPlano.textContent;
        novaLinha.remove();
        removerDoLocalStorage(objCliente.id); // Adicionado para manter a consistência
      });

      btnExcluir.addEventListener("click", function () {
        novaLinha.remove();
        removerDoLocalStorage(objCliente.id); // Adicionado para manter a consistência
      });

      // Finalização com Sucesso
      statusArea.className = "status success";
      statusArea.textContent = "4. Cadastro concluído com sucesso!";
      formCliente.reset();
      
      setTimeout(() => statusArea.textContent = "", 4000); // Limpa a mensagem após 4s

    } catch (error) {
      // O Catch captura rejeições do ViaCEP ou da Análise de Crédito e bloqueia o cadastro
      statusArea.className = "status error";
      statusArea.textContent = `Erro: ${error.message}`;
    } finally {
      // Reabilita o botão independente de sucesso ou falha
      btnAdicionar.disabled = false;
      btnAdicionar.innerHTML = "<strong>+ Adicionar</strong>";
    }
  });
});

// Funções Auxiliares
function criaObjetoCliente(avatarUrl, nome, email, plano, cep, rua, bairro, cidade, estado) {
  let cliente = {
    id: Date.now(),
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
  // alert("Cliente adicionado ao Local Storage!"); // Removido para não atrapalhar a UX com o statusArea
}

function adicionaNovoClienteNaTabela(objeto) {
  let listaClientes = document.getElementById("listaClientes");
  
  let novaLinha = document.createElement("tr");
  
  let tdAvatar = document.createElement("td");
  let imgAvatar = document.createElement("img");
  imgAvatar.src = objeto.avatarUrl;
  imgAvatar.classList.add("img-avatar");
  tdAvatar.appendChild(imgAvatar);
  tdAvatar.style.display = "flex";
  tdAvatar.style.justifyContent = "center";
  tdAvatar.style.alignItems = "center";
  
  let tdNome = document.createElement("td");
  tdNome.style.textAlign = "center";
  tdNome.textContent = objeto.nome;
  
  let tdEmail = document.createElement("td");
  tdEmail.style.textAlign = "center";
  tdEmail.textContent = objeto.email;
  
  let tdPlano = document.createElement("td");
  tdPlano.style.textAlign = "center";
  tdPlano.textContent = objeto.plano;
  tdPlano.classList.add("plano" + objeto.plano);
  
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
  
  novaLinha.appendChild(tdAvatar);
  novaLinha.appendChild(tdNome);
  novaLinha.appendChild(tdEmail);
  novaLinha.appendChild(tdPlano);
  novaLinha.appendChild(tdAcoes);
  
  listaClientes.appendChild(novaLinha);
  
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
    const dados = JSON.parse(localStorage.getItem('cliente_db')) || [];
    const tabelaBody = document.getElementById('listaClientes');
    tabelaBody.innerHTML = ""; 
    dados.forEach(cliente => {
        adicionaNovoClienteNaTabela(cliente);
    });
}

const nomeUsuario = document.querySelector("#codigoUsuario");
const btnUsuario = document.querySelector("#validarUsuario");

btnUsuario.addEventListener("click", () => {
  let codigosAceitos = ["Adriana", "Debora", "Patricia", "Thales", "Rafael"];
  let usuarioDigitado = nomeUsuario.value.trim(); 

  if (usuarioDigitado === "") {
    alert("Campo Usuário é obrigatório.");
    return;
  }

  if (codigosAceitos.includes(usuarioDigitado)) {
    alert("Bem vindo(a) " + usuarioDigitado + "!");
  } else {
    alert("Usuário " + usuarioDigitado + " não cadastrado, tente novamente!");
  }
});

let email = document.getElementById("email");
email.addEventListener("blur", () => {
  let tiraEspacoEmail = email.value.trim(); 
  const validaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (tiraEspacoEmail !== "" && !validaEmail.test(tiraEspacoEmail)) {
    email.classList.add("invalido");
  } else {
    email.classList.remove("invalido");
  }
});

const campoBusca = document.querySelector("#busca");
const tbClientes = document.querySelector("#listaClientes");

campoBusca.addEventListener("input", () => {
  const textoMinusculo = campoBusca.value.trim().toLowerCase(); 
  const clientesCadastrados = tbClientes.querySelectorAll("tr"); 

  clientesCadastrados.forEach(function (linhaTabela) {
    const textoLinha = linhaTabela.innerText.toLowerCase(); 

    if (textoLinha.includes(textoMinusculo)) {
      linhaTabela.style.display = ""; 
    } else {
      linhaTabela.style.display = "none"; 
    }
  });
});