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
import { TimeSlot } from "../interfaces/interfaces";

interface Props {
  name: string;
  day: string;
  timeSlots: TimeSlot[];
}

export const AvailabilityEmail = ({ name, day, timeSlots }: Props) => {
  const currentYear = new Date().getFullYear();

  return (
    <Html>
      <Head />
      <Preview>New Appointment Slots Available</Preview>

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
          {/* Logo */}
          <Section
            style={{
              textAlign: "center",
              marginBottom: "24px",
              borderBottom: "1px solid #eaeaea",
            }}
          >
            <Img
              src="https://i.imgur.com/hGCsbJD.png"
              alt="Braided Bliss Logo"
              width="120"
              height="40"
              style={{ objectFit: "contain", margin: "0 auto" }}
            />
          </Section>

          {/* Greeting */}
          <Text style={{ fontSize: "16px", fontWeight: "bold" }}>
            Hi {name},
          </Text>

          {/* Message */}
          <Text style={{ fontSize: "15px", lineHeight: "1.5" }}>
            Great news! New appointment slots are now available at{" "}
            <strong>Braided Bliss</strong>.
          </Text>

          {/* Availability Info */}
          <Text style={{ marginTop: "16px", fontSize: "14px" }}>
            <strong>Available Day:</strong> {new Date(day).toDateString()}{" "}
          </Text>

          <Text style={{ fontSize: "14px" }}>
            <strong>Time Slots:</strong>
          </Text>

          {timeSlots.map((slot, index) => (
            <Text key={index} style={{ fontSize: "14px", marginLeft: "8px" }}>
              • {slot.start} - {slot.end}
            </Text>
          ))}

          {/* CTA */}
          <Button
            href={`http://localhost:5173/book`}
            style={{
              display: "inline-block",
              padding: "12px 24px",
              marginTop: "20px",
              backgroundColor: "#000000",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
          >
            Book Now
          </Button>

          {/* Footer */}
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
            <Text>© {currentYear} Braided Bliss. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AvailabilityEmail;
