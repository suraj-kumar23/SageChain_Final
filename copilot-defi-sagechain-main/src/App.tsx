import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ContractUI from "./components/ContractUI";
import SwapPanel from "./components/SwapPanel"; // ✅ Added import
import WalletConnector, { WalletData } from "@/components/WalletConnector";
import CryptoTrading from "@/components/CryptoTrading";
import { useState } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [walletData, setWalletData] = useState<WalletData | null>(null);

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/contract" element={<ContractUI />} />
        <Route path="/swap" element={<SwapPanel />} /> {/* ✅ Added route */}
        <Route path="/wallet" element={<WalletConnector isConnected={!!walletData} onConnect={setWalletData} onDisconnect={() => setWalletData(null)} />} />
        <Route path="/crypto" element={<CryptoTrading walletData={walletData} />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
