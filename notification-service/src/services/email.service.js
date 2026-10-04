const sgMail = require('@sendgrid/mail');
const logger = require('../config/logger');
const { config } = require('../config');
const {
  getOtpTemplate,
  getWelcomeTemplate,
  getBookingConfirmedTemplate,
  getBookingFailedTemplate,
  getBookingCancelledTemplate,
} = require('../email-templates');

sgMail.setApiKey(config.SENDGRID_API_KEY);

class EmailService {
  constructor() {
    this.from = config.SENDER_EMAIL_ADDRESS;
    this.maxRetries = 3;
  }

  async sendWithRetries(msg, retries = 0) {
    try {
      await sgMail.send(msg);

      logger.info(`Email sent successfully to ${msg.to}`, {
        subject: msg.subject,
        attempt: retries + 1,
      });

      return { success: true };
    } catch (error) {
      logger.error(
        `Eamil sending failed (attempt ${retries + 1}/${this.maxRetries})`,
        {
          to: msg.to,
          error: error.message,
          code: error.code,
        },
      );

      if (retries < this.maxRetries - 1) {
        const delay = Math.pow(2, retries) * 1000;

        await new Promise((resolve) => setTimeout(resolve, delay));

        return this.sendWithRetries(msg, retries + 1);
      }

      throw error;
    }
  }

  async sendOtpEmail(email, otp, ttlMinutes) {
    const msg = {
      to: email,
      from: this.from,
      subject: 'OTP Verification Code for Railway App',
      html: getOtpTemplate(otp, ttlMinutes),
    };

    return this.sendWithRetries(msg);
  }

  async sendWelcomeEmail(email, firstName) {
    const msg = {
      to: email,
      from: this.from,
      subject: 'Welcome to Railway App!',
      html: getWelcomeTemplate(firstName),
    };

    return this.sendWithRetries(msg);
  }

  async sendBookingConfirmedEmail(email, bookingData) {
    const msg = {
      to: email,
      from: this.from,
      subject: `Your Booking Confirmation (${bookingData.trainName || 'Your Train Ticket'}) - Railway App`,
      html: getBookingConfirmedTemplate(bookingData),
    };

    return this.sendWithRetries(msg);
  }

  async sendBookingFailedEmail(email, bookingData) {
    const msg = {
      to: email,
      from: this.from,
      subject: `Booking Failed (Please Try Again) - Railway App`,
      html: getBookingFailedTemplate(bookingData),
    };

    return this.sendWithRetries(msg);
  }

  async sendBookingCancelledEmail(email, bookingData) {
    const msg = {
      to: email,
      from: this.from,
      subject: `Booking Cancelled (Refund Update) - Railway App`,
      html: getBookingCancelledTemplate(bookingData),
    };

    return this.sendWithRetries(msg);
  }
}

module.exports = new EmailService();
