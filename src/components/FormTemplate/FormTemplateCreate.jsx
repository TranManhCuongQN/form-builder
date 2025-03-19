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
  CardActions,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
  Tabs,
  Tab,
  InputAdornment,
  Chip,
  Menu,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Container,
  Modal
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  ContentCopy as DuplicateIcon,
  Search as SearchIcon,
  Assignment as AssignmentIcon,
  Close as CloseIcon,
  Publish as PublishIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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
    status: 'active'
  },
  { 
    id: 2, 
    name: 'Mẫu đơn xin hỗ trợ tài chính', 
    type: 'Học bổng khó khăn', 
    steps: 2, 
    updatedAt: '2023-10-12', 
    status: 'active'
  },
  { 
    id: 3, 
    name: 'Đơn đăng ký học bổng nước ngoài', 
    type: 'Học bổng quốc tế', 
    steps: 4, 
    updatedAt: '2023-10-10', 
    status: 'draft'
  },
  { 
    id: 4, 
    name: 'Đơn xin học bổng nghiên cứu', 
    type: 'Học bổng nghiên cứu', 
    steps: 3, 
    updatedAt: '2023-10-05', 
    status: 'active'
  },
  { 
    id: 5, 
    name: 'Mẫu đơn học bổng toàn phần', 
    type: 'Học bổng toàn phần', 
    steps: 5, 
    updatedAt: '2023-10-02', 
    status: 'inactive'
  },
];

const FormTemplateCreate = () => {
  const navigate = useNavigate();
  const { 
    formTitle, 
    setFormTitle, 
    formDescription, 
    setFormDescription, 
    formElements,
    setFormElements,
    resetForm 
  } = useFormContext();
  
  // State cho mẫu hồ sơ
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState('');
  const [steps, setSteps] = useState([
    { id: 1, title: 'Thông tin cá nhân', description: 'Nhập thông tin cá nhân của bạn' }
  ]);
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  
  // State cho lưu trữ form elements của từng bước
  const [stepForms, setStepForms] = useState({
    0: { title: '', description: '', elements: [] }
  });
  
  // State cho danh sách mẫu hồ sơ
  const [templates, setTemplates] = useState(dummyTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // State cho chức năng xem trước
  const [openPreview, setOpenPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewStepIndex, setPreviewStepIndex] = useState(0);
  
  // State cho chế độ edit
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Lưu lại form elements khi thay đổi bước
  useEffect(() => {
    // Chỉ lưu khi hiển thị form tạo mẫu và có sự thay đổi dữ liệu
    if (showCreateForm && activeStep >= 0 && steps.length > 0) {
      const currentFormData = {
        title: formTitle,
        description: formDescription,
        elements: formElements
      };
      
      // Chỉ cập nhật khi có thay đổi để tránh render loop
      const existingData = stepForms[activeStep] || {};
      const hasChanges = 
        existingData.title !== currentFormData.title || 
        existingData.description !== currentFormData.description || 
        JSON.stringify(existingData.elements) !== JSON.stringify(currentFormData.elements);
      
      if (hasChanges) {
        setStepForms(prev => ({
          ...prev,
          [activeStep]: currentFormData
        }));
      }
    }
  }, [showCreateForm, activeStep, formTitle, formDescription, formElements, stepForms]);
  
  // Load form elements khi chuyển bước hoặc khi steps thay đổi
  useEffect(() => {
    // Chỉ tải khi hiển thị form tạo mẫu và có ít nhất 1 bước
    if (showCreateForm && activeStep >= 0 && steps.length > 0) {
      const stepForm = stepForms[activeStep];
      
      // Nếu đã có dữ liệu cho bước này
      if (stepForm) {
        // Chỉ cập nhật state khi có thay đổi
        if (stepForm.title !== formTitle) {
          setFormTitle(stepForm.title || steps[activeStep]?.title || '');
        }
        if (stepForm.description !== formDescription) {
          setFormDescription(stepForm.description || steps[activeStep]?.description || '');
        }
        // So sánh elements để tránh cập nhật không cần thiết
        if (JSON.stringify(stepForm.elements) !== JSON.stringify(formElements)) {
          setFormElements(stepForm.elements || []);
        }
      } else {
        // Nếu chưa có dữ liệu, khởi tạo từ thông tin bước
        if (steps[activeStep]) {
          setFormTitle(steps[activeStep].title || '');
          setFormDescription(steps[activeStep].description || '');
          setFormElements([]);
          
          // Khởi tạo form mới cho bước
          setStepForms(prev => ({
            ...prev,
            [activeStep]: {
              title: steps[activeStep].title || '',
              description: steps[activeStep].description || '',
              elements: []
            }
          }));
        }
      }
    }
  }, [showCreateForm, activeStep, steps]);
  
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
    // Lưu dữ liệu bước hiện tại trước khi xóa
    setStepForms(prev => ({
      ...prev,
      [activeStep]: {
        title: formTitle,
        description: formDescription,
        elements: formElements
      }
    }));

    // Tạo một bản sao của các bước
    const newSteps = steps.filter((_, index) => index !== stepIndex);
    setSteps(newSteps);
    
    // Tạo một bản sao của stepForms và xóa bước cần xóa
    const newStepForms = { ...stepForms };
    delete newStepForms[stepIndex];
    
    // Dịch chuyển các bước sau bước bị xóa
    const updatedStepForms = {};
    Object.keys(newStepForms).forEach(key => {
      const numKey = parseInt(key);
      if (numKey < stepIndex) {
        // Giữ nguyên các bước trước bước bị xóa
        updatedStepForms[numKey] = newStepForms[numKey];
      } else if (numKey > stepIndex) {
        // Dịch chuyển các bước sau bước bị xóa lên một vị trí
        updatedStepForms[numKey - 1] = newStepForms[numKey];
      }
    });
    
    setStepForms(updatedStepForms);
    
    // Điều chỉnh activeStep nếu cần
    if (activeStep >= stepIndex && activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
    
    // Cập nhật trạng thái form để hiển thị dữ liệu của bước mới
    if (newSteps.length > 0) {
      const newActiveStep = activeStep >= stepIndex && activeStep > 0 ? activeStep - 1 : activeStep;
      if (updatedStepForms[newActiveStep]) {
        const currentStepForm = updatedStepForms[newActiveStep];
        setFormTitle(currentStepForm.title || '');
        setFormDescription(currentStepForm.description || '');
        setFormElements(currentStepForm.elements || []);
      } else {
        // Nếu không có dữ liệu, hiển thị form trống
        setFormTitle(newSteps[newActiveStep]?.title || '');
        setFormDescription(newSteps[newActiveStep]?.description || '');
        setFormElements([]);
      }
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
    // Lưu form hiện tại trước khi chuyển bước (chỉ khi có sự thay đổi)
    const currentFormData = {
      title: formTitle,
      description: formDescription,
      elements: formElements
    };
    
    const existingData = stepForms[activeStep] || {};
    const hasChanges = 
      existingData.title !== currentFormData.title || 
      existingData.description !== currentFormData.description || 
      JSON.stringify(existingData.elements) !== JSON.stringify(currentFormData.elements);
    
    if (hasChanges) {
      setStepForms(prev => ({
        ...prev,
        [activeStep]: currentFormData
      }));
    }
    
    // Chuyển sang bước mới
    setActiveStep(index);
    
    // Tải dữ liệu của bước mới
    if (stepForms[index]) {
      const nextStepData = stepForms[index];
      setFormTitle(nextStepData.title || steps[index]?.title || '');
      setFormDescription(nextStepData.description || steps[index]?.description || '');
      setFormElements(nextStepData.elements || []);
    } else {
      // Nếu bước chưa có dữ liệu, khởi tạo từ thông tin bước
      setFormTitle(steps[index]?.title || '');
      setFormDescription(steps[index]?.description || '');
      setFormElements([]);
      
      // Khởi tạo form mới cho bước
      setStepForms(prev => ({
        ...prev,
        [index]: {
          title: steps[index]?.title || '',
          description: steps[index]?.description || '',
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
    if (showCreateForm) {
      setShowCreateForm(false);
      setIsEditMode(false);
      resetForm();
    } else {
      navigate('/');
    }
  };
  
  // Xử lý khi lưu mẫu hồ sơ
  const handleSave = (publishImmediately = false) => {
    // Lưu form hiện tại
    setStepForms(prev => ({
      ...prev,
      [activeStep]: {
        title: formTitle,
        description: formDescription,
        elements: formElements
      }
    }));
    
    if (isEditMode && selectedTemplate) {
      // Cập nhật một mẫu hồ sơ hiện có
      const updatedTemplates = templates.map(template => 
        template.id === selectedTemplate.id 
          ? {
              ...template,
              name: templateName,
              type: formTypes.find(t => t.id === templateType)?.name || 'Không xác định',
              steps: steps.length,
              updatedAt: new Date().toISOString().split('T')[0],
              status: publishImmediately ? 'active' : template.status,
              formData: stepForms
            }
          : template
      );
      setTemplates(updatedTemplates);
      alert(publishImmediately 
        ? 'Đã cập nhật và xuất bản mẫu hồ sơ thành công!' 
        : 'Đã cập nhật mẫu hồ sơ thành công!');
    } else {
      // Tạo một mẫu hồ sơ mới
      const newTemplate = {
        id: Math.max(...templates.map(t => t.id)) + 1,
        name: templateName,
        type: formTypes.find(t => t.id === templateType)?.name || 'Không xác định',
        steps: steps.length,
        updatedAt: new Date().toISOString().split('T')[0],
        status: publishImmediately ? 'active' : 'draft',
        formData: stepForms // Lưu dữ liệu form của tất cả các bước
      };
      
      // Thêm mẫu mới vào danh sách
      setTemplates([...templates, newTemplate]);
      alert(publishImmediately 
        ? 'Đã lưu và xuất bản mẫu hồ sơ mới thành công!' 
        : 'Đã lưu mẫu hồ sơ mới thành công!');
    }
    
    // Reset form và quay lại danh sách
    setTemplateName('');
    setTemplateType('');
    setSteps([{ id: 1, title: 'Thông tin cá nhân', description: 'Nhập thông tin cá nhân của bạn' }]);
    setActiveStep(0);
    resetForm();
    setStepForms({
      0: { title: 'Thông tin cá nhân', description: 'Nhập thông tin cá nhân của bạn', elements: [] }
    });
    setShowCreateForm(false);
    setIsEditMode(false);
    setSelectedTemplate(null);
  };
  
  // Hàm xuất bản ngay lập tức
  const handleSaveAndPublish = () => {
    handleSave(true);
  };
  
  // Xử lý khi nhấn nút publish
  const handlePublish = (template = null) => {
    const targetTemplate = template || selectedTemplate;
    if (targetTemplate) {
      // Cập nhật trạng thái thành 'active'
      const updatedTemplates = templates.map(t => 
        t.id === targetTemplate.id 
          ? {
              ...t,
              status: 'active',
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : t
      );
      
      // Lưu danh sách đã cập nhật
      setTemplates(updatedTemplates);
      
      // Nếu đang xử lý selectedTemplate, cập nhật nó để phản ánh thay đổi
      if (selectedTemplate && targetTemplate.id === selectedTemplate.id) {
        setSelectedTemplate({
          ...selectedTemplate,
          status: 'active',
          updatedAt: new Date().toISOString().split('T')[0]
        });
      }
      
      alert(`Đã xuất bản mẫu "${targetTemplate.name}" thành công!`);
      
      // Nếu đang trong modal xem trước, cập nhật previewTemplate
      if (previewTemplate && targetTemplate.id === previewTemplate.id) {
        setPreviewTemplate({
          ...previewTemplate,
          status: 'active',
          updatedAt: new Date().toISOString().split('T')[0]
        });
      }
    }
    
    // Chỉ đóng menu nếu không có template truyền vào và menu đang mở
    if (!template && Boolean(anchorEl)) {
      handleCloseMenu();
    }

    return updatedTemplates; // Trả về danh sách đã cập nhật để hàm gọi có thể sử dụng
  };
  
  // Thêm chức năng thu hồi (unpublish)
  const handleUnpublish = (template = null) => {
    const targetTemplate = template || selectedTemplate;
    if (targetTemplate) {
      // Cập nhật trạng thái thành 'draft'
      const updatedTemplates = templates.map(t => 
        t.id === targetTemplate.id 
          ? {
              ...t,
              status: 'draft',
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : t
      );
      
      // Lưu danh sách đã cập nhật
      setTemplates(updatedTemplates);
      
      // Nếu đang xử lý selectedTemplate, cập nhật nó để phản ánh thay đổi
      if (selectedTemplate && targetTemplate.id === selectedTemplate.id) {
        setSelectedTemplate({
          ...selectedTemplate,
          status: 'draft',
          updatedAt: new Date().toISOString().split('T')[0]
        });
      }
      
      alert(`Đã thu hồi mẫu "${targetTemplate.name}" thành công! Giờ đây bạn có thể chỉnh sửa.`);
      
      // Nếu đang trong modal xem trước, cập nhật previewTemplate
      if (previewTemplate && targetTemplate.id === previewTemplate.id) {
        setPreviewTemplate({
          ...previewTemplate,
          status: 'draft',
          updatedAt: new Date().toISOString().split('T')[0]
        });
      }
    }
    
    // Chỉ đóng menu nếu không có template truyền vào và menu đang mở
    if (!template && Boolean(anchorEl)) {
      handleCloseMenu();
    }

    return updatedTemplates; // Trả về danh sách đã cập nhật để hàm gọi có thể sử dụng
  };
  
  // Xử lý khi nhấn nút tạo mới
  const handleAddNew = () => {
    resetForm();
    setTemplateName('');
    setTemplateType('');
    setSteps([{ id: 1, title: 'Thông tin cá nhân', description: 'Nhập thông tin cá nhân của bạn' }]);
    setActiveStep(0);
    setStepForms({
      0: { title: 'Thông tin cá nhân', description: 'Nhập thông tin cá nhân của bạn', elements: [] }
    });
    setShowCreateForm(true);
    setIsEditMode(false);
    setSelectedTemplate(null);
  };
  
  // Xử lý khi mở menu actions
  const handleOpenMenu = (event, template) => {
    setAnchorEl(event.currentTarget);
    // Tạo bản sao sâu của template để tránh tham chiếu
    setSelectedTemplate(JSON.parse(JSON.stringify(template)));
  };
  
  // Xử lý khi đóng menu actions
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  // Xử lý khi nhấn nút chỉnh sửa từ danh sách
  const handleEdit = (template) => {
    if (!template && selectedTemplate) {
      template = selectedTemplate;
      handleCloseMenu();
    }
    
    if (template) {
      resetForm();
      setIsEditMode(true);
      setSelectedTemplate(template);
      
      // Lấy thông tin từ mẫu hồ sơ đã chọn
      setTemplateName(template.name);
      setTemplateType(formTypes.find(t => t.name === template.type)?.id || '');
      
      // Nếu đã có dữ liệu form
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
        setActiveStep(0);
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
        setActiveStep(0);
        setFormTitle(newSteps[0].title);
        setFormDescription(newSteps[0].description);
        setFormElements([]);
      }
      
      setShowCreateForm(true);
      setTabValue(0); // Chuyển về tab thiết kế
    }
  };
  
  // Xử lý khi nhấn nút xóa
  const handleDelete = () => {
    if (selectedTemplate) {
      if (window.confirm(`Bạn có chắc chắn muốn xóa mẫu "${selectedTemplate.name}"?`)) {
        setTemplates(templates.filter(template => template.id !== selectedTemplate.id));
      }
    }
    handleCloseMenu();
  };
  
  // Xử lý khi nhấn nút nhân bản
  const handleDuplicate = () => {
    if (selectedTemplate) {
      const newTemplate = {
        ...selectedTemplate,
        id: Math.max(...templates.map(t => t.id)) + 1,
        name: `${selectedTemplate.name} (Bản sao)`,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setTemplates([...templates, newTemplate]);
    }
    handleCloseMenu();
  };
  
  // Xử lý khi mở chế độ xem trước
  const handleOpenPreview = (template) => {
    if (!template && selectedTemplate) {
      template = selectedTemplate;
      handleCloseMenu();
    }
    
    if (template) {
      setPreviewTemplate(template);
      setPreviewStepIndex(0);
      setOpenPreview(true);
    }
  };
  
  // Xử lý khi đóng chế độ xem trước
  const handleClosePreview = () => {
    setOpenPreview(false);
    setPreviewTemplate(null);
    setPreviewStepIndex(0);
  };
  
  // Lọc mẫu đơn theo từ khóa tìm kiếm
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Lấy màu cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { bg: 'success.main', text: 'white', bgLight: 'success.lighter', icon: <PublishIcon fontSize="small" sx={{ mr: 0.5 }} /> };
      case 'draft': return { bg: 'warning.main', text: 'white', bgLight: 'warning.lighter', icon: <EditIcon fontSize="small" sx={{ mr: 0.5 }} /> };
      case 'inactive': return { bg: 'error.main', text: 'white', bgLight: 'error.lighter', icon: <CloseIcon fontSize="small" sx={{ mr: 0.5 }} /> };
      default: return { bg: 'grey.500', text: 'white', bgLight: 'grey.200', icon: null };
    }
  };
  
  // Lấy tên hiển thị cho trạng thái
  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Đang hoạt động';
      case 'draft': return 'Bản nháp';
      case 'inactive': return 'Không hoạt động';
      default: return 'Không xác định';
    }
  };

  // Hàm chuyển về bước trước
  const handlePreviousStep = () => {
    if (activeStep > 0) {
      // Lưu dữ liệu bước hiện tại
      setStepForms(prev => ({
        ...prev,
        [activeStep]: {
          title: formTitle,
          description: formDescription,
          elements: formElements
        }
      }));
      
      // Giảm activeStep
      const prevStep = activeStep - 1;
      setActiveStep(prevStep);
      
      // Tải dữ liệu của bước trước
      const prevStepData = stepForms[prevStep];
      if (prevStepData) {
        setFormTitle(prevStepData.title || steps[prevStep]?.title || '');
        setFormDescription(prevStepData.description || steps[prevStep]?.description || '');
        setFormElements(prevStepData.elements || []);
      }
    }
  };
  
  // Hàm chuyển đến bước tiếp theo
  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      // Lưu dữ liệu bước hiện tại
      setStepForms(prev => ({
        ...prev,
        [activeStep]: {
          title: formTitle,
          description: formDescription,
          elements: formElements
        }
      }));
      
      // Tăng activeStep
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      
      // Tải dữ liệu của bước tiếp theo
      const nextStepData = stepForms[nextStep];
      if (nextStepData) {
        setFormTitle(nextStepData.title || steps[nextStep]?.title || '');
        setFormDescription(nextStepData.description || steps[nextStep]?.description || '');
        setFormElements(nextStepData.elements || []);
      } else {
        // Nếu bước chưa có dữ liệu, khởi tạo từ thông tin bước
        setFormTitle(steps[nextStep]?.title || '');
        setFormDescription(steps[nextStep]?.description || '');
        setFormElements([]);
      }
    }
  };

  // Hàm để kiểm tra xem mẫu có ở trạng thái nháp không
  const isDraftTemplate = (template) => template.status === 'draft';
  
  // Hàm để kiểm tra xem mẫu có đang hoạt động không
  const isActiveTemplate = (template) => template.status === 'active';

  // Hiển thị danh sách mẫu hồ sơ nếu không ở chế độ tạo mới
  if (!showCreateForm) {
    return (
      <Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h4" fontWeight="600">
            Quản lý mẫu hồ sơ
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{ borderRadius: 2 }}
          >
            Tạo mẫu mới
          </Button>
        </Box>
        
        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm mẫu hồ sơ..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: 'background.paper' }}
          />
        </Paper>
        
        <Grid container spacing={3}>
          {filteredTemplates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                overflow: 'hidden', 
                position: 'relative',
                border: '1px solid',
                borderColor: template.status === 'draft' ? 'warning.lighter' : 
                             template.status === 'active' ? 'success.lighter' : 
                             template.status === 'inactive' ? 'error.lighter' : 'grey.200',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  backgroundColor: template.status === 'draft' ? 'warning.main' : 
                                   template.status === 'active' ? 'success.main' : 
                                   template.status === 'inactive' ? 'error.main' : 'grey.500',
                },
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1, pb: 1, pt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip 
                      label={getStatusLabel(template.status)} 
                      size="small"
                      icon={getStatusColor(template.status).icon}
                      sx={{ 
                        bgcolor: getStatusColor(template.status).bgLight, 
                        color: getStatusColor(template.status).bg,
                        fontWeight: 500,
                        '& .MuiChip-icon': {
                          color: getStatusColor(template.status).bg
                        }
                      }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleOpenMenu(e, template)}
                      aria-label="more"
                      sx={{
                        border: '1px solid',
                        borderColor: 'grey.300',
                        '&:hover': {
                          backgroundColor: 'grey.100'
                        }
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="h6" component="h2" fontWeight="600" sx={{ mb: 2, color: 'text.primary' }}>
                    {template.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Loại: <Typography component="span" fontWeight="500" color="text.primary">{template.type}</Typography>
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'primary.main' }}>
                    <AssignmentIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" fontWeight="500">
                      {template.steps} bước
                    </Typography>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Cập nhật: {template.updatedAt}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5, bgcolor: 'grey.50' }}>
                  <Box>
                    <Button 
                      size="small" 
                      variant="text"
                      startIcon={<EditIcon fontSize="small" />}
                      onClick={() => handleEdit(template)}
                      sx={{ 
                        mr: 1, 
                        borderRadius: '8px',
                        color: 'info.main',
                        '&:hover': {
                          backgroundColor: 'info.lighter',
                        }
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button 
                      size="small" 
                      variant="text"
                      startIcon={<VisibilityIcon fontSize="small" />}
                      onClick={() => handleOpenPreview(template)}
                      sx={{ 
                        borderRadius: '8px',
                        color: 'text.primary',
                        '&:hover': {
                          backgroundColor: 'grey.100',
                        }
                      }}
                    >
                      Xem
                    </Button>
                  </Box>
                  <Box>
                    {isDraftTemplate(template) ? (
                      <Tooltip title="Xuất bản mẫu này để người dùng có thể sử dụng">
                        <Button 
                          variant="text"
                          size="small" 
                          startIcon={<PublishIcon fontSize="small" />}
                          onClick={() => {
                            // Clone template để tránh tham chiếu đến đối tượng ban đầu
                            const templateToPublish = JSON.parse(JSON.stringify(template));
                            handlePublish(templateToPublish);
                            // Buộc render lại danh sách
                            setTemplates([...templates]);
                          }}
                          color="primary"
                          sx={{ 
                            borderRadius: '8px',
                            px: 2,
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: 'primary.lighter',
                            }
                          }}
                        >
                          Xuất bản
                        </Button>
                      </Tooltip>
                    ) : isActiveTemplate(template) && (
                      <Tooltip title="Thu hồi mẫu này để chỉnh sửa">
                        <Button 
                          variant="text"
                          size="small" 
                          startIcon={<ArrowBackIcon fontSize="small" />}
                          onClick={() => {
                            // Clone template để tránh tham chiếu đến đối tượng ban đầu
                            const templateToUnpublish = JSON.parse(JSON.stringify(template));
                            handleUnpublish(templateToUnpublish);
                            // Buộc render lại danh sách
                            setTemplates([...templates]);
                          }}
                          color="warning"
                          sx={{ 
                            borderRadius: '8px',
                            px: 2,
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: 'warning.lighter',
                            }
                          }}
                        >
                          Thu hồi
                        </Button>
                      </Tooltip>
                    )}
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Menu cho từng mẫu đơn */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{
            elevation: 3,
            sx: {
              filter: 'drop-shadow(0px 4px 15px rgba(0,0,0,0.15))',
              width: 215,
              overflow: 'visible',
              mt: 1.5,
              borderRadius: '12px',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
              '& .MuiMenuItem-root': {
                padding: '10px 16px',
                borderRadius: '8px',
                margin: '4px 8px',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '& .MuiListItemIcon-root': {
                  minWidth: '36px',
                }
              },
              '& .MuiDivider-root': {
                margin: '8px',
              }
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" sx={{ fontSize: '13px', color: 'text.secondary', mb: 0.5 }}>
              Tùy chọn
            </Typography>
          </Box>
          <MenuItem onClick={() => handleEdit(selectedTemplate)}>
            <ListItemIcon>
              <EditIcon fontSize="small" color="info" />
            </ListItemIcon>
            Chỉnh sửa
          </MenuItem>
          <MenuItem onClick={() => handleOpenPreview(selectedTemplate)}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" color="info" />
            </ListItemIcon>
            Xem trước
          </MenuItem>
          {selectedTemplate && isDraftTemplate(selectedTemplate) && (
            <MenuItem 
              onClick={() => {
                // Clone template để tránh tham chiếu đến đối tượng ban đầu
                const templateToPublish = JSON.parse(JSON.stringify(selectedTemplate));
                handlePublish(templateToPublish);
                // Buộc render lại danh sách
                setTemplates([...templates]);
                handleCloseMenu();
              }}
              sx={{
                color: 'primary.main',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'primary.lighter',
                }
              }}
            >
              <ListItemIcon>
                <PublishIcon fontSize="small" color="primary" />
              </ListItemIcon>
              Xuất bản mẫu
            </MenuItem>
          )}
          {selectedTemplate && isActiveTemplate(selectedTemplate) && (
            <MenuItem 
              onClick={() => {
                // Clone template để tránh tham chiếu đến đối tượng ban đầu
                const templateToUnpublish = JSON.parse(JSON.stringify(selectedTemplate));
                handleUnpublish(templateToUnpublish);
                // Buộc render lại danh sách
                setTemplates([...templates]);
                handleCloseMenu();
              }}
              sx={{
                color: 'warning.main',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'warning.lighter',
                }
              }}
            >
              <ListItemIcon>
                <ArrowBackIcon fontSize="small" color="warning" />
              </ListItemIcon>
              Thu hồi mẫu
            </MenuItem>
          )}
          <MenuItem onClick={handleDuplicate}>
            <ListItemIcon>
              <DuplicateIcon fontSize="small" color="action" />
            </ListItemIcon>
            Nhân bản
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={handleDelete} 
            sx={{ 
              color: 'error.main',
              '&:hover': {
                bgcolor: 'error.lighter',
              }
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            Xóa mẫu
          </MenuItem>
        </Menu>
        
        {/* Dialog xem trước mẫu hồ sơ */}
        <Dialog
          open={openPreview}
          onClose={handleClosePreview}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Xem trước: {previewTemplate?.name}</Typography>
              <IconButton onClick={handleClosePreview} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {previewTemplate && previewTemplate.formData && (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    Bước {previewStepIndex + 1}: {
                      previewTemplate.formData[previewStepIndex]?.title || 
                      `Bước ${previewStepIndex + 1}`
                    }
                  </Typography>
                  <Divider />
                </Box>
                
                <FormPreviewRenderer 
                  formData={previewTemplate.formData[previewStepIndex]} 
                />
              </>
            )}
            
            {(!previewTemplate?.formData || Object.keys(previewTemplate.formData).length === 0) && (
              <Box sx={{ 
                p: 4, 
                textAlign: 'center', 
                bgcolor: 'background.default',
                borderRadius: 2
              }}>
                <Typography variant="body1" color="text.secondary">
                  Không có dữ liệu form để hiển thị. Vui lòng hoàn thiện mẫu hồ sơ này.
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', p: 1 }}>
              <Button 
                variant="outlined"
                onClick={() => setPreviewStepIndex(prev => Math.max(0, prev - 1))}
                disabled={previewStepIndex === 0}
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  borderRadius: '8px', 
                  px: 2,
                  color: previewStepIndex === 0 ? 'text.disabled' : 'text.primary'
                }}
              >
                Bước trước
              </Button>
              <Box>
                {previewTemplate && isDraftTemplate(previewTemplate) && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PublishIcon />}
                    onClick={() => {
                      // Clone template để tránh tham chiếu đến đối tượng ban đầu
                      const templateToPublish = JSON.parse(JSON.stringify(previewTemplate));
                      handlePublish(templateToPublish);
                      // Buộc render lại preview template
                      setPreviewTemplate({...previewTemplate, status: 'active'});
                    }}
                    sx={{ 
                      mr: 1,
                      borderRadius: '8px',
                      px: 2,
                      boxShadow: '0 2px 10px rgba(103, 58, 183, 0.2)',
                      '&:hover': {
                        boxShadow: '0 4px 15px rgba(103, 58, 183, 0.3)'
                      }
                    }}
                  >
                    Xuất bản
                  </Button>
                )}
                {previewTemplate && isActiveTemplate(previewTemplate) && (
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => {
                      // Clone template để tránh tham chiếu đến đối tượng ban đầu
                      const templateToUnpublish = JSON.parse(JSON.stringify(previewTemplate));
                      handleUnpublish(templateToUnpublish);
                      // Buộc render lại preview template
                      setPreviewTemplate({...previewTemplate, status: 'draft'});
                    }}
                    sx={{ 
                      mr: 1,
                      borderRadius: '8px',
                      px: 2,
                      borderColor: 'warning.main',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'warning.lighter',
                        borderColor: 'warning.dark',
                      }
                    }}
                  >
                    Thu hồi
                  </Button>
                )}
                <Button
                  variant="outlined"
                  onClick={() => handleEdit(previewTemplate)}
                  startIcon={<EditIcon />}
                  sx={{ 
                    borderRadius: '8px', 
                    px: 2,
                    color: 'info.main',
                    borderColor: 'info.main',
                    '&:hover': {
                      backgroundColor: 'info.lighter',
                      borderColor: 'info.dark',
                    }
                  }}
                >
                  Chỉnh sửa
                </Button>
              </Box>
              <Button 
                variant="contained"
                onClick={() => {
                  if (previewTemplate && previewTemplate.formData) {
                    const maxStepIndex = Object.keys(previewTemplate.formData).length - 1;
                    setPreviewStepIndex(prev => Math.min(maxStepIndex, prev + 1));
                  }
                }}
                disabled={
                  !previewTemplate?.formData || 
                  previewStepIndex >= Object.keys(previewTemplate.formData).length - 1
                }
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  borderRadius: '8px', 
                  px: 2,
                  opacity: (!previewTemplate?.formData || previewStepIndex >= Object.keys(previewTemplate.formData).length - 1) ? 0.7 : 1
                }}
              >
                Bước tiếp theo
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // Hiển thị form tạo mẫu mới
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600">
          {isEditMode ? 'Chỉnh sửa mẫu hồ sơ' : 'Tạo mẫu hồ sơ mới'}
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mr: 1, borderRadius: '8px', fontWeight: 500 }}
          >
            Quay lại
          </Button>
          {isEditMode && selectedTemplate ? (
            <>
              {isDraftTemplate(selectedTemplate) ? (
                <Button 
                  variant="contained" 
                  startIcon={<PublishIcon />} 
                  onClick={() => {
                    // Lưu và xuất bản
                    handleSave(true);
                  }}
                  color="primary"
                  sx={{ 
                    mr: 1, 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 10px rgba(103, 58, 183, 0.2)',
                    '&:hover': {
                      boxShadow: '0 4px 15px rgba(103, 58, 183, 0.3)'
                    }
                  }}
                >
                  Lưu & Xuất bản
                </Button>
              ) : isActiveTemplate(selectedTemplate) && (
                <Button 
                  variant="contained" 
                  startIcon={<ArrowBackIcon />} 
                  onClick={() => {
                    // Lưu và thu hồi về bản nháp
                    handleSave();
                    const template = JSON.parse(JSON.stringify(selectedTemplate));
                    template.status = 'draft';
                    handleUnpublish(template);
                  }}
                  color="warning"
                  sx={{ 
                    mr: 1, 
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(237, 108, 2, 0.2)',
                    '&:hover': {
                      boxShadow: '0 4px 15px rgba(237, 108, 2, 0.3)'
                    }
                  }}
                >
                  Lưu & Thu hồi
                </Button>
              )}
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />} 
                onClick={() => handleSave()}
                sx={{ 
                  borderRadius: '8px',
                  bgcolor: 'info.main',
                  '&:hover': {
                    bgcolor: 'info.dark',
                  }
                }}
              >
                Cập nhật
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="contained" 
                startIcon={<PublishIcon />} 
                onClick={handleSaveAndPublish}
                color="primary"
                sx={{ 
                  mr: 1, 
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(103, 58, 183, 0.2)',
                  '&:hover': {
                    boxShadow: '0 4px 15px rgba(103, 58, 183, 0.3)'
                  }
                }}
              >
                Xuất bản ngay
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<SaveIcon />} 
                onClick={() => handleSave()}
                sx={{ 
                  borderRadius: '8px',
                  borderColor: 'info.main',
                  color: 'info.main',
                  '&:hover': {
                    backgroundColor: 'info.lighter',
                    borderColor: 'info.dark',
                  }
                }}
              >
                Lưu bản nháp
              </Button>
            </>
          )}
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
              onClick={handlePreviousStep}
              sx={{ borderRadius: 2 }}
            >
              Bước trước
            </Button>
            <Button
              variant="contained"
              disabled={activeStep === steps.length - 1}
              onClick={handleNextStep}
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

// Component riêng để hiển thị form xem trước
const FormPreviewRenderer = ({ formData }) => {
  const { setFormTitle, setFormDescription, setFormElements } = useFormContext();
  
  useEffect(() => {
    if (formData) {
      setFormTitle(formData.title || '');
      setFormDescription(formData.description || '');
      setFormElements(formData.elements || []);
      
      // Cleanup khi unmount
      return () => {
        setFormTitle('');
        setFormDescription('');
        setFormElements([]);
      };
    }
  }, [formData, setFormTitle, setFormDescription, setFormElements]);
  
  return <FormPreview />;
};

export default FormTemplateCreate; 