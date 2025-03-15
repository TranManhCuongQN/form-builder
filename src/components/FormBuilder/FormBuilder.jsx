import { useState, useRef } from 'react';
import { Box, Paper, TextField, Typography, Card, Button, Fade, Container } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SaveIcon from '@mui/icons-material/Save';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useFormContext } from '../../contexts/FormContext';
import FormElement from '../FormElements/FormElement';
import AddElementPanel from './AddElementPanel';
import FormPreview from './FormPreview';

const FormBuilder = () => {
  const { 
    formTitle, 
    setFormTitle, 
    formDescription, 
    setFormDescription, 
    formElements, 
    reorderElements,
    activeElementId,
    setActiveElementId,
  } = useFormContext();

  const [showPreview, setShowPreview] = useState(false);
  const [draggingItem, setDraggingItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragItemRef = useRef(null);
  const dragOverItemRef = useRef(null);

  // Bắt đầu quá trình kéo thả
  const handleDragStart = (e, index) => {
    // Không cho phép kéo thả form element nếu đang kéo thả options
    if (document.body.classList.contains('dragging-option-active')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    dragItemRef.current = index;
    setDraggingItem(index);
    // Thêm visual feedback cho item đang kéo
    e.currentTarget.classList.add('dragging-item');
  };

  // Khi di chuyển qua một item khác
  const handleDragEnter = (e, index) => {
    // Không cho phép kéo thả form element nếu đang kéo thả options
    if (document.body.classList.contains('dragging-option-active')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    dragOverItemRef.current = index;
    setDragOverIndex(index);
    // Thêm visual feedback cho vị trí có thể thả
    e.currentTarget.classList.add('drag-over');
  };

  // Khi hoàn thành kéo thả
  const handleDragEnd = (e) => {
    // Không cho phép kéo thả form element nếu đang kéo thả options
    if (document.body.classList.contains('dragging-option-active')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Sắp xếp lại các phần tử
    if (dragItemRef.current !== null && dragOverItemRef.current !== null) {
      reorderElements(dragItemRef.current, dragOverItemRef.current);
    }
    
    // Reset các trạng thái kéo thả
    dragItemRef.current = null;
    dragOverItemRef.current = null;
    setDraggingItem(null);
    setDragOverIndex(null);
    
    // Xóa các class visual feedback
    document.querySelectorAll('.dragging-item').forEach(item => {
      item.classList.remove('dragging-item');
    });
    
    document.querySelectorAll('.drag-over').forEach(item => {
      item.classList.remove('drag-over');
    });
  };

  // Khi hủy bỏ kéo thả
  const handleDragLeave = (e) => {
    // Không cho phép kéo thả form element nếu đang kéo thả options
    if (document.body.classList.contains('dragging-option-active')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    e.currentTarget.classList.remove('drag-over');
  };

  if (showPreview) {
    return (
      <Fade in>
        <Container maxWidth="md" sx={{ width: '100%', px: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="500" color="primary.main">
              Xem trước biểu mẫu
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => setShowPreview(false)}
              startIcon={<SaveIcon />}
              sx={{ borderRadius: 2 }}
            >
              Quay lại chỉnh sửa
            </Button>
          </Box>
          <FormPreview />
        </Container>
      </Fade>
    );
  }

  return (
    <Fade in>
      <Container maxWidth="md" sx={{ width: '100%', px: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="500" color="primary.main">
            Tạo biểu mẫu mới
          </Typography>
          <Box>
            <Button 
              variant="contained" 
              onClick={() => setShowPreview(true)}
              startIcon={<VisibilityIcon />}
              sx={{ mr: 1, borderRadius: 2 }}
            >
              Xem trước
            </Button>
            <Button 
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={() => alert('Lưu biểu mẫu (sẽ triển khai sau)')}
              sx={{ borderRadius: 2 }}
            >
              Lưu
            </Button>
          </Box>
        </Box>

        <Paper 
          elevation={0}
          sx={{ 
            p: 0, 
            mb: 4, 
            backgroundColor: 'primary.main', 
            color: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            },
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 3 }}>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Tiêu đề biểu mẫu"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              InputProps={{
                disableUnderline: true,
                style: { 
                  color: 'white', 
                  fontSize: '1.8rem',
                  fontWeight: 500 
                },
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              variant="standard"
              placeholder="Mô tả biểu mẫu (tùy chọn)"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              InputProps={{
                disableUnderline: true,
                style: { 
                  color: 'white',
                },
              }}
              multiline
              rows={2}
            />
          </Box>
        </Paper>

        <Box 
          sx={{ 
            minHeight: 150,
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          {formElements.length === 0 ? (
            <Card 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                bgcolor: 'background.paper',
                color: 'text.secondary',
                border: '1px dashed #ccc',
                borderRadius: 2,
                boxShadow: 'none'
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Thêm câu hỏi để bắt đầu tạo biểu mẫu của bạn
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Sử dụng các loại câu hỏi bên dưới để thêm vào biểu mẫu
              </Typography>
            </Card>
          ) : (
            formElements.map((element, index) => (
              <Box
                key={element.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
                onDrop={(e) => e.preventDefault()}
                sx={{ 
                  display: 'flex',
                  width: '100%', 
                  opacity: draggingItem === index ? 0.6 : 1,
                  transform: draggingItem === index ? 'scale(1.01)' : 'scale(1)',
                  border: dragOverIndex === index ? '2px dashed #673ab7' : 'none',
                  borderRadius: 2,
                  marginTop: 0,
                  marginBottom: 0,
                  padding: dragOverIndex === index ? 1 : 0,
                  backgroundColor: dragOverIndex === index ? 'rgba(103, 58, 183, 0.05)' : 'transparent',
                  transition: 'transform 0.2s ease, opacity 0.2s ease, background-color 0.2s ease',
                }}
              >
                <Box sx={{ 
                  width: 40, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'grab',
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8,
                  color: 'text.disabled',
                  height: '100%',
                  zIndex: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(103, 58, 183, 0.1)',
                    color: 'primary.main'
                  },
                }}>
                  <DragIndicatorIcon fontSize="small" />
                </Box>
                <Box sx={{ width: 'calc(100% - 40px)' }}>
                  <FormElement
                    element={element}
                    isDragging={draggingItem === index}
                  />
                </Box>
              </Box>
            ))
          )}
        </Box>

        <Box sx={{ my: 4 }}>
          <AddElementPanel />
        </Box>
      </Container>
    </Fade>
  );
};

export default FormBuilder; 