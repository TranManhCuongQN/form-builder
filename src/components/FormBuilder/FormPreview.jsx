import { Paper, Typography, Box, Button, Divider, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useFormContext } from '../../contexts/FormContext';
import FormElement from '../FormElements/FormElement';

const FormPreview = () => {
  const { formTitle, formDescription, formElements } = useFormContext();

  return (
    <Box sx={{ width: '100%' }}>
      <Paper 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 1px 10px rgba(0, 0, 0, 0.05)',
          mb: 2
        }}
        elevation={0}
      >
        <Box>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              backgroundColor: 'primary.main', 
              color: 'white',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              borderBottom: '10px solid #7baaf7'
            }}
          >
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
              {formTitle || 'Biểu mẫu không có tiêu đề'}
            </Typography>
            {formDescription && (
              <Typography variant="body1">
                {formDescription}
              </Typography>
            )}
          </Paper>
        </Box>

        <Box sx={{ bgcolor: '#f8f9fa', p: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            * Biểu thị câu hỏi bắt buộc
          </Typography>
        </Box>

        {formElements.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary', p: 4, bgcolor: 'white' }}>
            <Typography variant="subtitle1" color="text.secondary">
              Không có câu hỏi nào trong biểu mẫu này
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Quay lại chế độ chỉnh sửa để thêm câu hỏi
            </Typography>
          </Box>
        ) : (
          <Box sx={{ bgcolor: 'white', px: 0 }}>
            <Stack spacing={0} divider={<Divider />}>
              {formElements.map((element) => (
                <Box key={element.id} sx={{ px: 3, py: 3 }}>
                  <FormElement 
                    element={element} 
                    isPreview={true} 
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        )}
        
        {formElements.length > 0 && (
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', bgcolor: 'white', borderTop: '1px solid #e0e0e0' }}>
            <Button 
              variant="contained" 
              color="primary"
              sx={{ borderRadius: 1, px: 3 }}
            >
              Gửi
            </Button>
            <Button variant="text" color="primary">
              Xóa mẫu
            </Button>
          </Box>
        )}
      </Paper>
      
      <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }} elevation={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Không bao giờ gửi mật khẩu qua Google Forms.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mẫu này được tạo bởi Form Builder
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default FormPreview; 