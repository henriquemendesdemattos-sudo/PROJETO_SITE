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
        
        // 5. Pega o elemento para mostrar mensagens de erro
        const mensagemErro = document.getElementById('mensagem-erro');
        const botaoCadastro = document.getElementById('botao-cadastro');
        
        // Desativa o botão para prevenir múltiplos cliques
        botaoCadastro.disabled = true;
        botaoCadastro.innerText = "Processando...";
        mensagemErro.innerText = ""; // Limpa erros antigos

        // 6. Pega os valores dos campos de e-mail e senha
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value; 
        const confirmarSenha = document.getElementById('senha-confirmar').value;
        const cpf = document.getElementById('cpf').value.replace(/\D/g, ''); // Apenas números
        const rua = document.getElementById('rua').value;
        const termos = document.getElementById('termos').checked;       

        // 1. Validação do E-mail (Firebase já faz, mas é bom ter)
        if (!email.includes('@') || !email.includes('.')) {
            mensagemErro.innerText = "O formato do e-mail é inválido.";
            botaoCadastro.disabled = false;
            botaoCadastro.innerText = "Finalizar Cadastro";
            return; // Para a execução
        }
        
        // 2. Validação da Senha (Força + Confirmação)
        if (senha.length < 8) {
            mensagemErro.innerText = "A senha deve ter no mínimo 8 caracteres.";
            botaoCadastro.disabled = false;
            botaoCadastro.innerText = "Finalizar Cadastro";
            return;
        }
        if (senha !== confirmarSenha) {
            mensagemErro.innerText = "As senhas não conferem. Tente novamente.";
            botaoCadastro.disabled = false;
            botaoCadastro.innerText = "Finalizar Cadastro";
            return;
        }

        // 3. Validação do CPF (apenas se tem 11 números)
        if (cpf.length !== 11) {
            mensagemErro.innerText = "O CPF deve conter 11 números.";
            botaoCadastro.disabled = false;
            botaoCadastro.innerText = "Finalizar Cadastro";
            return;
        }
        
        // 4. Validação do Endereço (Vê se o ViaCEP preencheu)
        if (rua === "" || rua === "Buscando...") {
            mensagemErro.innerText = "Por favor, preencha um CEP válido e aguarde o endereço ser preenchido.";
            botaoCadastro.disabled = false;
            botaoCadastro.innerText = "Finalizar Cadastro";
            return;
        }
        
        // 5. Validação dos Termos
        if (!termos) {
            mensagemErro.innerText = "Você precisa aceitar os Termos de Uso e a Política de Privacidade.";
            botaoCadastro.disabled = false;
            botaoCadastro.innerText = "Finalizar Cadastro";
            return;
        }

        // --- FIM DA VALIDAÇÃO ---

        console.log('Tentando cadastrar:', email); // Para depuração

        // 7. Chama a função do FIREBASE para CRIAR um usuário
        firebase.auth().createUserWithEmailAndPassword(email, senha)
            .then((userCredential) => {
                // Cadastro deu certo!
                console.log('Usuário cadastrado com sucesso, enviando e-mail de verificação...', userCredential.user);
                
                // PEGA O USUÁRIO RECÉM-CRIADO
                const user = userCredential.user;

                // **NOVO PASSO: ENVIA O E-MAIL DE VERIFICAÇÃO**
                user.sendEmailVerification()
                    .then(() => {
                        // E-mail de verificação enviado
                        console.log('E-mail de verificação enviado para', user.email);
                        
                        // Avisa o usuário e redireciona para a página de login
                        alert('Conta criada com sucesso! Enviamos um link de verificação para o seu e-mail. Por favor, verifique sua caixa de entrada e faça o login.');
                        
                        // **REDIRECIONAMENTO MUDOU (Conforme seu pedido)**
                        window.location.href = 'login.html'; // Envia para a página de "login"
                    })
                    .catch((error) => {
                        // Erro ao enviar o e-mail
                        console.error('Erro ao enviar e-mail de verificação:', error);
                        mensagemErro.innerText = 'Conta criada, mas falhamos ao enviar o e-mail de verificação.';
                        botaoCadastro.disabled = false;
                        botaoCadastro.innerText = "Finalizar Cadastro";
                    });

            })
            .catch((error) => {
                // (Código de erro do cadastro - sem alteração)
                // ... (código de erro existente)
                console.error('Erro no cadastro:', error.code, error.message);
                
                // **ATUALIZAÇÃO AQUI**
                if (error.code === 'auth/weak-password') {
                    mensagemErro.innerText = 'A senha é muito fraca. (Mínimo 8 caracteres)';
                } else if (error.code === 'auth/email-already-in-use') {
                    mensagemErro.innerText = 'Este e-mail já está em uso.';
                } else if (error.code === 'auth/invalid-email') { 
                    mensagemErro.innerText = 'O formato do e-mail é inválido.';
                } else {
                    mensagemErro.innerText = 'Ocorreu um erro ao criar a conta.';
                }

                botaoCadastro.disabled = false;
                botaoCadastro.innerText = "Finalizar Cadastro";
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
                alert('Login efetuado com sucesso!');
                
                // Redireciona o usuário para a página principal
                window.location.href = 'dashboard.html'; 
                
            })
            .catch((error) => {
                // Login deu errado!
                console.error('Erro no login:', error.code, error.message);

                // Tenta encontrar o elemento de erro no HTML
                const mensagemErro = document.getElementById('mensagem-erro-login');

                // Mostra erros amigáveis para o usuário
                if (error.code === 'auth/invalid-login-credentials' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    mensagemErro.innerText = 'E-mail ou senha incorretos. Tente novamente.';
                } else {
                    mensagemErro.innerText = 'Ocorreu um erro ao fazer login.';
                }
            });
    });
}

// --- PÁGINA DASHBOARD (O "GUARDA" E O LOGOUT) ---

// Esta é a função "Gatekeeper" (Porteiro) do Firebase.
// Ela é chamada AUTOMATICAMENTE toda vez que a página carrega.
firebase.auth().onAuthStateChanged((user) => {

    // Verifica se estamos na página dashboard.html
    const isDashboardPage = window.location.pathname.endsWith('dashboard.html');
    
    if (isDashboardPage) {
        // Estamos no dashboard, precisamos proteger
        const loadingSpinner = document.getElementById('loading-spinner');
        const dashboardContent = document.getElementById('dashboard-content');
        
        if (user) {
            // --- USUÁRIO ESTÁ LOGADO ---
            
            // 1. VERIFICAR SE O E-MAIL FOI VALIDADO
            if (user.emailVerified) {
                // Sucesso! O usuário está logado E verificado
                console.log('Usuário logado e verificado:', user.email);
                
                // Preenche a mensagem de boas-vindas
                const welcomeMessage = document.getElementById('welcome-message');
                if (welcomeMessage) {
                    welcomeMessage.innerText = `Olá, bem-vindo(a) de volta ${user.email}!`;
                }

                // Esconde o "carregando" e mostra o conteúdo
                if (loadingSpinner) loadingSpinner.style.display = 'none';
                if (dashboardContent) dashboardContent.style.display = 'block';

                // Adiciona o evento ao botão de logout
                const botaoLogout = document.getElementById('logout');
                if (botaoLogout) {
                    botaoLogout.addEventListener('click', () => {
                        firebase.auth().signOut().then(() => {
                            console.log('Usuário deslogado.');
                            alert('Você foi desconectado.');
                            window.location.href = 'login.html';
                        }).catch((error) => {
                            console.error('Erro ao deslogar:', error);
                        });
                    });
                }
                
            } else {
                // --- USUÁRIO LOGADO, MAS E-MAIL NÃO VERIFICADO ---
                console.log('Usuário logado, mas e-mail não verificado.');
                firebase.auth().signOut(); // Desloga o usuário
                alert('Sua conta foi criada, mas seu e-mail ainda não foi verificado. Por favor, verifique seu e-mail e tente fazer login novamente.');
                window.location.href = 'login.html';
            }
            
        } else {
            // --- NINGUÉM ESTÁ LOGADO ---
            console.log('Nenhum usuário logado. Redirecionando para login.');
            alert('Você precisa estar logado para acessar esta página.');
            window.location.href = 'login.html';
        }
    }
    
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