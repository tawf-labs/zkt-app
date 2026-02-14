'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, XCircle } from 'lucide-react';

interface RejectDialogProps {
  open: boolean;
  onClose: () => void;
  organization: any;
  onReject: (reason: string) => void;
}

export function RejectDialog({ open, onClose, organization, onReject }: RejectDialogProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState('');

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    setIsRejecting(true);
    setError('');
    try {
      await onReject(rejectionReason.trim());
      setRejectionReason('');
      onClose();
    } finally {
      setIsRejecting(false);
    }
  };

  const handleClose = () => {
    setRejectionReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" />
            Reject Organization
          </DialogTitle>
          <DialogDescription>
            Rejecting {organization.name} will prevent them from creating campaigns
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-red-900">Rejection Notice</p>
              <p className="text-red-700 mt-1">
                This action will notify the organization that their registration has been rejected.
                Please provide a clear reason to help them understand the decision.
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="rejection-reason">
              Reason for Rejection <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide the reason for rejecting this organization..."
              rows={5}
              className="mt-2"
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isRejecting}>
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            disabled={isRejecting}
            variant="destructive"
          >
            {isRejecting ? 'Rejecting...' : 'Reject Organization'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
