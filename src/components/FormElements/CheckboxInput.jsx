import { 
  Box, 
  Typography, 
  TextField, 
  Checkbox, 
  FormControl, 
  FormControlLabel,
  IconButton,
  Switch,
  Paper,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useFormContext } from '../../contexts/FormContext';
import { useRef, useState, useCallback, useEffect } from 'react';

const CheckboxInput = ({ element, isPreview = false }) => {
  const { updateElement, activeElementId, updateOption, removeOption, addOption, reorderOptions } = useFormContext();
  const isActive = activeElementId === element.id;

  const [draggingOption, setDraggingOption] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragItemRef = useRef(null);
  const dragOverItemRef = useRef(null);
  const dragNode = useRef(null);
  const optionsRef = useRef([]);

  useEffect(() => {
    optionsRef.current = optionsRef.current.slice(0, element.options.length);
  }, [element.options.length]);

  const handleLabelChange = (e) => {
    updateElement(element.id, { label: e.target.value });
  };

  const handleRequiredChange = (e) => {
    updateElement(element.id, { required: e.target.checked });
  };

  const handleOptionChange = (optionId, value) => {
    updateOption(element.id, optionId, value);
  };

  const handleAddOption = () => {
    const newOptionId = addOption(element.id);
    
    // Thêm animation cho tùy chọn mới
    setTimeout(() => {
      const newOption = document.getElementById(`option-${newOptionId}`);
      if (newOption) {
        newOption.classList.add('option-new-added');
        setTimeout(() => {
          newOption.classList.remove('option-new-added');
        }, 500);
      }
    }, 10);
  };

  const handleRemoveOption = (optionId) => {
    if (element.options.length <= 1) return; // Giữ ít nhất 1 tùy chọn
    
    // Reset trạng thái kéo thả khi xóa option
    setDraggingOption(null);
    setDragOverIndex(null);
    dragItemRef.current = null;
    dragOverItemRef.current = null;
    
    removeOption(element.id, optionId);
  };

  // Bắt đầu quá trình kéo thả
  const handleDragStart = useCallback((e, index) => {
    // Không lan truyền sự kiện, nhưng đảm bảo không tắt sự kiện trên chính option
    e.stopPropagation();
    
    // Thêm class để đánh dấu đang kéo thả
    document.body.classList.add('dragging-option-active');
    
    // Lưu trữ tham chiếu đến node được kéo
    dragNode.current = e.currentTarget;
    dragItemRef.current = index;
    setDraggingOption(index);

    // Thiết lập dữ liệu kéo - cần thiết cho tính năng kéo thả
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'option',
      elementId: element.id,
      index
    }));

    // Tạo ảnh ghost tùy chỉnh cho kéo thả mượt mà hơn
    try {
      // Tạo bản sao của phần tử để làm ghost image
      const ghostEl = e.currentTarget.cloneNode(true);
      ghostEl.style.width = `${e.currentTarget.offsetWidth}px`;
      ghostEl.classList.add('option-ghost');
      
      // Thêm vào DOM nhưng ẩn đi
      ghostEl.style.position = 'absolute';
      ghostEl.style.top = '-1000px';
      ghostEl.style.opacity = '0.8';
      document.body.appendChild(ghostEl);
      
      // Đặt ghost image
      e.dataTransfer.setDragImage(ghostEl, 20, 20);
      
      // Dọn dẹp ghost image
      setTimeout(() => {
        document.body.removeChild(ghostEl);
      }, 0);
    } catch (err) {
      console.warn('Không thể tạo ghost image:', err);
    }

    // Đánh dấu element đang kéo
    requestAnimationFrame(() => {
      e.currentTarget.classList.add('dragging-option');
      
      // Đánh dấu các option khác có thể nhận drop
      if (optionsRef.current && optionsRef.current.length > 0) {
        optionsRef.current.forEach((item, idx) => {
          if (item && idx !== index) {
            item.classList.add('option-drag-possible');
          }
        });
      }
    });
  }, [element.id]);

  // Khi di chuyển qua một option khác
  const handleDragOver = useCallback((e) => {
    e.preventDefault(); // Quan trọng để cho phép drop
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    
    // Thêm hiệu ứng visual thêm
    const target = e.currentTarget;
    if (!target.classList.contains('drag-over-option') && 
        dragItemRef.current !== null && 
        optionsRef.current.indexOf(target) !== dragItemRef.current) {
      target.classList.add('drag-over-option');
    }
  }, []);

  const handleDragEnter = useCallback((e, index) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (index === dragItemRef.current) return;
    
    dragOverItemRef.current = index;
    setDragOverIndex(index);
    
    // Xóa class từ tất cả các options
    if (optionsRef.current && optionsRef.current.length > 0) {
      optionsRef.current.forEach(item => {
        if (item) item.classList.remove('drag-over-option');
      });
    }
    
    // Thêm class cho option hiện tại
    if (optionsRef.current[index]) {
      optionsRef.current[index].classList.add('drag-over-option');
    }
  }, []);

  // Khi hoàn thành kéo thả
  const handleDrop = useCallback((e, index) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Thực hiện reorder nếu cần
    if (dragItemRef.current !== null && dragItemRef.current !== index) {
      reorderOptions(element.id, dragItemRef.current, index);
      
      // Thêm hiệu ứng ripple khi hoàn thành kéo thả
      if (optionsRef.current[index]) {
        optionsRef.current[index].classList.add('option-ripple');
        setTimeout(() => {
          if (optionsRef.current[index]) {
            optionsRef.current[index].classList.remove('option-ripple');
            optionsRef.current[index].classList.add('option-dropped');
            setTimeout(() => {
              if (optionsRef.current[index]) {
                optionsRef.current[index].classList.remove('option-dropped');
              }
            }, 400);
          }
        }, 600);
      }
    }
    
    // Reset tất cả trạng thái và class
    handleDragEnd();
    return false;
  }, [element.id, reorderOptions]);

  // Khi hoàn thành kéo thả (dù thành công hay thất bại)
  const handleDragEnd = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Xóa class cho body
    document.body.classList.remove('dragging-option-active');
    
    // Xóa tất cả các class liên quan đến kéo thả
    if (dragNode.current) {
      dragNode.current.classList.remove('dragging-option');
    }
    
    if (optionsRef.current && optionsRef.current.length > 0) {
      optionsRef.current.forEach(item => {
        if (item) {
          item.classList.remove('drag-over-option', 'option-drag-possible', 'option-ripple', 'option-dropped');
        }
      });
    }
    
    // Reset các trạng thái
    setDraggingOption(null);
    setDragOverIndex(null);
    dragItemRef.current = null;
    dragOverItemRef.current = null;
    dragNode.current = null;
  }, []);

  // Khi rời khỏi vùng kéo thả
  const handleDragLeave = useCallback((e) => {
    e.stopPropagation(); // Ngăn chặn lan truyền sự kiện
    
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove('drag-over-option');
    }
  }, []);

  if (isPreview) {
    return (
      <Box sx={{ mb: 2, px: 3, py: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          {element.label}{element.required && <span style={{ color: '#d93025', marginLeft: '4px' }}> *</span>}
        </Typography>
        <Box>
          {element.options.map(option => (
            <FormControlLabel
              key={option.id}
              control={<Checkbox disabled />}
              label={option.value}
              disabled
            />
          ))}
        </Box>
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
            sx={{ mb: 3 }}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              style: { 
                fontSize: '1.1rem',
                fontWeight: 500
              }
            }}
          />
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Các tùy chọn
            </Typography>
          </Box>
          {element.options.map((option, index) => (
            <Paper
              key={option.id}
              ref={el => optionsRef.current[index] = el}
              draggable
              id={`option-${option.id}`}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, index)}
              elevation={0}
              className="option-item-wrapper"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1.5,
                p: 0.5,
                borderRadius: 1,
                border: '1px solid transparent',
                opacity: draggingOption === index ? 0.7 : 1,
                bgcolor: 'background.paper', 
                transition: draggingOption !== null ? 'none' : 'background-color 0.2s ease, border 0.2s ease',
              }}
            >
              <Box 
                className="drag-handle"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  px: 0.5
                }}
              >
                <DragIndicatorIcon fontSize="small" />
              </Box>
              <Checkbox disabled sx={{ mx: 0.5 }} />
              <TextField
                fullWidth
                value={option.value}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                size="small"
                variant="standard"
                InputProps={{
                  disableUnderline: true
                }}
                sx={{ mx: 0.5, flex: 1 }}
              />
              <IconButton 
                onClick={() => handleRemoveOption(option.id)}
                disabled={element.options.length <= 1}
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                    backgroundColor: 'rgba(255, 77, 79, 0.1)',
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Paper>
          ))}
          <Box sx={{ mt: 1, mb: 3 }}>
            <Button
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddOption}
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Thêm tùy chọn
            </Button>
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
          <Box>
            {element.options.map(option => (
              <FormControlLabel
                key={option.id}
                control={<Checkbox disabled />}
                label={option.value}
                disabled
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default CheckboxInput; 