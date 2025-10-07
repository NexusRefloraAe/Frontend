import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import './Login.css'
import Logo_reflora_Ae from '../../assets/Logo_reflora_Ae.png'
import Nome_reflora_ae from '../../assets/Nome_reflora_ae.png'

function Login() {
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.identifier.trim()) newErrors.identifier = 'Campo obrigatório'
        if (!formData.password.trim()) newErrors.password = 'Campo obrigatório'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) console.log('Tentativa de login:', formData)
    }

    const handleGoogleLogin = () => console.log('Login com Google')
    const handleForgotPassword = () => console.log('Esqueci a senha')
    const handleRegister = () => console.log('Cadastre-se')

    return (
        <div className="login-wrapper">
            <div className="login-banner" aria-hidden="true">
                <img src={Logo_reflora_Ae} alt="Reflora" className="login-banner__img" />
            </div>

            <div className="login-form-area">
                {/* Mobile: logo pequena acima do form */}
                <div className="login-logo-mobile">
                    <img src={Nome_reflora_ae} alt="Reflora" />
                </div>

                <div className="login-header">
                    <h1>Faça login</h1>
                    <p>Acesse sua conta para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form" noValidate>
                    <div className="form-group">
                        <label htmlFor="identifier">Nome, e-mail ou telefone</label>
                        <input
                            id="identifier"
                            name="identifier"
                            type="text"
                            value={formData.identifier}
                            onChange={handleInputChange}
                            placeholder="Seu nome, e-mail ou telefone"
                            className={errors.identifier ? 'error' : ''}
                            autoComplete="username"
                            aria-label="Nome, e-mail ou telefone"
                        />
                        {errors.identifier && (
                            <span className="error-message">{errors.identifier}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <div className="password-input-container">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Sua senha"
                                className={errors.password ? 'error' : ''}
                                autoComplete="current-password"
                                aria-label="Senha"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="error-message">{errors.password}</span>
                        )}
                    </div>

                    <div className="forgot-password">
                        <span>Esqueceu sua conta?</span>
                        <button
                            type="button"
                            className="link-button"
                            onClick={handleForgotPassword}
                        >
                            Clique aqui
                        </button>
                    </div>

                    <button type="submit" className="login-button">
                        Entrar
                    </button>

                    <div className="divider">
                        <span>Ou</span>
                    </div>

                    <button
                        type="button"
                        className="google-button"
                        onClick={handleGoogleLogin}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path
                                fill="#4285F4"
                                d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
                            />
                            <path
                                fill="#34A853"
                                d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-2.7.75 4.8 4.8 0 0 1-4.52-3.36H1.83v2.07A8 8 0 0 0 8.98 17z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M4.46 10.41a4.8 4.8 0 0 1-.25-1.41c0-.49.09-.97.25-1.41V5.52H1.83a8 8 0 0 0 0 7.17l2.63-2.28z"
                            />
                            <path
                                fill="#EA4335"
                                d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.54-2.54A8 8 0 0 0 8.98 1a8 8 0 0 0-7.15 4.42l2.63 2.28c.87-2.6 3.3-4.12 4.52-4.12z"
                            />
                        </svg>
                        Continuar com Google
                    </button>

                    <div className="register-link">
                        <span>Não tem uma conta? </span>
                        <button
                            type="button"
                            className="link-button register"
                            onClick={handleRegister}
                        >
                            Cadastre-se
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login