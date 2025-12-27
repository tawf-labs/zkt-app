// Smart Contract Constants

// Multisig admin address - controls campaign creation and admin functions
export const MULTISIG_ADMIN_ADDRESS = '0xD264BE80817EAfaC5F7575698913FEc4cB38a016' as const;

// Multisig signers - individual addresses that can propose transactions via Safe
export const MULTISIG_SIGNERS = [
  '0xeF4DB09D536439831FEcaA33fE4250168976535E',
  // Add other signer addresses here as needed
] as const;

// Role hashes (keccak256 of role names)
export const ADMIN_ROLE = '0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775' as const;
export const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000' as const;

// Helper function to check if an address is the multisig admin
export function isMultisigAdmin(address: string | undefined): boolean {
  if (!address) return false;
  return address.toLowerCase() === MULTISIG_ADMIN_ADDRESS.toLowerCase();
}

// Helper function to check if an address is a multisig signer
export function isMultisigSigner(address: string | undefined): boolean {
  if (!address) return false;
  const lowerAddress = address.toLowerCase();
  return MULTISIG_SIGNERS.some(signer => signer.toLowerCase() === lowerAddress);
}

// Helper function to check if address can propose admin actions
// Returns true if address is either the multisig itself OR one of the signers
export function canProposeAdminAction(address: string | undefined): boolean {
  return isMultisigAdmin(address) || isMultisigSigner(address);
}

// Helper function to check if an address has admin role (can be extended for role-based access)
export function hasAdminRole(address: string | undefined): boolean {
  return isMultisigAdmin(address);
}
