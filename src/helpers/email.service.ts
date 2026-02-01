import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const emailService = {
  // Send verification email
  sendVerificationEmail: async (email: string, name: string, token: string) => {
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'OrderEats <noreply@ordereats.com>',
      to: email,
      subject: 'Verify Your Email - OrderEats',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🍱 Welcome to OrderEats!</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>Thank you for signing up with OrderEats! Please verify your email address to get started.</p>
                <div style="text-align: center;">
                  <a href="${verificationLink}" class="button">Verify Email Address</a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #667eea;">${verificationLink}</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't create an account with OrderEats, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} OrderEats. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }
  },

  // Send password reset email
  sendPasswordResetEmail: async (email: string, name: string, token: string) => {
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'OrderEats <noreply@ordereats.com>',
      to: email,
      subject: 'Reset Your Password - OrderEats',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Password Reset Request</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>We received a request to reset your password for your OrderEats account.</p>
                <div style="text-align: center;">
                  <a href="${resetLink}" class="button">Reset Password</a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #667eea;">${resetLink}</p>
                <div class="warning">
                  <strong>⚠️ Security Notice:</strong>
                  <p>This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
                </div>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} OrderEats. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }
  },

  // Send order confirmation email
  sendOrderConfirmationEmail: async (
    email: string,
    name: string,
    orderDetails: {
      orderId: string;
      totalAmount: number;
      items: any[];
      deliveryAddress: string;
    }
  ) => {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'OrderEats <noreply@ordereats.com>',
      to: email,
      subject: `Order Confirmation - #${orderDetails.orderId.slice(0, 8)}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
              .item { border-bottom: 1px solid #eee; padding: 10px 0; }
              .total { font-size: 20px; font-weight: bold; color: #667eea; margin-top: 15px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Order Confirmed!</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>Thank you for your order! We're preparing your delicious meal.</p>
                <div class="order-details">
                  <h3>Order #${orderDetails.orderId.slice(0, 8)}</h3>
                  <p><strong>Delivery Address:</strong> ${orderDetails.deliveryAddress}</p>
                  <div style="margin-top: 20px;">
                    ${orderDetails.items.map(item => `
                      <div class="item">
                        <strong>${item.quantity}x ${item.name}</strong>
                        <span style="float: right;">৳${item.price}</span>
                      </div>
                    `).join('')}
                  </div>
                  <div class="total">
                    Total: ৳${orderDetails.totalAmount}
                  </div>
                </div>
                <p>We'll send you another email when your order is on the way!</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} OrderEats. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }
  },
};
