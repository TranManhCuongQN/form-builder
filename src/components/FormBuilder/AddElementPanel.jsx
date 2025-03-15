import { Box, Paper, Button, Typography, Divider, Grid, Tooltip, IconButton } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotesIcon from '@mui/icons-material/Notes';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import InsertPageBreakIcon from '@mui/icons-material/InsertPageBreak';
import { useFormContext } from '../../contexts/FormContext';

const AddElementPanel = () => {
  const { addElement } = useFormContext();

  const elements = [
    {
      type: 'text',
      icon: <TextFieldsIcon />,
      label: 'Văn bản ngắn',
      description: 'Câu trả lời ngắn một dòng',
    },
    {
      type: 'paragraph',
      icon: <NotesIcon />,
      label: 'Đoạn văn',
      description: 'Câu trả lời dài nhiều dòng',
    },
    {
      type: 'multipleChoice',
      icon: <RadioButtonCheckedIcon />,
      label: 'Trắc nghiệm',
      description: 'Chọn một trong nhiều tùy chọn',
    },
    {
      type: 'checkbox',
      icon: <CheckBoxIcon />,
      label: 'Hộp kiểm',
      description: 'Chọn nhiều tùy chọn',
    },
    {
      type: 'dropdown',
      icon: <ArrowDropDownCircleIcon />,
      label: 'Danh sách thả xuống',
      description: 'Chọn từ menu thả xuống',
    },
    {
      type: 'date',
      icon: <CalendarTodayIcon />,
      label: 'Ngày tháng',
      description: 'Chọn ngày từ lịch',
    },
    {
      type: 'time',
      icon: <AccessTimeIcon />,
      label: 'Thời gian',
      description: 'Chọn giờ từ đồng hồ',
    },
    {
      type: 'linearScale',
      icon: <LinearScaleIcon />,
      label: 'Thang điểm',
      description: 'Thang điểm đánh giá từ 1-5',
    },
    {
      type: 'grid',
      icon: <ViewWeekIcon />,
      label: 'Lưới',
      description: 'Các câu hỏi dạng bảng/ma trận',
    },
    {
      type: 'fileUpload',
      icon: <CloudUploadIcon />,
      label: 'Tải tệp lên',
      description: 'Cho phép tải lên tệp đính kèm',
    },
    {
      type: 'section',
      icon: <InsertPageBreakIcon />,
      label: 'Tiêu đề phần',
      description: 'Phân chia biểu mẫu thành các phần',
    },
  ];

  const handleAddElement = (type) => {
    addElement(type);
  };

  return (
    <Paper 
      sx={{ 
        p: 1.5, 
        borderRadius: 2,
        boxShadow: '0 1px 10px rgba(0, 0, 0, 0.05)'
      }}
      elevation={0}
    >
      <Box sx={{ p: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1, color: 'text.primary' }}>
          Thêm câu hỏi
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {elements.map((element) => (
            <Grid item xs={12} md={6} lg={4} key={element.type}>
              <Button
                fullWidth
                variant="text"
                onClick={() => handleAddElement(element.type)}
                sx={{ 
                  py: 1.5,
                  px: 2,
                  height: '100%',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  color: 'text.primary',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'primary.main',
                    mr: 2
                  }}>
                    {element.icon}
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                      {element.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {element.description}
                    </Typography>
                  </Box>
                </Box>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default AddElementPanel; 