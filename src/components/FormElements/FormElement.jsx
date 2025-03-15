import { Box, IconButton, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useFormContext } from '../../contexts/FormContext';
import TextInput from './TextInput';
import MultipleChoice from './MultipleChoice';
import CheckboxInput from './CheckboxInput';
import DropdownInput from './DropdownInput';
import DateInput from './DateInput';
import ParagraphInput from './ParagraphInput';
import LinearScaleInput from './LinearScaleInput';
import FileUploadInput from './FileUploadInput';
import TimeInput from './TimeInput';
import SectionHeader from './SectionHeader';
import GridInput from './GridInput';

const FormElement = ({ element, isPreview = false, isDragging = false }) => {
  const { removeElement, setActiveElementId, activeElementId, duplicateElement } = useFormContext();
  const isActive = activeElementId === element.id;

  const handleElementClick = () => {
    if (!isPreview && !isDragging) {
      setActiveElementId(element.id);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    removeElement(element.id);
  };

  const handleDuplicateClick = (e) => {
    e.stopPropagation();
    duplicateElement(element.id);
  };

  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return <TextInput element={element} isPreview={isPreview} />;
      case 'multipleChoice':
        return <MultipleChoice element={element} isPreview={isPreview} />;
      case 'checkbox':
        return <CheckboxInput element={element} isPreview={isPreview} />;
      case 'dropdown':
        return <DropdownInput element={element} isPreview={isPreview} />;
      case 'date':
        return <DateInput element={element} isPreview={isPreview} />;
      case 'paragraph':
        return <ParagraphInput element={element} isPreview={isPreview} />;
      case 'linearScale':
        return <LinearScaleInput element={element} isPreview={isPreview} />;
      case 'fileUpload':
        return <FileUploadInput element={element} isPreview={isPreview} />;
      case 'time':
        return <TimeInput element={element} isPreview={isPreview} />;
      case 'section':
        return <SectionHeader element={element} isPreview={isPreview} />;
      case 'grid':
        return <GridInput element={element} isPreview={isPreview} />;
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="body1">Loại câu hỏi không được hỗ trợ: {element.type}</Typography>
          </Box>
        );
    }
  };

  const showControls = true;

  if (isPreview) {
    return renderElement();
  }

  return (
    <Paper
      elevation={0}
      onClick={handleElementClick}
      className="form-element-card"
      sx={{ 
        position: 'relative', 
        cursor: isDragging ? 'grabbing' : 'pointer',
        borderRadius: 2,
        border: isActive ? '2px solid #673ab7' : '1px solid #e0e0e0',
        boxShadow: isActive 
          ? '0 4px 8px rgba(103, 58, 183, 0.2)' 
          : isDragging 
            ? '0 6px 12px rgba(0, 0, 0, 0.15)' 
            : '0 1px 2px rgba(0, 0, 0, 0.05)',
        backgroundColor: isActive ? 'rgba(103, 58, 183, 0.02)' : 'white',
        width: '100%',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
      }}
    >
      {isActive && !isPreview && showControls && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12, 
            zIndex: 5,
            display: 'flex',
            gap: 1,
          }}
        >
          <IconButton 
            size="small" 
            onClick={handleDuplicateClick}
            title="Sao chép"
            sx={{ 
              bgcolor: 'white',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(103, 58, 183, 0.1)',
                color: 'primary.main'
              }
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={handleDeleteClick}
            title="Xóa"
            sx={{ 
              bgcolor: 'white',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(255, 77, 79, 0.1)',
                color: 'error.main'
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      
      {isDragging && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: '#673ab7',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            zIndex: 3
          }}
        />
      )}
      
      <Box className="form-element-content">
        {renderElement()}
      </Box>
    </Paper>
  );
};

export default FormElement; 