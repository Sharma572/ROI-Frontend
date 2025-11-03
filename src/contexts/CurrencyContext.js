import React, { createContext, useContext, useState } from 'react';

// Mock exchange rates (in production, this would come from a real API)
const EXCHANGE_RATES = {
  INR: 1.0,
  USD: 1.0,
  EUR: 1.0,
  GBP: 1.0,
  CAD: 1.0,
  AUD: 1.0,
  JPY: 1.0,
  CHF: 1.0,
  SEK: 1.0,
  NOK: 1.0,
  DKK: 1.0
};

const CURRENCY_SYMBOLS = {
  INR:'₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
  CHF: 'CHF',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr'
};

const CURRENCY_NAMES = {
  INR:'Indian Rupee',
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  JPY: 'Japanese Yen',
  CHF: 'Swiss Franc',
  SEK: 'Swedish Krona',
  NOK: 'Norwegian Krone',
  DKK: 'Danish Krone'
};

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('INR');

  const convertAmount = (amount, fromCurrency = 'INR', toCurrency = currency) => {
    if (fromCurrency === toCurrency) return amount;
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / EXCHANGE_RATES[fromCurrency];
    return usdAmount * EXCHANGE_RATES[toCurrency];
  };

  const formatCurrency = (amount, currencyCode = currency, showCode = false) => {
    const symbol = CURRENCY_SYMBOLS[currencyCode];
    const convertedAmount = convertAmount(amount, 'INR', currencyCode);
    
    let formattedNumber;
    if (currencyCode === 'JPY') {
      formattedNumber = Math.round(convertedAmount).toLocaleString();
    } else {
      formattedNumber = convertedAmount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    }
    
    if (showCode) {
      return `${symbol}${formattedNumber} ${currencyCode}`;
    }
    
    return `${symbol}${formattedNumber}`;
  };

  


  const formatCurrencyInput = (amount, currencyCode = currency) => {
    return convertAmount(amount, 'INR', currencyCode);
  };

  const convertInputToUSD = (amount, fromCurrency = currency) => {
    return convertAmount(amount, fromCurrency, 'INR');
  };

  const getCurrencySymbol = (currencyCode = currency) => {
    return CURRENCY_SYMBOLS[currencyCode];
  };

  const getCurrencyName = (currencyCode = currency) => {
    return CURRENCY_NAMES[currencyCode];
  };

  const getAvailableCurrencies = () => {
    return Object.keys(CURRENCY_SYMBOLS).map(code => ({
      code,
      name: CURRENCY_NAMES[code],
      symbol: CURRENCY_SYMBOLS[code]
    }));
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertAmount,
        formatCurrency,
        formatCurrencyInput,
        convertInputToUSD,
        getCurrencySymbol,
        getCurrencyName,
        getAvailableCurrencies,
        exchangeRates: EXCHANGE_RATES
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}; 