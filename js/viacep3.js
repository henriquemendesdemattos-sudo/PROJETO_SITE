// Aguarda o documento carregar para garantir que todos os elementos existam
document.addEventListener('DOMContentLoaded', (event) => {

    const cepInput = document.getElementById('cep');
    const mensagemErro = document.getElementById('mensagem-erro');

    // Função para limpar os campos de endereço
    const limparCampos = () => {
        document.getElementById('rua').value = '';
        document.getElementById('bairro').value = '';
        document.getElementById('cidade').value = '';
        document.getElementById('estado').value = '';
    }

    // Esta função é chamada quando o usuário sai do campo CEP
    const buscarCep = async () => {
        // Não faz nada se o campo CEP não estiver na página
        if (!cepInput || !mensagemErro) return; 

        const cep = cepInput.value.replace(/\D/g, ''); // Remove tudo que não é número

        if (cep.length < 8) {
            limparCampos();
            mensagemErro.innerText = "Formato de CEP inválido (deve ter 8 números).";
            return;
        }

        if (cep.length === 8) {
            // Mostra um "carregando" enquanto busca
            document.getElementById('rua').value = 'Buscando...';
            document.getElementById('bairro').value = 'Buscando...';
            document.getElementById('cidade').value = 'Buscando...';
            document.getElementById('estado').value = 'Buscando...';
            mensagemErro.innerText = "";
        
            // Faz a chamada para a API ViaCEP
            try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                // CEP não encontrado
                limparCampos();
                mensagemErro.innerText = "CEP não encontrado. Verifique e tente novamente.";
            } else {
                // CEP encontrado! Preenche os campos
                document.getElementById('rua').value = data.logradouro;
                document.getElementById('bairro').value = data.bairro;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;
                
                // Foca no campo "Número"
                document.getElementById('numero').focus();
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            limparCampos();
            mensagemErro.innerText = "Erro ao buscar o CEP. Tente novamente mais tarde.";
        }
        }

    // Adiciona o "ouvinte" ao campo CEP (quando o usuário clica fora dele)
    if (cepInput) {
        cepInput.addEventListener('input', buscarCep);
    }
    }
});
