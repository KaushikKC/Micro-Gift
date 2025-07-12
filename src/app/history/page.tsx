"use client"

import { useState, useEffect } from "react"
import { Send, Download, Search, Calendar, Gift, TrendingUp, Users, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { InteractiveButton } from "@/components/interactive-button"

interface GiftTransaction {
  id: string
  type: "sent" | "received"
  amount: string
  address: string
  message: string
  date: string
  status: "completed" | "pending" | "failed"
}

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const mockTransactions: GiftTransaction[] = [
    {
      id: "1",
      type: "sent",
      amount: "$3",
      address: "0x123...abc",
      message: "Happy Birthday! 🎉",
      date: "2025-01-10",
      status: "completed",
    },
    {
      id: "2",
      type: "sent",
      amount: "$2",
      address: "0x456...def",
      message: "Thanks for your help!",
      date: "2025-01-09",
      status: "completed",
    },
    {
      id: "3",
      type: "received",
      amount: "$1",
      address: "0xabc...123",
      message: "Congrats on your new job!",
      date: "2025-01-08",
      status: "completed",
    },
    {
      id: "4",
      type: "sent",
      amount: "$5",
      address: "0x789...ghi",
      message: "Coffee on me! ☕",
      date: "2025-01-07",
      status: "pending",
    },
    {
      id: "5",
      type: "received",
      amount: "$2",
      address: "0xdef...456",
      message: "Welcome gift! 🎁",
      date: "2025-01-06",
      status: "completed",
    },
  ]

  const filteredTransactions = mockTransactions
    .filter((tx) => tx.type === activeTab)
    .filter(
      (tx) =>
        tx.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.message.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-white"
      case "pending":
        return "text-gray"
      case "failed":
        return "text-gray"
      default:
        return "text-gray"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-white text-black"
      case "pending":
        return "bg-gray text-white"
      case "failed":
        return "bg-gray text-white"
      default:
        return "bg-gray text-white"
    }
  }

  return (
    <div className="bg-black min-h-screen pt-24 pb-12">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            GIFT HISTORY
          </h1>
          <p className="text-xl text-gray">Track all your sent and received crypto gifts</p>
        </div>

        {/* Controls */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Tab Switcher */}
            <div className="border border-white">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("sent")}
                  className={`px-6 py-2 text-sm font-medium ${
                    activeTab === "sent" ? "bg-white text-black" : "text-white"
                  }`}
                >
                  <Send className="w-4 h-4 mr-2 inline" />
                  SENT
                </button>
                <button
                  onClick={() => setActiveTab("received")}
                  className={`px-6 py-2 text-sm font-medium ${
                    activeTab === "received" ? "bg-white text-black" : "text-white"
                  }`}
                >
                  <Download className="w-4 h-4 mr-2 inline" />
                  RECEIVED
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray" />
              <Input
                type="text"
                placeholder="Search by address or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 input-simple w-full sm:w-80"
              />
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-white flex items-center justify-center mx-auto mb-6">
                <Gift className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                NO {activeTab.toUpperCase()} GIFTS YET
              </h3>
              <p className="text-gray mb-6">
                {activeTab === "sent" ? "Start sending your first crypto gift!" : "You haven't received any gifts yet."}
              </p>
              <InteractiveButton variant="outline" size="md">
                {activeTab === "sent" ? "CREATE GIFT" : "SHARE ADDRESS"}
              </InteractiveButton>
            </div>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <div key={transaction.id} className="card-dark">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-white flex items-center justify-center`}>
                      {transaction.type === "sent" ? (
                        <Send className="w-6 h-6" />
                      ) : (
                        <Download className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg font-bold text-white">{transaction.amount} USDT</span>
                        <span className={`px-3 py-1 text-xs font-medium border ${getStatusBg(transaction.status)}`}>
                          {transaction.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-sm text-gray mb-1">
                        <span>{transaction.type === "sent" ? "TO: " : "FROM: "}</span>
                        <span className="font-mono text-white">{transaction.address}</span>
                      </div>

                      <div className="text-sm text-white">"{transaction.message}"</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      {transaction.date}
                    </div>
                    <InteractiveButton variant="outline" size="sm">
                      VIEW DETAILS
                    </InteractiveButton>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-16">
          <div className="grid grid-3 gap-6">
            <div className="card-dark text-center">
              <div className="w-12 h-12 bg-white flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">$15.50</div>
              <div className="text-sm text-gray">TOTAL SENT</div>
            </div>

            <div className="card-dark text-center">
              <div className="w-12 h-12 bg-white flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">8</div>
              <div className="text-sm text-gray">RECIPIENTS</div>
            </div>

            <div className="card-dark text-center">
              <div className="w-12 h-12 bg-white flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">$8.25</div>
              <div className="text-sm text-gray">TOTAL RECEIVED</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
