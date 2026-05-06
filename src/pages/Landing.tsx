import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-margin-mobile pt-xl pb-lg text-center">
        {/* Logo mark */}
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-lg shadow-lg">
          <span className="material-symbols-outlined text-on-primary text-[40px]">directions_car</span>
        </div>

        <h1 className="font-display text-display text-on-surface mb-sm">RideShare</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-xs">
          Campus rides, made easy.
        </p>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
          Connect with fellow students for safe, affordable rides to and from campus.
        </p>

        {/* Feature chips */}
        <div className="flex flex-wrap justify-center gap-sm mt-lg mb-xl">
          {[
            { icon: 'verified_user', label: 'Verified Students' },
            { icon: 'savings', label: 'Split Costs' },
            { icon: 'groups', label: 'Peer Network' },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-xs bg-surface-container-low px-md py-xs rounded-full border border-outline-variant"
            >
              <span className="material-symbols-outlined text-primary text-[16px]">{f.icon}</span>
              <span className="font-label-sm text-label-sm text-on-surface">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="px-margin-mobile pb-lg">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-lg mb-lg">
          <h2 className="font-h2 text-h2 text-on-surface mb-md text-center">How it works</h2>
          <div className="space-y-md">
            {[
              { icon: 'search', title: 'Find a Ride', desc: 'Search rides by source, destination & date' },
              { icon: 'add_circle', title: 'Post a Ride', desc: 'Offer seats in your car to fellow students' },
              { icon: 'handshake', title: 'Connect & Go', desc: 'Driver confirms your request — you\'re all set!' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-md">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">{step.icon}</span>
                </div>
                <div>
                  <p className="font-body-lg text-body-lg text-on-surface font-semibold">{step.title}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-md">
          <button
            onClick={() => navigate('/signup')}
            className="w-full bg-primary text-on-primary py-md px-lg rounded-lg font-h2 flex items-center justify-center gap-md active:scale-[0.98] transition-transform shadow-md"
          >
            <span className="material-symbols-outlined">person_add</span>
            Get Started — Sign Up Free
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-surface-container-highest text-on-surface py-md px-lg rounded-lg font-body-lg flex items-center justify-center gap-md border border-outline-variant active:scale-[0.98] transition-transform"
          >
            Already have an account? Log In
          </button>
        </div>
      </div>
    </div>
  )
}
