'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus } from 'lucide-react';
import { useAssessmentStore } from '@/stores/assessmentStore';
import type { CustomValue } from '@/lib/types';

interface CustomValueModalProps {
  isOpen: boolean;
  onClose: (addedCustomValues?: string[]) => void;
  veryImportantCount: number;
}

const MIN_VERY_IMPORTANT = 3;

export default function CustomValueModal({
  isOpen,
  onClose,
  veryImportantCount,
}: CustomValueModalProps) {
  const [valueName, setValueName] = useState('');
  const [valueDefinition, setValueDefinition] = useState('');
  const [error, setError] = useState('');
  const [addedValues, setAddedValues] = useState<CustomValue[]>([]);
  const { addCustomValue } = useAssessmentStore();

  // Count includes values added in this modal session
  const effectiveVeryCount = veryImportantCount + addedValues.length;
  const canProceed = effectiveVeryCount >= MIN_VERY_IMPORTANT;

  const validateAndAdd = () => {
    const trimmedName = valueName.trim();

    if (!trimmedName) {
      setError('Please enter a value name');
      return;
    }
    if (trimmedName.length < 2) {
      setError('Value must be at least 2 characters');
      return;
    }
    if (trimmedName.length > 30) {
      setError('Value must be less than 30 characters');
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
      setError('Value can only contain letters and spaces');
      return;
    }

    const trimmedDef = valueDefinition.trim() || undefined;

    // Add to store
    addCustomValue(trimmedName, trimmedDef);

    // Track locally for display in list
    setAddedValues((prev) => [
      ...prev,
      { id: `local_${Date.now()}`, name: trimmedName, definition: trimmedDef },
    ]);

    // Clear fields for next entry
    setValueName('');
    setValueDefinition('');
    setError('');
  };

  const handleDone = () => {
    const names = addedValues.map((v) => v.name);
    resetAndClose(names.length > 0 ? names : undefined);
  };

  const handleSkip = () => {
    resetAndClose();
  };

  const resetAndClose = (addedNames?: string[]) => {
    setValueName('');
    setValueDefinition('');
    setError('');
    setAddedValues([]);
    onClose(addedNames);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
        onClick={handleSkip}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-brand-900">
              {addedValues.length > 0
                ? 'Add another value?'
                : canProceed
                  ? "Didn't see a value?"
                  : 'Add more values'}
            </h2>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {!canProceed && addedValues.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-amber-800">
                You need at least {MIN_VERY_IMPORTANT} values marked as Very Important to continue.
                You currently have {veryImportantCount}.
              </p>
            </div>
          )}

          <p className="text-gray-600 mb-4">
            {addedValues.length > 0
              ? 'Add more values or continue to the bracket.'
              : canProceed
                ? "Add a value that matters to you but wasn't in our list."
                : 'Go back and mark more values as Very Important, or add a custom value below.'}
          </p>

          {/* Previously added values */}
          {addedValues.length > 0 && (
            <div className="mb-4 space-y-2">
              {addedValues.map((v, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
                >
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-green-900">{v.name}</p>
                    {v.definition && (
                      <p className="text-xs text-green-700 mt-0.5 line-clamp-2">{v.definition}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Name input */}
          <div className="mb-3">
            <input
              type="text"
              value={valueName}
              onChange={(e) => {
                setValueName(e.target.value);
                setError('');
              }}
              placeholder="Enter your value..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              maxLength={30}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
            {addedValues.length === 0 && (
              <p className="text-xs text-gray-400 mt-2">
                Examples: Sustainability, Faith, Justice, Playfulness
              </p>
            )}
          </div>

          {/* Definition textarea (appears when name is valid) */}
          {valueName.trim().length >= 2 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4"
            >
              <label className="text-sm text-gray-600 font-medium mb-1 block">
                What does this mean to you? <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={valueDefinition}
                onChange={(e) => setValueDefinition(e.target.value)}
                placeholder="e.g., Believing that those with power over you will use it for your good"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm resize-none"
                rows={2}
                maxLength={120}
              />
              <p className="text-xs text-gray-400 mt-1">
                {valueDefinition.length}/120 characters
              </p>
            </motion.div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            {addedValues.length === 0 ? (
              <>
                <button
                  onClick={handleSkip}
                  className="flex-1 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors border border-gray-200 rounded-full"
                >
                  {canProceed ? 'Skip' : 'Go back'}
                </button>
                <button
                  onClick={validateAndAdd}
                  disabled={!valueName.trim()}
                  className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Value
                </button>
              </>
            ) : (
              <>
                {valueName.trim() ? (
                  <button
                    onClick={validateAndAdd}
                    className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-full transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus size={16} />
                    Add Value
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setValueName('');
                      setValueDefinition('');
                      setError('');
                    }}
                    className="flex-1 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors border border-gray-200 rounded-full flex items-center justify-center gap-1.5"
                  >
                    <Plus size={16} />
                    Add Another
                  </button>
                )}
                <button
                  onClick={handleDone}
                  className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-full transition-all"
                >
                  Done →
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
