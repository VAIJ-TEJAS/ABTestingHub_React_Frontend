/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Button, Select, Tooltip, Radio } from 'antd';
import axios from 'axios';
import PlotGraph from '../components/PlotGraph';
import { Paper } from '@mui/material';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

export const ABTesting: React.FC = () => {

  const [figures, setFigures] = useState<any[]>([]);
  const [selectedFigIndex, setSelectedFigIndex] = useState<number>(0);
  const [numericalResults, setNumericalResults] = useState<any>(null);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [armData, setArmData] = useState<any[]>([
    { visitors: 1000, conversions: 200 },
    { visitors: 1000, conversions: 240 },
  ]);

  const createAllocations = (armsCount: number) => {
    const newArmData = Array.from({ length: armsCount }, (_, index) => ({
      visitors: 1000, // default values or could be dynamic based on your needs
      conversions: 200, // default values or could be dynamic based on your needs
    }));
    setArmData(newArmData);
    return newArmData.map((_, index) => ({
      id: index + 1,
      value: 0,
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Initialize allocations based on the arms count
    const armsCount = form.getFieldValue('arms');
    setAllocations(createAllocations(armsCount));
  }, [form]);

  const onFinish = async (values: any) => {
    const BASE_URL = 'http://127.0.0.1:8000';

    const visitorsInput = {
      arms: values.arms,
      data: armData.map((arm, index) => ({ id: index + 1, value: arm.visitors })),
    };

    const conversionsInput = {
      arms: values.arms,
      data: armData.map((arm, index) => ({ id: index + 1, value: arm.conversions })),
    };

    const payload = {
      visitors_input: visitorsInput,
      conversions_input: conversionsInput,
      confidence_level: values.confidence_level / 100, 
      tail: values.tail_type ? "two-tailed" : "one-tailed",
    };

    console.log(payload);

    axios.post(`${BASE_URL}/tests/calc_ab_metric/`, payload)
      .then(response => {

        console.log(response.data);

        // setNumericalResults({
        //   totalSampleSize,
        //   sampleSizePerArm,
        //   daysRequired,
        //   weeksRequired,
        //   controlRevenue,
        //   testRevenue
        // });

        // setFigures([
        //   {
        //     name: 'Confidence Level',
        //     data: response.data['Fig Confidence Level'].data,
        //     layout: response.data['Fig Confidence Level'].layout
        //   },
        //   {
        //     name: 'Power',
        //     data: response.data['Fig Power'].data,
        //     layout: response.data['Fig Power'].layout
        //   },
        //   {
        //     name: 'MDE',
        //     data: response.data['Fig MDE'].data,
        //     layout: response.data['Fig MDE'].layout
        //   }
        // ]);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const handleArmsChange = (value: number) => {
    if (value !== armData.length) {
      // Recreate the arms data with the new count
      setArmData(createAllocations(value));
      setAllocations(createAllocations(value));
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
              arms: 2,
              tail_type: true,
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
                <Form.Item name="tail_type" label="Tail Type of Hypothesis">
                  <Radio.Group>
                    <Radio value={true}>two-tailed</Radio>
                    <Radio value={false}>one-tailed</Radio>
                  </Radio.Group>
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
              </div>
            </div>
            <div>
              {armData.map((arm, index) => (
                <div key={index} className='flex gap-4'>
                  <Form.Item
                    className='w-60'
                    label={`Visitors Group ${String.fromCharCode(65 + index)}`}
                    name={`visitors_arm_${index + 1}`}
                  >
                    <InputNumber
                      min={0}
                      value={arm.visitors}
                      onChange={(value) =>
                        setArmData(
                          armData.map((data, i) =>
                            i === index ? { ...data, visitors: value } : data
                          )
                        )
                      }
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item
                    className='w-60'
                    label={`Conversions Group ${String.fromCharCode(65 + index)}`}
                    name={`conversions_arm_${index + 1}`}
                  >
                    <InputNumber
                      min={0}
                      value={arm.conversions}
                      onChange={(value) =>
                        setArmData(
                          armData.map((data, i) =>
                            i === index ? { ...data, conversions: value } : data
                          )
                        )
                      }
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </div>
              ))}
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
