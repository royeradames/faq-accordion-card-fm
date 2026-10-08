/* Native images keep the supplied SVG illustrations byte-for-byte. */
/* eslint-disable @next/next/no-img-element */
const faqs = [
  { question: "How many team members can I invite?", answer: "You can invite up to 2 additional users on the Free plan. There is no limit on team members for the Premium plan." },
  { question: "What is the maximum file upload size?", answer: "No more than 2GB. All files in your account must fit your allotted storage space." },
  { question: "How do I reset my password?", answer: "Click “Forgot password” from the login page or “Change password” from your profile page. A reset link will be emailed to you." },
  { question: "Can I cancel my subscription?", answer: "Yes! Send us a message and we’ll process your request no questions asked." },
  { question: "Do you provide additional support?", answer: "Chat and email support is available 24/7. Phone lines are open during normal business hours." },
];

export default function Home() {
  return (
    <>
      <main>
        <article className="faq-card" aria-labelledby="faq-title">
          <div className="art" aria-hidden="true">
            <img className="woman woman-mobile" src="/images/illustration-woman-online-mobile.svg" width={237} height={180} alt="" />
            <img className="woman woman-desktop" src="/images/illustration-woman-online-desktop.svg" width={472} height={359} alt="" />
          </div>
          <img className="box" src="/images/illustration-box-desktop.svg" width={191} height={184} alt="" aria-hidden="true" />
          <div className="faq-content">
            <h1 id="faq-title">FAQ</h1>
            <div className="accordion">
              {faqs.map((faq, index) => (
                <details key={faq.question} name="faq" open={index === 1}>
                  <summary>
                    <span>{faq.question}</span>
                    <img className="arrow" src="/images/icon-arrow-down.svg" width={10} height={7} alt="" />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </article>
      </main>
      <footer><span className="site-name">FAQ accordion card</span>. Challenge by <a href="https://www.frontendmentor.io/challenges/faq-accordion-card-XlyjD0Oam">Frontend Mentor</a>. Built by <a href="https://royeradames.com">Royer Adames</a>.</footer>
    </>
  );
}
