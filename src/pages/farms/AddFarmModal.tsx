import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert
} from '@mui/material';
import farmService, { CreateFarmDto } from '../../services/farmService';

interface AddFarmModalProps {
  open: boolean;
  onClose: () => void;
  onFarmAdded: () => void;
}

const soilTypes: Array<CreateFarmDto['soil_type']> = [
  'clay',
  'sandy',
  'silt',
  'peat',
  'loam',
  'chalky'
];

const irrigationMethods: Array<CreateFarmDto['irrigation_method']> = [
  'drip',
  'sprinkler',
  'flood',
  'center_pivot',
  'manual'
];

const AddFarmModal: React.FC<AddFarmModalProps> = ({ open, onClose, onFarmAdded }) => {
  const [formData, setFormData] = useState<CreateFarmDto>({
    name: '',
    location: '',
    size_hectares: 0,
    soil_type: 'clay',
    irrigation_method: 'drip',
    farmer_id: 1, // TODO: Get this from the context/props
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof CreateFarmDto) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = field === 'size_hectares' 
      ? parseFloat(event.target.value as string) 
      : event.target.value as string;
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      await farmService.createFarm(formData);
      onFarmAdded();
      onClose();
    } catch (err) {
      console.error('Failed to create farm:', err);
      setError('Failed to create farm. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Farm</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Farm Name"
            fullWidth
            value={formData.name}
            onChange={handleChange('name')}
            required
          />

          <TextField
            label="Location"
            fullWidth
            value={formData.location}
            onChange={handleChange('location')}
            required
          />

          <TextField
            label="Size (hectares)"
            type="number"
            fullWidth
            value={formData.size_hectares}
            onChange={handleChange('size_hectares')}
            inputProps={{ min: 0, step: 0.1 }}
            required
          />

          <TextField
            select
            label="Soil Type"
            fullWidth
            value={formData.soil_type}
            onChange={handleChange('soil_type')}
            required
          >
            {soilTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Irrigation Method"
            fullWidth
            value={formData.irrigation_method}
            onChange={handleChange('irrigation_method')}
            required
          >
            {irrigationMethods.map((method) => (
              <MenuItem key={method} value={method}>
                {method.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isSubmitting}
        >
          Add Farm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFarmModal;