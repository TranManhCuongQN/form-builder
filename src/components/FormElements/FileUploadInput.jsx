import { 
  Box, 
  Typography, 
  TextField, 
  FormControl, 
  FormControlLabel,
  Switch,
  Paper,
  Button,
  Chip,
  OutlinedInput,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useFormContext } from '../../contexts/FormContext';
import { useState } from 'react';

const FileUploadInput = ({ element, isPreview = false }) => {
  const { updateElement, activeElementId } = useFormContext();
  const isActive = activeElementId === element.id;
  const [allowedTypes, setAllowedTypes] = useState(element.allowedTypes || []);

  const fileTypes = [
    { value: 'image/*', label: 'Hình ảnh' },
    { value: 'application/pdf', label: 'PDF' },
    { value: 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'Tài liệu Word' },
    { value: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', label: 'Bảng tính Excel' },
    { value: 'text/plain', label: 'Văn bản thuần' },
    { value: 'application/zip,application/x-rar-compressed', label: 'File nén (ZIP, RAR)' },
    { value: '*/*', label: 'Tất cả tệp' }
  ];

  const handleLabelChange = (e) => {
    updateElement(element.id, { label: e.target.value });
  };

  const handleRequiredChange = (e) => {
    updateElement(element.id, { required: e.target.checked });
  };

  const handleDescriptionChange = (e) => {
    updateElement(element.id, { description: e.target.value });
  };

  const handleMaxFilesChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      updateElement(element.id, { maxFiles: value });
    }
  };

  const handleAllowedTypesChange = (e) => {
    const values = e.target.value;
    setAllowedTypes(values);
    updateElement(element.id, { allowedTypes: values });
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
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderStyle: 'dashed',
            borderColor: 'rgba(0, 0, 0, 0.23)',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            minHeight: 100,
            borderRadius: 1
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            Kéo thả tệp hoặc nhấp vào đây để tải lên
          </Typography>
          {element.maxFiles && (
            <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
              Tối đa {element.maxFiles} tệp
            </Typography>
          )}
          {allowedTypes && allowedTypes.length > 0 && allowedTypes[0] !== '*/*' && (
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
              {allowedTypes.map(type => {
                const fileType = fileTypes.find(ft => ft.value === type);
                return (
                  <Chip
                    key={type}
                    label={fileType ? fileType.label : type}
                    size="small"
                    icon={<AttachFileIcon fontSize="small" />}
                  />
                );
              })}
            </Box>
          )}
        </Paper>
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
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderStyle: 'dashed',
                borderColor: 'rgba(0, 0, 0, 0.23)',
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                minHeight: 100,
                borderRadius: 1,
                mb: 2
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="text.secondary" align="center">
                Kéo thả tệp hoặc nhấp vào đây để tải lên
              </Typography>
              <Button 
                variant="outlined" 
                component="span" 
                startIcon={<CloudUploadIcon />}
                size="small"
                sx={{ mt: 2 }}
                disabled
              >
                Chọn tệp
              </Button>
            </Paper>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Loại tệp được phép
              </Typography>
              <FormControl fullWidth>
                <Select
                  multiple
                  value={allowedTypes}
                  onChange={handleAllowedTypesChange}
                  input={<OutlinedInput />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const fileType = fileTypes.find(ft => ft.value === value);
                        return (
                          <Chip 
                            key={value} 
                            label={fileType ? fileType.label : value} 
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                  size="small"
                >
                  {fileTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Chọn các loại tệp mà người dùng được phép tải lên. Mặc định là tất cả.
                </FormHelperText>
              </FormControl>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Số lượng tệp tối đa
              </Typography>
              <TextField
                type="number"
                fullWidth
                value={element.maxFiles || 1}
                onChange={handleMaxFilesChange}
                inputProps={{ min: 1, max: 10 }}
                size="small"
              />
              <FormHelperText>
                Số lượng tệp tối đa mà người dùng có thể tải lên.
              </FormHelperText>
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
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderStyle: 'dashed',
              borderColor: 'rgba(0, 0, 0, 0.23)',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              minHeight: 100,
              borderRadius: 1
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" align="center">
              Kéo thả tệp hoặc nhấp vào đây để tải lên
            </Typography>
            {element.maxFiles && (
              <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
                Tối đa {element.maxFiles} tệp
              </Typography>
            )}
            <Button 
              variant="outlined" 
              component="span" 
              startIcon={<CloudUploadIcon />}
              size="small"
              sx={{ mt: 2 }}
              disabled
            >
              Chọn tệp
            </Button>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default FileUploadInput; 