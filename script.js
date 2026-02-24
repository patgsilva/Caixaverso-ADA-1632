document.addEventListener("DOMContentLoaded", function(event) {
    // Busca o CEP após o usuário sair do campo de entrada
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

    
});