"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, X, Shield, AlertCircle, Info } from "lucide-react";
import { useAccount, useWriteContract } from "wagmi";
import { CONTRACT_ADDRESSES, ZKTCoreABI, parseIDRX } from "@/lib/abi";
import { useToast } from "@/hooks/use-toast";
import { handleTransactionError, handleWalletError } from "@/lib/errors";

export default function CreateProposalPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fundingGoal: "",
    isEmergency: false,
    campaignType: "0", // 0=General, 1=Zakat, 2=Emergency
  });

  const [zakatChecklist, setZakatChecklist] = useState<string[]>([
    "Recipient verified as eligible",
    "Funding amount meets Nisab threshold",
    "Purpose aligns with Zakat categories",
  ]);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setZakatChecklist([...zakatChecklist, newChecklistItem.trim()]);
      setNewChecklistItem("");
    }
  };

  const removeChecklistItem = (index: number) => {
    setZakatChecklist(zakatChecklist.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      handleWalletError(new Error("not-connected"), { toast });
      return;
    }

    try {
      const fundingGoalWei = parseIDRX(parseFloat(formData.fundingGoal));
      
      // Generate mock ZK proof (in production, this would be real ZK proof)
      const mockZKProof = `0x${Date.now().toString(16).padStart(64, '0')}`;

      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.ZKTCore,
        abi: ZKTCoreABI,
        functionName: "createProposal",
        args: [
          formData.title,
          formData.description,
          fundingGoalWei,
          formData.isEmergency,
          mockZKProof as `0x${string}`,
          zakatChecklist,
        ],
      });

      toast({
        title: "Proposal Created! 🎉",
        description: "Your proposal has been submitted for Sharia Council review.",
      });

      router.push("/governance");
    } catch (error) {
      handleTransactionError(error, { toast, action: "create proposal" });
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container px-4 mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Campaign Proposal</h1>
          <p className="text-muted-foreground">
            Submit your campaign for Sharia Council review and community voting
          </p>
        </div>

        {!isConnected && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900">Wallet Not Connected</p>
              <p className="text-sm text-yellow-800">Please connect your wallet to create a proposal</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide details about your campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Emergency Medical Relief for Gaza"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose, impact, and how funds will be used..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundingGoal">Funding Goal (IDRX) *</Label>
                <Input
                  id="fundingGoal"
                  type="number"
                  placeholder="100000"
                  value={formData.fundingGoal}
                  onChange={(e) => setFormData({ ...formData, fundingGoal: e.target.value })}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaignType">Campaign Type *</Label>
                <select
                  id="campaignType"
                  value={formData.campaignType}
                  onChange={(e) => setFormData({ ...formData, campaignType: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={isPending}
                >
                  <option value="0">General Charity</option>
                  <option value="1">Zakat</option>
                  <option value="2">Emergency Relief</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="emergency">Emergency Campaign</Label>
                  <p className="text-sm text-muted-foreground">
                    Fast-track review for urgent situations
                  </p>
                </div>
                <Switch
                  id="emergency"
                  checked={formData.isEmergency}
                  onCheckedChange={(checked) => setFormData({ ...formData, isEmergency: checked })}
                  disabled={isPending}
                />
              </div>
            </CardContent>
          </Card>

          {/* Zakat Compliance Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Zakat Compliance Checklist
              </CardTitle>
              <CardDescription>
                Items for Sharia Council review (required for Zakat campaigns)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {zakatChecklist.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-accent/50 rounded-md">
                    <span className="flex-1 text-sm">{item}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChecklistItem(index)}
                      disabled={isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add compliance item..."
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addChecklistItem())}
                  disabled={isPending}
                />
                <Button type="button" onClick={addChecklistItem} disabled={isPending}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Review Process Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><strong>Sharia Bundle Review:</strong> Your proposal is added to the review bundle</li>
                <li><strong>KYC Verification:</strong> Oracle verifies your organization credentials</li>
                <li><strong>Council Approval:</strong> Sharia Council reviews Islamic compliance</li>
                <li><strong>Community Vote:</strong> Upon approval, proposal goes to DAO voting</li>
                <li><strong>Pool Creation:</strong> If vote passes, campaign pool is created for donations</li>
              </ol>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!isConnected || isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit for Review"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}