// import { useState } from "react";
// import type{ Account, AccountStatus } from "@/features/account-management/types";
// import { initialAccounts } from "@/features/account-management/services/accountsService";
// import { updateAccountStatus, addChildAccount } from "@/features/account-management/pages/accounts.data";

// export const useAccounts = () => {
//   const [accounts, setAccounts] = useState<Account[]>(initialAccounts);

//   const changeStatus = (id: number, status: AccountStatus) => {
//     setAccounts(updateAccountStatus(accounts, id, status));
//   };

//   const addSubAccount = (parentId: number, newAccount: Account) => {
//     setAccounts(addChildAccount(accounts, parentId, newAccount));
//   };

//   return { accounts, changeStatus, addSubAccount, setAccounts };
// };
