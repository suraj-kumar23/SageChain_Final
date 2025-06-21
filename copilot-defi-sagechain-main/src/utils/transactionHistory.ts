// src/utils/transactionHistory.ts

export interface TransactionRecord {
  id: number;
  type: "buy" | "sell" | "swap";
  asset: string;
  amount: string;
  time: string;
}

export const logTxToLocalStorage = (
  type: "buy" | "sell" | "swap",
  asset: string,
  amount: string
) => {
  const prev: TransactionRecord[] = JSON.parse(localStorage.getItem("txHistory") || "[]");
  const newEntry: TransactionRecord = {
    id: Date.now(),
    type,
    asset,
    amount,
    time: new Date().toLocaleString(),
  };
  localStorage.setItem("txHistory", JSON.stringify([newEntry, ...prev]));
};

export const getTxHistory = (): TransactionRecord[] => {
  return JSON.parse(localStorage.getItem("txHistory") || "[]");
};
