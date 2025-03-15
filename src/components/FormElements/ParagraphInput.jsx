import { 
  Box, 
  Typography, 
  TextField, 
  FormControl, 
  FormControlLabel,
  Switch
} from '@mui/material';
import { useFormContext } from '../../contexts/FormContext';
import TextFormatToolbar from './TextFormatToolbar';
import FormattedText from './FormattedText';
import { useRef } from 'react';

const ParagraphInput = ({ element, isPreview = false }) => {
  const { updateElement, activeElementId } = useFormContext();
  const isActive = activeElementId === element.id;
  const labelRef = useRef(null);

  const handleLabelChange = (e) => {
    updateElement(element.id, { label: e.target.value });
  };

  const handleRequiredChange = (e) => {
    updateElement(element.id, { required: e.target.checked });
  };

  const handlePlaceholderChange = (e) => {
    updateElement(element.id, { placeholder: e.target.value });
  };

  const handleFormatChange = (formatType) => {
    const currentFormats = element.labelFormats || {};
    const newFormats = {
      ...currentFormats,
      [formatType]: !currentFormats[formatType]
    };
    updateElement(element.id, { labelFormats: newFormats });
  };

  const handleAddLink = (linkData) => {
    // Lấy vị trí con trỏ hiện tại trong TextField
    const inputElement = labelRef.current?.querySelector('input');
    const cursorPosition = inputElement?.selectionStart || 0;
    
    // Tạo links array nếu chưa có
    const currentLinks = element.links || [];
    
    // Thêm link mới vào danh sách
    const newLinks = [
      ...currentLinks,
      {
        position: cursorPosition,
        text: linkData.text,
        url: linkData.url
      }
    ];
    
    // Cập nhật trạng thái
    updateElement(element.id, { links: newLinks });
    
    // Cập nhật label text với link text đã chèn vào
    const beforeText = element.label.substring(0, cursorPosition);
    const afterText = element.label.substring(cursorPosition);
    const newLabelText = beforeText + linkData.text + afterText;
    
    updateElement(element.id, { label: newLabelText });
  };

  if (isPreview) {
    return (
      <Box sx={{ mb: 2, px: 3, py: 2 }}>
        <FormattedText
          text={element.label}
          formats={element.labelFormats}
          links={element.links}
          variant="subtitle1"
          sx={{ mb: 1, fontWeight: 500 }}
        />
        {element.required && (
          <span style={{ color: '#d93025', marginLeft: '4px' }}> *</span>
        )}
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder={element.placeholder || 'Văn bản câu trả lời của bạn'}
          multiline
          rows={4}
          disabled
          sx={{ mt: 1 }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ p: '24px 24px', width: '100%' }} ref={labelRef}>
      {isActive ? (
        <FormControl fullWidth>
          {isActive && (
            <TextFormatToolbar 
              onFormat={handleFormatChange}
              activeFormats={element.labelFormats || {}}
              onAddLink={handleAddLink}
            />
          )}
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
                fontWeight: element.labelFormats?.bold ? 'bold' : 500,
                fontStyle: element.labelFormats?.italic ? 'italic' : 'normal',
                textDecoration: element.labelFormats?.underline ? 'underline' : 'none',
              }
            }}
          />
          <TextField
            fullWidth
            placeholder="Gợi ý (tùy chọn)"
            value={element.placeholder || ''}
            onChange={handlePlaceholderChange}
            variant="outlined"
            size="small"
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
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
          <FormattedText
            text={element.label || 'Câu hỏi không có tiêu đề'}
            formats={element.labelFormats}
            links={element.links}
            variant="subtitle1"
            sx={{ fontWeight: 500, mb: 1 }}
          />
          {element.required && (
            <span style={{ color: '#d93025', marginLeft: '4px' }}> *</span>
          )}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder={element.placeholder || 'Văn bản câu trả lời của bạn'}
            multiline
            rows={4}
            disabled
            sx={{ mt: 1 }}
          />
        </>
      )}
    </Box>
  );
};

export default ParagraphInput; 