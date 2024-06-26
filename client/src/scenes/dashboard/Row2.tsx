import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery, useGetProductsQuery, useGetTransactionsQuery } from "@/state/api";
import { Box, Button, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  Tooltip,
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Extend jsPDF with autoTable and lastAutoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => void;
    lastAutoTable: { finalY: number };
  }
}

const pieData = [
  { name: "Group A", value: 600 },
  { name: "Group B", value: 400 },
];

const Row2 = () => {
  const { palette } = useTheme();
  const pieColors = [palette.primary[800], palette.primary[300]];
  const { data: operationalData } = useGetKpisQuery();
  const { data: kpis } = useGetKpisQuery();
  const { data: products } = useGetProductsQuery();
  const { data: transactions } = useGetTransactionsQuery();

  const operationalExpenses = useMemo(() => {
    return (
      operationalData &&
      operationalData[0].monthlyData.map(
        ({ month, operationalExpenses, nonOperationalExpenses }) => {
          return {
            name: month.substring(0, 3),
            "Operational Expenses": operationalExpenses,
            "Non Operational Expenses": nonOperationalExpenses,
          };
        }
      )
    );
  }, [operationalData]);

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
          `$${product.expense}`,
          `$${product.price}`,
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
          `$${transaction.amount}`,
          transaction.productIds.length,
        ]),
      });
    }

    doc.save("report.pdf");
  };

  return (
    <>
      <DashboardBox gridArea="d">
        <BoxHeader
          title="Operational vs Non-Operational Expenses"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={operationalExpenses}
            margin={{
              top: 20,
              right: 0,
              left: -10,
              bottom: 55,
            }}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="name"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Non Operational Expenses"
              stroke={palette.tertiary[500]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Operational Expenses"
              stroke={palette.primary.main}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="e">
        <BoxHeader title="Campaigns and Targets" sideText="+4%" />
        <FlexBetween mt="0.25rem" gap="1.5rem" pr="1rem">
          <PieChart
            width={110}
            height={100}
            margin={{
              top: 0,
              right: -10,
              left: 10,
              bottom: 0,
            }}
          >
            <Pie
              stroke="none"
              data={pieData}
              innerRadius={18}
              outerRadius={38}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index]} />
              ))}
            </Pie>
          </PieChart>
          <Box ml="-0.7rem" flexBasis="40%" textAlign="center">
            <Typography variant="h5">Target Sales</Typography>
            <Typography m="0.3rem 0" variant="h3" color={palette.primary[300]}>
              83
            </Typography>
            <Typography variant="h6">
              Finance goals of the campaign that is desired
            </Typography>
          </Box>
          <Box flexBasis="40%">
            <Typography variant="h5">Losses in Revenue</Typography>
            <Typography variant="h6">Losses are down 25%</Typography>
            <Typography mt="0.4rem" variant="h5">
              Profit Margins
            </Typography>
            <Typography variant="h6">
              Margins are up by 30% from last month.
            </Typography>
          </Box>
        </FlexBetween>
      </DashboardBox>
      <DashboardBox gridArea="f">
        <BoxHeader title="Generate Report" sideText="Download PDF" />
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Button variant="contained" color="primary" onClick={generatePDF}>
            Download Report
          </Button>
        </Box>
      </DashboardBox>
    </>
  );
};

export default Row2;
