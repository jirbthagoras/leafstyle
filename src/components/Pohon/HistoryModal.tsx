import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PointTransaction } from '@/services/PointService';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: PointTransaction[];
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history }) => {
  const getTypeIcon = (type: PointTransaction['type']) => {
    switch (type) {
      case 'POST_REWARD': return '📝';
      case 'EVENT_ATTENDANCE': return '🎉';
      case 'MARKETPLACE_SALE': return '🛍️';
      case 'SCAN_RECYCLABLE_ITEM': return '♻️';
      default: return '⭐';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Point History</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {history.map((transaction) => (
                  <div key={transaction.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl">{getTypeIcon(transaction.type)}</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{transaction.reason}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="font-bold text-green-600">+{transaction.points}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HistoryModal; 