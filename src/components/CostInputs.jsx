import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Plug, Wrench, Zap, Building } from "lucide-react";
import { useCurrency } from "../contexts/CurrencyContext";

const CostInputs = ({ costData, setCostData }) => {
  const { getCurrencySymbol, formatCurrencyInput, convertInputToUSD } =
    useCurrency();
  const updateCostData = (category, field, value) => {
    const usdValue = convertInputToUSD(parseFloat(value) || 0);
    setCostData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: usdValue,
      },
    }));
  };

  const updateEquipmentData = (type, field, value) => {
    const usdValue =
      field === "quantity"
        ? parseFloat(value) || 0
        : convertInputToUSD(parseFloat(value) || 0);
    setCostData((prev) => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [type]: {
          ...prev.equipment[type],
          [field]: usdValue,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Equipment Costs */}
      <Card className="border-2 hover:border-emerald-200 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-emerald-600" />
            Equipment Costs
          </CardTitle>
          <CardDescription>
            Hardware and infrastructure equipment needed for your charging
            station
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-700">
                Level 2 Chargers (AC)
              </h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="level2-qty">Quantity</Label>
                  <Input
                    id="level2-qty"
                    type="number"
                    placeholder="0"
                    value={costData.equipment.level2Chargers.quantity || ""}
                    onChange={(e) =>
                      updateEquipmentData(
                        "level2Chargers",
                        "quantity",
                        e.target.value
                      )
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="level2-cost">
                    Unit Cost ({getCurrencySymbol()})
                  </Label>
                  <Input
                    id="level2-cost"
                    type="number"
                    placeholder={formatCurrencyInput(2500).toFixed(0)}
                    value={formatCurrencyInput(
                      costData.equipment.level2Chargers.unitCost || 0
                    ).toFixed(0)}
                    onChange={(e) =>
                      updateEquipmentData(
                        "level2Chargers",
                        "unitCost",
                        e.target.value
                      )
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-slate-700">
                Level 3 Chargers (DC Fast)
              </h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="level3-qty">
                    Quantity
                    <span className="text-red-600 font-bold">*</span>
                  </Label>
                  <Input
                    id="level3-qty"
                    type="number"
                    placeholder="0"
                    value={costData.equipment.level3Chargers.quantity || ""}
                    onChange={(e) =>
                      updateEquipmentData(
                        "level3Chargers",
                        "quantity",
                        e.target.value
                      )
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="level3-cost">
                    Unit Cost ({getCurrencySymbol()}){" "}
                    <span className="text-red-600 font-bold">*</span>
                  </Label>
                  <Input
                    id="level3-cost"
                    type="number"
                    placeholder={formatCurrencyInput(45000).toFixed(0)}
                    value={formatCurrencyInput(
                      costData.equipment.level3Chargers.unitCost || 0
                    ).toFixed(0)}
                    onChange={(e) =>
                      updateEquipmentData(
                        "level3Chargers",
                        "unitCost",
                        e.target.value
                      )
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="transformer">
                Transformer ({getCurrencySymbol()})
              </Label>
              <Input
                id="transformer"
                type="number"
                placeholder={formatCurrencyInput(25000).toFixed(0)}
                value={formatCurrencyInput(
                  costData.equipment.transformer || 0
                ).toFixed(0)}
                onChange={(e) =>
                  updateCostData("equipment", "transformer", e.target.value)
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="electrical-infra">
                Electrical Infrastructure ({getCurrencySymbol()})
              </Label>
              <Input
                id="electrical-infra"
                type="number"
                placeholder="0"
                value={costData.equipment.electricalInfrastructure || ""}
                onChange={(e) =>
                  updateCostData(
                    "equipment",
                    "electricalInfrastructure",
                    e.target.value
                  )
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="networking">
                Networking & Software ({getCurrencySymbol()})
              </Label>
              <Input
                id="networking"
                type="number"
                placeholder="0"
                value={costData.equipment.networkingSoftware || ""}
                onChange={(e) =>
                  updateCostData(
                    "equipment",
                    "networkingSoftware",
                    e.target.value
                  )
                }
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Installation Costs */}
      <Card className="border-2 hover:border-blue-200 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-600" />
            Installation Costs
          </CardTitle>
          <CardDescription>
            One-time setup and installation expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="site-prep">
                Site Preparation ({getCurrencySymbol()})
              </Label>
              <Input
                id="site-prep"
                type="number"
                placeholder="0"
                value={costData.installation.sitePreperation || ""}
                onChange={(e) =>
                  updateCostData(
                    "installation",
                    "sitePreperation",
                    e.target.value
                  )
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="electrical-install">
                Electrical Installation ({getCurrencySymbol()})
              </Label>
              <Input
                id="electrical-install"
                type="number"
                placeholder="0"
                value={costData.installation.electricalInstallation || ""}
                onChange={(e) =>
                  updateCostData(
                    "installation",
                    "electricalInstallation",
                    e.target.value
                  )
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="permits">
                Permits & Approvals ({getCurrencySymbol()})
              </Label>
              <Input
                id="permits"
                type="number"
                placeholder="0"
                value={costData.installation.permits || ""}
                onChange={(e) =>
                  updateCostData("installation", "permits", e.target.value)
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="labor">Labor Costs ({getCurrencySymbol()})</Label>
              <Input
                id="labor"
                type="number"
                placeholder="0"
                value={costData.installation.laborCosts || ""}
                onChange={(e) =>
                  updateCostData("installation", "laborCosts", e.target.value)
                }
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operating Costs */}
      <Card className="border-2 hover:border-amber-200 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-amber-600" />
            Annual Operating Costs
          </CardTitle>
          <CardDescription>
            Recurring costs for running your charging station
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="electricity-rate">
                Electricity Cost ({getCurrencySymbol()}){" "}
                <span className="text-red-600 font-bold">*</span> (/kWh)
              </Label>
              <Input
                id="electricity-rate"
                type="number"
                step="0.01"
                placeholder="0"
                value={costData.operating.electricityCostPerKwh || ""}
                onChange={(e) =>
                  updateCostData(
                    "operating",
                    "electricityCostPerKwh",
                    e.target.value
                  )
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="maintenance">
                Maintenance ({getCurrencySymbol()})
              </Label>
              <Input
                id="maintenance"
                type="number"
                placeholder="0"
                value={costData.operating.maintenance || ""}
                onChange={(e) =>
                  updateCostData("operating", "maintenance", e.target.value)
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="network-fees">
                Network Fees ({getCurrencySymbol()})
              </Label>
              <Input
                id="network-fees"
                type="number"
                placeholder="0"
                value={costData.operating.networkFees || ""}
                onChange={(e) =>
                  updateCostData("operating", "networkFees", e.target.value)
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="insurance">
                Insurance ({getCurrencySymbol()})
              </Label>
              <Input
                id="insurance"
                type="number"
                placeholder="0"
                value={costData.operating.insurance || ""}
                onChange={(e) =>
                  updateCostData("operating", "insurance", e.target.value)
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="land-lease">
                Land Lease/Rent ({getCurrencySymbol()})
              </Label>
              <Input
                id="land-lease"
                type="number"
                placeholder="0"
                value={costData.operating.landLease || ""}
                onChange={(e) =>
                  updateCostData("operating", "landLease", e.target.value)
                }
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostInputs;
