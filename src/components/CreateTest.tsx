/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { generateProjectName } from "../utils/hypothesis_title_generator";
import {
  Modal,
  Button,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  message,
  Segmented,
  Switch,
  Tooltip,
  Space,
  Tag,
  Alert,
  Spin,
  AutoComplete,
  DatePicker,
} from "antd";
import { CloseSharp, InfoOutlined, SaveOutlined, RocketOutlined } from "@mui/icons-material";
import { validateRequired, validateLength, validateForm } from "../utils/formValidators";
import dayjs from "dayjs";

interface CreateTestModalProps {
  isVisible: boolean;
  onClose: () => void;
  test_id: number | null;
}

export const CreateTest: React.FC<CreateTestModalProps> = ({
  isVisible,
  onClose,
  test_id,
}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [testId, setTestId] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [formDirty, setFormDirty] = useState(false);

  useEffect(() => {
    if (test_id) {
      setTestId(test_id);
      fetchTestData(test_id);
    } else {
      form.resetFields();
      setFormDirty(false);
      setValidationErrors({});
    }
  }, [test_id, isVisible]);

  useEffect(() => {
    if (autoSaveEnabled && formDirty) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [formDirty, autoSaveEnabled]);

  const handleAutoSave = useCallback(async () => {
    try {
      const values = form.getFieldsValue();
      const validation = validateForm({
        name: validateRequired(values.name),
        description: validateLength(values.description || '', 0, 500),
      });

      if (validation.isValid && testId) {
        await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/tests/${testId}/`,
          values,
          {
            headers: {
              Authorization: "Token " + localStorage.getItem("abtestinghub-access-token"),
            },
          }
        );
        setLastSaved(new Date());
        setFormDirty(false);
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }, [form, testId]);

  const loadSuggestions = useCallback(async (searchText: string) => {
    if (searchText.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/tests/?search=${searchText}`,
        {
          headers: {
            Authorization: "Token " + localStorage.getItem("abtestinghub-access-token"),
          },
        }
      );
      const names = response.data.map((test: any) => test.name).slice(0, 5);
      setSuggestions(names);
    } catch (error) {
      console.error("Failed to load suggestions:", error);
    }
  }, []);

  const fetchTestData = async (testId: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/tests/${testId}/`,
        {
          headers: {
            Authorization:
              "Token " + localStorage.getItem("abtestinghub-access-token"),
          },
        }
      );
      const data = response.data;
      form.setFieldsValue({
        ...data,
        startDate: data.start_date ? dayjs(data.start_date) : null,
        endDate: data.end_date ? dayjs(data.end_date) : null,
      });
      setFormDirty(false);
    } catch (error) {
      console.error("Failed to fetch test data:", error);
      message.error("Failed to fetch test details.");
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateTest = async (values: any, action: string) => {
    const apiUrl = testId
      ? `${import.meta.env.VITE_BASE_URL}/tests/${testId}/`
      : `${import.meta.env.VITE_BASE_URL}/tests/`;
    const method = testId ? axios.patch : axios.post;

    try {
      const response = await method(apiUrl, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Token " + localStorage.getItem("abtestinghub-access-token"),
        },
      });

      message.success(
        testId ? "Test updated successfully" : "Test created successfully"
      );

      if (action === "return") {
        navigate("/dashboard");
      } else if (action === "continue") {
        const route = values.proportional_metric
          ? "/proportional-metric-testing"
          : "/continuous-metric-testing";
        navigate(route, { state: { testId: response.data.id } });
      }
    } catch (error) {
      console.error(
        testId ? "Failed to update test:" : "Failed to create test:",
        error
      );
      message.error(
        testId ? "Failed to update test." : "Failed to create test."
      );
    }
  };

  const validateFormData = useCallback((values: any): boolean => {
    const validation = validateForm({
      name: validateRequired(values.name),
      description: validateLength(values.description || '', 0, 1000),
      arms: validateRequired(values.arms),
    });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      message.error("Please fix validation errors before submitting.");
      return false;
    }

    setValidationErrors({});
    return true;
  }, []);

  const onFinish = useCallback((values: any) => {
    if (!validateFormData(values)) return;
    setFormDirty(false);
    createOrUpdateTest(values, "continue");
  }, [validateFormData]);

  const onFinishReturn = useCallback((values: any) => {
    if (!validateFormData(values)) return;
    setFormDirty(false);
    createOrUpdateTest(values, "return");
  }, [validateFormData]);

  const handleFormChange = useCallback(() => {
    setFormDirty(true);
  }, []);

  const handleGenerateName = useCallback(() => {
    const newName = generateProjectName();
    form.setFieldsValue({ name: newName });
    setFormDirty(true);
  }, [form]);

  const randomName = useMemo(() => generateProjectName(), []);

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      closeIcon={false}
      footer={null}
      width={840}
      styles={{
        content: {
          padding: "0px 0px",
          borderRadius: "16px",
        },
      }}
    >
      <div className="border-4 border-secondary rounded-xl p-8">
        <div className="pb-4">
          <div className="w-ful flex justify-end">
            <CloseSharp className="hover:text-primary hover:cursor-pointer" onClick={onClose}/>
          </div>
          <div className="text-2xl text-center inline-flex w-full justify-center items-center gap-2">
            {testId ? 'EDIT TEST' : 'CREATE TEST'}
            {testId && <Tag color="blue">ID: {testId}</Tag>}
          </div>
          {lastSaved && (
            <Alert
              message={`Last saved: ${lastSaved.toLocaleTimeString()}`}
              type="success"
              showIcon
              closable
              className="mt-2"
            />
          )}
          {Object.keys(validationErrors).length > 0 && (
            <Alert
              message="Validation Errors"
              description={Object.values(validationErrors).join(', ')}
              type="error"
              showIcon
              closable
              onClose={() => setValidationErrors({})}
              className="mt-2"
            />
          )}
        </div>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Spin size="large" />
          </div>
        ) : (
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          onValuesChange={handleFormChange}
          initialValues={{
            name: randomName,
            proportional_metric: true,
            arms: 2,
            autoSave: false,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    NAME
                    <Tooltip title="Enter a unique name for your test">
                      <InfoOutlined style={{ fontSize: '14px', color: '#999' }} />
                    </Tooltip>
                  </Space>
                }
                name="name"
                rules={[
                  { required: true, message: "Please input the test name!" },
                  { min: 3, message: "Name must be at least 3 characters" },
                  { max: 100, message: "Name must be less than 100 characters" },
                ]}
                validateStatus={validationErrors.name ? 'error' : ''}
                help={validationErrors.name}
              >
                <AutoComplete
                  options={suggestions.map(s => ({ value: s }))}
                  onSearch={loadSuggestions}
                  placeholder="Enter test name"
                  suffix={
                    <Button
                      type="text"
                      size="small"
                      onClick={handleGenerateName}
                      title="Generate random name"
                    >
                      <RocketOutlined />
                    </Button>
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="METRIC TYPE"
                name="proportional_metric"
                rules={[
                  { required: true, message: "Please select the metric type!" },
                ]}
              >
                <Segmented
                  block
                  options={[
                    { label: 'PROPORTIONAL', value: true },
                    { label: 'CONTINUOUS', value: false }
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="DESCRIPTION" name="description">
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="HYPOTHESIS" name="hypothesis">
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="PRIMARY METRIC" name="primary_metric">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="BUSINESS TARGET" name="business_target">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="NO. OF ARMS"
                name="arms"
                rules={[
                  {
                    required: true,
                    message: "Please input the number of arms!",
                  },
                ]}
              >
                <InputNumber min={2} max={20} className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="START DATE" name="startDate">
                <DatePicker className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="END DATE" name="endDate">
                <DatePicker className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="autoSave" valuePropName="checked">
            <Switch
              checkedChildren="Auto-save enabled"
              unCheckedChildren="Auto-save disabled"
              onChange={setAutoSaveEnabled}
            />
          </Form.Item>

          <div className="flex w-full justify-between items-center">
            <Form.Item>
              <Space>
                <Button 
                  onClick={() => onFinishReturn(form.getFieldsValue())}
                  icon={<SaveOutlined />}
                >
                  Save and Return
                </Button>
                {formDirty && (
                  <Tag color="orange">Unsaved changes</Tag>
                )}
              </Space>
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit"
                icon={<RocketOutlined />}
              >
                Save and Continue
              </Button>
            </Form.Item>
          </div>
        </Form>
        )}
      </div>
    </Modal>
  );
};
