import styles from './Section.module.css';

export default function Section({ title, hint, right, children }) {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.bullet}>▸</span> {title}
        </h3>
        {right && <div className={styles.right}>{right}</div>}
      </header>
      {hint && <p className={styles.hint}>{hint}</p>}
      <div className={styles.body}>{children}</div>
    </section>
  );
}
