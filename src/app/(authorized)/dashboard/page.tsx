"use client";

import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { processTransactionsFile } from "@/helpers/transaction-converter";
import TransactionDashboard from "@/app/_components/comparisons";
import { auth, db } from "@/firebase/config";
import FileUploadModal from "@/app/_components/file-upload";
import { useLoading } from "@/contexts/LoadingContext";
import { Button } from "@/components/ui/button";

interface Transaction {
  date: string;
  description: string;
  category: string;
  type: string;
  value: number;
}

interface TransactionsByPeriod {
  [period: string]: Transaction[];
}

const ExpenseAnalysisDashboard = () => {
  const [user, loading] = useAuthState(auth);

  const { setLoading } = useLoading();

  const [transactions, setTransactions] = useState<TransactionsByPeriod>({});
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (loading) return;

    fetchUserTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  const fetchUserTransactions = async () => {
    try {
      setLoading({
        loading: true,
        showTimer: true,
      });
      const transactionsRef = collection(db, `users/${user?.uid}/transactions`);
      const transactionsSnapshot = await getDocs(transactionsRef);

      if (transactionsSnapshot.empty) {
        setShowUploadModal(true);
        setLoading({
          loading: false,
        });
        return;
      }

      const transactionsByPeriod: TransactionsByPeriod = {};

      transactionsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.period) {
          if (!transactionsByPeriod[data.period]) {
            transactionsByPeriod[data.period] = [];
          }
          transactionsByPeriod[data.period].push(data as Transaction);
        }
      });

      setTransactions(transactionsByPeriod);
      setLoading({
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading({
        loading: false,
      });
    }
  };

  const handleFileUpload = async (files: FileList) => {
    setLoading({
      loading: true,
      showTimer: true,
    });
    const newTransactions: TransactionsByPeriod = { ...transactions };

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name.replace(".csv", "");
        // Assuming file names contain date in format YYYY-MM
        const period = fileName.match(/\d{4}-\d{2}/)
          ? fileName.match(/\d{4}-\d{2}/)![0]
          : new Date().toISOString().slice(0, 7);

        const fileContent = await file.text();
        const processedTransactions = await processTransactionsFile(
          fileContent
        );

        // Save each transaction to Firestore
        const batch = processedTransactions.map((transaction) => {
          return addDoc(collection(db, `users/${user?.uid}/transactions`), {
            ...transaction,
            period,
            userId: user?.uid,
            uploadedAt: new Date().toISOString(),
          });
        });

        await Promise.all(batch);

        // Update local state
        newTransactions[period] = processedTransactions;
      }

      setTransactions(newTransactions);
      setShowUploadModal(false);
    } catch (error) {
      console.error("Error processing files:", error);
    } finally {
      setLoading({
        loading: false,
      });
    }
  };

  if (loading) return;

  return (
    <div className="w-full h-full bg-zinc-900 relative">
      {Object.keys(transactions).length > 0 ? (
        <TransactionDashboard
          transactions={transactions}
          setShowUploadModal={setShowUploadModal}
        />
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <Button onClick={() => setShowUploadModal(true)}>
            Upload Transaction Files
          </Button>
        </div>
      )}

      {showUploadModal && (
        <FileUploadModal
          onUpload={handleFileUpload}
          onClose={() => setShowUploadModal(false)}
          allowedTypes=".csv"
          multiple={true}
        />
      )}
    </div>
  );
};

export default ExpenseAnalysisDashboard;
