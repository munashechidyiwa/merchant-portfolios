
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";

interface MerchantFormData {
  terminalId: string;
  accountCif: string;
  merchantName: string;
  supportOfficer: string;
  businessUnit: string;
  branchCode: string;
  sector: string;
  category: string;
  location: string;
  status: string;
}

interface Merchant {
  id: string;
  terminalId: string;
  accountCif: string;
  name: string;
  category: string;
  officer: string;
  status: string;
  terminals: number;
  zwgSales: number;
  usdSales: number;
  consolidatedUSD: number;
  contribution: number;
  lastActivity: string;
  sector: string;
  businessUnit: string;
  branchCode: string;
  location: string;
}

interface EditMerchantDialogProps {
  merchant: Merchant;
  onEditMerchant: (merchant: MerchantFormData) => void;
  onClose: () => void;
}

const officers = [
  'Takudzwa Madyira',
  'Olivia Usai',
  'Tinashe Mariridza',
  'Mufaro Maphosa'
];

const sectors = [
  'Food & Beverage',
  'Technology',
  'Retail',
  'Healthcare',
  'Insurance',
  'Manufacturing',
  'Education',
  'Transportation'
];

const businessUnits = [
  'Retail Banking',
  'Corporate Banking',
  'SME Banking',
  'Digital Banking'
];

const categories = [
  'Restaurant',
  'Retail',
  'Technology',
  'Healthcare',
  'Insurance'
];

const statuses = ['Active', 'Inactive'];

export function EditMerchantDialog({ merchant, onEditMerchant, onClose }: EditMerchantDialogProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<MerchantFormData>({
    defaultValues: {
      terminalId: merchant.terminalId,
      accountCif: merchant.accountCif,
      merchantName: merchant.name,
      supportOfficer: merchant.officer,
      businessUnit: merchant.businessUnit,
      branchCode: merchant.branchCode,
      sector: merchant.sector,
      category: merchant.category,
      location: merchant.location,
      status: merchant.status
    }
  });

  const onSubmit = (data: MerchantFormData) => {
    onEditMerchant(data);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Merchant - {merchant.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="terminalId">Terminal ID *</Label>
              <Input
                id="terminalId"
                {...register("terminalId", { required: "Terminal ID is required" })}
                placeholder="T001"
              />
              {errors.terminalId && <p className="text-sm text-red-600">{errors.terminalId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountCif">Account CIF *</Label>
              <Input
                id="accountCif"
                {...register("accountCif", { required: "Account CIF is required" })}
                placeholder="CIF001"
              />
              {errors.accountCif && <p className="text-sm text-red-600">{errors.accountCif.message}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="merchantName">Merchant Name *</Label>
              <Input
                id="merchantName"
                {...register("merchantName", { required: "Merchant name is required" })}
                placeholder="Business Name"
              />
              {errors.merchantName && <p className="text-sm text-red-600">{errors.merchantName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="supportOfficer">Support Officer *</Label>
              <Select 
                defaultValue={merchant.officer}
                onValueChange={(value) => setValue("supportOfficer", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select officer" />
                </SelectTrigger>
                <SelectContent>
                  {officers.map((officer) => (
                    <SelectItem key={officer} value={officer}>
                      {officer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessUnit">Business Unit *</Label>
              <Select 
                defaultValue={merchant.businessUnit}
                onValueChange={(value) => setValue("businessUnit", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {businessUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="branchCode">Branch Code *</Label>
              <Input
                id="branchCode"
                {...register("branchCode", { required: "Branch code is required" })}
                placeholder="BR001"
              />
              {errors.branchCode && <p className="text-sm text-red-600">{errors.branchCode.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector *</Label>
              <Select 
                defaultValue={merchant.sector}
                onValueChange={(value) => setValue("sector", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                defaultValue={merchant.category}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select 
                defaultValue={merchant.status}
                onValueChange={(value) => setValue("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="Business address"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Merchant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
