"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Vote, Users, Clock, CheckCircle2, Shield, Plus, ThumbsUp, ThumbsDown, LayoutDashboard, FileText, Settings, Download, TrendingUp } from "lucide-react"

// Mock proposals data
const proposals = [
  {
    id: "1",
    title: "Add Water Aid as verified partner organization",
    description:
      "Proposal to onboard Water Aid as an officially verified partner for water infrastructure projects across Southeast Asia.",
    status: "Active",
    type: "Community",
    votesFor: 1245,
    votesAgainst: 234,
    totalVotes: 1479,
    quorum: 2000,
    endsIn: "5 days",
    createdBy: "0x71C7...3A92",
    shariahApproved: null,
  },
  {
    id: "2",
    title: "Adjust admin fee from 2.5% to 2%",
    description:
      "Lower the platform administration fee to increase net donations to campaigns. This will reduce operational overhead but improve donor satisfaction.",
    status: "Active",
    type: "Community",
    votesFor: 856,
    votesAgainst: 412,
    totalVotes: 1268,
    quorum: 2000,
    endsIn: "12 days",
    createdBy: "0x893b...2cDf",
    shariahApproved: null,
  },
  {
    id: "3",
    title: "Implement monthly transparency reports",
    description:
      "Require all Laznas to publish monthly fund allocation reports for improved transparency and donor trust.",
    status: "Pending Review",
    type: "Sharia Council",
    votesFor: 1890,
    votesAgainst: 145,
    totalVotes: 2035,
    quorum: 2000,
    endsIn: "Awaiting Council",
    createdBy: "0x123a...def4",
    shariahApproved: null,
  },
  {
    id: "4",
    title: "Enable recurring donation subscriptions",
    description: "Add functionality for donors to set up automatic monthly or annual donations to preferred campaigns.",
    status: "Approved",
    type: "Community",
    votesFor: 2234,
    votesAgainst: 312,
    totalVotes: 2546,
    quorum: 2000,
    endsIn: "Passed",
    createdBy: "0x456b...abc8",
    shariahApproved: true,
  },
]

export default function GovernancePage() {
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({})
  const [userVotingPower] = useState(245)

  const handleVote = (proposalId: string, voteType: "for" | "against") => {
    setHasVoted({ ...hasVoted, [proposalId]: true })
    // In real app, submit vote to blockchain
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-white">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Governance Portal</h1>
            <p className="text-black">Participate in ZKT.app's dual-layer DAO governance system</p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-white text-black shadow-md border border-black">
                  <Plus className="h-4 w-4" />
                  New Proposal
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Proposal</DialogTitle>
                  <DialogDescription>
                    Submit a proposal for community voting. Requires minimum 100 voting power.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Proposal Title</Label>
                    <Input id="title" placeholder="Brief, descriptive title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Detailed explanation of your proposal..." rows={6} />
                  </div>
                  <div className="space-y-2">
                    <Label>Your Voting Power</Label>
                    <div className="text-2xl font-bold text-black">{userVotingPower}</div>
                  </div>
                  <Button className="w-full">Submit Proposal</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-black p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-black">Your Voting Power</div>
              <Vote className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold">{userVotingPower}</div>
            <div className="text-xs text-black mt-1">From donations</div>
          </div>
          
          <div className="bg-white rounded-xl border border-black p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-black">Active Proposals</div>
              <Clock className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold">{proposals.filter((p) => p.status === "Active").length}</div>
            <div className="text-xs text-black mt-1">Open for voting</div>
          </div>
          
          <div className="bg-white rounded-xl border border-black p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-black">Total Voters</div>
              <Users className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold">3,421</div>
            <div className="text-xs text-black mt-1">vZKT holders</div>
          </div>
          
          <div className="bg-white rounded-xl border border-black p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-black">Proposals Passed</div>
              <CheckCircle2 className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold">47</div>
            <div className="text-xs text-black mt-1">All-time</div>
          </div>
        </div>

        {/* DAO Structure Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-100/50 rounded-xl border border-black shadow-sm">
            <div className="p-6 border-b border-black">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-black" />
                <h2 className="font-semibold">Layer 1: Community DAO</h2>
              </div>
              <p className="text-sm text-black mt-1">Donors with vZKT tokens vote on platform proposals</p>
            </div>
            <div className="p-6 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Add/remove charity partners</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Adjust platform parameters</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Feature requests & improvements</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-100/50 rounded-xl border border-black shadow-sm">
            <div className="p-6 border-b border-black">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-black" />
                <h2 className="font-semibold">Layer 2: Sharia Council</h2>
              </div>
              <p className="text-sm text-black mt-1">Final review to ensure Sharia compliance</p>
            </div>
            <div className="p-6 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Review community-approved proposals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Ensure religious compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Protect donor interests</span>
              </div>
            </div>
          </div>
        </div>

        {/* Proposals Section */}
        <div className="bg-white rounded-xl border border-black shadow-sm">
          <div className="p-6 border-b border-black">
            <h2 className="font-semibold">Active Proposals</h2>
            <p className="text-sm text-black mt-1">Vote on proposals to shape the platform's future</p>
          </div>
          
          <Tabs defaultValue="active" className="p-6">
            <TabsList className="mb-6">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending Review</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4 mt-0">
              {proposals
                .filter((p) => p.status === "Active")
                .map((proposal) => {
                  const percentage = (proposal.votesFor / proposal.totalVotes) * 100
                  const quorumPercentage = (proposal.totalVotes / proposal.quorum) * 100
                  const userHasVoted = hasVoted[proposal.id]

                  return (
                    <div key={proposal.id} className="border border-black rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                              Active
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border border-black">
                              {proposal.type}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold mb-2">{proposal.title}</h3>
                          <p className="text-sm text-gray-700">{proposal.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Votes</span>
                          <span className="font-medium">
                            {proposal.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()} (quorum)
                          </span>
                        </div>
                        <Progress value={quorumPercentage} className="h-2" />

                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-green-600 font-medium flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" /> For
                              </span>
                              <span className="font-bold">{proposal.votesFor.toLocaleString()}</span>
                            </div>
                            <Progress value={percentage} className="h-1.5 [&>div]:bg-green-600" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-red-600 font-medium flex items-center gap-1">
                                <ThumbsDown className="h-3 w-3" /> Against
                              </span>
                              <span className="font-bold">{proposal.votesAgainst.toLocaleString()}</span>
                            </div>
                            <Progress value={100 - percentage} className="h-1.5 [&>div]:bg-red-600" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-black">
                        <div className="text-sm text-gray-600">
                          <Clock className="inline h-3 w-3 mr-1" />
                          Ends in {proposal.endsIn}
                        </div>
                        {userHasVoted ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-100 border border-black gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Voted
                          </span>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md border border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent"
                              onClick={() => handleVote(proposal.id, "for")}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              Vote For
                            </button>
                            <button
                              className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent"
                              onClick={() => handleVote(proposal.id, "against")}
                            >
                              <ThumbsDown className="h-3 w-3" />
                              Vote Against
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4 mt-0">
              {proposals
                .filter((p) => p.status === "Pending Review")
                .map((proposal) => (
                  <div key={proposal.id} className="border border-black rounded-lg p-6 bg-yellow-50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-300">
                        Pending Review
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border border-black">
                        {proposal.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{proposal.title}</h3>
                    <p className="text-sm text-gray-700 mb-4">{proposal.description}</p>
                    
                    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg flex items-start gap-3">
                      <Shield className="h-5 w-5 text-yellow-700 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <div className="font-semibold text-sm">Awaiting Sharia Council Review</div>
                        <p className="text-sm text-gray-700">
                          This proposal passed community voting and is now under review by the Sharia Council for final approval.
                        </p>
                        <div className="text-sm font-medium text-yellow-700 pt-1">
                          Community Vote: {proposal.votesFor} For, {proposal.votesAgainst} Against
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="closed" className="space-y-4 mt-0">
              {proposals
                .filter((p) => p.status === "Approved")
                .map((proposal) => (
                  <div key={proposal.id} className="border border-black rounded-lg p-6 bg-white opacity-75">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                        Approved
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border border-black">
                        {proposal.type}
                      </span>
                      {proposal.shariahApproved && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border border-black gap-1">
                          <Shield className="h-3 w-3" />
                          Sharia Compliant
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{proposal.title}</h3>
                    <p className="text-sm text-gray-700 mb-4">{proposal.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>
                        Passed with {proposal.votesFor} votes for and {proposal.votesAgainst} against
                      </span>
                    </div>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}