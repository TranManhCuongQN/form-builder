import { 
  Box, 
  Typography, 
  TextField, 
  FormControl, 
  FormControlLabel,
  Switch,
  IconButton,
  Radio,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useFormContext } from '../../contexts/FormContext';
import { useState, useRef, useCallback } from 'react';
import TextFormatToolbar from './TextFormatToolbar';
import FormattedText from './FormattedText';

const GridInput = ({ element, isPreview = false }) => {
  const { updateElement, activeElementId } = useFormContext();
  const isActive = activeElementId === element.id;
  const [focusedRow, setFocusedRow] = useState(null);
  const [focusedColumn, setFocusedColumn] = useState(null);
  const labelRef = useRef(null);
  
  // Trạng thái kéo thả
  const [draggingRowIndex, setDraggingRowIndex] = useState(null);
  const [dragOverRowIndex, setDragOverRowIndex] = useState(null);
  const [draggingColumnIndex, setDraggingColumnIndex] = useState(null);
  const [dragOverColumnIndex, setDragOverColumnIndex] = useState(null);
  const dragRowRef = useRef(null);
  const dragColumnRef = useRef(null);
  const rowsRef = useRef([]);
  const columnsRef = useRef([]);

  const handleLabelChange = (e) => {
    updateElement(element.id, { label: e.target.value });
  };

  const handleRequiredChange = (e) => {
    updateElement(element.id, { required: e.target.checked });
  };

  const handleDescriptionChange = (e) => {
    updateElement(element.id, { description: e.target.value });
  };

  const handleRowChange = (rowId, newValue) => {
    const updatedRows = element.rows.map(row => 
      row.id === rowId ? { ...row, label: newValue } : row
    );
    updateElement(element.id, { rows: updatedRows });
  };

  const handleColumnChange = (columnId, newValue) => {
    const updatedColumns = element.columns.map(column => 
      column.id === columnId ? { ...column, label: newValue } : column
    );
    updateElement(element.id, { columns: updatedColumns });
  };

  const addRow = () => {
    const newRow = { id: crypto.randomUUID(), label: `Hàng ${element.rows.length + 1}` };
    const updatedRows = [...element.rows, newRow];
    updateElement(element.id, { rows: updatedRows });
    setFocusedRow(newRow.id);
  };

  const addColumn = () => {
    const newColumn = { id: crypto.randomUUID(), label: `Cột ${element.columns.length + 1}` };
    const updatedColumns = [...element.columns, newColumn];
    updateElement(element.id, { columns: updatedColumns });
    setFocusedColumn(newColumn.id);
  };

  const removeRow = (rowId) => {
    if (element.rows.length <= 1) return; // Không cho phép xóa hết hàng
    const updatedRows = element.rows.filter(row => row.id !== rowId);
    updateElement(element.id, { rows: updatedRows });
  };

  const removeColumn = (columnId) => {
    if (element.columns.length <= 1) return; // Không cho phép xóa hết cột
    const updatedColumns = element.columns.filter(column => column.id !== columnId);
    updateElement(element.id, { columns: updatedColumns });
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
    try {
      // Lấy vị trí con trỏ hiện tại trong TextField
      const inputElement = labelRef.current?.querySelector('input');
      const cursorPosition = inputElement?.selectionStart || 0;
      
      // Đảm bảo giá trị label tồn tại
      const currentLabel = element.label || '';
      
      // Cập nhật label text với link text đã chèn vào
      const beforeText = currentLabel.substring(0, cursorPosition);
      const afterText = currentLabel.substring(cursorPosition);
      const newLabelText = beforeText + linkData.text + afterText;
      
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
      
      // Cập nhật trạng thái trong một lần để tránh vấn đề với React
      updateElement(element.id, { 
        label: newLabelText,
        links: newLinks
      });
    } catch (error) {
      console.error("Lỗi xử lý liên kết:", error);
    }
  };

  // Xử lý kéo thả cho hàng
  const handleRowDragStart = useCallback((e, index) => {
    e.stopPropagation();
    
    // Chống xung đột với kéo thả các thành phần khác
    if (document.body.classList.contains('dragging-option-active')) {
      e.preventDefault();
      return false;
    }
    
    // Thêm class để đánh dấu đang kéo thả lưới
    document.body.classList.add('dragging-grid-active');
    
    dragRowRef.current = index;
    setDraggingRowIndex(index);
    
    // Thêm dữ liệu để nhận diện loại kéo thả
    e.dataTransfer.setData('text/plain', 'grid-row');
    
    // Hiệu ứng kéo
    e.currentTarget.classList.add('dragging-row');
    
    // Đánh dấu các hàng khác có thể nhận drop
    rowsRef.current.forEach((row, idx) => {
      if (row && idx !== index) {
        row.classList.add('row-drag-possible');
      }
    });
  }, []);
  
  const handleRowDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dragRowRef.current !== null && dragRowRef.current !== index) {
      setDragOverRowIndex(index);
      
      // Xóa hiệu ứng từ tất cả các hàng
      rowsRef.current.forEach(row => {
        if (row) row.classList.remove('drag-over-row');
      });
      
      // Thêm hiệu ứng cho hàng hiện tại
      if (rowsRef.current[index]) {
        rowsRef.current[index].classList.add('drag-over-row');
      }
    }
  }, []);
  
  const handleRowDrop = useCallback((e, index) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Chỉ xử lý nếu đang kéo hàng
    if (e.dataTransfer.getData('text/plain') === 'grid-row') {
      if (dragRowRef.current !== null && dragRowRef.current !== index) {
        // Thực hiện việc sắp xếp lại các hàng
        const newRows = [...element.rows];
        const [movedRow] = newRows.splice(dragRowRef.current, 1);
        newRows.splice(index, 0, movedRow);
        
        // Cập nhật state
        updateElement(element.id, { rows: newRows });
        
        // Hiệu ứng hoàn thành
        if (rowsRef.current[index]) {
          rowsRef.current[index].classList.add('row-dropped');
          setTimeout(() => {
            if (rowsRef.current[index]) {
              rowsRef.current[index].classList.remove('row-dropped');
            }
          }, 300);
        }
      }
    }
    
    // Dọn dẹp
    resetRowDragState();
  }, [element.id, element.rows, updateElement]);
  
  const resetRowDragState = useCallback(() => {
    // Xóa class đánh dấu trên body
    document.body.classList.remove('dragging-grid-active');
    
    // Xóa tất cả các class liên quan đến kéo thả
    rowsRef.current.forEach(row => {
      if (row) {
        row.classList.remove('dragging-row', 'drag-over-row', 'row-drag-possible', 'row-dropped');
      }
    });
    
    // Reset các state
    setDraggingRowIndex(null);
    setDragOverRowIndex(null);
    dragRowRef.current = null;
  }, []);
  
  const handleRowDragEnd = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    resetRowDragState();
  }, [resetRowDragState]);
  
  // Xử lý kéo thả cho cột
  const handleColumnDragStart = useCallback((e, index) => {
    e.stopPropagation();
    
    // Chống xung đột với kéo thả các thành phần khác
    if (document.body.classList.contains('dragging-option-active')) {
      e.preventDefault();
      return false;
    }
    
    // Thêm class để đánh dấu đang kéo thả lưới
    document.body.classList.add('dragging-grid-active');
    
    dragColumnRef.current = index;
    setDraggingColumnIndex(index);
    
    // Thêm dữ liệu để nhận diện loại kéo thả
    e.dataTransfer.setData('text/plain', 'grid-column');
    
    // Hiệu ứng kéo
    e.currentTarget.classList.add('dragging-column');
    
    // Đánh dấu các cột khác có thể nhận drop
    columnsRef.current.forEach((column, idx) => {
      if (column && idx !== index) {
        column.classList.add('column-drag-possible');
      }
    });
  }, []);
  
  const handleColumnDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dragColumnRef.current !== null && dragColumnRef.current !== index) {
      setDragOverColumnIndex(index);
      
      // Xóa hiệu ứng từ tất cả các cột
      columnsRef.current.forEach(column => {
        if (column) column.classList.remove('drag-over-column');
      });
      
      // Thêm hiệu ứng cho cột hiện tại
      if (columnsRef.current[index]) {
        columnsRef.current[index].classList.add('drag-over-column');
      }
    }
  }, []);
  
  const handleColumnDrop = useCallback((e, index) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Chỉ xử lý nếu đang kéo cột
    if (e.dataTransfer.getData('text/plain') === 'grid-column') {
      if (dragColumnRef.current !== null && dragColumnRef.current !== index) {
        // Thực hiện việc sắp xếp lại các cột
        const newColumns = [...element.columns];
        const [movedColumn] = newColumns.splice(dragColumnRef.current, 1);
        newColumns.splice(index, 0, movedColumn);
        
        // Cập nhật state
        updateElement(element.id, { columns: newColumns });
        
        // Hiệu ứng hoàn thành
        if (columnsRef.current[index]) {
          columnsRef.current[index].classList.add('column-dropped');
          setTimeout(() => {
            if (columnsRef.current[index]) {
              columnsRef.current[index].classList.remove('column-dropped');
            }
          }, 300);
        }
      }
    }
    
    // Dọn dẹp
    resetColumnDragState();
  }, [element.id, element.columns, updateElement]);
  
  const resetColumnDragState = useCallback(() => {
    // Xóa class đánh dấu trên body
    document.body.classList.remove('dragging-grid-active');
    
    // Xóa tất cả các class liên quan đến kéo thả
    columnsRef.current.forEach(column => {
      if (column) {
        column.classList.remove('dragging-column', 'drag-over-column', 'column-drag-possible', 'column-dropped');
      }
    });
    
    // Reset các state
    setDraggingColumnIndex(null);
    setDragOverColumnIndex(null);
    dragColumnRef.current = null;
  }, []);
  
  const handleColumnDragEnd = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    resetColumnDragState();
  }, [resetColumnDragState]);

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
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {element.columns.map((column) => (
                  <TableCell key={column.id} align="center">
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {element.rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.label}
                  </TableCell>
                  {element.columns.map((column) => (
                    <TableCell key={column.id} align="center">
                      <Radio disabled size="small" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
          
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {element.columns.map((column, index) => (
                    <TableCell 
                      key={column.id} 
                      align="center"
                      ref={el => columnsRef.current[index] = el}
                      draggable
                      onDragStart={(e) => handleColumnDragStart(e, index)}
                      onDragOver={(e) => handleColumnDragOver(e, index)}
                      onDragEnd={handleColumnDragEnd}
                      onDrop={(e) => handleColumnDrop(e, index)}
                      className="grid-column-header"
                      sx={{
                        opacity: draggingColumnIndex === index ? 0.7 : 1,
                        bgcolor: dragOverColumnIndex === index ? 'rgba(103, 58, 183, 0.05)' : 'inherit',
                        borderTop: dragOverColumnIndex === index ? '2px dashed #673ab7' : 'inherit',
                        cursor: 'grab',
                        '&:active': {
                          cursor: 'grabbing'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Tooltip title="Kéo để thay đổi vị trí">
                          <Box 
                            className="column-drag-handle"
                            sx={{ 
                              opacity: 0.5, 
                              mr: 1, 
                              cursor: 'grab',
                              '&:hover': {
                                opacity: 1,
                                color: 'primary.main'
                              }
                            }}
                          >
                            <DragIndicatorIcon fontSize="small" />
                          </Box>
                        </Tooltip>
                        <TextField
                          value={column.label}
                          onChange={(e) => handleColumnChange(column.id, e.target.value)}
                          variant="standard"
                          sx={{ minWidth: 80, textAlign: 'center' }}
                          InputProps={{
                            disableUnderline: true,
                            style: { textAlign: 'center' }
                          }}
                          autoFocus={focusedColumn === column.id}
                          onFocus={() => setFocusedColumn(column.id)}
                          onBlur={() => setFocusedColumn(null)}
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => removeColumn(column.id)}
                          disabled={element.columns.length <= 1}
                          sx={{ ml: 0.5 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ width: 50 }}>
                    <IconButton size="small" onClick={addColumn}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {element.rows.map((row, index) => (
                  <TableRow 
                    key={row.id}
                    ref={el => rowsRef.current[index] = el}
                    draggable
                    onDragStart={(e) => handleRowDragStart(e, index)}
                    onDragOver={(e) => handleRowDragOver(e, index)}
                    onDragEnd={handleRowDragEnd}
                    onDrop={(e) => handleRowDrop(e, index)}
                    className="grid-row"
                    sx={{
                      opacity: draggingRowIndex === index ? 0.7 : 1,
                      bgcolor: dragOverRowIndex === index ? 'rgba(103, 58, 183, 0.05)' : 'inherit',
                      borderLeft: dragOverRowIndex === index ? '2px dashed #673ab7' : 'inherit',
                      '&:hover .row-drag-handle': {
                        opacity: 1
                      }
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title="Kéo để thay đổi vị trí">
                          <Box 
                            className="row-drag-handle"
                            sx={{ 
                              opacity: 0.5, 
                              mr: 1, 
                              cursor: 'grab',
                              '&:hover': {
                                opacity: 1,
                                color: 'primary.main'
                              } 
                            }}
                          >
                            <DragIndicatorIcon fontSize="small" />
                          </Box>
                        </Tooltip>
                        <TextField
                          value={row.label}
                          onChange={(e) => handleRowChange(row.id, e.target.value)}
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          autoFocus={focusedRow === row.id}
                          onFocus={() => setFocusedRow(row.id)}
                          onBlur={() => setFocusedRow(null)}
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => removeRow(row.id)}
                          disabled={element.rows.length <= 1}
                          sx={{ ml: 0.5 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    {element.columns.map((column) => (
                      <TableCell key={column.id} align="center">
                        <Radio disabled size="small" />
                      </TableCell>
                    ))}
                    <TableCell></TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={element.columns.length + 2}>
                    <Button 
                      startIcon={<AddIcon />} 
                      onClick={addRow}
                      sx={{ mt: 1 }}
                      size="small"
                    >
                      Thêm hàng
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          
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
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {element.columns.map((column) => (
                    <TableCell key={column.id} align="center">
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {element.rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.label}
                    </TableCell>
                    {element.columns.map((column) => (
                      <TableCell key={column.id} align="center">
                        <Radio disabled size="small" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default GridInput; 