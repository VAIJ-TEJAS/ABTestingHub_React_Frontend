/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Form,
  InputNumber,
  Button,
  Tooltip,
  Table,
  message,
  Modal,
  List,
  Segmented,
  Spin,
} from "antd";
import axios from "axios";
import PlotGraph from "../components/PlotGraph";
import { Fab } from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Context } from "../context/context.provider";
import { CalculationStatus, ITest, TestStatus } from "../types/test.types";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmation } from "../components/Confirmation";
import { generateProjectName } from "../utils/hypothesis_title_generator";
import { Auth } from "../components/Auth";
import QuestionReview from "../components/QuestionReview";
import SaveIcon from "../assets/svgs/Save.svg";
import { CloseSharp } from "@mui/icons-material";

interface ArmData {
  id: number;
  value: number | null;
}

export const ABTesting: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

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

  const [figure, setFigure] = useState<any>(null);
  const [numericalResults, setNumericalResults] = useState<any>(null);
  const [tableData, setTableData] = useState([]);
  const [maxUplift, setMaxUplift] = useState<number>(0);
  const [statisticallySignificant, setStatisticallySignificant] = useState<
    boolean | null
  >(null);
  const [form] = Form.useForm();
  const [totalSampleSize, setTotalSampleSize] = useState<number | null>(null);
  const [visitorsConversionsData, setVisitorsConversionsData] = useState<any[]>(
    []
  );

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
        { visitors: 1000, conversions: 240 },
      ]);
    }
  }, [location.state]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (testData) {
      // Assuming testData contains all the required fields

      form.setFieldsValue({
        confidence_level: testData?.confidence_level ?? null,
        arms: testData?.arms ?? null,
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
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/tests/${id}/`,
        {
          headers: {
            Authorization:
              "Token " + localStorage.getItem("abtestinghub-access-token"),
          },
        }
      );

      console.log(response.data);

      setTestData(response.data);
      if (response.data.visitors_conversions_input.toString() != "") {
        setVisitorsConversionsData(response.data.visitors_conversions_input);
      } else {
        setTotalSampleSize(response.data.total_sample_size);
        const newData = Array.from({ length: response.data.arms }, () => ({
          visitors: 1000, // default visitor count
        }));
        setVisitorsConversionsData(newData);
      }
    } catch (error) {
      console.error("Failed to fetch test details:", error);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    // const BASE_URL = import.meta.env.VITE_BASE_URL;
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const armsCount = values.arms;
    const visitorsInput = { arms: armsCount, data: [] as ArmData[] };
    const conversionsInput = { arms: armsCount, data: [] as ArmData[] };

    for (let i = 1; i <= armsCount; i++) {
      visitorsInput.data.push({
        id: i,
        value: values[`visitors_arm_${i}`],
      });
      conversionsInput.data.push({
        id: i,
        value: values[`conversions_arm_${i}`],
      });
    }

    const payload = {
      visitors_input: visitorsInput,
      conversions_input: conversionsInput,
      confidence_level: values.confidence_level / 100,
      tail: values.tail_type ? "two-tailed" : "one-tailed",
    };

    console.log(payload);

    try {
    axios
      .post(`${BASE_URL}/tests/calc_ab_metric/`, payload)
      .then((response) => {
        console.log(response.data);

        const {
          arms,
          figure,
          "conversion-rates": conversion_rates,
          "p-values": p_values,
          "relative-uplift-values": relative_uplift_values,
          significance,
          max_uplift,
          warnings,
          conclusion,
        } = response.data;

        // Prepare the data for the table
        const newTableData = conversion_rates.map((rate: any) => {
          const uplift = relative_uplift_values.find(
            (u: any) => u.arm === rate.arm
          )?.value;
          const pValue = p_values.find((p: any) => p.arm === rate.arm)?.value;
          const significanceValue = significance.find(
            (s: any) => s.arm === rate.arm
          )?.value;
          console.log(significanceValue);

          return {
            key: String.fromCharCode(64 + rate.arm), // ASCII code 65 is 'A', so 64 + arm number will give us the correct letter
            arm: String.fromCharCode(64 + rate.arm),
            conversionRate: `${rate.value.toFixed(2)}%`,
            relativeUplift: uplift !== undefined ? `${uplift}%` : "-",
            pValue: pValue !== undefined ? pValue.toFixed(5) : "-",
            significance:
              significanceValue !== undefined ? significanceValue : "-",
          };
        });

        setFigure(figure);
        setTableData(newTableData);
        setMaxUplift(max_uplift);
        setStatisticallySignificant(
          arms === 2 ? significance[0].value === "significant" : false
        );
        setNumericalResults({
          arms,
          conversion_rates,
          relative_uplift_values,
          significance,
          p_values,
          warnings,
          conclusion,
        });

        if (userInitiatedCalculation)
          setIsNotCalculatedSaved(CalculationStatus.CALC);

        message.success("Calculations completed successfully");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
    } catch (error) {
      // Handle error here
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleArmsChange = (newArmsCount: number) => {
    setVisitorsConversionsData((currentArmData) => {
      const newData = [...currentArmData];

      if (newArmsCount < newData.length) {
        return newData.slice(0, newArmsCount);
      }

      for (let i = newData.length; i < newArmsCount; i++) {
        newData.push({ visitors: totalSampleSize ?? 1000, conversions: null }); // add new arms with default values
      }

      return newData;
    });
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
      visitors_conversions_input: visitorsConversionsData,
      max_uplift: maxUplift,
      statistically_significant: statisticallySignificant,
      status: TestStatus.CONC,
    };

    console.log(payload);

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

  const handleFormValuesChange = () => {
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

  const columns: any = [
    {
      title: "Arm",
      dataIndex: "arm",
      key: "arm",
    },
    {
      title: "Conversion Rate",
      dataIndex: "conversionRate",
      key: "conversionRate",
    },
    {
      title: "Relative Uplift",
      dataIndex: "relativeUplift",
      key: "relativeUplift",
    },
    {
      title: "p-value",
      dataIndex: "pValue",
      key: "pValue",
    },
    {
      title: "Significance",
      dataIndex: "significance",
      key: "significance",
      render: (significance: string) => (
        <span
          className={
            significance.toLowerCase() === "significant"
              ? "text-green-600"
              : "text-red-600"
          }
        >
          {significance}
        </span>
      ),
    },
  ];

  return (
    <div className="py-8 px-2 flex flex-col w-full justify-center items-center bg-[#f5f5f550] gap-4">
      <QuestionReview isVisible={isModalVisible} onClose={closeModal} />
      {numericalResults && (
        <Fab
          color="warning"
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
        open={isTestsModalVisible}
        onOk={() => setIsTestsModalVisible(false)}
        onCancel={() => setIsTestsModalVisible(false)}
        footer={null}
        closeIcon={false}
        styles={{
          content: {
            padding: "0px 0px",
            borderRadius: "16px",
          },
        }}
      >
        <div className="border-4 border-secondary rounded-xl p-8">
          <div className="w-full text-xl pb-4 inline-flex items-center justify-between">
            SAVE TEST{" "}
            <CloseSharp
              className="hover:text-primary hover:cursor-pointer"
              onClick={() => setIsTestsModalVisible(false)}
            />
          </div>
          <List
            dataSource={userTests}
            renderItem={(test) => (
              <List.Item
                className={selectedTestId === test.id ? "bg-blue-100" : ""}
                actions={[
                  <Button
                    type="link"
                    onClick={() => setSelectedTestId(test.id)}
                  >
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
        </div>
      </Modal>
      {testData && (
        <div
          className="container border-2 border-secondary rounded-lg bg-white"
          style={{ boxShadow: "0px 10px 35px 0px #00000040" }}
        >
          <div className="p-4 flex justify-between items-center relative">
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
          </div>
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
                confidence_level: 95,
                arms: 2,
                tail_type: true,
              }}
            >
              <div className="flex gap-4">
                <div className="w-full lg:w-64">
                  <Form.Item
                    name="confidence_level"
                    rules={[
                      {
                        required: true,
                        message: "Please input the confidence level!",
                      },
                    ]}
                    label={
                      <div className="flex w-full lg:w-64 justify-between ">
                        <div>{"Confidence Level | (1-\u03b1) %"}</div>
                        <div>
                          <Tooltip
                            className="text-primary"
                            overlayInnerStyle={{ width: "600px" }}
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
                    name="tail_type"
                    label={
                      <span>
                        Tail Type of Hypothesis&nbsp;
                        <Tooltip
                          className="text-primary px-2"
                          overlayInnerStyle={{ width: "600px" }}
                          title={
                            <span className="no-tailwind">
                              <strong>Tail of a Test</strong>
                              <br />
                              <br />
                              <em>Definition:</em> The "tail" of a statistical
                              test refers to the region(s) in the probability
                              distribution under the null hypothesis where
                              extreme values are considered evidence against the
                              null hypothesis. Statistical tests are classified
                              as one-tailed or two-tailed based on the number of
                              tails considered.
                              <br />
                              <ul>
                                <li>
                                  <strong>One-Tailed Test</strong>: Focuses on
                                  extreme values in one direction (either the
                                  upper or lower tail) of the distribution. It
                                  is used when the hypothesis specifies a
                                  directional change.
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
                                  hypothesis predicts that the new drug
                                  increases the observed effect, a one-tailed
                                  test focuses on extreme values in the upper
                                  tail of the distribution.
                                </li>
                                <li>
                                  <strong>Two-Tailed Test</strong>: If the
                                  hypothesis is agnostic about the direction of
                                  the effect (increase or decrease), a
                                  two-tailed test considers extreme values in
                                  both the upper and lower tails of the
                                  distribution.
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
                                  <strong>Non-Directional Hypotheses</strong>:
                                  Use a two-tailed test when the research
                                  hypothesis is non-directional, and you want to
                                  detect deviations from the null hypothesis in
                                  either direction.
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
                      </span>
                    }
                  >
                    <Segmented
                      block
                      options={[
                        { label: "TWO-TAILED", value: true },
                        { label: "ONE-TAILED", value: false },
                      ]}
                    />
                  </Form.Item>
                </div>
                <div className="w-full lg:w-64">
                  <Form.Item
                    name="arms"
                    rules={[
                      {
                        required: true,
                        message: "Please input the number of arms!",
                      },
                    ]}
                    label={
                      <div className="flex w-full lg:w-64 justify-between ">
                        <div>{"Arms"}</div>
                        <div>
                          <Tooltip
                            className="text-primary"
                            overlayInnerStyle={{ width: "600px" }}
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
                </div>
              </div>
              <div>
                {visitorsConversionsData.map((arm, index) => {
                  return (
                    <div key={index} className="flex gap-4">
                      <Form.Item
                        className="w-full lg:w-64"
                        label={`Visitors Group ${String.fromCharCode(
                          65 + index
                        )}`}
                        rules={[
                          {
                            required: true,
                            message: "Please input the number of visitors!",
                          },
                        ]}
                        name={`visitors_arm_${index + 1}`}
                        initialValue={arm.visitors}
                      >
                        <InputNumber
                          min={0}
                          onChange={(value) =>
                            setVisitorsConversionsData(
                              visitorsConversionsData.map((data, i) =>
                                i === index
                                  ? { ...data, visitors: value }
                                  : data
                              )
                            )
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                      <Form.Item
                        className="w-full lg:w-64"
                        label={`Conversions Group ${String.fromCharCode(
                          65 + index
                        )}`}
                        rules={[
                          {
                            required: true,
                            message: "Please input the number of conversions!",
                          },
                        ]}
                        name={`conversions_arm_${index + 1}`}
                        initialValue={arm.conversions}
                      >
                        <InputNumber
                          min={0}
                          onChange={(value) =>
                            setVisitorsConversionsData(
                              visitorsConversionsData.map((data, i) =>
                                i === index
                                  ? { ...data, conversions: value }
                                  : data
                              )
                            )
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 w-full justify-between">
                <Form.Item className="w-full">
                  <Button
                    size="large"
                    className="w-full"
                    type="primary"
                    htmlType="submit"
                    onClick={handleCalculateClick}
                  >
                    {loading ? <Spin className="bg-white rounded-full"/> : 'CALCULATE'}
                  </Button>
                </Form.Item>
                <Form.Item>
                  <button
                    className="bg-secondary h-10 w-10 flex justify-center items-center rounded border-secondary border-2 hover:bg-white transition-all duration-300"
                    onClick={(event) => {
                      event.preventDefault();
                      saveResults(testData);
                    }}
                    disabled={isNotCalculatedSaved === CalculationStatus.IDLE}
                    >
                    <img src={SaveIcon} className="w-6" />
                    </button>
                </Form.Item>
              </div>
            </Form>
          </div>
          {/* {numericalResults && <QuestionReview />} */}
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div
            className="p-4 border-2 border-secondary rounded-lg bg-white"
            style={{ boxShadow: "0px 10px 35px 0px #00000040" }}
          >
            {numericalResults && (
              <div className="p-4 space-y-4">
                <div className="text-lg font-medium text-zinc-500">
                  Conclusion
                </div>
                <div className="text-sm">
                  {numericalResults.conclusion.map(
                    (item: any, index: number) => (
                      <div key={index} className={item.className}>
                        {item.text !== "" ? (
                          <>
                            {item.text === "The test results are statistically" ? (
                              numericalResults.arms === 2 &&
                              <div className="font-bold">
                                The test results are statistically
                                <span className="text-3xl">
                                  {statisticallySignificant ? (
                                    <span className="text-green-600">
                                      &nbsp;Significant
                                    </span>
                                  ) : (
                                    <span className="text-red-600">
                                      &nbsp;Insignificant
                                    </span>
                                  )}
                                </span>
                              </div>
                            ) : (
                              <>{item.text}</>
                            )}
                          </>
                        ) : (
                          <>
                            <br />
                          </>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
            />
            {numericalResults && (
              <div>
                <div className="flex w-full justify-center items-center">
                  <PlotGraph data={figure.data} layout={figure.layout} />
                </div>
              </div>
            )}

            
          </div>
        </div>
      </div>
    </div>
  );
};
