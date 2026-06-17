function LoadingScreen() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="relative">
        {/* Spinning loader */}
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary-500 rounded-full animate-spin"></div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Loading
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Please wait while the application starts...
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-8 w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-primary-500 animate-pulse" style={{ width: "60%" }}></div>
      </div>
    </div>
  );
}

export default LoadingScreen;
