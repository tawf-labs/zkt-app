# Quick Reference: Smart Contract Integration

## Quick Start

### 1. Faucet Integration
```typescript
import { useFaucet } from '@/hooks/useFaucet';

function MyComponent() {
  const {
    claimFaucet,
    canClaim,
    timeUntilNextClaim,
    faucetAmount,
    isLoading,
  } = useFaucet();

  return (
    <button 
      onClick={claimFaucet}
      disabled={!canClaim || isLoading}
    >
      Claim {faucetAmount ? formatIDRX(faucetAmount) : '100'} IDRX
    </button>
  );
}
```

### 2. Check IDRX Balance
```typescript
import { useIDRXBalance } from '@/hooks/useIDRXBalance';

function BalanceDisplay() {
  const { balance, formattedBalance, isLoading } = useIDRXBalance();
  
  return <div>{formattedBalance} IDRX</div>;
}
```

### 3. Admin Mint Tokens
```typescript
import { useAdminMint } from '@/hooks/useAdminMint';

function AdminPanel() {
  const { adminMint, isAdmin, isLoading } = useAdminMint();
  
  if (!isAdmin) return <div>Unauthorized</div>;
  
  const handleMint = () => {
    adminMint('0x...recipientAddress', 1000); // Mint 1000 IDRX
  };
  
  return <button onClick={handleMint}>Mint Tokens</button>;
}
```

### 4. Create Campaign (Admin Only)
```typescript
import { useCreateCampaign } from '@/hooks/useCreateCampaign';

function CreateCampaignForm() {
  const { createCampaign, isMultisigAdmin, isLoading } = useCreateCampaign();
  
  const handleSubmit = async () => {
    await createCampaign({
      title: "Help Build School",
      description: "...",
      category: "Education",
      location: "Jakarta",
      goal: 10000,
      organizationName: "NGO Name",
      organizationVerified: true,
      imageFiles: [...],
      tags: ["education", "children"],
      startTime: Date.now() / 1000,
      endTime: (Date.now() / 1000) + 2592000, // 30 days
    });
  };
  
  return (
    <div>
      {isMultisigAdmin && <p>✅ Admin Mode: Will create on blockchain</p>}
      {!isMultisigAdmin && <p>⚠️ Campaign will be submitted for approval</p>}
      <button onClick={handleSubmit}>Create Campaign</button>
    </div>
  );
}
```

### 5. Display Campaigns (DB + Blockchain)
```typescript
import { useCampaigns } from '@/hooks/useCampaigns';

function CampaignList() {
  const { campaigns, isLoading, refetch } = useCampaigns([0, 1, 2, 3, 4]);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {campaigns.map((campaign) => (
        <div key={campaign.id.toString()}>
          <h3>{campaign.title}</h3>
          <p>{campaign.description}</p>
          <img src={campaign.imageUrls[0]} alt={campaign.title} />
          <p>Goal: {formatIDRX(campaign.targetAmount)} IDRX</p>
          <p>Raised: {formatIDRX(campaign.currentAmount)} IDRX</p>
          <p>Location: {campaign.location}</p>
          <p>Tags: {campaign.tags.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}
```

### 6. Role Management (Admin Only)
```typescript
import { useRoleManagement } from '@/hooks/useRoleManagement';
import { ADMIN_ROLE } from '@/lib/constants';

function RoleManager() {
  const { grantRole, revokeRole, useHasRole, isAdmin } = useRoleManagement();
  const { data: hasAdminRole } = useHasRole(ADMIN_ROLE, '0x...address');
  
  if (!isAdmin) return null;
  
  return (
    <div>
      <button onClick={() => grantRole(ADMIN_ROLE, '0x...address')}>
        Grant Admin
      </button>
      <button onClick={() => revokeRole(ADMIN_ROLE, '0x...address')}>
        Revoke Admin
      </button>
    </div>
  );
}
```

## Contract Constants

```typescript
import { 
  MULTISIG_ADMIN_ADDRESS, 
  ADMIN_ROLE, 
  DEFAULT_ADMIN_ROLE,
  isMultisigAdmin 
} from '@/lib/constants';

// Check if address is admin
const isAdmin = isMultisigAdmin(userAddress);

// Use role constants
const adminRole = ADMIN_ROLE; // 0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775
```

## Contract Addresses

```typescript
import { CONTRACT_ADDRESSES } from '@/lib/abi';

CONTRACT_ADDRESSES.MockIDRX // 0x8790ec119e8fcdc46305246662ddf6a4a5d9ad04
CONTRACT_ADDRESSES.ZKTCore // 0x827a10a3bcc12c315774e134235046f378c7699d
```

## Helper Functions

```typescript
import { formatIDRX, parseIDRX, formatAddress } from '@/lib/abi';

// Format wei to readable IDRX
const readable = formatIDRX(BigInt("1000000000000000000")); // "1"

// Parse IDRX to wei
const wei = parseIDRX(100); // BigInt("100000000000000000000")

// Shorten address
const short = formatAddress("0x1234...5678"); // "0x1234...5678"
```

## Common Patterns

### Check Admin Status Before Action
```typescript
import { isMultisigAdmin } from '@/lib/constants';
import { useAccount } from 'wagmi';

function AdminOnlyButton() {
  const { address } = useAccount();
  const canPerformAction = isMultisigAdmin(address);
  
  return (
    <button disabled={!canPerformAction}>
      {canPerformAction ? 'Admin Action' : 'Unauthorized'}
    </button>
  );
}
```

### Wait for Transaction Confirmation
```typescript
const { hash, isConfirmed } = useFaucet();

useEffect(() => {
  if (isConfirmed) {
    console.log('Transaction confirmed!');
    // Refresh data, show success message, etc.
  }
}, [isConfirmed]);
```

### Handle Loading States
```typescript
const { isLoading } = useFaucet();

return (
  <button disabled={isLoading}>
    {isLoading ? 'Processing...' : 'Claim IDRX'}
  </button>
);
```

## Contract Events

Listen to events using wagmi's `useWatchContractEvent`:

```typescript
import { useWatchContractEvent } from 'wagmi';
import { CONTRACT_ADDRESSES, MockIDRXABI } from '@/lib/abi';

function EventListener() {
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.MockIDRX,
    abi: MockIDRXABI,
    eventName: 'FaucetClaimed',
    onLogs(logs) {
      console.log('Faucet claimed:', logs);
    },
  });
}
```

### Available Events
- `Transfer(from, to, value)`
- `Approval(owner, spender, value)`
- `FaucetClaimed(user, amount, nextClaimTime)`
- `AdminMinted(to, amount, admin)`
- `RoleGranted(role, account, sender)`
- `RoleRevoked(role, account, sender)`

## Testing

### Test Multisig Admin Functions
1. Use multisig wallet: `0xD264BE80817EAfaC5F7575698913FEc4cB38a016`
2. Call admin functions (mint, grant roles)
3. Verify transactions on BaseScan

### Test Faucet
1. Connect any wallet
2. Click "Claim IDRX"
3. Wait 24 hours between claims
4. Verify balance increases

### Test Campaign Creation
- **As Admin**: Creates on blockchain
- **As User**: Saves to database only

## Troubleshooting

### "Unauthorized" Error
- Ensure you're connected with the multisig admin wallet
- Check `MULTISIG_ADMIN_ADDRESS` matches your wallet

### "Cannot Claim" Error
- Wait 24 hours between faucet claims
- Check `timeUntilNextClaim` for countdown

### Campaign Not Showing
- Check Supabase connection
- Verify campaign created successfully in DB
- Check blockchain data with pool ID

### Transaction Failing
- Ensure sufficient ETH for gas
- Check wallet is on Base Sepolia network
- Verify contract addresses are correct
