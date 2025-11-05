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
    firebase.initializeApp(firebaseConfig);

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

    // --- PÁGINA DE LOGIN ---
// (ADICIONE ESTE NOVO BLOCO DE CÓDIGO ABAIXO)

// 1. Tenta encontrar o formulário de LOGIN na página
const formLogin = document.getElementById('loginForm');

// 2. Verifica se o formulário de LOGIN existe na página atual
if (formLogin) {

    // 3. Adiciona um "ouvinte" para quando o formulário for enviado
    formLogin.addEventListener('submit', (evento) => {
        
        // 4. Previne que a página recarregue
        evento.preventDefault();

        // 5. Pega os valores dos campos de e-mail e senha
        const email = document.getElementById('email-login').value;
        const senha = document.getElementById('senha-login').value;

        // 6. Pega o elemento para mostrar mensagens de erro
        const mensagemErro = document.getElementById('mensagem-erro-login');

        console.log('Tentando logar:', email);

        // 7. Chama a função do FIREBASE para FAZER LOGIN
        firebase.auth().signInWithEmailAndPassword(email, senha)
            .then((userCredential) => {
                // Login deu certo!
                console.log('Login bem-sucedido!', userCredential.user);
                
                // Limpa erros antigos
                mensagemErro.innerText = "";
                
                // Avisa o usuário e redireciona
                alert('Login efetuado com sucesso! Bem-vindo(a) de volta.');
                
                // Redireciona o usuário para a página principal
                window.location.href = 'index.html'; 
                
            })
            .catch((error) => {
                // Login deu errado!
                console.error('Erro no login:', error.code, error.message);

                // Tenta encontrar o elemento de erro no HTML
                const mensagemErro = document.getElementById('mensagem-erro-login');

                // Mostra erros amigáveis para o usuário
                if (error.code === 'auth/invalid-login-credentials') {
                    mensagemErro.innerText = 'E-mail ou senha incorretos. Tente novamente.';
                } else {
                    mensagemErro.innerText = 'Ocorreu um erro ao fazer login.';
                }
            });
    });
}

// --- PÁGINA DASHBOARD (O "GUARDA" E O LOGOUT) ---
// (ADICIONE ESTE NOVO BLOCO DE CÓDIGO)

// Esta é a função "Gatekeeper" (Porteiro) do Firebase.
// Ela é chamada AUTOMATICAMENTE toda vez que a página carrega.
firebase.auth().onAuthStateChanged((user) => {

    // 1. Tenta encontrar os elementos da página de dashboard
    const loadingSpinner = document.getElementById('loading-spinner');
    const dashboardContent = document.getElementById('dashboard-content');
    const botaoLogout = document.getElementById('logout');

    // 2. Estamos na página de dashboard?
    // (Verificamos se o 'loadingSpinner' existe)
    if (loadingSpinner) {

        if (user) {
            // --- USUÁRIO ESTÁ LOGADO ---
            console.log('Usuário logado:', user.email);

            // 1. Esconde o "Carregando"
            loadingSpinner.style.display = 'none';
            
            // 2. Mostra o conteúdo principal do dashboard
            dashboardContent.style.display = 'block';

            // 3. Adiciona a função de "Sair" (Logout) ao botão
            botaoLogout.addEventListener('click', () => {
                firebase.auth().signOut()
                    .then(() => {
                        // Logout bem-sucedido
                        alert('Você saiu. Redirecionando para o login...');
                        window.location.href = 'login.html';
                    })
                    .catch((error) => {
                        console.error('Erro ao fazer logout:', error);
                    });
            });

        } else {
            // --- USUÁRIO NÃO ESTÁ LOGADO ---
            console.log('Usuário não logado. Redirecionando...');
            
            // 1. Esconde o "Carregando" (opcional)
            loadingSpinner.style.display = 'none';

            // 2. CHUTA O USUÁRIO para a página de login
            alert('Você precisa estar logado para ver esta página.');
            window.location.href = 'login.html';
        }
    }
    // Se não encontrou os elementos, não faz nada (estamos em outra página)
});

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