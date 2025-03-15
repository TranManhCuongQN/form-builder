/**
 * Trả về màu dựa trên trạng thái
 * @param {string} status - Chuỗi trạng thái ('active', 'inactive', 'pending', 'approved', 'rejected', 'banned')
 * @returns {string} - Tên màu tương ứng trong MUI
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'active':
    case 'approved':
      return 'success';
    case 'inactive':
    case 'pending':
      return 'warning';
    case 'rejected':
    case 'banned':
      return 'error';
    default:
      return 'default';
  }
};

/**
 * Trả về nhãn tiếng Việt cho trạng thái
 * @param {string} status - Chuỗi trạng thái
 * @returns {string} - Nhãn tiếng Việt
 */
export const getStatusLabel = (status) => {
  switch (status) {
    case 'active':
      return 'Hoạt động';
    case 'inactive':
      return 'Không hoạt động';
    case 'pending':
      return 'Đang xử lý';
    case 'approved':
      return 'Đã duyệt';
    case 'rejected':
      return 'Từ chối';
    case 'banned':
      return 'Đã khóa';
    default:
      return 'Không xác định';
  }
};

/**
 * Lấy chữ cái đầu của tên
 * @param {string} name - Họ và tên
 * @returns {string} - Các chữ cái đầu (tối đa 2 ký tự)
 */
export const getInitials = (name) => {
  if (!name) return 'N/A';
  
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Định dạng ngày tháng an toàn
 * @param {string|Date} date - Ngày cần định dạng
 * @param {string} format - Chuỗi định dạng
 * @param {Object} options - Tùy chọn bổ sung
 * @returns {string} - Chuỗi ngày đã định dạng
 */
export const formatDate = (date, format = 'DD/MM/YYYY', options = {}) => {
  if (!date) return 'N/A';
  
  try {
    const dayjs = require('dayjs');
    const d = dayjs(date);
    if (!d.isValid()) return 'N/A';
    
    return d.format(format);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};

/**
 * Kiểm tra ngày hợp lệ
 * @param {string|Date} date - Ngày cần kiểm tra
 * @returns {boolean} - True nếu hợp lệ
 */
export const isValidDate = (date) => {
  if (!date) return false;
  
  try {
    const dayjs = require('dayjs');
    return dayjs(date).isValid();
  } catch (error) {
    return false;
  }
}; 