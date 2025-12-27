'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Upload, Calendar, MapPin, Target, Shield, Database, Link2, CheckCircle2, Loader2, X, AlertCircle } from 'lucide-react';
import { useCreateCampaign } from '@/hooks/useCreateCampaign';
import { toast } from '@/components/ui/use-toast';

export default function CreateCampaign() {
  const { address, isConnected } = useAccount();
  const { createCampaign, isLoading, uploadProgress } = useCreateCampaign();
  
  const [step, setStep] = useState(1);
  const [createdCampaign, setCreatedCampaign] = useState<any>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  
  const [offChainData, setOffChainData] = useState({
    title: '',
    description: '',
    category: 'Emergency',
    location: '',
    goal: '',
    organizationName: '',
    organizationVerified: false,
    tags: [] as string[]
  });

  const [onChainData, setOnChainData] = useState({
    startTime: '',
    endTime: ''
  });

  const categories = ['Emergency', 'Education', 'Healthcare', 'Environment', 'Community'];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      
      setImageFiles(prev => [...prev, ...newFiles]);
      setImagePreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (idx: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
    URL.revokeObjectURL(imagePreviewUrls[idx]);
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== idx));
  };


  const validateForm = () => {
    if (!offChainData.title.trim()) {
      toast({ title: 'Error', description: 'Campaign title is required', variant: 'destructive' });
      return false;
    }
    if (!offChainData.description.trim()) {
      toast({ title: 'Error', description: 'Campaign description is required', variant: 'destructive' });
      return false;
    }
    if (!offChainData.location.trim()) {
      toast({ title: 'Error', description: 'Location is required', variant: 'destructive' });
      return false;
    }
    if (!offChainData.goal || parseFloat(offChainData.goal) <= 0) {
      toast({ title: 'Error', description: 'Valid funding goal is required', variant: 'destructive' });
      return false;
    }
    if (!offChainData.organizationName.trim()) {
      toast({ title: 'Error', description: 'Organization name is required', variant: 'destructive' });
      return false;
    }
    if (!onChainData.startTime) {
      toast({ title: 'Error', description: 'Start date/time is required', variant: 'destructive' });
      return false;
    }
    if (!onChainData.endTime) {
      toast({ title: 'Error', description: 'End date/time is required', variant: 'destructive' });
      return false;
    }
    if (new Date(onChainData.startTime) >= new Date(onChainData.endTime)) {
      toast({ title: 'Error', description: 'End time must be after start time', variant: 'destructive' });
      return false;
    }
    if (imageFiles.length === 0) {
      toast({ title: 'Error', description: 'At least one image is required', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isConnected) {
      toast({ title: 'Error', description: 'Please connect your wallet', variant: 'destructive' });
      return;
    }

    if (!validateForm()) return;

    setStep(2);

    try {
      const startTime = Math.floor(new Date(onChainData.startTime).getTime() / 1000);
      const endTime = Math.floor(new Date(onChainData.endTime).getTime() / 1000);

      const result = await createCampaign({
        title: offChainData.title,
        description: offChainData.description,
        category: offChainData.category,
        location: offChainData.location,
        goal: parseFloat(offChainData.goal),
        organizationName: offChainData.organizationName,
        organizationVerified: offChainData.organizationVerified,
        imageFiles,
        tags: offChainData.tags,
        startTime,
        endTime,
      });

      setCreatedCampaign(result);
      setStep(3);
    } catch (error) {
      console.error('Error creating campaign:', error);
      setStep(1);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create campaign',
        variant: 'destructive',
      });
    }
  };

  // Loading/Success Screen
  if (step > 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-secondary/20 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white border border-border rounded-2xl shadow-lg p-8">
          <div className="text-center space-y-6">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30 mx-auto">
              {step === 3 ? (
                <CheckCircle2 className="h-10 w-10 text-white" />
              ) : (
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold">
                {step === 2 && 'Creating Campaign...'}
                {step === 3 && 'Campaign Created Successfully! 🎉'}
              </h2>
              <p className="text-muted-foreground text-lg">
                {step === 2 && `Progress: ${uploadProgress}%`}
                {step === 3 && 'Your campaign is now live and accepting donations'}
              </p>
            </div>

            {step === 2 && (
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {step === 3 && createdCampaign && (
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-4 p-5 rounded-xl border-2 border-primary bg-primary/5">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg mb-1">Campaign Uploaded to IPFS</div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Images stored on Pinata IPFS ({createdCampaign.imageUrls?.length || 0} files)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Gateway: {process.env.NEXT_PUBLIC_PINATA_GATEWAY}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-xl border-2 border-primary bg-primary/5">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg mb-1">Metadata Stored Off-Chain</div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Saved to Supabase database
                    </p>
                    <p className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded break-all">
                      ID: {createdCampaign.campaignId}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-xl border-2 border-primary bg-primary/5">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold text-lg mb-1">Campaign Created On Blockchain</div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Smart contract: {process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS?.slice(0, 10)}...
                    </p>
                    {createdCampaign.txHash && (
                      <p className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded break-all">
                        Tx: {createdCampaign.txHash.slice(0, 20)}...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="pt-6 space-y-3">
                <button
                  onClick={() => window.location.href = '/campaigns'}
                  className="w-full bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-lg hover:shadow-primary/30 rounded-xl h-12 px-6 font-semibold transition-all"
                >
                  View Campaign
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setOffChainData({
                      title: '',
                      description: '',
                      category: 'Emergency',
                      location: '',
                      goal: '',
                      organizationName: '',
                      organizationVerified: false,
                      tags: []
                    });
                    setOnChainData({ startTime: '', endTime: '' });
                    setImageFiles([]);
                    setImagePreviewUrls([]);
                  }}
                  className="w-full border-2 border-border rounded-xl h-12 px-6 font-semibold hover:bg-accent hover:border-primary/30 transition-all"
                >
                  Create Another Campaign
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/20 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Create New Campaign</h1>
          <p className="text-muted-foreground text-lg">
            Create a transparent, blockchain-verified fundraising campaign
          </p>
        </div>

        {!isConnected && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Wallet Not Connected</p>
              <p className="text-sm text-amber-800 mt-1">Please connect your wallet to create a campaign.</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white border border-border rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full"></div>
              Basic Information
            </h2>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  value={offChainData.title}
                  onChange={(e) => setOffChainData({...offChainData, title: e.target.value})}
                  placeholder="e.g., Emergency Relief for Earthquake Victims"
                  className="w-full h-12 rounded-xl border-2 border-input bg-white px-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  Stored off-chain in Supabase
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Description *
                </label>
                <textarea
                  value={offChainData.description}
                  onChange={(e) => setOffChainData({...offChainData, description: e.target.value})}
                  placeholder="Describe your campaign, its goals, and how funds will be used..."
                  rows={6}
                  className="w-full rounded-xl border-2 border-input bg-white px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Category *
                  </label>
                  <select
                    value={offChainData.category}
                    onChange={(e) => setOffChainData({...offChainData, category: e.target.value})}
                    className="w-full h-12 rounded-xl border-2 border-input bg-white px-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Location *
                  </label>
                  <input
                    type="text"
                    value={offChainData.location}
                    onChange={(e) => setOffChainData({...offChainData, location: e.target.value})}
                    placeholder="e.g., Jakarta, Indonesia"
                    className="w-full h-12 rounded-xl border-2 border-input bg-white px-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Funding Goal (IDRX) *
                </label>
                <input
                  type="number"
                  value={offChainData.goal}
                  onChange={(e) => setOffChainData({...offChainData, goal: e.target.value})}
                  placeholder="150000"
                  className="w-full h-12 rounded-xl border-2 border-input bg-white px-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Campaign Timeline</h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                <Shield className="h-3.5 w-3.5" />
                On-Chain
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={onChainData.startTime}
                  onChange={(e) => setOnChainData({...onChainData, startTime: e.target.value})}
                  className="w-full h-12 rounded-xl border-2 border-input bg-white px-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={onChainData.endTime}
                  onChange={(e) => setOnChainData({...onChainData, endTime: e.target.value})}
                  className="w-full h-12 rounded-xl border-2 border-input bg-white px-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
              <p className="text-sm text-amber-900">
                <strong>Note:</strong> Start and end times will be recorded on the blockchain as Unix timestamps and cannot be changed after creation.
              </p>
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full"></div>
              Organization Details
            </h2>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Organization Name *
                </label>
                <input
                  type="text"
                  value={offChainData.organizationName}
                  onChange={(e) => setOffChainData({...offChainData, organizationName: e.target.value})}
                  placeholder="e.g., Baznas Indonesia"
                  className="w-full h-12 rounded-xl border-2 border-input bg-white px-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
                <input
                  type="checkbox"
                  id="verified"
                  checked={offChainData.organizationVerified}
                  onChange={(e) => setOffChainData({...offChainData, organizationVerified: e.target.checked})}
                  className="h-5 w-5 rounded border-input accent-primary"
                />
                <label htmlFor="verified" className="text-sm font-semibold cursor-pointer">
                  Verified Organization
                </label>
              </div>
            </div>
          </div>

          {/* Campaign Images */}
          <div className="bg-white border border-border rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full"></div>
              Campaign Images (Pinata IPFS) *
            </h2>
            <div className="space-y-5">
              <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <label className="cursor-pointer">
                  <span className="text-base font-semibold text-primary hover:underline">
                    Click to upload images
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                </label>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload up to 5 images. Images will be stored on IPFS via Pinata.
                </p>
              </div>

              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviewUrls.map((img, idx) => (
                    <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border-2 border-border hover:border-primary transition-all">
                      <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(idx)}
                        disabled={isLoading}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                {imagePreviewUrls.length} / 5 images selected
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => window.history.back()}
              disabled={isLoading}
              className="flex-1 border-2 border-border rounded-xl h-14 px-8 font-bold hover:bg-accent hover:border-primary/30 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isConnected || isLoading || !offChainData.title || !onChainData.startTime || !onChainData.endTime || imagePreviewUrls.length === 0}
              className="flex-1 bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-xl hover:shadow-primary/30 rounded-xl h-14 px-8 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? `Creating... ${uploadProgress}%` : 'Create Campaign'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}