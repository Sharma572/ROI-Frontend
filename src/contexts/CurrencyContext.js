
import React, { createContext, useContext, useState, useEffect } from 'react';

const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

const CURRENCY_NAMES = {
  INR: 'Indian Rupee',
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
};

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

// ✅ Fetch exchange rates dynamically
// const getExchangeRates = async () => {
//   try {
//     const res = await fetch("https://v6.exchangerate-api.com/v6/0821a9820552888a7ea9ba9c/latest/INR");
//     const data = await res.json();

//     if (data.result !== "success") throw new Error("Failed to load rates");

//     const numericRates = {};
//     for (let key in data.conversion_rates) {
//       numericRates[key] = Number(data.conversion_rates[key]); // convert to number
//     }

//     return numericRates; 
//   } catch (err) {
//     console.error("Exchange Rate API error:", err);
//     return null;
//   }
// };
const EXCHANGE_RATE_KEY = "exchange_rates_inr";
const EXCHANGE_RATE_TIME_KEY = "exchange_rates_time";
const ONE_DAY = 24 * 60 * 60 * 1000;

const getExchangeRates = async () => {
  try {
    // 1️⃣ Check cache
    const cachedRates = localStorage.getItem(EXCHANGE_RATE_KEY);
    const cachedTime = localStorage.getItem(EXCHANGE_RATE_TIME_KEY);

    if (cachedRates && cachedTime) {
      const isExpired = Date.now() - Number(cachedTime) > ONE_DAY;

      if (!isExpired) {
        return JSON.parse(cachedRates); // ✅ use cache
      }
    }

    // 2️⃣ Fetch from API (only when expired)
    const res = await fetch(
      "https://v6.exchangerate-api.com/v6/0821a9820552888a7ea9ba9c/latest/INR"
    );

    const data = await res.json();
    if (data.result !== "success") throw new Error("Failed to load rates");

    const numericRates = {};
    for (let key in data.conversion_rates) {
      numericRates[key] = Number(data.conversion_rates[key]);
    }

    // 3️⃣ Save to cache
    localStorage.setItem(EXCHANGE_RATE_KEY, JSON.stringify(numericRates));
    localStorage.setItem(EXCHANGE_RATE_TIME_KEY, Date.now().toString());

    return numericRates;
  } catch (err) {
    console.error("Exchange Rate API error:", err);
    return null;
  }
};



export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('INR');
 const [exchangeRates, setExchangeRates] = useState({
  INR: 1,  // default base
});

useEffect(() => {
  const fetchRates = async () => {
    const rates = await getExchangeRates();
    if (rates) {
      setExchangeRates({
        ...rates,
        INR: 1, // ensure base INR = 1
      });
    }
  };
  fetchRates();
}, []);


  // ✅ Convert between currencies
  // const convertAmount = (amount, fromCurrency = 'INR', toCurrency = currency) => {
  //   if (fromCurrency === toCurrency) return amount;

  //   const inBase = amount / exchangeRates[fromCurrency]; // convert to INR first
  //   return inBase * exchangeRates[toCurrency];
  // };
const convertAmount = (amount, fromCurrency = "INR", toCurrency = currency) => {
  amount = Number(amount) || 0;

  const fromRate = exchangeRates[fromCurrency]; // e.g. INR = 1
  const toRate = exchangeRates[toCurrency];     // e.g. USD = 0.01106

  if (!fromRate || !toRate) return 0;

  // convert to INR first
  const amountInINR = fromCurrency === "INR" ? amount : amount / fromRate;

  // convert INR → target currency
  return amountInINR * toRate;
};

const CURRENCY_LOCALE = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
};

const formatCurrency = (amount, currencyCode = currency) => {
  const converted = convertAmount(amount, "INR", currencyCode);
  const safe = Number(converted) || 0;

  return safe.toLocaleString(
    CURRENCY_LOCALE[currencyCode] || "en-IN",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  );
};
// Working code 
// const formatCurrency = (amount, currencyCode = currency) => {
//   const converted = convertAmount(amount, "INR", currencyCode);
//   const safe = Number(converted) || 0;

//   return safe.toLocaleString("en-IN", {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   });
// };


  // const formatCurrency = (amount, currencyCode = currency, showCode = false) => {
  //   const symbol = CURRENCY_SYMBOLS[currencyCode];
  //   const convertedAmount = convertAmount(amount, 'INR', currencyCode);

  //   const formattedNumber = convertedAmount.toLocaleString('en-IN', {
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  //   });

  //   return showCode
  //     ? `${formattedNumber} ${currencyCode}`
  //     : `${formattedNumber}`;
  // };

  const formatCurrencyInput = (amount, currencyCode = currency) =>
    convertAmount(amount, 'INR', currencyCode);

  const convertInputToUSD = (amount, fromCurrency = currency) =>
    convertAmount(amount, fromCurrency, 'INR');

  const getCurrencySymbol = (currencyCode = currency) =>
    CURRENCY_SYMBOLS[currencyCode];

  const getCurrencyName = (currencyCode = currency) =>
    CURRENCY_NAMES[currencyCode];

  const getAvailableCurrencies = () =>
    Object.keys(CURRENCY_SYMBOLS).map((code) => ({
      code,
      name: CURRENCY_NAMES[code],
      symbol: CURRENCY_SYMBOLS[code],
    }));

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
        exchangeRates, // ✅ live rates stored here
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
