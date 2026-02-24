document.addEventListener("DOMContentLoaded", function(event) {
    // Busca o CEP após o usuário sair do campo de entrada (SEU CÓDIGO ORIGINAL MANTIDO)
    let cep = document.getElementById("cep");
    let rua = document.getElementById("rua");
    let bairro = document.getElementById("bairro");
    let cidade = document.getElementById("cidade");
    let estado = document.getElementById("estado");
    
    cep.addEventListener("blur", function() {
        if (cep.value.length > 0) {
            let cepAPI = 'https://viacep.com.br/ws/' + cep.value + '/json/';
            fetch(cepAPI)
                .then((response) => response.json())
                .then(data => {
                    if (data.erro === "true") {
                        throw new Error('CEP não encontrado');
                    }
                    else {
                        rua.value = data.logradouro;
                        bairro.value = data.bairro;
                        cidade.value = data.localidade;
                        estado.value = data.uf;
                    }
                })
                .catch(error => {
                    rua.value = '';
                    bairro.value = '';
                    cidade.value = '';
                    estado.value = '';
                    alert('Erro ao buscar o CEP! \n' + error.message);
                    cep.focus(); 
                    cep.value = '';
                });
            //formata o campo de cep no formato 00000-000
            let valor = cep.value.replace(/\D/g, ""); // Remove tudo o que não é dígito
            if (valor.length <= 8) {
                cep.value = valor.replace(/(\d{5})(\d{3})/, "$1-$2");
            }
        }
        
    });

    let formCliente = document.getElementById("formCliente");
    let listaClientes = document.getElementById("listaClientes");

    formCliente.addEventListener("submit", function(e) {
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

        let tdNome = document.createElement("td");
        tdNome.style.textAlign = "center";
        tdNome.textContent = nome;

        let tdEmail = document.createElement("td");
        tdEmail.style.textAlign = "center";
        tdEmail.textContent = email;

        let tdPlano = document.createElement("td");
        tdPlano.style.textAlign = "center";
        tdPlano.textContent = plano;

        let tdAcoes = document.createElement("td");
        tdAcoes.style.textAlign = "center";
        tdAcoes.textContent = "Excluir"; 

        novaLinha.appendChild(tdAvatar);
        novaLinha.appendChild(tdNome);
        novaLinha.appendChild(tdEmail);
        novaLinha.appendChild(tdPlano);
        novaLinha.appendChild(tdAcoes);

        listaClientes.appendChild(novaLinha);

        formCliente.reset();
    });
});

const storageKey = "clientes.db";
const nomeUsuario = document.querySelector("#codigoUsuario");
const btnUsuario = document.querySelector("#validarUsuario");
const formCliente = document.querySelector("#formCliente");
const nomeCliente = document.querySelector("#nome");
const emailCliente = document.querySelector("#email");
const planoCliente = document.querySelector("#plano");
const cepCliente = document.querySelector("#cep");
const ruaCliente = document.querySelector("#rua");
const bairroCliente = document.querySelector("#bairro");
const cidadeCliente = document.querySelector("#cidade");
const ufCliente = document.querySelector("#estado");

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
    alert("Bem vindo(a) " + usuarioDigitado);
  } else {
    alert("Usuário não cadastrado, tente novamente");
  }
});

// máscara CEP
cepCliente.addEventListener("input", () => {
  let validaCep = cepCliente.value;

  validaCep = validaCep.replace(/\D/g, "");
  validaCep = validaCep.replace(/^(\d{5})(\d)/, "$1-$2");
  cepCliente.value = validaCep;
});

//valida email
emailCliente.addEventListener("blur", () => {
  //   Console.log("Blur disparado");
  let validaEmail = emailCliente.value.trim();
  if (validaEmail !== "" && !validaEmail.includes("@")) {
    //verifica se o email atende todas as validações quando ele foi definido no type=email
    emailCliente.classList.add("invalido");
  } else {
    emailCliente.classList.remove("invalido");
  }
});
