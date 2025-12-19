"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import type { Account } from "@/features/account-management/pages/accounts.data";

interface AccountDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  parentAccount: Account | null;
  accountNumber: string;
  setAccountNumber: (val: string) => void;
  onConfirm: () => void;
}

export const AccountDialog: React.FC<AccountDialogProps> = ({
  open,
  setOpen,
  parentAccount,
  accountNumber,
  setAccountNumber,
  onConfirm,
}) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {parentAccount ? "Add Sub-account" : "Create Root Account"}
        </DialogTitle>
        <DialogDescription>
          {parentAccount
            ? `Child of ${parentAccount.account_number}`
            : "Create a new root account"}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Input
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
