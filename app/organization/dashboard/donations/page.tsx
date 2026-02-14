import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';

export default function OrganizationDonationsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Donation Analytics</h1>
        <p className="text-muted-foreground">
          Track donations received for your campaigns
        </p>
      </div>

      {/* Placeholder */}
      <Card className="p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
          <p className="text-muted-foreground">
            Detailed donation analytics and reports will be available here.
          </p>
        </div>
      </Card>
    </div>
  );
}
