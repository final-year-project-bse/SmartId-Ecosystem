export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100',
    success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
    danger: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100',
    primary: 'bg-primary-100 text-primary-700',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
