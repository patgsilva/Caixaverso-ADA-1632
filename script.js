document.addEventListener("DOMContentLoaded", function (event) {
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

    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let plano = document.getElementById("plano").value;

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
