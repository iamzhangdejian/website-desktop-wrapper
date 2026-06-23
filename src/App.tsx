import { useState, useEffect } from "react";
import SettingsPage from "./components/SettingsPage";
import LoadingScreen from "./components/LoadingScreen";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const settings = await invoke<any>("get_settings");
        setTargetUrl(settings?.website_url || "https://work.sritcloud.com:3100/oa-office/#/pages/login/index");
      } catch {
        setTargetUrl("https://work.sritcloud.com:3100/oa-office/#/pages/login/index");
      }
      setLoading(false);
    };
    init();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ",") {
        e.preventDefault();
        setShowSettings((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Listen for DOM custom event from Rust menu via eval
    const handleOpenSettings = () => {
      console.log("[App] tauri-open-settings DOM event received");
      setShowSettings(true);
    };
    window.addEventListener("tauri-open-settings", handleOpenSettings);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("tauri-open-settings", handleOpenSettings);
    };
  }, []);

  if (loading) return <LoadingScreen />;

  const reloadUrl = async () => {
    try {
      const settings = await invoke<any>("get_settings");
      setTargetUrl(settings?.website_url || "https://work.sritcloud.com:3100/oa-office/#/pages/login/index");
    } catch {
      // keep current URL
    }
  };

  if (showSettings) {
    return <SettingsPage onSave={() => { setShowSettings(false); reloadUrl(); }} />;
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <iframe
        src={targetUrl}
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        title="Main Content"
      />
      <button
        onClick={() => setShowSettings(true)}
        title="Settings (Ctrl+,)"
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "none",
          background: "rgba(0,0,0,0.5)",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          zIndex: 9999,
          opacity: 0.6,
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
      >
        ⚙
      </button>
    </div>
  );
}

export default App;
