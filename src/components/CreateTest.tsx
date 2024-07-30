/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { generateProjectName } from "../utils/hypothesis_title_generator";
import {
  Modal,
  Button,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  message,
  Segmented,
} from "antd";
import { CloseSharp } from "@mui/icons-material";

interface CreateTestModalProps {
  isVisible: boolean;
  onClose: () => void;
  test_id: number | null;
}

export const CreateTest: React.FC<CreateTestModalProps> = ({
  isVisible,
  onClose,
  test_id,
}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [testId, setTestId] = useState<number | undefined>();

  useEffect(() => {
    if (test_id) {
      setTestId(test_id);
      fetchTestData(test_id);
    }
  }, [test_id]);

  const fetchTestData = async (testId: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/tests/${testId}/`,
        {
          headers: {
            Authorization:
              "Token " + localStorage.getItem("abtestinghub-access-token"),
          },
        }
      );
      form.setFieldsValue(response.data);
    } catch (error) {
      console.error("Failed to fetch test data:", error);
      message.error("Failed to fetch test details.");
    }
  };

  const createOrUpdateTest = async (values: any, action: string) => {
    const apiUrl = testId
      ? `${import.meta.env.VITE_BASE_URL}/tests/${testId}/`
      : `${import.meta.env.VITE_BASE_URL}/tests/`;
    const method = testId ? axios.patch : axios.post;

    try {
      const response = await method(apiUrl, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Token " + localStorage.getItem("abtestinghub-access-token"),
        },
      });

      message.success(
        testId ? "Test updated successfully" : "Test created successfully"
      );

      if (action === "return") {
        navigate("/dashboard");
      } else if (action === "continue") {
        const route = values.proportional_metric
          ? "/proportional-metric-testing"
          : "/continuous-metric-testing";
        navigate(route, { state: { testId: response.data.id } });
      }
    } catch (error) {
      console.error(
        testId ? "Failed to update test:" : "Failed to create test:",
        error
      );
      message.error(
        testId ? "Failed to update test." : "Failed to create test."
      );
    }
  };

  const onFinish = (values: any) => {
    createOrUpdateTest(values, "continue");
  };

  const onFinishReturn = (values: any) => {
    createOrUpdateTest(values, "return");
  };

  const randomName = generateProjectName();

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      closeIcon={false}
      footer={null}
      width={840}
      styles={{
        content: {
          padding: "0px 0px",
          borderRadius: "16px",
        },
      }}
    >
      <div className="border-4 border-secondary rounded-xl p-8">
        <div className="pb-4">
          <div className="w-ful flex justify-end">
            <CloseSharp className="hover:text-primary hover:cursor-pointer" onClick={onClose}/>
          </div>
          <div className="text-2xl text-center inline-flex w-full justify-center">
            CREATE/EDIT TEST 
          </div>
        </div>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{
            name: randomName,
            proportional_metric: true,
            arms: 2,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="NAME"
                name="name"
                rules={[
                  { required: true, message: "Please input the test name!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="METRIC TYPE"
                name="proportional_metric"
                rules={[
                  { required: true, message: "Please select the metric type!" },
                ]}
              >
                <Segmented
                  block
                  options={[
                    { label: 'PROPORTIONAL', value: true },
                    { label: 'CONTINUOUS', value: false }
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="DESCRIPTION" name="description">
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="HYPOTHESIS" name="hypothesis">
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="PRIMARY METRIC" name="primary_metric">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="BUSINESS TARGET" name="business_target">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="NO. OF ARMS"
                name="arms"
                rules={[
                  {
                    required: true,
                    message: "Please input the number of arms!",
                  },
                ]}
              >
                <InputNumber min={2} max={20} className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex w-full justify-between">
            <Form.Item>
              <Button onClick={() => onFinishReturn(form.getFieldsValue())}>
                Save and Return
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save and Continue
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </Modal>
  );
};
