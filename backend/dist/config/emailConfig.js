import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email service provider
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
});
export default transporter;
//# sourceMappingURL=emailConfig.js.map