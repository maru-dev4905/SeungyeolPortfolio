import { useLegacyPage } from "../hooks/useLegacyPage";

export function ContactPage() {
  useLegacyPage("LeeSeungyeol - CONTACT", "sub");

  return (
    <main id="contact">
      <section className="sec_visual">
        <div className="inner">
          <h2 className="fade anim">
            LET&apos;S BUILD <br />
            SOMETHING CLEAR <br />
            AND BEAUTIFUL
          </h2>
        </div>
      </section>

      <section className="sec_contact">
        <div className="inner">
          <form
            action="mailto:iseung10e@gmail.com"
            method="post"
            encType="text/plain"
          >
            <div className="col">
              <p>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                />
              </p>
              <p>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
              </p>
            </div>

            <div className="col">
              <p>
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Project subject"
                />
              </p>
            </div>

            <div className="col">
              <p>
                <label htmlFor="message">Message</label>
              </p>
              <textarea
                id="message"
                name="message"
                placeholder="Tell me about your project."
                rows={8}
                required
              />
            </div>

            <button type="submit" className="target">
              SEND MESSAGE
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
