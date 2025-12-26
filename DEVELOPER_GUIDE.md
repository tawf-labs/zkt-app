# Quick Developer Reference

## How to Grant Sharia Council Role

Run this in a script or console connected to your smart contract:

```javascript
// Using ethers.js or wagmi
const SHARIA_COUNCIL_ROLE = ethers.utils.id("SHARIA_COUNCIL_ROLE");
await zktCore.grantRole(SHARIA_COUNCIL_ROLE, "YOUR_ADDRESS_HERE");
```

Or use the contract's `grantRole` function directly through a blockchain explorer.

---

## How to Test the Full Flow

### 1. Setup
```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

### 2. Get Testnet IDRX
- Go to `/faucet` (if implemented)
- Or use the smart contract's faucet function
- Get at least 1000 IDRX for testing

### 3. Create a Proposal
- Navigate to `/campaigns/new`
- Fill in:
  - Title: "Medical Supplies for Gaza"
  - Description: "Urgent medical supplies needed..."
  - Funding Goal: 100000 (100k IDRX)
  - Campaign Type: Zakat
  - Add checklist items like:
    - "Funds distributed to eligible recipients"
    - "Verified humanitarian organization"
    - "Transparent fund allocation"
- Submit and wait for transaction

### 4. Review as Sharia Council
- Grant yourself the role (see above)
- Go to `/dashboard/auditor`
- Review the proposal
- Check the Zakat checklist
- Click "Approve (Compliant)"

### 5. Community Vote
- Go to `/governance`
- Find your approved proposal
- Vote "For" the proposal
- Wait for voting period to end

### 6. Donate
- Go to `/campaigns/[id]` (replace with your campaign ID)
- Enter donation amount (e.g., 50 IDRX)
- Submit donation
- NFT receipt minted automatically

### 7. Check Donor Dashboard
- Go to `/dashboard/donor`
- See your NFT receipt
- Check voting power increased
- View receipt on BaseScan

---

## Common Issues & Solutions

### Issue: "Connect wallet" even though wallet is connected
**Solution:** Refresh the page or disconnect and reconnect wallet

### Issue: Transaction failing with "execution reverted"
**Solution:** Check you have:
- Enough IDRX balance
- Approved IDRX spending (if needed)
- Correct role (for Sharia Council functions)

### Issue: Proposal not appearing in governance
**Solution:** 
- Wait for blockchain confirmation (~2-5 seconds)
- Refresh the page
- Check transaction succeeded on BaseScan

### Issue: Can't access Sharia Council dashboard
**Solution:** Grant yourself the role using contract's `grantRole()` function

---

## Environment Variables

Make sure these are set in `.env.local`:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_XELLAR_APP_ID=your_app_id
NEXT_PUBLIC_XELLAR_ENV=sandbox
```

---

## Contract Interaction Examples

### Read Data (No Gas):
```typescript
// Get proposal
const proposal = await readContract({
  address: CONTRACT_ADDRESSES.ZKTCore,
  abi: ZKTCoreABI,
  functionName: 'getProposal',
  args: [BigInt(0)],
});

// Get pool
const pool = await readContract({
  address: CONTRACT_ADDRESSES.ZKTCore,
  abi: ZKTCoreABI,
  functionName: 'getPool',
  args: [BigInt(0)],
});
```

### Write Data (Requires Gas):
```typescript
// Create proposal
await writeContract({
  address: CONTRACT_ADDRESSES.ZKTCore,
  abi: ZKTCoreABI,
  functionName: 'createProposal',
  args: [
    "Title",
    "Description",
    BigInt(100000),
    false, // isEmergency
    0, // campaignType
    ["Checklist item 1", "Checklist item 2"],
  ],
});

// Donate
await writeContract({
  address: CONTRACT_ADDRESSES.ZKTCore,
  abi: ZKTCoreABI,
  functionName: 'donate',
  args: [BigInt(0), BigInt(50)], // poolId, amount
});

// Vote
await writeContract({
  address: CONTRACT_ADDRESSES.ZKTCore,
  abi: ZKTCoreABI,
  functionName: 'castVote',
  args: [BigInt(0), 1], // proposalId, support (0=Against, 1=For, 2=Abstain)
});
```

---

## Useful Commands

```bash
# Check TypeScript errors
npx tsc --noEmit

# Build for production
pnpm build

# Run production build locally
pnpm start

# Format code
pnpm format

# Lint
pnpm lint
```

---

## BaseScan Links

- **Base Sepolia Explorer:** https://sepolia.basescan.org
- **Your ZKTCore Contract:** https://sepolia.basescan.org/address/0xabb2dF0EB530C8317845f6dcD54A3B2fCA9cD6A9
- **MockIDRX Token:** https://sepolia.basescan.org/token/0xbc00d53Fd6208abf820529A9e1a971a01D41ef43

---

## Debug Tips

1. **Check wallet balance:** Make sure you have IDRX
2. **Check transaction logs:** Use BaseScan to see what happened
3. **Console logs:** Open browser DevTools to see errors
4. **Network tab:** Check if API calls are working
5. **React Query DevTools:** Install to debug hook queries

---

## Production Deployment

### Vercel (Recommended):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Variables on Vercel:
Add these in Project Settings → Environment Variables:
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
- `NEXT_PUBLIC_XELLAR_APP_ID`
- `NEXT_PUBLIC_XELLAR_ENV`

---

**For more detailed implementation info, see:**
- `IMPLEMENTATION_GUIDE.md` - Complete implementation details
- `SHOWCASE_READY.md` - What's been completed
- `POOL_INTEGRATION_SUMMARY.md` - Pool system migration notes
