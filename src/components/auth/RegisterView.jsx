import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShipWheel, Mail, Lock, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabaseClient'

function RegisterView() {
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!companyName || !email || !password) {
      toast.error('Please fill in company, email and password')
      return
    }

    try {
      setLoading(true)

      // 1) Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error

      // 2) Create company with a long-lived (effectively lifetime for dev) licence
      //    This assumes your anon key has insert rights on companies (prototype mode).
      const user = data.user

      const { data: companyRows, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: companyName,
          licence_type: '5y',
          licence_expires_at: '2099-12-31T00:00:00Z',
        })
        .select()

      const company = companyRows?.[0] ?? null

      if (companyError) {
        // eslint-disable-next-line no-console
        console.error('Error creating company record:', companyError)
      }

      // 3) Link user to company as admin (for this prototype we assume anon can insert)
      if (user && company) {
        const { error: linkError } = await supabase.from('company_users').insert({
          auth_user_id: user.id,
          company_id: company.id,
          role: 'admin',
        })
        if (linkError) {
          // eslint-disable-next-line no-console
          console.error('Error linking user to company_users:', linkError)
        }
      }

      if (!data.session) {
        toast.success('Account created. Please check your email if confirmation is enabled.')
      } else {
        toast.success('Account created and signed in.')
      }

      navigate('/dashboard')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error registering account:', err)
      toast.error('Failed to register account')
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
            <h1 className="text-lg font-semibold tracking-tight">Create LogisticsLink Account</h1>
            <p className="text-xs text-muted">Register your logistics company and admin user</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Company Name</label>
            <div className="relative">
              <Building2 className="h-3.5 w-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                className="input-field pl-8"
                placeholder="Acme Logistics (Pty) Ltd"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          </div>
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
                placeholder="Strong password"
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
            {loading ? 'Registering...' : 'Register Company'}
          </button>
        </form>

        <div className="mt-4 text-[11px] text-muted flex items-center justify-between">
          <span>Already have an account?</span>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-primary hover:underline ml-2"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterView


