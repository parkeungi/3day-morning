import { useTheme } from '../store/ThemeContext.jsx';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.wrap} role="group" aria-label="테마 전환">
      <button
        type="button"
        className={`${styles.opt} ${theme === 'light' ? styles.active : ''}`}
        onClick={() => setTheme('light')}
        aria-pressed={theme === 'light'}
        title="라이트 모드"
      >
        ☀ Light
      </button>
      <button
        type="button"
        className={`${styles.opt} ${theme === 'dark' ? styles.active : ''}`}
        onClick={() => setTheme('dark')}
        aria-pressed={theme === 'dark'}
        title="다크 모드"
      >
        ☾ Dark
      </button>
    </div>
  );
}
