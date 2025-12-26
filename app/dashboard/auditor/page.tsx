"use client";

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESSES, ZKTCoreABI, formatIDRX } from '@/lib/abi';
import { useProposals } from '@/hooks/useProposals';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, XCircle, Clock, AlertCircle, Wallet } from 'lucide-react';
import { handleTransactionError } from '@/lib/errors';

export default function ShariaCouncilDashboard() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const { writeContractAsync, isPending } = useWriteContract();
  
  // Check if user has Sharia Council role
  const SHARIA_COUNCIL_ROLE = '0x' + '2'.repeat(64); // keccak256("SHARIA_COUNCIL_ROLE")
  
  const { data: hasRole } = useReadContract({
    address: CONTRACT_ADDRESSES.ZKTCore,
    abi: ZKTCoreABI,
    functionName: 'hasRole',
    args: [SHARIA_COUNCIL_ROLE as `0x${string}`, address!],
    query: { enabled: !!address },
  });

  // Fetch proposals pending review
  const { proposals } = useProposals([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

  const handleReviewProposal = async (proposalId: bigint, approved: boolean, campaignType: number) => {
    try {
      const mockZKProof = `0x${Date.now().toString(16).padStart(64, '0')}`;
      
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.ZKTCore,
        abi: ZKTCoreABI,
        functionName: 'reviewProposal',
        args: [
          BigInt(0), // bundleId
          proposalId,
          approved,
          campaignType,
          mockZKProof as `0x${string}`,
        ],
      });

      toast({
        title: approved ? "Proposal Approved! ✅" : "Proposal Rejected",
        description: `Proposal #${proposalId} has been ${approved ? 'approved' : 'rejected'} for Sharia compliance`,
      });
    } catch (error) {
      handleTransactionError(error, { toast, action: 'review proposal' });
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">Please connect your wallet to access Sharia Council dashboard</p>
        </div>
      </div>
    );
  }

  if (!hasRole) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don&apos;t have Sharia Council role</p>
          <p className="text-xs text-muted-foreground mt-2">This dashboard is restricted to authorized Sharia Council members</p>
        </div>
      </div>
    );
  }

  // Filter proposals by status
  const pendingProposals = proposals.filter(p => p.kycStatus === 1 && p.status === 0);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Sharia Council Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Review and approve campaign proposals for Islamic compliance</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Pending Review</p>
            <p className="text-3xl font-bold">{pendingProposals.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Reviewed Today</p>
            <p className="text-3xl font-bold">0</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Your Role</p>
            <Badge className="mt-2"><Shield className="h-3 w-3 mr-1" />Sharia Council</Badge>
          </Card>
        </div>

        {/* Proposals for Review */}
        <Card>
          <CardHeader>
            <CardTitle>Proposals Awaiting Review</CardTitle>
            <CardDescription>Review proposals for Sharia compliance before community voting</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingProposals.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No proposals pending review</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingProposals.map((proposal) => (
                  <div key={proposal.id.toString()} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">{proposal.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{proposal.description}</p>
                        <div className="flex gap-2">
                          <Badge variant={proposal.isEmergency ? "destructive" : "outline"}>
                            {proposal.isEmergency ? "🚨 Emergency" : proposal.proposalType}
                          </Badge>
                          <Badge variant="outline">
                            {formatIDRX(proposal.fundingGoal || BigInt(0))} IDRX Goal
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Zakat Checklist */}
                    {proposal.zakatChecklistItems && proposal.zakatChecklistItems.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="font-semibold text-sm mb-2">📋 Zakat Compliance Checklist:</p>
                        <ul className="space-y-1">
                          {proposal.zakatChecklistItems.map((item, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Organizer Info */}
                    <div className="text-xs text-muted-foreground mb-4">
                      <strong>Organizer:</strong> {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleReviewProposal(proposal.id, true, proposal.campaignType || 0)}
                        disabled={isPending}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve (Compliant)
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReviewProposal(proposal.id, false, proposal.campaignType || 0)}
                        disabled={isPending}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject (Non-Compliant)
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Review Process
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• Review proposals for Sharia compliance and Islamic principles</p>
            <p>• Check Zakat eligibility criteria for Zakat-designated campaigns</p>
            <p>• Verify organizer credentials and campaign authenticity</p>
            <p>• Approved proposals proceed to community DAO voting</p>
            <p>• Rejected proposals return to organizer for revision</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
