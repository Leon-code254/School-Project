import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  People as PeopleIcon,
  Grass as GrassIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement,
  LineElement 
} from 'chart.js';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import analyticsService, { DashboardStats } from '../../services/analyticsService';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getDashboardStats();
        setAnalytics(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const summaryCards: StatCard[] = [
    {
      title: 'Total Farmers',
      value: analytics?.farmersByRegion.reduce((sum: number, item) => sum + item.count, 0) || 0,
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#e3f2fd'
    },
    {
      title: 'Total Farms',
      value: analytics?.farmsByCropType.reduce((sum: number, item) => sum + item.count, 0) || 0,
      icon: <GrassIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: '#e8f5e9'
    },
    {
      title: 'Active Alerts',
      value: analytics?.monthlyRegistrations.length || 0,
      icon: <NotificationsIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: '#fff8e1'
    },
    {
      title: 'System Status',
      value: 'Healthy',
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: '#e8f5e9'
    }
  ];

  const regionChartData = {
    labels: analytics?.farmersByRegion.map(item => item.region) || [],
    datasets: [
      {
        data: analytics?.farmersByRegion.map(item => item.count) || [],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const cropChartData = {
    labels: analytics?.farmsByCropType.map(item => item.type) || [],
    datasets: [
      {
        label: 'Farms by Crop Type',
        data: analytics?.farmsByCropType.map(item => item.count) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const monthlyRegChartData = {
    labels: analytics?.monthlyRegistrations.map(item => item.month) || [],
    datasets: [
      {
        label: 'Monthly Registrations',
        data: analytics?.monthlyRegistrations.map(item => item.count) || [],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card, index) => (
          <Grid container item xs={12} sm={6} md={3} key={index}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                bgcolor: card.color,
                width: '100%'
              }}
            >
              <Box sx={{ mr: 2 }}>
                {card.icon}
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="h4">
                  {card.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid container item xs={12} md={4}>
          <Card sx={{ width: '100%' }}>
            <CardHeader title="Farmers by Region" />
            <Divider />
            <CardContent>
              <Pie 
                data={regionChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid container item xs={12} md={8}>
          <Card sx={{ width: '100%' }}>
            <CardHeader title="Farms by Crop Type" />
            <Divider />
            <CardContent>
              <Bar 
                data={cropChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
                height={200}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid container item xs={12}>
          <Card sx={{ width: '100%' }}>
            <CardHeader title="Monthly Registrations" />
            <Divider />
            <CardContent>
              <Line 
                data={monthlyRegChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
                height={200}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;