import { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In dev mode, the frontend is just a placeholder
    // The actual website is loaded by Tauri's WebView
    // This component is only shown briefly during startup
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Loading application...
        </p>
      </div>
    </div>
  );
}

export default App;
