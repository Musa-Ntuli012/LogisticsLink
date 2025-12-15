import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShipWheel, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabaseClient'

function LoginView() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      toast.success('Signed in successfully')
      navigate('/dashboard')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error signing in:', error)
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-background to-slate-900 text-slate-100 px-4">
      <div className="w-full max-w-md glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center">
            <ShipWheel className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">LogisticsLink</h1>
            <p className="text-xs text-muted">Sign in to your logistics command center</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Email</label>
            <div className="relative">
              <Mail className="h-3.5 w-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                className="input-field pl-8"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Password</label>
            <div className="relative">
              <Lock className="h-3.5 w-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                className="input-field pl-8"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-[11px] text-muted flex items-center justify-between">
          <span>For development, use the test account you configured in Supabase.</span>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-primary hover:underline ml-2"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginView


