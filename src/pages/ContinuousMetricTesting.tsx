/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Checkbox, Button, Select, Tooltip } from 'antd';
import axios from 'axios';
import PlotGraph from '../components/PlotGraph';
import { Paper } from '@mui/material';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

export const ContinuousMetricTesting: React.FC = () => {

  const [figures, setFigures] = useState<any[]>([]);
  const [selectedFigIndex, setSelectedFigIndex] = useState<number>(0);
  const [numericalResults, setNumericalResults] = useState<any>(null);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [equalAllocation, setEqualAllocation] = useState<boolean>(true);

  const createAllocations = (armsCount: number, equalAllocation: boolean) => {
    return Array.from({ length: armsCount }, (_, index) => ({
      id: index + 1,
      value: equalAllocation ? 100 / armsCount : 0
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Initialize allocations based on the arms count
    const armsCount = form.getFieldValue('arms');
    setAllocations(createAllocations(armsCount, equalAllocation));
  }, [form]);

  const onFinish = async (values: any) => {
    const BASE_URL = 'https://89.116.33.88';

    const payload = {
      ...values,
      allocations: {
        arms: values.arms,
        data: allocations,
      }
    };

    console.log(payload);

    axios.post(`${BASE_URL}/tests/calc_continuous_metric/`, payload)
      .then(response => {

        console.log(response.data);

        const {
          'Total Sample Size': totalSampleSize,
          'Sample Size Per Arm': sampleSizePerArm,
          'Days Required': daysRequired,
          'Weeks Required': weeksRequired,
          'Control Revenue': controlRevenue,
          'Test Revenue': testRevenue
        } = response.data;

        setNumericalResults({
          totalSampleSize,
          sampleSizePerArm,
          daysRequired,
          weeksRequired,
          controlRevenue,
          testRevenue
        });

        setFigures([
          {
            name: 'Confidence Level',
            data: response.data['Fig Confidence Level'].data,
            layout: response.data['Fig Confidence Level'].layout
          },
          {
            name: 'Power',
            data: response.data['Fig Power'].data,
            layout: response.data['Fig Power'].layout
          },
          {
            name: 'MDE',
            data: response.data['Fig MDE'].data,
            layout: response.data['Fig MDE'].layout
          }
        ]);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const handleAllocationChange = (id: number, value: number) => {
    setAllocations(allocations.map(allocation => allocation.id === id ? { ...allocation, value } : allocation));
  };

  const handleArmsChange = (value: number) => {
    setAllocations(Array.from({ length: value }, (_, index) => ({
      id: index + 1,
      value: 100 / value
    })));
  };

  const handleEqualAllocationChange = (e: any) => {
    const equalAlloc = e.target.checked;
    setEqualAllocation(equalAlloc);
    if (equalAlloc) {
      const armsCount = form.getFieldValue('arms');
      setAllocations(createAllocations(armsCount, true));
    }
  };

  return (
    <div className='py-8 px-2 flex w-full justify-center bg-[#f5f5f550]'>
      <div className='container flex gap-4'>
        <Paper className='p-4'>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              confidence_level: 95,
              power: 90,
              standard_deviation: 1.00,
              baseline_kpi: 10,
              mde: 3,
              absolute: true,
              arms: 2,
              daily_interactions: 100,
              two_tailed_test: true,
              equal_allocation: true,
              // revenue_per_conversion: 0.25,
              // expected_uplift: 3
            }}
          >
            <div className='flex gap-4'>
              <div className='w-60'>
                <Form.Item name="confidence_level" label={
                  <div className='flex w-60 justify-between '>
                    <div>
                      {"Confidence Level | (1-\u03b1) %"}
                    </div>
                    <div>
                      <Tooltip className='text-primary' title="Number of interactions users have with the product on a daily basis.">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </div>
                  </div>
                }>
                  <InputNumber min={90} max={100} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="power" label={
                  <div className='flex w-60 justify-between '>
                    <div>
                      {"Statistical Power (1-\u03B2) %"}
                    </div>
                    <div>
                      <Tooltip className='text-primary' title="Number of interactions users have with the product on a daily basis.">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </div>
                  </div>
                }>
                  <InputNumber min={90} max={100} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="baseline_kpi" label={
                  <div className='flex w-60 justify-between '>
                    <div>
                      {"KPI : Average"}
                    </div>
                    <div>
                      <Tooltip className='text-primary' title="Number of interactions users have with the product on a daily basis.">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </div>
                  </div>
                }>
                  <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="standard_deviation" label={
                  <div className='flex w-60 justify-between '>
                    <div>
                      {"KPI : Standard Deviation"}
                    </div>
                    <div>
                      <Tooltip className='text-primary' title="Number of interactions users have with the product on a daily basis.">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </div>
                  </div>
                }>
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="mde" label={
                  <div className='flex w-60 justify-between '>
                    <div>
                      {"Minimum Detectable Effect (%)"}
                    </div>
                    <div>
                      <Tooltip className='text-primary' title="Number of interactions users have with the product on a daily basis.">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </div>
                  </div>
                }>
                  <InputNumber min={0} max={20} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="daily_interactions" label={
                  <div className='flex w-60 justify-between '>
                    <div>
                      {"Daily Interactions"}
                    </div>
                    <div>
                      <Tooltip className='text-primary' title="Number of interactions users have with the product on a daily basis.">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </div>
                  </div>
                }>
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </div>
              <div className='w-60'>
                <Form.Item name="arms" label={
                  <div className='flex w-60 justify-between '>
                    <div>
                      {"Arms"}
                    </div>
                    <div>
                      <Tooltip className='text-primary' title="Number of interactions users have with the product on a daily basis.">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </div>
                  </div>
                }>
                  <InputNumber min={2} max={20} style={{ width: '100%' }} onChange={(value) => {
                    handleArmsChange(value ?? 2)
                  }} />
                </Form.Item>

                <Form.Item name="absolute" valuePropName="checked">
                  <Checkbox>
                    Absolute
                    <Tooltip className='text-primary px-2' title="Number of interactions users have with the product on a daily basis.">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Checkbox>
                </Form.Item>

                <Form.Item name="two_tailed_test" valuePropName="checked">
                  <Checkbox>
                    Two-tail Test
                    <Tooltip className='text-primary px-2' title="Number of interactions users have with the product on a daily basis.">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Checkbox>
                </Form.Item>

                <Form.Item name="equal_allocation" valuePropName="checked">
                  <Checkbox checked={equalAllocation} onChange={handleEqualAllocationChange}>
                    Equal Traffic Allocation
                    <Tooltip className='text-primary px-2' title="Number of interactions users have with the product on a daily basis.">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Checkbox>
                </Form.Item>

                {!equalAllocation &&
                  allocations.map((allocation) => (
                    <Form.Item key={allocation.id} label={
                      <div className='flex w-60 justify-between '>
                        <div>
                          {`% Allocation to Test Arm #${allocation.id}`}
                        </div>
                        <div>
                          <Tooltip className='text-primary' title="Number of interactions users have with the product on a daily basis.">
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </div>
                      </div>
                    }>
                      <InputNumber
                        min={0}
                        max={100}
                        value={allocation.value}
                        onChange={(value) => handleAllocationChange(allocation.id, value)}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  ))
                }
              </div>
            </div>
            <div>
              <div className='text-2xl font-medium py-4'>
                Revenue Calculations (Optional)
              </div>
              <div className='flex gap-4'>
                <div className='w-60'>
                  <Form.Item name="revenue_per_conversion" label={
                    <div className='flex w-60 justify-between '>
                      <div>
                        {"Revenue per Conversion ($)"}
                      </div>
                      <div>
                        <Tooltip className='text-primary' title="Number of interactions users have with the product on a daily basis.">
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </div>
                    </div>
                  }>
                    <InputNumber min={0.01} style={{ width: '100%' }} />
                  </Form.Item>
                </div>

                <div className='w-60'>
                  <Form.Item name="expected_uplift" label={
                    <div className='flex w-60 justify-between '>
                      <div>
                        {"Expected Uplift in Test Arm (%)"}
                      </div>
                      <div>
                        <Tooltip className='text-primary' title="Number of interactions users have with the product on a daily basis.">
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </div>
                    </div>
                  }>
                    <InputNumber min={0} max={100} style={{ width: '100%' }} />
                  </Form.Item>
                </div>
              </div>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Calculate
              </Button>
            </Form.Item>
          </Form>
        </Paper>
        <div className='flex-1 flex flex-col gap-4'>
          {figures.length > 0 &&
            <div>
              <Form.Item label="Select Figure">
                <Select onChange={(value) => setSelectedFigIndex(value)} defaultValue={0}>
                  {figures.map((fig, index) => (
                    <Option key={index} value={index}>{fig.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Paper className='flex w-full justify-center items-center'>
                <PlotGraph data={figures[selectedFigIndex].data} layout={figures[selectedFigIndex].layout} />
              </Paper>
            </div>
          }
          <Paper className='p-4'>
            <div className='flex'>
              <div className='flex-1 space-y-4'>
                <div>
                  <div className='text-sm font-medium'>
                    Total Sample Size
                    <Tooltip className='text-primary px-2' title="Number of interactions users have with the product on a daily basis.">
                      <QuestionCircleOutlined />
                    </Tooltip></div>
                  <div className='text-4xl'>
                    {numericalResults?.totalSampleSize.toLocaleString() ?? "_._"}
                  </div>
                </div>
                <div>
                  <div className='text-sm font-medium'>
                    Days Required
                    <Tooltip className='text-primary px-2' title="Number of interactions users have with the product on a daily basis.">
                      <QuestionCircleOutlined />
                    </Tooltip></div>
                  <div className='text-4xl'>
                    {numericalResults?.daysRequired.toLocaleString() ?? "_._"}
                  </div>
                </div>
                <div>
                  <div className='text-sm font-medium'>
                    Control Revenue
                    <Tooltip className='text-primary px-2' title="Number of interactions users have with the product on a daily basis.">
                      <QuestionCircleOutlined />
                    </Tooltip></div>
                  <div className='text-4xl'>
                    {numericalResults?.controlRevenue?.toLocaleString() ?? "_._"}
                  </div>
                </div>
              </div>
              <div className='flex-1 space-y-4'>
                <div>
                  <div className='text-sm font-medium'>
                    Samples Per Arm
                    <Tooltip className='text-primary px-2' title="Number of interactions users have with the product on a daily basis.">
                      <QuestionCircleOutlined />
                    </Tooltip></div>
                  <div className='text-4xl'>
                    {numericalResults?.sampleSizePerArm.toLocaleString() ?? "_._"}
                  </div>
                </div>
                <div>
                  <div className='text-sm font-medium'>
                    Weeks Required
                    <Tooltip className='text-primary px-2' title="Number of interactions users have with the product on a daily basis.">
                      <QuestionCircleOutlined />
                    </Tooltip></div>
                  <div className='text-4xl'>
                    {numericalResults?.weeksRequired.toLocaleString() ?? "_._"}
                  </div>
                </div>
                <div>
                  <div className='text-sm font-medium'>
                    Test Revenue
                    <Tooltip className='text-primary px-2' title="Number of interactions users have with the product on a daily basis.">
                      <QuestionCircleOutlined />
                    </Tooltip></div>
                  <div className='text-4xl'>
                    {numericalResults?.testRevenue?.toLocaleString() ?? "_._"}
                  </div>
                </div>
              </div>
            </div>
          </Paper>
          {numericalResults &&
            <>
              <Paper className='p-4 space-y-4 border-primary border'>
                <div>
                  <div className='text-lg font-medium'>Confidence Level vs. Sample Size:</div>
                  <div className='text-sm'>
                    As the Confidence Level increases, there is a corresponding increase in the Sample Size. The graph shows how the required sample size for the experiment changes as you adjust the confidence level.
                  </div>
                </div>
                <div>
                  <div className='text-lg font-medium'>Power vs. Sample Size:</div>
                  <div className='text-sm'>
                    As the Power increases, there is a corresponding increase in the Sample Size. The graph shows how the required sample size for the experiment changes as you adjust the power.
                  </div>
                </div>
                <div>
                  <div className='text-lg font-medium'>MDE vs. Sample Size:</div>
                  <div className='text-sm'>
                    As the Minimum Detectable Effect (MDE) decreases, there is a corresponding increase in the Sample Size. The graph shows how the required sample size for the experiment changes as you adjust the MDE.
                  </div>
                </div>
              </Paper>
            </>}
        </div>
      </div>
    </div>
  );
};
