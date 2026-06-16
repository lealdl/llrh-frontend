import { useState, useEffect } from 'react';
import { getConfiguracoes } from '../../services/api';
import './login.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api-llrh';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [logoUrl, setLogoUrl] = useState(null);
    const [loadingLogo, setLoadingLogo] = useState(true);

    useEffect(() => {
        const carregarLogo = async () => {
            try {
                const response = await getConfiguracoes();
                if (response.success && response.data && response.data.logo_url) {
                    setLogoUrl(response.data.logo_url);
                }
            } catch (error) {
                console.error('Erro ao carregar logo:', error);
            } finally {
                setLoadingLogo(false);
            }
        };
        
        carregarLogo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });
            
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                if (onLoginSuccess) {
                    onLoginSuccess(data.user);
                }
            } else {
                setError(data.message || 'Email ou senha inválidos');
            }
        } catch (err) {
            setError('Erro de conexão com o servidor');
        } finally {
            setLoading(false);
        }
    };

    const toggleMostrarSenha = () => {
        setMostrarSenha(!mostrarSenha);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    {logoUrl ? (
                        <img 
                            src={`${logoUrl}?t=${Date.now()}`} 
                            alt="LLRH Logo" 
                            className="login-logo-img"
                        />
                    ) : (
                        <div className="login-logo">
                            {loadingLogo ? '...' : 'LLRH'}
                        </div>
                    )}
                    <h2>Área Administrativa</h2>
                    <p>Faça login para acessar o painel</p>
                </div>
                
                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Digite seu email"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Senha</label>
                        <div className="password-wrapper">
                            <input 
                                type={mostrarSenha ? 'text' : 'password'} 
                                value={senha} 
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Digite sua senha"
                                required
                            />
                            <button 
                                type="button" 
                                className="password-toggle-btn"
                                onClick={toggleMostrarSenha}
                                title={mostrarSenha ? 'Esconder senha' : 'Mostrar senha'}
                            >
                                {mostrarSenha ? '👁️' : '🔍'}
                            </button>
                        </div>
                    </div>
                    
                    <button type="submit" disabled={loading} className="login-btn">
                        {loading ? (
                            <div className="loading-content">
                                <span className="spinner"></span>
                                <span className="loading-text">Realizando login...</span>
                            </div>
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </form>
                
                <div className="login-footer">
                    <p>Área restrita - Apenas administradores</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
