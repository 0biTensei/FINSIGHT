import React, { useState } from 'react';
import {
  Box,
  useMediaQuery,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import BoxHeader from '@/components/BoxHeader';
import DashboardBox from '@/components/DashboardBox';
import {
  useGetProductsQuery,
  useGetTransactionsQuery,
  useGetKpisQuery,
  useDeleteProductMutation,
  useDeleteTransactionMutation,
  useDeleteKpiMutation,
  useCreateProductMutation,
  useCreateTransactionMutation,
  useUpdateProductMutation,
  useUpdateTransactionMutation,
  useUpdateKpiMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUploadFileMutation,
} from '@/state/api';
import { styled } from '@mui/material/styles';

const gridTemplateLargeScreens = `
  "a a"
  "b b"
  "c c"
  "d d"
  "e e"
`;
const gridTemplateSmallScreens = `
  "a"
  "b"
  "c"
  "d"
  "e"
`;

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Admin = () => {
  const { palette } = useTheme();
  const isAboveMediumScreens = useMediaQuery('(min-width: 1200px)');

  const { data: productData } = useGetProductsQuery();
  const { data: transactionData } = useGetTransactionsQuery();
  const { data: kpiData } = useGetKpisQuery();
  const { data: userData } = useGetUsersQuery();

  const [deleteProduct] = useDeleteProductMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();
  const [deleteKpi] = useDeleteKpiMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [createProduct] = useCreateProductMutation();
  const [createTransaction] = useCreateTransactionMutation();
  // const [createKpi] = useCreateKpiMutation();
  const [createUser] = useCreateUserMutation();

  const [updateProduct] = useUpdateProductMutation();
  const [updateTransaction] = useUpdateTransactionMutation();
  const [updateKpi] = useUpdateKpiMutation();
  const [updateUser] = useUpdateUserMutation();

  const [uploadFile] = useUploadFileMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({ id: '', type: '' });

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editInfo, setEditInfo] = useState<any>(null);

  const handleOpenDialog = (id: string, type: string) => {
    setDeleteInfo({ id, type });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteInfo({ id: '', type: '' });
  };

  const handleConfirmDelete = async () => {
    const { id, type } = deleteInfo;
    try {
      if (type === 'product') await deleteProduct(id);
      if (type === 'transaction') await deleteTransaction(id);
      if (type === 'kpi') await deleteKpi(id);
      if (type === 'user') await deleteUser(id);
      handleCloseDialog();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleOpenEditDialog = (row: any, type: string) => {
    setEditInfo({ ...row, type });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditInfo(null);
  };

  const handleConfirmEdit = async () => {
    const { type, ...data } = editInfo;
    try {
      if (type === 'product') await updateProduct(data);
      if (type === 'transaction') await updateTransaction(data);
      if (type === 'kpi') await updateKpi(data);
      if (type === 'user') await updateUser(data);
      if (type === 'New User') await createUser(data);
      if (type === 'New Product') await createProduct(data);
      if (type === 'New Transaction') await createTransaction(data);
      handleCloseEditDialog();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleEditFieldChange = (field: string, value: any) => {
    setEditInfo((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Custom file handling logic here
      console.log('Selected file:', file);
      uploadFile(file);
    }
  };

  const productColumns = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'price',
      headerName: 'Price',
      flex: 0.5,
      renderCell: (params: GridCellParams) => `₱${params.value}`,
    },
    {
      field: 'expense',
      headerName: 'Expense',
      flex: 0.5,
      renderCell: (params: GridCellParams) => `₱${params.value}`,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: GridCellParams) => (
        <Box display="flex" gap="0.5rem">
          <button onClick={() => handleOpenDialog(params.row._id, 'product')}>
            Delete
          </button>
          <button onClick={() => handleOpenEditDialog(params.row, 'product')}>
            Edit
          </button>
        </Box>
      ),
    },
  ];

  const transactionColumns = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'buyer', headerName: 'Buyer', flex: 1 },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.5,
      renderCell: (params: GridCellParams) => `₱${params.value}`,
    },
    {
      field: 'productIds',
      headerName: 'Products Bought',
      flex: 0.5,
      renderCell: (params: GridCellParams) =>
        (params.value as Array<string>).length,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: GridCellParams) => (
        <Box display="flex" gap="0.5rem">
          <button
            onClick={() => handleOpenDialog(params.row._id, 'transaction')}
          >
            Delete
          </button>
          <button
            onClick={() => handleOpenEditDialog(params.row, 'transaction')}
          >
            Edit
          </button>
        </Box>
      ),
    },
  ];

  const kpiColumns = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'totalProfit', headerName: 'Total Profit', flex: 1 },
    { field: 'totalRevenue', headerName: 'Total Revenue', flex: 1 },
    { field: 'totalExpenses', headerName: 'Total Expenses', flex: 1 },
    { field: 'createdAt', headerName: 'Created At', flex: 1 },
    { field: 'updatedAt', headerName: 'Updated At', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: GridCellParams) => (
        <Box display="flex" gap="0.5rem">
          <button onClick={() => handleOpenDialog(params.row._id, 'kpi')}>
            Delete
          </button>
          <button onClick={() => handleOpenEditDialog(params.row, 'kpi')}>
            Edit
          </button>
        </Box>
      ),
    },
  ];

  const userColumns = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: GridCellParams) => (
        <Box display="flex" gap="0.5rem">
          {/*<button onClick={() => handleOpenDialog(params.row._id, 'user')}>
            Delete
          </button>*/}
          <button onClick={() => handleOpenEditDialog(params.row, 'user')}>
            Edit
          </button>
        </Box>
      ),
    },
  ];

  return (
    <Box
      width="100%"
      height="200%"
      display="grid"
      gap="1.5rem"
      sx={
        isAboveMediumScreens
          ? {
              gridTemplateColumns: 'repeat(2, minmax(370px, 1fr))',
              gridTemplateRows: 'repeat(5, minmax(60px, 1fr))',
              gridTemplateAreas: gridTemplateLargeScreens,
            }
          : {
              gridAutoColumns: '1fr',
              gridAutoRows: '80px',
              gridTemplateAreas: gridTemplateSmallScreens,
            }
      }
    >
      {/* Import Excel Section */}
      <DashboardBox gridArea="a">
        <BoxHeader title="Import Data from Excel " sideText="" />
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Button 
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput
            type="file"
            accept=".xls, .xlsx"
            onChange={handleFileChange}
          />
        </Button>
        </Box>
      </DashboardBox>
      {/* KPI Section */}
      <DashboardBox gridArea="b">
        <BoxHeader
          title="Manage KPIs"
          sideText={`${kpiData?.length || 0} KPIs`}
        />
        <Box
          mt="0.5rem"
          p="0 0.5rem"
          height="60%"
          sx={{
            '& .MuiDataGrid-root': { color: palette.grey[300], border: 'none' },
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            '& .MuiDataGrid-columnSeparator': { visibility: 'hidden' },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter
            rows={kpiData || []}
            columns={kpiColumns}
            getRowId={(row) => row._id}
          />
        </Box>
        {/* <Button
          onClick={() =>
            createKpi({
              totalProfit: 0,
              totalRevenue: 0,
              totalExpenses: 0,
              expensesByCategory: { salaries: 0, supplies: 0, services: 0 },
            })
          }
          variant="contained"
          color="primary"
        >
          Create KPI
        </Button> */}
      </DashboardBox>

      {/* Product Section */}
      <DashboardBox gridArea="c">
        <BoxHeader
          title="List of Products"
          sideText={`${productData?.length || 0} products`}
        />
        <Box
          mt="0.5rem"
          p="0 0.5rem"
          height="55%"
          sx={{
            '& .MuiDataGrid-root': { color: palette.grey[300], border: 'none' },
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            '& .MuiDataGrid-columnSeparator': { visibility: 'hidden' },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter
            rows={productData || []}
            columns={productColumns}
            getRowId={(row) => row._id}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenEditDialog({}, 'New Product')}
        >
          Create Product
        </Button>
      </DashboardBox>

      {/* Transaction Section */}
      <DashboardBox gridArea="d">
        <BoxHeader
          title="Recent Transactions"
          sideText={`${transactionData?.length || 0} latest transactions`}
        />
        <Box
          mt="1rem"
          p="0 0.5rem"
          height="50%"
          sx={{
            '& .MuiDataGrid-root': { color: palette.grey[300], border: 'none' },
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            '& .MuiDataGrid-columnSeparator': { visibility: 'hidden' },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter
            rows={transactionData || []}
            columns={transactionColumns}
            getRowId={(row) => row._id}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenEditDialog({}, 'New Transaction')}
        >
          Create Transaction
        </Button>
      </DashboardBox>

      {/* User Section */}
      <DashboardBox gridArea="e">
        <BoxHeader
          title="Manage Users"
          sideText={`${userData?.length || 0} users`}
        />
        <Box
          mt="1rem"
          p="0 0.5rem"
          height="50%"
          sx={{
            '& .MuiDataGrid-root': { color: palette.grey[300], border: 'none' },
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            '& .MuiDataGrid-columnSeparator': { visibility: 'hidden' },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter
            rows={userData || []}
            columns={userColumns}
            getRowId={(row) => row._id}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenEditDialog({}, 'New User')}
        >
          Create User
        </Button>
      </DashboardBox>
      {/* Delete Confirmation Dialog */}
      <Dialog color="primary" open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit/Create Dialog */}
      <Dialog
        color="primary"
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="md"
      >
        <DialogTitle>
          {editInfo && editInfo._id ? 'Edit' : 'Create'} {editInfo?.type}
        </DialogTitle>
        <DialogContent>
          {editInfo && (
            <>
              {editInfo.type === 'product' && (
                <>
                  <TextField
                    label="Name"
                    value={editInfo.name || ''}
                    onChange={(e) =>
                      handleEditFieldChange('name', e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Price"
                    value={editInfo.price || ''}
                    onChange={(e) =>
                      handleEditFieldChange('price', e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Expense"
                    value={editInfo.expense || ''}
                    onChange={(e) =>
                      handleEditFieldChange('expense', e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                </>
              )}
              {editInfo.type === 'transaction' && (
                <>
                  <TextField
                    label="Buyer"
                    value={editInfo.buyer || ''}
                    onChange={(e) =>
                      handleEditFieldChange('buyer', e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Amount"
                    value={editInfo.amount || ''}
                    onChange={(e) =>
                      handleEditFieldChange('amount', e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Product IDs"
                    value={editInfo.productIds || ''}
                    onChange={(e) =>
                      handleEditFieldChange(
                        'productIds',
                        e.target.value.split(',')
                      )
                    }
                    fullWidth
                    margin="dense"
                  />
                </>
              )}
              {editInfo.type === 'kpi' && (
                <>
                  <TextField
                    label="Total Profit"
                    value={editInfo.totalProfit || ''}
                    onChange={(e) =>
                      handleEditFieldChange('totalProfit', e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Total Revenue"
                    value={editInfo.totalRevenue || ''}
                    onChange={(e) =>
                      handleEditFieldChange('totalRevenue', e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Total Expenses"
                    value={editInfo.totalExpenses || ''}
                    onChange={(e) =>
                      handleEditFieldChange('totalExpenses', e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                </>
              )}
              {editInfo.type === 'user' && (
                <>
                  <TextField
                    label="Email"
                    type="email"
                    value={editInfo.email || ''}
                    onChange={(e) =>
                      handleEditFieldChange('email', e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={editInfo.password || ''}
                    onChange={(e) =>
                      handleEditFieldChange('password', e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                </>
              )}
              {editInfo.type === 'New User' && (
                <>
                  <TextField
                    label="Email"
                    value={editInfo.email || ''}
                    onChange={(e) =>
                      handleEditFieldChange('email', e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={editInfo.password || ''}
                    onChange={(e) =>
                      handleEditFieldChange('password', e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                </>
              )}
              {editInfo.type === 'New Product' && (
                <>
                  <TextField
                    label="Name"
                    value={editInfo.name || ''}
                    onChange={(e) =>
                      handleEditFieldChange('name', e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Price"
                    value={editInfo.price || ''}
                    onChange={(e) =>
                      handleEditFieldChange('price', e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Expense"
                    value={editInfo.expense || ''}
                    onChange={(e) =>
                      handleEditFieldChange('expense', e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                </>
              )}
              {editInfo.type === 'New Transaction' && (
                <>
                  <TextField
                    label="Buyer"
                    value={editInfo.buyer || ''}
                    onChange={(e) =>
                      handleEditFieldChange('buyer', e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Amount"
                    value={editInfo.amount || ''}
                    onChange={(e) =>
                      handleEditFieldChange('amount', e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Product IDs"
                    value={editInfo.productIds || ''}
                    onChange={(e) =>
                      handleEditFieldChange(
                        'productIds',
                        e.target.value.split(',')
                      )
                    }
                    fullWidth
                    margin="dense"
                  />
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmEdit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Admin;
