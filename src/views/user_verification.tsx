import * as React from "react";
import {
  Html,
  Img,
  Text,
  Head,
  Preview,
  Body,
  Section,
  Container,
  Button,
} from "@react-email/components";

interface Props {
  name: string;
  email: string;
}

export const VerifyEmail = ({ name, email }: Props) => {
  const currentYear = new Date().getFullYear();

  return (
    <Html>
      <Head />
      <Preview>Your Verification Link</Preview>
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#A149BE1F",
          padding: "32px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            maxWidth: "480px",
            margin: "0 auto",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Section
            style={{
              textAlign: "center",
              marginBottom: "24px",
              borderBottom: "1px solid #eaeaea",
            }}
          >
            <Img
              src="https://imgur.com/a/ehxitst"
              alt=" Logo"
              width="120"
              height="40"
              style={{ objectFit: "contain", margin: "0 auto" }}
            />
          </Section>

          <Text
            style={{ fontSize: "16px", color: "#111111", fontWeight: "bold" }}
          >
            Hi {name},
          </Text>
          <Text
            style={{ fontSize: "15px", color: "#333333", lineHeight: "1.5" }}
          >
            Thank you for signing up at <strong>Braided Bliss</strong>! To
            complete your registration, please verify your email using the link
            below:
          </Text>

          <Text style={{ marginTop: "24px", fontSize: "14px", color: "#555" }}>
            Your verification link
          </Text>
          <Button
            href={`https://www.blissbyamina.com/auth/verify-email?email=${encodeURIComponent(email)}`}
          >
            Verify Email
          </Button>

          <Text
            style={{
              fontSize: "14px",
              color: "#555555",

              marginBottom: "24px",
            }}
          >
            This link will expire in 10 minutes.
          </Text>

          <Text style={{ fontSize: "14px", color: "#666666" }}>
            If you didn’t request this signup, you can ignore this email.
          </Text>

          <Section
            style={{
              marginTop: "40px",
              borderTop: "1px solid #eaeaea",
              paddingTop: "24px",
              textAlign: "center",
              fontSize: "12px",
              color: "#999999",
            }}
          >
            <Text>© {currentYear}. Braided Bliss, All rights reserved.</Text>
            <Text style={{ marginBottom: "16px" }}>
              You’re receiving this email because you signed up at Braided
              Bliss. To stop receiving these,
              <a
                href="#"
                style={{ color: "#7B61FF", textDecoration: "underline" }}
              >
                {" "}
                unsubscribe
              </a>{" "}
              anytime.
            </Text>
            <Section>
              <table
                role="presentation"
                align="center"
                cellPadding="0"
                cellSpacing="0"
                style={{ margin: "0 auto" }}
              >
                <tr>
                  <td style={{ padding: "0 6px" }}>
                    <a href="https://x.com">
                      <Img
                        src="https://cdn-icons-png.flaticon.com/512/3670/3670151.png"
                        width="24"
                        height="24"
                      />
                    </a>
                  </td>
                  <td style={{ padding: "0 6px" }}>
                    <a href="https://instagram.com">
                      <Img
                        src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                        width="24"
                        height="24"
                      />
                    </a>
                  </td>
                  <td style={{ padding: "0 6px" }}>
                    <a href="https://linkedin.com">
                      <Img
                        src="https://cdn-icons-png.flaticon.com/512/145/145807.png"
                        width="24"
                        height="24"
                      />
                    </a>
                  </td>
                </tr>
              </table>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerifyEmail;
