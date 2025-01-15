"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Transaction } from '@/types/marketplace';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, Clock } from 'lucide-react';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import marketplaceService from '@/services/MarketplaceService';
import Image from 'next/image';
import reportService from '@/services/ReportService';
import Modal from './Modal';
import { toastError, toastSuccess } from '@/utils/toastConfig';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'buying' | 'selling'>('all');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [reportedTransactions, setReportedTransactions] = useState<{ [key: string]: Report }>({});
  const [isLoadingReports, setIsLoadingReports] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (!user) {
        router.push('/auth');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const loadData = async () => {
      if (!auth.currentUser) return;
      
      setLoading(true);
      try {
        // Load transactions
        const userTransactions = await marketplaceService.getTransactionHistory(filter);
        setTransactions(userTransactions);

        // Load reports
        const reports = await reportService.getUserReports(auth.currentUser.uid);

        // Create a map of reports indexed by transactionId
        const reportMap = reports.reduce((acc, report) => {
          if (report && report.transactionId) {
            acc[report.transactionId] = report;
          }
          return acc;
        }, {} as { [key: string]: Report });

        setReportedTransactions(reportMap);
      } catch (error) {
        toastError("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filter, isAuthenticated]);

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-600';
      case 'pending':
        return 'border-yellow-500';
      case 'failed':
        return 'border-red-600';
      default:
        return 'border-gray-400';
    }
  };

  const handleReport = async () => {
    try {
      if (!selectedTransaction || !reportReason.trim()) {
        toastError('Please provide a reason for the report');
        return;
      }

      const reportId = await reportService.createReport({
        productId: selectedTransaction.productId,
        productTitle: selectedTransaction.productTitle,
        productImage: selectedTransaction.productImage,
        sellerId: selectedTransaction.sellerId,
        reason: reportReason,
        transactionId: selectedTransaction.id
      });

      // Update the local state with the new report
      setReportedTransactions(prev => ({
        ...prev,
        [selectedTransaction.id]: {
          id: reportId,
          transactionId: selectedTransaction.id,
          productId: selectedTransaction.productId,
          productTitle: selectedTransaction.productTitle,
          productImage: selectedTransaction.productImage,
          buyerId: auth.currentUser!.uid,
          sellerId: selectedTransaction.sellerId,
          reason: reportReason,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }));

      setShowReportModal(false);
      setReportReason('');
      setSelectedTransaction(null);
      toastSuccess('Report submitted successfully');
    } catch (error) {
      console.error('Error submitting report:', error);
      toastError('Failed to submit report');
    }
  };

  const renderTransactionCard = (transaction: Transaction) => {
    const isBuyer = auth.currentUser?.uid === transaction.buyerId;
    const report = reportedTransactions[transaction.id];
    
    console.log('Transaction:', transaction.id, 'Report:', report); // Debug log

    return (
      <motion.div
        key={transaction.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getBorderColor(transaction.status)}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src={transaction.productImage}
              alt={transaction.productTitle}
              width={64}
              height={64}
              className="object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-lg">{transaction.productTitle}</h3>
              <p className="text-green-600 font-bold">
                Rp {typeof transaction.price === 'number' ? transaction.price.toLocaleString() : '0'}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(transaction.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
            <p className="text-sm text-gray-500">{isBuyer ? 'Purchase' : 'Sale'}</p>
            {isBuyer && transaction.status === 'completed' && !report && (
              <button
                onClick={() => {
                  setSelectedTransaction(transaction);
                  setShowReportModal(true);
                }}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Report Issue</span>
              </button>
            )}
          </div>
        </div>

        {report && (
          <div className="mt-4 p-4 rounded-lg bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium text-gray-900">Report Status</p>
                <p className="text-sm text-gray-600 mt-1">{report.reason}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </span>
            </div>

            {report.status !== 'pending' && (
              <div className="mt-3 border-t pt-3">
                <div className={`p-4 rounded-lg ${
                  report.status === 'resolved' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center mb-2">
                    <span className={`mr-2 ${
                      report.status === 'resolved' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {report.status === 'resolved' ? '✓' : '✕'}
                    </span>
                    <p className={`font-medium ${
                      report.status === 'resolved' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {report.status === 'resolved' ? 'Report Resolved' : 'Report Rejected'}
                    </p>
                  </div>
                  {report.adminResponse && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Admin Response: </span>
                        {report.adminResponse}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Updated: {new Date(report.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <Modal
          isOpen={showReportModal}
          onClose={() => {
            setShowReportModal(false);
            setReportReason('');
            setSelectedTransaction(null);
          }}
          title="Report Unsent Product"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Product: {selectedTransaction?.productTitle}
            </p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please describe why you're reporting this product..."
              className="w-full px-4 py-2 border rounded-lg resize-none"
              rows={4}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason('');
                  setSelectedTransaction(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </Modal>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4">
        <button
          onClick={() => router.push('/marketplace')}
          className="flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Marketplace
        </button>

        <h1 className="text-3xl font-bold text-green-600 mb-8">Transaction History</h1>

        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setFilter('buying')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'buying' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            Purchases
          </button>
          <button
            onClick={() => setFilter('selling')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'selling' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            Sales
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading transactions...</div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => renderTransactionCard(transaction))}
          </div>
        )}
      </div>
    </div>
  );

  
};

export default TransactionHistory;
