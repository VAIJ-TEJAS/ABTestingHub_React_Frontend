/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { InputNumber, Button, Select, Checkbox, Form } from 'antd';
const { Option } = Select;
import axios from "axios"
import PlotGraph from '../components/PlotGraph';

export const ContinuousMetricTesting = () => {

  const [data, setData] = useState(null)
  const [layout, setLayout] = useState(null) 
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const BASE_URL = 'http://127.0.0.1:8000';

    axios.post(`${BASE_URL}/tests/calc_continuous_metric/`, values)
      .then(response => {
        console.log(response.data);
        setData(response.data['Fig Confidence Level'].data);
        setLayout(response.data['Fig Confidence Level'].layout);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };
  return (
    <div className='py-8 px-2 flex w-full justify-center'>
      <div className='container'>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            confidence_level: 95.0,
            power: 80.0,
            baseline_kpi: 5.0,
            standard_deviation: 1.5,
            mde: 0.5,
            absolute: true,
            arms: 2,
            daily_interactions: 1000,
            two_tailed: true,
            equal_allocation: true
          }}
        >
          <Form.Item name="confidence_level" label="Confidence Level (1-\u03B1) %">
            <InputNumber min={90} max={100} />
          </Form.Item>

          <Form.Item name="power" label="Statistical Power (1-\u03B2) %">
            <InputNumber min={80} max={100} />
          </Form.Item>

          <Form.Item name="baseline_kpi" label="KPI: Average">
            <InputNumber min={0} max={100} />
          </Form.Item>

          <Form.Item name="standard_deviation" label="Standard Deviation">
            <InputNumber min={0} max={100} />
          </Form.Item>

          <Form.Item name="mde" label="Minimum Detectable Effect (%)">
            <InputNumber min={0} max={20} />
          </Form.Item>

          <Form.Item name="arms" label="Arms">
            <InputNumber min={2} max={20} />
          </Form.Item>

          <Form.Item name="daily_interactions" label="Daily Interactions">
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item name="revenue_per_conversion" label="Revenue per unit KPI $">
            <InputNumber min={0.01} />
          </Form.Item>

          <Form.Item name="expected_uplift" label="Expected Uplift in Test Arm (%)">
            <InputNumber min={0} max={20} />
          </Form.Item>

          <Form.Item name="visualization" label="Choose Visualization">
            <Select defaultValue={"confidenceLevel"}>
              <Option value="confidenceLevel">Confidence Level</Option>
              <Option value="power">Power</Option>
              <Option value="mde">MDE</Option>
            </Select>
          </Form.Item>

          <Form.Item name="absolute">
              <Checkbox value="absolute">Absolute</Checkbox>
          </Form.Item>

          <Form.Item name="two_tailed">
              <Checkbox value="two_tailed">Two-tail Test</Checkbox>
          </Form.Item>

          <Form.Item name="equal_allocation">
              <Checkbox value="equal_allocation">Equal Traffic Allocation</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Calculate
            </Button>
          </Form.Item>
        </Form>
      </div>
      <PlotGraph data={data} layout={layout} />
    </div>
  );
};
