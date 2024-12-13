import { CheckOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Drawer, Menu } from 'antd';
import { useState } from 'react'
import { confirmation } from './Confirmation';
import { useNavigate } from 'react-router-dom';
import { Context } from '../context/context.provider';
import LogoutIcon from "../assets/svgs/Logout.svg";

const { SubMenu } = Menu;

export const SideDrawer = () => {

    const navigate = useNavigate();
  
  
    const { username, showAuthModal, userAuthenticated, signOutUser, onCurrencyChange, rates, conversionName } = Context()
    const [visible, setVisible] = useState(false);
  
    const showDrawer = () => {
        setVisible(true);
    };
    
    const closeDrawer = () => {
        setVisible(false);
    };
  
    const handleLogoutClick = () => {
        confirmation('Are you sure you want to logout?').then(isConfirmed => {
            if (isConfirmed) {
                signOutUser(); // Call your sign out function here
            }
        });
    };
  
    const currencyMenuItems = Object.keys(rates).map((key) => {
        const value = `${rates[key].code},${rates[key].value},${rates[key].symbol}`;
        return (
          <Menu.Item key={value} onClick={() => onCurrencyChange(value)}>
            {rates[key].code} {value.split(',')[0] === conversionName && <CheckOutlined />}
          </Menu.Item>
        );
    });
  
    return (
        <>
            <div className="lg:hidden">
                <button className="navbar-burger flex items-center text-primary p-3" onClick={showDrawer}>
                    <svg
                        className="block h-4 w-4 fill-current"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <title>Mobile menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                    </svg>
                </button>
            </div>
            <Drawer
                placement="right"
                closable={false}
                onClose={closeDrawer}
                visible={visible}
                width={250}
                className="p-0"
            >
                {/* Drawer Header */}
                { userAuthenticated &&
  
                  (<div className="flex items-center p-4 border-b border-gray-200">
                      <Avatar size={40} icon={<UserOutlined />} />
                      <span className="ml-4 font-bold text-gray-800">{username || "Username"}</span>
                      <Button
                          type="text"
                          icon={<CloseOutlined />}
                          onClick={closeDrawer}
                          className="ml-auto"
                      />
                  </div>) 
                }
  
                {/* Drawer Links */}
                <Menu mode="inline" style={{ height: '100%', borderRight: 0 }} className='w-full max-w-full'>
                    {
                      userAuthenticated ?
                      (<Menu.Item className="p-4"  key="1" onClick={() => { navigate('/dashboard'); closeDrawer() }}><strong>Dashboard</strong></Menu.Item>):
                      (
                        <Menu.Item className="p-4"  key="1" onClick={() => { closeDrawer() }}>
                          <Button
                            type="primary"
                            className="lg:ml-auto font-bold transition duration-200 w-full"
                            onClick={showAuthModal}
                          >
                            Login
                          </Button>
                        </Menu.Item>
                      )
  
                    }
                    <Menu.Item className="p-4"  key="1" onClick={() => { navigate('/home'); closeDrawer() }}><strong>Home</strong></Menu.Item>
                    <hr />
                    <SubMenu className="" key="sub1" title={<strong>MSS Calculator</strong>}>
                        <Menu.Item key="2" onClick={() => {navigate('/proportional-metric-testing');closeDrawer()}}><strong>Proportional Metric</strong></Menu.Item>
                        <Menu.Item key="3" onClick={() => {navigate('/continuous-metric-testing');closeDrawer()}}><strong>Continuous Metric</strong></Menu.Item>
                    </SubMenu>
                    <Menu.Item className="p-4"  key="2" onClick={() => { navigate('/ab-testing'); closeDrawer() }}><strong>A/B Testing</strong></Menu.Item>
                    {/* <Menu.Item className="p-4"  key="3" onClick={() => { navigate('/articles'); closeDrawer() }}><strong>Articles</strong></Menu.Item> */}
                    <Menu.Item className="p-4"  key="4" onClick={() => { navigate('/feedback'); closeDrawer() }}><strong>Feedback</strong></Menu.Item>
  
                    <Menu.SubMenu key="sub2" title={<strong>Currency ({conversionName})</strong>}>
                        <div className="max-h-60 overflow-y-auto">
                            {currencyMenuItems}
                        </div>
                    </Menu.SubMenu>
                    {
                      userAuthenticated &&
                        <Menu.Item className="p-4"  key="5" onClick={() => { navigate('/home'); closeDrawer() }}>
                          <Button
                              type="text"
                              icon={<img src={LogoutIcon}/>}
                              onClick={() => handleLogoutClick()}
                              className="w-full font-bold flex items-center justify-center py-2 text-red-600 hover:bg-red-100"
                              > 
                              Logout
                          </Button>
                        </Menu.Item>
                    }
                </Menu>
  
                {/* Logout Button */}
            </Drawer>
        </>
    )
  }