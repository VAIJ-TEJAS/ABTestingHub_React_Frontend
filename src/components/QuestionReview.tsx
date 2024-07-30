import React, { useState, useEffect } from "react";
import {
  Radio,
  Button,
  message,
  RadioChangeEvent,
  Form,
  Input,
  Result,
  Modal,
} from "antd";
import axios from "axios";
import { CloseSharp } from "@mui/icons-material";

const { TextArea } = Input;

interface Choice {
  id: number;
  choice_text: string;
}

interface Question {
  id: number;
  question_text: string;
  choices: Choice[];
}

interface QuestionReviewProps {
  isVisible: boolean;
  onClose: () => void;
}

const QuestionReview = ({ isVisible, onClose }: QuestionReviewProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [form] = Form.useForm();
  const [submissionSuccessful, setSubmissionSuccessful] =
    useState<boolean>(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/questions/`)
      .then((response) => {
        const answeredQuestions = JSON.parse(
          localStorage.getItem("answeredQuestions") || "[]"
        );
        const filteredQuestions = response.data.filter(
          (question: Question) => !answeredQuestions.includes(question.id)
        );
        setQuestions(filteredQuestions);
        console.log(filteredQuestions);
      })
      .catch((error) => console.error("Failed to fetch questions:", error));
  }, []);

  const submitAnswer = () => {
    form.validateFields().then((values) => {
      if (values.selectedChoice || values.textAnswer) {
        const payload = {
          question: questions[0].id,
          choice: values.selectedChoice,
          text_answer: values.textAnswer,
        };

        axios
          .post(`${import.meta.env.VITE_BASE_URL}/answers/`, payload, {
            headers: {
              Authorization: `Token ${localStorage.getItem(
                "abtestinghub-access-token"
              )}`,
            },
          })
          .then(() => {
            const answeredQuestions = JSON.parse(
              localStorage.getItem("answeredQuestions") || "[]"
            );
            localStorage.setItem(
              "answeredQuestions",
              JSON.stringify([...answeredQuestions, questions[0].id])
            );

            message.success("Your answer has been submitted!");
            setSubmissionSuccessful(true);
            setSelectedChoice(null);
            setTextAnswer("");
            form.resetFields();
          })
          .catch((error) => console.error("Failed to submit answer:", error));
      } else {
        message.warning(
          "Please select an option or enter a text answer before submitting."
        );
      }
    });
  };

  const onChoiceChange = (e: RadioChangeEvent) => {
    setSelectedChoice(parseInt(e.target.value, 10));
    setTextAnswer("");
    form.setFieldsValue({ textAnswer: "" });
  };

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAnswer(e.target.value);
  };

  if (submissionSuccessful) {
    return (
      <Modal
        title="Feedback Form"
        open={isVisible}
        onCancel={onClose}
        footer={null}
      >
        <Result
          status="success"
          title="Successfully Submitted!"
          subTitle="Your answer has been recorded. Thank you for your feedback."
        />
      </Modal>
    );
  }

  if (questions.length == 0)
    return (
      <Modal
        title="Feedback Form"
        open={isVisible}
        onCancel={onClose}
        footer={null}
      >
        <Result
          status="success"
          title="You are up to date!"
          subTitle="You will receive a new question once we have something in our mind!"
        />
      </Modal>
    );

  return (
    <Modal
      open={isVisible}
      closeIcon={false}
      onCancel={onClose}
      footer={null}
      styles={{
        content: {
          padding: "0px 0px",
          borderRadius: "16px",
        },
      }}
    >
      <div className="flex border-4 border-secondary rounded-xl p-8 ">
        <Form
          form={form}
          layout="vertical"
          onFinish={submitAnswer}
          className="w-full"
        >
          <div className="text-xl pb-4 inline-flex items-center justify-between w-full">
            QUESTION / REVIEWS{" "}
            <CloseSharp
              className="hover:text-primary hover:cursor-pointer"
              onClick={onClose}
            />
          </div>
          <Form.Item
            label={questions[0].question_text}
            name="selectedChoice"
            rules={[
              { required: !textAnswer, message: "Please select an option!" },
            ]}
          >
            <Radio.Group onChange={onChoiceChange} value={selectedChoice}>
              {questions[0].choices.map((choice) => (
                <Radio
                  style={{
                    display: "block",
                    height: "30px",
                    lineHeight: "30px",
                  }}
                  key={choice.id}
                  value={choice.id}
                >
                  {choice.choice_text}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Or provide a text answer"
            name="textAnswer"
            rules={[
              {
                required: !selectedChoice,
                message: "Please enter a text answer or select a choice!",
              },
            ]}
          >
            <TextArea rows={4} onChange={onTextChange} value={textAnswer} />
          </Form.Item>
          <Form.Item className="w-full">
            <Button
              size="large"
              className="w-full"
              type="primary"
              htmlType="submit"
            >
              SUBMIT
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default QuestionReview;
