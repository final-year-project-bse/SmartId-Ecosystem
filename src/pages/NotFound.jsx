import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, LogIn } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const NotFound = () => {
  const user = useAppStore((state) => state.user);
  const isLoggedIn = user && user.email;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <p className="text-2xl text-slate-600 dark:text-slate-400 mt-4 mb-8">Page not found</p>
      <div className="flex gap-4">
        {isLoggedIn ? (
          <Link to="/dashboard">
            <Button className="flex items-center gap-2">
              <Home size={20} />
              Back to Dashboard
            </Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button className="flex items-center gap-2">
              <LogIn size={20} />
              Go to Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NotFound;
