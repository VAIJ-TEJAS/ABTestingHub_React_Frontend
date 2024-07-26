import { Form, Input, Button, Modal } from "antd";
import { useState } from "react";
import ThumbsUp from "../assets/svgs/ThumbsUp.svg"

export const Feedback = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onFinish = (values: any) => {
    console.log("Success:", values);
    setIsModalVisible(true);
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
            name="feedback"
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
        >
          <div className="flex flex-col justify-center items-center gap-4 font-sans text-center border-2 border-secondary p-12 rounded-xl">
            <img src={ThumbsUp} className="animate-bounce"/>
            <div className="text-2xl">
                Thank You for Your Feedback!
            </div>
            <div className="">
                We appreciate your input and are committed to improving our services to better meet your needs.
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
