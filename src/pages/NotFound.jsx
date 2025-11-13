import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <p className="text-2xl text-slate-600 dark:text-slate-400 mt-4 mb-8">Page not found</p>
      <Link to="/">
        <Button className="flex items-center gap-2">
          <Home size={20} />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
