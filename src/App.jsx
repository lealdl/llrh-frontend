import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Sobre from './components/Sobre'
import Historia from './components/Historia'
import Servicos from './components/Servicos'
import Vagas from './components/Vagas'
import Contato from './components/Contato'
import Footer from './components/Footer'
import AdminDashboard from './components/Admin'
import Login from './components/Login'
import DevLogin from './components/DevLogin'
import Chatbot from './components/Chatbot'
import './css/global.css'

function App() {
  const [mostrarBotaoTopo, setMostrarBotaoTopo] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isDevAuthenticated, setIsDevAuthenticated] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)

  // ========== VERIFICAR TOKEN AO INICIAR ==========
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    const devToken = localStorage.getItem('devToken')
    const devUser = localStorage.getItem('devUser')

    console.log('🔍 Token admin:', token)
    console.log('🔍 Dev token:', devToken)

    if (token && user) {
      setIsAuthenticated(true)
    }
    if (devToken && devUser) {
      setIsDevAuthenticated(true)
    }
    setLoadingAuth(false)
  }, [])

  // ========== OUVIR MUDANÇAS NO TOKEN ==========
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      console.log('🔄 Storage alterado, token:', token)
      if (token && user) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    }

    // Escuta mudanças no localStorage (de outras abas)
    window.addEventListener('storage', handleStorageChange)

    // Também verifica periodicamente (para mudanças na mesma aba)
    const interval = setInterval(() => {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      if (token && user && !isAuthenticated) {
        console.log('🔄 Token detectado via intervalo')
        setIsAuthenticated(true)
      }
    }, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [isAuthenticated])

  // ========== SCROLL ==========
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setMostrarBotaoTopo(true)
      else setMostrarBotaoTopo(false)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLoginSuccess = () => {
    console.log('✅ Login bem-sucedido, token:', localStorage.getItem('token'))
    setIsAuthenticated(true)
  }

  const handleDevLoginSuccess = () => {
    console.log('✅ Login dev bem-sucedido')
    setIsDevAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    window.location.href = '/'
  }

  const handleDevLogout = () => {
    localStorage.removeItem('devToken')
    localStorage.removeItem('devUser')
    setIsDevAuthenticated(false)
    window.location.href = '/'
  }

  const params = new URLSearchParams(window.location.search)
  const isAdminRoute = params.get('admin') === 'true'
  const isDevRoute = params.get('dev') === 'true'

  console.log('🔍 isDevRoute:', isDevRoute)
  console.log('🔍 isDevAuthenticated:', isDevAuthenticated)

  if (loadingAuth) {
    return <div className="app">Carregando...</div>
  }

  // Rota do Desenvolvedor - exige login dev
  if (isDevRoute) {
    if (!isDevAuthenticated) {
      console.log('🔐 Mostrando tela de login dev')
      return <DevLogin onLoginSuccess={handleDevLoginSuccess} />
    }

    console.log('👨‍💻 Mostrando painel dev')

    return (
      <div className="app">
        <Header onLogout={handleDevLogout} isDev={true} />
        <main style={{ paddingTop: '80px' }}>
          <AdminDashboard />
        </main>
        {mostrarBotaoTopo && (
          <button className="btn-topo" onClick={scrollToTop}>↑</button>
        )}
      </div>
    )
  }

  // Tela de login admin (se tentar acessar admin sem estar logado)
  if (isAdminRoute && !isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  // Dashboard admin (se estiver autenticado e na rota admin)
  if (isAdminRoute && isAuthenticated) {
    return (
      <div className="app">
        <Header onLogout={handleLogout} />
        <main style={{ paddingTop: '80px' }}>
          <AdminDashboard />
        </main>
        {mostrarBotaoTopo && (
          <button className="btn-topo" onClick={scrollToTop}>↑</button>
        )}
      </div>
    )
  }

  // Site público (rota normal) - COM CHATBOT
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Sobre />
        <Historia />
        <Servicos />
        <Vagas />
        <Contato />
      </main>
      <Footer />
      {mostrarBotaoTopo && (
        <button className="btn-topo" onClick={scrollToTop}>↑</button>
      )}

      <Chatbot />
    </div>
  )
}

export default App