"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Coins, Users, AlertTriangle } from "lucide-react";
import { useAdminMint } from "@/hooks/useAdminMint";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { isMultisigAdmin, ADMIN_ROLE } from "@/lib/constants";
import { formatIDRX } from "@/lib/abi";

export default function AdminDashboard() {
  const { address, isConnected } = useAccount();
  const { adminMint, isAdmin: canMint, isLoading: isMinting } = useAdminMint();
  const { grantRole, revokeRole, isAdmin: canManageRoles, isLoading: isManagingRoles } = useRoleManagement();

  // Mint form state
  const [mintAddress, setMintAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");

  // Role management state
  const [roleAddress, setRoleAddress] = useState("");

  // Check if user is admin
  const isAdmin = isMultisigAdmin(address);

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please connect your wallet to access the admin dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Unauthorized. Only the multisig admin can access this dashboard.
            <br />
            <span className="text-xs mt-2 block">Connected: {address}</span>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintAddress || !mintAmount) return;
    
    const amount = parseFloat(mintAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid amount");
      return;
    }

    await adminMint(mintAddress, amount);
    setMintAddress("");
    setMintAmount("");
  };

  const handleGrantRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleAddress) return;
    await grantRole(ADMIN_ROLE, roleAddress);
    setRoleAddress("");
  };

  const handleRevokeRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleAddress) return;
    await revokeRole(ADMIN_ROLE, roleAddress);
    setRoleAddress("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage IDRX tokens, roles, and system administration
        </p>
        <div className="mt-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-sm text-green-900 dark:text-green-100">
            ✅ Authenticated as Admin: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
      </div>

      <Tabs defaultValue="mint" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mint">
            <Coins className="h-4 w-4 mr-2" />
            Mint Tokens
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Users className="h-4 w-4 mr-2" />
            Role Management
          </TabsTrigger>
        </TabsList>

        {/* Mint Tokens Tab */}
        <TabsContent value="mint">
          <Card>
            <CardHeader>
              <CardTitle>Mint IDRX Tokens</CardTitle>
              <CardDescription>
                Create new IDRX tokens and send them to any address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMint} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mintAddress">Recipient Address</Label>
                  <Input
                    id="mintAddress"
                    placeholder="0x..."
                    value={mintAddress}
                    onChange={(e) => setMintAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mintAmount">Amount (IDRX)</Label>
                  <Input
                    id="mintAmount"
                    type="number"
                    placeholder="1000"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    required
                    min="0"
                    step="any"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the amount of IDRX tokens to mint
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={isMinting || !mintAddress || !mintAmount}
                  className="w-full"
                >
                  {isMinting ? "Minting..." : "Mint Tokens"}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">
                  ℹ️ Minting Information
                </h4>
                <ul className="text-xs space-y-1 text-blue-800 dark:text-blue-200">
                  <li>• Only admins can mint new tokens</li>
                  <li>• Tokens are created instantly on confirmation</li>
                  <li>• No limit on minting amount</li>
                  <li>• Transaction will emit AdminMinted event</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Management Tab */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>
                Grant or revoke admin roles for other addresses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="roleAddress">Address</Label>
                <Input
                  id="roleAddress"
                  placeholder="0x..."
                  value={roleAddress}
                  onChange={(e) => setRoleAddress(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={handleGrantRole}
                  disabled={isManagingRoles || !roleAddress}
                  variant="default"
                >
                  {isManagingRoles ? "Processing..." : "Grant Admin Role"}
                </Button>
                
                <Button 
                  onClick={handleRevokeRole}
                  disabled={isManagingRoles || !roleAddress}
                  variant="destructive"
                >
                  {isManagingRoles ? "Processing..." : "Revoke Admin Role"}
                </Button>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 text-yellow-900 dark:text-yellow-100">
                  ⚠️ Role Management Warning
                </h4>
                <ul className="text-xs space-y-1 text-yellow-800 dark:text-yellow-200">
                  <li>• Granting admin role gives full contract control</li>
                  <li>• Admins can mint tokens and manage other roles</li>
                  <li>• Be careful when revoking roles</li>
                  <li>• Cannot revoke DEFAULT_ADMIN_ROLE from yourself</li>
                </ul>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-sm mb-3">Available Roles</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ADMIN_ROLE:</span>
                    <code className="text-xs bg-background px-2 py-1 rounded">
                      0xa498...1775
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DEFAULT_ADMIN_ROLE:</span>
                    <code className="text-xs bg-background px-2 py-1 rounded">
                      0x0000...0000
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Admin Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Base Sepolia</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Contract</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono">0x8790...ad04</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
