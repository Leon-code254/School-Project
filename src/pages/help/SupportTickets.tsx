import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import helpAndSupportService, {
  SupportTicket,
  TicketComment,
  CreateTicketDto,
} from '../../services/helpAndSupportService';
import { format } from 'date-fns';

const TICKET_CATEGORIES = [
  'Technical Issue',
  'Account Access',
  'Farm Management',
  'Soil Analysis',
  'Weather Data',
  'Other',
];

const TICKET_PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
] as const;

export default function SupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState<CreateTicketDto>({
    subject: '',
    description: '',
    category: TICKET_CATEGORIES[0],
    priority: 'medium',
  });

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      loadComments(selectedTicket.id);
    }
  }, [selectedTicket]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await helpAndSupportService.getMyTickets();
      setTickets(data);
    } catch (err) {
      setError('Failed to load tickets');
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (ticketId: number) => {
    try {
      const data = await helpAndSupportService.getTicketComments(ticketId);
      setComments(data);
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  const handleCreateTicket = async () => {
    try {
      setLoading(true);
      setError(null);
      const ticket = await helpAndSupportService.createTicket(newTicket);
      setTickets([ticket, ...tickets]);
      setCreateDialogOpen(false);
      setNewTicket({
        subject: '',
        description: '',
        category: TICKET_CATEGORIES[0],
        priority: 'medium',
      });
    } catch (err) {
      setError('Failed to create ticket');
      console.error('Error creating ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!selectedTicket || !newComment.trim()) return;

    try {
      const comment = await helpAndSupportService.addTicketComment(selectedTicket.id, {
        message: newComment,
      });
      setComments([...comments, comment]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return 'info';
      case 'in_progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Support Tickets</Typography>
        <Box>
          <IconButton onClick={loadTickets} sx={{ mr: 1 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            New Ticket
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Box>
          {loading ? (
            <CircularProgress />
          ) : (
            tickets.map((ticket) => (
              <Card
                key={ticket.id}
                sx={{
                  mb: 2,
                  cursor: 'pointer',
                  bgcolor:
                    selectedTicket?.id === ticket.id
                      ? 'action.selected'
                      : 'background.paper',
                }}
                onClick={() => setSelectedTicket(ticket)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">{ticket.subject}</Typography>
                    <Box>
                      <Chip
                        size="small"
                        label={ticket.status}
                        color={getStatusColor(ticket.status)}
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        size="small"
                        label={ticket.priority}
                        color={getPriorityColor(ticket.priority)}
                      />
                    </Box>
                  </Box>
                  <Typography color="text.secondary" gutterBottom>
                    {ticket.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created: {format(new Date(ticket.created_at), 'PPp')}
                  </Typography>
                </CardContent>
              </Card>
              ))
            )}
        </Box>

        <Box>
          {selectedTicket && (
            <Card>
              <CardContent>
                <Typography variant="h6">{selectedTicket.subject}</Typography>
                <Typography color="text.secondary" paragraph>
                  {selectedTicket.description}
                </Typography>                <Divider sx={{ my: 2 }} />

                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {comments.map((comment) => (
                    <React.Fragment key={comment.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle2">
                                {comment.user_name}
                                {comment.is_staff && (
                                  <Chip
                                    size="small"
                                    label="Staff"
                                    color="primary"
                                    sx={{ ml: 1 }}
                                  />
                                )}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {format(new Date(comment.created_at), 'PPp')}
                              </Typography>
                            </Box>
                          }
                          secondary={comment.message}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>

                <Box sx={{ mt: 2, display: 'flex' }}>
                  <TextField
                    fullWidth
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    multiline
                    rows={2}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    sx={{ ml: 1 }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Support Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Subject"
              value={newTicket.subject}
              onChange={(e) =>
                setNewTicket({ ...newTicket, subject: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={newTicket.description}
              onChange={(e) =>
                setNewTicket({ ...newTicket, description: e.target.value })
              }
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Category"
              value={newTicket.category}
              onChange={(e) =>
                setNewTicket({ ...newTicket, category: e.target.value })
              }
              sx={{ mb: 2 }}
            >
              {TICKET_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Priority"
              value={newTicket.priority}
              onChange={(e) =>
                setNewTicket({
                  ...newTicket,
                  priority: e.target.value as SupportTicket['priority'],
                })
              }
            >
              {TICKET_PRIORITIES.map((priority) => (
                <MenuItem key={priority.value} value={priority.value}>
                  {priority.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateTicket}
            disabled={!newTicket.subject || !newTicket.description}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}