import React, { useState, useEffect } from 'react';
import { Smartphone, X, Check, Share2, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showDesktopGuide, setShowDesktopGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleInstalled = () => {
      setToastMessage('App Installed Successfully!');
      setTimeout(() => setToastMessage(null), 5000);
    };

    window.addEventListener('appinstalled', handleInstalled);
    return () => window.removeEventListener('appinstalled', handleInstalled);
  }, []);

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      const success = await install();
      setIsInstalling(false);
      if (success) {
        setToastMessage('App Installed Successfully!');
        setTimeout(() => setToastMessage(null), 5000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // In Chromium / Desktop where beforeinstallprompt was already consumed or in an iframe
      setShowDesktopGuide(true);
    }
  };

  return (
    <>
      {/* Toast Notification: "App Installed Successfully!" */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl shadow-emerald-950/80 border border-emerald-400">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Button: "📲 Install App" */}
      {!isInstalled ? (
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-sky-400 via-amber-300 to-amber-400 hover:from-sky-300 hover:to-amber-300 rounded-xl shadow-md shadow-sky-500/20 active:scale-95 transition-all whitespace-nowrap"
          title="Install HeatwaveRisk.AI to mobile home screen"
        >
          <span>📲</span>
          <span>Install App</span>
        </button>
      ) : (
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-700/80 text-[11px] font-mono text-emerald-300">
          <Check className="w-3 h-3 text-emerald-400" />
          <span>App Installed</span>
        </div>
      )}

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Install on iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p className="leading-relaxed">
                Add HeatwaveRisk.AI to your iOS Home Screen for instant offline access and native fullscreen experience:
              </p>
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 font-bold flex items-center justify-center text-[11px]">
                    1
                  </span>
                  <span>Tap the <strong>Share</strong> button in Safari toolbar</span>
                  <Share2 className="w-3.5 h-3.5 text-sky-400 inline ml-1" />
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 font-bold flex items-center justify-center text-[11px]">
                    2
                  </span>
                  <span>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 font-bold flex items-center justify-center text-[11px]">
                    3
                  </span>
                  <span>Tap <strong>Add</strong> in the top-right corner</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowIOSGuide(false);
                setToastMessage('App Installed Successfully!');
                setTimeout(() => setToastMessage(null), 5000);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-amber-400 hover:from-sky-300 hover:to-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md"
            >
              Done / Added to Home Screen
            </button>
          </div>
        </div>
      )}

      {/* Desktop / Fallback Guide Modal */}
      {showDesktopGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <span>📲</span>
                </div>
                <h3 className="text-base font-bold text-white">Install HeatwaveRisk.AI</h3>
              </div>
              <button
                onClick={() => setShowDesktopGuide(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Install HeatwaveRisk.AI directly to your device home screen or desktop:
            </p>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>In Chrome / Edge, click the <strong>Install</strong> icon in the address bar (or menu &gt; <em>Install HeatwaveRisk.AI</em>).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>On Android, tap browser menu (⋮) &gt; <strong>&quot;Add to Home Screen&quot;</strong> / <strong>&quot;Install app&quot;</strong>.</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowDesktopGuide(false);
                setToastMessage('App Installed Successfully!');
                setTimeout(() => setToastMessage(null), 5000);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-amber-400 hover:from-sky-300 hover:to-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md"
            >
              Simulate Installed Mode
            </button>
          </div>
        </div>
      )}
    </>
  );
};
