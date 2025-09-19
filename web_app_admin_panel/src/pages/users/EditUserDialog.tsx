import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { UpdateUserDto, User } from '../../services/userService';

const validationSchema = yup.object({
  email: yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  role: yup.string()
    .oneOf(['admin', 'superadmin'], 'Invalid role')
    .required('Role is required'),
  is_active: yup.boolean(),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .optional(),
});

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userId: number, data: UpdateUserDto) => Promise<void>;
  user: User;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ open, onClose, onSubmit, user }) => {
  const formik = useFormik({
    initialValues: {
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      password: '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const updateData: UpdateUserDto = {
          email: values.email,
          role: values.role,
          is_active: values.is_active,
        };
        if (values.password) {
          updateData.password = values.password;
        }
        await onSubmit(user.id, updateData);
        onClose();
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Failed to update user');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Edit User - {user.username}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {formik.status && (
              <Alert severity="error">{formik.status}</Alert>
            )}
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formik.values.role}
                label="Role"
                onChange={formik.handleChange}
                error={formik.touched.role && Boolean(formik.errors.role)}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="superadmin">Super Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              id="password"
              name="password"
              label="New Password (leave blank to keep current)"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.is_active}
                  onChange={formik.handleChange}
                  name="is_active"
                />
              }
              label="Active Status"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting}
          >
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditUserDialog;