import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import EVCalculator from "./components/EVCalculator";
import InvestmentTable from "./components/InvestmentTable";

function App() {
  return (
    <div className="App">
      <CurrencyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<EVCalculator />} />
            <Route path="/admin/table" element={<InvestmentTable />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </CurrencyProvider>
    </div>
  );
}

export default App;