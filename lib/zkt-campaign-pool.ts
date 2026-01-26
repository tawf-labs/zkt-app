// ZKTCampaignPool Contract ABI and Configuration

export const ZKT_CAMPAIGN_POOL_ADDRESS = '0xB2F02d389DC803a9823bDBa4a44B2d58c25738d7' as const;

export const ZKTCampaignPoolABI = [
  {
    inputs: [
      { internalType: 'address', name: '_admin', type: 'address' },
      { internalType: 'address', name: '_token', type: 'address' },
      { internalType: 'address', name: '_receiptNFT', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousAdmin', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newAdmin', type: 'address' }
    ],
    name: 'AdminTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'campaignId', type: 'bytes32' },
      { indexed: false, internalType: 'uint256', name: 'startTime', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'endTime', type: 'uint256' }
    ],
    name: 'CampaignCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'campaignId', type: 'bytes32' }
    ],
    name: 'CampaignClosed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'campaignId', type: 'bytes32' },
      { indexed: true, internalType: 'bytes32', name: 'ngoId', type: 'bytes32' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'Disbursed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [],
    name: 'Paused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [],
    name: 'Unpaused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'campaignId', type: 'bytes32' },
      { indexed: true, internalType: 'address', name: 'donor', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'Donated',
    type: 'event'
  },
  {
    inputs: [],
    name: 'admin',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'receiptNFT',
    outputs: [{ internalType: 'contract IZKTReceiptNFT', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'token',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'campaignId', type: 'bytes32' },
      { internalType: 'uint256', name: 'startTime', type: 'uint256' },
      { internalType: 'uint256', name: 'endTime', type: 'uint256' }
    ],
    name: 'createCampaign',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'campaignId', type: 'bytes32' }],
    name: 'closeCampaign',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'ngoId', type: 'bytes32' },
      { internalType: 'address', name: 'wallet', type: 'address' }
    ],
    name: 'approveNGO',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'campaignId', type: 'bytes32' },
      { internalType: 'bytes32', name: 'ngoId', type: 'bytes32' },
      { internalType: 'uint256', name: 'bps', type: 'uint256' }
    ],
    name: 'setAllocation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'campaignId', type: 'bytes32' }],
    name: 'lockAllocation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'campaignId', type: 'bytes32' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'donate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'campaignId', type: 'bytes32' },
      { internalType: 'bytes32[]', name: 'ngoIds', type: 'bytes32[]' }
    ],
    name: 'disburse',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'string', name: 'pinataCID', type: 'string' }
    ],
    name: 'updateReceiptMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256[]', name: 'tokenIds', type: 'uint256[]' },
      { internalType: 'string', name: 'pinataCID', type: 'string' }
    ],
    name: 'batchUpdateReceiptMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '', type: 'bytes32' }
    ],
    name: 'campaigns',
    outputs: [
      { internalType: 'bool', name: 'exists', type: 'bool' },
      { internalType: 'bool', name: 'allocationLocked', type: 'bool' },
      { internalType: 'bool', name: 'disbursed', type: 'bool' },
      { internalType: 'bool', name: 'closed', type: 'bool' },
      { internalType: 'uint256', name: 'totalRaised', type: 'uint256' },
      { internalType: 'uint256', name: 'startTime', type: 'uint256' },
      { internalType: 'uint256', name: 'endTime', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '', type: 'bytes32' }
    ],
    name: 'approvedNGO',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '', type: 'bytes32' }
    ],
    name: 'ngoWallet',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '', type: 'bytes32' },
      { internalType: 'bytes32', name: '', type: 'bytes32' }
    ],
    name: 'allocationBps',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '', type: 'bytes32' }
    ],
    name: 'totalBps',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'newAdmin', type: 'address' }],
    name: 'transferAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;

/**
 * Helper function to generate campaign ID hash from identifier
 * @param identifier - Unique identifier for the campaign (e.g., "wallet-name-timestamp")
 * @returns bytes32 hash
 */
export const createCampaignIdHash = (identifier: string): `0x${string}` => {
  // This is a helper - actual hash generation should happen on client side
  return identifier as `0x${string}`;
};
