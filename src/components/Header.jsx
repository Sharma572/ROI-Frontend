import React from 'react'
import CurrencySelector from './CurrencySelector'
import { Zap } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="border border-1 p-[2px] border-yellow-500 rounded-lg">
              <img src="./logo1.png" width={65} height={65} alt="logo" />

              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  EV Charging Station
                </h1>
                <p className="text-slate-600">ROI & Cost Calculator</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CurrencySelector />
            
            </div>
          </div>
        </div>
      </header>
  )
}

export default Header