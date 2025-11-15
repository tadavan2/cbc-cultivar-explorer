import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Lazy initialization to avoid build-time errors if API key is missing
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  return new Resend(apiKey);
};

// Function to get location from IP
async function getLocationFromIP(ip: string) {
  try {
    // Using a free IP geolocation service
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        city: data.city,
        region: data.regionName,
        country: data.country,
        zip: data.zip,
        timezone: data.timezone,
        isp: data.isp,
        org: data.org,
        coordinates: `${data.lat}, ${data.lon}`
      };
    }
  } catch (error) {
    console.error('Error getting location:', error);
  }
  return null;
}

// Function to parse User Agent
function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();
  
  // Browser detection
  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';
  
  // OS detection
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  // Device type
  let device = 'Desktop';
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) device = 'Mobile';
  else if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet';
  
  return { browser, os, device };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, region, message, cultivar, timestamp, timeOnSite, visitedPages, referrer, screenResolution, viewportSize } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Collect visitor intelligence
    const userAgent = request.headers.get('user-agent') || '';
    const serverReferer = request.headers.get('referer') || 'Direct';
    const clientReferer = referrer || serverReferer; // Use client-side referrer if available
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'Unknown';
    
    const deviceInfo = parseUserAgent(userAgent);
    const locationData = await getLocationFromIP(ip.split(',')[0]); // Get first IP if multiple

    // Send email using Resend
    const resend = getResend();
    await resend.emails.send({
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
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">🕵️ Visitor Intelligence</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p><strong>IP Address:</strong> ${ip}</p>
                ${locationData ? `
                  <p><strong>Location:</strong> ${locationData.city}, ${locationData.region}, ${locationData.country}</p>
                  ${locationData.zip ? `<p><strong>ZIP:</strong> ${locationData.zip}</p>` : ''}
                  <p><strong>Timezone:</strong> ${locationData.timezone}</p>
                  <p><strong>ISP:</strong> ${locationData.isp}</p>
                ` : '<p><strong>Location:</strong> Unable to determine</p>'}
              </div>
              <div>
                <p><strong>Device:</strong> ${deviceInfo.device}</p>
                <p><strong>OS:</strong> ${deviceInfo.os}</p>
                <p><strong>Browser:</strong> ${deviceInfo.browser}</p>
                <p><strong>Referrer:</strong> ${clientReferer}</p>
                ${timeOnSite ? `<p><strong>Time on Site:</strong> ${timeOnSite}</p>` : ''}
                ${screenResolution ? `<p><strong>Screen:</strong> ${screenResolution}</p>` : ''}
              </div>
            </div>
            ${visitedPages ? `<p><strong>Pages Visited:</strong> ${visitedPages}</p>` : ''}
            ${viewportSize ? `<p><strong>Viewport:</strong> ${viewportSize}</p>` : ''}
            <details style="margin-top: 15px;">
              <summary style="cursor: pointer; color: #666; font-size: 12px;">Technical Details</summary>
              <p style="font-size: 11px; color: #888; margin-top: 10px; word-break: break-all;">
                <strong>User Agent:</strong> ${userAgent}
              </p>
            </details>
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
        
        CONTACT INFORMATION:
        Name: ${name}
        Email: ${email}
        ${company ? `Company: ${company}` : ''}
        ${phone ? `Phone: ${phone}` : ''}
        ${region ? `Growing Region: ${region}` : ''}
        ${cultivar ? `Interested Cultivar: ${cultivar}` : ''}
        
        MESSAGE:
        ${message}
        
        VISITOR INTELLIGENCE:
        IP: ${ip}
        ${locationData ? `Location: ${locationData.city}, ${locationData.region}, ${locationData.country}` : 'Location: Unable to determine'}
        Device: ${deviceInfo.device} - ${deviceInfo.os} - ${deviceInfo.browser}
                 Referrer: ${clientReferer}
                 ${timeOnSite ? `Time on Site: ${timeOnSite}` : ''}
         ${visitedPages ? `Pages Visited: ${visitedPages}` : ''}
         ${screenResolution ? `Screen Resolution: ${screenResolution}` : ''}
         ${viewportSize ? `Viewport Size: ${viewportSize}` : ''}
        
        User Agent: ${userAgent}
        
        Submitted: ${new Date(timestamp).toLocaleString()}
        Source: CBC Cultivar Explorer
      `
    });

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