import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg">
            <AlertCircle className="w-16 h-16 text-red-400" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-white mb-2">404</h1>
        <p className="text-xl text-slate-300 mb-2">Page Not Found</p>
        <p className="text-slate-400 mb-6">
          The page you're looking for doesn't exist. The path{" "}
          <code className="bg-slate-800 px-2 py-1 rounded text-cyan-400 text-sm">
            {location.pathname}
          </code>{" "}
          could not be found.
        </p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
