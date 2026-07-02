import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

type OrderItem = {
  product_name: string;
  price: number;
  quantity: number;
};

export type OrderDetails = {
  orderId: string | number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItem[];
  shippingAddress: string;
  orderTime: string;
};

/**
 * Format currency to INR
 */
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Sends an order confirmation email to the customer
 */
export const sendOrderConfirmationEmail = async (customerEmail: string, details: OrderDetails) => {
  const subject = `Order Confirmation - Octane Powersports (Order #${details.orderId})`;
  
  const itemsHtml = details.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.product_name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${formatCurrency(item.price)}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #ff6b00;">Thank you for your order!</h2>
      <p>Hi ${details.customerName},</p>
      <p>We've received your order <strong>#${details.orderId}</strong> and we're getting it ready for you.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f8f8f8;">
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
            <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total Amount:</td>
            <td style="padding: 10px; text-align: right; font-weight: bold;">${formatCurrency(details.totalAmount)}</td>
          </tr>
        </tfoot>
      </table>

      <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">Order Details</h3>
        <p><strong>Payment Status:</strong> ${details.paymentStatus}</p>
        <p><strong>Shipping Address:</strong><br/>${details.shippingAddress.replace(/\n/g, '<br/>')}</p>
      </div>

      <p>If you have any questions, feel free to contact us at <a href="mailto:info@octaneps.com">info@octaneps.com</a>.</p>
      <p>Ride Safe,<br/><strong>Octane Powersports</strong></p>
    </div>
  `;

  try {
    const response = await resend.emails.send({
      from: 'Octane Powersports <noreply@octaneps.com>',
      to: customerEmail,
      subject,
      html: htmlContent,
    });
    if (response.error) {
      console.error('Resend API Error (Order Conf):', response.error);
      return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Exception sending customer order confirmation:', error);
    return { success: false, error };
  }
};

/**
 * Sends a new order notification email to the admin
 */
export const sendAdminOrderNotification = async (details: OrderDetails) => {
  const adminEmail = process.env.ADMIN_EMAIL || '20006shivam@gmail.com';
  const subject = `New Order Received - #${details.orderId}`;

  const itemsHtml = details.items.map(item => `
    <tr>
      <td style="padding: 10px; border: 1px solid #000;">${item.product_name}</td>
      <td style="padding: 10px; border: 1px solid #000;">Default Title</td>
      <td style="padding: 10px; border: 1px solid #000;">N/A</td>
      <td style="padding: 10px; border: 1px solid #000;">₹ ${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border: 1px solid #000; text-align: center;">${item.quantity}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0; color: #000;">
      <p style="margin-bottom: 20px; font-size: 16px;">Hello Octane Powersports LLP,</p>
      <p style="margin-bottom: 30px; font-size: 16px;">Your Order, # ${details.orderId}, has been placed successfully.</p>
      
      <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin-bottom: 30px; border: 1px solid #ddd;">
        <h3 style="margin-top: 0; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Customer Information</h3>
        <p style="margin: 8px 0;"><strong>Name:</strong> ${details.customerName}</p>
        <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${details.customerEmail}">${details.customerEmail}</a></p>
        <p style="margin: 8px 0;"><strong>Phone:</strong> ${details.customerPhone}</p>
        <p style="margin: 8px 0;"><strong>Order Time:</strong> ${new Date(details.orderTime).toLocaleString('en-IN')}</p>
      </div>
      
      <h3 style="margin-bottom: 15px;">Order Items</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background-color: #f1f1f1;">
            <th style="padding: 10px; text-align: left; border: 1px solid #000; font-weight: bold;">Product</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #000; font-weight: bold;">Variant</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #000; font-weight: bold;">SKU</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #000; font-weight: bold;">Price</th>
            <th style="padding: 10px; text-align: center; border: 1px solid #000; font-weight: bold;">Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right; border: 1px solid #000; font-weight: bold;">Total Amount:</td>
            <td colspan="2" style="padding: 10px; text-align: left; border: 1px solid #000; font-weight: bold;">₹ ${details.totalAmount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #ddd;">
        <h3 style="margin-top: 0; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Payment & Shipping</h3>
        <p style="margin: 8px 0;"><strong>Payment Method:</strong> ${details.paymentMethod}</p>
        <p style="margin: 8px 0;"><strong>Payment Status:</strong> ${details.paymentStatus}</p>
        <p style="margin: 8px 0;"><strong>Shipping Address:</strong><br/>${details.shippingAddress.replace(/\n/g, '<br/>')}</p>
      </div>
    </div>
  `;

  try {
    const response = await resend.emails.send({
      from: 'Octane Powersports <noreply@octaneps.com>',
      to: adminEmail,
      subject,
      html: htmlContent,
    });
    if (response.error) {
      console.error('Resend API Error (Admin Order):', response.error);
      return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Exception sending admin order notification:', error);
    return { success: false, error };
  }
};

/**
 * Sends an OTP email for sign up verification
 */
export const sendOTPEmail = async (email: string, otp: string) => {
  const subject = `Your Octane Powersports Verification Code`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
      <h2 style="color: #ff6b00; text-align: center;">Verify Your Email</h2>
      <p style="font-size: 16px;">Hello,</p>
      <p style="font-size: 16px;">Thank you for registering with Octane Powersports! Please use the verification code below to complete your sign-up process. This code will expire in 10 minutes.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; background-color: #f4f4f4; padding: 15px 30px; border-radius: 5px; color: #0a0a0a;">
          ${otp}
        </span>
      </div>
      
      <p style="font-size: 14px; color: #666; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
        <p style="margin: 0; font-size: 14px;">Ride Safe,<br/><strong>Octane Powersports</strong></p>
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Octane Powersports <noreply@octaneps.com>',
        to: email,
        subject: subject,
        html: htmlContent
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Resend API Error (OTP via fetch):', data);
      return { success: false, error: data };
    }
    return { success: true, data };
  } catch (error) {
    console.error('Exception sending OTP email:', error);
    return { success: false, error };
  }
};

/**
 * Sends an OTP email for password reset
 */
export const sendPasswordResetEmail = async (email: string, otp: string) => {
  const subject = `Password Reset Request - Octane Powersports`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
      <h2 style="color: #ff6b00; text-align: center;">Reset Your Password</h2>
      <p style="font-size: 16px;">Hello,</p>
      <p style="font-size: 16px;">We received a request to reset your password for your Octane Powersports account. Please use the verification code below to securely reset it. This code will expire in 10 minutes.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; background-color: #f4f4f4; padding: 15px 30px; border-radius: 5px; color: #0a0a0a;">
          ${otp}
        </span>
      </div>
      
      <p style="font-size: 14px; color: #666; text-align: center;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
        <p style="margin: 0; font-size: 14px;">Ride Safe,<br/><strong>Octane Powersports</strong></p>
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Octane Powersports <noreply@octaneps.com>',
        to: email,
        subject: subject,
        html: htmlContent
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Resend API Error (Password Reset via fetch):', data);
      return { success: false, error: data };
    }
    return { success: true, data };
  } catch (error) {
    console.error('Exception sending password reset email:', error);
    return { success: false, error };
  }
};

/**
 * Sends an email when a bank deposit order is placed (awaiting verification)
 */
export const sendBankDepositReceivedEmail = async (customerEmail: string, details: OrderDetails) => {
  const subject = `Order Received - Awaiting Payment Verification (Order #${details.orderId})`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #ff6b00;">Order Received!</h2>
      <p>Hi ${details.customerName},</p>
      <p>We've received your order <strong>#${details.orderId}</strong> and your bank deposit receipt.</p>
      <p>Our team will verify the payment shortly. Once verified, we will begin processing your order and send you a confirmation email.</p>
      
      <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #eee;">
        <h3 style="margin-top: 0; color: #0a0a0a;">Order Details</h3>
        <p><strong>Total Amount:</strong> ${formatCurrency(details.totalAmount)}</p>
        <p><strong>Payment Status:</strong> Pending Verification</p>
      </div>

      <p>If you have any questions, feel free to contact us at <a href="mailto:info@octaneps.com">info@octaneps.com</a>.</p>
      <p>Ride Safe,<br/><strong>Octane Powersports</strong></p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Octane Powersports <noreply@octaneps.com>',
        to: customerEmail,
        subject,
        html: htmlContent
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Exception sending bank deposit received email:', error);
    return { success: false, error };
  }
};

/**
 * Sends an email when a bank deposit verification fails
 */
export const sendBankDepositRejectedEmail = async (customerEmail: string, details: OrderDetails, adminRemarks: string) => {
  const subject = `Payment Verification Failed - Octane Powersports (Order #${details.orderId})`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #e53935;">Payment Verification Failed</h2>
      <p>Hi ${details.customerName},</p>
      <p>Unfortunately, we could not verify your bank deposit for order <strong>#${details.orderId}</strong>.</p>
      
      <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #ffcdd2;">
        <h3 style="margin-top: 0; color: #c62828;">Reason</h3>
        <p style="color: #b71c1c; font-weight: bold;">${adminRemarks || 'The provided receipt or amount did not match our records.'}</p>
      </div>

      <p>Please reply to this email or contact support to resolve this issue and complete your order.</p>
      
      <p>Ride Safe,<br/><strong>Octane Powersports</strong></p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Octane Powersports <noreply@octaneps.com>',
        to: customerEmail,
        subject,
        html: htmlContent
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Exception sending bank deposit rejected email:', error);
    return { success: false, error };
  }
};
