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
  adminName: string;
  customerName: string;
  day: string;
  timeSlots: string;
  city: string;
  serviceName: string;
}

export const AdminBookingEmail = ({
  adminName,
  customerName,
  day,
  timeSlots,
  city,
  serviceName,
}: Props) => {
  const currentYear = new Date().getFullYear();

  return (
    <Html>
      <Head />
      <Preview>New Booking Created</Preview>

      <Body style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#A149BE1F",
        padding: "32px 0",
      }}>
        <Container style={{
          backgroundColor: "#ffffff",
          maxWidth: "480px",
          margin: "0 auto",
          borderRadius: "12px",
          padding: "32px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}>
          <Section style={{
            textAlign: "center",
            marginBottom: "24px",
            borderBottom: "1px solid #eaeaea",
          }}>
            <Img
              src="https://i.imgur.com/hGCsbJD.png"
              alt="Braided Bliss Logo"
              width="120"
              height="40"
              style={{ objectFit: "contain", margin: "0 auto" }}
            />
          </Section>

          <Text style={{ fontSize: "16px", fontWeight: "bold" }}>
            Hi {adminName},
          </Text>

          <Text style={{ fontSize: "15px", lineHeight: "1.5" }}>
            A user has created a new booking. Here are the booking details:
          </Text>

          <Text style={{ fontSize: "14px" }}>
            <strong>Customer Name:</strong> {customerName}
          </Text>

          <Text style={{ fontSize: "14px" }}>
            <strong>City:</strong> {city}
          </Text>

          <Text style={{ fontSize: "14px" }}>
            <strong>Service Name:</strong> {serviceName}
          </Text>

          <Text style={{ fontSize: "14px" }}>
            <strong>Booking Day:</strong> {new Date(day).toDateString()}
          </Text>

          <Text style={{ fontSize: "14px" }}>
            <strong>Time Slots:</strong>
          </Text>

            <Text  style={{ fontSize: "14px", marginLeft: "8px" }}>
              • {timeSlots}
            </Text>
          

          <Button
            href="http://localhost:5173/admin/bookings"
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
            View Booking
          </Button>

          <Section style={{
            marginTop: "40px",
            borderTop: "1px solid #eaeaea",
            paddingTop: "24px",
            textAlign: "center",
            fontSize: "12px",
            color: "#999999",
          }}>
            <Text>© {currentYear} Braided Bliss. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
