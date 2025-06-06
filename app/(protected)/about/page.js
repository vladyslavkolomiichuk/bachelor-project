import styles from "./about.module.css";

export default function AboutLanding() {
  return (
    <main className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>NōtBook</span>
          <div>
            <h1 className={styles.title}>
              A web application for organizing <br />
              <span className={styles.accent}>reading sessions</span> and book
              note-taking
            </h1>
            <p className={styles.subtitle}>
              A convenient tool for managing reading, notes, tracking progress,
              and systematizing knowledge.
            </p>
            <a href="/contact" className={styles.ctaBtn}>
              Contact Us
            </a>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.stats}>
            <div>
              <span className={styles.statNum}>2025</span>
              <span className={styles.statLabel}>Year of Development</span>
            </div>
            <div>
              <span className={styles.statNum}>React/Next.js</span>
              <span className={styles.statLabel}>Technologies</span>
            </div>
            <div>
              <span className={styles.statNum}>PostgreSQL</span>
              <span className={styles.statLabel}>Database</span>
            </div>
          </div>
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.heading}>Project Goal</h2>
        <p className={styles.text}>
          The goal of this project is to develop a web application for
          organizing reading sessions and taking book notes. It provides users
          with a convenient tool for managing the processing of various texts
          and recording notes. Additionally, it allows tracking reading
          progress. The application aims to motivate users to engage with books
          and simplify the systematization of knowledge gained while reading.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Objectives</h2>
        <ul className={styles.list}>
          <li>
            Research the subject area and determine the relevance of the study
          </li>
          <li>
            Analyze similar web applications, identify their strengths and
            weaknesses
          </li>
          <li>
            Formulate the purpose and objectives of the study, choose
            implementation tools
          </li>
          <li>Perform structural-functional modeling</li>
          <li>
            Develop the web application for organizing reading sessions and
            taking notes
          </li>
          <li>Conduct testing of the created software product</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Key Features</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <h3>Intuitive Interface</h3>
            <p>User-friendly interaction with the application</p>
          </div>
          <div className={styles.feature}>
            <h3>Book Search & Adding</h3>
            <p>Integration with Google Books API for ISBN-based search</p>
          </div>
          <div className={styles.feature}>
            <h3>Progress Tracking</h3>
            <p>Categories, goals, actual reading progress</p>
          </div>
          <div className={styles.feature}>
            <h3>Notes & Templates</h3>
            <p>Note-taking with templates, personal dictionary</p>
          </div>
          <div className={styles.feature}>
            <h3>AI Suggestions</h3>
            <p>Personalized tips for more effective reading</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Technologies</h2>
        <div className={styles.techGrid}>
          <div>React</div>
          <div>Next.js</div>
          <div>PostgreSQL</div>
          <div>Google Books API</div>
          <div>Figma</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Who Is This App For?</h2>
        <ul className={styles.list}>
          <li>
            Students and teachers working with large volumes of literature
          </li>
          <li>Those who want to organize their reading and note-taking</li>
          <li>
            Anyone seeking to systematize knowledge and improve learning
            efficiency
          </li>
        </ul>
      </section>

      <footer className={styles.footer}>
        <span>© 2025 BookNote. Developed for a bachelor’s thesis project.</span>
      </footer>
    </main>
  );
}
