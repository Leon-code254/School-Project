import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Chip,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { GridItem, GridContainerItem } from '../../components/common/Grid';
import farmService from '../../services/farmService';
import { Farm, toFullFarm } from '../../types/farm';
import { formatDate } from '../../utils/dateUtils';
import { formatArea } from '../../utils/formatUtils';
import AddFarmModal from './AddFarmModal';

const FarmManagement: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [filteredFarms, setFilteredFarms] = useState<Farm[]>([]);
  const [cropTypes, setCropTypes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCropType, setSelectedCropType] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFarms = useCallback(async () => {
    try {
      setLoading(true);
      const data = await farmService.getAllFarms();
      const fullFarms = data.map(toFullFarm);
      setFarms(fullFarms);
      setFilteredFarms(fullFarms);
      // Extract unique crop types
      const crops = [...new Set(fullFarms.map(farm => farm.crop_type))];
      setCropTypes(crops);
      setError(null);
    } catch (error) {
      console.error('Failed to load farms:', error);
      setError('Failed to load farms');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFarms();
  }, [loadFarms]);

  useEffect(() => {
    let result = [...farms];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(farm =>
        farm.name.toLowerCase().includes(searchLower) ||
        farm.location.toLowerCase().includes(searchLower)
      );
    }
    
    if (selectedCropType !== 'all') {
      result = result.filter(farm => farm.crop_type === selectedCropType);
    }
    
    setFilteredFarms(result);
  }, [searchTerm, selectedCropType, farms]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCropTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCropType(event.target.value);
  };

  const handleAddFarm = () => {
    setIsAddModalOpen(true);
  };

  const handleRefresh = () => {
    loadFarms();
  };

  const getStatusColor = (status: string): 'success' | 'error' => {
    return status === 'active' ? 'success' : 'error';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Farm Management
        </Typography>
        <Box>
          <IconButton onClick={handleRefresh} sx={{ mr: 1 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddFarm}
          >
            Add Farm
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box>
        <GridContainerItem spacing={3}>
          <GridItem xs={12} md={3}>
            <TextField
              fullWidth
              label="Search farms"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </GridItem>
          <GridItem xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Filter by crop type"
              value={selectedCropType}
              onChange={handleCropTypeChange}
            >
              <MenuItem value="all">All Crops</MenuItem>
              {cropTypes.map((crop) => (
                <MenuItem key={crop} value={crop}>
                  {crop}
                </MenuItem>
              ))}
            </TextField>
          </GridItem>
        </GridContainerItem>
      </Box>

      {/* Farm Cards */}
      <Box mt={4}>
        <GridContainerItem spacing={3}>
          {filteredFarms.map((farm) => (
            <GridItem xs={12} sm={6} md={4} key={farm.id}>
              <Card>
                <CardContent>
                  <Box mb={2}>
                    <Typography variant="h6" component="div">
                      {farm.name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {farm.location}
                    </Typography>
                  </Box>

                  <GridContainerItem spacing={2}>
                    <GridItem xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Area
                      </Typography>
                      <Typography variant="body1">
                        {formatArea(farm.area)}
                      </Typography>
                    </GridItem>
                    <GridItem xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Crop Type
                      </Typography>
                      <Typography variant="body1">
                        {farm.crop_type}
                      </Typography>
                    </GridItem>
                    <GridItem xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(farm.last_updated)}
                      </Typography>
                      <Box mt={1}>
                        <Chip 
                          label={farm.status}
                          color={getStatusColor(farm.status)}
                          size="small"
                        />
                      </Box>
                    </GridItem>
                  </GridContainerItem>
                </CardContent>
              </Card>
            </GridItem>
          ))}
        </GridContainerItem>
      </Box>

      <AddFarmModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onFarmAdded={loadFarms}
      />
    </Box>
  );
};

export default FarmManagement;