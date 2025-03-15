import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Tabs, 
  Tab, 
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  Menu,
  MenuItem,
  ListItem,
  ListItemIcon,
  ListItemText,
  List,
  ListItemAvatar,
  CardHeader,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  FilterList as FilterIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  CalendarMonth as CalendarMonthIcon,
  NotificationsActive as NotificationsActiveIcon,
  ArrowForward as ArrowForwardIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateCalendar, PickersDay } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { getStatusColor, getStatusLabel, formatDate, isValidDate } from '../../utils/helpers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import vi from 'date-fns/locale/vi';
import { format, isSameDay, isPast, isToday, addDays } from 'date-fns';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

// Dữ liệu mẫu cho sự kiện - Di chuyển ra ngoài component để tránh tạo lại mỗi lần render
const upcomingEvents = [
  { id: 1, title: 'Hạn chót nộp học bổng', date: '2023-09-30', type: 'deadline', description: 'Hạn chót để nộp học bổng XYZ' },
  { id: 2, title: 'Phỏng vấn ứng viên', date: '2023-09-25', type: 'interview', description: 'Phỏng vấn cho đợt học bổng ABC' },
  { id: 3, title: 'Hội thảo trực tuyến', date: '2023-09-28', type: 'webinar', description: 'Hội thảo giới thiệu về cơ hội học bổng' },
  { id: 4, title: 'Khai giảng khóa học', date: '2023-10-05', type: 'event', description: 'Lễ khai giảng khóa học mới' },
  { id: 5, title: 'Đóng đơn ứng tuyển', date: '2023-10-10', type: 'deadline', description: 'Hạn cuối đóng đơn ứng tuyển học bổng DEF' },
  { id: 6, title: 'Đào tạo nhân viên mới', date: '2023-09-27', type: 'training', description: 'Chương trình đào tạo nhân viên quản lý học bổng' },
  { id: 7, title: 'Gặp gỡ đối tác', date: addDays(new Date(), 1).toISOString().split('T')[0], type: 'meeting', description: 'Gặp gỡ đối tác cung cấp học bổng mới' },
  { id: 8, title: 'Công bố kết quả', date: addDays(new Date(), 2).toISOString().split('T')[0], type: 'announcement', description: 'Công bố kết quả đợt xét học bổng tháng 9' },
];

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [filterEl, setFilterEl] = useState(null);
  const [actionsEl, setActionsEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [viewMode, setViewMode] = useState('upcoming'); // 'upcoming' or 'selected'
  
  // Cập nhật sự kiện khi ngày thay đổi
  useEffect(() => {
    if (viewMode === 'selected') {
      // Lọc sự kiện của ngày đã chọn
      const eventsOnSelectedDay = upcomingEvents.filter(event => 
        format(new Date(event.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      );
      setFilteredEvents(eventsOnSelectedDay);
    } else {
      // Sắp xếp sự kiện sắp tới theo thời gian
      const upcoming = [...upcomingEvents]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .filter(event => new Date(event.date) >= new Date())
        .slice(0, 4);
      setFilteredEvents(upcoming);
    }
  }, [selectedDate, viewMode]); // Loại bỏ upcomingEvents khỏi dependencies
  
  // Hàm thay đổi ngày
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setViewMode('selected');
  };
  
  // Hàm chuyển về chế độ hiển thị sự kiện sắp tới
  const handleViewAllEvents = () => {
    setViewMode('upcoming');
  };
  
  // Hàm xử lý khi thay đổi tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Hàm mở/đóng filter
  const toggleFilter = () => {
    setFilterEl(filterEl ? null : document.getElementById('filter-button'));
  };
  
  // Hàm xử lý mở menu hành động
  const handleActionsClick = (event, item) => {
    setActionsEl(event.currentTarget);
    setSelectedItem(item);
  };
  
  // Hàm đóng menu hành động
  const handleActionsClose = () => {
    setActionsEl(null);
    setSelectedItem(null);
  };
  
  // Dữ liệu mẫu
  const recentSubmissions = [
    { id: 1, name: 'Nguyễn Văn A', title: 'Học bổng tài năng', date: '2023-03-20', status: 'pending' },
    { id: 2, name: 'Trần Thị B', title: 'Học bổng xuất sắc', date: '2023-03-19', status: 'approved' },
    { id: 3, name: 'Phạm Văn C', title: 'Học bổng vượt khó', date: '2023-03-18', status: 'rejected' },
    { id: 4, name: 'Lê Thị D', title: 'Học bổng tài năng', date: '2023-03-17', status: 'pending' },
    { id: 5, name: 'Hoàng Văn E', title: 'Học bổng xuất sắc', date: '2023-03-16', status: 'approved' },
  ];
  
  const upcomingDeadlines = [
    { id: 1, title: 'Học bổng tài năng', deadline: '2023-03-25', applications: 45 },
    { id: 2, title: 'Học bổng xuất sắc', deadline: '2023-03-28', applications: 32 },
    { id: 3, title: 'Học bổng vượt khó', deadline: '2023-04-05', applications: 28 },
  ];
  
  // Dữ liệu mẫu cho thống kê
  const stats = [
    { icon: <SchoolIcon fontSize="large" />, title: 'Học bổng', count: 24, color: 'primary.main', bg: 'primary.lighter' },
    { icon: <GroupIcon fontSize="large" />, title: 'Người dùng', count: 867, color: 'success.main', bg: 'success.lighter' },
    { icon: <AssignmentIcon fontSize="large" />, title: 'Hồ sơ', count: 128, color: 'info.main', bg: 'info.lighter' },
    { icon: <EventIcon fontSize="large" />, title: 'Sự kiện', count: 12, color: 'warning.main', bg: 'warning.lighter' },
  ];
  
  // Dữ liệu mẫu cho thông báo mới nhất
  const latestNotifications = [
    { 
      id: 1, 
      message: 'Học bổng mới vừa được thêm vào hệ thống', 
      time: '10 phút trước',
      type: 'new'
    },
    { 
      id: 2, 
      message: 'Đã cập nhật hạn nộp của học bổng nghiên cứu', 
      time: '2 giờ trước',
      type: 'update'
    },
    { 
      id: 3, 
      message: 'Hồ sơ của bạn đã được phê duyệt', 
      time: '1 ngày trước',
      type: 'approval'
    },
  ];
  
  // Hàm lấy màu chip dựa trên loại sự kiện
  const getEventChipColor = (type) => {
    switch (type) {
      case 'interview': return { bg: 'primary.main', text: 'white' };
      case 'deadline': return { bg: 'error.main', text: 'white' };
      case 'workshop': return { bg: 'info.main', text: 'white' };
      case 'announcement': return { bg: 'success.main', text: 'white' };
      default: return { bg: 'grey.500', text: 'white' };
    }
  };
  
  // Hàm lấy label cho loại sự kiện
  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'interview': return 'Phỏng vấn';
      case 'deadline': return 'Hạn chót';
      case 'workshop': return 'Hội thảo';
      case 'announcement': return 'Thông báo';
      default: return 'Sự kiện';
    }
  };
  
  // Dữ liệu biểu đồ
  const applicationStatusData = [
    { name: 'Chờ duyệt', value: 35, color: theme.palette.warning.main },
    { name: 'Đã duyệt', value: 45, color: theme.palette.success.main },
    { name: 'Từ chối', value: 20, color: theme.palette.error.main },
  ];

  const scholarshipTrendData = [
    { name: 'T1', active: 8, new: 3 },
    { name: 'T2', active: 10, new: 5 },
    { name: 'T3', active: 15, new: 7 },
    { name: 'T4', active: 14, new: 4 },
    { name: 'T5', active: 18, new: 6 },
    { name: 'T6', active: 20, new: 8 },
    { name: 'T7', active: 22, new: 10 },
    { name: 'T8', active: 24, new: 9 },
    { name: 'T9', active: 26, new: 12 },
    { name: 'T10', active: 28, new: 14 },
    { name: 'T11', active: 30, new: 15 },
    { name: 'T12', active: 32, new: 18 },
  ];

  const applicationsByScholarshipData = [
    { name: 'Học bổng tài năng', applications: 45 },
    { name: 'Học bổng xuất sắc', applications: 32 },
    { name: 'Học bổng vượt khó', applications: 28 },
    { name: 'Học bổng nghiên cứu', applications: 20 },
    { name: 'Học bổng quốc tế', applications: 15 },
  ];

  const userActivityData = [
    { name: 'T1', applications: 20, reviews: 10 },
    { name: 'T2', applications: 25, reviews: 15 },
    { name: 'T3', applications: 30, reviews: 20 },
    { name: 'T4', applications: 28, reviews: 22 },
    { name: 'T5', applications: 35, reviews: 25 },
    { name: 'T6', applications: 40, reviews: 30 },
  ];
  
  // Tùy chỉnh PickersDay để hiển thị dấu hiệu rõ ràng hơn cho ngày có sự kiện
  const CustomPickersDay = (props) => {
    const { day, outsideCurrentMonth, selectedDay, ...other } = props;
    const hasEvent = upcomingEvents.some(event => 
      isSameDay(new Date(event.date), day)
    );
    const isSelected = selectedDay && isSameDay(day, selectedDay);

    return (
      <Box sx={{ position: 'relative' }}>
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
          selected={isSelected}
          sx={{
            position: 'relative',
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'white',
            },
          }}
        />
        {hasEvent && !outsideCurrentMonth && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 2,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: isSelected ? 'white' : 'primary.main',
            }}
          />
        )}
      </Box>
    );
  };

  // Format locale cho lịch
  const localeText = {
    calendarWeekDays: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  };
  
  // Hàm lấy màu cho từng loại sự kiện
  const getEventColor = (type) => {
    switch (type) {
      case 'deadline':
        return theme.palette.error.main;
      case 'interview':
        return theme.palette.success.main;
      case 'webinar':
        return theme.palette.info.main;
      case 'meeting':
        return theme.palette.warning.main;
      case 'training':
        return theme.palette.secondary.main;
      case 'announcement':
        return theme.palette.primary.main;
      default:
        return theme.palette.grey[500];
    }
  };

  // Hàm lấy tên hiển thị cho từng loại sự kiện
  const getEventTypeName = (type) => {
    switch (type) {
      case 'deadline':
        return 'Hạn chót';
      case 'interview':
        return 'Phỏng vấn';
      case 'webinar':
        return 'Hội thảo';
      case 'event':
        return 'Sự kiện';
      case 'meeting':
        return 'Cuộc họp';
      case 'training':
        return 'Đào tạo';
      case 'announcement':
        return 'Thông báo';
      default:
        return 'Khác';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Trang chủ
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Chào mừng đến với Hệ thống Quản lý Học bổng
        </Typography>
      </Box>
      
      {/* Thống kê */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 2, md: 3 }, 
                borderRadius: 3, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'flex-start',
                height: '100%',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: stat.bg, 
                  color: stat.color,
                  width: { xs: 40, md: 48 }, 
                  height: { xs: 40, md: 48 },
                  mb: 2
                }}
              >
                {stat.icon}
              </Avatar>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                {stat.count}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {/* Biểu đồ thống kê */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        {/* Biểu đồ tròn trạng thái hồ sơ */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                  <PieChartIcon />
                </Avatar>
              }
              title={
                <Typography variant="h6" fontWeight={600}>Trạng thái hồ sơ</Typography>
              }
            />
            <Divider />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: { xs: 2, md: 3 } }}>
              <Box sx={{ height: { xs: 200, sm: 250 }, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={applicationStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {applicationStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} hồ sơ`, 'Số lượng']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                {applicationStatusData.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mx: 1, mb: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: item.color,
                        mr: 1
                      }}
                    />
                    <Typography variant="caption">{item.name}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Biểu đồ số lượng học bổng theo thời gian */}
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'info.lighter', color: 'info.main' }}>
                  <BarChartIcon />
                </Avatar>
              }
              title={
                <Typography variant="h6" fontWeight={600}>Số lượng học bổng theo thời gian</Typography>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ height: 250, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={scholarshipTrendData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [value, name === 'active' ? 'Học bổng hoạt động' : 'Học bổng mới']} />
                    <Legend formatter={(value) => value === 'active' ? 'Học bổng hoạt động' : 'Học bổng mới'} />
                    <Area type="monotone" dataKey="active" stackId="1" stroke={theme.palette.primary.main} fill={theme.palette.primary.lighter} />
                    <Area type="monotone" dataKey="new" stackId="2" stroke={theme.palette.success.main} fill={theme.palette.success.lighter} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Biểu đồ số lượng hồ sơ theo học bổng */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'success.lighter', color: 'success.main' }}>
                  <BarChartIcon />
                </Avatar>
              }
              title={
                <Typography variant="h6" fontWeight={600}>Số lượng hồ sơ theo học bổng</Typography>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ height: 250, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={applicationsByScholarshipData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 70,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end"
                      height={70}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} hồ sơ`, 'Số lượng']} />
                    <Bar dataKey="applications" fill={theme.palette.info.main} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Biểu đồ hoạt động người dùng */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'warning.lighter', color: 'warning.main' }}>
                  <TrendingUpIcon />
                </Avatar>
              }
              title={
                <Typography variant="h6" fontWeight={600}>Hoạt động người dùng</Typography>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ height: 250, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={userActivityData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [value, name === 'applications' ? 'Nộp hồ sơ' : 'Duyệt hồ sơ']} />
                    <Legend formatter={(value) => value === 'applications' ? 'Nộp hồ sơ' : 'Duyệt hồ sơ'} />
                    <Line type="monotone" dataKey="applications" stroke={theme.palette.primary.main} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="reviews" stroke={theme.palette.success.main} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Sự kiện sắp tới và lịch */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%', 
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" component="h3" fontWeight="bold" color="primary.main">
                {viewMode === 'upcoming' ? 'Sự kiện sắp tới' : 'Sự kiện ngày ' + format(selectedDate, 'dd/MM/yyyy')}
              </Typography>
              <Tabs 
                value={viewMode} 
                onChange={(event, newValue) => {
                  setViewMode(newValue);
                }}
                indicatorColor="primary"
                textColor="primary"
                sx={{ minHeight: '36px' }}
              >
                <Tab 
                  value="upcoming" 
                  label="Sắp tới" 
                  sx={{ minHeight: '36px', py: 0.5 }} 
                />
                <Tab 
                  value="selected" 
                  label="Đã chọn" 
                  sx={{ minHeight: '36px', py: 0.5 }} 
                />
              </Tabs>
            </Box>
            <Divider />
            
            <List sx={{ overflow: 'auto', flexGrow: 1, my: 1 }}>
              {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <React.Fragment key={event.id}>
                    <ListItem alignItems="flex-start" sx={{ px: 1 }}>
                      <ListItemIcon sx={{ minWidth: '48px' }}>
                        <Box
                          sx={{
                            backgroundColor: getEventColor(event.type),
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            mx: 'auto'
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            {event.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(event.date), 'dd/MM/yyyy')}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {event.description}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', py: 4 }}>
                  <Typography variant="body1" color="text.secondary" align="center">
                    {viewMode === 'upcoming' 
                      ? 'Không có sự kiện sắp tới' 
                      : `Không có sự kiện nào vào ngày ${format(selectedDate, 'dd/MM/yyyy')}`}
                  </Typography>
                  {viewMode === 'selected' && (
                    <Button 
                      variant="text" 
                      color="primary" 
                      onClick={() => setViewMode('upcoming')}
                      sx={{ mt: 1 }}
                    >
                      Xem sự kiện sắp tới
                    </Button>
                  )}
                </Box>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%', 
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Typography variant="h6" component="h3" fontWeight="bold" color="primary.main" mb={1}>
              Lịch sự kiện
            </Typography>
            <Divider />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  value={selectedDate}
                  onChange={handleDateChange}
                  renderDay={(day, _value, DayComponentProps) => 
                    <CustomPickersDay 
                      {...DayComponentProps} 
                      day={day} 
                      selectedDay={selectedDate}
                    />
                  }
                  renderInput={(params) => <TextField {...params} />}
                  dayOfWeekFormatter={(day) => {
                    const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                    return dayLabels[day];
                  }}
                  components={{
                    ActionBar: () => null
                  }}
                  sx={{
                    '.MuiPickersCalendarHeader-root': {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    },
                    '.MuiPickersArrowSwitcher-root': {
                      display: 'flex',
                    },
                    '.MuiTypography-root': {
                      fontWeight: 'medium',
                    },
                    '.MuiDayPicker-weekDayLabel': {
                      fontWeight: 'bold',
                      color: 'primary.main'
                    },
                    '& .MuiPickersDay-root.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </LocalizationProvider>
            </Box>
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" fontWeight="medium" mb={1}>
                Ký hiệu sự kiện:
              </Typography>
              <Grid container spacing={1}>
                {['deadline', 'interview', 'webinar', 'event'].map(type => (
                  <Grid item xs={6} key={type}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: getEventColor(type),
                          mr: 1
                        }}
                      />
                      <Typography variant="body2">
                        {getEventTypeName(type)}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Grid>
        
        {/* Thông báo mới nhất */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: 3, mt: { xs: 0, md: 2 } }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'warning.lighter', color: 'warning.main' }}>
                  <NotificationsActiveIcon />
                </Avatar>
              }
              title={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight={600}>Thông báo mới nhất</Typography>
                  <IconButton size="small">
                    <ArrowForwardIcon fontSize="small" />
                  </IconButton>
                </Box>
              }
            />
            <Divider />
            <CardContent sx={{ p: { xs: 1, md: 2 } }}>
              <List sx={{ p: 0 }}>
                {latestNotifications.map((notification) => (
                  <ListItem 
                    key={notification.id}
                    sx={{ 
                      px: { xs: 1, md: 2 }, 
                      py: 1.5, 
                      borderBottom: '1px solid', 
                      borderColor: 'divider',
                      '&:last-child': {
                        borderBottom: 'none'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                        <NotificationsActiveIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          {notification.message}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                          {notification.time}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage; 