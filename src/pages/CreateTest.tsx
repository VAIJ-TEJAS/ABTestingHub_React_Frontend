/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, Paper } from "@mui/material"
import { Button, Col, Form, Input, InputNumber, Radio, Row } from "antd"
import { generateProjectName } from "../utils/hypothesis_title_generator";

export const CreateTest = () => {

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
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
            metric_type: true,
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
                name="metric_type"
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
                <Input.TextArea />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Hypothesis"
                name="hypothesis"
              >
                <Input.TextArea />
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
              >
                <InputNumber min={2} className="w-full"/>
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
