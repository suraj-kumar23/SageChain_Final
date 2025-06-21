// src/components/TransactionHistory.tsx

import { useEffect, useState } from "react";
import { getTxHistory, TransactionRecord } from "@/utils/transactionHistory";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<TransactionRecord["type"], string> = {
  buy: "bg-green-700 text-white",
  sell: "bg-red-600 text-white",
  swap: "bg-purple-600 text-white",
};

export default function TransactionHistory() {
  const [history, setHistory] = useState<TransactionRecord[]>([]);

  useEffect(() => {
    const txs = getTxHistory();
    setHistory(txs);
  }, []);

  if (history.length === 0) {
    return (
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl mt-6">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-300 text-sm">No transactions found yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl mt-6">
      <CardHeader>
        <CardTitle className="text-white">Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {history.map((tx) => (
          <div
            key={tx.id}
            className="border border-purple-700/20 rounded-lg px-4 py-2 bg-slate-800/50 text-white text-sm flex flex-col md:flex-row md:justify-between"
          >
            <div className="flex gap-2 items-center">
              <Badge className={statusColors[tx.type]}>{tx.type.toUpperCase()}</Badge>
              <span className="font-medium">{tx.asset}</span>
              <span className="text-slate-300">— {tx.amount}</span>
            </div>
            <span className="text-slate-400 text-xs mt-1 md:mt-0">{tx.time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
