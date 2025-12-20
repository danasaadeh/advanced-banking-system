import { LargeTransactionHandler } from "./handlers/large-transaction-handler";
import { MediumTransactionHandler } from "./handlers/medium-transaction-handler";
import { SmallTransactionHandler } from "./handlers/small-transaction-handler";
import { VeryLargeTransactionHandler } from "./handlers/very-large-transaction-handler";

//client
export const transactionApprovalChain = (() => {
  const small = new SmallTransactionHandler();
  const medium = new MediumTransactionHandler();
  const large = new LargeTransactionHandler();
  const veryLarge = new VeryLargeTransactionHandler();

  small.setNext(medium).setNext(large).setNext(veryLarge);

  return small;
})();
