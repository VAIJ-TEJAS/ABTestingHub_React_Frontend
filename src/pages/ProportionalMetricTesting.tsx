/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Form,
  InputNumber,
  Checkbox,
  Button,
  Select,
  Tooltip,
  message,
  List,
  Modal,
} from "antd";
import axios from "axios";
import CountUp from "react-countup";
import { Fab, Paper } from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import PlotGraph from "../components/PlotGraph";
import { CalculationStatus, ITest, TestStatus } from "../types/test.types";
import { Auth } from "../components/Auth";
import { generateProjectName } from "../utils/hypothesis_title_generator";
import { confirmation } from "../components/Confirmation";
import { Context } from "../context/context.provider";
import QuestionReview from "../components/QuestionReview";

const { Option } = Select;

export const ProportionalMetricTesting: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const { userAuthenticated, rates, conversionSymbol, conversionNum } =
    Context();
  console.log(rates);

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
  const [testDataCopy, setTestDataCopy] = useState<ITest | null>(null);

  const [figures, setFigures] = useState<any[]>([]);
  const [selectedFigIndex, setSelectedFigIndex] = useState<number>(0);
  const [numericalResults, setNumericalResults] = useState<any>(null);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [equalAllocation, setEqualAllocation] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const openAuthModal = () => {
    setIsAuthVisible(true);
  };

  const closeAuthModal = () => {
    setIsAuthVisible(false);
  };

  const createAllocations = (armsCount: number, equalAllocation: boolean) => {
    return Array.from({ length: armsCount }, (_, index) => ({
      id: index + 1,
      value: parseInt(equalAllocation ? (100 / armsCount).toFixed(2) : "0"),
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
    console.log(allocations);
  }, [form]);

  useEffect(() => {
    if (testData) {
      // Assuming testData contains all the required fields
      form.setFieldsValue({
        confidence_level: testData?.confidence_level ?? 95,
        power: testData?.power ?? 90,
        baseline_conversion_rate: testData?.baseline_conversion_rate ?? 10,
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

  useEffect(() => {
    console.log(allocations);
    const verifyTotalIs100 = (allocations: any) => {
      const total = allocations.reduce((sum: any, allocation: any) => {
        return sum + parseFloat(allocation.value);
      }, 0);

      if (total !== 100 && allocations.length) {
        setError("The sum of the values must be 100!");
      } else {
        setError(null);
      }
    };

    verifyTotalIs100(allocations);
  }, [allocations]);

  const fetchTestDetails = async (id: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/tests/${id}/`,
        {
          headers: {
            Authorization:
              "Token " + localStorage.getItem("abtestinghub-access-token"),
          },
        }
      );

      setTestData(response.data);
      setEqualAllocation(response.data.equal_allocation);
      if (response.data.allocations.toString() != "") {
        setAllocations(response.data.allocations);
      }
    } catch (error) {
      console.error("Failed to fetch test details:", error);
    }
  };

  const onFinish = async (values: any) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const payload = {
      ...values,
      allocations: {
        arms: values.arms,
        data: allocations,
      },
    };

    axios
      .post(`${BASE_URL}/tests/calc_proportional_metric/`, payload)
      .then((response) => {
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
        message.success("Calculations completed successfully");

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
        value: (100 / value).toFixed(2),
      }))
    );
  };

  const handleEqualAllocationChange = (e: any) => {
    const equalAlloc = e.target.checked;

    setEqualAllocation(equalAlloc);
    console.log(equalAllocation);

    form.setFieldsValue({ equal_allocation: equalAlloc });
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
        `${import.meta.env.VITE_BASE_URL}/tests/${testData.id}/`,
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
        `${import.meta.env.VITE_BASE_URL}/tests/`,
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

  const handleFormValuesChange = (_value: any, allValues: any) => {
    setTestDataCopy(allValues);
    setIsNotCalculatedSaved(CalculationStatus.IDLE);
  };

  const handleCalculateClick = () => {
    setUserInitiatedCalculation(true);
    // form.submit();
  };

  const fetchUserTests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/tests/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem(
              "abtestinghub-access-token"
            )}`,
          },
        }
      );
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
      `${import.meta.env.VITE_BASE_URL}/tests/`,
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
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/tests/${test.id}/`,
        payload,
        {
          headers: {
            Authorization:
              "Token " + localStorage.getItem("abtestinghub-access-token"),
          },
        }
      );
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
      <QuestionReview isVisible={isModalVisible} onClose={closeModal} />
      {figures.length > 0 && (
        <Fab
          color="primary"
          aria-label="feedback"
          style={{ position: "fixed", bottom: 20, right: 20 }}
          onClick={showModal}
        >
          <FeedbackIcon />
        </Fab>
      )}
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

      <div className="container flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col gap-4">
          <div
            className="p-4 border-2 border-secondary rounded-lg bg-white"
            style={{ boxShadow: "0px 10px 35px 0px #00000040" }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onValuesChange={handleFormValuesChange}
              initialValues={{
                confidence_level: testData?.confidence_level ?? 95,
                power: testData?.power ?? 80,
                baseline_conversion_rate:
                  testData?.baseline_conversion_rate ?? 10,
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
                <div className="w-full lg:w-64">
                  <Form.Item
                    name="confidence_level"
                    label={
                      <div className="flex w-full lg:w-64 justify-between ">
                        <div>{"Confidence Level | (1-\u03b1) %"}</div>
                        <div>
                          <Tooltip
                            overlayInnerStyle={{ width: "600px" }}
                            className="text-primary"
                            title={
                              <span>
                                <strong>
                                  The Confidence Level in Statistics
                                </strong>
                                <br />
                                <br />
                                The confidence level is a statistical concept
                                that represents the level of certainty or
                                reliability associated with an estimate. It is
                                often expressed as a percentage and is commonly
                                used in the context of confidence intervals.
                                <br />
                                <br />
                                For example, a <em>
                                  95% confidence level
                                </em>{" "}
                                implies that if we were to conduct the same
                                experiment or sampling procedure multiple times,
                                we would expect the calculated confidence
                                interval to contain the true population
                                parameter in about 95% of those experiments.
                              </span>
                            }
                          >
                            <QuestionCircleOutlined className="mx-2 lg:mx-0" />
                          </Tooltip>
                        </div>
                      </div>
                    }
                  >
                    <InputNumber min={90} max={100} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    name="baseline_conversion_rate"
                    label={
                      <div className="flex w-full lg:w-64 justify-between ">
                        <div>{"Baseline Conversion Rate (%)"}</div>
                        <div>
                          <Tooltip
                            overlayInnerStyle={{ width: "600px" }}
                            className="text-primary"
                            title={
                              <span className="no-tailwind">
                                <strong>Baseline Conversion Rate</strong>
                                <br />
                                <br />
                                The baseline conversion rate is a fundamental
                                metric in experimental design, particularly in
                                A/B testing and other conversion-focused
                                studies. It represents the initial or existing
                                rate at which a desired outcome occurs before
                                implementing any changes or interventions.
                                <br />
                                <br />
                                Understanding the baseline conversion rate is
                                crucial for several reasons:
                                <br />
                                <ul>
                                  <li>
                                    <strong>Benchmarking</strong>: It serves as
                                    a benchmark against which the impact of
                                    changes can be compared. The goal is often
                                    to improve or optimize the conversion rate
                                    from this baseline.
                                  </li>
                                  <li>
                                    <strong>Effect Size Calculation</strong>:
                                    When calculating the Minimum Detectable
                                    Effect (MDE), researchers often use the
                                    baseline conversion rate as a reference
                                    point. The MDE is the minimum change in
                                    conversion rate that the study aims to
                                    detect.
                                  </li>
                                  <li>
                                    <strong>Power Calculation</strong>: In
                                    conjunction with the effect size, the
                                    baseline conversion rate contributes to the
                                    determination of the required sample size
                                    and statistical power of the study.
                                  </li>
                                </ul>
                                For example, if a website has a baseline
                                conversion rate of 10%, and a researcher aims to
                                detect a minimum 1% improvement, the baseline
                                conversion rate is a critical factor in
                                designing the experiment and understanding the
                                practical significance of the results.
                              </span>
                            }
                          >
                            <QuestionCircleOutlined className="mx-2 lg:mx-0" />
                          </Tooltip>
                        </div>
                      </div>
                    }
                  >
                    <InputNumber min={0} max={100} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    name="daily_interactions"
                    label={
                      <div className="flex w-full lg:w-64 justify-between ">
                        <div>{"Daily Interactions"}</div>
                        <div>
                          <Tooltip
                            overlayInnerStyle={{ width: "600px" }}
                            className="text-primary"
                            title={
                              <span className="no-tailwind">
                                <strong>Daily Interactions</strong>
                                <br />
                                <br />
                                In various contexts, particularly in user
                                experience analysis, social media analytics, and
                                customer engagement studies, "daily
                                interactions" refer to the number of
                                interactions or engagements that users or
                                customers have with a product, platform, or
                                service on a daily basis.
                                <br />
                                <br />
                                Key points about daily interactions include:
                                <br />
                                <ul>
                                  <li>
                                    <strong>User Engagement</strong>: Daily
                                    interactions are a measure of how actively
                                    users interact with a system or platform.
                                    This can include actions such as clicks,
                                    views, likes, comments, or any other
                                    relevant interactions.
                                  </li>
                                  <li>
                                    <strong>Performance Metric</strong>:
                                    Monitoring daily interactions is often a key
                                    performance metric for platforms aiming to
                                    understand user behavior, measure user
                                    satisfaction, or evaluate the impact of
                                    changes.
                                  </li>
                                  <li>
                                    <strong>Trend Analysis</strong>: Changes in
                                    the volume of daily interactions over time
                                    can provide valuable insights into the
                                    effectiveness of features, campaigns, or
                                    user interface modifications.
                                  </li>
                                  <li>
                                    <strong>Segmentation</strong>: Analyzing
                                    daily interactions across different user
                                    segments or cohorts can reveal patterns and
                                    preferences among specific user groups.
                                  </li>
                                </ul>
                                For example, in a social media platform, daily
                                interactions could encompass the number of
                                posts, likes, comments, and shares that users
                                generate each day. Monitoring these interactions
                                is crucial for optimizing user experience and
                                platform performance.
                                <br />
                                <br />
                                Understanding daily interactions is essential
                                for making data-driven decisions, improving user
                                engagement, and enhancing the overall user
                                journey.
                              </span>
                            }
                          >
                            <QuestionCircleOutlined className="mx-2 lg:mx-0" />
                          </Tooltip>
                        </div>
                      </div>
                    }
                  >
                    <InputNumber min={1} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item name="absolute" valuePropName="checked">
                    <Checkbox>
                      Absolute
                      <Tooltip
                        overlayInnerStyle={{ width: "600px" }}
                        className="text-primary px-2"
                        title={
                          <span className="no-tailwind">
                            <strong>
                              Absolute vs. Relative Minimum Detectable Effect
                              (MDE)
                            </strong>
                            <br />
                            <br />
                            <em>Definition:</em>
                            <br />
                            <ul>
                              <li>
                                <strong>Absolute MDE</strong>: Represents the
                                minimum change or difference in an absolute
                                metric, such as a fixed amount of revenue,
                                conversion rate, or engagement.
                              </li>
                              <li>
                                <strong>Relative MDE</strong>: Represents the
                                minimum change or difference in a metric
                                relative to its baseline value, often expressed
                                as a percentage.
                              </li>
                            </ul>
                            <em>Example:</em> Suppose you're conducting an A/B
                            test for an e-commerce website's conversion rate.
                            <br />
                            <ul>
                              <li>
                                <strong>Absolute MDE</strong>: Aiming to detect
                                an absolute improvement of 2% in the conversion
                                rate, regardless of the initial conversion rate
                                value. For instance, from 10% to 12%.
                              </li>
                              <li>
                                <strong>Relative MDE</strong>: Aiming to detect
                                a relative improvement of 20% in the conversion
                                rate. In this case, the improvement is defined
                                relative to the baseline value. For instance,
                                from 10% to 12% (a 20% increase).
                              </li>
                            </ul>
                            <strong>Considerations:</strong>
                            <br />
                            <ul>
                              <li>
                                <strong>Use Case</strong>: The choice between
                                absolute and relative MDE depends on the context
                                and the metric's nature. Absolute MDE is often
                                used when the focus is on a specific fixed
                                improvement, while relative MDE provides
                                flexibility for varying baseline values.
                              </li>
                              <li>
                                <strong>Interpretability</strong>: Absolute MDE
                                is straightforward to interpret, as it directly
                                represents the desired change. Relative MDE is
                                useful when the impact is more meaningful
                                relative to the current state.
                              </li>
                            </ul>
                            Understanding whether to use absolute or relative
                            MDE is crucial in setting realistic goals and
                            interpreting the significance of observed effects in
                            an experiment.
                          </span>
                        }
                      >
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </Checkbox>
                  </Form.Item>

                  <Form.Item name="two_tailed_test" valuePropName="checked">
                    <Checkbox>
                      Two-tail Test
                      <Tooltip
                        overlayInnerStyle={{ width: "600px" }}
                        className="text-primary px-2"
                        title={
                          <span className="no-tailwind">
                            <strong>Tail of a Test</strong>
                            <br />
                            <br />
                            <em>Definition:</em> The "tail" of a statistical
                            test refers to the region(s) in the probability
                            distribution under the null hypothesis where extreme
                            values are considered evidence against the null
                            hypothesis. Statistical tests are classified as
                            one-tailed or two-tailed based on the number of
                            tails considered.
                            <br />
                            <ul>
                              <li>
                                <strong>One-Tailed Test</strong>: Focuses on
                                extreme values in one direction (either the
                                upper or lower tail) of the distribution. It is
                                used when the hypothesis specifies a directional
                                change.
                              </li>
                              <li>
                                <strong>Two-Tailed Test</strong>: Considers
                                extreme values in both directions of the
                                distribution. It is used when the hypothesis
                                does not specify a directional change, and
                                interest lies in deviations from the null
                                hypothesis in either direction.
                              </li>
                            </ul>
                            <em>Example:</em> Suppose you're conducting a
                            hypothesis test to determine if a new drug has a
                            different effect than a placebo.
                            <br />
                            <ul>
                              <li>
                                <strong>One-Tailed Test</strong>: If the
                                hypothesis predicts that the new drug increases
                                the observed effect, a one-tailed test focuses
                                on extreme values in the upper tail of the
                                distribution.
                              </li>
                              <li>
                                <strong>Two-Tailed Test</strong>: If the
                                hypothesis is agnostic about the direction of
                                the effect (increase or decrease), a two-tailed
                                test considers extreme values in both the upper
                                and lower tails of the distribution.
                              </li>
                            </ul>
                            <strong>Considerations:</strong>
                            <br />
                            <ul>
                              <li>
                                <strong>Directional Hypotheses</strong>: Use a
                                one-tailed test when the research hypothesis
                                specifies a clear direction of the effect.
                              </li>
                              <li>
                                <strong>Non-Directional Hypotheses</strong>: Use
                                a two-tailed test when the research hypothesis
                                is non-directional, and you want to detect
                                deviations from the null hypothesis in either
                                direction.
                              </li>
                            </ul>
                            Understanding the tail of a test is crucial for
                            selecting the appropriate statistical test and
                            interpreting the results in the context of the
                            research question.
                          </span>
                        }
                      >
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </Checkbox>
                  </Form.Item>
                </div>
                <div className="w-full lg:w-64">
                  <Form.Item
                    name="power"
                    label={
                      <div className="flex w-full lg:w-64 justify-between ">
                        <div>{"Statistical Power (1-\u03B2) %"}</div>
                        <div>
                          <Tooltip
                            overlayInnerStyle={{ width: "600px" }}
                            className="text-primary"
                            title={
                              <span>
                                <strong>The Power of a Statistical Test</strong>
                                <br />
                                <br />
                                Power is a critical concept in statistical
                                testing, representing the probability of
                                correctly rejecting a false null hypothesis. It
                                is denoted as (1-β), where (β) is the
                                probability of committing a Type II error.
                                <br />
                                <br />
                                In practical terms, a statistical test with
                                higher power is more likely to detect a true
                                effect when it exists. Power depends on factors
                                such as the chosen significance level (\u03B1),
                                the effect size, and the sample size.
                                <br />
                                <br />
                                Researchers aim for high power to ensure that
                                their tests can reliably detect meaningful
                                effects. A common goal is to achieve a power of
                                at least 80% or 0.80, indicating an 80% chance
                                of correctly rejecting a false null hypothesis.
                                <br />
                                <br />
                                Understanding and maximizing power are crucial
                                in designing experiments to ensure that they
                                have sufficient sensitivity to detect the
                                effects of interest.
                              </span>
                            }
                          >
                            <QuestionCircleOutlined className="mx-2 lg:mx-0" />
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
                    name="mde"
                    label={
                      <div className="flex w-full lg:w-64 justify-between ">
                        <div>{"Minimum Detectable Effect (%)"}</div>
                        <div>
                          <Tooltip
                            overlayInnerStyle={{ width: "600px" }}
                            className="text-primary"
                            title={
                              <span>
                                <strong>Minimum Detectable Effect (MDE)</strong>
                                <br />
                                <br />
                                The Minimum Detectable Effect (MDE) is a crucial
                                concept in experimental design and statistical
                                testing. It refers to the smallest effect size
                                that a study is designed to detect with a
                                specified level of power.
                                <br />
                                <br />
                                In A/B testing and other experimental studies,
                                researchers define the MDE based on the smallest
                                meaningful difference they want to be able to
                                detect. It represents the threshold below which
                                the study may not have the statistical power to
                                identify a significant effect.
                                <br />
                                <br />
                                Researchers need to carefully consider and
                                determine an appropriate MDE during the planning
                                phase of an experiment. Choosing a reasonable
                                and practical MDE ensures that the study is
                                adequately powered to detect effects that are of
                                practical significance.
                                <br />
                                <br />
                                For example, if a researcher wants to detect a
                                minimum change in conversion rate on a website,
                                the MDE would be the smallest change in
                                conversion rate that the study is designed to
                                detect with a specified level of confidence and
                                power.
                              </span>
                            }
                          >
                            <QuestionCircleOutlined className="mx-2 lg:mx-0" />
                          </Tooltip>
                        </div>
                      </div>
                    }
                  >
                    <InputNumber min={0} max={20} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    name="arms"
                    label={
                      <div className="flex w-full lg:w-64 justify-between ">
                        <div>{"Arms"}</div>
                        <div>
                          <Tooltip
                            overlayInnerStyle={{ width: "600px" }}
                            className="text-primary"
                            title={
                              <span className="no-tailwind">
                                <strong>Arms of an Experiment</strong>
                                <br />
                                <br />
                                In experimental design, particularly in clinical
                                trials, A/B testing, and other comparative
                                studies, the term "arms" refers to the different
                                groups or conditions that participants are
                                assigned to. Each arm represents a distinct set
                                of conditions, interventions, or variations
                                being tested.
                                <br />
                                <br />
                                Key points about the arms of an experiment
                                include:
                                <br />
                                <ul>
                                  <li>
                                    <strong>Treatment Groups</strong>: Arms
                                    typically consist of different treatment
                                    groups or conditions. For example, in an A/B
                                    test, there may be an experimental group
                                    (treatment) and a control group.
                                  </li>
                                  <li>
                                    <strong>Randomization</strong>: Participants
                                    are often randomly assigned to different
                                    arms to minimize biases and ensure that the
                                    groups are comparable at the start of the
                                    experiment.
                                  </li>
                                  <li>
                                    <strong>Comparative Analysis</strong>: The
                                    primary objective of having multiple arms is
                                    to compare the outcomes or effects of
                                    different conditions. This enables
                                    researchers to assess the impact of
                                    interventions and make informed conclusions.
                                  </li>
                                  <li>
                                    <strong>Control Group</strong>: One common
                                    configuration involves a control arm and one
                                    or more experimental arms. The control arm
                                    provides a baseline against which the
                                    effects of the interventions in the
                                    experimental arms are measured.
                                  </li>
                                </ul>
                                For example, in a drug trial, there might be
                                three arms: a placebo arm (control), a low-dose
                                drug arm, and a high-dose drug arm. Comparing
                                outcomes across these arms helps determine the
                                efficacy of the drug.
                                <br />
                                <br />
                                Understanding and carefully designing the arms
                                of an experiment are critical for drawing valid
                                conclusions and making evidence-based decisions.
                              </span>
                            }
                          >
                            <QuestionCircleOutlined className="mx-2 lg:mx-0" />
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
                        title="Do you wish to allocate equal traffic to your control and all your test arms?"
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
                          <div className="flex w-full lg:w-64 justify-between ">
                            <div>
                              {`% Allocation to Test Arm #${allocation.id}`}
                            </div>
                            <div>
                              <Tooltip
                                className="text-primary"
                                title="Percentage traffic allocated to the Control group"
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
                  {error && (
                    <Form.Item
                      wrapperCol={{ offset: 8, span: 16 }}
                      className="m-0"
                    >
                      <div style={{ color: "red" }} className="m-0">
                        {error}
                      </div>
                    </Form.Item>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xl font-sans py-4">
                  Revenue Calculations (Optional)
                </div>
                <div className="flex gap-4">
                  <div className="w-full lg:w-64">
                    <Form.Item
                      name="revenue_per_conversion"
                      label={
                        <div className="flex w-full lg:w-64 justify-between ">
                          <div>{`Revenue per Conversion (${conversionSymbol})`}</div>
                          <div>
                            <Tooltip
                              overlayInnerStyle={{ width: "600px" }}
                              className="text-primary"
                              title={
                                <span>
                                  <strong>Revenue per Conversion</strong>
                                  <br />
                                  <br />
                                  <em>Definition</em>: Revenue per Conversion is
                                  a financial metric that calculates the average
                                  revenue generated for each successful
                                  conversion or transaction on a website or
                                  e-commerce portal. It is computed by dividing
                                  the total revenue by the number of completed
                                  conversions.
                                  <br />
                                  <br />
                                  <em>Example</em>: If an e-commerce portal
                                  generates 100 Dollars in total revenue from
                                  2000 completed transactions, Then revenue per
                                  conversion is $0.05.
                                </span>
                              }
                            >
                              <QuestionCircleOutlined className="mx-2 lg:mx-0" />
                            </Tooltip>
                          </div>
                        </div>
                      }
                    >
                      <InputNumber min={0.01} style={{ width: "100%" }} />
                    </Form.Item>
                  </div>

                  <div className="w-full lg:w-64">
                    <Form.Item
                      name="expected_uplift"
                      label={
                        <div className="flex w-full lg:w-64 justify-between ">
                          <div>{"Expected Uplift in Test Arm (%)"}</div>
                          <div>
                            <Tooltip
                              overlayInnerStyle={{ width: "600px" }}
                              className="text-primary"
                              title={
                                <span>
                                  <strong>Expected Uplift in Test Arms:</strong>
                                  <br />
                                  <br />
                                  This is the value of uplift
                                  (absolute/relative) that the experimenter
                                  predicts to see in the test arms. This value
                                  can be a guess which can be updated later once
                                  real data comes in. This value is used to
                                  compute the revenue estimates during the
                                  experiment period.
                                </span>
                              }
                            >
                              <QuestionCircleOutlined className="mx-2 lg:mx-0" />
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
                    disabled={!!error}
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
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div
            className="p-4 border-2 border-secondary rounded-lg bg-white"
            style={{ boxShadow: "0px 10px 35px 0px #00000040" }}
          >
            <div className="flex">
              <div className="flex-1 space-y-4">
                <div>
                  <div className="text-sm font-medium">
                    Total Sample Size
                    <Tooltip
                      className="text-primary px-2"
                      title={`The necessary sample size for conducting a test at a ${
                        testDataCopy?.power ?? 90
                      }% power, aiming to detect a ${
                        testDataCopy?.mde ?? 3
                      }% difference with ${
                        testDataCopy?.confidence_level ?? 90
                      }% confidence`}
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
                      title={`Total number of days required to get ${(
                        numericalResults?.total_sample_size ?? 0
                      ).toLocaleString()} samples if ${
                        testDataCopy?.daily_interactions ?? 100
                      } daily visitors are allocated to the A/B test.`}
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
                      title="Revenue will only be calculated if you enter both revenue per conversion and expected uplift."
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </div>
                  <div className="text-4xl">
                    {conversionSymbol}
                    <CountUp
                      start={0}
                      end={
                        numericalResults?.control_revenue * conversionNum ?? 0
                      }
                      duration={0.5}
                      separator=","
                      // prefix={conversionName}
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
                      title="Required number of samples for each Arm of the Experiment."
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
                      title={`Total number of weeks required to get ${(
                        numericalResults?.total_sample_size ?? 0
                      ).toLocaleString()} samples if ${
                        testDataCopy?.daily_interactions ?? 100
                      } daily visitors are allocated to the A/B test.`}
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
                      title="Revenue will only be calculated if you enter both revenue per conversion and expected uplift."
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </div>
                  <div className="text-4xl">
                    {conversionSymbol}
                    <CountUp
                      start={0}
                      end={numericalResults?.test_revenue * conversionNum}
                      duration={0.5}
                      separator=","
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
            {figures.length > 0 && (
              <div className="py-4">
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
                <div className="flex w-full justify-center items-center">
                  <PlotGraph
                    data={figures[selectedFigIndex].data}
                    layout={figures[selectedFigIndex].layout}
                  />
                </div>
              </div>
            )}
            {numericalResults && (
              <>
                <div className="p-4 space-y-4">
                  {selectedFigIndex === 0 && (
                    <div>
                      <div className="text-lg font-medium">
                        Confidence Level vs. Sample Size:
                      </div>
                      <div className="text-sm">
                        As the Confidence Level increases, there is a
                        corresponding increase in the Sample Size. The graph
                        shows how the required sample size for the experiment
                        changes as you adjust the confidence level.
                      </div>
                    </div>
                  )}
                  {selectedFigIndex === 1 && (
                    <div>
                      <div className="text-lg font-medium">
                        Power vs. Sample Size:
                      </div>
                      <div className="text-sm">
                        As the Power increases, there is a corresponding
                        increase in the Sample Size. The graph shows how the
                        required sample size for the experiment changes as you
                        adjust the power.
                      </div>
                    </div>
                  )}
                  {selectedFigIndex === 2 && (
                    <div>
                      <div className="text-lg font-medium">
                        MDE vs. Sample Size:
                      </div>
                      <div className="text-sm">
                        As the Minimum Detectable Effect (MDE) decreases, there
                        is a corresponding increase in the Sample Size. The
                        graph shows how the required sample size for the
                        experiment changes as you adjust the MDE.
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
