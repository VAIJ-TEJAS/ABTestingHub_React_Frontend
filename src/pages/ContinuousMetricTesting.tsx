/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Form,
  InputNumber,
  Checkbox,
  Button,
  Select,
  Tooltip,
  message,
  Modal,
  List,
} from "antd";
import axios from "axios";
import CountUp from "react-countup";
import PlotGraph from "../components/PlotGraph";
import { Paper } from "@mui/material";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Context } from "../context/context.provider";
import { CalculationStatus, ITest, TestStatus } from "../types/test.types";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmation } from "../components/Confirmation";
import { generateProjectName } from "../utils/hypothesis_title_generator";
import { Auth } from "../components/Auth";
import QuestionReview from "../components/QuestionReview";

const { Option } = Select;

export const ContinuousMetricTesting: React.FC = () => {
  const { userAuthenticated } = Context();

  const [isAuthVisible, setIsAuthVisible] = useState(false);
  const [userTests, setUserTests] = useState<ITest[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [isTestsModalVisible, setIsTestsModalVisible] = useState(false);

  const [isNotCalculatedSaved, setIsNotCalculatedSaved] =
    useState<CalculationStatus>(CalculationStatus.SAVED);
  const [userInitiatedCalculation, setUserInitiatedCalculation] =
    useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [testData, setTestData] = useState<ITest | null>(null);

  const [figures, setFigures] = useState<any[]>([]);
  const [selectedFigIndex, setSelectedFigIndex] = useState<number>(0);
  const [numericalResults, setNumericalResults] = useState<any>(null);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [equalAllocation, setEqualAllocation] = useState<boolean>(true);

  const openAuthModal = () => {
    setIsAuthVisible(true);
  };

  const closeAuthModal = () => {
    setIsAuthVisible(false);
  };

  const createAllocations = (armsCount: number, equalAllocation: boolean) => {
    return Array.from({ length: armsCount }, (_, index) => ({
      id: index + 1,
      value: equalAllocation ? (100 / armsCount).toFixed(2) : 0,
    }));
  };

  useEffect(() => {
    // Assuming the test ID is passed as state
    const state = location.state as { testId: number };
    if (state?.testId) {
      fetchTestDetails(state.testId);
    }
  }, [location.state]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Initialize allocations based on the arms count
    const armsCount = form.getFieldValue("arms");
    setAllocations(createAllocations(armsCount, equalAllocation));
  }, [form]);

  useEffect(() => {
    if (testData && testData.status !== TestStatus.APPR) {
      // Assuming testData contains all the required fields
      form.setFieldsValue({
        confidence_level: testData?.confidence_level ?? 95,
        power: testData?.power ?? 90,
        kpi_sd: 1.0,
        baseline_kpi: testData?.baseline_kpi ?? 10,
        mde: testData?.mde ?? 3,
        absolute: testData?.absolute ?? true,
        arms: testData?.arms ?? 2,
        daily_interactions: testData?.daily_interactions ?? 100,
        two_tailed_test: testData?.two_tailed_test ?? true,
        equal_allocation: testData?.equal_allocation ?? true,
        revenue_per_conversion: testData?.revenue_per_conversion ?? null,
        expected_uplift: testData?.expected_uplift ?? null,
      });

      setTimeout(() => {
        form.submit();
        setIsNotCalculatedSaved(CalculationStatus.SAVED);
      }, 0);
    }
  }, [testData, form]);

  const fetchTestDetails = async (id: number) => {
    try {
      const response = await axios.get(`https://abtestinghub.com:8000/tests/${id}/`, {
        headers: {
          Authorization:
            "Token " + localStorage.getItem("abtestinghub-access-token"),
        },
      });
      // Process response data to populate form, figures, or any other component state
      setTestData(response.data);
      setEqualAllocation(response.data.equal_allocation);
      setAllocations(response.data.allocations);
    } catch (error) {
      console.error("Failed to fetch test details:", error);
    }
  };

  const onFinish = async (values: any) => {
    const BASE_URL = "https://abtestinghub.com:8000";

    const payload = {
      ...values,
      allocations: {
        arms: values.arms,
        data: allocations,
      },
    };

    console.log(payload);

    axios
      .post(`${BASE_URL}/tests/calc_continuous_metric/`, payload)
      .then((response) => {
        console.log(response.data);

        const {
          "Total Sample Size": total_sample_size,
          "Sample Size Per Arm": sample_size_per_arm,
          "Days Required": days_required,
          "Weeks Required": weeks_required,
          "Control Revenue": control_revenue,
          "Test Revenue": test_revenue,
        } = response.data;

        setNumericalResults({
          total_sample_size,
          sample_size_per_arm,
          days_required,
          weeks_required,
          control_revenue,
          test_revenue,
        });

        setFigures([
          {
            name: "Confidence Level",
            data: response.data["Fig Confidence Level"].data,
            layout: response.data["Fig Confidence Level"].layout,
          },
          {
            name: "Power",
            data: response.data["Fig Power"].data,
            layout: response.data["Fig Power"].layout,
          },
          {
            name: "MDE",
            data: response.data["Fig MDE"].data,
            layout: response.data["Fig MDE"].layout,
          },
        ]);

        if (userInitiatedCalculation)
          setIsNotCalculatedSaved(CalculationStatus.CALC);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const handleAllocationChange = (id: number, value: number) => {
    setAllocations(
      allocations.map((allocation) =>
        allocation.id === id ? { ...allocation, value } : allocation
      )
    );
  };

  const handleArmsChange = (value: number) => {
    setAllocations(
      Array.from({ length: value }, (_, index) => ({
        id: index + 1,
        value: 100 / value,
      }))
    );
  };

  const handleEqualAllocationChange = (e: any) => {
    const equalAlloc = e.target.checked;
    setEqualAllocation(equalAlloc);
    if (equalAlloc) {
      const armsCount = form.getFieldValue("arms");
      setAllocations(createAllocations(armsCount, true));
    }
  };

  const saveResults = async (testData: ITest | null) => {
    if (!testData && userAuthenticated) {
      handleSignInAndFetchTests();
      return;
    }

    if (!testData) {
      openAuthModal();
      return;
    }

    // Assuming `values` contains all the input fields that were submitted.
    // You might need to store `values` in a state after `onFinish` is executed or directly use form values.
    const formValues = form.getFieldsValue();

    const payload = {
      ...formValues,
      ...numericalResults,
      allocations: allocations,
      status: TestStatus.INPR,
    };

    try {
      await axios.patch(
        `https://abtestinghub.com:8000/tests/${testData.id}/`,
        payload,
        {
          headers: {
            Authorization:
              "Token " + localStorage.getItem("abtestinghub-access-token"),
          },
        }
      );
      message.success("Results saved successfully!");
      setIsNotCalculatedSaved(CalculationStatus.SAVED);
      // Optionally, navigate away or show a success message
    } catch (error) {
      console.error("Failed to save test details:", error);
      // Optionally, handle error, such as showing an error message
    }
  };

  const handleUserSignupAndTestCreation = async () => {
    try {
      const testPayload = {
        name: generateProjectName(),
        arms: form.getFieldValue("arms") || 2,
        proportional_metric: true,
      };

      const response = await axios.post(
        "https://abtestinghub.com:8000/tests/",
        testPayload,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem(
              "abtestinghub-access-token"
            )}`,
          },
        }
      );

      setTestData(response.data);

      message.success("New test created successfully!");
      await saveResults(response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during signup and test creation:", error);
      message.error("Failed to create test.");
    }
  };

  const handleFormValuesChange = () => {
    setIsNotCalculatedSaved(CalculationStatus.IDLE);
  };

  const handleCalculateClick = () => {
    setUserInitiatedCalculation(true);
    form.submit();
    message.success("Calculations completed successfully");
  };

  const fetchUserTests = async () => {
    try {
      const response = await axios.get("https://abtestinghub.com:8000/tests/", {
        headers: {
          Authorization: `Token ${localStorage.getItem(
            "abtestinghub-access-token"
          )}`,
        },
      });
      setUserTests(response.data);
      console.log(response.data);
      setIsTestsModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch user tests:", error);
      message.error("Failed to fetch tests.");
    }
  };

  const handleSignInAndFetchTests = () => {
    fetchUserTests();
    setIsTestsModalVisible(true);
  };

  const createNewTestForUser = async () => {
    const testName = generateProjectName();
    const testPayload = {
      name: testName,
      arms: form.getFieldValue("arms") || 2,
      proportional_metric: true,
    };

    const response = await axios.post(
      "https://abtestinghub.com:8000/tests/",
      testPayload,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem(
            "abtestinghub-access-token"
          )}`,
        },
      }
    );

    await patchTestData(response.data);
    navigate("/dashboard"); // Or update the UI as needed
  };

  const overrideExistingTest = async () => {
    if (!selectedTestId) {
      message.error("No test selected.");
      return;
    }

    const testToOverride = userTests.find((test) => test.id === selectedTestId);
    if (!testToOverride) {
      message.error("Selected test not found.");
      return;
    }

    const isConfirmed = await confirmation(
      "Are you sure you want to override this test with the new data?"
    );
    if (isConfirmed) {
      await patchTestData(testToOverride);
    }
  };

  const patchTestData = async (test: ITest) => {
    const formValues = form.getFieldsValue();
    const payload = {
      ...formValues,
      ...numericalResults,
      allocations: allocations,
      status: TestStatus.INPR,
    };

    try {
      await axios.patch(`https://abtestinghub.com:8000/tests/${test.id}/`, payload, {
        headers: {
          Authorization:
            "Token " + localStorage.getItem("abtestinghub-access-token"),
        },
      });
      message.success("Test updated successfully!");
      setIsNotCalculatedSaved(CalculationStatus.SAVED);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to update test:", error);
      message.error("Failed to update test.");
    }
  };

  return (
    <div className="py-8 px-2 flex flex-col w-full justify-center items-center bg-[#f5f5f550] gap-4">
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
          renderItem={(test) => (
            <List.Item
              className={selectedTestId === test.id ? "bg-blue-100" : ""}
              actions={[
                <Button type="link" onClick={() => setSelectedTestId(test.id)}>
                  Select
                </Button>,
              ]}
            >
              {test.name}
            </List.Item>
          )}
        />
        <div className="flex w-full justify-between">
          <Button type="primary" onClick={createNewTestForUser}>
            Create New Test
          </Button>
          <Button onClick={overrideExistingTest} disabled={!selectedTestId}>
            Override Selected Test
          </Button>
        </div>
      </Modal>
      {testData && (
        <div className="container">
          <Paper className="p-4 flex justify-between items-center relative">
            <div className="font-medium">{testData?.name}</div>
            <Tooltip
              title={
                isNotCalculatedSaved === CalculationStatus.IDLE
                  ? "Inputs changed, please calculate."
                  : isNotCalculatedSaved === CalculationStatus.CALC
                  ? "New results calculated, please save."
                  : isNotCalculatedSaved === CalculationStatus.SAVED
                  ? "Test is saved and up to date."
                  : "Status unknown."
              }
            >
              <div
                className={`p-1 border rounded-full 
            ${
              isNotCalculatedSaved === CalculationStatus.IDLE
                ? "border-red-600"
                : ""
            } 
            ${
              isNotCalculatedSaved === CalculationStatus.CALC
                ? "border-yellow-600 "
                : ""
            }
            ${
              isNotCalculatedSaved === CalculationStatus.SAVED
                ? "border-green-600 "
                : ""
            }            
            `}
              >
                <div
                  className={`h-5 w-5 rounded-full 
              ${
                isNotCalculatedSaved === CalculationStatus.IDLE
                  ? "bg-red-600 animate-ping"
                  : ""
              } 
              ${
                isNotCalculatedSaved === CalculationStatus.CALC
                  ? "bg-yellow-600 animate-pulse"
                  : ""
              }
              ${
                isNotCalculatedSaved === CalculationStatus.SAVED
                  ? "bg-green-600 animate-pulse"
                  : ""
              }
              `}
                />
              </div>
            </Tooltip>
          </Paper>
        </div>
      )}
      <div className="container flex gap-4">
        <div className="flex flex-col gap-4">
          <Paper className="p-4">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onValuesChange={handleFormValuesChange}
              initialValues={{
                confidence_level: testData?.confidence_level ?? 95,
                power: testData?.power ?? 90,
                kpi_sd: 1.0,
                baseline_kpi: testData?.baseline_kpi ?? 10,
                mde: testData?.mde ?? 3,
                absolute: testData?.absolute ?? true,
                arms: testData?.arms ?? 2,
                daily_interactions: testData?.daily_interactions ?? 100,
                two_tailed_test: testData?.two_tailed_test ?? true,
                equal_allocation: testData?.equal_allocation ?? true,
                revenue_per_conversion:
                  testData?.revenue_per_conversion ?? null,
                expected_uplift: testData?.expected_uplift ?? null,
              }}
            >
              <div className="flex gap-4">
                <div className="w-60">
                  <Form.Item
                    name="confidence_level"
                    label={
                      <div className="flex w-60 justify-between ">
                        <div>{"Confidence Level | (1-\u03b1) %"}</div>
                        <div>
                          <Tooltip
                            className="text-primary"
                            title="Number of interactions users have with the product on a daily basis."
                          >
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </div>
                      </div>
                    }
                  >
                    <InputNumber min={90} max={100} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    name="baseline_kpi"
                    label={
                      <div className="flex w-60 justify-between ">
                        <div>{"KPI : Average"}</div>
                        <div>
                          <Tooltip
                            className="text-primary"
                            title="Number of interactions users have with the product on a daily basis."
                          >
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </div>
                      </div>
                    }
                  >
                    <InputNumber min={0} max={100} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    name="mde"
                    label={
                      <div className="flex w-60 justify-between ">
                        <div>{"Minimum Detectable Effect (%)"}</div>
                        <div>
                          <Tooltip
                            className="text-primary"
                            title="Number of interactions users have with the product on a daily basis."
                          >
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </div>
                      </div>
                    }
                  >
                    <InputNumber min={0} max={20} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item name="absolute" valuePropName="checked">
                    <Checkbox>
                      Absolute
                      <Tooltip
                        className="text-primary px-2"
                        title="Number of interactions users have with the product on a daily basis."
                      >
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </Checkbox>
                  </Form.Item>

                  <Form.Item name="two_tailed_test" valuePropName="checked">
                    <Checkbox>
                      Two-tail Test
                      <Tooltip
                        className="text-primary px-2"
                        title="Number of interactions users have with the product on a daily basis."
                      >
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </Checkbox>
                  </Form.Item>
                </div>
                <div className="w-60">
                  <Form.Item
                    name="power"
                    label={
                      <div className="flex w-60 justify-between ">
                        <div>{"Statistical Power (1-\u03B2) %"}</div>
                        <div>
                          <Tooltip
                            className="text-primary"
                            title="Number of interactions users have with the product on a daily basis."
                          >
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </div>
                      </div>
                    }
                  >
                    <InputNumber
                      min={80}
                      max={99.99}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="kpi_sd"
                    label={
                      <div className="flex w-60 justify-between ">
                        <div>{"KPI : Standard Deviation"}</div>
                        <div>
                          <Tooltip
                            className="text-primary"
                            title="Number of interactions users have with the product on a daily basis."
                          >
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </div>
                      </div>
                    }
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    name="daily_interactions"
                    label={
                      <div className="flex w-60 justify-between ">
                        <div>{"Daily Interactions"}</div>
                        <div>
                          <Tooltip
                            className="text-primary"
                            title="Number of interactions users have with the product on a daily basis."
                          >
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </div>
                      </div>
                    }
                  >
                    <InputNumber min={1} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    name="arms"
                    label={
                      <div className="flex w-60 justify-between ">
                        <div>{"Arms"}</div>
                        <div>
                          <Tooltip
                            className="text-primary"
                            title="Number of interactions users have with the product on a daily basis."
                          >
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </div>
                      </div>
                    }
                  >
                    <InputNumber
                      min={2}
                      max={20}
                      style={{ width: "100%" }}
                      onChange={(value) => {
                        handleArmsChange(value ?? 2);
                      }}
                    />
                  </Form.Item>

                  <Form.Item name="equal_allocation" valuePropName="checked">
                    <Checkbox
                      checked={equalAllocation}
                      onChange={handleEqualAllocationChange}
                    >
                      Equal Traffic Allocation
                      <Tooltip
                        className="text-primary px-2"
                        title="Number of interactions users have with the product on a daily basis."
                      >
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </Checkbox>
                  </Form.Item>

                  {!equalAllocation &&
                    allocations.map((allocation) => (
                      <Form.Item
                        key={allocation.id}
                        label={
                          <div className="flex w-60 justify-between ">
                            <div>
                              {`% Allocation to Test Arm #${allocation.id}`}
                            </div>
                            <div>
                              <Tooltip
                                className="text-primary"
                                title="Number of interactions users have with the product on a daily basis."
                              >
                                <QuestionCircleOutlined />
                              </Tooltip>
                            </div>
                          </div>
                        }
                      >
                        <InputNumber
                          min={0}
                          max={100}
                          value={allocation.value}
                          onChange={(value) =>
                            handleAllocationChange(allocation.id, value)
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    ))}
                </div>
              </div>
              <div>
                <div className="text-2xl font-medium py-4">
                  Revenue Calculations (Optional)
                </div>
                <div className="flex gap-4">
                  <div className="w-60">
                    <Form.Item
                      name="revenue_per_conversion"
                      label={
                        <div className="flex w-60 justify-between ">
                          <div>{"Revenue per Conversion (₹)"}</div>
                          <div>
                            <Tooltip
                              className="text-primary"
                              title="Number of interactions users have with the product on a daily basis."
                            >
                              <QuestionCircleOutlined />
                            </Tooltip>
                          </div>
                        </div>
                      }
                    >
                      <InputNumber min={0.01} style={{ width: "100%" }} />
                    </Form.Item>
                  </div>

                  <div className="w-60">
                    <Form.Item
                      name="expected_uplift"
                      label={
                        <div className="flex w-60 justify-between ">
                          <div>{"Expected Uplift in Test Arm (%)"}</div>
                          <div>
                            <Tooltip
                              className="text-primary"
                              title="Number of interactions users have with the product on a daily basis."
                            >
                              <QuestionCircleOutlined />
                            </Tooltip>
                          </div>
                        </div>
                      }
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="flex w-full justify-between">
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={handleCalculateClick}
                  >
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
          {figures.length > 0 && <QuestionReview />}
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <Paper className="p-4">
            <div className="flex">
              <div className="flex-1 space-y-4">
                <div>
                  <div className="text-sm font-medium">
                    Total Sample Size
                    <Tooltip
                      className="text-primary px-2"
                      title="Number of interactions users have with the product on a daily basis."
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </div>
                  <div className="text-4xl">
                    <CountUp
                      start={0}
                      end={numericalResults?.total_sample_size ?? 0}
                      duration={0.5}
                      separator=","
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">
                    Days Required
                    <Tooltip
                      className="text-primary px-2"
                      title="Number of interactions users have with the product on a daily basis."
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </div>
                  <div className="text-4xl">
                    <CountUp
                      start={0}
                      end={numericalResults?.days_required ?? 0}
                      duration={0.5}
                      separator=","
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">
                    Control Revenue
                    <Tooltip
                      className="text-primary px-2"
                      title="Number of interactions users have with the product on a daily basis."
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </div>
                  <div className="text-4xl">
                    <CountUp
                      start={0}
                      end={numericalResults?.control_revenue ?? 0}
                      duration={0.5}
                      separator=","
                      prefix="₹"
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="text-sm font-medium">
                    Samples Per Arm
                    <Tooltip
                      className="text-primary px-2"
                      title="Number of interactions users have with the product on a daily basis."
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </div>
                  <div className="text-4xl">
                    <CountUp
                      start={0}
                      end={numericalResults?.sample_size_per_arm ?? 0}
                      duration={0.5}
                      separator=","
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">
                    Weeks Required
                    <Tooltip
                      className="text-primary px-2"
                      title="Number of interactions users have with the product on a daily basis."
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </div>
                  <div className="text-4xl">
                    <CountUp
                      start={0}
                      end={numericalResults?.weeks_required ?? 0}
                      duration={0.5}
                      separator=","
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">
                    Test Revenue
                    <Tooltip
                      className="text-primary px-2"
                      title="Number of interactions users have with the product on a daily basis."
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </div>
                  <div className="text-4xl">
                    <CountUp
                      start={0}
                      end={numericalResults?.test_revenue}
                      duration={0.5}
                      separator=","
                      prefix="₹"
                    />
                  </div>
                  <div>
                    {((numericalResults?.test_revenue -
                      numericalResults?.control_revenue) *
                      100) /
                      numericalResults?.control_revenue >
                    0 ? (
                      <div className="text-green-600">
                        <ArrowUpOutlined />{" "}
                        {(
                          ((numericalResults?.test_revenue -
                            numericalResults?.control_revenue) *
                            100) /
                          numericalResults?.control_revenue
                        ).toFixed(2)}
                        %
                      </div>
                    ) : (
                      <div className="text-red-600">
                        <ArrowDownOutlined />{" "}
                        {(
                          ((numericalResults?.test_revenue -
                            numericalResults?.control_revenue) *
                            100) /
                          numericalResults?.control_revenue
                        ).toFixed(2)}
                        %
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Paper>
          {figures.length > 0 && (
            <div>
              <Form.Item label="Select Figure">
                <Select
                  onChange={(value) => setSelectedFigIndex(value)}
                  defaultValue={0}
                >
                  {figures.map((fig, index) => (
                    <Option key={index} value={index}>
                      {fig.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Paper className="flex w-full justify-center items-center">
                <PlotGraph
                  data={figures[selectedFigIndex].data}
                  layout={figures[selectedFigIndex].layout}
                />
              </Paper>
            </div>
          )}
          {numericalResults && (
            <>
              <Paper className="p-4 space-y-4 border-primary border">
                <div>
                  <div className="text-lg font-medium">
                    Confidence Level vs. Sample Size:
                  </div>
                  <div className="text-sm">
                    As the Confidence Level increases, there is a corresponding
                    increase in the Sample Size. The graph shows how the
                    required sample size for the experiment changes as you
                    adjust the confidence level.
                  </div>
                </div>
                <div>
                  <div className="text-lg font-medium">
                    Power vs. Sample Size:
                  </div>
                  <div className="text-sm">
                    As the Power increases, there is a corresponding increase in
                    the Sample Size. The graph shows how the required sample
                    size for the experiment changes as you adjust the power.
                  </div>
                </div>
                <div>
                  <div className="text-lg font-medium">
                    MDE vs. Sample Size:
                  </div>
                  <div className="text-sm">
                    As the Minimum Detectable Effect (MDE) decreases, there is a
                    corresponding increase in the Sample Size. The graph shows
                    how the required sample size for the experiment changes as
                    you adjust the MDE.
                  </div>
                </div>
              </Paper>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
