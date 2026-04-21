import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  userFirstname?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL
  : "https://converthq.com";

export const WelcomeEmail = ({
  userFirstname = "there",
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to ConvertHQ — High-performance file conversion</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px] text-center">
              <Text className="text-2xl font-bold text-[#000] p-0 m-0">
                Convert<span className="text-[#3b82f6]">HQ</span>
              </Text>
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Welcome to <strong>ConvertHQ</strong>, {userFirstname}!
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {userFirstname},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              We're excited to have you join ConvertHQ. You're now ready to convert and compress your images, videos, and audio directly in your browser with zero quality loss and maximum privacy.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={`${baseUrl}/convert`}
              >
                Start Converting Now
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              If you have any questions, feel free to reply to this email or join our Discord community.
            </Text>
            <Text className="text-[#666666] text-[12px] leading-[24px] mt-[32px]">
              Built with ❤️ by Harsh Moradiya
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
