'use client';

import { Lock, Users, PieChart } from 'lucide-react';
import type { NGOAllocation } from '@/hooks/useCampaignAllocations';

interface AllocationBreakdownProps {
  allocations: NGOAllocation[];
  totalPercentage: number;
  allocationLocked: boolean;
  isLoading?: boolean;
}

export function AllocationBreakdown({
  allocations,
  totalPercentage,
  allocationLocked,
  isLoading = false,
}: AllocationBreakdownProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-lg">Fund Allocation</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (allocations.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-bold text-lg text-muted-foreground">Fund Allocation</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          No allocation information available for this campaign.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-lg">Fund Allocation</h3>
        </div>
        {allocationLocked && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200">
            <Lock className="h-3.5 w-3.5 text-green-600" />
            <span className="text-xs font-semibold text-green-700">Locked</span>
          </div>
        )}
      </div>

      {/* Allocation Progress */}
      <div className="mb-4 p-3 bg-secondary rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Total Allocated</span>
          <span className={`text-sm font-bold ${totalPercentage === 100 ? 'text-green-600' : 'text-amber-600'}`}>
            {totalPercentage.toFixed(2)}%
          </span>
        </div>
        <div className="w-full h-2 bg-background rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              totalPercentage === 100 ? 'bg-green-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(totalPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* NGO List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Users className="h-4 w-4" />
          <span className="font-medium">Receiving Organizations</span>
        </div>

        {allocations.map((allocation) => (
          <div
            key={allocation.ngoId}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
          >
            <div className="flex-1">
              <div className="font-semibold text-sm">{allocation.ngoName}</div>
              <div className="text-xs text-muted-foreground font-mono truncate">
                {allocation.ngoId.slice(0, 10)}...{allocation.ngoId.slice(-8)}
              </div>
            </div>
            <div className="ml-3 text-right">
              <div className="font-bold text-lg text-primary">
                {allocation.percentage.toFixed(2)}%
              </div>
              <div className="text-xs text-muted-foreground">{allocation.bps} bps</div>
            </div>
          </div>
        ))}
      </div>

      {/* Lock Status Message */}
      {!allocationLocked && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            <span className="font-semibold">Note:</span> Allocations are not yet locked and may be subject to change.
          </p>
        </div>
      )}

      {allocationLocked && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-800">
            <span className="font-semibold">Verified:</span> Allocations are locked on the blockchain and will be distributed as shown.
          </p>
        </div>
      )}
    </div>
  );
}
