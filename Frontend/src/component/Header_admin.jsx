import React, { useState } from 'react';
import { Layout, Input, Switch, Select, Avatar, Popover, message } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import AdminProfileEdit from './AdminProfileEdit';

const { Header: AntHeader } = Layout;
const { Option } = Select;

const Header = ({ darkMode, toggleDarkMode, language, toggleLanguage }) => {
  const [adminInfo, setAdminInfo] = useState({
    name: 'Admin Name',
    email: 'admin@example.com',
    phone: '123-456-7890',
    avatar: null,
  });

  const handleAdminInfoUpdate = (newInfo) => {
    setAdminInfo({ ...adminInfo, ...newInfo });
    message.success('Admin information updated successfully');
  };

  const content = (
    <div>
      <AdminProfileEdit adminInfo={adminInfo} onUpdate={handleAdminInfoUpdate} />
    </div>
  );

  

  return (
    <AntHeader className="bg-white dark:bg-gray-900 flex items-center justify-between px-6">
      <div className="flex items-center">
        <Input
          placeholder={language === 'en' ? 'Search...' : 'Tìm kiếm...'}
          prefix={<SearchOutlined />}
          className="w-64"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Switch
          checked={darkMode}
          onChange={toggleDarkMode}
          checkedChildren="🌙"
          unCheckedChildren="☀️"
        />
        <Select value={language} onChange={toggleLanguage} className="w-24">
          <Option value="en">English</Option>
          <Option value="vi">Tiếng Việt</Option>
        </Select>
        
        <Popover content={content} title="Admin Profile" trigger="click">
          <div className="flex items-center cursor-pointer">
            <Avatar src={adminInfo.avatar} icon={<UserOutlined />} />
            <span className="ml-2 text-sm font-medium">{adminInfo.name}</span>
          </div>
        </Popover>
      </div>
    </AntHeader>
  );
};

export default Header;
