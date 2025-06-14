
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
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
}

interface AddMerchantDialogProps {
  onAddMerchant: (merchant: MerchantFormData) => void;
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

export function AddMerchantDialog({ onAddMerchant }: AddMerchantDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<MerchantFormData>();

  const onSubmit = (data: MerchantFormData) => {
    onAddMerchant(data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Merchant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Merchant</DialogTitle>
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
              <Select onValueChange={(value) => setValue("supportOfficer", value)}>
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
              <Select onValueChange={(value) => setValue("businessUnit", value)}>
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
              <Select onValueChange={(value) => setValue("sector", value)}>
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
              <Select onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Restaurant">Restaurant</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Merchant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
