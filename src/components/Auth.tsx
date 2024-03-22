/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Button, Form, Input, Checkbox } from 'antd';
import { Context } from "../context/context.provider";
import { Container } from "@mui/material";
import Logo from "../assets/images/logo.png";
import GoogleIcon from "../assets/svgs/google.svg";
import { useState } from "react";

export const Auth = () => {

    const { hideAuthModal, authModalOpen } = Context();
    const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isSignUpView, setIsSignUpView] = useState(false);

    const toggleView = () => {
        setIsSignUpView(!isSignUpView);
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
            <Modal open={authModalOpen} onCancel={hideAuthModal} closeIcon={null} footer={null} width={720}>
                {isSignUpView ? (
                    <div className='flex flex-col justify-center items-center'>
                        <Container>
                            <div className='relative w-full flex justify-center items-center'>
                                <div className='absolute w-full h-full flex justify-center items-center'>
                                    <div className='text-4xl text-primary font-bold'>
                                        AB Testing Hub
                                    </div>
                                </div>
                                <img src={Logo} className='opacity-20 w-60 ' />
                            </div>
                        </Container>
                        <Form layout="vertical" className='flex flex-col'>
                            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                                <Input.Password />
                            </Form.Item>
                            <Button type="primary" >
                                Login
                            </Button>
                            <div className='w-full flex items-center gap-3 text-zinc-500 py-3'>
                                <hr className='flex-1' />
                                OR
                                <hr className='flex-1' />
                            </div>
                            <Button>
                                <div className='flex justify-center items-center gap-2 '>
                                    <img src={GoogleIcon} alt="Google" className='w-5' />
                                    <div>
                                        Continue with Google
                                    </div>
                                </div>
                            </Button>
                            <Form.Item className='text-center my-3'>
                                <Button type="link" onClick={toggleView}>Don't have an account? Sign Up</Button>
                            </Form.Item>
                        </Form>
                    </div>
                ) : (
                    <div>
                        <div className='flex justify-between items-center gap-3'>
                            <div className='w-64'>
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
                                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item label="Confirm Password" name="confirm" rules={[{ required: true, message: 'Please confirm your password!' }, validatePassword]}>
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item name="agreement" valuePropName="checked">
                                    <Checkbox checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)}>
                                        I agree to the <Button type='link' href="#" onClick={showTermsModal} className='px-0'>Terms and Conditions</Button>
                                    </Checkbox>
                                </Form.Item>
                                <Button type="primary" disabled={!agreedToTerms}>
                                    Signup
                                </Button>
                                <div className='w-full flex items-center gap-3 text-zinc-500 py-3'>
                                    <hr className='flex-1' />
                                    OR
                                    <hr className='flex-1' />
                                </div>
                                <Button>
                                    <div className='flex justify-center items-center gap-2'>
                                        <img src={GoogleIcon} alt="Google" className='w-5' />
                                        Signup with Google
                                    </div>
                                </Button>
                                <Form.Item className='text-center my-3'>
                                    <Button type="link" onClick={toggleView}>Already have an account? Sign In</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                )}
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
    )
}
