import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DollarSign, Users, TrendingUp, Clock } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

const RevenueInputs = ({ revenueData, setRevenueData }) => {
  const { getCurrencySymbol, formatCurrencyInput, convertInputToUSD } = useCurrency();
  const updatePricing = (field, value) => {
    const usdValue = field === 'membershipFee' ? convertInputToUSD(parseFloat(value) || 0) : parseFloat(value) || 0;
    setRevenueData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: usdValue
      }
    }));
  };

  const updateUsage = (field, value) => {
    setRevenueData(prev => ({
      ...prev,
      usage: {
        ...prev.usage,
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const updateTimeline = (field, value) => {
    setRevenueData(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        [field]: parseInt(value) || 5
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Pricing Strategy */}
      <Card className="border-2 hover:border-emerald-200 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            Pricing Strategy
          </CardTitle>
          <CardDescription>
            Set your charging rates and membership fees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="level2-rate">Level 2 Rate ({getCurrencySymbol()}/kWh)</Label>
              <Input
                id="level2-rate"
                type="number"
                step="0.01"
                placeholder="0.25"
                value={revenueData.pricing.level2Rate || ''}
                onChange={(e) => updatePricing('level2Rate', e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-slate-500 mt-1">Typical range: {getCurrencySymbol()}0.20 - {getCurrencySymbol()}0.35</p>
            </div>
            <div>
              <Label htmlFor="level3-rate">Level 3 Rate ({getCurrencySymbol()}/kWh)</Label>
              <Input
                id="level3-rate"
                type="number"
                step="0.01"
                placeholder="0.45"
                value={revenueData.pricing.level3Rate || ''}
                onChange={(e) => updatePricing('level3Rate', e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-slate-500 mt-1">Typical range: {getCurrencySymbol()}0.35 - {getCurrencySymbol()}0.60</p>
            </div>
            <div>
              <Label htmlFor="membership-fee">Monthly Membership Fee ({getCurrencySymbol()})</Label>
              <Input
                id="membership-fee"
                type="number"
                placeholder="0"
                value={formatCurrencyInput(revenueData.pricing.membershipFee || 0).toFixed(0)}
                onChange={(e) => updatePricing('membershipFee', e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-slate-500 mt-1">Optional subscription model</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Projections */}
      <Card className="border-2 hover:border-blue-200 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Usage Projections
          </CardTitle>
          <CardDescription>
            Estimate how much your charging station will be used
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="daily-level2">Daily Level 2 Sessions</Label>
              <Input
                id="daily-level2"
                type="number"
                placeholder="15"
                value={revenueData.usage.dailySessionsLevel2 || ''}
                onChange={(e) => updateUsage('dailySessionsLevel2', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="daily-level3">Daily Level 3 Sessions</Label>
              <Input
                id="daily-level3"
                type="number"
                placeholder="8"
                value={revenueData.usage.dailySessionsLevel3 || ''}
                onChange={(e) => updateUsage('dailySessionsLevel3', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="session-duration">Avg Session Duration (hours)</Label>
              <Input
                id="session-duration"
                type="number"
                step="0.1"
                placeholder="2.0"
                value={revenueData.usage.avgSessionDuration || ''}
                onChange={(e) => updateUsage('avgSessionDuration', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="energy-per-session">Avg Energy per Session (kWh)</Label>
              <Input
                id="energy-per-session"
                type="number"
                placeholder="25"
                value={revenueData.usage.avgEnergyPerSession || ''}
                onChange={(e) => updateUsage('avgEnergyPerSession', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="growth-rate">Annual Growth Rate (%)</Label>
              <Input
                id="growth-rate"
                type="number"
                placeholder="0"
                value={revenueData.usage.growthRate || ''}
                onChange={(e) => updateUsage('growthRate', e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-slate-500 mt-1">Expected yearly usage increase</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Timeline */}
      <Card className="border-2 hover:border-purple-200 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Analysis Timeline
          </CardTitle>
          <CardDescription>
            Set the time period for your ROI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="analysis-years">Analysis Period (years)</Label>
              <Select 
                value={revenueData.timeline.analysisYears.toString()} 
                onValueChange={(value) => updateTimeline('analysisYears', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 years</SelectItem>
                  <SelectItem value="5">5 years</SelectItem>
                  <SelectItem value="7">7 years</SelectItem>
                  <SelectItem value="10">10 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueInputs;