import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface BillingEmailProps {
  userFirstname?: string;
  planName?: string;
  amount?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL
  : "https://converthq.com";

export const BillingEmail = ({
  userFirstname = "there",
  planName = "Pro",
  amount = "$9.00",
}: BillingEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Upgrade Confirmed: Welcome to ConvertHQ Pro!</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px] text-center">
              <Text className="text-2xl font-bold text-[#000] p-0 m-0">
                Convert<span className="text-[#3b82f6]">HQ</span>
              </Text>
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Upgrade Confirmed! 🚀
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hi {userFirstname},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Thank you for upgrading to <strong>ConvertHQ {planName}</strong>. Your subscription is now active, and you have unlimited access to all premium features, including bulk downloads and video/audio conversion.
            </Text>
            
            <Section className="bg-[#f9fafb] rounded-lg p-6 my-8 border border-slate-100">
              <Text className="text-[14px] font-bold text-slate-900 m-0 mb-4 uppercase tracking-wider">Subscription Summary</Text>
              <div className="flex justify-between mb-2">
                <Text className="text-slate-500 text-[14px] m-0">Plan</Text>
                <Text className="text-slate-900 text-[14px] font-semibold m-0">{planName}</Text>
              </div>
              <div className="flex justify-between">
                <Text className="text-slate-500 text-[14px] m-0">Amount Paid</Text>
                <Text className="text-slate-900 text-[14px] font-semibold m-0">{amount}</Text>
              </div>
            </Section>

            <Hr className="border-[#eaeaea] my-[26px]" />
            
            <Text className="text-black text-[14px] leading-[24px]">
              You can manage your subscription at any time from your dashboard.
            </Text>
            
            <Text className="text-[#666666] text-[12px] leading-[24px] mt-[32px]">
              If you have any questions about this charge, please contact support@converthq.com.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default BillingEmail;
