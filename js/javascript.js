document.addEventListener('DOMContentLoaded', function () {

    // Define a URL base da sua API

    const API_URL = 'https://basicbank-backend-ebgqbnfkh4eteqgf.eastus2-01.azurewebsites.net';

    // --- PÁGINA DE CADASTRO ---
    const formCadastro = document.getElementById('cadastroForm');

    if (formCadastro) {
        const mensagemErro = document.getElementById('mensagem-erro');
        const botaoCadastro = document.getElementById('botao-cadastro');
        const cepInput = document.getElementById('cep');

        // --- LÓGICA DO VIACEP ---
        const limparCamposEndereco = () => {
            document.getElementById('rua').value = '';
            document.getElementById('bairro').value = '';
            document.getElementById('cidade').value = '';
            document.getElementById('estado').value = '';
        }

        const buscarCep = async () => {
            if (!cepInput || !mensagemErro || !botaoCadastro) return;
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length === 0) {
                limparCamposEndereco();
                mensagemErro.innerText = "";
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
                        document.getElementById('numero').focus();
                    }
                } catch (error) {
                    console.error('Erro ao buscar CEP:', error);
                    limparCamposEndereco();
                    mensagemErro.innerText = "Erro ao buscar o CEP. Tente novamente mais tarde.";
                } finally {
                    botaoCadastro.disabled = false;
                    botaoCadastro.innerText = "Finalizar Cadastro";
                }
            }
        };

        if (cepInput) {
            cepInput.addEventListener('blur', buscarCep);
        }
        // --- FIM DA LÓGICA DO VIACEP ---

        // Event listener do formulário de cadastro
        formCadastro.addEventListener('submit', async (evento) => {
            evento.preventDefault();
            
            // Função helper para mostrar erro
            const mostrarErro = (mensagem) => {
                if (mensagemErro) {
                    mensagemErro.innerText = mensagem;
                    mensagemErro.classList.remove('text-success');
                    mensagemErro.classList.add('text-danger');
                }
            };

            // Função helper para mostrar sucesso (NOVO)
            const mostrarSucesso = (mensagem) => {
                if (mensagemErro) {
                    mensagemErro.innerText = mensagem;
                    mensagemErro.classList.remove('text-danger');
                    mensagemErro.classList.add('text-success');
                }
            };
            
            if (mensagemErro && !mensagemErro.innerText.includes("CEP")) {
                mensagemErro.innerText = "";
            }

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('senha-confirmar').value;
            const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
            const rua = document.getElementById('rua').value;
            const termos = document.getElementById('termos').checked;

            // Validações
            if (!nome) {
                mostrarErro("O campo Nome é obrigatório.");
                return;
            }
            if (!email.includes('@') || !email.includes('.com')) {
                mostrarErro("O formato do e-mail é inválido.");
                return;
            }
            if (senha.length < 8) {
                mostrarErro("A senha deve ter no mínimo 8 caracteres.");
                return;
            }
            if (senha !== confirmarSenha) {
                mostrarErro("As senhas não conferem. Tente novamente.");
                return;
            }
            if (cpf.length !== 11) {
                mostrarErro("O CPF deve conter 11 números.");
                return;
            }
            if (rua === "" || rua === "Buscando...") {
                if (mensagemErro && !mensagemErro.innerText.includes("CEP")) {
                    mostrarErro("Por favor, preencha um CEP válido e aguarde o endereço ser preenchido.");
                }
                return;
            }
            if (!termos) {
                mostrarErro("Você precisa aceitar os Termos de Uso e a Política de Privacidade.");
                return;
            }
            // --- FIM DA VALIDAÇÃO ---

            // --- LÓGICA DE CADASTRO ---

            // Otimização: Desabilita o botão para evitar cliques duplicados
            if (botaoCadastro) {
                botaoCadastro.disabled = true;
                botaoCadastro.innerText = 'Criando conta...';
            }

            // Adiciona a chamada FETCH para sua nova API
            try {
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nome: nome,
                        email: email,
                        senha: senha,
                        cpf: cpf
                        // NOTA: Você pode enviar mais dados (nome, endereço) se quiser salvá-los no banco
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Sucesso!
                    console.log('Cadastro bem-sucedido:', data.message);
                    mostrarSucesso('Conta criada com sucesso! Redirecionando para o login...');

                    // Adiciona um pequeno delay para o usuário ler a mensagem antes de redirecionar
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2500); // Redireciona após 2.5 segundos

                } else {
                    // Erro vindo do servidor (ex: "E-mail já existe")
                    mostrarErro(data.message || 'Ocorreu um erro ao criar a conta.');
                }

            } catch (error) {
                console.error('Erro de rede no cadastro:', error);
                mostrarErro('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
            } finally {
                // Otimização: Reabilita o botão, não importa se deu certo ou errado
                if (mensagemErro.classList.contains('text-danger')) {
                     if (botaoCadastro) {
                        botaoCadastro.disabled = false;
                        botaoCadastro.innerText = 'Finalizar Cadastro';
                    }
                }
            }
            // --- FIM DA LÓGICA DE CADASTRO ---
        });
    }

    // --- PÁGINA DE LOGIN ---
    const formLogin = document.getElementById('loginForm');
    if (formLogin) {
        const botaoLogin = formLogin.querySelector('button[type="submit"]'); // Encontra o botão de login
        
        formLogin.addEventListener('submit', async (evento) => {
            evento.preventDefault();
            const email = document.getElementById('email-login').value;
            const senha = document.getElementById('senha-login').value;
            const mensagemErroLogin = document.getElementById('mensagem-erro-login');

            console.log('Tentando logar:', email);

            // Otimização: Desabilita o botão
            if (botaoLogin) {
                botaoLogin.disabled = true;
                botaoLogin.innerText = 'Entrando...';
            }
            if (mensagemErroLogin) mensagemErroLogin.innerText = "";

            // Adiciona a chamada FETCH para sua nova API
            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        senha: senha
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // SUCESSO!
                    console.log('Login bem-sucedido!');
                    
                    // A parte MAIS IMPORTANTE: Salvar o "Token" e o NOME no navegador
                    localStorage.setItem('basicBankToken', data.token);
                    localStorage.setItem('basicBankUserEmail', email); // Mantido por segurança
                    localStorage.setItem('basicBankUserName', data.nome);

                    window.location.href = 'dashboard.html';
                } else {
                    // Erro vindo do servidor (ex: "Senha incorreta")
                    console.error('Erro no login:', data.message);
                    if (mensagemErroLogin) {
                        mensagemErroLogin.innerText = data.message || 'Ocorreu um erro ao fazer login.';
                    }
                }

            } catch (error) {
                console.error('Erro de rede no login:', error);
                if (mensagemErroLogin) {
                    mensagemErroLogin.innerText = 'Não foi possível conectar ao servidor.';
                }
            } finally {
                // Otimização: Reabilita o botão de login
                if (botaoLogin) {
                    botaoLogin.disabled = false;
                    botaoLogin.innerText = 'Entrar';
                }
            }
        });
    }

    // --- PÁGINA DASHBOARD (O "GUARDA" E O LOGOUT) ---

    // Adiciona o novo "guarda" baseado no Token
    const isDashboardPage = window.location.pathname.endsWith('dashboard.html');

    if (isDashboardPage) {
        const token = localStorage.getItem('basicBankToken');
        const userName = localStorage.getItem('basicBankUserName');
        
        const loadingSpinner = document.getElementById('loading-spinner');
        const dashboardContent = document.getElementById('dashboard-content');

        if (token && userName) {
            // Usuário está "logado" (tem um token)
            console.log('Usuário logado:', userName);

            // Atualiza a mensagem de boas-vindas
            // O seu HTML tem "Olá, Usuário!" dentro de um <h1>
            const welcomeHeader = document.querySelector('#dashboard-content h1');
            if (welcomeHeader) {
                welcomeHeader.innerText = `Olá, ${userName}!`;
            }

            if (loadingSpinner) loadingSpinner.style.display = 'none';
            if (dashboardContent) dashboardContent.style.display = 'block';

            // Configura o botão de Logout
            const botaoLogout = document.getElementById('logout');
            if (botaoLogout) {
                botaoLogout.addEventListener('click', (e) => {
                    e.preventDefault(); // Previne que o link seja seguido
                    
                    // Limpa o "passaporte" (token)
                    localStorage.removeItem('basicBankToken');
                    localStorage.removeItem('basicBankUserEmail');
                    localStorage.removeItem('basicBankUserName');

                    console.log('Usuário deslogado.');
                    // alert('Você foi desconectado.'); // Removido
                    window.location.href = 'login.html';
                });
            }
        } else {
            // Não tem token, redireciona para o login
            console.log('Nenhum token encontrado. Redirecionando para login.');

            window.location.href = 'login.html';
        }
    }

    // --- SIMULAÇÃO DE ENVIO DE FORMULÁRIO DE CONTATO ---
    function simulateFormSubmit(formId, messageText) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', function (event) {
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
