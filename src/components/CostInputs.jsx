import React,{useEffect, useState} from "react";
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
import { useChargerType } from "@/contexts/ChargerTypeContext";

const CostInputs = ({ costData, setCostData,isAutofill,setIsAutofill,errors,  setErrors  }) => {
  const { getCurrencySymbol, formatCurrencyInput, convertInputToUSD } =
    useCurrency();
    const revenueOptions = [
  { label: "Revenue Share (%)", value: "percentage" },
  { label: "Revenue Share per kWh", value: "perKwh" }
];
console.log("error of CostInput ❌",errors);

const [revenueType, setRevenueType] = useState("percentage");
useEffect(() => {
  // Sync UI dropdown with parent costData value
  setRevenueType(costData.operating.revenueType);
}, [costData?.operating?.revenueType]);
  // const updateCostData = (category, field, value) => {
  //   const usdValue = convertInputToUSD(parseFloat(value) || 0);
  //   setCostData((prev) => ({
  //     ...prev,
  //     [category]: {
  //       ...prev[category],
  //       [field]: usdValue,
  //     },
  //   }));
  // };
 const updateCostData = (category, field, value) => {
  // IF field is revenueType -> save as STRING
  if (field === "revenueType") {
    setCostData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,  // KEEP STRING
      },
    }));
    return;
  }

  // If numeric -> convert
  const usdValue = convertInputToUSD(parseFloat(value) || 0);

  setCostData((prev) => ({
    ...prev,
    [category]: {
      ...prev[category],
      [field]: usdValue,
    },
  }));
};

  console.log("Cost Data in CostInput",costData);
 
  const { chargerType, setChargerType } = useChargerType();

useEffect(() => {
  // ⛔ Do NOT auto-switch when user types manually.
  if (!isAutofill) return;

  if (!costData?.equipment) return;

  const l2 = costData.equipment.level2Chargers?.quantity || 0;
  const l3 = costData.equipment.level3Chargers?.quantity || 0;

  if (l2 > 0 && l3 > 0) {
    setChargerType("both");
  } else if (l2 > 0) {
    setChargerType("level2");
  } else if (l3 > 0) {
    setChargerType("level3");
  } else {
    setChargerType("level2");
  }

  // After auto-selecting ONCE, disable autofill mode
  setIsAutofill(false);

}, [costData, isAutofill]);


  // const updateEquipmentData = (type, field, value) => {
  //   const usdValue =
  //     field === "quantity"
  //       ? parseFloat(value) || 0
  //       : convertInputToUSD(parseFloat(value) || 0);
  //   setCostData((prev) => ({
  //     ...prev,
  //     equipment: {
  //       ...prev.equipment,
  //       [type]: {
  //         ...prev.equipment[type],
  //         [field]: usdValue,
  //       },
  //     },
  //   }));
  // };
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

  // ✅ CLEAR ERROR WHEN USER TYPES
 setErrors((prev) => {
  if (!prev) return prev;

  const updated = { ...prev };

  if (type === "level2Chargers" && field === "quantity") {
    delete updated.level2Qty;
  }
  if (type === "level2Chargers" && field === "unitCost") {
    delete updated.level2Cost;
  }
  if (type === "level3Chargers" && field === "quantity") {
    delete updated.level3Qty;
  }
  if (type === "level3Chargers" && field === "unitCost") {
    delete updated.level3Cost;
  }

  return updated;
});
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
         
<div className="border-b flex gap-6 text-sm font-medium mb-6">
  <button
    className={`pb-2 ${
      chargerType === "level2"
        ? "border-b-2 border-blue-600 text-blue-600"
        : "text-slate-500"
    }`}
    onClick={() => setChargerType("level2")}
  >
    Level 2 (AC)
  </button>

  <button
    className={`pb-2 ${
      chargerType === "level3"
        ? "border-b-2 border-blue-600 text-blue-600"
        : "text-slate-500"
    }`}
    onClick={() => setChargerType("level3")}
  >
    Level 3 (DC Fast)
  </button>

  <button
    className={`pb-2 ${
      chargerType === "both"
        ? "border-b-2 border-blue-600 text-blue-600"
        : "text-slate-500"
    }`}
    onClick={() => setChargerType("both")}
  >
    Both
  </button>
</div>
<div className="grid md:grid-cols-2 gap-6">

  {/* LEVEL 2 SECTION */}
  {(chargerType === "level2" || chargerType === "both") && (
    <div className="space-y-4">
      <h4 className="font-semibold text-slate-700">
        Level 2 Chargers (AC)
      </h4>

      <div className="space-y-3">
        <div>
          <Label htmlFor="level2-qty">Quantity  <span className="text-red-600 font-bold">*</span></Label>
          <Input
            id="level2-qty"
            className={`mt-1 ${
    errors.level2Qty ? "border-red-500 focus:ring-red-500" : ""
  }`}
          type="text"
          required
            placeholder="0"
            value={costData.equipment.level2Chargers.quantity || ""}
            onChange={(e) =>
              updateEquipmentData("level2Chargers", "quantity", e.target.value)
            }
           
          />
          {errors.level2Qty && (
  <p className="text-sm text-red-600 mt-1">{errors.level2Qty}</p>
)}
        </div>

        <div>
          <Label htmlFor="level2-cost">
            Unit Cost ({getCurrencySymbol()})  <span className="text-red-600 font-bold">*</span>
          </Label>
          <Input
            id="level2-cost"
            type="text"
            placeholder={formatCurrencyInput(0).toFixed(0)}
            required
             className={`mt-1 ${
    errors.level2Cost ? "border-red-500 focus:ring-red-500" : ""
  }`}
            // value={formatCurrencyInput(
            //   costData.equipment.level2Chargers.unitCost || 0
            // ).toFixed(0)}
            value={
  costData.equipment.level2Chargers.unitCost > 0
    ? formatCurrencyInput(
        costData.equipment.level2Chargers.unitCost
      ).toFixed(0)
    : ""
}

            onChange={(e) =>
              updateEquipmentData("level2Chargers", "unitCost", e.target.value)
            }
           
          />
          {errors.level2Cost && (
  <p className="text-sm text-red-600 mt-1">{errors.level2Cost}</p>
)}
        </div>
      </div>
    </div>
  )}

  {/* LEVEL 3 SECTION */}
  {(chargerType === "level3" || chargerType === "both") && (
    <div className="space-y-4">
      <h4 className="font-semibold text-slate-700">
        Level 3 Chargers (DC Fast)
      </h4>

      <div className="space-y-3">
        <div>
          <Label htmlFor="level3-qty">
            Quantity <span className="text-red-600 font-bold">*</span>
          </Label>
          <Input
            id="level3-qty"
            type="text"
            placeholder="0"
            required
            value={costData.equipment.level3Chargers.quantity || ""}
            onChange={(e) =>
              updateEquipmentData("level3Chargers", "quantity", e.target.value)
            }
           className={`mt-1 ${
    errors.level3Qty ? "border-red-500 focus:ring-red-500" : ""
  }`}
          />
          {errors.level3Qty && (
  <p className="text-sm text-red-600 mt-1">{errors.level3Qty}</p>
)}
        </div>

        <div>
          <Label htmlFor="level3-cost">
            Unit Cost ({getCurrencySymbol()})
            <span className="text-red-600 font-bold">*</span>
          </Label>
          <Input
            id="level3-cost"
            type="text"
            required
            // placeholder={formatCurrencyInput(45000).toFixed(0)}
            placeholder="0"
            // value={formatCurrencyInput(
            //   costData.equipment.level3Chargers.unitCost || 0
            // ).toFixed(0)}
            value={
  costData.equipment.level3Chargers.unitCost > 0
    ? formatCurrencyInput(
        costData.equipment.level3Chargers.unitCost
      ).toFixed(0)
    : ""
}

            onChange={(e) =>
              updateEquipmentData("level3Chargers", "unitCost", e.target.value)
            }
          className={`mt-1 ${
    errors.level3Cost ? "border-red-500 focus:ring-red-500" : ""
  }`}
          />
          {errors.level3Cost && (
  <p className="text-sm text-red-600 mt-1">{errors.level3Cost}</p>
)}
        </div>
      </div>
    </div>
  )}

</div>


          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="transformer">
                Transformer ({getCurrencySymbol()})
              </Label>
              <Input
                id="transformer"
                type="text"
                placeholder={formatCurrencyInput(0).toFixed(0)}
                // value={formatCurrencyInput(
                //   costData.equipment.transformer || ""
                // ).toFixed(0)}
                value={
  costData.equipment.transformer > 0
    ? formatCurrencyInput(costData.equipment.transformer).toFixed(0)
    : ""
}

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
                type="text"
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
                type="text"
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
                type="text"
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
                type="text"
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
                type="text"
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
                type="text"
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
              {/* <Input
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
              /> */}
              <Input
  id="electricity-rate"
  type="number"
  min="0"
  step="0.01"
  inputMode="decimal"
  placeholder="0"
  value={
    costData.operating.electricityCostPerKwh > 0
      ? costData.operating.electricityCostPerKwh
      : ""
  }
  onChange={(e) =>
    updateCostData(
      "operating",
      "electricityCostPerKwh",
      e.target.value
    )
  }
  className="mt-1"
/>

               <p className="text-sm text-slate-500 mt-1">
        Typical Cost: {getCurrencySymbol()}4 - {getCurrencySymbol()}11
      </p>
            </div>
            <div>
              <Label htmlFor="maintenance">
                Maintenance ({getCurrencySymbol()})
              </Label>
              <Input
                id="maintenance"
                type="text"
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
                type="text"
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
                type="text"
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
                type="text"
                placeholder="0"
                value={costData.operating.landLease || ""}
                onChange={(e) =>
                  updateCostData("operating", "landLease", e.target.value)
                }
                className="mt-1"
              />
            </div>
            <div>
             <div className="space-y-2">

<Label htmlFor="land-lease">
                Revenue Share Type ({getCurrencySymbol()})
              </Label>
  {/* Modern Card Container */}
  <div className="flex">
    {/* Dropdown */}
   <select
  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/30 focus:outline-none transition"
  value={revenueType}
  onChange={(e) => {
    const value = e.target.value;
    setRevenueType(value);  // UI state
    updateCostData("operating", "revenueType", value);  // IMPORTANT FIX
  }}
>
  <option value="percentage">Revenue Share (%)</option>
  <option value="perKwh">Revenue Share per kWh</option>
</select>


    {/* Conditional Input */}
    {revenueType === "percentage" && (
      <input
        type="number"
        placeholder="Enter Percentage (%)"
        className="w-full border rounded-lg px-3 mx-2 py-2 text-sm focus:ring-2 focus:ring-black/30 focus:outline-none transition"
        value={costData.operating.revenuePercentage || ""}
        onChange={(e) =>
          updateCostData("operating", "revenuePercentage", e.target.value)
        }
      />
    )}

   {revenueType === "perKwh" && (
  <input
    type="number"
    placeholder={`Enter Amount (${getCurrencySymbol()}/kWh)`}
    className="w-full border rounded-lg mx-2 px-3 py-2 text-sm focus:ring-2 focus:ring-black/30 focus:outline-none transition"
    value={costData.operating.revenuePerKwh || ""}
    onChange={(e) => {
      updateCostData("operating", "revenueType", "perKwh");  // AUTO UPDATE
      updateCostData("operating", "revenuePerKwh", e.target.value);
    }}
  />
)}

  </div>
</div>

            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostInputs;
