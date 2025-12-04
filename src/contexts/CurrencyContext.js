// import React, { createContext, useContext, useState } from 'react';

// // Mock exchange rates (in production, this would come from a real API)
// const EXCHANGE_RATES = {
//   INR: 1.0,
//   USD: 1.0,
//   EUR: 1.0,
//   GBP: 1.0,
// };

// const CURRENCY_SYMBOLS = {
//   INR:'₹',
//   USD: '$',
//   EUR: '€',
//   GBP: '£',
// };

// const CURRENCY_NAMES = {
//   INR:'Indian Rupee',
//   USD: 'US Dollar',
//   EUR: 'Euro',
//   GBP: 'British Pound',
// };

// const CurrencyContext = createContext();

// export const useCurrency = () => {
//   const context = useContext(CurrencyContext);
//   if (!context) {
//     throw new Error('useCurrency must be used within a CurrencyProvider');
//   }
//   return context;
// };

// export const CurrencyProvider = ({ children }) => {
//   const [currency, setCurrency] = useState('INR');

//   const convertAmount = (amount, fromCurrency = 'INR', toCurrency = currency) => {
//     if (fromCurrency === toCurrency) return amount;
    
//     // Convert to USD first, then to target currency
//     const usdAmount = amount / EXCHANGE_RATES[fromCurrency];
//     return usdAmount * EXCHANGE_RATES[toCurrency];
//   };

//   const formatCurrency = (amount, currencyCode = currency, showCode = false) => {
//     const symbol = CURRENCY_SYMBOLS[currencyCode];
//     const convertedAmount = convertAmount(amount, 'INR', currencyCode);
    
//     let formattedNumber;
//     if (currencyCode === 'JPY') {
//       formattedNumber = Math.round(convertedAmount).toLocaleString();
//     } else {
//       formattedNumber = convertedAmount.toLocaleString("en-IN", {
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0
//       });
//     }
    
//     if (showCode) {
//       return `${symbol}${formattedNumber} ${currencyCode}`;
//     }
    
//     return `${symbol}${formattedNumber}`;
//   };

  


//   const formatCurrencyInput = (amount, currencyCode = currency) => {
//     return convertAmount(amount, 'INR', currencyCode);
//   };

//   const convertInputToUSD = (amount, fromCurrency = currency) => {
//     return convertAmount(amount, fromCurrency, 'INR');
//   };

//   const getCurrencySymbol = (currencyCode = currency) => {
//     return CURRENCY_SYMBOLS[currencyCode];
//   };

//   const getCurrencyName = (currencyCode = currency) => {
//     return CURRENCY_NAMES[currencyCode];
//   };

//   const getAvailableCurrencies = () => {
//     return Object.keys(CURRENCY_SYMBOLS).map(code => ({
//       code,
//       name: CURRENCY_NAMES[code],
//       symbol: CURRENCY_SYMBOLS[code]
//     }));
//   };

//   return (
//     <CurrencyContext.Provider
//       value={{
//         currency,
//         setCurrency,
//         convertAmount,
//         formatCurrency,
//         formatCurrencyInput,
//         convertInputToUSD,
//         getCurrencySymbol,
//         getCurrencyName,
//         getAvailableCurrencies,
//         exchangeRates: EXCHANGE_RATES
//       }}
//     >
//       {children}
//     </CurrencyContext.Provider>
//   );
// }; 

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
const getExchangeRates = async (base = 'INR') => {
  const apiKey = '05369c033ec2e8d3c45f5087569d39cd';
  try {
    const response = await fetch(
      `https://api.exchangerate.host/live?access_key=05369c033ec2e8d3c45f5087569d39cd`,
      {
        headers: { apikey: apiKey },
      }
    );

    const data = await response.json();

    if (!data || data.success === false) {
      throw new Error(data.error?.info || 'Failed to fetch exchange rates');
    }

    return data.rates; // e.g., { USD: 0.012, EUR: 0.011, GBP: 0.0096 }
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    return null;
  }
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('INR');
  const [exchangeRates, setExchangeRates] = useState({
    INR:88.728999,
    USD: 1.0,
    EUR: 0.86058,
    GBP: 0.760115,
  });

  // ✅ Fetch rates when component mounts
  useEffect(() => {
    const fetchRates = async () => {
      const rates = await getExchangeRates('INR');
      if (rates) setExchangeRates({ ...rates, INR: 1.0 }); // Ensure INR stays base 1.0
    };
    fetchRates();
  }, []);

  // ✅ Convert between currencies
  const convertAmount = (amount, fromCurrency = 'INR', toCurrency = currency) => {
    if (fromCurrency === toCurrency) return amount;

    const inBase = amount / exchangeRates[fromCurrency]; // convert to INR first
    return inBase * exchangeRates[toCurrency];
  };

  const formatCurrency = (amount, currencyCode = currency, showCode = false) => {
    const symbol = CURRENCY_SYMBOLS[currencyCode];
    const convertedAmount = convertAmount(amount, 'INR', currencyCode);

    const formattedNumber = convertedAmount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return showCode
      ? `${formattedNumber} ${currencyCode}`
      : `${formattedNumber}`;
  };

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
