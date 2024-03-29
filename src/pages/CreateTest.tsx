/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, Paper } from "@mui/material"
import { Button, Col, Form, Input, InputNumber, Radio, Row, message } from "antd"
import { generateProjectName } from "../utils/hypothesis_title_generator";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const CreateTest = () => {

  const navigate = useNavigate()
  const location = useLocation();
  const [form] = Form.useForm();
  const [testId, setTestId] = useState();

  useEffect(() => {
    // Check if testId is passed in the component's state
    if (location.state?.testId) {
      setTestId(location.state.testId);
      fetchTestData(location.state.testId);
    }
  }, [location.state]);

  const fetchTestData = async (testId: number) => {
    try {
      const response = await axios.get(`http://localhost:8000/tests/${testId}/`, {
        headers: {
          'Authorization': 'Token ' + localStorage.getItem('abtestinghub-access-token'),
        },
      });
      form.setFieldsValue(response.data);
    } catch (error) {
      console.error('Failed to fetch test data:', error);
      message.error('Failed to fetch test details.');
    }
  };

  const createOrUpdateTest = async (values: any, action: string) => {
    const apiUrl = testId ? `http://localhost:8000/tests/${testId}/` : 'http://localhost:8000/tests/';
    const method = testId ? axios.patch : axios.post;

    try {
      const response = await method(apiUrl, values, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + localStorage.getItem('abtestinghub-access-token'),
        },
      });

      message.success(testId ? 'Test updated successfully' : 'Test created successfully');

      if (action === 'return') {
        navigate('/dashboard');
      } else if (action === 'continue') {
        const route = values.proportional_metric ? '/proportional-metric-testing' : '/continuous-metric-testing';
        navigate(route, { state: { testId: response.data.id } });
      }
    } catch (error) {
      console.error(testId ? 'Failed to update test:' : 'Failed to create test:', error);
      message.error(testId ? 'Failed to update test.' : 'Failed to create test.');
    }
  };

  const onFinish = (values: any) => {
    createOrUpdateTest(values, 'continue');
  };

  const onFinishReturn = (values: any) => {
    createOrUpdateTest(values, 'return');
  };

  const randomName = generateProjectName();

  return (
    <Container className="p-4 bg-[#f5f5f550]">
      <div className="text-4xl font-medium py-8">Create Test</div>
      <Paper className="p-8">
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{
            name: randomName,
            proportional_metric: true,
            arms: 2
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input the test name!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Metric Type"
                name="proportional_metric"
                rules={[{ required: true, message: 'Please select the metric type!' }]}
              >
                <Radio.Group>
                  <Radio value={true}>Proportional Metric</Radio>
                  <Radio value={false}>Continuous Metric</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Description"
                name="description"
              >
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Hypothesis"
                name="hypothesis"
              >
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Primary Metric"
                name="primary_metric"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Business Target"
                name="business_target"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Number of Arms"
                name="arms"
                rules={[{ required: true, message: 'Please input the number of arms!' }]}
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
      </Paper>
    </Container>
  )
}
