import { 
  Box, 
  Typography, 
  TextField, 
  FormControl,
  Divider,
  Paper
} from '@mui/material';
import { useFormContext } from '../../contexts/FormContext';
import TextFormatToolbar from './TextFormatToolbar';
import FormattedText from './FormattedText';
import { useRef } from 'react';

const SectionHeader = ({ element, isPreview = false }) => {
  const { updateElement, activeElementId } = useFormContext();
  const isActive = activeElementId === element.id;
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleTitleChange = (e) => {
    updateElement(element.id, { title: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    updateElement(element.id, { description: e.target.value });
  };

  const handleTitleFormatChange = (formatType) => {
    const currentFormats = element.titleFormats || {};
    const newFormats = {
      ...currentFormats,
      [formatType]: !currentFormats[formatType]
    };
    updateElement(element.id, { titleFormats: newFormats });
  };

  const handleDescriptionFormatChange = (formatType) => {
    const currentFormats = element.descriptionFormats || {};
    const newFormats = {
      ...currentFormats,
      [formatType]: !currentFormats[formatType]
    };
    updateElement(element.id, { descriptionFormats: newFormats });
  };

  const handleAddTitleLink = (linkData) => {
    try {
      // Lấy vị trí con trỏ hiện tại trong TextField
      const inputElement = titleRef.current?.querySelector('input');
      const cursorPosition = inputElement?.selectionStart || 0;
      
      // Đảm bảo giá trị title tồn tại
      const currentTitle = element.title || '';
      
      // Cập nhật title text với link text đã chèn vào
      const beforeText = currentTitle.substring(0, cursorPosition);
      const afterText = currentTitle.substring(cursorPosition);
      const newTitleText = beforeText + linkData.text + afterText;
      
      // Tạo links array nếu chưa có
      const currentLinks = element.titleLinks || [];
      
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
      updateElement(element.id, { 
        title: newTitleText,
        titleLinks: newLinks
      });
    } catch (error) {
      console.error("Lỗi xử lý liên kết tiêu đề:", error);
    }
  };

  const handleAddDescriptionLink = (linkData) => {
    try {
      // Lấy vị trí con trỏ hiện tại trong TextField
      const textareaElement = descriptionRef.current?.querySelector('textarea');
      const cursorPosition = textareaElement?.selectionStart || 0;
      
      // Đảm bảo giá trị description tồn tại
      const currentDescription = element.description || '';
      
      // Cập nhật description text với link text đã chèn vào
      const beforeText = currentDescription.substring(0, cursorPosition);
      const afterText = currentDescription.substring(cursorPosition);
      const newDescriptionText = beforeText + linkData.text + afterText;
      
      // Tạo links array nếu chưa có
      const currentLinks = element.descriptionLinks || [];
      
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
      updateElement(element.id, { 
        description: newDescriptionText,
        descriptionLinks: newLinks
      });
    } catch (error) {
      console.error("Lỗi xử lý liên kết mô tả:", error);
    }
  };

  if (isPreview) {
    return (
      <Box sx={{ mb: 2, px: 3, pt: 2, pb: 1 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            bgcolor: 'rgba(0, 0, 0, 0.02)',
            p: 3,
            border: '1px solid rgba(0, 0, 0, 0.06)'
          }}
        >
          <FormattedText
            text={element.title}
            formats={element.titleFormats}
            links={element.titleLinks}
            variant="h6"
            sx={{ fontWeight: 500, mb: 1 }}
          />
          {element.description && (
            <FormattedText
              text={element.description}
              formats={element.descriptionFormats}
              links={element.descriptionLinks}
              variant="body1"
              color="text.secondary"
            />
          )}
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: '24px 24px', width: '100%' }}>
      {isActive ? (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ mb: 1 }} ref={titleRef}>
            <TextFormatToolbar 
              onFormat={handleTitleFormatChange}
              activeFormats={element.titleFormats || {}}
              onAddLink={handleAddTitleLink}
            />
            <TextField
              fullWidth
              placeholder="Tiêu đề phần"
              value={element.title || ''}
              onChange={handleTitleChange}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                style: { 
                  fontSize: '1.2rem',
                  fontWeight: element.titleFormats?.bold ? 'bold' : 500,
                  fontStyle: element.titleFormats?.italic ? 'italic' : 'normal',
                  textDecoration: element.titleFormats?.underline ? 'underline' : 'none',
                }
              }}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mt: 2 }} ref={descriptionRef}>
            <TextFormatToolbar 
              onFormat={handleDescriptionFormatChange}
              activeFormats={element.descriptionFormats || {}}
              onAddLink={handleAddDescriptionLink}
            />
            <TextField
              fullWidth
              placeholder="Mô tả phần (tùy chọn)"
              value={element.description || ''}
              onChange={handleDescriptionChange}
              multiline
              rows={3}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                style: { 
                  fontSize: '1rem',
                  fontWeight: element.descriptionFormats?.bold ? 'bold' : 400,
                  fontStyle: element.descriptionFormats?.italic ? 'italic' : 'normal',
                  textDecoration: element.descriptionFormats?.underline ? 'underline' : 'none',
                }
              }}
            />
          </Box>
        </Box>
      ) : (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            bgcolor: 'rgba(0, 0, 0, 0.02)',
            p: 3,
            border: '1px solid rgba(0, 0, 0, 0.06)'
          }}
        >
          <FormattedText
            text={element.title || 'Tiêu đề phần'}
            formats={element.titleFormats}
            links={element.titleLinks}
            variant="h6"
            sx={{ fontWeight: 500, mb: 1 }}
          />
          {element.description && (
            <FormattedText
              text={element.description}
              formats={element.descriptionFormats}
              links={element.descriptionLinks}
              variant="body1"
              color="text.secondary"
            />
          )}
        </Paper>
      )}
    </Box>
  );
};

export default SectionHeader; 