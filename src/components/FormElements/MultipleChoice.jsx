import { 
  Box, 
  Typography, 
  TextField, 
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Switch,
  IconButton,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useFormContext } from '../../contexts/FormContext';
import { useState, useRef, useCallback } from 'react';
import TextFormatToolbar from './TextFormatToolbar';
import FormattedText from './FormattedText';

const MultipleChoice = ({ element, isPreview = false }) => {
  const { updateElement, activeElementId, addOption, removeOption, updateOption, reorderOptions } = useFormContext();
  const isActive = activeElementId === element.id;
  const [focusedOptionId, setFocusedOptionId] = useState(null);
  const labelRef = useRef(null);
  const optionsRef = useRef([]);
  const [draggingOption, setDraggingOption] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragItemRef = useRef(null);
  const dragOverItemRef = useRef(null);
  const dragNode = useRef(null);

  const handleLabelChange = (e) => {
    updateElement(element.id, { label: e.target.value });
  };

  const handleRequiredChange = (e) => {
    updateElement(element.id, { required: e.target.checked });
  };

  const handleDescriptionChange = (e) => {
    updateElement(element.id, { description: e.target.value });
  };

  const handleOptionChange = (optionId, value) => {
    updateOption(element.id, optionId, value);
  };

  const handleAddOption = () => {
    const newOptionId = addOption(element.id);
    // Focus the new option after it's added
    setTimeout(() => {
      setFocusedOptionId(newOptionId);
    }, 100);
  };

  const handleRemoveOption = (optionId) => {
    if (element.options.length <= 1) return; // Không cho phép xóa hết các tùy chọn
    removeOption(element.id, optionId);
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
    
    const sourceIndex = dragItemRef.current;
    
    if (sourceIndex !== null && sourceIndex !== index) {
      // Thực hiện việc sắp xếp lại các options
      reorderOptions(element.id, sourceIndex, index);
      
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
    
    // Đặt lại tất cả trạng thái
    handleDragEnd(e);
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
        {element.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {element.description}
          </Typography>
        )}
        <RadioGroup>
          {element.options.map((option) => (
            <FormControlLabel
              key={option.id}
              control={<Radio disabled size="small" />}
              label={option.value}
              sx={{ 
                mt: 1,
                alignItems: 'flex-start',
                '.MuiFormControlLabel-label': { mt: '-3px' }
              }}
            />
          ))}
        </RadioGroup>
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
                  p: 1,
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
                    px: 0.5,
                    cursor: 'grab',
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  <DragIndicatorIcon fontSize="small" />
                </Box>
                <Radio disabled sx={{ mx: 0.5 }} />
                <TextField
                  fullWidth
                  value={option.value}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  size="small"
                  variant="standard"
                  autoFocus={focusedOptionId === option.id}
                  onFocus={() => setFocusedOptionId(option.id)}
                  onBlur={() => setFocusedOptionId(null)}
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
            <Button 
              startIcon={<AddIcon />} 
              onClick={handleAddOption}
              sx={{ mt: 1 }}
              size="small"
            >
              Thêm lựa chọn
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
          {element.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {element.description}
            </Typography>
          )}
          <RadioGroup>
            {element.options.map((option) => (
              <FormControlLabel
                key={option.id}
                control={<Radio disabled size="small" />}
                label={option.value}
                sx={{ 
                  mt: 1,
                  alignItems: 'flex-start',
                  '.MuiFormControlLabel-label': { mt: '-3px' }
                }}
              />
            ))}
          </RadioGroup>
        </>
      )}
    </Box>
  );
};

export default MultipleChoice; 