/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { QrCode, Send, Gift, CheckCircle, AlertCircle, Plus, Trash, Users, User, Sparkles, Zap } from "lucide-react";
import { InteractiveButton } from "@/components/interactive-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePrivy } from "@privy-io/react-auth";
import {
  getGiftVoucherContractWithSigner,
  getGiftVoucherContract,
  GIFT_VOUCHER_ADDRESS,
  MOCK_USDT_ADDRESS,
} from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";

// Standard ERC20 ABI for allowance/approve
const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface VoucherDetails {
  sender: string;
  recipient: string;
  amount: bigint;
  message: string;
  redeemed: boolean;
  createdAt: bigint;
}

export default function CreateGiftPage() {
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    message: "",
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [voucherId, setVoucherId] = useState<string>("");
  const [contractBalance, setContractBalance] = useState<string>("0");
  const [gasEstimate, setGasEstimate] = useState<string>("0.01");
  const [batchMode, setBatchMode] = useState(false);
  const [batchData, setBatchData] = useState([
    { recipient: "", amount: "", message: "" },
  ]);
  const [showConfetti, setShowConfetti] = useState(false);

  const { toast } = useToast();
  const { authenticated, user } = usePrivy();

  useEffect(() => {
    setIsLoaded(true);
    // Load contract balance on component mount
    loadContractBalance();
  }, []);

  useEffect(() => {
    if (showSuccess) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [showSuccess]);

  // Load contract USDT balance
  const loadContractBalance = async () => {
    try {
      const contract = getGiftVoucherContract();
      const balance = await contract.getContractUSDTBalance();
      setContractBalance(ethers.formatUnits(balance, 6)); // USDT has 6 decimals
    } catch (error) {
      console.error("Failed to load contract balance:", error);
    }
  };

  // Validate Ethereum address
  function isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Estimate gas for transaction
  const estimateGas = async () => {
    if (
      !authenticated ||
      !user?.wallet?.address ||
      !formData.recipient ||
      !formData.amount
    ) {
      return;
    }

    try {
      // Get the provider from Privy wallet
      const provider = (user.wallet as any).provider;
      if (!provider) {
        console.error("No provider available from Privy wallet");
        return;
      }

      const contract = await getGiftVoucherContractWithSigner(provider);
      const amountNum = Number(formData.amount);

      // Estimate gas for createVoucher function
      const gasEstimate = await contract.createVoucher.estimateGas(
        formData.recipient,
        amountNum * 1e6,
        formData.message || ""
      );

      // Get current gas price from the provider
      const ethersProvider = new ethers.BrowserProvider(provider);
      const feeData = await ethersProvider.getFeeData();
      const gasPrice = feeData.gasPrice ?? BigInt(0);
      const gasCost = gasEstimate * gasPrice;

      // Convert to ETH (approximate cost)
      const gasCostEth = ethers.formatEther(gasCost.toString());
      setGasEstimate((parseFloat(gasCostEth) * 1000).toFixed(3)); // Convert to approximate USD
    } catch (error) {
      console.error("Gas estimation failed:", error);
      setGasEstimate("0.01"); // Fallback
    }
  };

  // Update gas estimate when form changes
  useEffect(() => {
    if (
      formData.recipient &&
      formData.amount &&
      authenticated &&
      user?.wallet?.address
    ) {
      estimateGas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.recipient,
    formData.amount,
    authenticated,
    user?.wallet?.address,
  ]);

  const handleSendGift = async () => {
    if (!authenticated || !user?.wallet?.address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to send a gift.",
        variant: "destructive",
      });
      return;
    }
    // Input validation
    if (!isValidAddress(formData.recipient)) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid Ethereum address.",
        variant: "destructive",
      });
      return;
    }
    const amountNum = Number(formData.amount);
    if (isNaN(amountNum) || amountNum < 1 || amountNum > 5) {
      toast({
        title: "Invalid amount",
        description: "Amount must be between 1 and 5 USDT.",
        variant: "destructive",
      });
      return;
    }
    if (formData.message.length > 50) {
      toast({
        title: "Message too long",
        description: "Message must be 50 characters or less.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      // Get Privy embedded wallet provider
      let provider = (user.wallet as any).provider;
      // Fallback to window.ethereum for external wallets
      if (
        !provider &&
        typeof window !== "undefined" &&
        (window as any).ethereum
      ) {
        provider = (window as any).ethereum;
        console.log("Falling back to window.ethereum");
      }
      if (!provider) {
        toast({
          title: "Wallet not connected",
          description: "Could not access wallet provider.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      // 1 USDT = 1,000,000 units (6 decimals)
      const usdtAmount = amountNum * 1e6;
      // Check allowance
      const usdtContract = new ethers.Contract(
        MOCK_USDT_ADDRESS,
        ERC20_ABI,
        signer
      );
      const allowance = await usdtContract.allowance(
        user.wallet.address,
        GIFT_VOUCHER_ADDRESS
      );
      if (allowance < usdtAmount) {
        // Prompt approval
        toast({
          title: "Approval Needed",
          description: "Approving USDT for gifting...",
          variant: "default",
        });
        const approveTx = await usdtContract.approve(
          GIFT_VOUCHER_ADDRESS,
          usdtAmount
        );
        await approveTx.wait();
        toast({
          title: "USDT Approved",
          description: "USDT approved for gifting. Sending gift now...",
        });
      }
      // Now send the gift
      const contract = await getGiftVoucherContractWithSigner(provider);
      const tx = await contract.createVoucher(
        formData.recipient,
        usdtAmount,
        formData.message
      );
      const receipt = await tx.wait();
      // Extract voucherId from VoucherCreated event
      let voucherId = "";
      console.log("receipt", receipt);
      if (receipt && receipt.logs) {
        for (const log of receipt.logs) {
          try {
            const parsed = contract.interface.parseLog(log);
            console.log("parsed", parsed);
            if (parsed && parsed.name === "VoucherCreated") {
              console.log("parsed.args", parsed.args);
              console.log("parsed.args.voucherId", parsed.args.voucherId);
              voucherId = parsed.args.voucherId;
              break;
            }
          } catch (e) {
            /* not this log */
          }
        }
      }
      setVoucherId(voucherId);
      setTxHash(tx.hash);
      setShowSuccess(true);
      toast({
        title: "Gift Sent!",
        description: "Your crypto gift has been sent successfully.",
      });
      setFormData({ recipient: "", amount: "", message: "" });
      // POST to backend API
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: user.wallet.address,
          recipient: formData.recipient,
          amount: formData.amount,
          message: formData.message,
          txHash: tx.hash,
          voucherId,
          timestamp: new Date().toISOString(),
          status: "completed",
        }),
      });
      // Reload contract balance
      await loadContractBalance();
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      console.error("Transaction error:", err);
      let message = "Transaction failed.";
      if (typeof err === "object" && err !== null) {
        if (
          "reason" in err &&
          typeof (err as { reason?: string }).reason === "string"
        ) {
          message = (err as { reason?: string }).reason!;
        } else if (
          "data" in err &&
          typeof (err as { data?: { message?: string } }).data?.message ===
            "string"
        ) {
          message = (err as { data?: { message?: string } }).data!.message!;
        } else if (
          "message" in err &&
          typeof (err as { message?: string }).message === "string"
        ) {
          message = (err as { message?: string }).message!;
        }
      }
      if (
        typeof message === "string" &&
        message.includes("USDT transfer failed")
      ) {
        message =
          "You may not have enough USDT or have not approved the contract.";
      }
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleBatchInputChange = (
    idx: number,
    field: string,
    value: string
  ) => {
    setBatchData((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };
  const addBatchRow = () => {
    setBatchData((prev) => [
      ...prev,
      { recipient: "", amount: "", message: "" },
    ]);
  };
  const removeBatchRow = (idx: number) => {
    setBatchData((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleSendBatch = async () => {
    if (!authenticated || !user?.wallet?.address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to send gifts.",
        variant: "destructive",
      });
      return;
    }
    // Validate all inputs
    for (const entry of batchData) {
      if (!isValidAddress(entry.recipient)) {
        toast({
          title: "Invalid address",
          description:
            "Please enter a valid Ethereum address for all recipients.",
          variant: "destructive",
        });
        return;
      }
      const amountNum = Number(entry.amount);
      if (isNaN(amountNum) || amountNum < 1 || amountNum > 5) {
        toast({
          title: "Invalid amount",
          description:
            "Amount must be between 1 and 5 USDT for all recipients.",
          variant: "destructive",
        });
        return;
      }
      if (entry.message.length > 50) {
        toast({
          title: "Message too long",
          description:
            "Message must be 50 characters or less for all recipients.",
          variant: "destructive",
        });
        return;
      }
    }
    setLoading(true);
    try {
      let provider = (user.wallet as any).provider;
      if (
        !provider &&
        typeof window !== "undefined" &&
        (window as any).ethereum
      ) {
        provider = (window as any).ethereum;
      }
      if (!provider) {
        toast({
          title: "Wallet not connected",
          description: "Could not access wallet provider.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const recipients = batchData.map((e) => e.recipient);
      const amounts = batchData.map((e) => Number(e.amount) * 1e6);
      const messages = batchData.map((e) => e.message);
      const totalAmount = amounts.reduce((a, b) => a + b, 0);
      // Check allowance
      const usdtContract = new ethers.Contract(
        MOCK_USDT_ADDRESS,
        ERC20_ABI,
        signer
      );
      const allowance = await usdtContract.allowance(
        user.wallet.address,
        GIFT_VOUCHER_ADDRESS
      );
      if (allowance < totalAmount) {
        toast({
          title: "Approval Needed",
          description: "Approving USDT for gifting...",
          variant: "default",
        });
        const approveTx = await usdtContract.approve(
          GIFT_VOUCHER_ADDRESS,
          totalAmount
        );
        await approveTx.wait();
        toast({
          title: "USDT Approved",
          description: "USDT approved for gifting. Sending batch gift now...",
        });
      }
      // Send batch
      const contract = await getGiftVoucherContractWithSigner(provider);
      const tx = await contract.batchCreateVouchers(
        recipients,
        amounts,
        messages
      );
      const receipt = await tx.wait();
      // Extract voucherIds from BatchVouchersCreated event
      let voucherIds: string[] = [];
      if (receipt && receipt.logs) {
        for (const log of receipt.logs) {
          try {
            const parsed = contract.interface.parseLog(log);
            if (parsed && parsed.name === "BatchVouchersCreated") {
              voucherIds = parsed.args.voucherIds;
              break;
            }
          } catch (e) {
            /* not this log */
          }
        }
      }
      // POST each voucher to backend
      for (let i = 0; i < voucherIds.length; i++) {
        await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: user.wallet.address,
            recipient: recipients[i],
            amount: Number(amounts[i]) / 1e6,
            message: messages[i],
            txHash: tx.hash,
            voucherId: voucherIds[i],
            timestamp: new Date().toISOString(),
            status: "completed",
          }),
        });
      }
      setShowSuccess(true);
      toast({
        title: "Batch Gift Sent!",
        description: "Your crypto gifts have been sent successfully.",
      });
      setBatchData([{ recipient: "", amount: "", message: "" }]);
      await loadContractBalance();
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Batch transaction failed.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const shortenAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Helper to sum batch amounts
  const getBatchTotal = () =>
    batchData.reduce((sum, entry) => {
      const amt = Number(entry.amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

  return (
    <div className="bg-soft min-h-screen pt-24 pb-12 bg-pattern">
      <div className="container-modern">
        <div className="text-center mb-12">
          <div className={isLoaded ? "fade-in" : ""}>
            <h1 className="text-4xl font-bold-modern text-primary mb-4">
              Create a Special Gift
            </h1>
            <p className="text-xl font-regular-modern text-secondary">
              Send a personalized crypto gift to anyone, anywhere in the world
            </p>
            <div className="mt-4 text-sm text-secondary font-regular-modern">
              Contract Balance: {contractBalance} USDT
            </div>
          </div>
        </div>

        <div className="grid-modern grid-2 gap-16 items-start">
          {/* Form Section */}
          <div className={isLoaded ? "fade-in-delay-1" : ""}>
            <div className="card-modern">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4 flex justify-center">
                  <div className="inline-flex rounded-full bg-surface border border-soft overflow-hidden shadow-sm">
                    <button
                      type="button"
                      className={`flex items-center gap-2 px-6 py-2 font-medium-modern transition-colors focus:outline-none ${
                        !batchMode
                          ? "bg-accent text-white shadow"
                          : "text-secondary hover:bg-accent/10"
                      }`}
                      onClick={() => setBatchMode(false)}
                      aria-pressed={!batchMode}
                    >
                      <User className="w-4 h-4" /> Single Gift
                    </button>
                    <button
                      type="button"
                      className={`flex items-center gap-2 px-6 py-2 font-medium-modern transition-colors focus:outline-none border-l border-soft ${
                        batchMode
                          ? "bg-accent text-white shadow"
                          : "text-secondary hover:bg-accent/10"
                      }`}
                      onClick={() => setBatchMode(true)}
                      aria-pressed={batchMode}
                    >
                      <Users className="w-4 h-4" /> Batch Gift
                    </button>
                  </div>
                </div>
                {batchMode ? (
                  <div>
                    {batchData.map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col gap-4 mb-4 p-4 rounded-xl bg-surface/70 border border-soft shadow-sm relative"
                      >
                        {/* Recipient Label & Input */}
                        <div className="space-y-2">
                          <Label htmlFor={`batch-recipient-${idx}`} className="text-primary font-medium-modern">
                            Recipient Wallet Address
                          </Label>
                          <Input
                            id={`batch-recipient-${idx}`}
                            placeholder="0x1234...abcd"
                            value={entry.recipient}
                            onChange={(e) => handleBatchInputChange(idx, "recipient", e.target.value)}
                            className="flex-1 min-w-0 px-4 py-3 border border-soft rounded-lg bg-white/60 backdrop-blur-sm focus:border-accent focus:ring-2 focus:ring-accent/20 font-regular-modern"
                          />
                        </div>
                        {/* Amount Label & Select */}
                        <div className="space-y-2">
                          <Label htmlFor={`batch-amount-${idx}`} className="text-primary font-medium-modern">
                            Gift Amount (USDT)
                          </Label>
                          <Select
                            value={entry.amount}
                            onValueChange={(value) => handleBatchInputChange(idx, "amount", value)}
                          >
                            <SelectTrigger id={`batch-amount-${idx}`} className="w-full px-4 py-3 border border-soft rounded-xl bg-surface/50 backdrop-blur-sm focus:border-accent font-regular-modern">
                          <SelectValue placeholder="Select amount" />
                        </SelectTrigger>
                        <SelectContent className="bg-surface border border-soft rounded-xl">
                          <SelectItem value="1">$1 USDT</SelectItem>
                          <SelectItem value="2">$2 USDT</SelectItem>
                          <SelectItem value="3">$3 USDT</SelectItem>
                          <SelectItem value="4">$4 USDT</SelectItem>
                          <SelectItem value="5">$5 USDT</SelectItem>
                        </SelectContent>
                          </Select>
                        </div>
                        {/* Message Label & Textarea */}
                        <div className="space-y-2">
                          <Label htmlFor={`batch-message-${idx}`} className="text-primary font-medium-modern">
                            Personal Message (Optional)
                          </Label>
                          <Textarea
                            id={`batch-message-${idx}`}
                            placeholder="Happy Birthday! Enjoy your coffee ☕"
                            value={entry.message}
                            onChange={(e) => handleBatchInputChange(idx, "message", e.target.value)}
                            maxLength={50}
                            rows={3}
                            className="flex-1 min-w-0 px-4 py-3 border border-soft rounded-lg bg-white/60 backdrop-blur-sm focus:border-accent focus:ring-2 focus:ring-accent/20 font-regular-modern resize-none"
                          />
                          <div className="text-right text-sm text-secondary font-regular-modern">
                            {entry.message.length}/50
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeBatchRow(idx)}
                          disabled={batchData.length === 1}
                          className="absolute top-2 right-2 text-secondary hover:text-red-500 transition-colors p-1 rounded-full focus:outline-none disabled:opacity-40"
                          title="Remove recipient"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-end mb-4">
                      <button
                        type="button"
                        onClick={addBatchRow}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white font-medium-modern shadow hover:bg-accent-dark transition-colors focus:outline-none"
                      >
                        <Plus className="w-4 h-4" /> Add Recipient
                      </button>
                    </div>
                    {/* Connection Status */}
                    <div className="text-sm font-regular-modern mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary">Wallet Status:</span>
                        <span
                          className={
                            authenticated ? "text-green-500" : "text-red-500"
                          }
                        >
                          {authenticated ? "Connected" : "Not Connected"}
                        </span>
                      </div>
                      {authenticated && user?.wallet?.address && (
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-secondary">Your Address:</span>
                          <span className="text-primary font-mono text-xs">
                            {shortenAddress(user.wallet.address)}
                          </span>
                        </div>
                      )}
                    </div>
                    <InteractiveButton
                      type="button"
                      onClick={handleSendBatch}
                      variant="floating"
                      size="lg"
                      className="w-full"
                      disabled={loading}
                    >
                      <div className="flex items-center justify-center">
                        <Send className="w-5 h-5 mr-2" />
                        {loading ? "Sending Batch..." : "Send Batch Gift"}
                      </div>
                    </InteractiveButton>
                  </div>
                ) : (
                  <>
                    {/* Recipient Address */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="recipient"
                        className="text-primary font-medium-modern"
                      >
                        Recipient Wallet Address
                      </Label>
                      <div className="relative">
                        <Input
                          id="recipient"
                          type="text"
                          placeholder="0x1234...abcd"
                          value={formData.recipient}
                          onChange={(e) =>
                            handleInputChange("recipient", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-soft rounded-xl bg-surface/50 backdrop-blur-sm focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all font-regular-modern pr-12"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-accent transition-colors"
                          title="Scan QR Code"
                        >
                          <QrCode className="w-5 h-5" />
                        </button>
                      </div>
                      {formData.recipient &&
                        !isValidAddress(formData.recipient) && (
                          <div className="flex items-center text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Invalid Ethereum address
                          </div>
                        )}
                      {formData.recipient &&
                        isValidAddress(formData.recipient) && (
                          <div className="flex items-center text-green-500 text-sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Valid address
                          </div>
                        )}
                    </div>

                    {/* Gift Amount */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="amount"
                        className="text-primary font-medium-modern"
                      >
                        Gift Amount (USDT)
                      </Label>
                      <Select
                        value={formData.amount}
                        onValueChange={(value) =>
                          handleInputChange("amount", value)
                        }
                      >
                        <SelectTrigger className="w-full px-4 py-3 border border-soft rounded-xl bg-surface/50 backdrop-blur-sm focus:border-accent font-regular-modern">
                          <SelectValue placeholder="Select amount" />
                        </SelectTrigger>
                        <SelectContent className="bg-surface border border-soft rounded-xl">
                          <SelectItem value="1">$1 USDT</SelectItem>
                          <SelectItem value="2">$2 USDT</SelectItem>
                          <SelectItem value="3">$3 USDT</SelectItem>
                          <SelectItem value="4">$4 USDT</SelectItem>
                          <SelectItem value="5">$5 USDT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="message"
                        className="text-primary font-medium-modern"
                      >
                        Personal Message (Optional)
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Happy Birthday! Enjoy your coffee ☕"
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        maxLength={50}
                        className="w-full px-4 py-3 border border-soft rounded-xl bg-surface/50 backdrop-blur-sm focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none font-regular-modern"
                        rows={3}
                      />
                      <div className="text-right text-sm text-secondary font-regular-modern">
                        {formData.message.length}/50
                      </div>
                    </div>

                    {/* Connection Status */}
                    <div className="text-sm font-regular-modern">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary">Wallet Status:</span>
                        <span
                          className={
                            authenticated ? "text-green-500" : "text-red-500"
                          }
                        >
                          {authenticated ? "Connected" : "Not Connected"}
                        </span>
                      </div>
                      {authenticated && user?.wallet?.address && (
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-secondary">Your Address:</span>
                          <span className="text-primary font-mono text-xs">
                            {shortenAddress(user.wallet.address)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <InteractiveButton
                      type="button"
                      onClick={handleSendGift}
                      variant="floating"
                      size="lg"
                      className="w-full"
                      disabled={
                        loading ||
                        !authenticated ||
                        !formData.recipient ||
                        !formData.amount
                      }
                    >
                      <div className="flex items-center justify-center">
                        <Send className="w-5 h-5 mr-2" />
                        {loading ? "Sending Gift..." : "Send Gift"}
                      </div>
                    </InteractiveButton>

                    {!authenticated && (
                      <div className="text-center text-sm text-secondary font-regular-modern">
                        Please connect your wallet to send gifts
                      </div>
                    )}
                  </>
                )}
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className={isLoaded ? "fade-in-delay-2" : ""}>
            <div>
              <h3 className="text-2xl font-bold-modern text-primary mb-6 text-center">
                Gift Preview
              </h3>

              <div className="card-modern glow-cranberry">
                <div className="text-center">
                  <Gift className="w-16 h-16 mx-auto mb-4 text-accent" />
                  <h4 className="text-xl font-semibold-modern text-primary mb-2">
                    CRYPTO GIFT
                  </h4>
                  <div className="text-3xl font-bold-modern text-accent mb-4">
                    {batchMode
                      ? `$${getBatchTotal()}`
                      : formData.amount
                      ? `$${formData.amount}`
                      : "$0"} USDT
                  </div>
                  {/* Recipients */}
                  <div className="text-sm text-secondary mb-4 font-regular-modern">
                    <strong>To:</strong>{" "}
                    {batchMode
                      ? (
                          <ul className="inline-block text-left ml-1">
                            {batchData.map((entry, idx) => (
                              <li key={idx} className="flex items-center gap-1">
                                <span className="font-mono">{shortenAddress(entry.recipient) || "0x1234...abcd"}</span>
                              </li>
                            ))}
                          </ul>
                        )
                      : formData.recipient
                      ? shortenAddress(formData.recipient)
                      : "0x1234...abcd"}
                  </div>
                  {/* Messages */}
                  <div className="text-sm text-secondary font-regular-modern">
                    <strong>Message{batchMode && batchData.length > 1 ? 's' : ''}:</strong>{" "}
                    {batchMode
                      ? (
                          <ul className="inline-block text-left ml-1">
                            {batchData.map((entry, idx) => (
                              <li key={idx}>
                                {entry.message || <span className="italic text-muted">(No message)</span>}
                              </li>
                            ))}
                          </ul>
                        )
                      : formData.message || "Your personalized message here"}
                  </div>
                </div>
              </div>
              {/* Gift Details */}
              <div className="card-modern mt-8">
                <h4 className="text-lg font-semibold-modern text-primary mb-4">
                  Transaction Details
                </h4>
                <div className="space-y-3 text-sm font-regular-modern">
                  <div className="flex justify-between">
                    <span className="text-secondary">Network:</span>
                    <span className="text-primary">Morph Holesky</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Token:</span>
                    <span className="text-primary">USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Contract:</span>
                    <span className="text-primary font-mono text-xs">
                      {shortenAddress(GIFT_VOUCHER_ADDRESS)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Est. Gas Fee:</span>
                    <span className="text-accent">~$0.{gasEstimate}</span>
                  </div>
                  <div className="flex justify-between font-semibold-modern border-t pt-2">
                    <span className="text-secondary">Total Cost:</span>
                    <span className="text-primary">
                      {batchMode
                        ? `$${getBatchTotal()}`
                        : `$${formData.amount || "0"}`} + Gas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            {/* Enhanced Confetti Effect: More, only Y direction, no flutter */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 120 }).map((_, i) => {
                  const confettiColors = [
                    "bg-red-400", "bg-yellow-300", "bg-green-400", "bg-blue-400",
                    "bg-pink-400", "bg-purple-400", "bg-orange-400", "bg-cyan-400"
                  ];
                  // Random rectangle size
                  const width = 2 + Math.random() * 2; // 2-4
                  const height = 1 + Math.random() * 2; // 1-3
                  // Random rotation
                  const rotate = Math.floor(Math.random() * 360);
                  // Random X start
                  const xStart = Math.random() * 100;
                  // Faster fall: 0.8s to 1.5s
                  const duration = 0.8 + Math.random() * 0.7;
                  // Random delay, but confetti is invisible until it starts falling
                  const delay = Math.random() * 0.7;
                  // Keyframes: invisible until fall starts, then fade in and fall
                  const keyframes = `@keyframes confetti-fall-y-${i} {\n                    0% { opacity: 0; transform: translate(${xStart}vw, 0vh) rotate(${rotate}deg); }\n                    1% { opacity: 1; }\n                    100% { opacity: 1; transform: translate(${xStart}vw, 100vh) rotate(${rotate + 360}deg); }\n                  }`;
                  if (typeof window !== "undefined") {
                    const styleId = `confetti-style-y-${i}`;
                    if (!document.getElementById(styleId)) {
                      const style = document.createElement("style");
                      style.id = styleId;
                      style.innerHTML = keyframes;
                      document.head.appendChild(style);
                    }
                  }
                  const animationName = `confetti-fall-y-${i}`;
                  return (
                    <div
                      key={i}
                      className={`absolute ${confettiColors[i % confettiColors.length]} pointer-events-none`}
                      style={{
                        width: `${width * 8}px`,
                        height: `${height * 8}px`,
                        borderRadius: `${Math.random() > 0.7 ? '50%' : '4px'}`,
                        left: 0,
                        top: 0,
                        opacity: 0,
                        animation: `${animationName} ${duration}s linear ${delay}s 1 forwards`,
                        zIndex: 100,
                      }}
                    />
                  );
                })}
              </div>
            )}
            <div className="card-modern glow-mint text-center max-w-md mx-4 scale-in relative overflow-hidden">
              {/* Floating Sparkles */}
              <div className="absolute top-4 right-4 animate-sparkle">
                <Sparkles className="w-6 h-6 text-accent/20" />
              </div>
              <div className="absolute bottom-4 left-4 animate-sparkle" style={{ animationDelay: "0.5s" }}>
                <Zap className="w-4 h-4 text-accent/20" />
              </div>
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-accent/10 star animate-float" />
              <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-accent/10 diamond animate-float" style={{ animationDelay: "1s" }} />
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold-modern text-primary mb-2 animate-slide-up">Gift Sent Successfully!</h3>
              <p className="text-secondary mb-4 font-regular-modern animate-slide-up" style={{ animationDelay: "0.2s" }}>
                Your crypto gift has been successfully sent to the recipient.
              </p>
              {txHash && (
                <div className="text-xs text-secondary font-mono font-regular-modern mb-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                  TX: {shortenAddress(txHash)}
                </div>
              )}
              {voucherId && (
                <div className="text-xs text-secondary font-mono font-regular-modern animate-slide-up" style={{ animationDelay: "0.4s" }}>
                  Voucher ID: {shortenAddress(voucherId)}
                </div>
              )}
              <button
                onClick={() => setShowSuccess(false)}
                className="mt-4 text-accent hover:text-accent-dark transition-colors animate-slide-up"
                style={{ animationDelay: "0.5s" }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
