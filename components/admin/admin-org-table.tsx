'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatPinataImageUrl } from '@/lib/pinata-client';
import { ApproveDialog } from './approve-dialog';
import { RejectDialog } from './reject-dialog';
import { Building2, MapPin, Calendar, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AdminOrgTableProps {
  organizations: any[];
}

export function AdminOrgTable({ organizations }: AdminOrgTableProps) {
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);

  const handleApprove = async () => {
    try {
      const response = await fetch(`/api/organizations/${selectedOrg.id}/approve`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to approve organization');
      }

      window.location.reload();
    } catch (error: any) {
      console.error('Error approving organization:', error);
      alert(error.message || 'Failed to approve organization');
    }
  };

  const handleReject = async (reason: string) => {
    try {
      const response = await fetch(`/api/organizations/${selectedOrg.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejection_reason: reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reject organization');
      }

      window.location.reload();
    } catch (error: any) {
      console.error('Error rejecting organization:', error);
      alert(error.message || 'Failed to reject organization');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  if (organizations.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No organizations found</h3>
          <p className="text-muted-foreground">
            No organizations match the current filter criteria.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {org.logo_url && (
                        <img
                          src={formatPinataImageUrl(org.logo_url)}
                          alt={org.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{org.name}</p>
                        <p className="text-sm text-muted-foreground">{org.legal_name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {org.organization_type?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {org.city}, {org.country}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{org.email}</p>
                      <p className="text-muted-foreground">{org.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(org.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(org.verification_status)}</TableCell>
                  <TableCell className="text-right">
                    {org.verification_status === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrg(org);
                            setShowApprove(true);
                          }}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrg(org);
                            setShowReject(true);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/api/organizations/${org.id}`, '_blank')}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedOrg && (
        <>
          <ApproveDialog
            open={showApprove}
            onClose={() => setShowApprove(false)}
            organization={selectedOrg}
            onApprove={handleApprove}
          />
          <RejectDialog
            open={showReject}
            onClose={() => setShowReject(false)}
            organization={selectedOrg}
            onReject={handleReject}
          />
        </>
      )}
    </>
  );
}
