// Auth — polished v2.

function AuthScreen({ device = 'desktop', mode: initialMode = 'signup' }) {
  const [mode, setMode] = React.useState(initialMode);
  const [step, setStep] = React.useState(0);
  const isMobile = device === 'mobile';

  return (
    <div className="kindi-body" style={{
      width: '100%', minHeight: '100%', background: 'var(--kindi-cream)',
      display: 'flex', flexDirection: isMobile ? 'column' : 'row',
    }}>
      {/* Hero side */}
      <div style={{
        flex: isMobile ? '0 0 auto' : '1.1 1 0',
        background: 'linear-gradient(155deg, oklch(0.92 0.05 25) 0%, oklch(0.86 0.08 35) 50%, oklch(0.78 0.12 50) 100%)',
        padding: isMobile ? '24px 24px 36px' : '48px 56px',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        minHeight: isMobile ? 220 : 'auto',
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <KindiLogo size={isMobile ? 18 : 22}/>
        </div>
        <div style={{ position: 'relative', zIndex: 2, marginTop: isMobile ? 16 : 0 }}>
          <h1 className="kindi-display" style={{
            margin: 0, fontSize: isMobile ? 36 : 64, fontWeight: 600, lineHeight: 0.98,
            color: 'var(--kindi-ink)', letterSpacing: '-0.035em',
          }}>
            YouTube,<br/>but for the <span className="squig">good stuff.</span>
          </h1>
          <p style={{
            margin: '18px 0 0', fontSize: isMobile ? 14 : 17, fontWeight: 600,
            maxWidth: 420, lineHeight: 1.55, color: 'var(--kindi-ink)', opacity: 0.85,
          }}>
            You decide every video. Your kid watches without ads, autoplay rabbit holes, or recommendations they didn't ask for.
          </p>
        </div>
        {!isMobile && (
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex' }}>
              {[['var(--kindi-mint-mid)','happy'],['var(--kindi-butter-mid)','wow'],['var(--kindi-lilac-mid)','wink']].map(([c,m],i) => (
                <div key={i} style={{
                  marginLeft: i ? -10 : 0, width: 36, height: 36, borderRadius: 999,
                  border: '2px solid var(--kindi-paper)',
                  background: c, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><KindiBlob color={c} size={32} mood={m}/></div>
              ))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              12,000+ families · <Stars value={5}/> 4.9
            </div>
          </div>
        )}
        {/* Floating mascots */}
        <div style={{ position: 'absolute', top: '40%', right: -40, transform: 'rotate(15deg)', opacity: 0.85 }}>
          <KindiBlob color="var(--kindi-butter-mid)" size={isMobile ? 64 : 120} mood="wow"/>
        </div>
        <div style={{ position: 'absolute', bottom: 100, right: 90, transform: 'rotate(-12deg)', opacity: 0.85 }}>
          <KindiBlob color="var(--kindi-mint-mid)" size={isMobile ? 36 : 76} mood="wink"/>
        </div>
      </div>

      {/* Form side */}
      <div style={{
        flex: isMobile ? '1 1 auto' : '0 0 480px',
        padding: isMobile ? '32px 24px 40px' : '64px 56px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        background: 'var(--kindi-cream)',
      }}>
        <div style={{
          display: 'flex', gap: 2, padding: 4, background: 'var(--kindi-cream-3)',
          borderRadius: 10, marginBottom: 28, alignSelf: 'flex-start',
        }}>
          {['signup','signin'].map(m => (
            <button key={m} onClick={() => { setMode(m); setStep(0); }} style={{
              padding: '7px 16px', borderRadius: 8, border: 'none',
              fontSize: 13, fontWeight: 700,
              background: mode === m ? 'var(--kindi-paper)' : 'transparent',
              boxShadow: mode === m ? 'var(--shadow-xs)' : 'none',
              color: 'var(--kindi-ink)',
            }}>{m === 'signup' ? 'Sign up' : 'Sign in'}</button>
          ))}
        </div>

        <h2 className="t-h1" style={{ margin: 0 }}>
          {mode === 'signup' ? (step === 0 ? 'Create your parent account' : 'Add your first kid') : 'Welcome back'}
        </h2>
        <p style={{ margin: '8px 0 28px', fontSize: 14, color: 'var(--kindi-ink-soft)', fontWeight: 600 }}>
          {mode === 'signup' && step === 0 && 'Free to set up. No credit card needed.'}
          {mode === 'signup' && step === 1 && "We'll personalize the library by age. You can add more kids later."}
          {mode === 'signin' && 'Glad you\'re here.'}
        </p>

        {mode === 'signup' && step === 0 && (
          <div style={{ display: 'grid', gap: 14 }}>
            <Field label="Your name" placeholder="Sam Chen"/>
            <Field label="Email"     placeholder="sam@example.com" type="email"/>
            <Field label="Password"  placeholder="At least 8 characters" type="password"/>
            <Button variant="primary" size="lg" onClick={() => setStep(1)}
              style={{ marginTop: 8, justifyContent: 'center', width: '100%' }}
              iconRight={Icon.arrowR(14, '#fff')}>
              Continue
            </Button>
            <Divider/>
            <Button variant="secondary" size="lg" style={{ justifyContent: 'center', width: '100%' }}>
              <GoogleG/> Continue with Google
            </Button>
            <p style={{ margin: '14px 0 0', fontSize: 12, color: 'var(--kindi-ink-mute)', fontWeight: 600, textAlign: 'center' }}>
              By continuing you agree to the Terms & Privacy.
            </p>
          </div>
        )}

        {mode === 'signup' && step === 1 && (
          <div style={{ display: 'grid', gap: 16 }}>
            <Field label="Kid's name" placeholder="Mila"/>
            <div>
              <FieldLabel>Pick a friend</FieldLabel>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                {[
                  ['var(--kindi-coral)', 'happy', true],
                  ['var(--kindi-mint-mid)', 'wow'],
                  ['var(--kindi-butter-mid)', 'wink'],
                  ['var(--kindi-sky-mid)', 'sleepy'],
                  ['var(--kindi-lilac-mid)', 'happy'],
                ].map(([c, m, sel], i) => (
                  <button key={i} style={{
                    width: 56, height: 56, borderRadius: 999,
                    background: c, border: 'none',
                    boxShadow: sel ? `0 0 0 3px var(--kindi-cream), 0 0 0 5px var(--kindi-coral-deep)` : 'var(--shadow-xs)',
                    padding: 0,
                  }}>
                    <KindiBlob color={c} size={56} mood={m}/>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel>Age</FieldLabel>
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {[3,4,5,6,7,8,9,10,11,12].map(a => (
                  <Chip key={a} active={a === 7}>{a}</Chip>
                ))}
              </div>
            </div>
            <Button variant="primary" size="lg" style={{ marginTop: 8, justifyContent: 'center', width: '100%' }}
              icon={Icon.check(14, '#fff')}>
              Create profile
            </Button>
          </div>
        )}

        {mode === 'signin' && (
          <div style={{ display: 'grid', gap: 14 }}>
            <Field label="Email"    placeholder="sam@example.com" type="email"/>
            <Field label="Password" placeholder="••••••••••" type="password" trailing={<a style={{ fontSize: 12, fontWeight: 700, color: 'var(--kindi-primary)', textDecoration: 'none' }}>Forgot?</a>}/>
            <Button variant="primary" size="lg" style={{ marginTop: 8, justifyContent: 'center', width: '100%' }}>
              Sign in
            </Button>
            <Divider/>
            <Button variant="secondary" size="lg" style={{ justifyContent: 'center', width: '100%' }}>
              <GoogleG/> Continue with Google
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.79 2.72v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.62Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.95 10.7a5.4 5.4 0 0 1 0-3.42V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l2.99-2.34Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58A8.95 8.95 0 0 0 9 0 9 9 0 0 0 .96 4.96l2.99 2.32C4.66 5.17 6.65 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

function FieldLabel({ children }) {
  return <label className="t-label" style={{ display: 'block', marginBottom: 6 }}>{children}</label>;
}

function Field({ label, placeholder, type = 'text', trailing }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <FieldLabel>{label}</FieldLabel>
        {trailing}
      </div>
      <input type={type} placeholder={placeholder} style={{
        padding: '12px 14px', borderRadius: 11,
        border: '1px solid var(--kindi-line-2)',
        background: 'var(--kindi-paper)',
        fontSize: 14, fontWeight: 600,
        color: 'var(--kindi-ink)', outline: 'none', width: '100%',
        boxShadow: 'var(--shadow-xs)',
      }}/>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--kindi-line)' }}/>
      <span className="t-label">or</span>
      <div style={{ flex: 1, height: 1, background: 'var(--kindi-line)' }}/>
    </div>
  );
}

Object.assign(window, { AuthScreen });
