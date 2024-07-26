/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGoogleLogin } from "@react-oauth/google";
import { Modal, Button, Form, message, Checkbox, Input } from "antd";
import { Context } from "../context/context.provider";
import IconText from "../assets/svgs/IconText.svg";
import Mask from "../assets/images/Mask.png";
import Google from "../assets/svgs/Google.svg"
// import GoogleIcon from "../assets/svgs/google.svg";
import { useState } from "react";
import axios from "axios";
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
  const { setUsername, signInUser, hideAuthModal, authModalOpen } = Context();
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSignInView, setIsSignInView] = useState(true);
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
    setIsSignInView(!isSignInView);
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

    const signInEndpoint = `${import.meta.env.VITE_BASE_URL}/auth/`;

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

    const signUpEndpoint = `${import.meta.env.VITE_BASE_URL}/signup/`;

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

  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log(credentialResponse);
    console.log("Hello World!");

    // Use the credentialResponse to make a backend call
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/google-complete/`,
        {
          token: credentialResponse.credential,
        }
      );

      console.log(response.data);

      const { token, user } = response.data;
      signInUser(token);

      // Extract user information
      const { username } = user;
      localStorage.setItem("ab_testing_hub_username", username);
      setUsername(username);

      if (onSignin) onSignin(response);

      message.success("Sign in with Google successful!");
      handleClose();
    } catch (error) {
      message.error("Failed to sign in with Google. Please try again.");
      console.error("Google sign-in error:", error);
    }
  };

  const handleGoogleFailure = () => {
    message.error("Google Sign-In was unsuccessful. Try again later.");
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleFailure,
  });

  return (
    <>
      <Modal
        open={isVisible ?? authModalOpen}
        onCancel={handleClose}
        closeIcon={null}
        footer={null}
        width={720}
      >
        {isSignInView ? (
          <div className="flex border-2 border-secondary rounded-xl">
            <div className="w-72 flex-shrink-0 relative flex justify-center items-center">
              <img src={Mask} />
              <img src={IconText} className="absolute w-36"></img>
            </div>
            <Form
              layout="vertical"
              className="flex flex-col w-full justify-center p-8 font-sans"
              form={formSignin}
              onFinish={handleSignIn}
            >
              <div className="text-xl pb-4">
                Login to AB Testing Hub
              </div>
              <Form.Item
                label="EMAIL"
                name="username"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input placeholder="Enter your email"/>
              </Form.Item>
              <Form.Item
                label="PASSWORD"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password placeholder="Enter your password"/>
              </Form.Item>
              <Button type="primary" htmlType="submit" className="font-sans">
                LOGIN
              </Button>
              <div className="w-full flex justify-center gap-3 py-3 font-sans">
            
                OR
              </div>
              <div className="w-full flex justify-center">
                <Button
                  className="custom-google-button border w-full border-secondary p-4 inline-flex justify-center items-center gap-2 font-sans"
                  onClick={() => googleLogin()}
                >
                  <img src={Google} className="w-4"/>Continue with Google
                </Button>
              </div>
              <Form.Item className="text-center my-3">
                Don't have an account?
                <Button type="link" onClick={toggleView} className="font-sans">
                   Signup
                </Button>
              </Form.Item>
            </Form>
          </div>
        ) : (
          <div>
            <div className="flex border-2 border-secondary rounded-xl">
            <div className="w-72 flex-shrink-0 relative flex justify-center items-center">
              <img src={Mask} />
              <img src={IconText} className="absolute w-36"></img>
            </div>
              <Form
                layout="vertical"
                className="flex flex-col w-full justify-center p-8 font-sans"
                form={formSignup}
                onFinish={handleSignUp}
              >
                 <div className="text-xl pb-4">
                Signup to AB Testing Hub
              </div>
                <Form.Item
                  label="EMAIL"
                  name="username"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input placeholder="Enter your email"/>
                </Form.Item>
                <Form.Item
                  label="PASSWORD"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password placeholder="Enter your password"/>
                </Form.Item>
                <Form.Item name="agreement" valuePropName="checked">
                  <Checkbox
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="font-sans"
                  >
                    I agree to the{" "}
                    <Button
                      type="link"
                      href="#"
                      onClick={showTermsModal}
                      className="px-0 font-sans"
                    >
                      Terms and Conditions
                    </Button>
                  </Checkbox>
                </Form.Item>
                <Button
                  type="primary"
                  disabled={!agreedToTerms}
                  htmlType="submit"
                  className="font-sans"
                >
                  SIGNUP
                </Button>
                <div className="w-full flex justify-center gap-3 text-zinc-500 py-3">
                  OR
                </div>
                <div className="w-full flex justify-center">
                <Button
                  className="custom-google-button border w-full border-secondary p-4 inline-flex justify-center items-center gap-2 font-sans"
                  onClick={() => googleLogin()}
                >
                  <img src={Google} className="w-4"/>Continue with Google
                </Button>
              </div>
                <Form.Item className="text-center my-3 font-sans">
                Already have an account?
                  <Button type="link" onClick={toggleView} className="font-sans">
                     Sign In
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
