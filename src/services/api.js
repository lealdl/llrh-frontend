const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api-llrh';
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL || 'http://localhost/api-llrh';

console.log('🌐 API URL:', API_URL);
console.log('🖼️ IMAGE BASE URL:', IMAGE_BASE_URL);

const normalizeImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    if (url.startsWith('/')) {
        return `${IMAGE_BASE_URL}${url}`;
    }
    return `${IMAGE_BASE_URL}/${url}`;
};

// ========== GERENCIAMENTO DE TOKEN ==========
const getToken = () => localStorage.getItem('token');

const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// ========== CONFIGURAÇÕES ==========
export const getConfiguracoes = async () => {
    try {
        const timestamp = Date.now();
        const response = await fetch(`${API_URL}/configuracoes?t=${timestamp}`);
        const data = await response.json();

        if (data.success && data.data) {
            if (data.data.logo_url) data.data.logo_url = normalizeImageUrl(data.data.logo_url);
            if (data.data.logo_hero_url) data.data.logo_hero_url = normalizeImageUrl(data.data.logo_hero_url);
            if (data.data.favicon_url) data.data.favicon_url = normalizeImageUrl(data.data.favicon_url);
            if (data.data.historia_imagem) data.data.historia_imagem = normalizeImageUrl(data.data.historia_imagem);
            if (data.data.contato_imagem) data.data.contato_imagem = normalizeImageUrl(data.data.contato_imagem);
            return data;
        }

        if (data.id) {
            if (data.logo_url) data.logo_url = normalizeImageUrl(data.logo_url);
            if (data.logo_hero_url) data.logo_hero_url = normalizeImageUrl(data.logo_hero_url);
            if (data.favicon_url) data.favicon_url = normalizeImageUrl(data.favicon_url);
            if (data.historia_imagem) data.historia_imagem = normalizeImageUrl(data.historia_imagem);
            if (data.contato_imagem) data.contato_imagem = normalizeImageUrl(data.contato_imagem);
            return { success: true, data: data };
        }

        return { success: false, data: null };
    } catch (error) {
        console.error('Erro:', error);
        return { success: false, data: null };
    }
};

export const updateConfiguracoes = async (config) => {
    try {
        const token = getToken();
        if (!token) {
            return { success: false, message: 'Usuário não autenticado', status: 401 };
        }

        const response = await fetch(`${API_URL}/configuracoes`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(config)
        });

        if (response.status === 401) {
            return { success: false, message: 'Token inválido ou expirado', status: 401 };
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return { success: false, message: 'Erro de conexão' };
    }
};

// ========== LOGO ==========
export const getLogo = async () => {
    try {
        const response = await getConfiguracoes();
        if (response.success && response.data && response.data.logo_url) {
            return { success: true, url: `${response.data.logo_url}?t=${Date.now()}` };
        }
        return { success: false, url: null };
    } catch (error) {
        console.error('Erro:', error);
        return { success: false, url: null };
    }
};

// ========== SERVIÇOS ==========
export const getServicos = async () => {
    try {
        const timestamp = Date.now();
        const response = await fetch(`${API_URL}/servicos?t=${timestamp}`);
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
            return data.data;
        }

        if (Array.isArray(data)) {
            return data;
        }

        return [];
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        return [];
    }
};

export const getAdminServicos = async () => {
    try {
        const token = getToken();
        if (!token) {
            return { success: false, data: [], status: 401 };
        }

        const timestamp = Date.now();
        const response = await fetch(`${API_URL}/admin/servicos?t=${timestamp}`, {
            headers: getAuthHeaders()
        });

        if (response.status === 401) {
            return { success: false, data: [], status: 401 };
        }

        const data = await response.json();
        console.log('getAdminServicos resposta:', data);
        return data;
    } catch (error) {
        console.error('Erro:', error);
        return { success: false, data: [] };
    }
};

export const createServico = async (servico) => {
    try {
        const token = getToken();
        if (!token) {
            return { success: false, message: 'Usuário não autenticado', status: 401 };
        }

        const response = await fetch(`${API_URL}/admin/servicos`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(servico)
        });

        if (response.status === 401) {
            return { success: false, message: 'Token inválido ou expirado', status: 401 };
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return { success: false };
    }
};

export const updateServico = async (id, servico) => {
    try {
        const token = getToken();
        if (!token) {
            return { success: false, message: 'Usuário não autenticado', status: 401 };
        }

        const response = await fetch(`${API_URL}/admin/servicos/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(servico)
        });

        if (response.status === 401) {
            return { success: false, message: 'Token inválido ou expirado', status: 401 };
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return { success: false };
    }
};

export const deleteServico = async (id) => {
    try {
        const token = getToken();
        if (!token) {
            return { success: false, message: 'Usuário não autenticado', status: 401 };
        }

        const response = await fetch(`${API_URL}/admin/servicos/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.status === 401) {
            return { success: false, message: 'Token inválido ou expirado', status: 401 };
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return { success: false };
    }
};

// ========== LOGIN ==========
export const login = async (email, senha) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });
        const data = await response.json();

        if (data.success && data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    } catch (error) {
        console.error('Erro:', error);
        return { success: false, message: 'Erro de conexão' };
    }
};

// ========== CONTATO ==========
export const enviarContato = async (dados) => {
    try {
        const response = await fetch(`${API_URL}/contato`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return { success: false, message: 'Erro de conexión' };
    }
};

// ========== VAGAS ==========
export const getVagas = async () => {
    try {
        const timestamp = Date.now();
        const response = await fetch(`${API_URL}/vagas?t=${timestamp}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        return { success: false, data: [] };
    }
};

export const getAdminVagas = async () => {
    try {
        const token = getToken();
        if (!token) {
            return { success: false, data: [], status: 401 };
        }

        const timestamp = Date.now();
        const response = await fetch(`${API_URL}/admin/vagas?t=${timestamp}`, {
            headers: getAuthHeaders()
        });

        if (response.status === 401) {
            return { success: false, data: [], status: 401 };
        }

        const data = await response.json();
        console.log('getAdminVagas resposta:', data);
        return data;
    } catch (error) {
        console.error('Erro:', error);
        return { success: false, data: [] };
    }
};

export const createVaga = async (vaga) => {
    try {
        const token = getToken();
        if (!token) {
            return { success: false, message: 'Usuário não autenticado', status: 401 };
        }

        const response = await fetch(`${API_URL}/admin/vagas`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(vaga)
        });

        if (response.status === 401) {
            return { success: false, message: 'Token inválido ou expirado', status: 401 };
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return { success: false };
    }
};

export const updateVaga = async (id, vaga) => {
    try {
        const token = getToken();
        if (!token) {
            return { success: false, message: 'Usuário não autenticado', status: 401 };
        }

        const response = await fetch(`${API_URL}/admin/vagas/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(vaga)
        });

        if (response.status === 401) {
            return { success: false, message: 'Token inválido ou expirado', status: 401 };
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return { success: false };
    }
};

export const deleteVaga = async (id) => {
    try {
        const token = getToken();
        if (!token) {
            return { success: false, message: 'Usuário não autenticado', status: 401 };
        }

        const response = await fetch(`${API_URL}/admin/vagas/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.status === 401) {
            return { success: false, message: 'Token inválido ou expirado', status: 401 };
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return { success: false };
    }
};

// ========== EXPORTAÇÕES ==========
export default {
    getServicos,
    getConfiguracoes,
    updateConfiguracoes,
    getLogo,
    getAdminServicos,
    createServico,
    updateServico,
    deleteServico,
    login,
    enviarContato,
    getVagas,
    getAdminVagas,
    createVaga,
    updateVaga,
    deleteVaga
};