import { Box, IconButton, Tooltip, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { useState } from 'react';

const TextFormatToolbar = ({ onFormat, activeFormats = {}, onAddLink = () => {} }) => {
  const { bold = false, italic = false, underline = false } = activeFormats;
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const handleOpenLinkDialog = () => {
    setLinkDialogOpen(true);
    // Khởi tạo giá trị mặc định cho text
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setLinkText(selection.toString());
    } else {
      setLinkText('');
    }
  };

  const handleCloseLinkDialog = () => {
    setLinkDialogOpen(false);
    setLinkUrl('');
    setLinkText('');
  };

  const handleAddLink = () => {
    if (linkUrl) {
      onAddLink({
        url: linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`,
        text: linkText || linkUrl
      });
      handleCloseLinkDialog();
    }
  };

  return (
    <>
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 0.5, 
          mb: 1, 
          p: 0.5,
          borderRadius: 1,
          bgcolor: 'rgba(0, 0, 0, 0.03)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Tooltip title="Đậm">
          <IconButton 
            size="small" 
            onClick={() => onFormat('bold')}
            color={bold ? 'primary' : 'default'}
            sx={{ 
              borderRadius: '4px',
              bgcolor: bold ? 'rgba(103, 58, 183, 0.08)' : 'transparent',
              '&:hover': {
                bgcolor: bold ? 'rgba(103, 58, 183, 0.15)' : 'rgba(0, 0, 0, 0.08)'
              }
            }}
          >
            <FormatBoldIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Nghiêng">
          <IconButton 
            size="small" 
            onClick={() => onFormat('italic')}
            color={italic ? 'primary' : 'default'}
            sx={{ 
              borderRadius: '4px',
              bgcolor: italic ? 'rgba(103, 58, 183, 0.08)' : 'transparent',
              '&:hover': {
                bgcolor: italic ? 'rgba(103, 58, 183, 0.15)' : 'rgba(0, 0, 0, 0.08)'
              }
            }}
          >
            <FormatItalicIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Gạch chân">
          <IconButton 
            size="small" 
            onClick={() => onFormat('underline')}
            color={underline ? 'primary' : 'default'}
            sx={{ 
              borderRadius: '4px',
              bgcolor: underline ? 'rgba(103, 58, 183, 0.08)' : 'transparent',
              '&:hover': {
                bgcolor: underline ? 'rgba(103, 58, 183, 0.15)' : 'rgba(0, 0, 0, 0.08)'
              }
            }}
          >
            <FormatUnderlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        <Tooltip title="Chèn liên kết">
          <IconButton 
            size="small" 
            onClick={handleOpenLinkDialog}
            sx={{ 
              borderRadius: '4px',
            }}
          >
            <InsertLinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Dialog open={linkDialogOpen} onClose={handleCloseLinkDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Chèn liên kết</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Đường dẫn liên kết"
            type="url"
            fullWidth
            variant="outlined"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            sx={{ mb: 2 }}
            helperText="Liên kết sẽ tự động được mở trong tab mới khi click"
          />
          <TextField
            margin="dense"
            label="Văn bản hiển thị (tùy chọn)"
            type="text"
            fullWidth
            variant="outlined"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Văn bản hiển thị cho liên kết"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLinkDialog}>Hủy</Button>
          <Button 
            onClick={handleAddLink} 
            variant="contained" 
            disabled={!linkUrl}
            sx={{ 
              bgcolor: '#1a73e8',
              '&:hover': {
                bgcolor: '#1558b3' 
              }
            }}
          >
            Chèn liên kết
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TextFormatToolbar; 