import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.example.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER || "your-email@example.com",
        pass: process.env.EMAIL_PASS || "your-email-password",
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Your App" <noreply@example.com>',
      to,
      subject,
      html,
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};