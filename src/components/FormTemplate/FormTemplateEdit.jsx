import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  TextField,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import FormBuilder from '../FormBuilder/FormBuilder';
import FormPreview from '../FormBuilder/FormPreview';
import { useFormContext } from '../../contexts/FormContext';

// Danh sách các loại hồ sơ
const formTypes = [
  { id: 1, name: 'Học bổng tài năng' },
  { id: 2, name: 'Học bổng khó khăn' },
  { id: 3, name: 'Học bổng nghiên cứu' },
  { id: 4, name: 'Học bổng quốc tế' },
  { id: 5, name: 'Học bổng toàn phần' },
  { id: 6, name: 'Học bổng bán phần' },
];

// Dữ liệu mẫu cho các mẫu hồ sơ
const dummyTemplates = [
  { 
    id: 1, 
    name: 'Mẫu đơn học bổng sinh viên xuất sắc', 
    type: 'Học bổng tài năng', 
    steps: 3, 
    updatedAt: '2023-10-15', 
    status: 'active',
    formData: {
      0: {
        title: 'Thông tin cá nhân',
        description: 'Thông tin cơ bản về ứng viên',
        elements: [
          {
            id: 'e1',
            type: 'text',
            label: 'Họ và tên',
            required: true,
            placeholder: 'Nhập họ tên đầy đủ'
          },
          {
            id: 'e2',
            type: 'text',
            label: 'Mã số sinh viên',
            required: true,
            placeholder: 'Nhập mã số sinh viên'
          },
          {
            id: 'e3',
            type: 'date',
            label: 'Ngày sinh',
            required: true,
            description: 'Chọn ngày sinh của bạn'
          }
        ]
      },
      1: {
        title: 'Thông tin học tập',
        description: 'Kết quả học tập và thành tích',
        elements: [
          {
            id: 'e4',
            type: 'text',
            label: 'Điểm trung bình',
            required: true,
            placeholder: 'Ví dụ: 3.5/4.0'
          },
          {
            id: 'e5',
            type: 'paragraph',
            label: 'Thành tích nổi bật',
            required: false,
            placeholder: 'Liệt kê các thành tích học tập, nghiên cứu, hoạt động ngoại khóa...'
          }
        ]
      },
      2: {
        title: 'Tài liệu đính kèm',
        description: 'Các giấy tờ cần thiết',
        elements: [
          {
            id: 'e6',
            type: 'fileUpload',
            label: 'Bảng điểm',
            required: true,
            description: 'Tải lên bảng điểm có xác nhận của nhà trường',
            allowedTypes: ['application/pdf'],
            maxFiles: 1
          },
          {
            id: 'e7',
            type: 'fileUpload',
            label: 'Chứng chỉ, giấy khen (nếu có)',
            required: false,
            description: 'Tải lên các chứng chỉ, giấy khen hoặc minh chứng thành tích',
            allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
            maxFiles: 5
          }
        ]
      }
    }
  },
  { 
    id: 2, 
    name: 'Mẫu đơn xin hỗ trợ tài chính', 
    type: 'Học bổng khó khăn', 
    steps: 2, 
    updatedAt: '2023-10-12', 
    status: 'active',
    formData: {
      0: {
        title: 'Thông tin cá nhân',
        description: 'Thông tin cơ bản về ứng viên',
        elements: [
          {
            id: 'e1',
            type: 'text',
            label: 'Họ và tên',
            required: true,
            placeholder: 'Nhập họ tên đầy đủ'
          },
          {
            id: 'e2',
            type: 'text',
            label: 'Địa chỉ',
            required: true,
            placeholder: 'Nhập địa chỉ hiện tại'
          }
        ]
      },
      1: {
        title: 'Hoàn cảnh gia đình',
        description: 'Thông tin về hoàn cảnh gia đình',
        elements: [
          {
            id: 'e3',
            type: 'paragraph',
            label: 'Mô tả hoàn cảnh gia đình',
            required: true,
            placeholder: 'Mô tả chi tiết về hoàn cảnh gia đình của bạn'
          },
          {
            id: 'e4',
            type: 'fileUpload',
            label: 'Giấy xác nhận hoàn cảnh khó khăn',
            required: true,
            description: 'Tải lên giấy xác nhận hoàn cảnh khó khăn có xác nhận của địa phương',
            allowedTypes: ['application/pdf'],
            maxFiles: 1
          }
        ]
      }
    }
  },
];

const FormTemplateEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { formTitle, setFormTitle, formDescription, setFormDescription, formElements, setFormElements, resetForm } = useFormContext();
  
  // State cho mẫu hồ sơ
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState('');
  const [steps, setSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // State cho lưu trữ form elements của từng bước
  const [stepForms, setStepForms] = useState({});
  const [template, setTemplate] = useState(null);
  
  // Lấy thông tin mẫu hồ sơ khi component mount
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        // Giả lập việc lấy dữ liệu từ API
        setTimeout(() => {
          const template = dummyTemplates.find(t => t.id === parseInt(id));
          
          if (template) {
            setTemplate(template);
            setTemplateName(template.name);
            setTemplateType(formTypes.find(t => t.name === template.type)?.id || '');
            
            // Xử lý khi có dữ liệu form
            if (template.formData) {
              // Tạo bước từ formData
              const stepKeys = Object.keys(template.formData).map(Number);
              const newSteps = stepKeys.map(key => {
                const stepData = template.formData[key];
                return {
                  id: key + 1,
                  title: stepData.title,
                  description: stepData.description
                };
              });
              
              setSteps(newSteps);
              setStepForms(template.formData);
              
              // Load form của bước đầu tiên
              if (template.formData[0]) {
                setFormTitle(template.formData[0].title);
                setFormDescription(template.formData[0].description);
                setFormElements(template.formData[0].elements || []);
              }
            } else {
              // Nếu chưa có dữ liệu form, tạo các bước trống
              const newSteps = Array.from({ length: template.steps }, (_, index) => ({
                id: index + 1,
                title: index === 0 ? 'Thông tin cá nhân' : `Bước ${index + 1}`,
                description: index === 0 ? 'Nhập thông tin cá nhân của bạn' : 'Mô tả cho bước này'
              }));
              
              setSteps(newSteps);
              
              // Tạo stepForms trống
              const newStepForms = {};
              newSteps.forEach((step, index) => {
                newStepForms[index] = {
                  title: step.title,
                  description: step.description,
                  elements: []
                };
              });
              
              setStepForms(newStepForms);
              setFormTitle(newSteps[0].title);
              setFormDescription(newSteps[0].description);
              setFormElements([]);
            }
            
            setLoading(false);
          } else {
            alert('Không tìm thấy mẫu hồ sơ!');
            navigate('/scholarships');
          }
        }, 500);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        setLoading(false);
      }
    };
    
    resetForm();
    fetchTemplate();
    
    return () => {
      resetForm();
    };
  }, [id, navigate, resetForm, setFormElements, setFormTitle, setFormDescription]);
  
  // Lưu lại form elements khi thay đổi bước
  useEffect(() => {
    if (!loading) {
      // Lưu form elements của bước hiện tại
      setStepForms(prev => ({
        ...prev,
        [activeStep]: {
          title: formTitle,
          description: formDescription,
          elements: formElements
        }
      }));
    }
  }, [activeStep, formTitle, formDescription, formElements, loading]);
  
  // Xử lý khi thêm bước mới
  const handleAddStep = () => {
    const newStep = {
      id: steps.length + 1,
      title: `Bước ${steps.length + 1}`,
      description: 'Mô tả cho bước này'
    };
    setSteps([...steps, newStep]);
    
    // Khởi tạo form trống cho bước mới
    setStepForms(prev => ({
      ...prev,
      [steps.length]: { title: newStep.title, description: newStep.description, elements: [] }
    }));
  };
  
  // Xử lý khi xóa bước
  const handleDeleteStep = (stepIndex) => {
    const newSteps = steps.filter((_, index) => index !== stepIndex);
    setSteps(newSteps);
    
    // Cập nhật lại stepForms khi xóa bước
    const newStepForms = { ...stepForms };
    delete newStepForms[stepIndex];
    
    // Dịch chuyển các bước sau bước bị xóa
    for (let i = stepIndex + 1; i < steps.length; i++) {
      newStepForms[i-1] = newStepForms[i];
      delete newStepForms[i];
    }
    
    setStepForms(newStepForms);
    
    if (activeStep >= stepIndex && activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  
  // Xử lý khi cập nhật thông tin của bước
  const handleStepUpdate = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
    
    // Cập nhật title/description trong stepForms
    if (field === 'title' || field === 'description') {
      setStepForms(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          [field]: value
        }
      }));
      
      // Nếu đang ở bước đang chỉnh sửa, cập nhật formTitle/formDescription
      if (index === activeStep) {
        if (field === 'title') setFormTitle(value);
        if (field === 'description') setFormDescription(value);
      }
    }
  };
  
  // Xử lý khi thay đổi bước đang xem
  const handleStepChange = (index) => {
    // Lưu form hiện tại trước khi chuyển bước
    setStepForms(prev => ({
      ...prev,
      [activeStep]: {
        title: formTitle,
        description: formDescription,
        elements: formElements
      }
    }));
    
    // Chuyển sang bước mới
    setActiveStep(index);
    
    // Load form của bước mới
    if (stepForms[index]) {
      setFormTitle(stepForms[index].title || steps[index].title);
      setFormDescription(stepForms[index].description || steps[index].description);
      setFormElements(stepForms[index].elements || []);
    } else {
      setFormTitle(steps[index].title);
      setFormDescription(steps[index].description);
      setFormElements([]);
      
      // Khởi tạo form mới cho bước
      setStepForms(prev => ({
        ...prev,
        [index]: {
          title: steps[index].title,
          description: steps[index].description,
          elements: []
        }
      }));
    }
  };
  
  // Xử lý khi thay đổi tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Xử lý khi quay lại trang danh sách
  const handleBack = () => {
    navigate('/scholarships');
  };
  
  // Xử lý khi lưu mẫu hồ sơ
  const handleSave = () => {
    // Lưu form hiện tại
    setStepForms(prev => ({
      ...prev,
      [activeStep]: {
        title: formTitle,
        description: formDescription,
        elements: formElements
      }
    }));
    
    // TODO: Lưu mẫu hồ sơ vào database
    alert('Đã cập nhật mẫu hồ sơ thành công!');
    navigate('/scholarships');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600">
          Chỉnh sửa mẫu hồ sơ
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mr: 1, borderRadius: 2 }}
          >
            Quay lại
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />} 
            onClick={handleSave}
            sx={{ borderRadius: 2 }}
          >
            Lưu thay đổi
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Thông tin chung
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <TextField
              fullWidth
              label="Tên mẫu hồ sơ"
              variant="outlined"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              margin="normal"
              required
            />
            
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Loại hồ sơ</InputLabel>
              <Select
                value={templateType}
                label="Loại hồ sơ"
                onChange={(e) => setTemplateType(e.target.value)}
              >
                {formTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Các bước trong hồ sơ
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.id}>
                    <StepLabel
                      onClick={() => handleStepChange(index)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1" fontWeight={activeStep === index ? '600' : '400'}>
                          {step.title}
                        </Typography>
                        <Tooltip title="Xóa bước">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStep(index);
                            }}
                            sx={{ 
                              ml: 1,
                              visibility: steps.length > 1 ? 'visible' : 'hidden'
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </StepLabel>
                    <StepContent>
                      <TextField
                        fullWidth
                        label="Tiêu đề bước"
                        variant="outlined"
                        value={step.title}
                        onChange={(e) => handleStepUpdate(index, 'title', e.target.value)}
                        margin="normal"
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="Mô tả bước"
                        variant="outlined"
                        value={step.description}
                        onChange={(e) => handleStepUpdate(index, 'description', e.target.value)}
                        margin="normal"
                        size="small"
                        multiline
                        rows={2}
                      />
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddStep}
                fullWidth
                sx={{ mt: 2, borderRadius: 2 }}
              >
                Thêm bước mới
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{ px: 3, pt: 2 }}
              >
                <Tab label="Thiết kế" />
                <Tab label="Xem trước" />
              </Tabs>
            </Box>
            
            <Box sx={{ p: 3 }}>
              {tabValue === 0 ? (
                <>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {steps[activeStep]?.title || 'Thiết kế biểu mẫu'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {steps[activeStep]?.description || 'Thêm các thành phần vào biểu mẫu của bạn'}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <FormBuilder />
                  </Box>
                </>
              ) : (
                <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '60vh', borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="600" align="center" gutterBottom>
                    Xem trước bước: {steps[activeStep]?.title}
                  </Typography>
                  <FormPreview />
                </Box>
              )}
            </Box>
          </Paper>
          
          {/* Điều khiển chuyển giữa các bước */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={() => {
                // Lưu form hiện tại trước khi chuyển bước
                setStepForms(prev => ({
                  ...prev,
                  [activeStep]: {
                    title: formTitle,
                    description: formDescription,
                    elements: formElements
                  }
                }));
                setActiveStep(activeStep - 1);
              }}
              sx={{ borderRadius: 2 }}
            >
              Bước trước
            </Button>
            <Button
              variant="contained"
              disabled={activeStep === steps.length - 1}
              onClick={() => {
                // Lưu form hiện tại trước khi chuyển bước
                setStepForms(prev => ({
                  ...prev,
                  [activeStep]: {
                    title: formTitle,
                    description: formDescription,
                    elements: formElements
                  }
                }));
                setActiveStep(activeStep + 1);
              }}
              sx={{ borderRadius: 2 }}
            >
              Bước tiếp theo
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormTemplateEdit; 