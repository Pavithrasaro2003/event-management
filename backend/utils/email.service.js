const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (organizerEmail, name, password) => {
  try {
    let transporter;

    // Use Gmail SMTP with EMAIL_USER / EMAIL_PASS from .env
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      // Fallback: log credentials to console when SMTP env vars are missing
      console.warn("[email.service] EMAIL_USER or EMAIL_PASS not set in .env – skipping email send.");
      console.log("=== WELCOME EMAIL DETAILS ===");
      console.log(`To: ${organizerEmail}`);
      console.log(`Name: ${name}`);
      console.log(`Password: ${password}`);
      console.log("=============================");
      return;
    }

    const loginLink = "http://localhost:3000/login";
    const mailOptions = {
      from: `"EventPro Team" <${process.env.EMAIL_USER}>`,
      to: organizerEmail,
      subject: "Welcome to EventPro - Organizer Account Created",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #c9a84c; border-radius: 12px; background-color: #0f0f0f; color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #f5d270; margin: 0;">Welcome to EventPro!</h1>
            <p style="color: #aaaaaa; margin-top: 5px;">Your organizer account has been successfully created</p>
          </div>
          <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px; border: 1px solid #c9a84c;">
            <p style="margin-top: 0; color: #ffffff;">Hello <strong>${name}</strong>,</p>
            <p style="color: #dddddd;">An administrator has registered you as an Event Organizer on our platform. Here are your login credentials:</p>
            <table style="width: 100%; margin: 20px 0; color: #ffffff;">
              <tr>
                <td style="padding: 5px 0; color: #aaaaaa; width: 100px;"><strong>Email:</strong></td>
                <td style="padding: 5px 0;"><code>${organizerEmail}</code></td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #aaaaaa; width: 100px;"><strong>Password:</strong></td>
                <td style="padding: 5px 0;"><code>${password}</code></td>
              </tr>
            </table>
            <div style="text-align: center; margin: 30px 0 10px 0;">
              <a href="${loginLink}" style="background: linear-gradient(135deg, #c9a84c, #f5d270); color: #0f0f0f; text-decoration: none; padding: 12px 30px; font-weight: bold; border-radius: 8px; display: inline-block; box-shadow: 0 4px 14px rgba(201,168,76,0.35);">Log In to Your Dashboard</a>
            </div>
          </div>
          <p style="color: #666666; font-size: 12px; text-align: center; margin-top: 20px;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent: %s", info.messageId);
    
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("Ethereal Email Preview URL: %s", previewUrl);
    }
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

module.exports = {
  sendWelcomeEmail,
};
