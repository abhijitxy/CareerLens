import { Button, Rows, Text, MultilineInput, Switch } from "@canva/app-ui-kit";
import * as React from "react";
import styles from "styles/components.css";

export const App = () => {
  const [resumeText, setResumeText] = React.useState("");
  const [aiFeedbackEnabled, setAiFeedbackEnabled] = React.useState(false);
  const [salaryEstimateEnabled, setSalaryEstimateEnabled] = React.useState(false);

  const onChange = (value: string) => {
    setResumeText(value);
  };

  const onClick = () => {
    console.log("Adding text to design: ", resumeText);
    if (aiFeedbackEnabled) {
      console.log("AI Feedback enabled");
    }
    if (salaryEstimateEnabled) {
      console.log("Salary Estimate enabled");
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
        {aiFeedbackEnabled && (
          <Text>AI Feedback feature is enabled. Feedback will be provided.</Text>
        )}
        {salaryEstimateEnabled && (
          <Text>Salary Estimate feature is enabled. Estimates will be shown.</Text>
        )}
      </Rows>
    </div>
  );
};
