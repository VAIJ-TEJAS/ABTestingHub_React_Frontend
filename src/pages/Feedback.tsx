import { Form, Input, Button, Modal, message } from "antd";
import { useState } from "react";
import ThumbsUp from "../assets/svgs/ThumbsUp.svg"
import { CloseSharp } from "@mui/icons-material";
import axios from "axios";

export const Feedback = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onFinish = async (values: any) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/feedback/`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Success:", response.data);
      message.success("Feedback submitted successfully");
      setIsModalVisible(true);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      message.error("Failed to submit feedback. Please try again.");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="p-16 flex w-full justify-center items-center">
      <div className="w-full max-w-md">
        <div className="text-2xl mb-8 text-center">WE VALUE YOUR FEEDBACK</div>
        <Form
          name="feedback"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="NAME"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input placeholder="Sample User Name" />
          </Form.Item>

          <Form.Item
            label="EMAIL ID"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="sampleusername@gmail.com" />
          </Form.Item>

          <Form.Item
            label="FEEDBACK MESSAGE/QUERY"
            name="comment"
            rules={[{ required: true, message: "Please input your feedback!" }]}
          >
            <Input.TextArea placeholder="Sample User Feedback" rows={4} />
          </Form.Item>

          <Form.Item className="text-center">
            <div className="w-full flex gap-8">
              <Button type="primary" htmlType="submit" className="flex-1 font-sans">
                Submit Feedback
              </Button>
              {/* <Button htmlType="button" className="flex-1 font-sans">
                Close
              </Button> */}
            </div>
          </Form.Item>
        </Form>
        
        <Modal 
            open={isModalVisible} 
            onCancel={handleCancel}
            closeIcon={false}
            footer={null}
            styles={{
              content:{
                padding: "0px 0px",
                borderRadius:"16px"
              }
            }}
        >
          <div className="flex flex-col justify-center items-center gap-4 font-sans text-center border-4 border-secondary p-4 rounded-xl">
          <div className="text-xl pb-4 inline-flex w-full justify-end">
                <CloseSharp className="hover:text-primary hover:cursor-pointer" onClick={handleCancel}/>
              </div>
            <img src={ThumbsUp} className="animate-bounce"/>
            <div className="text-2xl">
                Thank You for Your Feedback!
            </div>
            <div className="pb-4">
                We appreciate your input and are committed to improving our services to better meet your needs.
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
