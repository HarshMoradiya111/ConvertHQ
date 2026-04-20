import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  userEmail?: string;
}

export const WelcomeEmail = ({
  userEmail,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to ConvertHQ - Let's get converting!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={title}>ConvertHQ</Heading>
        </Section>
        <Section style={section}>
          <Text style={text}>Hi {userEmail || "there"},</Text>
          <Text style={text}>
            Welcome to ConvertHQ! We're excited to help you streamline your file conversion workflow.
          </Text>
          <Text style={text}>
            Whether you're converting high-resolution images or optimizing files for the web, we've got you covered.
          </Text>
          <Button style={button} href="https://converthq.com/dashboard">
            Go to Dashboard
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            If you have any questions, just reply to this email. We're here to help!
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const header = {
  padding: "0 48px",
};

const title = {
  color: "#0f172a",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const section = {
  padding: "0 48px",
};

const text = {
  color: "#334155",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px 0",
  marginTop: "20px",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "40px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
