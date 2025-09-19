import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import helpAndSupportService, { FAQ } from '../../services/helpAndSupportService';
import debounce from 'lodash/debounce';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`faq-tabpanel-${index}`}
      aria-labelledby={`faq-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function FAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedPanel, setExpandedPanel] = useState<number | false>(false);

  const categories: FAQ['category'][] = ['general', 'technical', 'account', 'farms', 'soil', 'weather'];

  useEffect(() => {
    loadFaqs();
  }, [selectedTab]);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      setError(null);
      const category = categories[selectedTab];
      const data = await helpAndSupportService.getFaqsByCategory(category);
      setFaqs(data);
    } catch (err) {
      setError('Failed to load FAQs');
      console.error('Error loading FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(async (query: string) => {
    if (!query.trim()) {
      loadFaqs();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await helpAndSupportService.searchFaqs(query);
      setFaqs(results);
    } catch (err) {
      setError('Failed to search FAQs');
      console.error('Error searching FAQs:', err);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setSearchQuery('');
  };

  const handleAccordionChange = (panel: number) => (
    _event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Frequently Asked Questions
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search FAQs..."
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="FAQ categories"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {categories.map((category, index) => (
          <Tab
            key={category}
            label={category.charAt(0).toUpperCase() + category.slice(1)}
            id={`faq-tab-${index}`}
            aria-controls={`faq-tabpanel-${index}`}
          />
        ))}
      </Tabs>

      {categories.map((category, index) => (
        <TabPanel key={category} value={selectedTab} index={index}>
          {loading ? (
            [...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={100}
                sx={{ mb: 2, borderRadius: 1 }}
              />
            ))
          ) : faqs.length === 0 ? (
            <Typography color="text.secondary" align="center">
              No FAQs found {searchQuery && 'for your search query'}
            </Typography>
          ) : (
            faqs.map((faq) => (
              <Accordion
                key={faq.id}
                expanded={expandedPanel === faq.id}
                onChange={handleAccordionChange(faq.id)}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`faq-${faq.id}-content`}
                  id={`faq-${faq.id}-header`}
                >
                  <Typography>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </TabPanel>
      ))}
    </Box>
  );
}