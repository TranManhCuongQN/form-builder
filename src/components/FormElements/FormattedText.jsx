import React from 'react';
import { Typography, Link as MuiLink } from '@mui/material';

const FormattedText = ({ text, formats, links = [], variant = 'body1', ...props }) => {
  if (!text) return null;
  
  // Nếu không có định dạng và không có liên kết, hiển thị text thông thường
  if ((!formats || Object.keys(formats).length === 0) && (!links || links.length === 0)) {
    return (
      <Typography variant={variant} {...props}>
        {text}
      </Typography>
    );
  }
  
  // Xử lý định dạng văn bản và liên kết
  const getFormattedContent = () => {
    // Lấy style dựa trên định dạng
    const basicStyle = getTextStyle(formats);

    // Kiểm tra nếu có liên kết
    if (links && links.length > 0) {
      try {
        // Sắp xếp liên kết theo vị trí bắt đầu (từ lớn đến nhỏ để tránh vấn đề vị trí)
        const sortedLinks = [...links].sort((a, b) => b.position - a.position);
        
        // Tách văn bản thành các phần với liên kết
        let resultText = text;
        let segments = [];
        
        // Thay thế từng liên kết trong văn bản, bắt đầu từ phải sang trái
        sortedLinks.forEach((link, index) => {
          if (!link.position || !link.text || link.position < 0 || link.position >= resultText.length) {
            return;
          }
          
          const before = resultText.substring(0, link.position);
          const after = resultText.substring(link.position + link.text.length);
          
          // Tạo mảng segments mới
          segments = [
            ...segments,
            { type: 'link', content: link.text, url: link.url, key: `link-${index}` }
          ];
          
          // Cập nhật văn bản còn lại
          resultText = before + "\u0000".repeat(link.text.length) + after;
        });
        
        // Xử lý các phần văn bản còn lại (không phải liên kết)
        let textParts = [];
        let currentText = '';
        let linkIndex = 0;
        
        for (let i = 0; i < resultText.length; i++) {
          if (resultText[i] === '\u0000') {
            if (currentText) {
              textParts.push({ 
                type: 'text', 
                content: currentText, 
                key: `text-${textParts.length}` 
              });
              currentText = '';
            }
            
            // Bỏ qua các ký tự null liên tiếp (là phần của cùng một liên kết)
            while (i < resultText.length && resultText[i] === '\u0000') {
              i++;
            }
            
            // Đã đến cuối liên kết, thêm liên kết vào kết quả
            if (segments[linkIndex]) {
              textParts.push(segments[linkIndex]);
              linkIndex++;
            }
            
            // Xử lý ký tự hiện tại nếu không phải null
            if (i < resultText.length && resultText[i] !== '\u0000') {
              currentText = resultText[i];
            } else {
              i--; // Giảm i vì vòng lặp sẽ tăng i lên 1
            }
          } else {
            currentText += resultText[i];
          }
        }
        
        // Thêm phần văn bản cuối cùng nếu có
        if (currentText) {
          textParts.push({ 
            type: 'text', 
            content: currentText, 
            key: `text-${textParts.length}` 
          });
        }
        
        // Sắp xếp lại textParts theo thứ tự ban đầu
        textParts.sort((a, b) => {
          const aMatch = a.key.match(/^(text|link)-(\d+)$/);
          const bMatch = b.key.match(/^(text|link)-(\d+)$/);
          if (aMatch && bMatch) {
            return parseInt(aMatch[2]) - parseInt(bMatch[2]);
          }
          return 0;
        });
        
        // Render các phần
        return textParts.map(segment => {
          if (segment.type === 'link') {
            // Áp dụng cả định dạng và kiểu liên kết
            return (
              <MuiLink 
                key={segment.key}
                href={segment.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(segment.url, '_blank', 'noopener,noreferrer');
                  return false;
                }}
                sx={{ 
                  ...basicStyle,
                  display: 'inline',
                  textDecoration: 'underline',
                  color: '#1a73e8',
                  cursor: 'pointer',
                  fontWeight: formats?.bold ? 'bold' : 'inherit',
                  fontStyle: formats?.italic ? 'italic' : 'normal',
                  '&:hover': {
                    color: '#1558b3',
                    textDecoration: 'underline',
                  }
                }}
              >
                {segment.content}
              </MuiLink>
            );
          } else {
            return (
              <span key={segment.key} style={basicStyle}>
                {segment.content}
              </span>
            );
          }
        });
      } catch (error) {
        console.error("Lỗi xử lý liên kết:", error, links);
        // Fallback - hiển thị văn bản thô và liên kết riêng biệt
        return (
          <>
            <span style={basicStyle}>{text}</span>
            {links.map((link, index) => (
              <div key={`fallback-link-${index}`}>
                <MuiLink 
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    color: '#1a73e8',
                    display: 'block',
                    marginTop: '4px',
                    fontSize: '0.9em'
                  }}
                >
                  {link.text || link.url}
                </MuiLink>
              </div>
            ))}
          </>
        );
      }
    } else {
      // Nếu không có liên kết, chỉ áp dụng định dạng
      return <span style={basicStyle}>{text}</span>;
    }
  };
  
  // Hàm lấy style dựa trên định dạng
  const getTextStyle = (formats) => {
    if (!formats) return {};
    
    const style = {};
    
    if (formats.bold) {
      style.fontWeight = 'bold';
    }
    
    if (formats.italic) {
      style.fontStyle = 'italic';
    }
    
    if (formats.underline) {
      style.textDecoration = 'underline';
    }
    
    return style;
  };
  
  return (
    <Typography component="div" variant={variant} {...props}>
      {getFormattedContent()}
    </Typography>
  );
};

export default FormattedText; 