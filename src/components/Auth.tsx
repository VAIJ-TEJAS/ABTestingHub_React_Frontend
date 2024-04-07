/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Button, Form, Input, Checkbox, message } from "antd";
import { Context } from "../context/context.provider";
import { Container } from "@mui/material";
import Logo from "../assets/images/logo.png";
// import GoogleIcon from "../assets/svgs/google.svg";
import { useState } from "react";
import axios from "axios";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth } from "../../firebaseConfig";
// import { useNavigate } from "react-router-dom";

interface AuthProps {
  isVisible?: boolean;
  onClose?: () => void;
  onSignup?: (response: any) => void;
  onSignin?: (response: any) => void;
}

export const Auth: React.FC<AuthProps> = ({
  isVisible,
  onClose,
  onSignup,
  onSignin,
}) => {
  const {
    signInUser,
    hideAuthModal,
    authModalOpen,
    // setUserAuthenticated,
    // setAuthModalOpen,
  } = Context();
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSignUpView, setIsSignUpView] = useState(false);
  const [formSignup] = Form.useForm();
  const [formSignin] = Form.useForm();

  // const navigate = useNavigate();

  // const provider = new GoogleAuthProvider();

  // const signInWithGoogle = () => {
  //   signInWithPopup(auth, provider)
  //     .then(() => {
  //       setUserAuthenticated(true);
  //       setAuthModalOpen(false)
  //       navigate("/dashboard");
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

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

  const handleSignIn = (values: any) => {
    console.log(values);

    const signInEndpoint = "http://localhost:8000/auth/";

    axios
      .post(signInEndpoint, values)
      .then((response) => {
        signInUser(response.data.token);

        // Display success message
        message.success("Sign in successful!");

        // Call the onSignin callback if provided
        if (onSignin) onSignin(response);

        // Close the modal
        handleClose();
      })
      .catch((error) => {
        message.error("Sign in failed. Please try again.");
        console.error("SignIn Error:", error);
        // Add logic to handle sign in error, e.g., displaying a notification
      });
  };

  const handleSignUp = (values: any) => {
    console.log(values);

    const signUpEndpoint = "http://localhost:8000/signup/";

    axios
      .post(signUpEndpoint, values)
      .then((response) => {
        console.log("SignUp Success:", response);
        signInUser(response.data.token);

        // Call the onSignup callback if provided
        if (onSignup) onSignup(response);

        // Close the modal
        handleClose();
      })
      .catch((error) => {
        console.error("SignUp Error:", error);
        // Add logic to handle sign up error, e.g., displaying a notification
      });
  };

  const handleClose = () => {
    if (onClose) {
      onClose(); // Call the onClose prop if provided
    } else {
      hideAuthModal(); // Otherwise, use the context method
    }
  };

  return (
    <>
      <Modal
        open={isVisible ?? authModalOpen}
        onCancel={handleClose}
        closeIcon={null}
        footer={null}
        width={720}
      >
        {isSignUpView ? (
          <div className="flex flex-col justify-center items-center">
            <Container>
              <div className="relative w-full flex justify-center items-center">
                <div className="absolute w-full h-full flex justify-center items-center">
                  <div className="text-4xl text-primary font-bold">
                    A/B Testing Hub
                  </div>
                </div>
                <img src={Logo} className="opacity-20 w-60 " />
              </div>
            </Container>
            <Form
              layout="vertical"
              className="flex flex-col"
              form={formSignin}
              onFinish={handleSignIn}
            >
              <Form.Item
                label="Email"
                name="username"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
              {/* <div className="w-full flex items-center gap-3 text-zinc-500 py-3">
                <hr className="flex-1" />
                OR
                <hr className="flex-1" />
              </div>
              <Button onClick={signInWithGoogle}>
                <div className="flex justify-center items-center gap-2 ">
                  <img src={GoogleIcon} alt="Google" className="w-5" />
                  <div>Continue with Google</div>
                </div>
              </Button> */}
              <Form.Item className="text-center my-3">
                <Button type="link" onClick={toggleView}>
                  Don't have an account? Sign Up
                </Button>
              </Form.Item>
            </Form>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center gap-3">
              <div className="w-64">
                <div className="relative">
                  <div className="absolute w-full h-full flex justify-center items-center">
                    <div className="text-4xl text-primary font-bold">
                      A/B Testing Hub
                    </div>
                  </div>
                  <img
                    src={Logo}
                    className="opacity-20"
                    alt="A/B Testing Hub Logo"
                  />
                </div>
              </div>
              <Form
                layout="vertical"
                className="flex flex-col justify-center flex-1"
                form={formSignup}
                onFinish={handleSignUp}
              >
                <Form.Item
                  label="Email"
                  name="username"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item name="agreement" valuePropName="checked">
                  <Checkbox
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  >
                    I agree to the{" "}
                    <Button
                      type="link"
                      href="#"
                      onClick={showTermsModal}
                      className="px-0"
                    >
                      Terms and Conditions
                    </Button>
                  </Checkbox>
                </Form.Item>
                <Button
                  type="primary"
                  disabled={!agreedToTerms}
                  htmlType="submit"
                >
                  Signup
                </Button>
                {/* <div className="w-full flex items-center gap-3 text-zinc-500 py-3">
                  <hr className="flex-1" />
                  OR
                  <hr className="flex-1" />
                </div>
                <Button onClick={signInWithGoogle}>
                  <div className="flex justify-center items-center gap-2">
                    <img src={GoogleIcon} alt="Google" className="w-5" />
                    Continue with Google
                  </div>
                </Button> */}
                <Form.Item className="text-center my-3">
                  <Button type="link" onClick={toggleView}>
                    Already have an account? Sign In
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
      </Modal>
      {/* Terms and Conditions Modal */}
      <Modal
        title="Terms and Conditions"
        open={isTermsModalVisible}
        onOk={handleTermsModalOk}
        onCancel={handleTermsModalCancel}
        footer={[
          <Button key="back" onClick={handleTermsModalCancel}>
            Return
          </Button>,
        ]}
      >
        {/* Content of your terms and conditions */}
        <p>
          Your terms and conditions text goes here. Ensure it covers all
          necessary aspects of your service.
        </p>
      </Modal>
    </>
  );
};
