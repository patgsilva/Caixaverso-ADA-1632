document.addEventListener("DOMContentLoaded", function(event) {
    // Busca o CEP após o usuário sair do campo de entrada (SEU CÓDIGO ORIGINAL MANTIDO)
    let cep = document.getElementById("cep");
    let rua = document.getElementById("rua");
    let bairro = document.getElementById("bairro");
    let cidade = document.getElementById("cidade");
    let estado = document.getElementById("estado");
    
    cep.addEventListener("blur", function() {
        let cepAPI = 'https://viacep.com.br/ws/' + cep.value + '/json/';
        fetch(cepAPI)
            .then(response => response.json())
            .then(data => {
                rua.value = data.logradouro;
                bairro.value = data.bairro;
                cidade.value = data.localidade;
                estado.value = data.uf;
            });
        //formata o campo de cep no formato 00000-000
        let valor = cep.value.replace(/\D/g, ""); // Remove tudo o que não é dígito
        if (valor.length <= 8) {
            cep.value = valor.replace(/(\d{5})(\d{3})/, "$1-$2");
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
        tdNome.textContent = nome;

        let tdEmail = document.createElement("td");
        tdEmail.textContent = email;

        let tdPlano = document.createElement("td");
        tdPlano.textContent = plano;

        let tdAcoes = document.createElement("td");
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