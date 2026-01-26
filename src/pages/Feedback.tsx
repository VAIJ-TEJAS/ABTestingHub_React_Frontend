import { Form, Input, Button, Modal, message, Rate, Select, Space, Typography, Divider, Alert, Spin, Tag, Upload, Radio } from "antd";
import { useState, useEffect, useCallback, useMemo } from "react";
import ThumbsUp from "../assets/svgs/ThumbsUp.svg"
import { CloseSharp, SendOutlined, StarOutlined, FileTextOutlined, CheckCircleOutlined } from "@mui/icons-material";
import axios from "axios";
import { validateEmail, validateRequired, validateLength, validateForm } from "../utils/formValidators";
import { performanceMonitor } from "../utils/performanceMonitor";
import { debounce } from "../utils/dataTransformers";

const { Text, Paragraph, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface FeedbackFormData {
  name: string;
  email: string;
  comment: string;
  rating?: number;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  attachments?: any[];
  contactPreference?: 'email' | 'phone' | 'none';
  phone?: string;
}

export const Feedback = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [rating, setRating] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [contactPreference, setContactPreference] = useState<'email' | 'phone' | 'none'>('email');
  const [fileList, setFileList] = useState<any[]>([]);
  const [charCount, setCharCount] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    performanceMonitor.startTimer('feedback-page-load');
    return () => {
      performanceMonitor.endTimer('feedback-page-load');
    };
  }, []);

  const maxCharCount = 1000;
  const categories = [
    'Bug Report',
    'Feature Request',
    'UI/UX Improvement',
    'Performance Issue',
    'Documentation',
    'Other',
  ];

  const debouncedValidation = useMemo(
    () => debounce((values: FeedbackFormData) => {
      const validation = validateForm({
        name: validateRequired(values.name),
        email: validateEmail(values.email || ''),
        comment: validateLength(values.comment || '', 10, maxCharCount),
      });

      if (!validation.isValid) {
        setValidationErrors(validation.errors);
      } else {
        setValidationErrors({});
      }
    }, 300),
    []
  );

  const handleFormChange = useCallback((changedFields: any, allFields: any) => {
    const values = form.getFieldsValue();
    
    if (changedFields[0]?.name[0] === 'comment') {
      const comment = changedFields[0]?.value || '';
      setCharCount(comment.length);
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
      }, 1000);

      // Generate suggestions based on comment
      if (comment.length > 20) {
        const keywords = comment.toLowerCase().split(' ');
        const relevantSuggestions = categories.filter(cat =>
          keywords.some(keyword => cat.toLowerCase().includes(keyword))
        );
        setSuggestions(relevantSuggestions.slice(0, 3));
      } else {
        setSuggestions([]);
      }
    }

    debouncedValidation(values);
  }, [form, debouncedValidation]);

  const onFinish = useCallback(async (values: FeedbackFormData) => {
    setLoading(true);
    performanceMonitor.startTimer('feedback-submission');

    try {
      const finalValues = {
        ...values,
        rating,
        category,
        priority,
        contactPreference,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        attachments: fileList.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })),
      };

      const validation = validateForm({
        name: validateRequired(values.name),
        email: validateEmail(values.email),
        comment: validateLength(values.comment, 10, maxCharCount),
      });

      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        message.error('Please fix validation errors');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/feedback/`,
        finalValues,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem('abtestinghub-access-token') || ''}`,
          },
        }
      );

      performanceMonitor.endTimer('feedback-submission', { success: true });
      
      console.log("Success:", response.data);
      message.success("Feedback submitted successfully!");
      setSubmitted(true);
      setIsModalVisible(true);
      form.resetFields();
      setRating(0);
      setCategory('');
      setPriority('medium');
      setFileList([]);
      setCharCount(0);
      setValidationErrors({});
    } catch (error: any) {
      performanceMonitor.endTimer('feedback-submission', { success: false, error: error.message });
      console.error("Failed to submit feedback:", error);
      
      if (error.response?.status === 429) {
        message.error("Too many requests. Please try again later.");
      } else if (error.response?.status >= 500) {
        message.error("Server error. Please try again later.");
      } else {
        message.error("Failed to submit feedback. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [rating, category, priority, contactPreference, fileList, form]);

  const onFinishFailed = useCallback((errorInfo: any) => {
    console.log("Failed:", errorInfo);
    const errors: Record<string, string> = {};
    errorInfo.errorFields?.forEach((field: any) => {
      errors[field.name[0]] = field.errors[0];
    });
    setValidationErrors(errors);
    message.warning('Please fill in all required fields correctly');
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    setSubmitted(false);
  }, []);

  const handleRatingChange = useCallback((value: number) => {
    setRating(value);
    performanceMonitor.measureSync('rating-change', () => {
      // Track rating changes
    });
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
    if (value === 'Bug Report' && rating < 3) {
      setPriority('high');
    }
  }, [rating]);

  const handleFileChange = useCallback((info: any) => {
    const newFileList = info.fileList.slice(-5); // Limit to 5 files
    setFileList(newFileList);
  }, []);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setCategory(suggestion);
    form.setFieldsValue({ category: suggestion });
    setSuggestions([]);
  }, [form]);

  const canSubmit = useMemo(() => {
    const values = form.getFieldsValue();
    return values.name && values.email && values.comment && 
           values.comment.length >= 10 && 
           Object.keys(validationErrors).length === 0;
  }, [form, validationErrors]);

  const submissionStats = useMemo(() => {
    const report = performanceMonitor.getReport('feedback-submission');
    return report ? {
      averageTime: report.averageDuration,
      totalSubmissions: report.count,
    } : null;
  }, []);

  return (
    <div className="p-16 flex w-full justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl">
        <Title level={2} className="text-center mb-8">
          WE VALUE YOUR FEEDBACK
        </Title>

        {validationErrors && Object.keys(validationErrors).length > 0 && (
          <Alert
            message="Validation Errors"
            description={Object.values(validationErrors).join(', ')}
            type="error"
            showIcon
            closable
            onClose={() => setValidationErrors({})}
            className="mb-4"
          />
        )}

        {suggestions.length > 0 && (
          <Alert
            message="Category Suggestions"
            description={
              <Space wrap>
                {suggestions.map((suggestion, index) => (
                  <Tag
                    key={index}
                    color="blue"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Tag>
                ))}
              </Space>
            }
            type="info"
            showIcon
            closable
            onClose={() => setSuggestions([])}
            className="mb-4"
          />
        )}

        <Form
          form={form}
          name="feedback"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={handleFormChange}
          initialValues={{
            priority: 'medium',
            contactPreference: 'email',
          }}
        >
          <Form.Item
            label="NAME"
            name="name"
            rules={[
              { required: true, message: "Please input your name!" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
            validateStatus={validationErrors.name ? 'error' : ''}
            help={validationErrors.name}
          >
            <Input 
              placeholder="Sample User Name" 
              prefix={<FileTextOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="EMAIL ID"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
            validateStatus={validationErrors.email ? 'error' : ''}
            help={validationErrors.email}
          >
            <Input placeholder="sampleusername@gmail.com" />
          </Form.Item>

          {contactPreference === 'phone' && (
            <Form.Item
              label="PHONE NUMBER"
              name="phone"
              rules={[
                { required: true, message: "Please input your phone number!" },
                { pattern: /^[0-9+\-\s()]+$/, message: "Invalid phone number format" },
              ]}
            >
              <Input placeholder="+1 (555) 123-4567" />
            </Form.Item>
          )}

          <Form.Item label="RATING">
            <Rate
              value={rating}
              onChange={handleRatingChange}
              allowHalf
              character={<StarOutlined />}
            />
            {rating > 0 && (
              <Text type="secondary" style={{ marginLeft: 8 }}>
                {rating} star{rating !== 1 ? 's' : ''}
              </Text>
            )}
          </Form.Item>

          <Form.Item
            label="CATEGORY"
            name="category"
          >
            <Select
              placeholder="Select a category"
              value={category}
              onChange={handleCategoryChange}
              allowClear
            >
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="PRIORITY"
            name="priority"
          >
            <Radio.Group
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="low">Low</Radio.Button>
              <Radio.Button value="medium">Medium</Radio.Button>
              <Radio.Button value="high">High</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="CONTACT PREFERENCE"
            name="contactPreference"
          >
            <Radio.Group
              value={contactPreference}
              onChange={(e) => setContactPreference(e.target.value)}
            >
              <Radio value="email">Email</Radio>
              <Radio value="phone">Phone</Radio>
              <Radio value="none">No Contact</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={
              <Space>
                FEEDBACK MESSAGE/QUERY
                {isTyping && <Text type="secondary" style={{ fontSize: '12px' }}>(Typing...)</Text>}
              </Space>
            }
            name="comment"
            rules={[
              { required: true, message: "Please input your feedback!" },
              { min: 10, message: "Feedback must be at least 10 characters" },
              { max: maxCharCount, message: `Feedback must be less than ${maxCharCount} characters` },
            ]}
            validateStatus={validationErrors.comment ? 'error' : ''}
            help={
              <div>
                {validationErrors.comment && (
                  <Text type="danger">{validationErrors.comment}</Text>
                )}
                <div style={{ marginTop: 4 }}>
                  <Text type={charCount > maxCharCount ? 'danger' : 'secondary'} style={{ fontSize: '12px' }}>
                    {charCount} / {maxCharCount} characters
                  </Text>
                </div>
              </div>
            }
          >
            <TextArea
              placeholder="Sample User Feedback"
              rows={6}
              showCount
              maxLength={maxCharCount}
            />
          </Form.Item>

          <Form.Item label="ATTACHMENTS (Optional)" name="attachments">
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false}
              multiple
              maxCount={5}
            >
              <Button icon={<FileTextOutlined />}>Upload Files</Button>
            </Upload>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: 4 }}>
              Maximum 5 files, 10MB each
            </Text>
          </Form.Item>

          <Divider />

          {submissionStats && (
            <Alert
              message={`Average submission time: ${submissionStats.averageTime.toFixed(0)}ms`}
              type="info"
              showIcon
              className="mb-4"
            />
          )}

          <Form.Item className="text-center">
            <Space size="large">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SendOutlined />}
                loading={loading}
                disabled={!canSubmit || loading}
                className="font-sans"
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </Button>
              <Button
                htmlType="button"
                onClick={() => {
                  form.resetFields();
                  setRating(0);
                  setCategory('');
                  setPriority('medium');
                  setFileList([]);
                  setCharCount(0);
                  setValidationErrors({});
                }}
                className="font-sans"
              >
                Reset Form
              </Button>
            </Space>
          </Form.Item>
        </Form>
        
        <Modal 
          open={isModalVisible} 
          onCancel={handleCancel}
          closeIcon={false}
          footer={null}
          width={500}
          styles={{
            content: {
              padding: "0px 0px",
              borderRadius: "16px"
            }
          }}
        >
          <div className="flex flex-col justify-center items-center gap-4 font-sans text-center border-4 border-secondary p-8 rounded-xl">
            <div className="text-xl pb-4 inline-flex w-full justify-end">
              <CloseSharp className="hover:text-primary hover:cursor-pointer" onClick={handleCancel} />
            </div>
            {submitted ? (
              <>
                <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a' }} />
                <Title level={3}>Thank You for Your Feedback!</Title>
                <Paragraph>
                  We appreciate your input and are committed to improving our services to better meet your needs.
                </Paragraph>
                {rating > 0 && (
                  <div>
                    <Text strong>Your Rating: </Text>
                    <Rate value={rating} disabled />
                  </div>
                )}
                {category && (
                  <Tag color="blue">Category: {category}</Tag>
                )}
              </>
            ) : (
              <>
                <img src={ThumbsUp} className="animate-bounce" alt="Thumbs up" />
                <div className="text-2xl">
                  Thank You for Your Feedback!
                </div>
                <div className="pb-4">
                  We appreciate your input and are committed to improving our services to better meet your needs.
                </div>
              </>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};
