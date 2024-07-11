import { Button, Rows, Text, MultilineInput, Switch, TypographyCard, Alert, Box, ProgressBar } from "@canva/app-ui-kit";
import * as React from "react";
import styles from "styles/components.css";

export const App = () => {
  const [resumeText, setResumeText] = React.useState("");
  const [aiFeedbackEnabled, setAiFeedbackEnabled] = React.useState(false);
  const [salaryEstimateEnabled, setSalaryEstimateEnabled] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");
  const [salaryEstimate, setSalaryEstimate] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [score, setScore] = React.useState(0);
  const [salaryUsd, setSalaryUsd] = React.useState(0);

  const onChange = (value: string) => {
    setResumeText(value);
  };

  const onClick = async () => {
    console.log("Analyzing resume: ", resumeText);
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
        setEmail(feedbackData.email);
        setScore(feedbackData.score);
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
        setSalaryEstimate(salaryData.salary_estimate_feedback);
        setSalaryUsd(salaryData.salary_estimate_usd);
      } else {
        console.error("Failed to fetch salary estimate");
      }
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <TypographyCard onClick={() => {}} ariaLabel="Welcome message">
          <Text variant="regular">
            <strong>Welcome to CareerLens!</strong> Paste your resume text below to get real-time keyword suggestions and optimize your resume for the job market.
          </Text>
        </TypographyCard>
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
        {score > 0 && (
          <Box>
            <Text variant="regular">Score: {score}/100</Text>
            <ProgressBar value={score} ariaLabel="Resume Score" />
          </Box>
        )}
        {email && (
            <Text>Email: {email}</Text>
        )}
        {feedback && (
          <TypographyCard onClick={() => {}} ariaLabel="AI Feedback">
            <Text variant="regular">
              <strong>AI Feedback:</strong> {feedback}
            </Text>
          </TypographyCard>
        )}
        {salaryEstimate && (
          <TypographyCard onClick={() => {}} ariaLabel="Salary Estimate">
            <Text variant="regular">
              <strong>Salary Estimate:</strong> {salaryEstimate} <br />
              <strong>Estimated Salary (USD):</strong> {salaryUsd}
            </Text>
          </TypographyCard>
        )}
        
      </Rows>
    </div>
  );
};
