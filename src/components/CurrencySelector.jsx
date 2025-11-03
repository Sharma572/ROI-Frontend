import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useCurrency } from '../contexts/CurrencyContext';
import { Globe } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

const CurrencySelector = () => {
  const { currency, setCurrency, getAvailableCurrencies, getCurrencyName, getCurrencySymbol } = useCurrency();
  const currencies = getAvailableCurrencies();
  const { user,logout,isAuthenticated } = useAuth0();
  return (
    <div className="flex items-center gap-3">
        Currency:
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-600"></span>
      </div>
      <Select value={currency} onValueChange={setCurrency}>
        <SelectTrigger className="w-36 h-8 text-sm">
          <SelectValue placeholder="Select currency">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{getCurrencySymbol()}</span>
              <span>{currency}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {currencies.map((curr) => (
            <SelectItem key={curr.code} value={curr.code}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <span className="font-semibold w-6">{curr.symbol}</span>
                  <span className="font-medium">{curr.code}</span>
                  <span className="text-slate-500 text-sm">{curr.name}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
        {
          isAuthenticated && (<>
           <span className='flex items-center justify-center'>
     <span
  className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg cursor-pointer"
  title={user?.name || "User"}
>
  {user?.name?.charAt(0)?.toUpperCase() || "U"}
</span>

      <span style={{cursor:'pointer',marginLeft:'5px'}}><LogOut onClick={()=>logout()}/></span>
      </span>
          </>)
        }
     
    </div>
  );
};

export default CurrencySelector;