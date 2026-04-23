const featureItems = [
  'Built for restaurants of all sizes',
  'Hotel & hospitality ready',
  'Works anywhere, on any device',
] as const;

const reservationHighlights = [
  'Real-time availability',
  'Simple booking management',
  'Clean interface',
] as const;

const workflowSteps = [
  {
    index: 1,
    title: 'Select Table',
    detail: 'Browse available tables and pick the perfect one.',
  },
  {
    index: 2,
    title: 'Choose Booking Type',
    detail: 'Select from guest, logged in, staff, or premium booking.',
  },
  {
    index: 3,
    title: 'Confirm',
    detail: "Review details and confirm — it's that simple.",
  },
] as const;

export const MarketingContent = () => (
  <>
    <header className="hero">
      <h1>Smart Table Reservation Software for Modern Restaurants</h1>
      <p className="subtitle">
        Manage bookings, optimize tables, and deliver better dining experiences — all in one
        platform.
      </p>
      <div className="badges">
        {featureItems.map((feature) => (
          <span key={feature} className="badge">
            {feature}
          </span>
        ))}
      </div>
      <a className="button" href="/reservations">
        Start a Reservation
      </a>
    </header>

    <section className="section">
      <h2>Take Control of Your Reservations</h2>
      <p className="subtitle">Manage bookings from one simple dashboard.</p>
      <div className="badges">
        {reservationHighlights.map((item) => (
          <span key={item} className="badge">
            {item}
          </span>
        ))}
      </div>
    </section>

    <section className="section">
      <h2>How It Works</h2>
      <p className="subtitle">Three simple steps to manage every reservation.</p>
      <div className="grid grid-3">
        {workflowSteps.map((step) => (
          <article key={step.index} className="step">
            <div className="step-index">{step.index}</div>
            <h3>{step.title}</h3>
            <p>{step.detail}</p>
          </article>
        ))}
      </div>
    </section>
  </>
);
