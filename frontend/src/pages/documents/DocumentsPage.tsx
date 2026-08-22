import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Trash2,
  Lock,
} from 'lucide-react';
import { documentService } from '../../services/documentService';
import { TripDocument } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export const DocumentsPage: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [documents, setDocuments] = useState<TripDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<TripDocument['type']>('passport');
  const [documentNumber, setDocumentNumber] = useState('');
  const [issuer, setIssuer] = useState('');
  const [expirationDate, setExpirationDate] = useState('2028-12-31');
  const [notes, setNotes] = useState('');

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toastError('Missing Details', 'Please provide a document title.');
      return;
    }

    try {
      const expDate = new Date(expirationDate);
      const now = new Date();
      const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      const status: TripDocument['status'] =
        diffDays <= 0 ? 'expired' : diffDays <= 60 ? 'expiring_soon' : 'valid';

      await documentService.addDocument({
        name,
        type,
        documentNumber,
        issuer,
        expirationDate,
        status,
        notes,
      });

      success('Document Saved', `"${name}" added to your Travel Document Wallet.`);
      setShowAddModal(false);
      setName('');
      setDocumentNumber('');
      setIssuer('');
      setNotes('');
      fetchDocuments();
    } catch (err: any) {
      toastError('Error', err.message || 'Could not save document.');
    }
  };

  const handleDeleteDocument = async () => {
    if (!deletingId) return;
    try {
      await documentService.deleteDocument(deletingId);
      success('Removed', 'Document removed from wallet.');
      setDeletingId(null);
      fetchDocuments();
    } catch (err: any) {
      toastError('Error', err.message || 'Could not delete document.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>Travel Documents & IDs</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Safely track passport numbers, visa validity, flight e-tickets, and emergency insurance policies.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl px-4 py-2 shadow-2xs"
        >
          Add Document
        </Button>
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center gap-3 text-xs text-blue-900 dark:text-blue-200">
        <Lock className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
        <span>
          <strong>Zero-Knowledge Safety:</strong> Document numbers and metadata are securely managed on your local device session.
        </span>
      </div>

      {/* Documents Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={140} className="rounded-2xl" />
          ))}
        </div>
      ) : documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => {
            const isExpiringSoon = doc.status === 'expiring_soon';
            const isExpired = doc.status === 'expired';

            return (
              <div
                key={doc.id}
                className={`p-5 rounded-2xl border shadow-sm transition-all flex flex-col justify-between ${
                  isExpiringSoon
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60'
                    : isExpired
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-xl ${
                          isExpiringSoon
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : isExpired
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700'
                        }`}
                      >
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{doc.name}</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize font-medium">
                          {doc.type.replace('_', ' ')} • {doc.issuer || 'Official'}
                        </p>
                      </div>
                    </div>

                    {isExpiringSoon ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                        <AlertTriangle className="w-3 h-3" /> Expires soon
                      </span>
                    ) : isExpired ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-bold">
                        Expired
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Valid
                      </span>
                    )}
                  </div>

                  {doc.documentNumber && (
                    <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Document ID:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100 tracking-wider">
                        {doc.documentNumber}
                      </span>
                    </div>
                  )}

                  {doc.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 italic">{doc.notes}</p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Expires: {doc.expirationDate || 'No expiration'}</span>
                  </span>

                  <button
                    onClick={() => setDeletingId(doc.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Document Wallet is Empty"
          description="Add your passport, visa, flight receipts, and travel insurance policy numbers for quick offline access."
          actionText="Add First Document"
          onAction={() => setShowAddModal(true)}
          actionIcon={<Plus className="w-4 h-4" />}
        />
      )}

      {/* Add Document Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Travel Document"
        description="Store your travel identification and authorization records."
        maxWidth="md"
      >
        <form onSubmit={handleAddDocument} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Document Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. US Passport (Alex), Japan Tourist eVisa"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Document Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TripDocument['type'])}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="passport">Passport</option>
                <option value="visa">Tourist / Entry Visa</option>
                <option value="flight_ticket">Flight E-Ticket</option>
                <option value="hotel_booking">Hotel Booking Voucher</option>
                <option value="insurance">Travel Insurance</option>
                <option value="other">Other Document</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Expiration Date</label>
              <input
                type="date"
                required
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Document Number</label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="e.g. P772819034"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Issuer / Authority</label>
              <input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="e.g. US Dept of State"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Notes / Instructions</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Print physical copies, emergency contact details..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 p-3 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
            >
              Save to Wallet
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteDocument}
        title="Delete Document Record?"
        message="Are you sure you want to remove this document from your traveler wallet?"
        confirmText="Delete Document"
      />
    </div>
  );
};
