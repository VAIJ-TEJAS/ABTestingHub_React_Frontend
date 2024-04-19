import React, { useState, useEffect } from "react";
import {
  Radio,
  Button,
  message,
  RadioChangeEvent,
  Form,
  Input,
  Result,
} from "antd";
import axios from "axios";
import { Paper } from "@mui/material";

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

const QuestionReview: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [form] = Form.useForm();
  const [submissionSuccessful, setSubmissionSuccessful] =
    useState<boolean>(false);

  useEffect(() => {
    axios
      .get("https://abtestinghub.com:8000/questions/")
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
          .post("https://abtestinghub.com:8000/answers/", payload, {
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
      <Result
        status="success"
        title="Successfully Submitted!"
        subTitle="Your answer has been recorded. Thank you for your feedback."
      />
    );
  }

  if (questions.length == 0) return;

  return (
    <Paper className="p-4 border-red-600 border">
      <Form form={form} layout="vertical" onFinish={submitAnswer}>
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
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: "10px" }}
          >
            Submit Answer
          </Button>
        </Form.Item>
      </Form>
    </Paper>
  );
};

export default QuestionReview;
