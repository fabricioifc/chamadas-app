import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { supabase } from './helper/supabase'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './hooks/Auth'
import RootLayout from './components/RootLayout'
import { Routes, Route } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import { CustomProvider } from 'rsuite'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminPage from './pages/AdminPage'
import ClassePage from './pages/classe/ClassePage'
import ClasseEditPage from './pages/classe/ClasseEditPage'
import PageNotFound from './pages/PageNotFound'
import ChamadaPage from './pages/chamada/ChamadaPage'
import ChamadaEditPage from './pages/chamada/ChamadaEditPage'

import ptBR from 'rsuite/locales/pt_BR';
import { IntlProvider } from 'react-intl'

const loginWithGitHub = async () => {
  const { user, session, error } = await supabase.auth.signInWithOAuth({
    provider: 'github'
  })

  if (error) throw error
  console.log(user, session)
  
}

const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setUser(session?.user ?? null)
    })

    // supabase.auth.onAuthStateChange((event, session) => {
    //   setUser(session?.user ?? null)
    // })

  }, [])

  return (

    <IntlProvider locale="pt-BR">
      <CustomProvider theme="dark" locale={ptBR}>
        <BrowserRouter>
        <AuthProvider>
          <RootLayout>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
              } />
              <Route 
                path="/classes" 
                element={
                  <ProtectedRoute>
                    <ClassePage />
                  </ProtectedRoute>
              } />
              <Route 
                path="/classes/new" 
                element={
                  <ProtectedRoute>
                    <ClasseEditPage />
                  </ProtectedRoute>
              } />
              <Route 
                path="/classes/:id/edit" 
                element={
                  <ProtectedRoute>
                    <ClasseEditPage />
                  </ProtectedRoute>
              } />

              <Route 
                path="/chamadas" 
                element={
                  <ProtectedRoute>
                    <ChamadaPage />
                  </ProtectedRoute>
              } />
              <Route 
                path="/chamadas/new" 
                element={
                  <ProtectedRoute>
                    <ChamadaEditPage />
                  </ProtectedRoute>
              } />
              <Route 
                path="/chamadas/:id/edit" 
                element={
                  <ProtectedRoute>
                    <ChamadaEditPage />
                  </ProtectedRoute>
              } />

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </RootLayout>
        </AuthProvider>
      </BrowserRouter>
      </CustomProvider>
    </IntlProvider>
  )
}

export default App
