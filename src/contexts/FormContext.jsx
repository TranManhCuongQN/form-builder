import { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FormContext = createContext(null);

export const useFormContext = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
  // Lưu trữ trạng thái chung của form
  const [formTitle, setFormTitle] = useState('Biểu mẫu không có tiêu đề');
  const [formDescription, setFormDescription] = useState('');
  const [formElements, setFormElements] = useState([]);
  const [activeElementId, setActiveElementId] = useState(null);

  // Hàm reset form về giá trị ban đầu
  const resetForm = useCallback(() => {
    setFormTitle('Biểu mẫu không có tiêu đề');
    setFormDescription('');
    setFormElements([]);
    setActiveElementId(null);
  }, []);

  // Thêm một element vào form
  const addElement = useCallback((type) => {
    const id = uuidv4();
    let element = { id, type, label: '', required: false };

    // Tùy chỉnh khởi tạo dựa trên loại element
    switch (type) {
      case 'text':
        element = { ...element, label: 'Câu hỏi văn bản', placeholder: '' };
        break;
      case 'paragraph':
        element = { ...element, label: 'Câu hỏi đoạn văn', placeholder: '' };
        break;
      case 'multipleChoice':
        element = {
          ...element,
          label: 'Câu hỏi trắc nghiệm',
          options: [
            { id: uuidv4(), value: 'Tùy chọn 1' },
            { id: uuidv4(), value: 'Tùy chọn 2' },
            { id: uuidv4(), value: 'Tùy chọn 3' },
          ],
        };
        break;
      case 'checkbox':
        element = {
          ...element,
          label: 'Câu hỏi hộp kiểm',
          options: [
            { id: uuidv4(), value: 'Tùy chọn 1' },
            { id: uuidv4(), value: 'Tùy chọn 2' },
            { id: uuidv4(), value: 'Tùy chọn 3' },
          ],
        };
        break;
      case 'dropdown':
        element = {
          ...element,
          label: 'Câu hỏi danh sách thả xuống',
          options: [
            { id: uuidv4(), value: 'Tùy chọn 1' },
            { id: uuidv4(), value: 'Tùy chọn 2' },
            { id: uuidv4(), value: 'Tùy chọn 3' },
          ],
        };
        break;
      case 'date':
        element = { ...element, label: 'Câu hỏi ngày tháng', description: '' };
        break;
      case 'time':
        element = { ...element, label: 'Câu hỏi thời gian', description: '' };
        break;
      case 'linearScale':
        element = {
          ...element,
          label: 'Câu hỏi thang điểm',
          description: '',
          startValue: 1,
          endValue: 5,
          startLabel: 'Kém',
          endLabel: 'Tuyệt vời',
        };
        break;
      case 'fileUpload':
        element = {
          ...element,
          label: 'Tải tệp lên',
          description: '',
          allowedTypes: ['*/*'],
          maxFiles: 1,
        };
        break;
      case 'section':
        element = {
          ...element,
          title: 'Tiêu đề phần',
          description: '',
          titleFormats: {},
          descriptionFormats: {},
          titleLinks: [],
          descriptionLinks: []
        };
        break;
      case 'grid':
        element = {
          ...element,
          label: 'Câu hỏi lưới',
          required: false,
          description: '',
          rows: [
            { id: crypto.randomUUID(), label: 'Hàng 1' },
            { id: crypto.randomUUID(), label: 'Hàng 2' }
          ],
          columns: [
            { id: crypto.randomUUID(), label: 'Cột 1' },
            { id: crypto.randomUUID(), label: 'Cột 2' },
            { id: crypto.randomUUID(), label: 'Cột 3' }
          ],
          labelFormats: {},
          links: []
        };
        break;
      default:
        break;
    }

    setFormElements((prevElements) => [...prevElements, element]);
    setActiveElementId(id);
  }, []);

  // Cập nhật một element trong form
  const updateElement = useCallback((id, updates) => {
    setFormElements((prevElements) => 
      prevElements.map((element) => 
        element.id === id ? { ...element, ...updates } : element
      )
    );
  }, []);

  // Xóa một element khỏi form
  const removeElement = useCallback((id) => {
    setFormElements((prevElements) => prevElements.filter((element) => element.id !== id));
    
    // Nếu element đang active bị xóa, set active về null
    setActiveElementId((prevId) => prevId === id ? null : prevId);
  }, []);

  // Sao chép một element
  const duplicateElement = useCallback((id) => {
    const elementToDuplicate = formElements.find((element) => element.id === id);
    if (!elementToDuplicate) return;

    // Tạo ID mới
    const newId = uuidv4();
    
    // Tạo bản sao với ID mới
    let duplicatedElement = { ...elementToDuplicate, id: newId };
    
    // Đảm bảo các options cũng được tạo mới ID
    if (duplicatedElement.options) {
      duplicatedElement.options = duplicatedElement.options.map(option => ({
        ...option,
        id: uuidv4()
      }));
    }
    
    // Đảm bảo các rows và columns trong grid cũng được tạo mới ID
    if (duplicatedElement.rows) {
      duplicatedElement.rows = duplicatedElement.rows.map(row => ({
        ...row,
        id: uuidv4()
      }));
    }
    
    if (duplicatedElement.columns) {
      duplicatedElement.columns = duplicatedElement.columns.map(column => ({
        ...column,
        id: uuidv4()
      }));
    }
    
    // Tùy chỉnh nhãn để biết đây là bản sao
    if (duplicatedElement.label) {
      duplicatedElement.label = `${duplicatedElement.label} (Bản sao)`;
    } else if (duplicatedElement.title) {
      duplicatedElement.title = `${duplicatedElement.title} (Bản sao)`;
    }
    
    // Thêm vào danh sách elements
    setFormElements((prevElements) => {
      // Tìm vị trí của element gốc
      const index = prevElements.findIndex((element) => element.id === id);
      
      // Chèn element mới ngay sau element gốc
      const newElements = [...prevElements];
      newElements.splice(index + 1, 0, duplicatedElement);
      
      return newElements;
    });
    
    // Đặt element mới làm active
    setActiveElementId(newId);
  }, [formElements]);

  // Thêm tùy chọn cho một element
  const addOption = useCallback((elementId) => {
    const optionId = uuidv4();
    
    setFormElements((prevElements) => 
      prevElements.map((element) => {
        if (element.id === elementId) {
          // Tính số thứ tự cho option mới
          const nextOptionNumber = element.options.length + 1;
          
          return {
            ...element,
            options: [
              ...element.options,
              { id: optionId, value: `Tùy chọn ${nextOptionNumber}` }
            ]
          };
        }
        return element;
      })
    );
    
    return optionId;
  }, []);

  // Xóa một tùy chọn khỏi element
  const removeOption = useCallback((elementId, optionId) => {
    setFormElements((prevElements) => 
      prevElements.map((element) => {
        if (element.id === elementId) {
          // Kiểm tra nếu chỉ còn 1 tùy chọn thì không cho xóa
          if (element.options.length <= 1) {
            return element;
          }
          
          return {
            ...element,
            options: element.options.filter(option => option.id !== optionId)
          };
        }
        return element;
      })
    );
  }, []);

  // Cập nhật một tùy chọn
  const updateOption = useCallback((elementId, optionId, value) => {
    setFormElements((prevElements) => 
      prevElements.map((element) => {
        if (element.id === elementId) {
          return {
            ...element,
            options: element.options.map(option => 
              option.id === optionId ? { ...option, value } : option
            )
          };
        }
        return element;
      })
    );
  }, []);

  // Sắp xếp lại các elements trong form
  const reorderElements = useCallback((fromIndex, toIndex) => {
    setFormElements((prevElements) => {
      const result = [...prevElements];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  }, []);

  // Sắp xếp lại options trong một element
  const reorderOptions = useCallback((elementId, fromIndex, toIndex) => {
    setFormElements((prevElements) => 
      prevElements.map((element) => {
        if (element.id === elementId) {
          const newOptions = [...element.options];
          const [removed] = newOptions.splice(fromIndex, 1);
          newOptions.splice(toIndex, 0, removed);
          
          return {
            ...element,
            options: newOptions
          };
        }
        return element;
      })
    );
  }, []);

  // Lấy dữ liệu form để gửi đi hoặc lưu trữ
  const getFormData = useCallback(() => {
    return {
      title: formTitle,
      description: formDescription,
      elements: formElements
    };
  }, [formTitle, formDescription, formElements]);

  // Tải dữ liệu form từ lưu trữ
  const loadFormData = useCallback((data) => {
    if (data.title) setFormTitle(data.title);
    if (data.description) setFormDescription(data.description);
    if (data.elements) setFormElements(data.elements);
  }, []);
  
  const value = {
    formTitle,
    setFormTitle,
    formDescription,
    setFormDescription,
    formElements,
    setFormElements,
    activeElementId,
    setActiveElementId,
    addElement,
    updateElement,
    removeElement,
    duplicateElement,
    addOption,
    removeOption,
    updateOption,
    reorderElements,
    reorderOptions,
    getFormData,
    loadFormData,
    resetForm
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}; 