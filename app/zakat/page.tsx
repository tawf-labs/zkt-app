"use client";

import { useState } from "react";
import { Calculator, Wallet, Heart, Users, Home, Loader2, Info, ChevronDown } from "lucide-react";

export default function ZakatPage() {
  const [selectedTab, setSelectedTab] = useState("maal");
  const [zakatType, setZakatType] = useState("income");
  const [incomeType, setIncomeType] = useState("monthly");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [peopleCount, setPeopleCount] = useState("");
  const [hasDeductions, setHasDeductions] = useState(false);
  const [expenses, setExpenses] = useState("");

  const goldPrice = 2650.00;
  const nisabThreshold = 7296.88;
  const zakatRate = 2.5;
  const fitrahPerPerson = 50000;

  const calculateZakat = () => {
    if (!monthlyIncome) return 0;
    const yearlyIncome = incomeType === "monthly" ? parseFloat(monthlyIncome) * 12 : parseFloat(monthlyIncome);
    const deductedIncome = hasDeductions && expenses ? yearlyIncome - parseFloat(expenses) : yearlyIncome;
    if (deductedIncome < nisabThreshold) return 0;
    return deductedIncome * (zakatRate / 100);
  };

  const calculatedZakat = calculateZakat();
  const totalFitrah = peopleCount ? parseFloat(peopleCount) * fitrahPerPerson : 0;

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Zakat Calculator</h1>
          <p className="text-muted-foreground text-lg">Calculate and fulfill your religious obligation with transparency</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Nisab Information Card */}
            <div className="bg-card rounded-xl border border-black shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Live Nisab Threshold</h3>
                </div>
                <button className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                  <Loader2 className="h-4 w-4" />
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-secondary/30 rounded-lg border border-black">
                  <div className="text-xs text-muted-foreground mb-1">Gold Price</div>
                  <div className="text-lg font-bold">${goldPrice.toFixed(2)}/oz</div>
                  <span className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 mt-1">
                    Live
                  </span>
                </div>

                <div className="text-center p-4 bg-secondary/30 rounded-lg border border-black">
                  <div className="text-xs text-muted-foreground mb-1">Nisab (85g Gold)</div>
                  <div className="text-lg font-bold">${nisabThreshold.toFixed(2)}</div>
                </div>

                <div className="text-center p-4 bg-secondary/30 rounded-lg border border-black">
                  <div className="text-xs text-muted-foreground mb-1">Zakat Rate</div>
                  <div className="text-lg font-bold">{zakatRate}%</div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                Nisab threshold based on live gold prices (85 grams). Updates every 5 minutes.
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-card rounded-xl border border-black shadow-sm overflow-hidden">
              {/* Tab Headers */}
              <div className="grid grid-cols-2 border-b border-black">
                <button
                  onClick={() => setSelectedTab("maal")}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    selectedTab === "maal"
                      ? "bg-primary/5 text-primary border-b-2 border-black"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Wealth Zakat
                </button>
                <button
                  onClick={() => setSelectedTab("fitrah")}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    selectedTab === "fitrah"
                      ? "bg-primary/5 text-primary border-b-2 border-black"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Fitrah Zakat
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {selectedTab === "maal" ? (
                  <div className="space-y-6">
                    {/* Zakat Type Selector */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Zakat Type</label>
                      <select
                        value={zakatType}
                        onChange={(e) => setZakatType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="income">Income Zakat - For salary & wages</option>
                        <option value="trade">Trade Zakat - For business assets</option>
                        <option value="savings">Savings Zakat - For liquid assets</option>
                        <option value="gold">Gold & Silver Zakat</option>
                      </select>
                    </div>

                    {zakatType === "income" && (
                      <>
                        {/* Income Period */}
                        <div>
                          <label className="block text-sm font-medium mb-3">Income Calculation Period</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                value="monthly"
                                checked={incomeType === "monthly"}
                                onChange={(e) => setIncomeType(e.target.value)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">Monthly</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                value="yearly"
                                checked={incomeType === "yearly"}
                                onChange={(e) => setIncomeType(e.target.value)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">Yearly</span>
                            </label>
                          </div>
                        </div>

                        {/* Income Input */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {incomeType === "monthly" ? "Monthly Income*" : "Yearly Income*"}
                          </label>
                          <input
                            type="number"
                            value={monthlyIncome}
                            onChange={(e) => setMonthlyIncome(e.target.value)}
                            placeholder={`Enter your ${incomeType} income in USD`}
                            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        {/* Advanced Options Toggle */}
                        <button
                          onClick={() => setShowAdvanced(!showAdvanced)}
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          {showAdvanced ? "Hide" : "Show"} advanced options
                          <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                        </button>

                        {showAdvanced && (
                          <div className="space-y-4 pt-2">
                            {/* Deduction Toggle */}
                            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                              <span className="text-sm font-medium text-orange-900">
                                Apply work-related deductions
                              </span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={hasDeductions}
                                  onChange={(e) => setHasDeductions(e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                              </label>
                            </div>

                            {/* Expenses Input */}
                            {hasDeductions && (
                              <div>
                                <label className="block text-sm font-medium mb-2">Expenses (USD)</label>
                                <input
                                  type="number"
                                  value={expenses}
                                  onChange={(e) => setExpenses(e.target.value)}
                                  placeholder="Enter your expenses in USD"
                                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Optional: Enter your work-related or other deductible expenses
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Payment Obligation */}
                        <div className="p-4 bg-secondary/30 rounded-lg border border-black">
                          <div className="text-sm font-medium mb-1">Payment Obligation</div>
                          <div className={`text-sm ${calculatedZakat > 0 ? "text-red-600" : "text-muted-foreground"}`}>
                            {calculatedZakat > 0
                              ? "Required to Pay Zakat"
                              : "Not Required to Pay Zakat, but Can Give Charity"}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Calculated Amount */}
                    {calculatedZakat > 0 && (
                      <div className="p-6 rounded-lg border border-white/30 bg-primary/5">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Your Zakat Amount:</p>
                          <p className="text-4xl font-bold text-primary mb-1">
                            ${calculatedZakat.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {zakatRate}% of taxable income above nisab
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Pay Button */}
                    <button
                      disabled={calculatedZakat === 0}
                      className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Wallet className="h-4 w-4" />
                      Pay Zakat
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Fitrah Amount Display */}
                    <div className="p-6 bg-secondary/30 rounded-lg border border-black">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Fitrah Zakat per person:</p>
                        <p className="text-3xl font-bold mb-1">
                          Rp {fitrahPerPerson.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Equivalent to 2.5kg rice</p>
                      </div>
                    </div>

                    {/* People Count Input */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Number of People</label>
                      <input
                        type="number"
                        value={peopleCount}
                        onChange={(e) => setPeopleCount(e.target.value)}
                        placeholder="Enter number of people"
                        min="1"
                        className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Calculation Breakdown */}
                    <div className="space-y-3 py-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Per person:</span>
                        <span className="font-medium">Rp {fitrahPerPerson.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Number of people:</span>
                        <span className="font-medium">{peopleCount || 0}</span>
                      </div>
                      <div className="h-px bg-border" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-primary">Rp {totalFitrah.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Pay Button */}
                    <button
                      disabled={!peopleCount || totalFitrah === 0}
                      className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Wallet className="h-4 w-4" />
                      Pay Zakat Fitrah
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Areas */}
            <div className="bg-card rounded-xl border border-black shadow-sm overflow-hidden">
              <div className="p-4 border-b border-black">
                <h3 className="font-semibold text-sm">Impact Areas</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  <Heart className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium">Orphans</div>
                    <div className="text-xs text-muted-foreground">Supporting orphaned children</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/30 rounded-lg">
                  <Users className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium">Refugees</div>
                    <div className="text-xs text-muted-foreground">Helping displaced families</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  <Home className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium">Local Aid</div>
                    <div className="text-xs text-muted-foreground">Community support programs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transparency Guarantee */}
            <div className="bg-card rounded-xl border border-black shadow-sm overflow-hidden">
              <div className="p-4 border-b border-black">
                <h3 className="font-semibold text-sm">Transparency Guarantee</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold bg-white/10 text-primary">
                    ✓
                  </span>
                  <span className="text-xs text-muted-foreground">Blockchain verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold bg-white/10 text-primary">
                    ✓
                  </span>
                  <span className="text-xs text-muted-foreground">Real-time tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold bg-white/10 text-primary">
                    ✓
                  </span>
                  <span className="text-xs text-muted-foreground">Impact reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold bg-white/10 text-primary">
                    ✓
                  </span>
                  <span className="text-xs text-muted-foreground">NFT certificates</span>
                </div>
              </div>
            </div>

            {/* Global Impact */}
            <div className="bg-card rounded-xl border border-black shadow-sm overflow-hidden">
              <div className="p-4 border-b border-black">
                <h3 className="font-semibold text-sm">Global Impact</h3>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Donated:</span>
                  <span className="font-semibold">2.4B IDR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Families Helped:</span>
                  <span className="font-semibold">3,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Donors:</span>
                  <span className="font-semibold">1,856</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}