// backend/utils/sendEmail.js

const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  try {
    // Transporter banao (Gmail se)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email bhejo
    const info = await transporter.sendMail({
      from: `"SPMS System 🎓" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true };

  } catch (error) {
    console.error(`❌ Email error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// ── Ready-made Email Templates ─────────────────────────────

// 1. Project Approved Email
const projectApprovedEmail = (studentName, projectTitle) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 12px;">
    <div style="background: linear-gradient(135deg, #6366f1, #22d3ee); padding: 24px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
      <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Project Approved!</h1>
    </div>
    <p style="color: #374151; font-size: 16px;">Hello <strong>${studentName}</strong>,</p>
    <p style="color: #374151; font-size: 16px;">
      Tumhara project <strong>"${projectTitle}"</strong> approve ho gaya hai! 🎊
    </p>
    <p style="color: #374151; font-size: 16px;">
      Ab tum apna kaam shuru kar sakte ho. All the best! 💪
    </p>
    <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 13px;">
      SPMS — Student Project Management System
    </div>
  </div>
`;

// 2. Project Rejected Email
const projectRejectedEmail = (studentName, projectTitle, remarks) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 12px;">
    <div style="background: #ef4444; padding: 24px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
      <h1 style="color: white; margin: 0; font-size: 24px;">❌ Project Rejected</h1>
    </div>
    <p style="color: #374151; font-size: 16px;">Hello <strong>${studentName}</strong>,</p>
    <p style="color: #374151; font-size: 16px;">
      Tumhara project <strong>"${projectTitle}"</strong> reject hua hai.
    </p>
    <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <strong style="color: #dc2626;">Remarks:</strong>
      <p style="color: #374151; margin: 8px 0 0;">${remarks || "Koi remarks nahi diye."}</p>
    </div>
    <p style="color: #374151;">Improvements karke dobara submit karo! 💪</p>
    <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 13px;">
      SPMS — Student Project Management System
    </div>
  </div>
`;

// 3. Meeting Scheduled Email
const meetingScheduledEmail = (studentName, mentorName, title, date, time, link) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 12px;">
    <div style="background: linear-gradient(135deg, #f59e0b, #f97316); padding: 24px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
      <h1 style="color: white; margin: 0; font-size: 24px;">📅 Meeting Scheduled!</h1>
    </div>
    <p style="color: #374151; font-size: 16px;">Hello <strong>${studentName}</strong>,</p>
    <p style="color: #374151; font-size: 16px;">
      <strong>${mentorName}</strong> ne tumhare saath meeting schedule ki hai:
    </p>
    <div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 4px 0;"><strong>📌 Title:</strong> ${title}</p>
      <p style="margin: 4px 0;"><strong>📆 Date:</strong> ${date}</p>
      <p style="margin: 4px 0;"><strong>⏰ Time:</strong> ${time}</p>
      <p style="margin: 4px 0;"><strong>🔗 Link:</strong> <a href="${link}" style="color: #6366f1;">${link || "TBD"}</a></p>
    </div>
    <p style="color: #374151;">Time pe join karna! 😊</p>
    <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 13px;">
      SPMS — Student Project Management System
    </div>
  </div>
`;

// 4. Grade Diya Email
const gradeGivenEmail = (studentName, projectTitle, grade, remarks) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 12px;">
    <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 24px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
      <h1 style="color: white; margin: 0; font-size: 24px;">⭐ Grade Mil Gaya!</h1>
    </div>
    <p style="color: #374151; font-size: 16px;">Hello <strong>${studentName}</strong>,</p>
    <p style="color: #374151; font-size: 16px;">
      Tumhare project <strong>"${projectTitle}"</strong> ko grade mil gaya:
    </p>
    <div style="text-align: center; margin: 24px 0;">
      <span style="font-size: 64px; font-weight: 900; color: #6366f1;">${grade}</span>
    </div>
    ${remarks ? `
    <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <strong style="color: #16a34a;">Teacher Remarks:</strong>
      <p style="color: #374151; margin: 8px 0 0;">${remarks}</p>
    </div>` : ""}
    <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 13px;">
      SPMS — Student Project Management System
    </div>
  </div>
`;

// 5. Welcome / Register Email
const welcomeEmail = (name, role) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 12px;">
    <div style="background: linear-gradient(135deg, #6366f1, #22d3ee); padding: 24px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
      <h1 style="color: white; margin: 0; font-size: 24px;">🎓 Welcome to SPMS!</h1>
    </div>
    <p style="color: #374151; font-size: 16px;">Hello <strong>${name}</strong>,</p>
    <p style="color: #374151; font-size: 16px;">
      SPMS mein tumhara swagat hai! Tumhara account successfully bana gaya hai.
    </p>
    <div style="background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 4px 0;"><strong>👤 Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
    </div>
    <p style="color: #374151;">Ab login karke apna dashboard access karo! 🚀</p>
    <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 13px;">
      SPMS — Student Project Management System
    </div>
  </div>
`;

module.exports = {
  sendEmail,
  projectApprovedEmail,
  projectRejectedEmail,
  meetingScheduledEmail,
  gradeGivenEmail,
  welcomeEmail,
};
