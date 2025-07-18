// Authentication handling for login page using localStorage
class AuthManager {
    constructor() {
        this.initializeEventListeners();
        this.checkAuthState();
    }

    initializeEventListeners() {
        // Tab switching
        document.getElementById('loginTab').addEventListener('click', () => this.switchTab('login'));
        document.getElementById('registerTab').addEventListener('click', () => this.switchTab('register'));
        
        // Form submission
        document.getElementById('authForm').addEventListener('submit', (e) => this.handleAuthSubmit(e));
    }

    switchTab(type) {
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');
        const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
        const authButton = document.getElementById('authButton');
        const buttonText = authButton.querySelector('.btn-text');

        if (type === 'login') {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            confirmPasswordGroup.style.display = 'none';
            buttonText.textContent = 'Iniciar Sesión';
            authButton.dataset.mode = 'login';
        } else {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            confirmPasswordGroup.style.display = 'block';
            buttonText.textContent = 'Registrarse';
            authButton.dataset.mode = 'register';
        }
        
        this.clearMessage();
    }

    async handleAuthSubmit(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const mode = e.target.querySelector('#authButton').dataset.mode || 'login';
        
        // Validation
        if (!this.validateForm(email, password, confirmPassword, mode)) {
            return;
        }
        
        this.setLoading(true);
        
        try {
            if (mode === 'register') {
                await this.register(email, password);
            } else {
                await this.login(email, password);
            }
        } catch (error) {
            this.showMessage(error.message, 'error');
            this.setLoading(false);
        }
    }

    validateForm(email, password, confirmPassword, mode) {
        // Clear previous errors
        this.clearInputErrors();
        
        if (!email || !this.isValidEmail(email)) {
            this.showMessage('Por favor ingresa un email válido', 'error');
            this.markInputError('email');
            return false;
        }
        
        if (!password || password.length < 6) {
            this.showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
            this.markInputError('password');
            return false;
        }
        
        if (mode === 'register' && password !== confirmPassword) {
            this.showMessage('Las contraseñas no coinciden', 'error');
            this.markInputError('confirmPassword');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    markInputError(inputId) {
        document.getElementById(inputId).classList.add('error');
    }

    clearInputErrors() {
        const inputs = document.querySelectorAll('input.error');
        inputs.forEach(input => input.classList.remove('error'));
    }

    async register(email, password) {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user already exists
        const users = this.getUsers();
        if (users.find(user => user.email === email)) {
            throw new Error('Ya existe una cuenta con este email');
        }
        
        // Create new user
        const newUser = {
            id: this.generateUserId(),
            email: email,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('shopperApp_users', JSON.stringify(users));
        
        // Initialize user data
        this.initializeUserData(newUser.id);
        
        // Set current user
        this.setCurrentUser(newUser);
        
        this.showMessage('Cuenta creada exitosamente', 'success');
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 1500);
    }

    async login(email, password) {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === this.hashPassword(password));
        
        if (!user) {
            throw new Error('Email o contraseña incorrectos');
        }
        
        // Set current user
        this.setCurrentUser(user);
        
        this.showMessage('Iniciando sesión...', 'success');
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 1000);
    }

    initializeUserData(userId) {
        const defaultSettings = {
            tariff1Name: 'Supermercado Local',
            tariff1Value: 5000,
            tariff2Name: 'Supermercado Premium',
            tariff2Value: 7000,
            skuValue: 150,
            kmValue: 200,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem(`shopperApp_settings_${userId}`, JSON.stringify(defaultSettings));
        localStorage.setItem(`shopperApp_orders_${userId}`, JSON.stringify([]));
    }

    getUsers() {
        const users = localStorage.getItem('shopperApp_users');
        return users ? JSON.parse(users) : [];
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    hashPassword(password) {
        // Simple hash function (in production, use proper hashing)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    setCurrentUser(user) {
        const userSession = {
            id: user.id,
            email: user.email,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('shopperApp_currentUser', JSON.stringify(userSession));
    }

    checkAuthState() {
        const currentUser = localStorage.getItem('shopperApp_currentUser');
        if (currentUser) {
            // User is already logged in, redirect to app
            window.location.href = 'app.html';
        }
    }

    setLoading(loading) {
        const button = document.getElementById('authButton');
        const spinner = button.querySelector('.loading-spinner');
        const text = button.querySelector('.btn-text');
        
        if (loading) {
            button.disabled = true;
            spinner.style.display = 'block';
            text.style.opacity = '0.7';
        } else {
            button.disabled = false;
            spinner.style.display = 'none';
            text.style.opacity = '1';
        }
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.getElementById('authMessage');
        messageDiv.textContent = message;
        messageDiv.className = `auth-message ${type}`;
        messageDiv.style.display = 'block';
    }

    clearMessage() {
        const messageDiv = document.getElementById('authMessage');
        messageDiv.style.display = 'none';
        messageDiv.textContent = '';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});