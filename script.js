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
