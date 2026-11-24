"use client"

import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from "@/components/ui/Button";
import { Copy, CheckCircle, Bitcoin, Wallet, AlertCircle } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DonationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [cryptoType, setCryptoType] = useState("ETH");
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [donationState, setDonationState] = useState<"idle" | "pending" | "confirmed">("idle");
  
  // Mock wallet addresses - in a real implementation, these would come from your actual wallets
  const walletAddresses = {
    ETH: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    SOL: "8ZwGCUANf827VFfymxkCKLEqXJjnBz3Je9JwKK9D5MNj"
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddresses[cryptoType as keyof typeof walletAddresses]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDonate = () => {
    // This would connect to Web3 wallet in a real implementation
    setDonationState("pending");
    
    // Simulate transaction time
    setTimeout(() => {
      setDonationState("confirmed");
      setTimeout(() => setDonationState("idle"), 3000);
    }, 2000);
  };
  
  return (
    <section 
      id="donate"
      ref={ref}
      className="py-24 px-4 relative overflow-hidden"
    >
      {/* Animated gradient background - using a different gradient color scheme */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-teal-900/50 to-blue-900/50 bg-size-200 animate-gradient-xy"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto max-w-4xl text-center relative z-10 bg-black/30 backdrop-blur-lg p-12 rounded-2xl border border-white/10"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
          Support Our <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Vision</span> with Crypto
        </h2>
        
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Help us build the future of AI-powered tools. Your contribution fuels our innovation and community development.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-black/40 p-6 rounded-xl border border-white/10">
            <h3 className="text-2xl font-bold mb-4 text-white">Donate with Crypto</h3>
            
            <div className="space-y-6">
              <div className="space-y-2 text-left">
                <Label htmlFor="crypto-type" className="text-white text-sm">Select Currency</Label>
                <Select
                  value={cryptoType}
                  onValueChange={setCryptoType}
                >
                  <SelectTrigger className="w-full bg-black/60 border-white/20">
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="SOL">Solana (SOL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="amount" className="text-white text-sm">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder={`Amount in ${cryptoType}`}
                  className="bg-black/60 border-white/20"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              
              <div className="space-y-2 text-left">
                <Label htmlFor="wallet-address" className="text-white text-sm">Wallet Address</Label>
                <div className="flex items-center">
                  <Input
                    id="wallet-address"
                    type="text" 
                    value={walletAddresses[cryptoType as keyof typeof walletAddresses]}
                    readOnly
                    className="bg-black/60 border-white/20"
                  />
                  <Button 
                    variant="ghost" 
                    className="ml-2"
                    onClick={handleCopyAddress}
                  >
                    {copied ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-black/40 p-6 rounded-xl border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">Why Donate?</h3>
              <ul className="text-left space-y-4 mb-8">
                <li className="flex items-start">
                  <span className="inline-flex mr-2 mt-1 items-center justify-center rounded-full bg-emerald-900/30 p-1">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  </span> 
                  <span className="text-gray-300">Support the development of open-source AI tools</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex mr-2 mt-1 items-center justify-center rounded-full bg-emerald-900/30 p-1">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  </span> 
                  <span className="text-gray-300">Help us expand our infrastructure for better services</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex mr-2 mt-1 items-center justify-center rounded-full bg-emerald-900/30 p-1">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  </span> 
                  <span className="text-gray-300">Become part of our early supporters community</span>
                </li>
              </ul>
            </div>
            
            {donationState === "confirmed" ? (
              <Alert className="bg-emerald-900/30 border-emerald-500/30 text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Thank you for your donation! Your transaction has been confirmed.
                </AlertDescription>
              </Alert>
            ) : (
              <Button 
                className="group relative px-6 py-3 text-lg font-medium transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white border-none w-full flex items-center justify-center"
                onClick={handleDonate}
                disabled={!amount || donationState === "pending"}
              >
                {donationState === "pending" ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <Wallet className="mr-2 h-5 w-5" />
                    Connect Wallet & Donate
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        
        <div className="pt-6 border-t border-white/10">
          <p className="text-gray-400 text-sm">
            Your donation may be tax-deductible. Please consult with a tax professional. 
            Transactions are secured by blockchain technology.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default DonationSection;