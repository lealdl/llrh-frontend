import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [step, setStep] = useState('welcome');
    const [userName, setUserName] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [conversationEnded, setConversationEnded] = useState(false);
    const [config, setConfig] = useState(null);
    const [loadingConfig, setLoadingConfig] = useState(true);
    const [logoUrl, setLogoUrl] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const closeTimerRef = useRef(null);

    // ========== CONFIGURAÇÃO DA API ==========
    const API_URL = 'https://lucianodenilsonleal1749068474000.0141835.meusitehostgator.com.br/api-llrh';

    // ========== SALVAR MENSAGEM NO BACKEND ==========
    const salvarMensagem = async (mensagem, tipo, opcoes = null) => {
        try {
            let sessaoId = localStorage.getItem('chatbot_sessao_id');
            if (!sessaoId) {
                sessaoId = 'sessao_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('chatbot_sessao_id', sessaoId);
            }

            const data = {
                sessao_id: sessaoId,
                usuario_nome: userName || 'Visitante',
                mensagem: mensagem,
                tipo: tipo,
                opcoes: opcoes
            };

            const response = await fetch(`${API_URL}/chatbot/mensagem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            return await response.json();
        } catch (error) {
            console.error('❌ Erro ao salvar mensagem:', error);
            return { success: false };
        }
    };

    // ========== ENCERRAR CONVERSA NO BACKEND ==========
    const encerrarConversaBackend = async () => {
        try {
            const sessaoId = localStorage.getItem('chatbot_sessao_id');
            if (!sessaoId) return;

            const response = await fetch(`${API_URL}/chatbot/encerrar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessao_id: sessaoId })
            });

            return await response.json();
        } catch (error) {
            console.error('❌ Erro ao encerrar conversa:', error);
            return { success: false };
        }
    };

    // Buscar configurações do site (incluindo WhatsApp e Logo)
    useEffect(() => {
        const carregarConfiguracoes = async () => {
            try {
                const data = await api.getConfiguracoes();
                if (data.success && data.data) {
                    setConfig(data.data);
                    if (data.data.logo_url) {
                        setLogoUrl(data.data.logo_url);
                        console.log('🖼️ Logo carregada para o Chatbot:', data.data.logo_url);
                    }
                    console.log('📦 Configurações carregadas para o Chatbot:', data.data);
                }
            } catch (error) {
                console.error('Erro ao carregar configurações para o Chatbot:', error);
            } finally {
                setLoadingConfig(false);
            }
        };
        carregarConfiguracoes();
    }, []);

    // Limpar timer ao desmontar
    useEffect(() => {
        return () => {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
            }
        };
    }, []);

    // Função para pegar o número do WhatsApp das configurações
    const getWhatsAppNumber = () => {
        if (config?.whatsapp) {
            const numero = config.whatsapp.replace(/\D/g, '');
            return numero;
        }
        return '5548974000276';
    };

    // Função para pegar a mensagem padrão do WhatsApp
    const getWhatsAppMessage = () => {
        const nomeSite = config?.nome_site || 'LLRH - Atração de Talentos';
        return encodeURIComponent(`Olá! Gostaria de falar com a ${nomeSite}.`);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ========== FUNÇÃO PARA RESETAR COMPLETAMENTE O CHAT ==========
    const resetarChat = () => {
        // Limpa o timer se existir
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }

        // Reseta todos os estados
        setMessages([]);
        setStep('welcome');
        setUserName('');
        setConversationEnded(false);
        setIsTyping(false);
        setInputValue('');
    };

    // ========== FUNÇÃO PARA INICIAR UMA NOVA CONVERSA ==========
    const iniciarNovaConversa = () => {
        resetarChat();

        // Abre o chat se estiver fechado
        if (!isOpen) {
            setIsOpen(true);
        }

        // Aguarda um pouco e envia a mensagem de boas-vindas
        setTimeout(() => {
            setMessages([
                {
                    id: Date.now(),
                    type: 'bot',
                    text: '🤖 Olá! Seja bem-vindo(a) à LLRH - Atração de Talentos!',
                },
                {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: 'Sou o Assistente Virtual da LLRH. Estou aqui para ajudar você! 😊',
                },
                {
                    id: Date.now() + 2,
                    type: 'bot',
                    text: 'Antes de começarmos, poderia me dizer seu nome?',
                },
            ]);
            setStep('ask_name');
        }, 300);
    };

    // Mensagem inicial do bot (quando abre o chat pela primeira vez)
    useEffect(() => {
        if (isOpen && messages.length === 0 && !conversationEnded && !loadingConfig) {
            setTimeout(() => {
                setMessages([
                    {
                        id: Date.now(),
                        type: 'bot',
                        text: '🤖 Olá! Seja bem-vindo(a) à LLRH - Atração de Talentos!',
                    },
                    {
                        id: Date.now() + 1,
                        type: 'bot',
                        text: 'Sou o Assistente Virtual da LLRH. Estou aqui para ajudar você! 😊',
                    },
                    {
                        id: Date.now() + 2,
                        type: 'bot',
                        text: 'Antes de começarmos, poderia me dizer seu nome?',
                    },
                ]);
                setStep('ask_name');
            }, 500);
        }
    }, [isOpen, loadingConfig]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // ========== FUNÇÃO PARA FECHAR O CHAT APÓS 3 SEGUNDOS E RESETAR ==========
    const fecharChatAposEncerrar = () => {
        // Limpa timer anterior se existir
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
        }

        // Agenda o fechamento após 3 segundos
        closeTimerRef.current = setTimeout(() => {
            setIsOpen(false);
            closeTimerRef.current = null;

            // RESETA COMPLETAMENTE O CHAT APÓS FECHAR
            resetarChat();
        }, 3000);
    };

    const handleSendMessage = () => {
        const text = inputValue.trim();
        if (!text) return;

        if (conversationEnded) {
            iniciarNovaConversa();
            return;
        }

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: text,
        };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // SALVA MENSAGEM DO USUÁRIO NO BACKEND
        salvarMensagem(text, 'user');

        setTimeout(() => {
            processUserResponse(text);
        }, 800);
    };

    const processUserResponse = (text) => {
        let botResponse = '';
        let options = [];

        // Verifica se é "encerrar conversa"
        if (text.toLowerCase().includes('encerrar') || text.toLowerCase().includes('sair') || text === '🚪 Encerrar') {
            setConversationEnded(true);

            // Array de saudações de despedida aleatórias
            const despedidas = [
                `👋 Foi um prazer conversar com você, ${userName}! 🌟\n\nAgradecemos imensamente pelo seu contato. A LLRH está sempre aqui para ajudar você a encontrar as melhores oportunidades! 💼\n\nSe precisar de algo mais, é só nos chamar. Tenha um excelente dia! 😊`,
                `🙏 Muito obrigado(a) pela conversa, ${userName}! ✨\n\nFoi ótimo poder ajudar você hoje. Na LLRH, acreditamos que cada conexão pode transformar carreiras! 🚀\n\nEstamos à disposição sempre que precisar. Até logo! 🌟`,
                `💙 Que bom conversar com você, ${userName}! 🎉\n\nEsperamos ter ajudado de alguma forma. A LLRH está comprometida em conectar talentos às melhores oportunidades! 💼\n\nQualquer dúvida, estamos aqui. Tenha um ótimo dia! 😊`,
                `✨ Foi incrível falar com você, ${userName}! 🌟\n\nNa LLRH, valorizamos cada interação e estamos felizes em poder ajudar. Continue acompanhando nossas novidades! 🚀\n\nAté a próxima! 👋`
            ];

            const despedidaAleatoria = despedidas[Math.floor(Math.random() * despedidas.length)];

            botResponse = despedidaAleatoria;
            options = ['📱 Falar no WhatsApp'];

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    type: 'bot',
                    text: botResponse,
                    options: options,
                    showWhatsApp: true,
                },
            ]);
            setIsTyping(false);

            // SALVA MENSAGEM DO BOT NO BACKEND
            salvarMensagem(botResponse, 'bot', options);

            // ENCERRA CONVERSA NO BACKEND
            encerrarConversaBackend();

            // FECHA O CHAT APÓS 3 SEGUNDOS (e reseta)
            fecharChatAposEncerrar();
            return;
        }

        // Verifica se é "voltar ao início"
        if (text.toLowerCase().includes('voltar ao início') || text === '🏠 Voltar ao início') {
            setStep('menu');
            botResponse = `🏠 Voltando ao início.\n\nComo posso ajudar você, ${userName}?`;
            options = [
                '💼 Ver Vagas',
                '📞 Contato',
                '📖 Sobre a LLRH',
                '⚙️ Serviços',
                '📝 Falar com atendente',
                '🚪 Encerrar conversa',
            ];
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    type: 'bot',
                    text: botResponse,
                    options: options,
                },
            ]);
            setIsTyping(false);

            // SALVA MENSAGEM DO BOT NO BACKEND
            salvarMensagem(botResponse, 'bot', options);
            return;
        }

        switch (step) {
            case 'ask_name':
                setUserName(text);
                setStep('menu');
                botResponse = `Prazer em conhecê-lo(a), ${text}! 🎉\n\nComo posso ajudar você hoje?`;
                options = [
                    '💼 Ver Vagas',
                    '📞 Contato',
                    '📖 Sobre a LLRH',
                    '⚙️ Serviços',
                    '📝 Falar com atendente',
                    '🚪 Encerrar conversa',
                ];
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        type: 'bot',
                        text: botResponse,
                        options: options,
                    },
                ]);
                setIsTyping(false);

                // SALVA MENSAGEM DO BOT NO BACKEND
                salvarMensagem(botResponse, 'bot', options);
                break;

            default:
                handleMenuOption(text);
        }
    };

    const handleMenuOption = (text) => {
        let response = '';
        let options = [];

        // Opções principais
        if (text.includes('Vagas') || text.includes('💼')) {
            response = `📌 Excelente! Temos diversas vagas disponíveis.\n\n🔹 Desenvolvedor Full Stack - Remoto\n🔹 Analista de RH - São Paulo\n🔹 Designer UX/UI - Híbrido\n🔹 Gerente de Projetos - Curitiba\n\n🔗 Acesse a seção "Vagas" no menu principal para ver todas as oportunidades!`;
            options = ['📋 Ver todas as vagas', '🏠 Voltar ao início', '🚪 Encerrar conversa'];
        } else if (text.includes('Contato') || text.includes('📞')) {
            const whatsapp = config?.whatsapp || '(48) 97400-0276';
            const telefone = config?.telefone || '(48) 97400-0276';
            const email = config?.email_contato || 'contato@llrh.com.br';
            const horario = config?.horario_funcionamento || 'Segunda a Sexta, 09h às 18h';

            response = `📱 Entre em contato conosco:\n\n📧 Email: ${email}\n📞 Telefone: ${telefone}\n💬 WhatsApp: ${whatsapp}\n\n🕐 Horário de atendimento: ${horario}\n\nNossa equipe está pronta para ajudar você!`;
            options = ['📱 Falar no WhatsApp', '🏠 Voltar ao início', '🚪 Encerrar conversa'];
        } else if (text.includes('Sobre') || text.includes('📖')) {
            response = `📖 Sobre a LLRH\n\nDesde 2024, a LLRH Atração de Talentos conecta empresas aos profissionais certos por meio de processos seletivos humanizados, estratégicos e assertivos.\n\n🎯 Missão: Transformar o mercado de trabalho através de soluções inovadoras em RH.\n\n👁️ Visão: Ser referência em consultoria de talentos.\n\n💎 Valores: Ética, transparência, inovação e compromisso com o sucesso.`;
            options = ['🏠 Voltar ao início', '🚪 Encerrar conversa'];
        } else if (text.includes('Serviços') || text.includes('⚙️')) {
            response = `⚙️ Nossos Serviços:\n\n🔹 Recrutamento e Seleção\n🔹 Headhunting Executivo\n🔹 Avaliação Psicológica\n🔹 Treinamento e Desenvolvimento\n🔹 Pesquisa Salarial\n🔹 Gestão de Talentos\n\nClique em "Contratar Serviços" no menu principal para saber mais!`;
            options = ['🏠 Voltar ao início', '🚪 Encerrar conversa'];
        } else if (text.includes('atendente') || text.includes('Falar com atendente') || text.includes('📝')) {
            const whatsapp = config?.whatsapp || '(48) 97400-0276';
            const email = config?.email_contato || 'contato@llrh.com.br';

            response = `📞 Ótimo! Nossa equipe terá prazer em atendê-lo(a) pessoalmente.\n\n💬 WhatsApp: ${whatsapp}\n📧 Email: ${email}\n\nUm de nossos consultores entrará em contato em breve!`;
            options = ['📱 Falar no WhatsApp', '🏠 Voltar ao início', '🚪 Encerrar conversa'];
        } else if (text.includes('Voltar') || text.includes('🔙')) {
            setStep('menu');
            response = `🔙 Voltando ao menu principal.\n\nComo posso ajudar você, ${userName}?`;
            options = [
                '💼 Ver Vagas',
                '📞 Contato',
                '📖 Sobre a LLRH',
                '⚙️ Serviços',
                '📝 Falar com atendente',
                '🚪 Encerrar conversa',
            ];
        } else if (text.includes('Ver todas as vagas') || text.includes('📋')) {
            response = `🔗 Acesse nossa página de vagas:\n\nhttps://lucianodenilsonleal1749068474000.0141835.meusitehostgator.com.br/#vagas\n\nLá você encontra todas as oportunidades disponíveis! 🚀`;
            options = ['🏠 Voltar ao início', '🚪 Encerrar conversa'];
        } else if (text.includes('Falar no WhatsApp') || text.includes('📱')) {
            response = `📱 Vamos conversar pelo WhatsApp! Clique no botão abaixo para abrir o chat.`;
            options = ['📱 Falar no WhatsApp'];
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    type: 'bot',
                    text: response,
                    options: options,
                    showWhatsApp: true,
                },
            ]);
            setIsTyping(false);

            // SALVA MENSAGEM DO BOT NO BACKEND
            salvarMensagem(response, 'bot', options);
            return;
        } else {
            response = `🤔 Desculpe, não entendi direito. ${userName}, você pode escolher uma das opções abaixo:`;
            options = [
                '💼 Ver Vagas',
                '📞 Contato',
                '📖 Sobre a LLRH',
                '⚙️ Serviços',
                '📝 Falar com atendente',
                '🚪 Encerrar conversa',
            ];
        }

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                type: 'bot',
                text: response,
                options: options,
                showWhatsApp: text.includes('Falar no WhatsApp') || text.includes('📱'),
            },
        ]);
        setIsTyping(false);

        // SALVA MENSAGEM DO BOT NO BACKEND
        salvarMensagem(response, 'bot', options);
    };

    const handleOptionClick = (option) => {
        if (option === '🚪 Encerrar conversa') {
            setConversationEnded(true);

            const despedidas = [
                `👋 Foi um prazer conversar com você, ${userName}! 🌟\n\nAgradecemos imensamente pelo seu contato. A LLRH está sempre aqui para ajudar você a encontrar as melhores oportunidades! 💼\n\nSe precisar de algo mais, é só nos chamar. Tenha um excelente dia! 😊`,
                `🙏 Muito obrigado(a) pela conversa, ${userName}! ✨\n\nFoi ótimo poder ajudar você hoje. Na LLRH, acreditamos que cada conexão pode transformar carreiras! 🚀\n\nEstamos à disposição sempre que precisar. Até logo! 🌟`,
                `💙 Que bom conversar com você, ${userName}! 🎉\n\nEsperamos ter ajudado de alguma forma. A LLRH está comprometida em conectar talentos às melhores oportunidades! 💼\n\nQualquer dúvida, estamos aqui. Tenha um ótimo dia! 😊`,
                `✨ Foi incrível falar com você, ${userName}! 🌟\n\nNa LLRH, valorizamos cada interação e estamos felizes em poder ajudar. Continue acompanhando nossas novidades! 🚀\n\nAté a próxima! 👋`
            ];

            const despedidaAleatoria = despedidas[Math.floor(Math.random() * despedidas.length)];

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    type: 'user',
                    text: option,
                },
                {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: despedidaAleatoria,
                    options: ['📱 Falar no WhatsApp'],
                    showWhatsApp: true,
                },
            ]);

            // SALVA MENSAGEM DO BOT NO BACKEND
            salvarMensagem(despedidaAleatoria, 'bot', ['📱 Falar no WhatsApp']);

            // ENCERRA CONVERSA NO BACKEND
            encerrarConversaBackend();

            fecharChatAposEncerrar();
            return;
        }

        if (option === '📱 Falar no WhatsApp') {
            const numero = getWhatsAppNumber();
            const mensagem = getWhatsAppMessage();
            window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank');

            const userMessage = {
                id: Date.now(),
                type: 'user',
                text: option,
            };
            setMessages((prev) => [...prev, userMessage]);
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        type: 'bot',
                        text: `📱 Redirecionando você para o WhatsApp...\n\nSe o chat não abrir automaticamente, clique aqui novamente.`,
                        options: ['📱 Falar no WhatsApp', '🏠 Voltar ao início', '🚪 Encerrar conversa'],
                    },
                ]);
            }, 300);
            return;
        }

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: option,
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        setTimeout(() => {
            processUserResponse(option);
        }, 500);
    };

    const toggleChat = () => {
        // Se o chat está fechando e a conversa foi encerrada, reseta
        if (!isOpen && conversationEnded) {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
            }
            resetarChat();
        }
        setIsOpen(!isOpen);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleRestart = () => {
        iniciarNovaConversa();
    };

    if (loadingConfig) {
        return null;
    }

    return (
        <>
            <button className={`chatbot-toggle ${isOpen ? 'active' : ''}`} onClick={toggleChat}>
                {isOpen ? '✕' : '💬'}
            </button>

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt="LLRH Logo"
                                    className="chatbot-avatar-img"
                                />
                            ) : (
                                <span className="chatbot-avatar">🤖</span>
                            )}
                            <div>
                                <span className="chatbot-title">Assistente LLRH</span>
                                <span className="chatbot-status">🟢 Online</span>
                            </div>
                        </div>
                        <div className="chatbot-header-actions">
                            <button className="chatbot-close" onClick={toggleChat}>
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={msg.id || index} className={`message ${msg.type}`}>
                                <div className="message-bubble">
                                    <div className="message-text">{msg.text}</div>
                                    {msg.options && (
                                        <div className="message-options">
                                            {msg.options.map((option, i) => {
                                                if (option === '📱 Falar no WhatsApp') {
                                                    return (
                                                        <button
                                                            key={i}
                                                            className="option-btn whatsapp-btn"
                                                            onClick={() => handleOptionClick(option)}
                                                        >
                                                            📱 Falar no WhatsApp
                                                        </button>
                                                    );
                                                }
                                                return (
                                                    <button
                                                        key={i}
                                                        className="option-btn"
                                                        onClick={() => handleOptionClick(option)}
                                                    >
                                                        {option}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {msg.showWhatsApp && (
                                        <div className="whatsapp-direct">
                                            <button
                                                className="whatsapp-direct-btn"
                                                onClick={() => {
                                                    const numero = getWhatsAppNumber();
                                                    const mensagem = getWhatsAppMessage();
                                                    window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank');
                                                }}
                                            >
                                                💬 Falar agora no WhatsApp
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message bot">
                                <div className="message-bubble">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Digite sua mensagem..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isTyping || conversationEnded}
                        />
                        <button onClick={handleSendMessage} disabled={isTyping || conversationEnded}>
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;