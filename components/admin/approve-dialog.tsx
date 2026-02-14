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
import { Badge } from '@/components/ui/badge';
import { formatPinataImageUrl } from '@/lib/pinata-client';
import { Building2, MapPin, Mail, Phone, Calendar, FileText, CheckCircle } from 'lucide-react';
import { formatIDRX } from '@/lib/abi';

interface ApproveDialogProps {
  open: boolean;
  onClose: () => void;
  organization: any;
  onApprove: () => void;
}

export function ApproveDialog({ open, onClose, organization, onApprove }: ApproveDialogProps) {
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await onApprove();
      onClose();
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Approve Organization
          </DialogTitle>
          <DialogDescription>
            Review the organization details before approving
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Organization Header */}
          <div className="flex items-start gap-4">
            {organization.logo_url && (
              <img
                src={formatPinataImageUrl(organization.logo_url)}
                alt={organization.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{organization.name}</h3>
              <p className="text-muted-foreground">{organization.legal_name}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">
                  {organization.organization_type?.replace('_', ' ')}
                </Badge>
                <Badge variant="outline">{organization.year_established}</Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          {organization.description && (
            <div>
              <h4 className="font-medium mb-2">About</h4>
              <p className="text-sm text-muted-foreground">{organization.description}</p>
            </div>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{organization.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{organization.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span>{organization.city}, {organization.country}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="line-clamp-1">{organization.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Submitted {new Date(organization.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Mission */}
          {organization.mission_statement && (
            <div>
              <h4 className="font-medium mb-2">Mission Statement</h4>
              <p className="text-sm text-muted-foreground">{organization.mission_statement}</p>
            </div>
          )}

          {/* Documents */}
          <div>
            <h4 className="font-medium mb-3">Supporting Documents</h4>
            <div className="space-y-2">
              {organization.registration_document_url && (
                <a
                  href={formatPinataImageUrl(organization.registration_document_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  Registration Document
                </a>
              )}
              {organization.tax_document_url && (
                <a
                  href={formatPinataImageUrl(organization.tax_document_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  Tax Document
                </a>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isApproving}>
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isApproving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isApproving ? 'Approving...' : 'Approve Organization'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
