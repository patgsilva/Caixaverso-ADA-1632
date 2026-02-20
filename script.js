document.addEventListener("DOMContentLoaded", function(event) {
    // Busca o CEP após o usuário sair do campo de entrada
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

    
});