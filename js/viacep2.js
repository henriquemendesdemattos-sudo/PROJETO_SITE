// Cria dinamicamente um elemento para exibir erros
    const cepErrorDiv = document.createElement('div');
    cepErrorDiv.id = 'cep-error-message';
    cepErrorDiv.style.color = '#dc3545'; // Cor de perigo do Bootstrap
    cepErrorDiv.style.fontSize = '0.875em';
    cepErrorDiv.style.height = '1.2em';
    cepErrorDiv.style.marginTop = '0.25rem';
    
    // Insere a div de erro logo após o campo CEP
    cepInput.parentNode.insertBefore(cepErrorDiv, cepInput.nextSibling);

    // Função para mostrar o erro por alguns segundos
    let errorTimeout;
    function showError(message) {
        cepErrorDiv.textContent = message;
        
        // Limpa o timer de erro anterior, se houver
        clearTimeout(errorTimeout);

        // Define um novo timer para limpar a mensagem
        errorTimeout = setTimeout(() => {
            cepErrorDiv.textContent = '';
        }, 3000); // A mensagem desaparece após 3 segundos
    }
    