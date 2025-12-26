// Smart Contract ABIs and Configuration for Base Sepolia Network
// Pool-Based System - Updated December 26, 2025

export const CONTRACT_ADDRESSES = {
  ZKTCore: '0xabb2dF0EB530C8317845f6dcD54A3B2fCA9cD6A9' as const,
  MockIDRX: '0xbc00d53Fd6208abf820529A9e1a971a01D41ef43' as const,
  DonationReceiptNFT: '0x2c1e3b27A8Cf82C34d7F81c035f0f0A6Ef01462D' as const,
  VotingToken: '0xf88d560836AD8193c33c534FF997388489C9dc08' as const,
  ProposalManager: '0x19dee77af736bbee95f8bcb028a87df102faed25' as const,
  VotingManager: '0xffdaee55f3904e11a9bddd95d2e9c0716551bcc1' as const,
  ShariaReviewManager: '0x19725c1dee1fe40352da4a5590efe84b7033a6a9' as const,
  PoolManager: '0x23e44ecb31e71acc10633da7af6e73e5092d22e0' as const,
} as const;

// Pool-Based ZKTCore ABI with Comprehensive Governance
export const ZKTCoreABI = [
  {
    inputs: [
      { internalType: 'address', name: '_idrxToken', type: 'address' },
      { internalType: 'address', name: '_receiptNFT', type: 'address' },
      { internalType: 'address', name: '_votingToken', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'AccessControlBadConfirmation',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'bytes32', name: 'neededRole', type: 'bytes32' },
    ],
    name: 'AccessControlUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { indexed: true, internalType: 'bytes32', name: 'previousAdminRole', type: 'bytes32' },
      { indexed: true, internalType: 'bytes32', name: 'newAdminRole', type: 'bytes32' },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'KYC_ORACLE_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ORGANIZER_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SHARIA_COUNCIL_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'proposalId', type: 'uint256' }],
    name: 'cancelProposal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'proposalId', type: 'uint256' },
      { internalType: 'uint8', name: 'support', type: 'uint8' },
    ],
    name: 'castVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'checkAndCreateBundle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'proposalId', type: 'uint256' }],
    name: 'createCampaignPool',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: 'title', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'uint256', name: 'fundingGoal', type: 'uint256' },
      { internalType: 'bool', name: 'isEmergency', type: 'bool' },
      { internalType: 'bytes32', name: 'mockZKKYCProof', type: 'bytes32' },
      { internalType: 'string[]', name: 'zakatChecklistItems', type: 'string[]' },
    ],
    name: 'createProposal',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256[]', name: 'proposalIds', type: 'uint256[]' }],
    name: 'createShariaReviewBundle',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'poolId', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'donate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'proposalId', type: 'uint256' }],
    name: 'finalizeCommunityVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'bundleId', type: 'uint256' }],
    name: 'finalizeShariaBundle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'bundleId', type: 'uint256' }],
    name: 'getBundle',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'bundleId', type: 'uint256' },
          { internalType: 'uint256[]', name: 'proposalIds', type: 'uint256[]' },
          { internalType: 'uint256', name: 'submittedAt', type: 'uint256' },
          { internalType: 'bool', name: 'finalized', type: 'bool' },
          { internalType: 'uint256', name: 'approvalCount', type: 'uint256' },
        ],
        internalType: 'struct ShariaReviewManager.ShariaReviewBundle',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'poolId', type: 'uint256' },
      { internalType: 'address', name: 'donor', type: 'address' },
    ],
    name: 'getDonorContribution',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'poolId', type: 'uint256' }],
    name: 'getPool',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'poolId', type: 'uint256' },
          { internalType: 'uint256', name: 'proposalId', type: 'uint256' },
          { internalType: 'address', name: 'organizer', type: 'address' },
          { internalType: 'uint256', name: 'fundingGoal', type: 'uint256' },
          { internalType: 'uint256', name: 'raisedAmount', type: 'uint256' },
          { internalType: 'enum IProposalManager.CampaignType', name: 'campaignType', type: 'uint8' },
          { internalType: 'string', name: 'campaignTitle', type: 'string' },
          { internalType: 'bool', name: 'isActive', type: 'bool' },
          { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
          { internalType: 'address[]', name: 'donors', type: 'address[]' },
          { internalType: 'bool', name: 'fundsWithdrawn', type: 'bool' },
        ],
        internalType: 'struct PoolManager.CampaignPool',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'poolId', type: 'uint256' }],
    name: 'getPoolDonors',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPoolManagerAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'proposalId', type: 'uint256' }],
    name: 'getProposal',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'proposalId', type: 'uint256' },
          { internalType: 'address', name: 'organizer', type: 'address' },
          { internalType: 'string', name: 'title', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'uint256', name: 'fundingGoal', type: 'uint256' },
          { internalType: 'enum IProposalManager.KYCStatus', name: 'kycStatus', type: 'uint8' },
          { internalType: 'bool', name: 'isEmergency', type: 'bool' },
          { internalType: 'bytes32', name: 'mockZKKYCProof', type: 'bytes32' },
          { internalType: 'string', name: 'kycNotes', type: 'string' },
          { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
          { internalType: 'uint256', name: 'communityVoteStart', type: 'uint256' },
          { internalType: 'uint256', name: 'communityVoteEnd', type: 'uint256' },
          { internalType: 'uint256', name: 'votesFor', type: 'uint256' },
          { internalType: 'uint256', name: 'votesAgainst', type: 'uint256' },
          { internalType: 'uint256', name: 'votesAbstain', type: 'uint256' },
          { internalType: 'enum IProposalManager.ProposalStatus', name: 'status', type: 'uint8' },
          { internalType: 'enum IProposalManager.CampaignType', name: 'campaignType', type: 'uint8' },
          { internalType: 'uint256', name: 'poolId', type: 'uint256' },
          { internalType: 'string[]', name: 'zakatChecklistItems', type: 'string[]' },
        ],
        internalType: 'struct IProposalManager.Proposal',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'proposalId', type: 'uint256' }],
    name: 'getProposalChecklistItems',
    outputs: [{ internalType: 'string[]', name: '', type: 'string[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getProposalManagerAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getShariaReviewManagerAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getVotingManagerAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'grantKYCOracleRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'grantOrganizerRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'grantShariaCouncilRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'grantVotingPower',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'idrxToken',
    outputs: [{ internalType: 'contract MockIDRX', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolManager',
    outputs: [{ internalType: 'contract PoolManager', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proposalCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proposalManager',
    outputs: [{ internalType: 'contract ProposalManager', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'receiptNFT',
    outputs: [{ internalType: 'contract DonationReceiptNFT', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'callerConfirmation', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'bundleId', type: 'uint256' },
      { internalType: 'uint256', name: 'proposalId', type: 'uint256' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
      { internalType: 'enum IProposalManager.CampaignType', name: 'campaignType', type: 'uint8' },
      { internalType: 'bytes32', name: 'mockZKReviewProof', type: 'bytes32' },
    ],
    name: 'reviewProposal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'revokeVotingPower',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_passThreshold', type: 'uint256' }],
    name: 'setPassThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_quorumPercentage', type: 'uint256' }],
    name: 'setQuorumPercentage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_quorum', type: 'uint256' }],
    name: 'setShariaQuorum',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_votingPeriod', type: 'uint256' }],
    name: 'setVotingPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'shariaReviewManager',
    outputs: [{ internalType: 'contract ShariaReviewManager', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'proposalId', type: 'uint256' }],
    name: 'submitForCommunityVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'proposalId', type: 'uint256' },
      { internalType: 'enum IProposalManager.KYCStatus', name: 'newStatus', type: 'uint8' },
      { internalType: 'string', name: 'notes', type: 'string' },
    ],
    name: 'updateKYCStatus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'votingManager',
    outputs: [{ internalType: 'contract VotingManager', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'votingToken',
    outputs: [{ internalType: 'contract VotingToken', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'poolId', type: 'uint256' }],
    name: 'withdrawFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const MockIDRXABI = [
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address', internalType: 'address' },
      { name: 'spender', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'faucet',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'canClaimFaucet',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'lastClaimTime',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: 'to', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferFrom',
    inputs: [
      { name: 'from', type: 'address', internalType: 'address' },
      { name: 'to', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      { name: 'owner', type: 'address', indexed: true, internalType: 'address' },
      { name: 'spender', type: 'address', indexed: true, internalType: 'address' },
      { name: 'value', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true, internalType: 'address' },
      { name: 'to', type: 'address', indexed: true, internalType: 'address' },
      { name: 'value', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
] as const;

// VotingToken ABI (ERC20-based governance token)
export const VotingTokenABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

// DonationReceiptNFT ABI (Soulbound NFT for donation receipts)
export const DonationReceiptNFTABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tokenOfOwnerByIndex',
    inputs: [
      { name: 'owner', type: 'address', internalType: 'address' },
      { name: 'index', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tokenURI',
    inputs: [{ name: 'tokenId', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getReceiptData',
    inputs: [{ name: 'tokenId', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct DonationReceiptNFT.Receipt',
        components: [
          { name: 'poolId', type: 'uint256', internalType: 'uint256' },
          { name: 'donor', type: 'address', internalType: 'address' },
          { name: 'amount', type: 'uint256', internalType: 'uint256' },
          { name: 'timestamp', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
] as const;

// Helper functions for formatting blockchain data
export function formatIDRX(amount: bigint): string {
  const value = Number(amount) / 1e18;
  return value.toLocaleString('id-ID', { maximumFractionDigits: 0 });
}

export function parseIDRX(amount: number): bigint {
  return BigInt(Math.floor(amount * 1e18));
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
