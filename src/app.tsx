import React, { useState, useRef } from 'react';
import {
  Button,
  Rows,
  Text,
  MultilineInput,
  Switch,
  TypographyCard,
  Box,
  ProgressBar,
} from "@canva/app-ui-kit";

import styles from "styles/components.css";

export const App = () => {
  const [resumeText, setResumeText] = useState("");
  const [aiFeedbackEnabled, setAiFeedbackEnabled] = useState(false);
  const [salaryEstimateEnabled, setSalaryEstimateEnabled] = useState(false);
  const [coverLetterEnabled, setCoverLetterEnabled] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [salaryEstimate, setSalaryEstimate] = useState("");
  const [email, setEmail] = useState("");
  const [score, setScore] = useState(0);
  const [salaryUsd, setSalaryUsd] = useState(0);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const textAreaRef = useRef(null);

  const onChange = (value: string) => {
    setResumeText(value);
  };

  const onClick = async () => {
    setLoading(true);
    setProgress(0);

    try {
      if (aiFeedbackEnabled) {
        setProgress(33);
        const feedbackResponse = await fetch(
          "https://canva-backend.roya51788.workers.dev/review",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ resumeText }),
          }
        );

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
        setProgress(66);
        const salaryResponse = await fetch(
          "https://canva-backend.roya51788.workers.dev/salary-estimate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ resumeText }),
          }
        );

        if (salaryResponse.ok) {
          const salaryData = await salaryResponse.json();
          setSalaryEstimate(salaryData.salary_estimate_feedback);
          setSalaryUsd(salaryData.salary_estimate_usd);
        } else {
          console.error("Failed to fetch salary estimate");
        }
      }

      if (coverLetterEnabled) {
        setProgress(99);
        const coverLetterResponse = await fetch(
          "https://canva-backend.roya51788.workers.dev/cover-letter",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ resumeText }),
          }
        );

        if (coverLetterResponse.ok) {
          const coverLetterData = await coverLetterResponse.text();
          setCoverLetter(coverLetterData);
        } else {
          console.error("Failed to fetch cover letter");
        }
      }
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  const copyToClipboard = (text: string) => {
    if (!textAreaRef.current) {
      console.error("textarea ref is null");
      return;
    }

    const textArea = textAreaRef.current as HTMLTextAreaElement;
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    textArea.select();

    try {
      navigator.clipboard.writeText(text).then(
        () => {
          alert("Cover letter copied to clipboard!");
        },
        () => {
          const successful = document.execCommand('copy');
          if (successful) {
            alert("Cover letter copied to clipboard!");
          } else {
            console.error('Fallback: Unable to copy text to clipboard');
            alert("Unable to copy. Please try selecting the text manually and copying.");
          }
        }
      );
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert("Unable to copy. Please try selecting the text manually and copying.");
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <TypographyCard onClick={() => {}} ariaLabel="Welcome message">
          <Text variant="regular">
            <strong>Welcome to CareerLens!</strong> Paste your resume text below
            to get real-time keyword suggestions and optimize your resume for
            the job market.
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

        {loading && (
          <Box>
            <Text variant="regular">Analyzing...</Text>
            <ProgressBar value={progress} ariaLabel="Analysis Progress" />
          </Box>
        )}

        {!loading && score > 0 && (
          <Box>
            <Text variant="regular">Score: {score}/100</Text>
          </Box>
        )}

        {!loading && email && <Text>Email: {email}</Text>}

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

            <Button
              variant="primary"
              onClick={() => copyToClipboard(coverLetter)}
            >
              Copy Cover Letter
            </Button>
          </TypographyCard>
        )}

        <textarea
          ref={textAreaRef}
          style={{ position: 'absolute', left: '-9999px' }}
          aria-hidden="true"
        />
      </Rows>
    </div>
  );
};
