'use client';

import { useState, memo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2, CheckCircle2, Upload, X, FileText, Building2, User,
  Mail, Phone, Globe, MapPin, FileCheck, AlertCircle, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { uploadFileToPinata } from '@/lib/pinata-client';
import type { OrganizationRegistrationData } from '@/lib/types/organization';
import { supabase } from '@/lib/supabase-client-auth';

type Step = 1 | 2 | 3;

const steps = [
  { num: 1, title: 'Basic Info', icon: Building2 },
  { num: 2, title: 'Contact Info', icon: Mail },
  { num: 3, title: 'Documents', icon: FileCheck },
];

// FileUpload Component - moved outside
interface FileUploadProps {
  label: string;
  file?: File;
  onChange: (file: File | undefined) => void;
  error?: string;
  accept?: string;
}

const FileUploadComponent = ({ label, file, onChange, error, accept = 'image/*,.pdf' }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files?.[0]);
  };

  return (
    <div className="space-y-2">
      <Label className="text-base">{label}</Label>
      <div className="mt-2">
        {file ? (
          <div className="flex items-center gap-3 p-4 border-2 border-primary/20 bg-primary/5 rounded-lg">
            <FileText className="h-6 w-6 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(undefined)}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="relative">
            <Input
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={handleChange}
              className={`h-12 text-base cursor-pointer ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            <Upload className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          </div>
        )}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

const FileUpload = memo(FileUploadComponent);

// Step 1 Component - moved outside
interface Step1Props {
  formData: OrganizationRegistrationData;
  errors: Record<string, string>;
  onInputChange: (field: keyof OrganizationRegistrationData, value: string) => void;
}

const Step1_BasicInfo = memo(({ formData, errors, onInputChange }: Step1Props) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
        <p className="text-muted-foreground">Tell us about your organization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="name" className="text-base">Organization Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => onInputChange('name', e.target.value)}
            placeholder="e.g., Yayasan Zakat Sejahtera"
            className={`mt-2 h-12 text-base ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
          {errors.name && <p className="text-sm text-red-500 mt-2">{errors.name}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="legalName" className="text-base">Legal Name *</Label>
          <Input
            id="legalName"
            value={formData.legalName}
            onChange={e => onInputChange('legalName', e.target.value)}
            placeholder="e.g., Yayasan Zakat Sejahtera"
            className={`mt-2 h-12 text-base ${errors.legalName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
          {errors.legalName && <p className="text-sm text-red-500 mt-2">{errors.legalName}</p>}
        </div>

        <div>
          <Label htmlFor="registrationNumber" className="text-base">Registration Number *</Label>
          <Input
            id="registrationNumber"
            value={formData.registrationNumber}
            onChange={e => onInputChange('registrationNumber', e.target.value)}
            placeholder="e.g., AHU-12345-AHK.01"
            className={`mt-2 h-12 text-base ${errors.registrationNumber ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
          {errors.registrationNumber && <p className="text-sm text-red-500 mt-2">{errors.registrationNumber}</p>}
        </div>

        <div>
          <Label htmlFor="yearEstablished" className="text-base">Year Established *</Label>
          <Input
            id="yearEstablished"
            type="number"
            value={formData.yearEstablished}
            onChange={e => onInputChange('yearEstablished', e.target.value)}
            placeholder="e.g., 2020"
            min="1900"
            max={new Date().getFullYear()}
            className={`mt-2 h-12 text-base ${errors.yearEstablished ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
          {errors.yearEstablished && <p className="text-sm text-red-500 mt-2">{errors.yearEstablished}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="organizationType" className="text-base">Organization Type *</Label>
          <Select
            value={formData.organizationType}
            onValueChange={value => onInputChange('organizationType', value)}
          >
            <SelectTrigger className={`mt-2 h-12 text-base ${errors.organizationType ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select organization type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amil_zakat">Amil Zakat</SelectItem>
              <SelectItem value="charity">Charity</SelectItem>
              <SelectItem value="nonprofit">Nonprofit</SelectItem>
              <SelectItem value="foundation">Foundation/Yayasan</SelectItem>
              <SelectItem value="community_org">Community Organization</SelectItem>
            </SelectContent>
          </Select>
          {errors.organizationType && <p className="text-sm text-red-500 mt-2">{errors.organizationType}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description" className="text-base">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={e => onInputChange('description', e.target.value)}
            placeholder="Brief description of your organization..."
            rows={5}
            className={`mt-2 text-base resize-none ${errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
          {errors.description && <p className="text-sm text-red-500 mt-2">{errors.description}</p>}
        </div>
      </div>
    </div>
  );
});
Step1_BasicInfo.displayName = 'Step1_BasicInfo';

// Step 2 Component
interface Step2Props {
  formData: OrganizationRegistrationData;
  errors: Record<string, string>;
  onInputChange: (field: keyof OrganizationRegistrationData, value: string) => void;
}

const Step2_ContactInfo = memo(({ formData, errors, onInputChange }: Step2Props) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
        <p className="text-muted-foreground">How can we reach your organization?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="email" className="text-base">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={e => onInputChange('email', e.target.value)}
            placeholder="organization@example.com"
            className={`mt-2 h-12 text-base ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
          {errors.email && <p className="text-sm text-red-500 mt-2">{errors.email}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="phone" className="text-base">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={e => onInputChange('phone', e.target.value)}
            placeholder="+62 812 3456 7890"
            className={`mt-2 h-12 text-base ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
          {errors.phone && <p className="text-sm text-red-500 mt-2">{errors.phone}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="website" className="text-base">Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={e => onInputChange('website', e.target.value)}
            placeholder="https://yourorganization.org"
            className="mt-2 h-12 text-base"
          />
        </div>

        <div>
          <Label htmlFor="country" className="text-base">Country</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={e => onInputChange('country', e.target.value)}
            disabled
            className="mt-2 h-12 text-base bg-muted"
          />
        </div>

        <div>
          <Label htmlFor="city" className="text-base">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={e => onInputChange('city', e.target.value)}
            placeholder="e.g., Jakarta"
            className={`mt-2 h-12 text-base ${errors.city ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
          {errors.city && <p className="text-sm text-red-500 mt-2">{errors.city}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="address" className="text-base">Address *</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={e => onInputChange('address', e.target.value)}
            placeholder="Full organization address..."
            rows={4}
            className={`mt-2 text-base resize-none ${errors.address ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
          {errors.address && <p className="text-sm text-red-500 mt-2">{errors.address}</p>}
        </div>
      </div>
    </div>
  );
});
Step2_ContactInfo.displayName = 'Step2_ContactInfo';

// Step 3 Component
interface Step3Props {
  formData: OrganizationRegistrationData;
  errors: Record<string, string>;
  onFileChange: (field: keyof OrganizationRegistrationData, file: File | undefined) => void;
}

const Step3_Documents = memo(({ formData, errors, onFileChange }: Step3Props) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Supporting Documents</h2>
        <p className="text-muted-foreground">Upload required documents for verification</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <FileUpload
            label="Organization Logo *"
            file={formData.logoFile}
            onChange={file => onFileChange('logoFile', file)}
            error={errors.logoFile}
            accept="image/*"
          />
        </div>

        <div>
          <FileUpload
            label="Registration Document *"
            file={formData.registrationDocument}
            onChange={file => onFileChange('registrationDocument', file)}
            error={errors.registrationDocument}
            accept=".pdf,image/*"
          />
        </div>

        <div>
          <FileUpload
            label="Tax Document *"
            file={formData.taxDocument}
            onChange={file => onFileChange('taxDocument', file)}
            error={errors.taxDocument}
            accept=".pdf,image/*"
          />
        </div>

        <div>
          <FileUpload
            label="Bank Statement"
            file={formData.bankStatement}
            onChange={file => onFileChange('bankStatement', file)}
            accept=".pdf,image/*"
          />
        </div>

        <div>
          <FileUpload
            label="Proof of Address"
            file={formData.proofOfAddress}
            onChange={file => onFileChange('proofOfAddress', file)}
            accept=".pdf,image/*"
          />
        </div>
      </div>
    </div>
  );
});
Step3_Documents.displayName = 'Step3_Documents';

// Step Indicator Component
interface StepIndicatorProps {
  step: Step;
  steps: typeof steps;
}

const StepIndicatorComponent = ({ step, steps }: StepIndicatorProps) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      {steps.map((s, idx) => {
        const Icon = s.icon;
        const isCompleted = step > s.num;
        const isCurrent = step === s.num;

        return (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`text-xs mt-2 text-center ${isCurrent ? 'text-primary font-semibold' : 'text-gray-600'}`}>
                {s.title}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${step > s.num ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
    <Progress value={(step / 3) * 100} className="h-2" />
  </div>
);

const StepIndicator = memo(StepIndicatorComponent);

export default function OrganizationRegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState<OrganizationRegistrationData>({
    // Step 1: Basic Info
    name: '',
    legalName: '',
    registrationNumber: '',
    yearEstablished: '',
    organizationType: '',
    description: '',

    // Step 2: Contact Info
    email: '',
    phone: '',
    website: '',
    country: 'Indonesia',
    city: '',
    address: '',

    // Optional: Can be filled in dashboard later
    missionStatement: '',
    pastProjects: '',
    beneficiaryCount: '',
    annualBudget: '',
    certifications: '',
    boardMembers: '',

    // Step 3: Documents
    logoFile: undefined,
    registrationDocument: undefined,
    taxDocument: undefined,
    bankStatement: undefined,
    proofOfAddress: undefined,
  });

  // Use ref for errors to prevent re-renders when showing validation errors
  const errorsRef = useRef<Record<string, string>>({});
  const [, setErrorUpdate] = useState(0);

  const handleInputChange = useCallback((field: keyof OrganizationRegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errorsRef.current[field]) {
      delete errorsRef.current[field];
      setErrorUpdate(prev => prev + 1);
    }
  }, []);

  const handleFileChange = useCallback((field: keyof OrganizationRegistrationData, file: File | undefined) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    if (errorsRef.current[field]) {
      delete errorsRef.current[field];
      setErrorUpdate(prev => prev + 1);
    }
  }, []);

  const validateStep = useCallback((currentStep: Step): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Organization name is required';
      if (!formData.legalName.trim()) newErrors.legalName = 'Legal name is required';
      if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
      if (!formData.yearEstablished.trim()) newErrors.yearEstablished = 'Year established is required';
      if (!formData.organizationType) newErrors.organizationType = 'Organization type is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    }

    if (currentStep === 2) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
    }

    if (currentStep === 3) {
      if (!formData.logoFile) newErrors.logoFile = 'Logo is required';
      if (!formData.registrationDocument) newErrors.registrationDocument = 'Registration document is required';
      if (!formData.taxDocument) newErrors.taxDocument = 'Tax document is required';
    }

    errorsRef.current = newErrors;
    setErrorUpdate(prev => prev + 1);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-to-pinata', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload file');
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setIsUploading(true);

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Authentication Required',
          description: 'Please login first',
          variant: 'destructive',
        });
        router.push('/organization/login');
        return;
      }

      // Upload files to Pinata
      const uploads: Record<string, string> = {};
      const filesToUpload = [
        { field: 'logoFile', key: 'logo_url' },
        { field: 'registrationDocument', key: 'registration_document_url' },
        { field: 'taxDocument', key: 'tax_document_url' },
        { field: 'bankStatement', key: 'bank_statement_url' },
        { field: 'proofOfAddress', key: 'proof_of_address_url' },
      ];

      for (const { field, key } of filesToUpload) {
        const file = formData[field as keyof OrganizationRegistrationData] as File;
        if (file) {
          try {
            uploads[key] = await uploadFile(file);
          } catch (error: any) {
            toast({
              title: 'Upload Error',
              description: `Failed to upload ${field}: ${error.message}`,
              variant: 'destructive',
            });
            setIsSubmitting(false);
            setIsUploading(false);
            return;
          }
        }
      }

      setIsUploading(false);

      // Submit organization data
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ...uploads,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create organization');
      }

      const result = await response.json();

      toast({
        title: 'Registration Successful',
        description: 'Your organization has been submitted for admin review. You will be notified once approved.',
      });

      router.push('/organization/pending');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Error',
        description: error.message || 'Failed to register organization',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Register Your Organization</h1>
            <p className="text-gray-600">Join ZK Zakat as a verified organization</p>
          </div>

          <StepIndicator step={step} steps={steps} />

          {step === 1 && <Step1_BasicInfo formData={formData} errors={errorsRef.current} onInputChange={handleInputChange} />}
          {step === 2 && <Step2_ContactInfo formData={formData} errors={errorsRef.current} onInputChange={handleInputChange} />}
          {step === 3 && <Step3_Documents formData={formData} errors={errorsRef.current} onFileChange={handleFileChange} />}

          <div className="flex justify-between gap-4 mt-10 pt-6 border-t">
            {step > 1 ? (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep((step - 1) as Step)}
                disabled={isSubmitting}
                className="h-12 px-8"
              >
                Previous
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/')}
                disabled={isSubmitting}
                className="h-12 px-8"
              >
                Cancel
              </Button>
            )}

            {step < 3 ? (
              <Button
                size="lg"
                onClick={() => {
                  if (validateStep(step)) {
                    setStep((step + 1) as Step);
                  }
                }}
                className="h-12 px-8"
              >
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting || isUploading}
                className="h-12 px-8"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Uploading files...
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Registration'
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
