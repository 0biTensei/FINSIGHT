import BoxHeader from '@/components/BoxHeader';
import DashboardBox from '@/components/DashboardBox';
import FlexBetween from '@/components/FlexBetween';
import {
  useGetKpisQuery,
  useGetProductsQuery,
  useGetTransactionsQuery,
} from '@/state/api';
import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import React, { useMemo, useState, useEffect } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

const Row3 = () => {
  const { palette } = useTheme();
  const pieColors = [palette.primary[800], palette.primary[500]];

  const { data: kpiData } = useGetKpisQuery();
  const { data: productData } = useGetProductsQuery();
  const { data: transactionData } = useGetTransactionsQuery();

  const pieChartData = useMemo(() => {
    if (kpiData) {
      const totalExpenses = kpiData[0].totalExpenses;
      return Object.entries(kpiData[0].expensesByCategory).map(
        ([key, value]) => {
          return [
            {
              name: key,
              value: value,
            },
            {
              name: `${key} of Total`,
              value: totalExpenses - value,
            },
          ];
        }
      );
    }
  }, [kpiData]);

  // Calculate the frequency of each product being bought
  const productFrequency = useMemo(() => {
    if (transactionData) {
      const frequency: Record<string, number> = {};
      transactionData.forEach((transaction) => {
        transaction.productIds.forEach((productId) => {
          if (frequency[productId]) {
            frequency[productId]++;
          } else {
            frequency[productId] = 1;
          }
        });
      });
      return frequency;
    }
    return {};
  }, [transactionData]);

  const productColumns = [
    {
      field: '_id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'expense',
      headerName: 'Expense',
      flex: 0.5,
      renderCell: (params: GridCellParams) => `₱${params.value}`,
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 0.5,
      renderCell: (params: GridCellParams) => `₱${params.value}`,
    },
    {
      field: 'frequency',
      headerName: 'Frequency',
      flex: 0.5,
      valueGetter: (params: GridCellParams) =>
        productFrequency[params.row._id] || 0,
    },
  ];

  const transactionColumns = [
    {
      field: '_id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'buyer',
      headerName: 'Buyer',
      flex: 0.67,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.35,
      renderCell: (params: GridCellParams) => `₱${params.value}`,
    },
    {
      field: 'productIds',
      headerName: 'Count',
      flex: 0.1,
      renderCell: (params: GridCellParams) =>
        (params.value as Array<string>).length,
    },
  ];

  const [currentProTip, setCurrentProTip] = useState('');

  useEffect(() => {
    const proTips = [
      'Pro Tip 1: Make a budget: Think of your budget as a living document. That way, you can make adjustments if you need to, like when you eliminate or add a monthly expense.',
      'Pro Tip 2: Track your spending: Tracking your spending may help you avoid overspending and stay within your budget. A study found that sticking to healthy money habits when you feel confident about your finances can help you stay the course when things get more challenging.',
      'Pro Tip 3: Save for emergencies: Making sure you have money put away in an emergency fund for unexpected life events, like needing major home repairs, may help you reduce your financial anxiety. ',
      // Add more pro tips as needed
    ];
    const randomIndex = Math.floor(Math.random() * proTips.length);
    setCurrentProTip(proTips[randomIndex]);
  }, []);

  return (
    <>
      <DashboardBox gridArea="g">
        <BoxHeader
          title="List of Products"
          sideText={`${productData?.length} products`}
        />
        <Box
          mt="0.5rem"
          p="0 0.5rem"
          height="75%"
          sx={{
            '& .MuiDataGrid-root': {
              color: palette.grey[300],
              border: 'none',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            '& .MuiDataGrid-columnSeparator': {
              visibility: 'hidden',
            },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={productData || []}
            columns={productColumns}
            getRowId={(row) => row._id}
          />
        </Box>
      </DashboardBox>
      <DashboardBox gridArea="h">
        <BoxHeader
          title="Recent Orders"
          sideText={`${transactionData?.length} latest transactions`}
        />
        <Box
          mt="1rem"
          p="0 0.5rem"
          height="80%"
          sx={{
            '& .MuiDataGrid-root': {
              color: palette.grey[300],
              border: 'none',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            '& .MuiDataGrid-columnSeparator': {
              visibility: 'hidden',
            },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={transactionData || []}
            columns={transactionColumns}
          />
        </Box>
      </DashboardBox>
      <DashboardBox gridArea="i">
        <BoxHeader title="Expense Breakdown By Category" sideText="+4%" />
        <FlexBetween mt="0.5rem" gap="0.5rem" p="0 1rem" textAlign="center">
          {pieChartData?.map((data, i) => (
            <Box key={`${data[0].name}-${i}`}>
              <PieChart width={110} height={100}>
                <Pie
                  stroke="none"
                  data={data}
                  innerRadius={18}
                  outerRadius={35}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
              </PieChart>
              <Typography variant="h5">{data[0].name}</Typography>
            </Box>
          ))}
        </FlexBetween>
      </DashboardBox>

      <DashboardBox gridArea="j">
        <BoxHeader
          title="Overall Summary and Personalized Insight"
          sideText="+15%"
        />
        <Box
          height="15px"
          margin="1.25rem 1rem 0.4rem 1rem"
          bgcolor={palette.primary[800]}
          borderRadius="1rem"
        >
          <Box
            height="15px"
            bgcolor={palette.primary[600]}
            borderRadius="1rem"
            width="40%"
          ></Box>
        </Box>
        <Typography margin="0 1rem" variant="h6">
          {currentProTip}
        </Typography>
      </DashboardBox>
    </>
  );
};

export default Row3;
