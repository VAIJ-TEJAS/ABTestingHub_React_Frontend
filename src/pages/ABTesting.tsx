/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Button, Tooltip, Radio, Table, message, Modal, List } from 'antd';
import axios from 'axios';
import PlotGraph from '../components/PlotGraph';
import { Paper } from '@mui/material';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Context } from '../context/context.provider';
import { CalculationStatus, ITest, TestStatus } from '../types/test.types';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmation } from '../components/Confirmation';
import { generateProjectName } from '../utils/hypothesis_title_generator';
import { Auth } from '../components/Auth';

export const ABTesting: React.FC = () => {

  const { userAuthenticated } = Context()

  const [isAuthVisible, setIsAuthVisible] = useState(false);
  const [userTests, setUserTests] = useState<ITest[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [isTestsModalVisible, setIsTestsModalVisible] = useState(false);

  const [isNotCalculatedSaved, setIsNotCalculatedSaved] = useState<CalculationStatus>(CalculationStatus.SAVED)
  const [userInitiatedCalculation, setUserInitiatedCalculation] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [testData, setTestData] = useState<ITest | null>(null);

  const [figure, setFigure] = useState<any>(null);
  const [numericalResults, setNumericalResults] = useState<any>(null);
  const [tableData, setTableData] = useState([]);
  const [maxUplift, setMaxUplift] = useState<number>(0);
  const [statisticallySignificant, setStatisticallySignificant] = useState<boolean | null>(null)
  const [form] = Form.useForm();
  const [totalSampleSize, setTotalSampleSize] = useState<number | null>(null);
  const [visitorsConversionsData, setVisitorsConversionsData] = useState<any[]>([]);

  const openAuthModal = () => {
    setIsAuthVisible(true);
  };

  const closeAuthModal = () => {
    setIsAuthVisible(false);
  };

  useEffect(() => {
    // Assuming the test ID is passed as state
    const state = location.state as { testId: number };
    if (state?.testId) {
      fetchTestDetails(state.testId);
    } else {
      setVisitorsConversionsData([
        { visitors: 1000, conversions: 200 },
        { visitors: 1000, conversions: 240 }
      ])
    }
  }, [location.state]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (testData && testData.status !== TestStatus.APPR) {
      // Assuming testData contains all the required fields
      form.setFieldsValue({
        confidence_level: testData?.confidence_level ?? 95,
        arms: testData?.arms ?? 2,
        two_tailed_test: testData?.two_tailed_test ?? true,
      });

      setTimeout(() => {
        form.submit();
        setIsNotCalculatedSaved(CalculationStatus.SAVED);
      }, 0);

    }
  }, [testData, form]);

  const fetchTestDetails = async (id: number) => {

    try {
      const response = await axios.get(`https://89.116.33.88/tests/${id}/`, {
        headers: {
          'Authorization': 'Token ' + localStorage.getItem('abtestinghub-access-token')
        }
      });

      setTestData(response.data);
      if (response.data.visitors_conversions_input.toString() != '') {
        setVisitorsConversionsData(response.data.visitors_conversions_input)
      } else {
        setTotalSampleSize(response.data.total_sample_size)
        setVisitorsConversionsData([
          { visitors: response.data.total_sample_size },
          { visitors: response.data.total_sample_size },
        ])
      }

    } catch (error) {
      console.error("Failed to fetch test details:", error);
    }
  };

  const onFinish = async (values: any) => {
    const BASE_URL = 'https://89.116.33.88';

    const visitorsInput = {
      arms: values.arms,
      data: visitorsConversionsData.map((arm, index) => ({ id: index + 1, value: arm.visitors })),
    };

    const conversionsInput = {
      arms: values.arms,
      data: visitorsConversionsData.map((arm, index) => ({ id: index + 1, value: arm.conversions })),
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
          statistically_significant,
          max_uplift,
          warnings,
          conclusion
        } = response.data;


        // Prepare the data for the table
        const newTableData = conversion_rates.map((rate: any) => {
          const uplift = relative_uplift_values.find((u: any) => u.arm === rate.arm)?.value;
          const pValue = p_values.find((p: any) => p.arm === rate.arm)?.value;

          return {
            key: String.fromCharCode(64 + rate.arm), // ASCII code 65 is 'A', so 64 + arm number will give us the correct letter
            arm: String.fromCharCode(64 + rate.arm),
            conversionRate: `${rate.value}%`,
            relativeUplift: uplift !== undefined ? `${uplift}%` : '-',
            pValue: pValue !== undefined ? pValue.toFixed(5) : '-'
          };
        });


        setFigure(figure);
        setTableData(newTableData);
        setMaxUplift(max_uplift)
        setStatisticallySignificant(statistically_significant)
        setNumericalResults({
          arms,
          conversion_rates,
          p_values,
          relative_uplift_values,
          warnings,
          conclusion
        });

        if (userInitiatedCalculation)
          setIsNotCalculatedSaved(CalculationStatus.CALC);

        message.success("Calculations completed successfully")
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const handleArmsChange = (newArmsCount: number) => {
    setVisitorsConversionsData(currentArmData => {
      const newData = [...currentArmData];

      if (newArmsCount < newData.length) {
        return newData.slice(0, newArmsCount); // remove arms from the end
      }

      for (let i = newData.length; i < newArmsCount; i++) {
        newData.push({ visitors: totalSampleSize ?? 1000 }); // add new arms with default values
      }

      return newData;
    });
  };

  const saveResults = async (testData: ITest | null) => {
    if (!testData && userAuthenticated) {
      handleSignInAndFetchTests()
      return
    }

    if (!testData) {
      openAuthModal()
      return
    }

    // Assuming `values` contains all the input fields that were submitted.
    // You might need to store `values` in a state after `onFinish` is executed or directly use form values.
    const formValues = form.getFieldsValue();

    const payload = {
      ...formValues,
      ...numericalResults,
      visitors_conversions_input: visitorsConversionsData,
      max_uplift: maxUplift,
      statistically_significant: statisticallySignificant,
      status: TestStatus.CONC
    };

    try {
      await axios.patch(`https://89.116.33.88/tests/${testData.id}/`, payload, {
        headers: {
          'Authorization': 'Token ' + localStorage.getItem('abtestinghub-access-token')
        }
      });
      message.success('Results saved successfully!');
      setIsNotCalculatedSaved(CalculationStatus.SAVED);
      // Optionally, navigate away or show a success message
    } catch (error) {
      console.error('Failed to save test details:', error);
      // Optionally, handle error, such as showing an error message
    }
  };

  const handleUserSignupAndTestCreation = async () => {
    try {
      const testPayload = {
        name: generateProjectName(),
        arms: form.getFieldValue('arms') || 2,
        proportional_metric: true,
      };

      const response = await axios.post('https://89.116.33.88/tests/', testPayload, {
        headers: { Authorization: `Token ${localStorage.getItem('abtestinghub-access-token')}` },
      });

      setTestData(response.data);

      message.success('New test created successfully!');
      await saveResults(response.data);
      navigate('/dashboard')

    } catch (error) {
      console.error('Error during signup and test creation:', error);
      message.error('Failed to create test.');
    }
  };

  const handleFormValuesChange = () => {
    setIsNotCalculatedSaved(CalculationStatus.IDLE);
  };

  const handleCalculateClick = () => {
    setUserInitiatedCalculation(true);
    form.submit();
  };

  const fetchUserTests = async () => {
    try {
      const response = await axios.get('https://89.116.33.88/tests/', {
        headers: { 'Authorization': `Token ${localStorage.getItem('abtestinghub-access-token')}` },
      });
      setUserTests(response.data);
      console.log(response.data)
      setIsTestsModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch user tests:", error);
      message.error('Failed to fetch tests.');
    }
  };

  const handleSignInAndFetchTests = () => {
    fetchUserTests()
    setIsTestsModalVisible(true);
  };

  const createNewTestForUser = async () => {
    const testName = generateProjectName();
    const testPayload = {
      name: testName,
      arms: form.getFieldValue('arms') || 2,
      proportional_metric: true,
    };

    const response = await axios.post('https://89.116.33.88/tests/', testPayload, {
      headers: { 'Authorization': `Token ${localStorage.getItem('abtestinghub-access-token')}` },
    });

    await patchTestData(response.data);
    navigate('/dashboard'); // Or update the UI as needed
  };

  const overrideExistingTest = async () => {
    if (!selectedTestId) {
      message.error('No test selected.');
      return;
    }

    const testToOverride = userTests.find(test => test.id === selectedTestId);
    if (!testToOverride) {
      message.error('Selected test not found.');
      return;
    }

    const isConfirmed = await confirmation('Are you sure you want to override this test with the new data?');
    if (isConfirmed) {
      await patchTestData(testToOverride);
    }
  };

  const patchTestData = async (test: ITest) => {
    const formValues = form.getFieldsValue();
    const payload = {
      ...formValues,
      ...numericalResults,
      status: TestStatus.INPR,
    };

    try {
      await axios.patch(`https://89.116.33.88/tests/${test.id}/`, payload, {
        headers: {
          'Authorization': 'Token ' + localStorage.getItem('abtestinghub-access-token'),
        },
      });
      message.success('Test updated successfully!');
      setIsNotCalculatedSaved(CalculationStatus.SAVED);
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to update test:', error);
      message.error('Failed to update test.');
    }
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
    <div className='py-8 px-2 flex flex-col w-full justify-center items-center bg-[#f5f5f550] gap-4'>
      <Auth
        isVisible={isAuthVisible}
        onClose={closeAuthModal}
        onSignup={handleUserSignupAndTestCreation}
        onSignin={handleSignInAndFetchTests}
      />
      <Modal
        title="Select a Test"
        open={isTestsModalVisible}
        onOk={() => setIsTestsModalVisible(false)}
        onCancel={() => setIsTestsModalVisible(false)}
        footer={null}
      >
        <List
          dataSource={userTests}
          renderItem={test => (
            <List.Item
              className={selectedTestId === test.id ? 'bg-blue-100' : ''}
              actions={[
                <Button type="link" onClick={() => setSelectedTestId(test.id)}>Select</Button>,
              ]}
            >
              {test.name}
            </List.Item>
          )}
        />
        <div className='flex w-full justify-between'>
          <Button type='primary' onClick={createNewTestForUser}>Create New Test</Button>
          <Button onClick={overrideExistingTest} disabled={!selectedTestId}>Override Selected Test</Button>
        </div>
      </Modal>
      {testData &&
        <div className='container'>
          <Paper className='p-4 flex justify-between items-center relative'>
            <div className='font-medium'>
              {testData?.name}
            </div>
            <Tooltip title={
              isNotCalculatedSaved === CalculationStatus.IDLE ? 'Inputs changed, please calculate.' :
                isNotCalculatedSaved === CalculationStatus.CALC ? 'New results calculated, please save.' :
                  isNotCalculatedSaved === CalculationStatus.SAVED ? 'Test is saved and up to date.' :
                    'Status unknown.'
            }>
              <div className={`p-1 border rounded-full 
            ${isNotCalculatedSaved === CalculationStatus.IDLE ? 'border-red-600' : ''} 
            ${isNotCalculatedSaved === CalculationStatus.CALC ? 'border-yellow-600 ' : ''}
            ${isNotCalculatedSaved === CalculationStatus.SAVED ? 'border-green-600 ' : ''}            
            `}>
                <div className={`h-5 w-5 rounded-full 
              ${isNotCalculatedSaved === CalculationStatus.IDLE ? 'bg-red-600 animate-ping' : ''} 
              ${isNotCalculatedSaved === CalculationStatus.CALC ? 'bg-yellow-600 animate-pulse' : ''}
              ${isNotCalculatedSaved === CalculationStatus.SAVED ? 'bg-green-600 animate-pulse' : ''}
              `} />
              </div>
            </Tooltip>
          </Paper>
        </div>
      }
      <div className='container flex gap-4'>
        <Paper className='p-4'>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={handleFormValuesChange}
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
              {visitorsConversionsData.map((arm, index) => (
                <div key={index} className='flex gap-4'>
                  <Form.Item
                    className='w-60'
                    label={`Visitors Group ${String.fromCharCode(65 + index)}`}
                    rules={[{ required: true, message: 'Please input the number of visitors!' }]}
                    name={`visitors_arm_${index + 1}`}
                    initialValue={arm.visitors}
                  >
                    <InputNumber
                      min={0}
                      onChange={(value) =>
                        setVisitorsConversionsData(
                          visitorsConversionsData.map((data, i) =>
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
                    initialValue={arm.conversions}
                  >
                    <InputNumber
                      min={0}
                      onChange={(value) =>
                        setVisitorsConversionsData(
                          visitorsConversionsData.map((data, i) =>
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
            <div className='flex w-full justify-between'>
              <Form.Item>
                <Button type="primary" htmlType="submit" onClick={handleCalculateClick}>
                  Calculate
                </Button>
              </Form.Item>
              <>
                <Button
                  type="primary"
                  onClick={(event) => {
                    event.preventDefault();
                    saveResults(testData);
                  }}
                  disabled={isNotCalculatedSaved === CalculationStatus.IDLE}
                >
                  Save
                </Button>
              </>
            </div>
          </Form>
        </Paper>
        <div className='flex-1 flex flex-col gap-4'>
          <Paper className='p-4'>
            <Table columns={columns} dataSource={tableData} pagination={false} />
          </Paper>
          {numericalResults?.arms == 2 &&
            <div>
              <Paper className='flex w-full justify-center items-center'>
                <PlotGraph data={figure.data} layout={figure.layout} />
              </Paper>
            </div>
          }
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
