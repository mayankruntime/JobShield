import "./HowItWorks.css";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "📩",
      title: "Submit the Job",
      description:
        "Paste a job description, message, job link, or suspicious offer that you want to verify.",
    },
    {
      number: "02",
      icon: "🧠",
      title: "AI Analyzes It",
      description:
        "Our NLP and machine learning system analyzes suspicious patterns, language, and scam indicators.",
    },
    {
      number: "03",
      icon: "🛡️",
      title: "Get Your Risk Score",
      description:
        "JobShield provides a risk score with clear reasons so you can decide whether the opportunity is safe.",
    },
  ];

  return (
    <section className="how-section" id="how-it-works">
      <div className="how-container">

        <div className="section-heading">
          <span className="section-badge">
            HOW IT WORKS
          </span>

          <h2>
            Check a Job Before
            <span> You Trust It.</span>
          </h2>

          <p>
            JobShield combines rule-based detection with
            AI and NLP to identify suspicious job offers
            and explain the risks behind them.
          </p>
        </div>

        <div className="steps-container">

          {steps.map((step) => (
            <div className="step-card" key={step.number}>

              <div className="step-top">
                <span className="step-number">
                  {step.number}
                </span>

                <span className="step-icon">
                  {step.icon}
                </span>
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;