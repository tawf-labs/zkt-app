import { getUserOrganization } from '@/lib/supabase-auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatPinataImageUrl } from '@/lib/pinata-client';
import { Building2, Mail, Phone, Globe, MapPin } from 'lucide-react';

export default async function OrganizationSettingsPage() {
  const organization = await getUserOrganization();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization profile and settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-1 p-6">
          <div className="text-center">
            {organization?.logo_url && (
              <img
                src={formatPinataImageUrl(organization.logo_url)}
                alt={organization.name}
                className="w-24 h-24 rounded-lg mx-auto mb-4 object-cover"
              />
            )}
            <h2 className="text-xl font-semibold">{organization?.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{organization?.email}</p>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${
                  organization?.verification_status === 'approved'
                    ? 'text-green-600'
                    : organization?.verification_status === 'pending'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {organization?.verification_status?.charAt(0).toUpperCase() +
                    organization?.verification_status?.slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">
                  {organization?.organization_type?.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Established</span>
                <span className="font-medium">{organization?.year_established}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Settings Form */}
        <Card className="lg:col-span-2 p-6">
          <form className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    defaultValue={organization?.name}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="legalName">Legal Name</Label>
                  <Input
                    id="legalName"
                    defaultValue={organization?.legal_name}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue={organization?.description}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={organization?.email}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    defaultValue={organization?.phone}
                  />
                </div>
                <div>
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    defaultValue={organization?.website}
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    defaultValue={organization?.address}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
