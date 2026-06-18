import { useState, useEffect } from 'react';
import { getConfiguracoes } from '../../services/api';
import './devlogin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api-llrh';

const DevLogin = ({ onLoginSuccess }) => {
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
            const response = await fetch(`${API_URL}/dev/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });
            
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('devToken', data.token);
                localStorage.setItem('devUser', JSON.stringify(data.user));
                
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

    const handleVoltarAdmin = () => {
        // Verifica se está logado como admin
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = '/?admin=true';
        } else {
            window.location.href = '/';
        }
    };

    return (
        <div className="dev-login-container">
            <div className="dev-login-card">
                <div className="dev-login-header">
                    {logoUrl ? (
                        <img 
                            src={`${logoUrl}?t=${Date.now()}`} 
                            alt="LLRH Logo" 
                            className="dev-login-logo-img"
                        />
                    ) : (
                        <div className="dev-login-logo">
                            {loadingLogo ? '...' : 'LLRH'}
                        </div>
                    )}
                    <div className="dev-badge">👨‍💻 DEV</div>
                    <h2>Área do Desenvolvedor</h2>
                    <p>Acesso restrito à equipe de desenvolvimento</p>
                </div>
                
                {error && (
                    <div className="dev-login-error">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="dev-login-form">
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
                    
                    <button type="submit" disabled={loading} className="dev-login-btn">
                        {loading ? (
                            <div className="loading-content">
                                <span className="spinner"></span>
                                <span className="loading-text">Acessando...</span>
                            </div>
                        ) : (
                            'Acessar Área Dev'
                        )}
                    </button>
                </form>

                <div className="dev-voltar-admin">
                    <button 
                        className="voltar-admin-link"
                        onClick={handleVoltarAdmin}
                    >
                        ← Voltar para o painel admin
                    </button>
                </div>
                
                <div className="dev-login-footer">
                    <p>🔐 Acesso restrito para desenvolvedores</p>
                </div>
            </div>
        </div>
    );
};

export default DevLogin;
