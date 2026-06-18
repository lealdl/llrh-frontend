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
    const [recuperarSenha, setRecuperarSenha] = useState(false);
    const [recuperando, setRecuperando] = useState(false);
    const [secretKey, setSecretKey] = useState('');
    const [mensagemRecuperacao, setMensagemRecuperacao] = useState(null);
    const [step, setStep] = useState('secret');
    const [userId, setUserId] = useState(null);
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

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

    const handleVerificarSecret = async (e) => {
        e.preventDefault();
        setRecuperando(true);
        setMensagemRecuperacao(null);

        try {
            const response = await fetch(`${API_URL}/auth/verificar-secret`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ secret_key: secretKey }),
            });
            
            const data = await response.json();
            
            if (data.success) {
                setUserId(data.user_id);
                setStep('nova-senha');
                setMensagemRecuperacao({ type: 'success', text: '✅ Chave válida! Digite sua nova senha.' });
            } else {
                setMensagemRecuperacao({ type: 'error', text: data.message || '❌ Chave inválida' });
            }
        } catch (err) {
            setMensagemRecuperacao({ type: 'error', text: 'Erro de conexão com o servidor' });
        } finally {
            setRecuperando(false);
        }
    };

    const handleAtualizarSenha = async (e) => {
        e.preventDefault();
        
        if (novaSenha.length < 6) {
            setMensagemRecuperacao({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres' });
            return;
        }
        
        if (novaSenha !== confirmarSenha) {
            setMensagemRecuperacao({ type: 'error', text: 'As senhas não coincidem' });
            return;
        }
        
        setRecuperando(true);
        setMensagemRecuperacao(null);

        try {
            const response = await fetch(`${API_URL}/auth/atualizar-senha`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    secret_key: secretKey,
                    nova_senha: novaSenha 
                }),
            });
            
            const data = await response.json();
            
            if (data.success) {
                setMensagemRecuperacao({ type: 'success', text: '✅ ' + data.message });
                setTimeout(() => {
                    setRecuperarSenha(false);
                    setStep('secret');
                    setSecretKey('');
                    setNovaSenha('');
                    setConfirmarSenha('');
                    setMensagemRecuperacao(null);
                }, 3000);
            } else {
                setMensagemRecuperacao({ type: 'error', text: data.message || '❌ Erro ao atualizar senha' });
            }
        } catch (err) {
            setMensagemRecuperacao({ type: 'error', text: 'Erro de conexão com o servidor' });
        } finally {
            setRecuperando(false);
        }
    };

    // Tela de recuperação de senha
    if (recuperarSenha) {
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
                        <h2>{step === 'secret' ? 'Recuperar Senha' : 'Nova Senha'}</h2>
                        <p>
                            {step === 'secret' 
                                ? 'Digite sua chave de recuperação' 
                                : 'Digite sua nova senha'}
                        </p>
                    </div>
                    
                    {mensagemRecuperacao && (
                        <div className={`login-message ${mensagemRecuperacao.type}`}>
                            {mensagemRecuperacao.text}
                        </div>
                    )}
                    
                    {step === 'secret' ? (
                        <form onSubmit={handleVerificarSecret} className="login-form">
                            <div className="form-group">
                                <label>Chave de Recuperação</label>
                                <input 
                                    type="password" 
                                    value={secretKey} 
                                    onChange={(e) => setSecretKey(e.target.value)}
                                    placeholder="Digite sua chave de recuperação"
                                    required
                                />
                            </div>
                            
                            <button type="submit" disabled={recuperando} className="login-btn">
                                {recuperando ? (
                                    <div className="loading-content">
                                        <span className="spinner"></span>
                                        <span className="loading-text">Verificando...</span>
                                    </div>
                                ) : (
                                    'Verificar Chave'
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleAtualizarSenha} className="login-form">
                            <div className="form-group">
                                <label>Nova Senha</label>
                                <input 
                                    type="password" 
                                    value={novaSenha} 
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                    placeholder="Digite sua nova senha"
                                    required
                                    minLength="6"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirmar Senha</label>
                                <input 
                                    type="password" 
                                    value={confirmarSenha} 
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    placeholder="Confirme sua nova senha"
                                    required
                                    minLength="6"
                                />
                            </div>
                            
                            <button type="submit" disabled={recuperando} className="login-btn">
                                {recuperando ? (
                                    <div className="loading-content">
                                        <span className="spinner"></span>
                                        <span className="loading-text">Atualizando...</span>
                                    </div>
                                ) : (
                                    'Atualizar Senha'
                                )}
                            </button>
                        </form>
                    )}
                    
                    <div className="login-footer">
                        <button 
                            className="link-btn"
                            onClick={() => {
                                setRecuperarSenha(false);
                                setStep('secret');
                                setMensagemRecuperacao(null);
                                setSecretKey('');
                                setNovaSenha('');
                                setConfirmarSenha('');
                            }}
                        >
                            ← Voltar para o login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                
                <div className="login-forgot">
                    <button 
                        className="forgot-link"
                        onClick={() => setRecuperarSenha(true)}
                    >
                        Esqueceu a senha?
                    </button>
                </div>
                
                <div className="login-footer">
                    <p>Área restrita - Apenas administradores</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
