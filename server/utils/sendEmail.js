import nodemailer from 'nodemailer';

// Create transporter (configure with your email service)
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // or your email service (Outlook, Yahoo, etc.)
//   auth: {
//     user: process.env.EMAIL_USER, // your email
    // pass: process.env.EMAIL_PASS  // your email password or app password
//   }
// });

// Mock email function for development (since you're not ready for real emails yet)
export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    // For development - log to console instead of sending real email
    console.log('📧 Verification Email (Development Mode):', {
      to: email,
      verificationCode: verificationCode,
      timestamp: new Date().toISOString()
    });

    // ✅ COMMENT: Uncomment this code when ready for real emails
    /*
    // Real email sending code (uncomment when ready)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email - Sahil App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
            <h1>💰 Sahil App</h1>
            <p>Email Verification</p>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h2>Verify Your Email Address</h2>
            <p>Your verification code is:</p>
            <div style="text-align: center; margin: 20px 0;">
              <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">
                ${verificationCode}
              </div>
            </div>
            <p>Enter this code in the verification page to complete your registration.</p>
            <p>This code will expire in 10 minutes.</p>
          </div>
          <div style="text-align: center; padding: 20px; background: #333; color: white; font-size: 12px;">
            <p>© 2024 Sahil App. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully to:', email);
    */

    // For development - always return success
    return { success: true, message: 'Verification code would be sent via email' };
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    
    // For development - still return success even if email fails
    console.log('⚠️ Email service not configured, but continuing with development...');
    return { success: true, message: 'Development mode - email not sent' };
  }
};

// Additional email functions you might need
export const sendWelcomeEmail = async (email, name) => {
  console.log('📧 Welcome Email (Development Mode):', {
    to: email,
    name: name,
    timestamp: new Date().toISOString()
  });
  
  return { success: true, message: 'Welcome email queued (Development Mode)' };
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  console.log('📧 Password Reset Email (Development Mode):', {
    to: email,
    resetToken: resetToken,
    timestamp: new Date().toISOString()
  });
  
  return { success: true, message: 'Password reset email queued (Development Mode)' };
};