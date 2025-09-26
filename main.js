document.addEventListener('DOMContentLoaded', () => {
    // Referências dos elementos
    const registerPanel = document.getElementById('register-panel');
    const loginPanel = document.getElementById('login-panel');
    const successPanel = document.getElementById('success-panel');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const messageArea = document.getElementById('message-area');
    const welcomeUser = document.getElementById('welcome-user');
    
    // Links para alternar painéis
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        switchPanel('login');
    });
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        switchPanel('register');
    });
    document.getElementById('logout-btn').addEventListener('click', () => {
        switchPanel('login'); // Volta para a tela de login
        showMessage('success', 'Você saiu da sua conta.');
    });

    /**
     * Alterna a visibilidade dos painéis de cadastro, login e sucesso.
     * @param {string} panelName - 'register', 'login' ou 'success'
     */
    function switchPanel(panelName) {
        // Limpa a área de mensagens
        showMessage(); 

        // Remove a classe 'active' de todos
        [registerPanel, loginPanel, successPanel].forEach(panel => {
            panel.classList.remove('active');
            panel.classList.add('hidden');
        });

        // Adiciona a classe 'active' ao painel desejado
        if (panelName === 'register') {
            registerPanel.classList.add('active');
            registerPanel.classList.remove('hidden');
        } else if (panelName === 'login') {
            loginPanel.classList.add('active');
            loginPanel.classList.remove('hidden');
        } else if (panelName === 'success') {
            successPanel.classList.add('active');
            successPanel.classList.remove('hidden');
        }
    }

    /**
     * Exibe ou limpa uma mensagem de feedback para o usuário.
     * @param {string} type - 'success', 'error' ou vazio para limpar.
     * @param {string} message - O texto da mensagem.
     */
    function showMessage(type, message) {
        messageArea.className = 'message-area';
        messageArea.textContent = '';
        messageArea.style.display = 'none';

        if (type && message) {
            messageArea.classList.add(type);
            messageArea.textContent = message;
            messageArea.style.display = 'block';
        }
    }

    // --- Lógica de CADASTRO ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('reg-name').value.trim();
        const phone = document.getElementById('reg-phone').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        // 1. Validação de Senhas
        if (password !== confirmPassword) {
            showMessage('error', 'As senhas não coincidem. Verifique a confirmação.');
            return;
        }

        // 2. Simulação de Banco de Dados (LocalStorage)
        // O nome de usuário será a chave para armazenar os dados.
        // Convertemos o nome para minúsculas para facilitar o login.
        const usernameKey = name.toLowerCase();

        // 3. Verifica se o usuário já existe
        if (localStorage.getItem(usernameKey)) {
            showMessage('error', `O usuário "${name}" já está cadastrado.`);
            return;
        }

        // 4. Salva os dados
        const userData = {
            name: name,
            phone: phone,
            email: email,
            // Em uma aplicação real, a senha NUNCA deve ser salva como texto puro.
            // Aqui, apenas para simulação, salvamos o texto. Use HASH (ex: bcrypt) em produção!
            password: password 
        };

        localStorage.setItem(usernameKey, JSON.stringify(userData));

        // 5. Feedback e Transição
        showMessage('success', `Cadastro de "${name}" realizado com sucesso!`);
        registerForm.reset();
        switchPanel('login');
    });

    // --- Lógica de LOGIN ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const loginName = document.getElementById('login-name').value.trim();
        const loginPassword = document.getElementById('login-password').value;

        // 1. Simulação de Banco de Dados (LocalStorage)
        const usernameKey = loginName.toLowerCase();
        const storedUser = localStorage.getItem(usernameKey);

        // 2. Verifica se o usuário existe
        if (!storedUser) {
            showMessage('error', 'Usuário não encontrado. Cadastre-se primeiro.');
            return;
        }

        const userData = JSON.parse(storedUser);

        // 3. Validação de Senha
        if (userData.password !== loginPassword) {
            showMessage('error', 'Senha incorreta. Tente novamente.');
            return;
        }

        // 4. Login Bem-Sucedido
        loginForm.reset();
        welcomeUser.textContent = userData.name; // Exibe o nome original
        showMessage('success', `Login efetuado! Olá, ${userData.name}.`);
        switchPanel('success');
    });
});