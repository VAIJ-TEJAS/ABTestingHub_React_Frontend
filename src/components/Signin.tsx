import { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import { Container } from '@mui/material';
import Logo from "../assets/images/logo.png";
import GoogleIcon from "../assets/svgs/google.svg";

const Signin = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Signin
            </Button>
            <Modal open={isModalVisible} onOk={handleOk} onCancel={handleCancel} closeIcon={null} footer={null} width={360}>
                <Container>
                    <div className='relative'>
                        <div className='absolute w-full h-full flex justify-center items-center'>
                            <div className='text-4xl text-primary font-bold'>
                                AB Testing Hub
                            </div>
                        </div>
                        <img src={Logo} className='opacity-20' />
                    </div>
                </Container>
                <Form layout="vertical" className='flex flex-col justify-center'>
                    <Form.Item label="Username / Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                        <Input size='large' />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input.Password size='large' />
                    </Form.Item>
                    <Button type="primary" size='large'>
                        Login
                    </Button>
                    <div className='w-full flex items-center gap-3 text-zinc-500 py-3'>
                        <hr className='flex-1' />
                        OR
                        <hr className='flex-1' />
                    </div>
                    <Button size='large'>
                        <div className='flex justify-center items-center  gap-2 '>
                            <img src={GoogleIcon} alt="Google" className='w-5' />
                            <div>
                                Continue with Google
                            </div>
                        </div>
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default Signin;
