/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Button, Tooltip, Radio, Table } from 'antd';
import axios from 'axios';
import PlotGraph from '../components/PlotGraph';
import { Paper } from '@mui/material';
import { QuestionCircleOutlined } from '@ant-design/icons';

export const ABTesting: React.FC = () => {

  const [figure, setFigure] = useState<any>(null);
  const [numericalResults, setNumericalResults] = useState<any>(null);
  const [tableData, setTableData] = useState([]);
  const [form] = Form.useForm();
  const [armData, setArmData] = useState<any[]>([
    { visitors: 1000, conversions: 200 },
    { visitors: 1000, conversions: 240 },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onFinish = async (values: any) => {
    const BASE_URL = 'https://89.116.33.88';

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

    console.log(payload)

    axios.post(`${BASE_URL}/tests/calc_ab_metric/`, payload)
      .then(response => {

        console.log(response.data)

        const {
          arms,
          figure,
          "conversion-rates": conversion_rates,
          "p-values": p_values,
          "relative-uplift-values": relative_uplift_values,
          warnings,
          conclusion
        } = response.data;

        // Update figure data
        setFigure(figure);

        // Prepare the data for the table
        const newTableData = conversion_rates.map((rate:any) => {
          const uplift = relative_uplift_values.find((u:any)=> u.arm === rate.arm)?.value;
          const pValue = p_values.find((p:any) => p.arm === rate.arm)?.value;

          return {
            key: String.fromCharCode(64 + rate.arm), // ASCII code 65 is 'A', so 64 + arm number will give us the correct letter
            arm: String.fromCharCode(64 + rate.arm),
            conversionRate: `${rate.value}%`,
            relativeUplift: uplift !== undefined ? `${uplift}%` : '-',
            pValue: pValue !== undefined ? pValue.toFixed(5) : '-'
          };
        });

        // Update table data
        setTableData(newTableData);

        // Set the numerical results
        setNumericalResults({
          arms: arms,
          conversionRates: conversion_rates,
          pValues: p_values,
          relativeUpliftValues: relative_uplift_values,
          warnings: warnings,
          conclusion: conclusion
        });
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const handleArmsChange = (newArmsCount: number) => {
    setArmData(currentArmData => {
      const newData = [...currentArmData];
      
      if (newArmsCount < newData.length) {
        return newData.slice(0, newArmsCount); // remove arms from the end
      }
      
      for (let i = newData.length; i < newArmsCount; i++) {
        newData.push({ visitors: 1000, conversions: 200 }); // add new arms with default values
      }
      
      return newData;
    });
  };


  const columns: any = [
    {
      title: 'Arm',
      dataIndex: 'arm',
      key: 'arm',
    },
    {
      title: 'Conversion Rate',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
    },
    {
      title: 'Relative Uplift',
      dataIndex: 'relativeUplift',
      key: 'relativeUplift',
    },
    {
      title: 'p-value',
      dataIndex: 'pValue',
      key: 'pValue',
    },
  ];

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
                <Form.Item
                  name="confidence_level"
                  rules={[{ required: true, message: 'Please input the confidence level!' }]}
                  label={
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
                  }
                >
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
                <Form.Item
                  name="arms"
                  rules={[{ required: true, message: 'Please input the number of arms!' }]}
                  label={
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
                    rules={[{ required: true, message: 'Please input the number of visitors!' }]}
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
                    rules={[{ required: true, message: 'Please input the number of conversions!' }]}
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
          {numericalResults?.arms == 2 &&
            <div>
              <Paper className='flex w-full justify-center items-center'>
                <PlotGraph data={figure.data} layout={figure.layout} />
              </Paper>
            </div>
          }
          <Paper className='p-4'>
            <Table columns={columns} dataSource={tableData} pagination={false}/>
          </Paper>
          {numericalResults &&
            <>
              <Paper className='p-4 space-y-4 border-primary border'>
                <div>
                  <div className='text-lg font-medium'>Conclusion</div>
                  <div className='text-sm'>
                    {numericalResults?.conclusion}
                  </div>
                </div>
              </Paper>
            </>}
        </div>
      </div>
    </div>
  );
};
