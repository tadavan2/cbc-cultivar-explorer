import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, region, message, cultivar, timestamp } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const emailData = await resend.emails.send({
      from: 'CBC Cultivar Explorer <explorer@cbcberry.com>',
      to: ['kyle@cbcberry.com'], // Your CBC email
      subject: `New Contact: ${name}${company ? ` from ${company}` : ''}${cultivar ? ` - Interested in ${cultivar}` : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00ff88; border-bottom: 2px solid #00ff88; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            ${phone ? `<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
            ${region ? `<p><strong>Growing Region:</strong> ${region}</p>` : ''}
            ${cultivar ? `<p><strong>Interested Cultivar:</strong> <span style="color: #00ff88; font-weight: bold;">${cultivar}</span></p>` : ''}
          </div>
          
          <div style="background: #fff; padding: 20px; border-left: 4px solid #00ff88; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Message</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="background: #f1f3f4; padding: 15px; border-radius: 6px; margin-top: 30px;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              <strong>Submitted:</strong> ${new Date(timestamp).toLocaleString()}<br>
              <strong>Source:</strong> CBC Cultivar Explorer
            </p>
          </div>
        </div>
      `,
      // Plain text fallback
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        ${company ? `Company: ${company}` : ''}
        ${phone ? `Phone: ${phone}` : ''}
        ${region ? `Growing Region: ${region}` : ''}
        ${cultivar ? `Interested Cultivar: ${cultivar}` : ''}
        
        Message:
        ${message}
        
        Submitted: ${new Date(timestamp).toLocaleString()}
        Source: CBC Cultivar Explorer
      `
    });

    console.log('Email sent successfully:', emailData);

    return NextResponse.json({ 
      success: true, 
      message: 'Contact form submitted successfully' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
} 