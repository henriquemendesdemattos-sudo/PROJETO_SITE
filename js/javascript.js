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
    
    // Pega os elementos do formulário UMA VEZ
    const mensagemErro = document.getElementById('mensagem-erro');
    const botaoCadastro = document.getElementById('botao-cadastro');
    const cepInput = document.getElementById('cep');

    // --- LÓGICA DO VIACEP (MOVIDA PARA CÁ) ---

    // Função para limpar os campos de endereço
    const limparCamposEndereco = () => {
        document.getElementById('rua').value = '';
        document.getElementById('bairro').value = '';
        document.getElementById('cidade').value = '';
        document.getElementById('estado').value = '';
    }

    // Esta função é chamada quando o usuário sai do campo CEP
    const buscarCep = async () => {
        if (!cepInput || !mensagemErro || !botaoCadastro) return; 

        const cep = cepInput.value.replace(/\D/g, ''); // Remove tudo que não é número

        if (cep.length === 0) {
            limparCamposEndereco();
            mensagemErro.innerText = ""; // Limpa erro de CEP se o campo estiver vazio
            return;
        }

        if (cep.length < 8) {
            limparCamposEndereco();
            mensagemErro.innerText = "Formato de CEP inválido (deve ter 8 números).";
            return;
        }

        if (cep.length === 8) {
            botaoCadastro.disabled = true;
            botaoCadastro.innerText = "Buscando CEP...";

            document.getElementById('rua').value = 'Buscando...';
            document.getElementById('bairro').value = 'Buscando...';
            document.getElementById('cidade').value = 'Buscando...';
            document.getElementById('estado').value = 'Buscando...';
            mensagemErro.innerText = "";
        
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (data.erro) {
                    limparCamposEndereco();
                    mensagemErro.innerText = "CEP não encontrado. Verifique e tente novamente.";
                } else {
                    document.getElementById('rua').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('estado').value = data.uf;
                    document.getElementById('numero').focus(); // Foca no campo "Número"
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
                limparCamposEndereco();
                mensagemErro.innerText = "Erro ao buscar o CEP. Tente novamente mais tarde.";
            } finally {
                // Reabilita o botão DEPOIS que a busca (sucesso ou falha) terminar
                botaoCadastro.disabled = false;
                botaoCadastro.innerText = "Finalizar Cadastro";
            }
        }
    };

    // Adiciona o "ouvinte" ao campo CEP (quando o usuário clica fora dele - 'blur')
    if (cepInput) {
        cepInput.addEventListener('blur', buscarCep); // Mudei de 'input' para 'blur'
    }

    // --- FIM DA LÓGICA DO VIACEP ---


    // 3. Adiciona um "ouvinte" para quando o formulário for ENVIADO
    formCadastro.addEventListener('submit', (evento) => {
        
        // 4. Previne que a página recarregue
        evento.preventDefault();
        
        if (botaoCadastro) {
            botaoCadastro.disabled = true;                      
            botaoCadastro.innerText = "Processando...";
        }

        // Função auxiliar para mostrar erros e reativar o botão
        const mostrarErro = (mensagem) => {
            if (mensagemErro) {
                mensagemErro.innerText = mensagem;
            }
            if (botaoCadastro) {
                botaoCadastro.disabled = false;
                botaoCadastro.innerText = "Finalizar Cadastro";
            }
        };
        
        // Limpa erros antigos (exceto erros de CEP)
        if (mensagemErro && !mensagemErro.innerText.includes("CEP")) {
             mensagemErro.innerText = "";
        }

        // 6. Pega os valores
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value; 
        const confirmarSenha = document.getElementById('senha-confirmar').value;
        const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
        const rua = document.getElementById('rua').value;
        const termos = document.getElementById('termos').checked;       

        // 1. Validação do E-mail
        if (!email.includes('@') || !email.includes('.')) {
            mostrarErro("O formato do e-mail é inválido.");
            return;
        }
        
        // 2. Validação da Senha
        if (senha.length < 8) {
            mostrarErro("A senha deve ter no mínimo 8 caracteres.");
            return;
        }
        if (senha !== confirmarSenha) {
            mostrarErro("As senhas não conferem. Tente novamente.");
            return;
        }

        // 3. Validação do CPF
        if (cpf.length !== 11) {
            mostrarErro("O CPF deve conter 11 números.");
            return;
        }
        
        // 4. Validação do Endereço
        if (rua === "" || rua === "Buscando...") {
            if (mensagemErro && !mensagemErro.innerText.includes("CEP")) {
                 mostrarErro("Por favor, preencha um CEP válido e aguarde o endereço ser preenchido.");
            }
            // Re-ativa o botão mesmo se o erro do CEP já estiver lá
            if (botaoCadastro) {
                botaoCadastro.disabled = false;
                botaoCadastro.innerText = "Finalizar Cadastro";
            }
            return;
        }
        
        // 5. Validação dos Termos
        if (!termos) {
            mostrarErro("Você precisa aceitar os Termos de Uso e a Política de Privacidade.");
            return;
        }

        // --- FIM DA VALIDAÇÃO ---

        console.log('Tentando cadastrar:', email);

        // 7. Chama a função do FIREBASE para CRIAR um usuário
        firebase.auth().createUserWithEmailAndPassword(email, senha)
            .then((userCredential) => {
                const user = userCredential.user;
                
                user.sendEmailVerification()
                    .then(() => {
                        console.log('E-mail de verificação enviado para', user.email);
                        alert('Conta criada com sucesso! Enviamos um link de verificação para o seu e-mail. Por favor, verifique sua caixa de entrada e faça o login.');
                        window.location.href = 'login.html';
                    })
                    .catch((error) => {
                        console.error('Erro ao enviar e-mail de verificação:', error);
                        mostrarErro('Conta criada, mas falhamos ao enviar o e-mail de verificação.');
                    });

            })
            .catch((error) => {
                console.error('Erro no cadastro:', error.code, error.message);
                if (error.code === 'auth/weak-password') {
                    mostrarErro('A senha é muito fraca. (Mínimo 8 caracteres)');
                } else if (error.code === 'auth/email-already-in-use') {
                    mostrarErro('Este e-mail já está em uso.');
                } else if (error.code === 'auth/invalid-email') { 
                    mostrarErro('O formato do e-mail é inválido.');
                } else {
                    mostrarErro('Ocorreu um erro ao criar a conta.');
                }
            });
    });
}

    // --- PÁGINA DE LOGIN ---
const formLogin = document.getElementById('loginForm');
if (formLogin) {
    formLogin.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const email = document.getElementById('email-login').value;
        const senha = document.getElementById('senha-login').value;
        const mensagemErro = document.getElementById('mensagem-erro-login');

        console.log('Tentando logar:', email);

        firebase.auth().signInWithEmailAndPassword(email, senha)
            .then((userCredential) => {
                console.log('Login bem-sucedido!', userCredential.user);
                if (mensagemErro) mensagemErro.innerText = "";
                alert('Login efetuado com sucesso!');
                window.location.href = 'dashboard.html'; 
            })
            .catch((error) => {
                console.error('Erro no login:', error.code, error.message);
                const mensagemErroLogin = document.getElementById('mensagem-erro-login');
                if (mensagemErroLogin) {
                    if (error.code === 'auth/invalid-login-credentials' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                        mensagemErroLogin.innerText = 'E-mail ou senha incorretos. Tente novamente.';
                    } else {
                        mensagemErroLogin.innerText = 'Ocorreu um erro ao fazer login.';
                    }
                }
            });
    });
}

// --- PÁGINA DASHBOARD (O "GUARDA" E O LOGOUT) ---
firebase.auth().onAuthStateChanged((user) => {
    const isDashboardPage = window.location.pathname.endsWith('dashboard.html');
    
    if (isDashboardPage) {
        const loadingSpinner = document.getElementById('loading-spinner');
        const dashboardContent = document.getElementById('dashboard-content');
        
        if (user) {
            if (user.emailVerified) {
                console.log('Usuário logado e verificado:', user.email);
                const welcomeMessage = document.getElementById('welcome-message');
                if (welcomeMessage) {
                    welcomeMessage.innerText = `Olá, bem-vindo(a) de volta ${user.email}!`;
                }
                if (loadingSpinner) loadingSpinner.style.display = 'none';
                if (dashboardContent) dashboardContent.style.display = 'block';

                const botaoLogout = document.getElementById('logout'); // Corrigido: o ID no seu HTML é 'logout'
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
                console.log('Usuário logado, mas e-mail não verificado.');
                firebase.auth().signOut();
                alert('Sua conta foi criada, mas seu e-mail ainda não foi verificado. Por favor, verifique seu e-mail e tente fazer login novamente.');
                window.location.href = 'login.html';
            }
            
        } else {
            console.log('Nenhum usuário logado. Redirecionando para login.');
            alert('Você precisa estar logado para acessar esta página.');
            window.location.href = 'login.html';
        }
    }
});

    // --- SIMULAÇÃO DE ENVIO DE FORMULÁRIO DE CONTATO ---
    function simulateFormSubmit(formId, messageText) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', function(event) {
                event.preventDefault(); 
                const oldMessage = document.getElementById('successMessage');
                if (oldMessage) {
                    oldMessage.remove();
                }
                const successMessage = document.createElement('div');
                successMessage.id = 'successMessage';
                successMessage.className = 'alert alert-success mt-4';
                successMessage.textContent = messageText;
                form.parentElement.appendChild(successMessage);
                form.reset();
                setTimeout(() => {
                    successMessage.style.transition = 'opacity 0.5s ease';
                    successMessage.style.opacity = '0';
                    setTimeout(() => successMessage.remove(), 500);
                }, 5000);
            });
        }
    }

    simulateFormSubmit(
        'contactForm', 
        'Mensagem enviada com sucesso! Entraremos em contato em breve.'
    );

});
