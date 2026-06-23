import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

interface AppSettings {
  website_url: string;
  window_width: number;
  window_height: number;
  min_width: number;
  min_height: number;
  enable_tray: boolean;
  enable_notifications: boolean;
  allowed_domains: string[];
}

interface SettingsPageProps {
  onSave?: () => void;
}

type Lang = "en" | "zh";

const translations = {
  en: {
    title: "Application Settings",
    subtitle: "Configure the desktop wrapper application",
    websiteConfig: "Website Configuration",
    websiteUrl: "Website URL",
    websiteUrlHint: "The URL that will be loaded in the application window",
    allowedDomains: "Allowed Domains (reserved)",
    allowedDomainsHint: "Reserved for future use. External links now open in system browser.",
    addDomain: "+ Add Domain",
    remove: "Remove",
    windowSettings: "Window Settings",
    windowWidth: "Window Width",
    windowHeight: "Window Height",
    minWidth: "Min Width",
    minHeight: "Min Height",
    features: "Features",
    systemTray: "System Tray",
    systemTrayHint: "Show application icon in system tray",
    desktopNotifications: "Desktop Notifications",
    desktopNotificationsHint: "Show native system notifications for website messages",
    save: "Save Settings",
    saving: "Saving...",
    saved: "Settings saved successfully! Reloading...",
    savedBrowser: "Settings saved (browser mode). Reload to apply.",
    failedLoad: "Failed to load settings",
    failedSave: "Failed to save settings",
    loading: "Loading settings...",
    language: "Language",
    chinese: "中文",
    english: "English",
  },
  zh: {
    title: "应用设置",
    subtitle: "配置桌面包装器应用",
    websiteConfig: "网站配置",
    websiteUrl: "网站地址",
    websiteUrlHint: "将在应用窗口中加载的 URL",
    allowedDomains: "允许的域名（应用内导航）",
    allowedDomainsHint: "这些域名的链接将在应用内打开，其他链接在系统浏览器中打开。",
    addDomain: "+ 添加域名",
    remove: "删除",
    windowSettings: "窗口设置",
    windowWidth: "窗口宽度",
    windowHeight: "窗口高度",
    minWidth: "最小宽度",
    minHeight: "最小高度",
    features: "功能",
    systemTray: "系统托盘",
    systemTrayHint: "在系统托盘中显示应用图标",
    desktopNotifications: "桌面通知",
    desktopNotificationsHint: "为网站消息显示原生系统通知",
    save: "保存设置",
    saving: "保存中...",
    saved: "设置保存成功！即将重新加载...",
    savedBrowser: "设置已保存（浏览器模式）。重新加载以生效。",
    failedLoad: "加载设置失败",
    failedSave: "保存设置失败",
    loading: "加载设置中...",
    language: "语言",
    chinese: "中文",
    english: "English",
  },
} as const;

export default function SettingsPage(props: SettingsPageProps) {
  const { onSave } = props;
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("settings_lang");
    return (saved === "zh" || saved === "en") ? saved : "en";
  });

  const t = translations[lang];

  // Load settings from Tauri
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await invoke<any>("get_settings");
        setSettings(result);
      } catch (err) {
        setMessage(`${t.failedLoad}: ${err}`);
        // Fallback defaults
        setSettings({
          website_url: "https://work.sritcloud.com:3100/oa-office/#/pages/login/index",
          window_width: 1280,
          window_height: 800,
          min_width: 375,
          min_height: 667,
          enable_tray: true,
          enable_notifications: true,
          allowed_domains: ["work.sritcloud.com", "sritcloud.com"],
        });
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage("");

    try {
      await invoke("save_and_close", {
        newSettings: settings,
      });
      setMessage(t.saved);
      // Close settings and trigger parent to reload iframe
      setTimeout(() => { if (onSave) onSave(); }, 800);
    } catch (err) {
      const errMsg = (err as any)?.message || String(err);
      setMessage(`${t.failedSave}: ${errMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDomainChange = (index: number, value: string) => {
    if (!settings) return;
    const newDomains = [...settings.allowed_domains];
    newDomains[index] = value;
    setSettings({ ...settings, allowed_domains: newDomains });
  };

  const addDomain = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      allowed_domains: [...settings.allowed_domains, ""],
    });
  };

  const removeDomain = (index: number) => {
    if (!settings) return;
    const newDomains = settings.allowed_domains.filter((_, i) => i !== index);
    setSettings({ ...settings, allowed_domains: newDomains });
  };

  const toggleLang = () => {
    const newLang = lang === "en" ? "zh" : "en";
    setLang(newLang);
    localStorage.setItem("settings_lang", newLang);
  };

  if (loading) {
    return (
      <div className="h-screen overflow-y-auto flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500">{t.loading}</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="h-screen overflow-y-auto flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-red-500">{t.failedLoad}</div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto pb-8">
        {/* Header with Language Toggle */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t.subtitle}
            </p>
          </div>
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            {lang === "en" ? t.chinese : t.english}
          </button>
        </div>

        {/* Website URL Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t.websiteConfig}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.websiteUrl}
              </label>
              <input
                type="url"
                value={settings.website_url}
                onChange={(e) =>
                  setSettings({ ...settings, website_url: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t.websiteUrlHint}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.allowedDomains}
              </label>
              <div className="space-y-2">
                {settings.allowed_domains.map((domain, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => handleDomainChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="example.com"
                    />
                    <button
                      onClick={() => removeDomain(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-sm"
                    >
                      {t.remove}
                    </button>
                  </div>
                ))}
                <button
                  onClick={addDomain}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {t.addDomain}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t.allowedDomainsHint}
              </p>
            </div>
          </div>
        </div>

        {/* Window Settings Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t.windowSettings}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.windowWidth}
              </label>
              <input
                type="number"
                value={settings.window_width}
                onChange={(e) =>
                  setSettings({ ...settings, window_width: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min={400}
                max={3840}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.windowHeight}
              </label>
              <input
                type="number"
                value={settings.window_height}
                onChange={(e) =>
                  setSettings({ ...settings, window_height: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min={300}
                max={2160}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.minWidth}
              </label>
              <input
                type="number"
                value={settings.min_width}
                onChange={(e) =>
                  setSettings({ ...settings, min_width: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min={300}
                max={1920}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.minHeight}
              </label>
              <input
                type="number"
                value={settings.min_height}
                onChange={(e) =>
                  setSettings({ ...settings, min_height: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min={200}
                max={1080}
              />
            </div>
          </div>
        </div>

        {/* Feature Toggles Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t.features}
          </h2>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enable_tray}
                onChange={(e) =>
                  setSettings({ ...settings, enable_tray: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded border-gray-300"
              />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {t.systemTray}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t.systemTrayHint}
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enable_notifications}
                onChange={(e) =>
                  setSettings({ ...settings, enable_notifications: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded border-gray-300"
              />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {t.desktopNotifications}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t.desktopNotificationsHint}
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.includes("Failed") || message.includes("失败")
                ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                : "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
          >
            {saving ? t.saving : t.save}
          </button>
        </div>
      </div>
    </div>
  );
}
