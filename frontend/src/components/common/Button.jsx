import clsx from 'clsx';
import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  className,
  ...props
}) {
  return (
    <button
      className={clsx(
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        (loading || disabled) && styles.disabled,
        className,
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className={styles.icon}>{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className={styles.icon}>{icon}</span>}
        </>
      )}
    </button>
  );
}
