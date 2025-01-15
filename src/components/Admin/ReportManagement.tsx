'use client'
import { useState, useEffect } from 'react';
import { Report } from '@/types/marketplace';
import reportService from '@/services/ReportService';
import { motion } from 'framer-motion';
import { toastError, toastSuccess, toastWarning } from '@/utils/toastConfig';

const ReportManagement = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [adminResponse, setAdminResponse] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const fetchedReports = await reportService.getAllReports();
      setReports(fetchedReports);
    } catch (error) {
      console.error('Error loading reports:', error);
      toastError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId: string, status: 'resolved' | 'rejected') => {
    try {
      if (!adminResponse.trim()) {
        toastWarning('Please provide a response');
        return;
      }

      await reportService.updateReportStatus(reportId, status, adminResponse);
      setSelectedReport(null);
      setAdminResponse('');
      await loadReports();
      toastSuccess(`Report ${status === 'resolved' ? 'resolved' : 'rejected'} successfully`);
      toastError('Failed to update report status');
    } catch (error) {
      console.error('Error updating report:', error);
      toastError('Failed to update report');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Report Management</h1>

      {loading ? (
        <div>Loading reports...</div>
      ) : (
        <div className="grid gap-6">
          {reports.map((report) => (
            <motion.div
              key={report.id}
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{report.productTitle}</h3>
                  <p className="text-gray-600 mt-2">{report.reason}</p>
                  <div className="mt-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>
                <img
                  src={report.productImage}
                  alt={report.productTitle}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </div>

              {report.status === 'pending' && (
                <div className="mt-4 space-y-4">
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Enter your response..."
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={3}
                  />
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleUpdateStatus(report.id, 'resolved')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(report.id, 'rejected')}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {report.adminResponse && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">Admin Response:</p>
                  <p className="mt-2">{report.adminResponse}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportManagement; 