import { invoke } from "@tauri-apps/api/core";

interface OfflinePageProps {
  onRetry?: () => void;
}

function OfflinePage({ onRetry }: OfflinePageProps) {
  const handleRetry = async () => {
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

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Offline icon */}
      <div className="relative">
        <svg
          className="w-24 h-24 text-gray-400 dark:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M8.464 15.536a6 6 0 010-8.485M15.536 8.464a6 6 0 010 8.485M12 12h.01"
          />
        </svg>
        {/* X mark overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>

      <h1 className="mt-8 text-2xl font-bold text-gray-800 dark:text-gray-200">
        No Internet Connection
      </h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400 text-center max-w-md">
        The application requires an internet connection to load the website.
        Please check your network settings and try again.
      </p>

      <div className="mt-8 flex gap-4">
        <button
          onClick={handleRetry}
          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Retry Connection
        </button>
        <button
          onClick={handleReportIssue}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Report Issue
        </button>
      </div>

      <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
        <p>Check your network connection or contact support if the problem persists.</p>
      </div>
    </div>
  );
}

export default OfflinePage;
