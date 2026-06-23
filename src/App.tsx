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
      <button
        onClick={() => setShowSettings(true)}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: "4px solid white",
          background: "red",
          color: "white",
          cursor: "pointer",
          fontSize: 40,
          fontWeight: "bold",
          zIndex: 99999,
          boxShadow: "0 0 30px rgba(255,0,0,0.8)",
        }}
      >
        设置
      </button>
      <iframe
        src={targetUrl}
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        title="Main Content"
      />
    </div>
  );
}

export default App;
