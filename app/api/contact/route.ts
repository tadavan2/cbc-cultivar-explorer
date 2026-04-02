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

// HTML entity escaping to prevent XSS in email templates
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// In-memory rate limiter
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5; // max requests per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitMap.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

// Function to get location from IP
async function getLocationFromIP(ip: string) {
  try {
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

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Length limits to prevent abuse
    if (name.length > 200 || email.length > 320 || message.length > 5000 ||
        (company && company.length > 200) || (phone && phone.length > 50) ||
        (region && region.length > 200)) {
      return NextResponse.json(
        { error: 'Input exceeds maximum length' },
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

    // Rate limiting
    if (isRateLimited(ip.split(',')[0])) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const deviceInfo = parseUserAgent(userAgent);
    const locationData = await getLocationFromIP(ip.split(',')[0]); // Get first IP if multiple

    // Escape all user-supplied values for safe HTML embedding
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCompany = company ? escapeHtml(company) : '';
    const safePhone = phone ? escapeHtml(phone) : '';
    const safeRegion = region ? escapeHtml(region) : '';
    const safeCultivar = cultivar ? escapeHtml(cultivar) : '';
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
    const safeClientReferer = escapeHtml(clientReferer);
    const safeTimeOnSite = timeOnSite ? escapeHtml(String(timeOnSite)) : '';
    const safeVisitedPages = visitedPages ? escapeHtml(String(visitedPages)) : '';
    const safeScreenResolution = screenResolution ? escapeHtml(String(screenResolution)) : '';
    const safeViewportSize = viewportSize ? escapeHtml(String(viewportSize)) : '';
    const safeUserAgent = escapeHtml(userAgent);
    const safeIp = escapeHtml(ip);
    const safeLocationCity = locationData?.city ? escapeHtml(locationData.city) : '';
    const safeLocationRegion = locationData?.region ? escapeHtml(locationData.region) : '';
    const safeLocationCountry = locationData?.country ? escapeHtml(locationData.country) : '';
    const safeLocationZip = locationData?.zip ? escapeHtml(locationData.zip) : '';
    const safeLocationTimezone = locationData?.timezone ? escapeHtml(locationData.timezone) : '';
    const safeLocationIsp = locationData?.isp ? escapeHtml(locationData.isp) : '';

    // Send email using Resend
    const resend = getResend();
    await resend.emails.send({
      from: 'CBC Cultivar Explorer <explorer@cbcberry.com>',
      to: [process.env.CONTACT_EMAIL || 'admin@cbcberry.com'],
      subject: `New Contact: ${safeName}${safeCompany ? ` from ${safeCompany}` : ''}${safeCultivar ? ` - Interested in ${safeCultivar}` : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00ff88; border-bottom: 2px solid #00ff88; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Contact Information</h3>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${encodeURIComponent(email)}">${safeEmail}</a></p>
            ${safeCompany ? `<p><strong>Company:</strong> ${safeCompany}</p>` : ''}
            ${safePhone ? `<p><strong>Phone:</strong> <a href="tel:${encodeURIComponent(phone)}">${safePhone}</a></p>` : ''}
            ${safeRegion ? `<p><strong>Growing Region:</strong> ${safeRegion}</p>` : ''}
            ${safeCultivar ? `<p><strong>Interested Cultivar:</strong> <span style="color: #00ff88; font-weight: bold;">${safeCultivar}</span></p>` : ''}
          </div>

          <div style="background: #fff; padding: 20px; border-left: 4px solid #00ff88; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Message</h3>
            <p style="line-height: 1.6; color: #555;">${safeMessage}</p>
          </div>

          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">🕵️ Visitor Intelligence</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p><strong>IP Address:</strong> ${safeIp}</p>
                ${locationData ? `
                  <p><strong>Location:</strong> ${safeLocationCity}, ${safeLocationRegion}, ${safeLocationCountry}</p>
                  ${safeLocationZip ? `<p><strong>ZIP:</strong> ${safeLocationZip}</p>` : ''}
                  <p><strong>Timezone:</strong> ${safeLocationTimezone}</p>
                  <p><strong>ISP:</strong> ${safeLocationIsp}</p>
                ` : '<p><strong>Location:</strong> Unable to determine</p>'}
              </div>
              <div>
                <p><strong>Device:</strong> ${deviceInfo.device}</p>
                <p><strong>OS:</strong> ${deviceInfo.os}</p>
                <p><strong>Browser:</strong> ${deviceInfo.browser}</p>
                <p><strong>Referrer:</strong> ${safeClientReferer}</p>
                ${safeTimeOnSite ? `<p><strong>Time on Site:</strong> ${safeTimeOnSite}</p>` : ''}
                ${safeScreenResolution ? `<p><strong>Screen:</strong> ${safeScreenResolution}</p>` : ''}
              </div>
            </div>
            ${safeVisitedPages ? `<p><strong>Pages Visited:</strong> ${safeVisitedPages}</p>` : ''}
            ${safeViewportSize ? `<p><strong>Viewport:</strong> ${safeViewportSize}</p>` : ''}
            <details style="margin-top: 15px;">
              <summary style="cursor: pointer; color: #666; font-size: 12px;">Technical Details</summary>
              <p style="font-size: 11px; color: #888; margin-top: 10px; word-break: break-all;">
                <strong>User Agent:</strong> ${safeUserAgent}
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
