/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, Paper } from "@mui/material"
import { Button, Col, Form, Input, InputNumber, Radio, Row, message } from "antd"
import { generateProjectName } from "../utils/hypothesis_title_generator";
import axios from "axios";

export const CreateTest = () => {

  const onFinish = async (values: any) => {
    // Define your API endpoint
    const apiUrl = 'http://localhost:8000/tests/'; 

    console.log(values);

    try {
      // Use axios to send a POST request
      const response = await axios.post(apiUrl, values, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token '+ localStorage.getItem('abtestinghub-access-token')
        },
      });

      console.log(response.data)

      message.success('Test created successfully:');
      // Handle success (e.g., show notification, redirect, etc.)
    } catch (error) {
      console.error('Failed to create test:', error);
      // Handle error (e.g., show error notification)
    }
  };

  const randomName = generateProjectName();

  return (
    <Container className="p-4 bg-[#f5f5f550]">
      <div className="text-4xl font-medium py-8">Create Test</div>
      <Paper className="p-8">
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: randomName,  
            proportional_metric: true,
            no_of_arms: 2
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
                name="no_of_arms"
                rules={[{ required: true, message: 'Please input the number of arms!' }]} 
              >
                <InputNumber min={2} max={20} className="w-full"/>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Paper>
    </Container>
  )
}
