import React, { useState } from "react";
import { Smartphone, Download, Share2, PlusSquare, X, CheckCircle2 } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

interface PWAInstallButtonProps {
  variant?: "header" | "card" | "mobile-banner";
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = "header",
  className = "",
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // Si ya está ejecutándose como aplicación instalada standalone, ocultar el botón
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
        setTimeout(() => setJustInstalled(false), 4000);
      }
    } else {
      // Fallback para navegadores móviles donde el prompt automático no ha disparado
      setShowIOSModal(true);
    }
  };

  if (justInstalled) {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
        <CheckCircle2 className="h-3.5 w-3.5" />
        <span>¡App Instalada!</span>
      </div>
    );
  }

  // Variante Banner Móvil para la plataforma
  if (variant === "mobile-banner") {
    return (
      <>
        <div className={`rounded-xl border border-cyan-500/40 bg-gradient-to-r from-slate-900/90 to-cyan-950/40 p-3 shadow-lg ${className}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-100">Instala la App en tu Celular</h4>
              <p className="text-[11px] text-slate-400 truncate">
                Rastreo satelital a pantalla completa, sin barra de navegador.
              </p>
            </div>
            <button
              onClick={handleInstallClick}
              type="button"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md hover:bg-cyan-400 active:scale-95 transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Instalar</span>
            </button>
          </div>
        </div>

        {/* Modal de instrucciones para iOS */}
        {showIOSModal && <IOSInstallModal onClose={() => setShowIOSModal(false)} />}
      </>
    );
  }

  // Variante para Header o Nav
  return (
    <>
      <button
        onClick={handleInstallClick}
        type="button"
        title="Instalar ORB-LITE en tu celular o escritorio"
        className={`group relative inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-cyan-300 shadow-sm transition hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-200 active:scale-95 ${className}`}
      >
        <Smartphone className="h-3.5 w-3.5 text-cyan-400 transition-transform group-hover:scale-110" />
        <span className="hidden sm:inline">Instalar App</span>
        <span className="sm:hidden">App Móvil</span>
      </button>

      {/* Modal de instrucciones para iOS / Móvil */}
      {showIOSModal && <IOSInstallModal onClose={() => setShowIOSModal(false)} />}
    </>
  );
};

function IOSInstallModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl border border-cyan-500/40 bg-slate-900 p-5 shadow-2xl">
        <button
          onClick={onClose}
          type="button"
          className="absolute right-3.5 top-3.5 rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/20 text-cyan-400">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Instalar ORB-LITE en tu Celular</h3>
            <p className="text-xs text-slate-400">Acceso directo como app nativa</p>
          </div>
        </div>

        <div className="mt-4 space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 font-bold text-cyan-400 text-[11px]">
              1
            </span>
            <p>
              En el navegador de tu celular (Safari o Chrome), toca el botón de <strong>Compartir</strong> <Share2 className="inline h-3.5 w-3.5 text-cyan-400" /> o el menú de 3 puntos.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 font-bold text-cyan-400 text-[11px]">
              2
            </span>
            <p>
              Desplázate hacia abajo y selecciona <strong>"Agregar a pantalla de inicio"</strong> <PlusSquare className="inline h-3.5 w-3.5 text-cyan-400" /> (Add to Home Screen).
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 font-bold text-cyan-400 text-[11px]">
              3
            </span>
            <p>
              Toca <strong>"Agregar"</strong> en la esquina superior. ¡Listo! Verás el icono de <strong>ORB-LITE</strong> en tu pantalla de inicio como una aplicación completa.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          type="button"
          className="mt-4 w-full rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 active:scale-95 transition"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
