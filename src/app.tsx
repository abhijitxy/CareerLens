import { Button, Rows, Text, MultilineInput, Switch } from "@canva/app-ui-kit";
import * as React from "react";
import styles from "styles/components.css";

export const App = () => {
  const [resumeText, setResumeText] = React.useState("");
  const [aiFeedbackEnabled, setAiFeedbackEnabled] = React.useState(false);
  const [salaryEstimateEnabled, setSalaryEstimateEnabled] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");
  const [salaryEstimate, setSalaryEstimate] = React.useState("");

  const onChange = (value: string) => {
    setResumeText(value);
  };

  const onClick = async () => {
    console.log("Adding text to design: ", resumeText);
    if (aiFeedbackEnabled) {
      console.log("AI Feedback enabled");
      const feedbackResponse = await fetch("http://localhost:8787/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeText }),
      });

      if (feedbackResponse.ok) {
        const feedbackData = await feedbackResponse.json();
        setFeedback(feedbackData.feedback);
      } else {
        console.error("Failed to fetch AI feedback");
      }
    }

    if (salaryEstimateEnabled) {
      console.log("Salary Estimate enabled");
      const salaryResponse = await fetch("http://localhost:8787/salary-estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeText }),
      });

      if (salaryResponse.ok) {
        const salaryData = await salaryResponse.json();
        setSalaryEstimate(salaryData.salaryEstimate);
      } else {
        console.error("Failed to fetch salary estimate");
      }
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          Welcome to CareerLens! Paste your resume text below to get real-time
          keyword suggestions and optimize your resume for the job market.
        </Text>
        <MultilineInput
          value={resumeText}
          onChange={onChange}
          placeholder="Paste your resume text here"
        />
        <Switch
          label="AI Feedback"
          onChange={() => setAiFeedbackEnabled(!aiFeedbackEnabled)}
          value={aiFeedbackEnabled}
        />
        <Switch
          label="Salary Estimate"
          onChange={() => setSalaryEstimateEnabled(!salaryEstimateEnabled)}
          value={salaryEstimateEnabled}
        />
        <Button variant="primary" onClick={onClick} stretch>
          Analyze Resume
        </Button>
        {aiFeedbackEnabled && feedback && (
          <Text>AI Feedback: {feedback}</Text>
        )}
        {salaryEstimateEnabled && salaryEstimate && (
          <Text>Salary Estimate: {salaryEstimate}</Text>
        )}
      </Rows>
    </div>
  );
};
