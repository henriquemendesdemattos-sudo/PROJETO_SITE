    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
    
    // INICIALIZAÇÃO DO FIREBASE
    const firebaseConfig = {
        apiKey: "AIzaSyD1tb1lQVAhHd-cxagQf5wW5ntPoCBuBNs",
        authDomain: "basicbank-72119.firebaseapp.com",
        projectId: "basicbank-72119",
        storageBucket: "basicbank-72119.firebasestorage.app",
        messagingSenderId: "659142629021",
        appId: "1:659142629021:web:1f9d4a9ff0c5c9220ae674"
    };
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // FIM DA INICIALIZAÇÃO

document.addEventListener('DOMContentLoaded', function() {
    
    // --- PÁGINA DE CADASTRO ---

// 1. Tenta encontrar o formulário de cadastro na página
const formCadastro = document.getElementById('cadastroForm');

// 2. Verifica se o formulário existe na página atual
if (formCadastro) {
    
    // 3. Adiciona um "ouvinte" para quando o formulário for enviado
    formCadastro.addEventListener('submit', (evento) => {
        
        // 4. Previne que a página recarregue (comportamento padrão do form)
        evento.preventDefault(); 
        
        // 5. Pega os valores dos campos de e-mail e senha
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        
        // 6. Pega o elemento para mostrar mensagens de erro
        const mensagemErro = document.getElementById('mensagem-erro');
        
        console.log('Tentando cadastrar:', email); // Para depuração

        // 7. Chama a função do FIREBASE para CRIAR um usuário
        firebase.auth().createUserWithEmailAndPassword(email, senha)
            .then((userCredential) => {
                // Cadastro deu certo!
                console.log('Usuário cadastrado com sucesso!', userCredential.user);
                
                // Limpa erros antigos
                mensagemErro.innerText = ""; 
                
                // Avisa o usuário e redireciona
                alert('Conta criada com sucesso! Você será redirecionado.');
                
                // IMPORTANTE: Redireciona o usuário para a página de "logado"
                // (Mude 'dashboard.html' para sua página de perfil ou login)
                window.location.href = 'index.html'; // Ou 'login.html'
                
            })
            .catch((error) => {
                // Cadastro deu errado!
                console.error('Erro no cadastro:', error.code, error.message);
                
                // Mostra um erro amigável para o usuário
                if (error.code === 'auth/weak-password') {
                    mensagemErro.innerText = 'A senha é muito fraca. (Mínimo 6 caracteres)';
                } else if (error.code === 'auth/email-already-in-use') {
                    mensagemErro.innerText = 'Este e-mail já está em uso.';
                } else {
                    mensagemErro.innerText = 'Ocorreu um erro ao criar a conta.';
                }
            });
    });
}

    // Função reutilizável para simular o envio de um formulário
    function simulateFormSubmit(formId, messageText) {
        const form = document.getElementById(formId);

        if (form) {
            form.addEventListener('submit', function(event) {
                event.preventDefault(); // Impede o recarregamento da página

                // Remove mensagens de sucesso antigas
                const oldMessage = document.getElementById('successMessage');
                if (oldMessage) {
                    oldMessage.remove();
                }

                // Cria a nova mensagem de sucesso
                const successMessage = document.createElement('div');
                successMessage.id = 'successMessage';
                successMessage.className = 'alert alert-success mt-4';
                successMessage.textContent = messageText;
                
                // Insere a mensagem após o formulário
                form.parentElement.appendChild(successMessage);

                // Limpa o formulário
                form.reset();

                // Remove a mensagem após 5 segundos
                setTimeout(() => {
                    successMessage.style.transition = 'opacity 0.5s ease';
                    successMessage.style.opacity = '0';
                    setTimeout(() => successMessage.remove(), 500);
                }, 5000);
            });
        }
    }

    // Executa a simulação para a página de Contato
    simulateFormSubmit(
        'contactForm', 
        'Mensagem enviada com sucesso! Entraremos em contato em breve.'
    );

    // Executa a simulação para a página de Cadastro
    simulateFormSubmit(
        'cadastroForm', 
        'Cadastro realizado com sucesso! Em breve, você receberá um e-mail com os próximos passos.'
    );

});