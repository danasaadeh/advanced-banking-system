interface Transaction {
  id: number;
  type: string;
  amount: number;
  status: string;
  date: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

export default function TransactionsTable({
  transactions,
}: TransactionsTableProps) {
  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-card">
        <h2 className="font-semibold flex items-center gap-2">
          Recent System Transactions
        </h2>
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
          Real-time Feed
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium">{tx.type}</td>
                <td className="px-6 py-4 font-mono">
                  ${tx.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      tx.status === "Completed"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-muted/30 border-t border-border">
        <p className="text-xs text-muted-foreground/70 italic">
          * This dashboard represents the Administrative Subsystem with
          Role-Based Access Control.
        </p>
      </div>
    </div>
  );
}
