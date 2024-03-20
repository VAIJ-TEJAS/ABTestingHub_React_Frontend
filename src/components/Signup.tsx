/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Modal, Button, Form, Input, Checkbox } from 'antd';
import Logo from "../assets/images/logo.png";
import GoogleIcon from "../assets/svgs/google.svg";

const Signup = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showTermsModal = () => {
        setIsTermsModalVisible(true);
    };

    const handleTermsModalOk = () => {
        setIsTermsModalVisible(false);
    };

    const handleTermsModalCancel = () => {
        setIsTermsModalVisible(false);
    };

    const validatePassword = ({ getFieldValue }: {
        getFieldValue: (field: string) => any;
    }) => ({
        validator(_: any, value: any) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords that you entered do not match!'));
        },
    });

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Signup
            </Button>
            <Modal open={isModalVisible} onOk={handleOk} onCancel={handleCancel} closeIcon={null} footer={null} width={720}>
                <div className='flex justify-between items-center gap-3'>
                    <div className='w-80'>
                        <div className='relative'>
                            <div className='absolute w-full h-full flex justify-center items-center'>
                                <div className='text-4xl text-primary font-bold'>
                                    AB Testing Hub
                                </div>
                            </div>
                            <img src={Logo} className='opacity-20' alt="AB Testing Hub Logo" />
                        </div>
                    </div>
                    <Form layout="vertical" className='flex flex-col justify-center flex-1'>
                        <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                            <Input size='large' />
                        </Form.Item>
                        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                            <Input size='large' />
                        </Form.Item>
                        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                            <Input.Password size='large' />
                        </Form.Item>
                        <Form.Item label="Confirm Password" name="confirm" rules={[{ required: true, message: 'Please confirm your password!' }, validatePassword]}>
                            <Input.Password size='large' />
                        </Form.Item>
                        <Form.Item name="agreement" valuePropName="checked">
                            <Checkbox checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)}>
                                I agree to the <Button type='link' href="#" onClick={showTermsModal} className='px-0'>Terms and Conditions</Button>
                            </Checkbox>
                        </Form.Item>
                        <Button type="primary" size='large' disabled={!agreedToTerms}>
                            Signup
                        </Button>
                        <div className='w-full flex items-center gap-3 text-zinc-500 py-3'>
                            <hr className='flex-1' />
                            OR
                            <hr className='flex-1' />
                        </div>
                        <Button size='large'>
                            <div className='flex justify-center items-center gap-2'>
                                <img src={GoogleIcon} alt="Google" className='w-5' />
                                Signup with Google
                            </div>
                        </Button>
                    </Form>
                </div>
            </Modal>

            {/* Terms and Conditions Modal */}
            <Modal title="Terms and Conditions" open={isTermsModalVisible} onOk={handleTermsModalOk} onCancel={handleTermsModalCancel} footer={[
                <Button key="back" onClick={handleTermsModalCancel}>
                    Return
                </Button>
            ]}>
                {/* Content of your terms and conditions */}
                <p>Your terms and conditions text goes here. Ensure it covers all necessary aspects of your service.</p>
            </Modal>
        </>
    );
};

export default Signup;
