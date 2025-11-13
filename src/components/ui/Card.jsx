export const Card = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 ${className}`}>
      {title && <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">{title}</h3>}
      {children}
    </div>
  );
};
