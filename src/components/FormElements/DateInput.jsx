import { 
  Box, 
  Typography, 
  TextField, 
  FormControl, 
  FormControlLabel,
  Switch,
  InputAdornment
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useFormContext } from '../../contexts/FormContext';

const DateInput = ({ element, isPreview = false }) => {
  const { updateElement, activeElementId } = useFormContext();
  const isActive = activeElementId === element.id;

  const handleLabelChange = (e) => {
    updateElement(element.id, { label: e.target.value });
  };

  const handleRequiredChange = (e) => {
    updateElement(element.id, { required: e.target.checked });
  };

  const handleDescriptionChange = (e) => {
    updateElement(element.id, { description: e.target.value });
  };

  if (isPreview) {
    return (
      <Box sx={{ mb: 2, px: 3, py: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          {element.label}{element.required && <span style={{ color: '#d93025', marginLeft: '4px' }}> *</span>}
        </Typography>
        {element.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {element.description}
          </Typography>
        )}
        <TextField
          type="date"
          fullWidth
          disabled
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarTodayIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 300 }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ p: '24px 24px', width: '100%' }}>
      {isActive ? (
        <FormControl fullWidth>
          <TextField
            fullWidth
            placeholder="Câu hỏi không có tiêu đề"
            value={element.label}
            onChange={handleLabelChange}
            sx={{ mb: 2 }}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              style: { 
                fontSize: '1.1rem',
                fontWeight: 500
              }
            }}
          />
          <TextField
            fullWidth
            placeholder="Mô tả (tùy chọn)"
            value={element.description || ''}
            onChange={handleDescriptionChange}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              style: { 
                fontSize: '0.9rem'
              }
            }}
            sx={{ mb: 3 }}
          />
          <Box sx={{ mb: 3 }}>
            <TextField
              type="date"
              fullWidth
              disabled
              placeholder="dd/mm/yyyy"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 300 }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel 
              control={
                <Switch 
                  checked={element.required} 
                  onChange={handleRequiredChange}
                  color="primary"
                />
              } 
              label="Bắt buộc"
            />
          </Box>
        </FormControl>
      ) : (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
            {element.label || 'Câu hỏi không có tiêu đề'}{element.required && <span style={{ color: '#d93025', marginLeft: '4px' }}> *</span>}
          </Typography>
          {element.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {element.description}
            </Typography>
          )}
          <TextField
            type="date"
            fullWidth
            disabled
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 300 }}
          />
        </>
      )}
    </Box>
  );
};

export default DateInput; 