import { invoke } from "@tauri-apps/api/core";

interface ErrorPageProps {
  message?: string;
  onRetry?: () => void;
}

function ErrorPage({ message = "An unexpected error occurred", onRetry }: ErrorPageProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      // Reload the page
      window.location.reload();
    }
  };

  const handleReportIssue = async () => {
    try {
      await invoke("open_external", { url: "https://github.com/your-repo/issues" });
    } catch (err) {
      console.error("Failed to open external URL:", err);
    }
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Error icon */}
      <div className="relative">
        <svg
          className="w-24 h-24 text-red-500 dark:text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h1 className="mt-8 text-2xl font-bold text-gray-800 dark:text-gray-200">
        Something Went Wrong
      </h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400 text-center max-w-md">
        {message}
      </p>

      {/* Error details (if in dev mode) */}
      {import.meta.env.DEV && message && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg max-w-lg">
          <p className="text-sm text-red-800 dark:text-red-200 font-mono break-all">
            {message}
          </p>
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <button
          onClick={handleRetry}
          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Try Again
        </button>
        <button
          onClick={handleGoHome}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Go Home
        </button>
        <button
          onClick={handleReportIssue}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Report Issue
        </button>
      </div>

      <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
        <p>If the problem persists, please report it to the development team.</p>
      </div>
    </div>
  );
}

export default ErrorPage;
