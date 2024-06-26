import React, { useMemo } from "react";
import { Box, Button, Typography } from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useGetKpisQuery, useGetProductsQuery, useGetTransactionsQuery } from "@/state/api";

// Extend jsPDF with autoTable and lastAutoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => void;
    lastAutoTable: { finalY: number };
  }
}

const Report = () => {
  const { data: kpis } = useGetKpisQuery();
  const { data: products } = useGetProductsQuery();
  const { data: transactions } = useGetTransactionsQuery();

  const kpiData = useMemo(() => {
    return (
      kpis &&
      kpis[0].monthlyData.map(({ month, revenue, expenses }: any) => ({
        name: month.substring(0, 3),
        revenue,
        expenses,
        profit: (revenue - expenses).toFixed(2),
      }))
    );
  }, [kpis]);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.text("FINSIGHT Report", 10, 10);

    // Add KPIs table
    if (kpiData) {
      doc.autoTable({
        startY: 20,
        head: [["Month", "Revenue", "Expenses", "Profit"]],
        body: kpiData.map((kpi: any) => [kpi.name, kpi.revenue, kpi.expenses, kpi.profit]),
      });
    }

    // Add Products table
    if (products && products.length > 0) {
      doc.autoTable({
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 20,
        head: [["Product ID", "Expense", "Price"]],
        body: products.map((product: any) => [
          product._id,
          `₱${product.expense}`,
          `₱${product.price}`,
        ]),
      });
    }

    // Add Transactions table
    if (transactions && transactions.length > 0) {
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Transaction ID", "Buyer", "Amount", "Product Count"]],
        body: transactions.map((transaction: any) => [
          transaction._id,
          transaction.buyer,
          `₱${transaction.amount}`,
          transaction.productIds.length,
        ]),
      });
    }

    doc.save("Finsight report.pdf");
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
      <Typography variant="h4" gutterBottom>
        Generate Report
      </Typography>
      <Button variant="contained" color="primary" onClick={generatePDF}>
        Download Report
      </Button>
    </Box>
  );
};

export default Report;
