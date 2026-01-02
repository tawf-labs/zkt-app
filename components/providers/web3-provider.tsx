"use client";

import { createContext, useContext, type ReactNode, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSignMessage, WagmiProvider, type Config, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider, defaultConfig, darkTheme, useConnectModal } from "@xellar/kit";
import axios from "axios";
import { baseSepolia } from "viem/chains";
import { pad, toHex } from "viem";
import { getClientConfig } from "@/lib/client-config";
import { useIDRXBalance } from "@/hooks/useIDRXBalance";
import { CONTRACT_ADDRESSES, MockIDRXABI } from "@/lib/abi";
import { DONATION_CONTRACT_ADDRESS, DonationABI } from "@/lib/donate";
import { handleTransactionError, handleWalletError } from "@/lib/errors";

const queryClient = new QueryClient();

type DonationParams = {
	poolId: bigint;
	campaignTitle: string;
	amountIDRX: bigint;
};

type WalletContextType = {
	address: string | undefined;
	isConnected: boolean;
	balance: string;
	idrxBalance: bigint | undefined;
	formattedIdrxBalance: string;
	connect: () => Promise<void>;
	disconnect: () => void;
	donate: (params: DonationParams) => Promise<{ txHash: string }>;
	isDonating: boolean;
};

const WalletContext = createContext<WalletContextType>({
	address: undefined,
	isConnected: false,
	balance: "0",
	idrxBalance: undefined,
	formattedIdrxBalance: "0",
	connect: async () => {
		console.warn("Connect function should be triggered by XellarKit UI components.");
	},
	disconnect: () => {},
	donate: async () => ({ txHash: "0x0" }),
	isDonating: false,
});

export const useWallet = () => useContext(WalletContext);

// Inner component to handle context logic and wagmi hooks
function WalletStateController({ children }: { children: ReactNode }) {
	const { toast } = useToast();
	const [isDonating, setIsDonating] = useState(false);

	const { address: wagmiAddress, isConnected: wagmiIsConnected, status: wagmiStatus } = useAccount();
	const { data: wagmiBalanceData } = useBalance({ address: wagmiAddress });
	const { disconnect: wagmiDisconnect } = useDisconnect();
	const { signMessageAsync } = useSignMessage();
	
	// Get real IDRX balance from blockchain
	const { balance: idrxBalance, formattedBalance: formattedIdrxBalance, refetch: refetchBalance } = useIDRXBalance();
	
	// Contract write hooks for donation flow
	const { writeContractAsync } = useWriteContract();

	const address = wagmiAddress;
	const isConnected = wagmiIsConnected;
	const balance = wagmiBalanceData?.formatted ?? "0";

	const { open } = useConnectModal();

	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

	const signAuthMessage = async () => {
		// Check if access token already exists
		const existingToken = localStorage.getItem("access_token");
		if (existingToken) {
			return;
		}
		try {
			const response = await axios.post(`${baseUrl}/auth/request-message`, {
				wallet_address: address,
			});

			const { message } = response.data;
			const signature = await signMessageAsync({ message });

			const signatureResponse = await axios.post(`${baseUrl}/auth/verify`, {
				message: message,
				signature: signature,
				wallet_address: address,
			});

			const { access_token } = signatureResponse.data;
			localStorage.setItem("access_token", access_token);
		} catch (error) {
			console.error("Error requesting or signing message:", error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to authenticate wallet",
			});
		}
	};

	useEffect(() => {
		if (wagmiStatus === "connected") {
			// TODO: fix this
			// signAuthMessage();
		} else if (wagmiStatus === "disconnected") {
		}
	}, [wagmiStatus, address, toast]);

	const donate = async (params: DonationParams): Promise<{ txHash: string }> => {
		const { poolId, campaignTitle, amountIDRX } = params;
		
		// Validation
		if (!amountIDRX || amountIDRX <= BigInt(0)) {
			handleWalletError(new Error("Invalid amount"), { toast });
			throw new Error("Invalid amount");
		}
		if (!isConnected || !address) {
			handleWalletError(new Error("not-connected"), { toast });
			throw new Error("Wallet not connected");
		}
		if (idrxBalance && amountIDRX > idrxBalance) {
			handleWalletError(new Error("insufficient-balance"), { toast });
			throw new Error("Insufficient IDRX balance");
		}
		
		setIsDonating(true);
		
		try {
			// Step 1: Approve token to Donation contract
			toast({
				title: "Approval Required",
				description: "Please approve the contract to spend your IDRX tokens",
			});
			
			const approvalTxHash = await writeContractAsync({
				address: CONTRACT_ADDRESSES.MockIDRX,
				abi: MockIDRXABI,
				functionName: "approve",
				args: [DONATION_CONTRACT_ADDRESS, amountIDRX],
			});
			
			// Add small delay to ensure approval is processed
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			toast({
				title: "Approval Confirmed",
				description: "Now processing your donation...",
			});
			
			// Step 2: Execute donation
			// Convert numeric poolId to bytes32
			const campaignIdBytes32 = pad(toHex(BigInt(poolId.toString().replace('0x', ''), 16)), { size: 32 });
			
			const donateTxHash = await writeContractAsync({
				address: DONATION_CONTRACT_ADDRESS as `0x${string}`,
				abi: DonationABI,
				functionName: "donate",
				args: [campaignIdBytes32, amountIDRX],
			});
			
			toast({
				title: "Donation Successful! 🎉",
				description: `You donated ${amountIDRX.toString()} IDRX to ${campaignTitle}`,
			});
			
			// Refetch balance after successful donation
			await refetchBalance();
			
			return { txHash: donateTxHash };
		} catch (error: any) {
			console.error("❌ Donation error details:", {
				message: error?.message,
				code: error?.code,
				reason: error?.reason,
				data: error?.data,
				cause: error?.cause,
				fullError: JSON.stringify(error, null, 2),
			});
			handleTransactionError(error, { toast, action: "donate" });
			throw error;
		} finally {
			setIsDonating(false);
		}
	};

	const connect = async () => {
		console.warn("Programmatic connect via context is not standard with XellarKit. Please use XellarKit's UI components.");
		toast({
			variant: "default",
			title: "Connect Wallet",
			description: "Please use the dedicated UI button to connect your wallet.",
		});
		open();
	};

	const disconnect = () => {
		wagmiDisconnect();
		// Remove the access token from localStorage when disconnecting
		localStorage.removeItem("access_token");
		console.log("Wallet disconnect initiated via context");
		toast({
			title: "Wallet disconnected",
			description: "Your wallet has been disconnected.",
		});
	};

	return (
		<WalletContext.Provider
			value={{
				address,
				isConnected,
				balance,
				idrxBalance,
				formattedIdrxBalance,
				connect,
				disconnect,
				donate,
				isDonating,
			}}
		>
			{children}
		</WalletContext.Provider>
	);
}

export function WalletProvider({ children }: { children: ReactNode }) {
	const [isClient, setIsClient] = useState(false);
	const [clientConfig, setClientConfig] = useState<Config | null>(null);

	useEffect(() => {
		setIsClient(true); // mark client
		setClientConfig(getClientConfig()); // safe to call browser-only APIs here
	}, []);

	if (!isClient || !clientConfig) return null; // prevent SSR and invalid config

	return (
		<WagmiProvider config={clientConfig}>
			<QueryClientProvider client={queryClient}>
				<XellarKitProvider theme={darkTheme}>
					<WalletStateController>{children}</WalletStateController>
				</XellarKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}