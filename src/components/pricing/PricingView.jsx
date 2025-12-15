import { BadgeDollarSign, CheckCircle2, Truck, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../lib/AuthContext.jsx'

function PricingView() {
  const { company, role } = useAuth()

  const handleAdminLicenceUpdate = async (period, amount) => {
    if (!company?.id) return

    try {
      const now = new Date()
      const validFrom = now.toISOString()
      const years = period === '1y' ? 1 : period === '2y' ? 2 : 5
      const validUntilDate = new Date(now)
      validUntilDate.setFullYear(validUntilDate.getFullYear() + years)
      const validUntil = validUntilDate.toISOString()

      // Update company licence
      const { error: companyError } = await supabase
        .from('companies')
        .update({
          licence_type: period,
          licence_expires_at: validUntil,
        })
        .eq('id', company.id)

      if (companyError) throw companyError

      // Optional: record billing event for internal tracking
      const { error: billingError } = await supabase
        .from('billing_events')
        .insert({
          company_id: company.id,
          period,
          amount,
          currency: 'ZAR',
          valid_from: validFrom,
          valid_until: validUntil,
        })

      if (billingError) {
        // eslint-disable-next-line no-console
        console.error('Error recording billing event:', billingError)
      }

      toast.success('Licence updated. Reload to see new expiry.')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating licence:', error)
      toast.error('Failed to update licence')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Licensing & Pricing
          </h1>
          <p className="text-xs md:text-sm text-muted mt-1">
            Simple per-company licences for South African logistics businesses and fleets with predictable costs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1-year licence */}
        <div className="glass-panel p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                Standard
              </div>
              <h2 className="text-lg font-semibold mt-1">1-Year Licence</h2>
            </div>
            <BadgeDollarSign className="h-6 w-6 text-primary" />
          </div>
          <div className="mt-2 mb-4">
            <div className="text-3xl font-bold">
              R 12,000
              <span className="text-xs text-muted font-normal ml-1">per company / year</span>
            </div>
          </div>
          <ul className="space-y-1 text-xs text-muted flex-1">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-success" />
              Up to ~30 trucks per company
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-success" />
              Fleet overview, routes, suppliers, CSV export
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-success" />
              Email support & updates included
            </li>
          </ul>
          <button className="btn-primary mt-4 w-full">
            Choose 1-Year
          </button>
        </div>

        {/* 2-year licence */}
        <div className="glass-panel p-5 flex flex-col border-primary/40">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
                Most Popular
              </div>
              <h2 className="text-lg font-semibold mt-1">2-Year Licence</h2>
            </div>
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <div className="mt-2 mb-1">
            <div className="text-3xl font-bold">
              R 20,000
              <span className="text-xs text-muted font-normal ml-1">per company / 2 years</span>
            </div>
          </div>
          <div className="text-[11px] text-success mb-3">
            Save ±R 4,000 vs two separate 1-year licences.
          </div>
          <ul className="space-y-1 text-xs text-muted flex-1">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-success" />
              All Standard features for 24 months
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-success" />
              Priority onboarding & support
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-success" />
              Price locked for the full term
            </li>
          </ul>
          <button className="btn-primary mt-4 w-full">
            Choose 2-Year
          </button>
        </div>

        {/* 5-year licence */}
        <div className="glass-panel p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-sky-400">
                Long-Term
              </div>
              <h2 className="text-lg font-semibold mt-1">5-Year Licence</h2>
            </div>
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div className="mt-2 mb-1">
            <div className="text-3xl font-bold">
              R 40,000
              <span className="text-xs text-muted font-normal ml-1">per company / 5 years</span>
            </div>
          </div>
          <div className="text-[11px] text-success mb-3">
            Save ±R 20,000 vs five separate 1-year licences.
          </div>
          <ul className="space-y-1 text-xs text-muted flex-1">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-success" />
              Best for strategic partners and large fleets
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-success" />
              Long-term price protection
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-success" />
              Access to all future app improvements
            </li>
          </ul>
          <button className="btn-primary mt-4 w-full">
            Choose 5-Year
          </button>
        </div>
      </div>

      {/* Implementation / customisation fee */}
      <div className="glass-panel p-5">
        <h2 className="text-sm font-semibold tracking-tight mb-2">
          Implementation & Company Customisation
        </h2>
        <p className="text-xs text-muted mb-3">
          For most South African fleets, we recommend a once-off implementation fee that covers
          branding, configuration and guided onboarding.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-4 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BadgeDollarSign className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium">Standard Implementation</div>
                <div className="text-muted">
                  R 15,000 once-off per company
                </div>
              </div>
            </div>
            <ul className="list-disc list-inside text-muted space-y-1 ml-1">
              <li>Branding with your logo and colours</li>
              <li>Initial configuration for your depots, routes and suppliers</li>
              <li>Assistance with first data import (CSV)</li>
              <li>Training session for your dispatch / operations team</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1">
            <div className="text-[11px] uppercase tracking-wide text-muted font-semibold">
              Need more customisation?
            </div>
            <p className="text-xs text-muted">
              For complex integrations (ERP, TMS, telematics) or advanced reporting we quote
              separately, typically from <span className="font-semibold text-slate-100">R 35,000+</span>{' '}
              depending on scope.
            </p>
          </div>
        </div>
      </div>

      {/* Admin-only licence & billing controls */}
      {role === 'admin' && company && (
        <div className="glass-panel p-5 space-y-3">
          <h2 className="text-sm font-semibold tracking-tight">
            Licence & Billing Admin
          </h2>
          <p className="text-xs text-muted">
            As an admin for <span className="font-semibold text-slate-100">{company.name}</span>, you
            can update your licence period and record a payment. This will extend your
            <span className="font-semibold"> licence_expires_at</span> in Supabase.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleAdminLicenceUpdate('1y', 12000)}
              className="px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800/60 flex flex-col items-start gap-1"
            >
              <span className="font-semibold">Record 1-Year Payment</span>
              <span className="text-muted">R 12,000 • Extends by 1 year</span>
            </button>
            <button
              type="button"
              onClick={() => handleAdminLicenceUpdate('2y', 20000)}
              className="px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800/60 flex flex-col items-start gap-1"
            >
              <span className="font-semibold">Record 2-Year Payment</span>
              <span className="text-muted">R 20,000 • Extends by 2 years</span>
            </button>
            <button
              type="button"
              onClick={() => handleAdminLicenceUpdate('5y', 40000)}
              className="px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800/60 flex flex-col items-start gap-1"
            >
              <span className="font-semibold">Record 5-Year Payment</span>
              <span className="text-muted">R 40,000 • Extends by 5 years</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PricingView


