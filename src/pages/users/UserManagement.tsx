import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  VpnKey as VpnKeyIcon
} from '@mui/icons-material';
import { Farmer } from '../../types/farmer';
import farmerService from '../../services/farmerService';
import CreateUserDialog from './CreateUserDialog';
import EditUserDialog from './EditUserDialog';

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [filteredFarmers, setFilteredFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [actionType, setActionType] = useState<'suspend' | 'activate'>('suspend');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setLoading(true);
        const data = await farmerService.getAllFarmers();
        setFarmers(data);
        setFilteredFarmers(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching farmers:', err);
        setError('Failed to load farmers');
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFarmers(farmers);
    } else {
      const filtered = farmers.filter(
        (farmer) =>
          farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          farmer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          farmer.region.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFarmers(filtered);
    }
    setPage(0);
  }, [searchQuery, farmers]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChangeDialog = (farmer: Farmer, type: 'suspend' | 'activate') => {
    setSelectedFarmer(farmer);
    setActionType(type);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedFarmer(null);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedFarmer) return;

    try {
      const newStatus = actionType === 'suspend' ? 'suspended' : 'active';
      const updatedFarmer = await farmerService.updateFarmerStatus(selectedFarmer.id, newStatus);
      
      // Update the lists with the new data
      setFarmers(
        farmers.map((farmer) =>
          farmer.id === updatedFarmer.id ? updatedFarmer : farmer
        )
      );
      handleCloseDialog();
    } catch (err) {
      setError('Failed to update farmer status');
    }
  };

  const navigateToDetail = (id: number) => {
    navigate(`/users/${id}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid container item xs={12} justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="h2">
            Farmer Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/users/new')}
          >
            Add Farmer
          </Button>
        </Grid>

        <Grid container item xs={12}>
          <Paper sx={{ width: '100%', p: 2 }}>
            <Box mb={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search farmers..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Region</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Farms</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFarmers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((farmer) => (
                      <TableRow key={farmer.id}>
                        <TableCell>{farmer.name}</TableCell>
                        <TableCell>{farmer.email}</TableCell>
                        <TableCell>{farmer.region}</TableCell>
                        <TableCell>
                          <Chip
                            label={farmer.status}
                            color={farmer.status === 'active' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{farmer.farms_count}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => navigateToDetail(farmer.id)}
                            color="primary"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleStatusChangeDialog(
                                farmer,
                                farmer.status === 'active' ? 'suspend' : 'activate'
                              )
                            }
                            color={farmer.status === 'active' ? 'error' : 'success'}
                            size="small"
                          >
                            {farmer.status === 'active' ? (
                              <CancelIcon />
                            ) : (
                              <CheckCircleIcon />
                            )}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredFarmers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Status Change Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          {actionType === 'suspend' ? 'Suspend Farmer' : 'Activate Farmer'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {actionType === 'suspend' ? 'suspend' : 'activate'} this farmer?
            {actionType === 'suspend'
              ? ' This will prevent them from accessing the system.'
              : ' This will restore their access to the system.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmStatusChange}
            color={actionType === 'suspend' ? 'error' : 'success'}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;