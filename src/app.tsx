import { 
  Button, 
  Rows, 
  Text, 
  MultilineInput, 
  Switch, 
  TypographyCard, 
  Box, 
  ProgressBar, 
  LoadingIndicator 
} from "@canva/app-ui-kit";
import * as React from "react";
import styles from "styles/components.css";

export const App = () => {
  const [resumeText, setResumeText] = React.useState("");
  const [aiFeedbackEnabled, setAiFeedbackEnabled] = React.useState(false);
  const [salaryEstimateEnabled, setSalaryEstimateEnabled] = React.useState(false);
  const [coverLetterEnabled, setCoverLetterEnabled] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");
  const [salaryEstimate, setSalaryEstimate] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [score, setScore] = React.useState(0);
  const [salaryUsd, setSalaryUsd] = React.useState(0);
  const [coverLetter, setCoverLetter] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onChange = (value: string) => {
    setResumeText(value);
  };

  const onClick = async () => {
    setLoading(true);
    try {
      if (aiFeedbackEnabled) {
        const feedbackResponse = await fetch("https://canva-backend.roya51788.workers.dev/review", {
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
        const salaryResponse = await fetch("https://canva-backend.roya51788.workers.dev/salary-estimate", {
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

      if (coverLetterEnabled) {
        const coverLetterResponse = await fetch("https://canva-backend.roya51788.workers.dev/cover-letter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resumeText }),
        });

        if (coverLetterResponse.ok) {
          const coverLetterData = await coverLetterResponse.text();
          setCoverLetter(coverLetterData);
        } else {
          console.error("Failed to fetch cover letter");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Cover letter copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
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
        <Switch
          label="Cover Letter"
          onChange={() => setCoverLetterEnabled(!coverLetterEnabled)}
          value={coverLetterEnabled}
        />
        <Button variant="primary" onClick={onClick} stretch>
          Analyze Resume
        </Button>
        {loading && <LoadingIndicator />}
        {!loading && score > 0 && (
          <Box>
            <Text variant="regular">Score: {score}/100</Text>
            <ProgressBar value={score} ariaLabel="Resume Score" />
          </Box>
        )}
        {!loading && email && (
          <Text>Email: {email}</Text>
        )}
        {!loading && feedback && (
          <TypographyCard onClick={() => {}} ariaLabel="AI Feedback">
            <Text variant="regular">
              <strong>AI Feedback:</strong> {feedback}
            </Text>
          </TypographyCard>
        )}
        {!loading && salaryEstimate && (
          <TypographyCard onClick={() => {}} ariaLabel="Salary Estimate">
            <Text variant="regular">
              <strong>Salary Estimate:</strong> {salaryEstimate} <br />
              <strong>Estimated Salary (USD):</strong> {salaryUsd}
            </Text>
          </TypographyCard>
        )}
        {!loading && coverLetter && (
          <TypographyCard onClick={() => {}} ariaLabel="Cover Letter">
            <Text variant="regular">
              <strong>Cover Letter:</strong> {coverLetter}
            </Text>
            <Button variant="primary" onClick={() => copyToClipboard(coverLetter)}>
              Copy Cover Letter
            </Button>
          </TypographyCard>
        )}
      </Rows>
    </div>
  );
};

