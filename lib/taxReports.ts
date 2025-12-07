import type { DonationReceipt } from "@/hooks/useDonationReceipts";
import { formatIDRX } from "./abi";

export interface YearlyTaxReport {
  year: number;
  totalDonations: bigint;
  donationCount: number;
  deductibleAmount: bigint;
  receipts: DonationReceipt[];
  monthlyBreakdown: MonthlyDonation[];
}

export interface MonthlyDonation {
  month: number;
  monthName: string;
  amount: bigint;
  count: number;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Indonesian tax deduction limit for donations (typically 5% of net income, but we show full amount)
const TAX_DEDUCTION_RATE = 1.0; // 100% for zakat/charity in Indonesia

export function aggregateDonationsByYear(receipts: DonationReceipt[]): YearlyTaxReport[] {
  const yearMap = new Map<number, DonationReceipt[]>();

  // Group receipts by year
  receipts.forEach(receipt => {
    const date = new Date(Number(receipt.timestamp) * 1000);
    const year = date.getFullYear();
    
    if (!yearMap.has(year)) {
      yearMap.set(year, []);
    }
    yearMap.get(year)!.push(receipt);
  });

  // Create yearly reports
  const reports: YearlyTaxReport[] = [];
  yearMap.forEach((yearReceipts, year) => {
    const totalDonations = yearReceipts.reduce((sum, r) => sum + r.amount, BigInt(0));
    const deductibleAmount = BigInt(Math.floor(Number(totalDonations) * TAX_DEDUCTION_RATE));
    
    const monthlyBreakdown = aggregateByMonth(yearReceipts);

    reports.push({
      year,
      totalDonations,
      donationCount: yearReceipts.length,
      deductibleAmount,
      receipts: yearReceipts,
      monthlyBreakdown,
    });
  });

  return reports.sort((a, b) => b.year - a.year); // Most recent first
}

function aggregateByMonth(receipts: DonationReceipt[]): MonthlyDonation[] {
  const monthMap = new Map<number, { amount: bigint; count: number }>();

  receipts.forEach(receipt => {
    const date = new Date(Number(receipt.timestamp) * 1000);
    const month = date.getMonth(); // 0-11
    
    if (!monthMap.has(month)) {
      monthMap.set(month, { amount: BigInt(0), count: 0 });
    }
    
    const current = monthMap.get(month)!;
    monthMap.set(month, {
      amount: current.amount + receipt.amount,
      count: current.count + 1,
    });
  });

  const monthly: MonthlyDonation[] = [];
  for (let i = 0; i < 12; i++) {
    const data = monthMap.get(i);
    monthly.push({
      month: i,
      monthName: MONTH_NAMES[i],
      amount: data?.amount || BigInt(0),
      count: data?.count || 0,
    });
  }

  return monthly;
}

export function generateCSVReport(report: YearlyTaxReport, donorAddress: string): string {
  const lines: string[] = [];
  
  // Header information
  lines.push("ZKT PLATFORM - TAX DONATION REPORT");
  lines.push(`Tax Year: ${report.year}`);
  lines.push(`Donor Address: ${donorAddress}`);
  lines.push(`Report Generated: ${new Date().toLocaleDateString()}`);
  lines.push("");
  
  // Summary section
  lines.push("SUMMARY");
  lines.push(`Total Donations,${formatIDRX(report.totalDonations)} IDRX`);
  lines.push(`Number of Donations,${report.donationCount}`);
  lines.push(`Tax Deductible Amount,${formatIDRX(report.deductibleAmount)} IDRX`);
  lines.push("");
  
  // Monthly breakdown
  lines.push("MONTHLY BREAKDOWN");
  lines.push("Month,Amount (IDRX),Number of Donations");
  report.monthlyBreakdown.forEach(month => {
    if (month.count > 0) {
      lines.push(`${month.monthName},${formatIDRX(month.amount)},${month.count}`);
    }
  });
  lines.push("");
  
  // Detailed transactions
  lines.push("DETAILED TRANSACTIONS");
  lines.push("Date,Campaign ID,Amount (IDRX),NFT Receipt ID");
  report.receipts
    .sort((a, b) => Number(b.timestamp - a.timestamp))
    .forEach(receipt => {
      const date = new Date(Number(receipt.timestamp) * 1000).toLocaleDateString();
      lines.push(
        `${date},${receipt.poolId.toString()},${formatIDRX(receipt.amount)},${receipt.tokenId.toString()}`
      );
    });
  
  lines.push("");
  lines.push("Note: This report is generated from blockchain records on Base Sepolia testnet.");
  lines.push("For tax filing purposes, please verify with local tax authorities.");
  
  return lines.join("\n");
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
