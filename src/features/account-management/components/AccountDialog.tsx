import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import type { CreateAccountPayload, Account } from "@/features/account-management/types/accounts.data";

interface AccountDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  parentAccount: Account | null;
  value: CreateAccountPayload;
  onChange: (value: CreateAccountPayload) => void;
  onConfirm: () => void;
}

const AccountDialog: React.FC<AccountDialogProps> = ({
  open,
  setOpen,
  parentAccount,
  value,
  onChange,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {parentAccount
              ? `Add sub-account to ${parentAccount.account_number}`
              : "Add new account"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="number"
            placeholder="Account Type ID"
            value={value.account_type_id}
            onChange={(e) =>
              onChange({ ...value, account_type_id: Number(e.target.value) })
            }
          />

          <Input
            placeholder="Currency (USD)"
            value={value.currency}
            onChange={(e) => onChange({ ...value, currency: e.target.value })}
          />

          <Input
            placeholder="User IDs (comma separated)"
            value={value.user_ids.join(",")}
            onChange={(e) =>
              onChange({
                ...value,
                user_ids: e.target.value
                  .split(",")
                  .map((id) => Number(id.trim()))
                  .filter(Boolean),
              })
            }
          />

          <Input
            type="number"
            placeholder="Owner User ID"
            value={value.owner_user_id}
            onChange={(e) =>
              onChange({ ...value, owner_user_id: Number(e.target.value) })
            }
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>Confirm</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDialog;
