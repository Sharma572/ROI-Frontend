import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { ChargerTypeProvider } from "./contexts/ChargerTypeContext";
import EVCalculator from "./components/EVCalculator";
import InvestmentTable from "./components/InvestmentTable";
import { WalletProvider } from "./contexts/WalletContext";
import Footer from "./components/Footer";
import PricingPlans from "./components/PricingCard";
import Header from "./components/Header";
import CustomSignup from "./components/CustomSignUp";

function App() {
  return (
    <div className="App">
      <CurrencyProvider>
        <WalletProvider>
          <ChargerTypeProvider>
        <BrowserRouter>
        <Header></Header>
          <Routes>
            <Route path="/" element={<EVCalculator />} />
            <Route path="/admin/table" element={<InvestmentTable />} />
            <Route path="/Pricing" element={<PricingPlans />} />
             <Route path="/signup" element={<CustomSignup />} />
          </Routes>
          <Footer></Footer>
          <Toaster />
        </BrowserRouter>
         </ChargerTypeProvider>
        </WalletProvider>
      </CurrencyProvider>
    </div>
  );
}

export default App;