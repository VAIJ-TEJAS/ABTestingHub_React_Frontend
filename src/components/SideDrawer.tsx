import { CheckOutlined, CloseOutlined, UserOutlined, SettingOutlined, BellOutlined } from '@ant-design/icons';
import { Avatar, Button, Drawer, Menu, Badge, Divider, Tooltip } from 'antd';
import { useState, useEffect, useCallback } from 'react'
import { confirmation } from './Confirmation';
import { useNavigate, useLocation } from 'react-router-dom';
import { Context } from '../context/context.provider';
import LogoutIcon from "../assets/svgs/Logout.svg";

const { SubMenu } = Menu;

interface SideDrawerProps {
  autoClose?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SideDrawer = ({ autoClose = false, onOpenChange }: SideDrawerProps) => {
    const navigate = useNavigate();
    const location = useLocation();
  
    const { username, showAuthModal, userAuthenticated, signOutUser, onCurrencyChange, rates, conversionName } = Context()
    const [visible, setVisible] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [activeKey, setActiveKey] = useState<string>('home');
  
    useEffect(() => {
      const path = location.pathname.split('/')[1] || 'home';
      setActiveKey(path);
    }, [location]);
  
    useEffect(() => {
      if (autoClose && visible) {
        const timer = setTimeout(() => {
          closeDrawer();
        }, 5000);
        return () => clearTimeout(timer);
      }
    }, [autoClose, visible]);
  
    useEffect(() => {
      if (onOpenChange) {
        onOpenChange(visible);
      }
    }, [visible, onOpenChange]);
  
    const showDrawer = useCallback(() => {
        setVisible(true);
    }, []);
    
    const closeDrawer = useCallback(() => {
        setVisible(false);
    }, []);
  
    const handleLogoutClick = useCallback(() => {
        confirmation('Are you sure you want to logout?').then(isConfirmed => {
            if (isConfirmed) {
                signOutUser();
                closeDrawer();
                navigate('/home');
            }
        });
    }, [signOutUser, closeDrawer, navigate]);
  
    const handleNavigation = useCallback((path: string) => {
        navigate(path);
        closeDrawer();
    }, [navigate, closeDrawer]);
  
    const currencyMenuItems = Object.keys(rates).map((key) => {
        const value = `${rates[key].code},${rates[key].value},${rates[key].symbol}`;
        return (
          <Menu.Item key={value} onClick={() => onCurrencyChange(value)}>
            {rates[key].code} {value.split(',')[0] === conversionName && <CheckOutlined />}
          </Menu.Item>
        );
    });
  
    const handleNotificationClick = useCallback(() => {
        setNotificationCount(0);
        handleNavigation('/feedback');
    }, [handleNavigation]);
  
    const isActiveRoute = useCallback((path: string) => {
        return activeKey === path.split('/')[1] || location.pathname === path;
    }, [activeKey, location.pathname]);
  
    return (
        <>
            <div className="lg:hidden">
                <button 
                    className="navbar-burger flex items-center text-primary p-3" 
                    onClick={showDrawer}
                    aria-label="Open menu"
                >
                    <svg
                        className="block h-4 w-4 fill-current"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <title>Mobile menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                    </svg>
                    {notificationCount > 0 && (
                        <Badge count={notificationCount} size="small" className="ml-2" />
                    )}
                </button>
            </div>
            <Drawer
                placement="right"
                closable={false}
                onClose={closeDrawer}
                open={visible}
                width={280}
                className="p-0"
                maskClosable={true}
            >
                {/* Drawer Header */}
                { userAuthenticated &&
                  (<div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
                      <Avatar size={40} icon={<UserOutlined />} className="bg-primary" />
                      <div className="ml-4 flex-1">
                          <div className="font-bold text-gray-800">{username || "Username"}</div>
                          <div className="text-xs text-gray-500">Member since 2024</div>
                      </div>
                      <div className="flex gap-2">
                          <Tooltip title="Notifications">
                              <Badge count={notificationCount} size="small">
                                  <Button
                                      type="text"
                                      icon={<BellOutlined />}
                                      onClick={handleNotificationClick}
                                      className="border-none"
                                  />
                              </Badge>
                          </Tooltip>
                          <Button
                              type="text"
                              icon={<CloseOutlined />}
                              onClick={closeDrawer}
                              className="ml-auto"
                              aria-label="Close drawer"
                          />
                      </div>
                  </div>) 
                }
  
                {/* Drawer Links */}
                <Menu 
                    mode="inline" 
                    style={{ height: '100%', borderRight: 0 }} 
                    className='w-full max-w-full'
                    selectedKeys={[activeKey]}
                >
                    {
                      userAuthenticated ?
                      (<Menu.Item 
                          className="p-4"  
                          key="dashboard" 
                          onClick={() => handleNavigation('/dashboard')}
                          icon={<SettingOutlined />}
                      >
                          <strong>Dashboard</strong>
                      </Menu.Item>):
                      (
                        <Menu.Item className="p-4" key="login" onClick={closeDrawer}>
                          <Button
                            type="primary"
                            className="lg:ml-auto font-bold transition duration-200 w-full"
                            onClick={showAuthModal}
                            block
                          >
                            Login
                          </Button>
                        </Menu.Item>
                      )
                    }
                    <Divider />
                    <Menu.Item 
                        className="p-4"  
                        key="home" 
                        onClick={() => handleNavigation('/home')}
                    >
                        <strong>Home</strong>
                    </Menu.Item>
                    <SubMenu 
                        className="" 
                        key="mss-calculator" 
                        title={<strong>MSS Calculator</strong>}
                        icon={<SettingOutlined />}
                    >
                        <Menu.Item 
                            key="proportional" 
                            onClick={() => handleNavigation('/proportional-metric-testing')}
                        >
                            <strong>Proportional Metric</strong>
                        </Menu.Item>
                        <Menu.Item 
                            key="continuous" 
                            onClick={() => handleNavigation('/continuous-metric-testing')}
                        >
                            <strong>Continuous Metric</strong>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item 
                        className="p-4"  
                        key="ab-testing" 
                        onClick={() => handleNavigation('/ab-testing')}
                    >
                        <strong>A/B Testing</strong>
                    </Menu.Item>
                    <Menu.Item 
                        className="p-4"  
                        key="feedback" 
                        onClick={() => handleNavigation('/feedback')}
                    >
                        <strong>Feedback</strong>
                        {notificationCount > 0 && (
                            <Badge count={notificationCount} size="small" className="ml-2" />
                        )}
                    </Menu.Item>
                    <Menu.Item 
                        className="p-4"  
                        key="about" 
                        onClick={() => handleNavigation('/about-us')}
                    >
                        <strong>About Us</strong>
                    </Menu.Item>
  
                    <Divider />
                    <Menu.SubMenu 
                        key="currency" 
                        title={<strong>Currency ({conversionName})</strong>}
                        icon={<SettingOutlined />}
                    >
                        <div className="max-h-60 overflow-y-auto">
                            {currencyMenuItems}
                        </div>
                    </Menu.SubMenu>
                    {
                      userAuthenticated &&
                        <>
                          <Divider />
                          <Menu.Item className="p-4" key="logout">
                            <Button
                                type="text"
                                icon={<img src={LogoutIcon} alt="Logout" />}
                                onClick={handleLogoutClick}
                                className="w-full font-bold flex items-center justify-center py-2 text-red-600 hover:bg-red-100"
                                danger
                                block
                            > 
                                Logout
                            </Button>
                          </Menu.Item>
                        </>
                    }
                </Menu>
            </Drawer>
        </>
    )
  }