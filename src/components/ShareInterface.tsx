'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Link2, Share2, Check, Loader2 } from 'lucide-react';
import ValuesCardBracket, { CARD_WIDTH, type BracketCardValue } from './ValuesCardBracket';
import { downloadCard, shareCard, copyToClipboard } from '@/lib/utils/imageGeneration';

interface ShareInterfaceProps {
  values: BracketCardValue[];
  shareUrl?: string;
}

const PREVIEW_MAX_WIDTH = 500;

export default function ShareInterface({ values, shareUrl }: ShareInterfaceProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const exportCardRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(350);

  useEffect(() => {
    if (!previewContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setPreviewWidth(Math.min(width, PREVIEW_MAX_WIDTH));
    });

    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDownload = useCallback(async () => {
    if (!exportCardRef.current) return;

    setIsDownloading(true);
    setDownloadSuccess(false);

    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      await downloadCard(exportCardRef.current, 'index-card', 'my-core-values');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!exportCardRef.current) return;

    setIsSharing(true);

    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const shared = await shareCard(
        exportCardRef.current,
        'index-card',
        `My Core 5 Values: ${values.map(v => v.name).join(', ')}`,
        shareUrl
      );

      if (!shared) {
        await downloadCard(exportCardRef.current, 'index-card', 'my-core-values');
      }
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsSharing(false);
    }
  }, [values, shareUrl]);

  const handleCopyLink = useCallback(async () => {
    if (!shareUrl) return;

    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  return (
    <div className="w-full">
      {/* Card preview */}
      <div
        ref={previewContainerRef}
        className="flex flex-col items-center mb-6"
        style={{ maxWidth: PREVIEW_MAX_WIDTH, width: '100%', margin: '0 auto' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="shadow-2xl rounded-2xl overflow-hidden"
        >
          <ValuesCardBracket
            values={values}
            containerWidth={previewWidth}
          />
        </motion.div>
        <p className="text-center text-xs text-gray-400 mt-3">
          Preview optimized for screen · Download for full quality
        </p>
      </div>

      {/* Hidden export card at full resolution */}
      <div
        className="fixed top-0 left-0 opacity-0 pointer-events-none"
        style={{ zIndex: -1 }}
        aria-hidden="true"
      >
        <ValuesCardBracket
          ref={exportCardRef}
          values={values}
          containerWidth={CARD_WIDTH}
        />
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isDownloading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Download Card</span>
            </>
          )}
        </button>

        <AnimatePresence>
          {downloadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-green-50 text-green-700 rounded-lg text-sm"
            >
              <Check size={16} className="text-green-600" />
              <span>Card saved to your device!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {'share' in navigator && (
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="w-full py-3.5 bg-white text-brand-600 font-semibold rounded-full border-2 border-brand-600 hover:bg-brand-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Share2 size={20} />
            {isSharing ? 'Sharing...' : 'Share'}
          </button>
        )}

        {shareUrl && (
          <button
            onClick={handleCopyLink}
            className="w-full py-3.5 text-gray-600 font-medium hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check size={20} className="text-green-600" />
                <span className="text-green-600">Link copied!</span>
              </>
            ) : (
              <>
                <Link2 size={20} />
                Copy profile link
              </>
            )}
          </button>
        )}
      </div>

      {shareUrl && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 text-center truncate">{shareUrl}</p>
        </div>
      )}
    </div>
  );
}
