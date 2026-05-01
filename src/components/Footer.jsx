import styles from './Footer.module.css';

const TECH_STACK = [
  'React 18',
  'Vite 5',
  'JavaScript (JSX)',
  'CSS Modules',
  'LocalStorage',
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <span className={styles.label}>개발일시</span>
        <span className={styles.value}>2026-05-01</span>
      </div>
      <div className={styles.center}>
        <span className={styles.label}>개발자</span>
        <span className={styles.value}>박은기</span>
        <span className={styles.sep}>·</span>
        <a className={styles.email} href="mailto:parkeungi@gmail.com">
          parkeungi@gmail.com
        </a>
      </div>
      <div className={styles.right}>
        <span className={styles.label}>기술 스택</span>
        <div className={styles.tags}>
          {TECH_STACK.map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
