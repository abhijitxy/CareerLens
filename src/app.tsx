// import { Button, Rows, Text } from "@canva/app-ui-kit";
// import { addNativeElement } from "@canva/design";
// import * as React from "react";
// import styles from "styles/components.css";

// export const App = () => {
//   const onClick = () => {
//     addNativeElement({
//       type: "TEXT",
//       children: ["Hello world!"],
//     });
//   };

//   return (
//     <div className={styles.scrollContainer}>
//       <Rows spacing="2u">
//         <Text>
//           To make changes to this app, edit the <code>src/app.tsx</code> file,
//           then close and reopen the app in the editor to preview the changes.
//         </Text>
//         <Button variant="primary" onClick={onClick} stretch>
//           Do something shitty
//         </Button>
//       </Rows>
//     </div>
//   );
// };

import { Button, Rows, Text, MultilineInput } from "@canva/app-ui-kit";
import * as React from "react";
import styles from "styles/components.css";

export const App = () => {
  const [resumeText, setResumeText] = React.useState("");

  const onChange = (value: string) => {
    setResumeText(value);
  };

  const onClick = () => {
    // Simulate adding a text element to the design
    console.log("Adding text to design: ", resumeText);
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
        <Button variant="primary" onClick={onClick} stretch>
          Analyze Resume
        </Button>
      </Rows>
    </div>
  );
};
