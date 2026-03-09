'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Link2, Share2, Check, Loader2, Linkedin, Facebook } from 'lucide-react';
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
        className="flex flex-col items-center mb-8 mx-auto"
        style={{ maxWidth: PREVIEW_MAX_WIDTH, width: '100%' }}
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

      {/* Hidden export card at full resolution (off-screen for capture) */}
      <div
        className="fixed opacity-0 pointer-events-none"
        style={{ top: 0, left: '-9999px', zIndex: -1 }}
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

      {/* Social media share links */}
      {shareUrl && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="text-xs text-gray-400">Share on</span>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center"
          >
            <Linkedin size={16} />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('I just discovered my core values with The Values Bracket! 🏆')}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center"
          >
            <Facebook size={16} />
          </a>
        </div>
      )}

      {shareUrl && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 text-center truncate">{shareUrl}</p>
        </div>
      )}
    </div>
  );
}
