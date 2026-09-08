import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Loader2, Maximize2, X, Check } from 'lucide-react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  showDownload?: boolean;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 230,
  showDownload = true,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [copiedImg, setCopiedImg] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Standard ISO/IEC 18004 compliant QR code:
    // - Error Correction Level 'M' (standard 15% recovery, coarse modules for instant camera capture on LCD screens)
    // - margin: 4 (mandatory 4-module quiet zone for viewfinder edge detection)
    // - pure #000000 on #FFFFFF for maximum optical contrast
    QRCode.toDataURL(value, {
      width: 600, // High definition for retina screens & printing
      margin: 4,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (isMounted) {
          setDataUrl(url);
          setLoading(false);
          setError(null);
        }
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
        if (isMounted) {
          setError('Não foi possível gerar o código.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [value]);

  const handleCopyImage = async () => {
    try {
      if (!dataUrl) return;
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopiedImg(true);
      setTimeout(() => setCopiedImg(false), 2000);
    } catch {
      // Clipboard write image not supported on all browsers
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* QR Code Container with clear white quiet zone */}
      <div
        className="relative inline-flex items-center justify-center p-2 bg-white rounded-lg shadow-sm border border-neutral-300 dark:border-neutral-700 select-none overflow-hidden group"
        style={{ width: size + 16, height: size + 16 }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 text-neutral-400">
            <Loader2 size={24} className="animate-spin text-[#7B2FFF]" />
            <span className="text-xs font-medium">Gerando QR Code...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-xs text-rose-500 font-medium">
            {error}
          </div>
        ) : (
          <div className="relative flex items-center justify-center bg-white p-1">
            <img
              src={dataUrl}
              alt="QR Code Qindica"
              width={size}
              height={size}
              className="block pointer-events-none rounded-md"
              referrerPolicy="no-referrer"
            />
            {/* Quick zoom button */}
            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              title="Ampliar QR Code"
              className="absolute bottom-2 right-2 p-1.5 rounded-md bg-neutral-900/80 hover:bg-neutral-900 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
            >
              <Maximize2 size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {showDownload && !loading && dataUrl && (
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <a
            href={dataUrl}
            download="qindica-qrcode.png"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download size={13} />
            <span>Baixar PNG</span>
          </a>

          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Maximize2 size={13} />
            <span>Ampliar</span>
          </button>
        </div>
      )}

      {/* Fullscreen / Enlarge Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full flex flex-col items-center shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                QR Code em Alta Resolução
              </span>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-white rounded-md border border-neutral-200 shadow-xs mb-4">
              <img
                src={dataUrl}
                alt="QR Code Qindica Ampliado"
                width={300}
                height={300}
                className="block mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="text-xs text-neutral-600 mb-4 leading-relaxed font-medium">
              Aponte a câmera do seu smartphone diretamente para o código acima para abrir o perfil.
            </p>

            <div className="flex items-center gap-2 w-full">
              <a
                href={dataUrl}
                download="qindica-qrcode-hd.png"
                className="flex-1 py-2.5 px-3 rounded-md bg-[#7B2FFF] hover:bg-[#6A23E3] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Download size={14} />
                <span>Salvar PNG</span>
              </a>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="py-2.5 px-4 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold cursor-pointer transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

