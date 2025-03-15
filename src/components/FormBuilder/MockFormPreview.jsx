import { Paper, Typography, Box, Divider, TextField, FormControlLabel, Radio, RadioGroup } from '@mui/material';

const MockFormPreview = () => {
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
              p: { xs: 2, sm: 3 }, 
              backgroundColor: 'primary.main', 
              color: 'white',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              borderBottom: '10px solid #7baaf7'
            }}
          >
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 500, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
              Đơn xin học bổng
            </Typography>
            <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              Vui lòng điền đầy đủ thông tin dưới đây
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ bgcolor: '#f8f9fa', p: { xs: 2, sm: 3 } }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            * Biểu thị câu hỏi bắt buộc
          </Typography>
        </Box>

        <Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Họ và tên<span style={{ color: '#d93025', marginLeft: '4px' }}> *</span>
          </Typography>
          <TextField
            value="Nguyễn Văn A"
            fullWidth
            disabled
            size="small"
            sx={{ maxWidth: '100%' }}
          />
        </Box>

        <Divider />

        <Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Mã số sinh viên<span style={{ color: '#d93025', marginLeft: '4px' }}> *</span>
          </Typography>
          <TextField
            value="SV001"
            fullWidth
            disabled
            size="small"
            sx={{ maxWidth: { xs: '100%', sm: 300 } }}
          />
        </Box>

        <Divider />

        <Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Lý do xin học bổng<span style={{ color: '#d93025', marginLeft: '4px' }}> *</span>
          </Typography>
          <TextField
            value="Em rất mong muốn được nhận học bổng này để tiếp tục theo đuổi việc học tập. Em đã đạt được nhiều thành tích trong học kỳ vừa qua như điểm GPA cao và tham gia các hoạt động ngoại khóa."
            fullWidth
            multiline
            rows={4}
            disabled
            sx={{ maxWidth: '100%' }}
          />
        </Box>

        <Divider />

        <Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Bạn đã từng nhận học bổng trước đây chưa?<span style={{ color: '#d93025', marginLeft: '4px' }}> *</span>
          </Typography>
          <RadioGroup defaultValue="Đã từng 1 lần">
            <FormControlLabel value="Chưa từng" control={<Radio disabled />} label="Chưa từng" />
            <FormControlLabel value="Đã từng 1 lần" control={<Radio disabled />} label="Đã từng 1 lần" />
            <FormControlLabel value="Đã từng nhiều lần" control={<Radio disabled />} label="Đã từng nhiều lần" />
          </RadioGroup>
        </Box>

        <Divider />

        <Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Ngày nộp hồ sơ<span style={{ color: '#d93025', marginLeft: '4px' }}> *</span>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ngày chính thức nộp hồ sơ xin học bổng
          </Typography>
          <TextField
            type="date"
            value="2025-03-15"
            fullWidth
            disabled
            size="small"
            sx={{ maxWidth: { xs: '100%', sm: 300 } }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default MockFormPreview; 