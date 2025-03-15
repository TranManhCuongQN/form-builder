import { 
  Box, 
  Typography, 
  TextField, 
  FormControl, 
  FormControlLabel,
  Switch,
  Radio,
  RadioGroup,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormLabel,
  Stack
} from '@mui/material';
import { useFormContext } from '../../contexts/FormContext';
import { useState, useEffect } from 'react';

const LinearScaleInput = ({ element, isPreview = false }) => {
  const { updateElement, activeElementId } = useFormContext();
  const isActive = activeElementId === element.id;
  const [scaleRange, setScaleRange] = useState({
    start: element.startValue || 1,
    end: element.endValue || 5
  });

  // Cập nhật scale range khi element thay đổi
  useEffect(() => {
    setScaleRange({
      start: element.startValue || 1,
      end: element.endValue || 5
    });
  }, [element.startValue, element.endValue]);

  const handleLabelChange = (e) => {
    updateElement(element.id, { label: e.target.value });
  };

  const handleRequiredChange = (e) => {
    updateElement(element.id, { required: e.target.checked });
  };

  const handleDescriptionChange = (e) => {
    updateElement(element.id, { description: e.target.value });
  };

  const handleStartValueChange = (e) => {
    const value = parseInt(e.target.value, 10);
    updateElement(element.id, { startValue: value });
  };

  const handleEndValueChange = (e) => {
    const value = parseInt(e.target.value, 10);
    updateElement(element.id, { endValue: value });
  };

  const handleStartLabelChange = (e) => {
    updateElement(element.id, { startLabel: e.target.value });
  };

  const handleEndLabelChange = (e) => {
    updateElement(element.id, { endLabel: e.target.value });
  };

  // Tạo các tùy chọn thang điểm dựa trên giá trị bắt đầu và kết thúc
  const generateScaleOptions = () => {
    const options = [];
    for (let i = scaleRange.start; i <= scaleRange.end; i++) {
      options.push(i);
    }
    return options;
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
        <Grid container spacing={1} alignItems="center">
          {element.startLabel && (
            <Grid item xs={3} md={2}>
              <Typography variant="body2" color="text.secondary" align="center">
                {element.startLabel}
              </Typography>
            </Grid>
          )}
          <Grid item xs={6} md={8}>
            <RadioGroup
              row
              sx={{ 
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              {generateScaleOptions().map((value) => (
                <FormControlLabel
                  key={value}
                  value={value.toString()}
                  control={<Radio disabled size="small" />}
                  label={value}
                  labelPlacement="top"
                  disabled
                />
              ))}
            </RadioGroup>
          </Grid>
          {element.endLabel && (
            <Grid item xs={3} md={2}>
              <Typography variant="body2" color="text.secondary" align="center">
                {element.endLabel}
              </Typography>
            </Grid>
          )}
        </Grid>
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
          
          <Box sx={{ mb: 4 }}>
            <FormLabel component="legend" sx={{ mb: 2, fontWeight: 500 }}>
              Thang điểm tuyến tính
            </FormLabel>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="start-value-label">Giá trị bắt đầu</InputLabel>
                  <Select
                    labelId="start-value-label"
                    id="start-value"
                    value={scaleRange.start}
                    label="Giá trị bắt đầu"
                    onChange={handleStartValueChange}
                    size="small"
                  >
                    {[0, 1].map(num => (
                      <MenuItem key={num} value={num}>{num}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="end-value-label">Giá trị kết thúc</InputLabel>
                  <Select
                    labelId="end-value-label"
                    id="end-value"
                    value={scaleRange.end}
                    label="Giá trị kết thúc"
                    onChange={handleEndValueChange}
                    size="small"
                  >
                    {[5, 7, 10].map(num => (
                      <MenuItem key={num} value={num}>{num}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  placeholder="Nhãn cho giá trị bắt đầu (tùy chọn)"
                  value={element.startLabel || ''}
                  onChange={handleStartLabelChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  placeholder="Nhãn cho giá trị kết thúc (tùy chọn)"
                  value={element.endLabel || ''}
                  onChange={handleEndLabelChange}
                  size="small"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Xem trước thang điểm:
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                {element.startLabel && (
                  <Typography variant="body2" color="text.secondary">
                    {element.startLabel}
                  </Typography>
                )}
                <RadioGroup
                  row
                  sx={{ 
                    justifyContent: 'space-between',
                    flex: 1,
                    mx: 2
                  }}
                >
                  {generateScaleOptions().map((value) => (
                    <FormControlLabel
                      key={value}
                      value={value.toString()}
                      control={<Radio disabled size="small" />}
                      label={value}
                      labelPlacement="top"
                      disabled
                    />
                  ))}
                </RadioGroup>
                {element.endLabel && (
                  <Typography variant="body2" color="text.secondary">
                    {element.endLabel}
                  </Typography>
                )}
              </Stack>
            </Box>
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
          <Grid container spacing={1} alignItems="center">
            {element.startLabel && (
              <Grid item xs={3} md={2}>
                <Typography variant="body2" color="text.secondary" align="center">
                  {element.startLabel}
                </Typography>
              </Grid>
            )}
            <Grid item xs={6} md={8}>
              <RadioGroup
                row
                sx={{ 
                  justifyContent: 'space-between',
                  width: '100%'
                }}
              >
                {generateScaleOptions().map((value) => (
                  <FormControlLabel
                    key={value}
                    value={value.toString()}
                    control={<Radio disabled size="small" />}
                    label={value}
                    labelPlacement="top"
                    disabled
                  />
                ))}
              </RadioGroup>
            </Grid>
            {element.endLabel && (
              <Grid item xs={3} md={2}>
                <Typography variant="body2" color="text.secondary" align="center">
                  {element.endLabel}
                </Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default LinearScaleInput; 