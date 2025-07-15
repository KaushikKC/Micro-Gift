"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Gift,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { InteractiveButton } from "@/components/interactive-button";
import { usePrivy } from "@privy-io/react-auth";
import { getGiftVoucherContractWithSigner } from "@/lib/web3";
import { ethers } from "ethers";

interface GiftHistory {
  id: string;
  type: "sent" | "received";
  amount: string;
  message: string;
  address: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  txHash: string;
  claimed?: boolean; // Added for received gifts
  voucherId?: string; // Added for received gifts
}

export default function HistoryPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "sent" | "received">(
    "all"
  );
  const [history, setHistory] = useState<GiftHistory[]>([]);
  const { authenticated, user } = usePrivy();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!authenticated || !user?.wallet?.address) return;
      try {
        const res = await fetch(`/api/history?address=${user.wallet.address}`);
        const data = await res.json();
        if (data.history) setHistory(data.history);
      } catch (err) {
        // fallback: do nothing
      }
    };
    fetchHistory();
  }, [authenticated, user?.wallet?.address]);

  const filteredHistory = history.filter((item) => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-mint" />;
      case "pending":
        return <Clock className="w-5 h-5 text-champagne" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-error" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-mint";
      case "pending":
        return "text-champagne";
      case "failed":
        return "text-error";
      default:
        return "text-secondary";
    }
  };

  const handleClaim = async (voucherId: string) => {
    if (!authenticated || !user?.wallet?.address) return;
    try {
      let provider = (user.wallet as any).provider;
      if (
        !provider &&
        typeof window !== "undefined" &&
        (window as any).ethereum
      ) {
        provider = (window as any).ethereum;
      }
      if (!provider) return;
      const contract = await getGiftVoucherContractWithSigner(provider);
      const tx = await contract.redeemVoucher(voucherId);
      await tx.wait();
      // Optionally update backend status
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voucherId, status: "completed", claimed: true }),
      });
      // Refresh history
      const res = await fetch(`/api/history?address=${user.wallet.address}`);
      const data = await res.json();
      if (data.history) setHistory(data.history);
    } catch (err) {
      // handle error
    }
  };

  return (
    <div className="bg-soft min-h-screen pt-24 pb-12 bg-pattern">
      <div className="container-modern">
        <div className="text-center mb-12">
          <div className={isLoaded ? "fade-in" : ""}>
            <h1 className="text-4xl font-bold-modern text-primary mb-4">
              Gift History
            </h1>
            <p className="text-xl font-regular-modern text-secondary">
              Track all your sent and received crypto gifts
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={isLoaded ? "fade-in-delay-1" : ""}>
          <div className="flex justify-center gap-4 mb-8">
            {[
              { key: "all", label: "All Gifts" },
              { key: "sent", label: "Sent" },
              { key: "received", label: "Received" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-full font-medium-modern transition-all ${
                  activeTab === tab.key
                    ? "bg-accent text-white"
                    : "bg-surface/50 text-secondary hover:text-primary hover:bg-surface/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        <div className={isLoaded ? "fade-in-delay-2" : ""}>
          {filteredHistory.length === 0 ? (
            <div className="card-modern text-center">
              <Gift className="w-16 h-16 mx-auto mb-4 text-secondary" />
              <h3 className="text-xl font-bold-modern text-primary mb-2">
                No Gifts Yet
              </h3>
              <p className="text-secondary mb-6 font-regular-modern">
                {activeTab === "sent"
                  ? "You haven't sent any gifts yet"
                  : activeTab === "received"
                  ? "You haven't received any gifts yet"
                  : "No gift history found"}
              </p>
              <InteractiveButton variant="floating">
                Send Your First Gift
              </InteractiveButton>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item, index) => (
                <div
                  key={item.id}
                  className="card-modern hover:glow-soft transition-all duration-300"
                  style={{
                    animationDelay: isLoaded ? `${index * 0.1}s` : "0s",
                  }}
                >
                  <div className="flex items-center justify-between">
                    {/* Left side - Gift info */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          item.type === "sent" ? "bg-cranberry" : "bg-mint"
                        }`}
                      >
                        {item.type === "sent" ? (
                          <ArrowUpRight className="w-6 h-6 text-white" />
                        ) : (
                          <ArrowDownLeft className="w-6 h-6 text-white" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold-modern text-primary">
                            ${item.amount} USDT
                          </h3>
                          {getStatusIcon(item.status)}
                        </div>
                        <p className="text-secondary mb-1 font-regular-modern">
                          {item.message}
                        </p>
                        <div className="flex items-center gap-4 text-sm font-regular-modern">
                          <span className="text-secondary">
                            {item.type === "sent" ? "To:" : "From:"}{" "}
                            {item.address}
                          </span>
                          <span className="text-secondary">
                            {item.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Status and actions */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-medium-modern ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}
                      </span>
                      {item.type === "received" && !item.claimed && (
                        <button
                          onClick={() => handleClaim(item.voucherId || "")}
                          className="btn-modern"
                        >
                          Claim
                        </button>
                      )}
                      <button className="text-secondary hover:text-accent transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Transaction hash */}
                  <div className="mt-4 pt-4 border-t border-soft">
                    <div className="flex items-center justify-between text-xs font-regular-modern">
                      <span className="text-secondary">Transaction:</span>
                      <span className="font-mono text-secondary">
                        {item.txHash}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className={isLoaded ? "fade-in-delay-2" : ""}>
          <div className="card-modern mt-12">
            <h3 className="text-xl font-bold-modern text-primary mb-6">
              Gift Summary
            </h3>
            <div className="grid grid-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold-modern text-accent mb-2">
                  {history.filter((item) => item.type === "sent").length}
                </div>
                <div className="text-sm text-secondary font-regular-modern">
                  Gifts Sent
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold-modern text-cranberry mb-2">
                  {history.filter((item) => item.type === "received").length}
                </div>
                <div className="text-sm text-secondary font-regular-modern">
                  Gifts Received
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold-modern text-mint mb-2">
                  $
                  {history.reduce(
                    (sum, item) => sum + parseFloat(item.amount),
                    0
                  )}
                </div>
                <div className="text-sm text-secondary font-regular-modern">
                  Total Value
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
