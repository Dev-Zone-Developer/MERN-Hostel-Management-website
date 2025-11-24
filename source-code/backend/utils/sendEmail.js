import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const emailTemplate = (subject, body) => {
    return `
    <div style="font-family: Arial; padding: 20px;">
      <h2>${subject}</h2>
      <p>${body}</p>
      <br/>
      <hr/>
      <small>This email was sent automatically by the Server.</small>
    </div>
  `;
};

const sendEmail = async (email, subject, body) => {
    try {
        const html = emailTemplate(subject, body);

        const info = await transporter.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: email,
            subject,
            html,
        });

        console.log("Email sent:", info.messageId);

        return { success: true, info };
    } catch (err) {
        console.error("Email sending failed:", err.message);
        return { success: false, error: err.message };
    }
};

export {
    sendEmail
}