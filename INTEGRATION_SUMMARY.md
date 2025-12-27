# Smart Contract Integration Summary

## Overview
This document summarizes the integration of the MockIDRX ERC20 token contract with faucet functionality into the ZKT App.

## Contract Details

### MockIDRX Token Contract
- **Network**: Base Sepolia Testnet
- **Contract Address**: `0x8790ec119e8fcdc46305246662ddf6a4a5d9ad04`
- **Multisig Admin**: `0xD264BE80817EAfaC5F7575698913FEc4cB38a016`

### Contract Features
1. **ERC20 Standard Functions**
   - `transfer`, `transferFrom`, `approve`, `allowance`
   - `balanceOf`, `totalSupply`, `decimals`, `name`, `symbol`

2. **Faucet Functionality**
   - `faucet()` - Claim free IDRX tokens
   - `canClaimFaucet(address)` - Check if address can claim
   - `timeUntilNextClaim(address)` - Get time until next claim
   - `lastFaucetClaim(address)` - Get last claim timestamp
   - `FAUCET_AMOUNT` - Amount per claim
   - `FAUCET_COOLDOWN` - Cooldown period (24 hours)

3. **Admin Functions**
   - `adminMint(address to, uint256 amount)` - Mint tokens (admin only)
   - Role-based access control (ADMIN_ROLE, DEFAULT_ADMIN_ROLE)

## Integration Components

### 1. ABI Updates
**File**: `/lib/abi.ts`
- ✅ Updated MockIDRXABI with complete contract interface
- Includes all errors, events, and functions
- Properly typed for TypeScript/Wagmi integration

### 2. Constants
**File**: `/lib/constants.ts` (NEW)
- Exported `MULTISIG_ADMIN_ADDRESS`
- Role constants: `ADMIN_ROLE`, `DEFAULT_ADMIN_ROLE`
- Helper functions: `isMultisigAdmin()`, `hasAdminRole()`

### 3. Custom Hooks

#### useFaucet Hook
**File**: `/hooks/useFaucet.ts` (NEW)
- Claims IDRX from faucet
- Checks eligibility (`canClaimFaucet`)
- Displays countdown timer (`timeUntilNextClaim`)
- Shows faucet amount and cooldown period
- Auto-refreshes on transaction confirmation

**Usage**:
```typescript
const {
  claimFaucet,
  canClaim,
  timeUntilNextClaim,
  faucetAmount,
  faucetCooldown,
  isLoading,
  isConfirmed,
  hash,
} = useFaucet();
```

#### useAdminMint Hook
**File**: `/hooks/useAdminMint.ts` (NEW)
- Admin-only token minting
- Validates multisig admin address
- Checks ADMIN_ROLE on-chain
- Input validation for address and amount

**Usage**:
```typescript
const {
  adminMint,
  isAdmin,
  isLoading,
  isConfirmed,
  hash,
} = useAdminMint();

// Mint 1000 IDRX to an address
await adminMint('0x...', 1000);
```

#### useIDRXBalance Hook
**File**: `/hooks/useIDRXBalance.ts`
- ✅ Already compatible with new contract
- Fetches user's IDRX balance
- Auto-refreshes and caches

#### useCampaigns Hook
**File**: `/hooks/useCampaigns.ts`
- ✅ Updated to fetch from both Supabase DB and blockchain
- Merges off-chain metadata with on-chain data
- Displays campaigns with images, tags, and full details

**Key Changes**:
- Added database campaign fetching via `listCampaigns()`
- Merged DB data (title, description, images, tags) with blockchain data (amounts, status)
- Enhanced Campaign interface with `imageUrls[]`, `tags[]`, `campaignId`

#### useCreateCampaign Hook
**File**: `/hooks/useCreateCampaign.ts`
- ✅ Added multisig admin check
- Only admin can create campaigns on blockchain
- Non-admin users save to DB for approval
- Uses constants from `/lib/constants.ts`

**Key Changes**:
- Import `isMultisigAdmin()` helper
- Check admin status before on-chain creation
- Display different messages for admin vs non-admin
- Return `isMultisigAdmin` status

### 4. Updated Pages

#### Faucet Page
**File**: `/app/faucet/page.tsx`
- ✅ Completely refactored to use `useFaucet` hook
- Live countdown timer
- Dynamic faucet amount display
- Better UX with eligibility status
- Transaction hash link to BaseScan

**Features**:
- Shows current balance
- Displays claimable amount
- Real-time countdown to next claim
- Clear eligibility indicators
- Faucet info box with cooldown and amount details

### 5. Campaign Management

#### Database Integration
**File**: `/lib/supabase-client.ts`
- `listCampaigns()` - Fetch all campaigns from DB
- `getCampaignData()` - Fetch single campaign
- `saveCampaignData()` - Save campaign metadata
- `updateCampaignData()` - Update campaign

#### Campaign Flow
1. **Create Campaign** (Admin):
   - Upload images to Pinata
   - Generate campaign ID
   - Save metadata to Supabase
   - Create on blockchain (admin only)
   
2. **Create Campaign** (Non-Admin):
   - Same steps but skips blockchain creation
   - Saved to DB for admin approval

3. **Display Campaigns**:
   - Fetch from DB for metadata
   - Fetch from blockchain for amounts
   - Merge and display unified data

## Access Control

### Multisig Admin Capabilities
- ✅ Create campaigns on blockchain
- ✅ Mint IDRX tokens via `adminMint()`
- ✅ Manage roles (grant/revoke)

### Regular Users
- ✅ Claim from faucet (every 24 hours)
- ✅ View campaigns (DB + blockchain)
- ✅ Donate to campaigns
- ⚠️ Create campaign proposals (saved to DB)

## Testing Checklist

### Faucet
- [ ] Connect wallet
- [ ] Check eligibility status
- [ ] Claim IDRX tokens
- [ ] Verify cooldown timer
- [ ] Wait for transaction confirmation
- [ ] Check updated balance

### Admin Functions
- [ ] Connect with multisig admin wallet
- [ ] Mint tokens to test address
- [ ] Create campaign on blockchain
- [ ] Verify admin role checks

### Campaign Display
- [ ] View campaigns from DB
- [ ] View campaigns from blockchain
- [ ] Verify merged data displays correctly
- [ ] Check images and tags render

### Campaign Creation
- [ ] Create as admin (on-chain)
- [ ] Create as non-admin (DB only)
- [ ] Verify different success messages
- [ ] Check upload progress

## Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Pinata (for image uploads)
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_PINATA_GATEWAY_URL=your_gateway_url

# Wallet Connect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Xellar
NEXT_PUBLIC_XELLAR_APP_ID=your_app_id
NEXT_PUBLIC_XELLAR_ENV=sandbox
```

## Smart Contract Functions Available

### Read Functions
- `balanceOf(address)` → uint256
- `canClaimFaucet(address)` → bool
- `timeUntilNextClaim(address)` → uint256
- `lastFaucetClaim(address)` → uint256
- `FAUCET_AMOUNT()` → uint256
- `FAUCET_COOLDOWN()` → uint256
- `hasRole(bytes32, address)` → bool
- `totalSupply()` → uint256

### Write Functions
- `faucet()` - Claim tokens
- `adminMint(address, uint256)` - Mint tokens (admin)
- `transfer(address, uint256)` - Transfer tokens
- `approve(address, uint256)` - Approve spending
- `transferFrom(address, address, uint256)` - Transfer from

## Next Steps

1. **Deploy to Production**
   - Update contract addresses for mainnet
   - Update multisig admin address if needed
   - Configure production environment variables

2. **Add Features**
   - Admin dashboard for approving campaigns
   - Bulk minting interface
   - Role management UI
   - Campaign analytics from blockchain events

3. **Testing**
   - Comprehensive E2E tests
   - Test all admin functions
   - Test faucet cooldown edge cases
   - Test campaign creation/display

4. **Documentation**
   - Add inline code comments
   - Create user guides
   - Document admin workflows

## Support

For issues or questions:
1. Check console logs for detailed error messages
2. Verify wallet is connected to Base Sepolia
3. Ensure contract addresses are correct
4. Check admin address permissions
