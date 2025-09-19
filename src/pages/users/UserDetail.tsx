import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Alert
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Farmer, Farm } from '../../types/farmer';
import farmerService from '../../services/farmerService';
import farmService from '../../services/farmService';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const farmerData = await farmerService.getFarmerById(parseInt(id, 10));
        setFarmer(farmerData);
        
        // Fetch farms belonging to this farmer
        const farmsData = await farmService.getFarmsByFarmerId(parseInt(id, 10));
        setFarms(farmsData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching farmer details:', err);
        setError('Failed to load farmer details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleStatusChange = async () => {
    if (!farmer || !id) return;
    
    try {
      const newStatus = farmer.status === 'active' ? 'suspended' : 'active';
      await farmerService.updateFarmerStatus(parseInt(id, 10), newStatus);
      setFarmer(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      setError('Failed to update status');
    }
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
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!farmer) {
    return (
      <Alert severity="warning">
        Farmer not found
      </Alert>
    );
  }

  return (
    <Box>
      <Box mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back to List
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid container item xs={12} md={4}>
          <Card sx={{ width: '100%' }}>
            <CardHeader 
              title="Farmer Details"
              action={
                <Chip 
                  label={farmer.status}
                  color={farmer.status === 'active' ? 'success' : 'error'}
                />
              }
            />
            <Divider />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Name"
                    secondary={farmer.name}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Email"
                    secondary={farmer.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Phone"
                    secondary={farmer.phone}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Region"
                    secondary={farmer.region}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Joined Date"
                    secondary={new Date(farmer.joined_date).toLocaleDateString()}
                  />
                </ListItem>
              </List>
              <Box mt={2}>
                <Button
                  variant="contained"
                  color={farmer.status === 'active' ? 'error' : 'success'}
                  fullWidth
                  onClick={handleStatusChange}
                >
                  {farmer.status === 'active' ? 'Suspend Farmer' : 'Activate Farmer'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid container item xs={12} md={8}>
          <Card sx={{ width: '100%' }}>
            <CardHeader 
              title="Farms"
              subheader={`${farms.length} farms registered`}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {farms.map(farm => (
                  <Grid container item xs={12} key={farm.id}>
                    <Paper sx={{ p: 2, width: '100%' }}>
                      <Grid container spacing={2}>
                        <Grid container item xs={6}>
                          <Typography variant="subtitle1">Farm Name</Typography>
                          <Typography variant="body1">{farm.name}</Typography>
                        </Grid>
                        <Grid container item xs={6}>
                          <Typography variant="subtitle1">Area</Typography>
                          <Typography variant="body1">{farm.area} acres</Typography>
                        </Grid>
                        <Grid container item xs={6}>
                          <Typography variant="subtitle1">Crop Type</Typography>
                          <Typography variant="body1">{farm.crop_type}</Typography>
                        </Grid>
                        <Grid container item xs={6}>
                          <Typography variant="subtitle1">Soil Type</Typography>
                          <Typography variant="body1">{farm.soil_type}</Typography>
                        </Grid>
                        <Grid container item xs={12}>
                          <Typography variant="subtitle1">Location</Typography>
                          <Typography variant="body1">{farm.location}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetail;