import { NextRequest, NextResponse } from 'next/server';

interface PrivateEventInquiry {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country?: string;
  eventType: string;
  guestCount?: string;
  preferredTime?: string;
  cateringNeeded?: boolean;
  avEquipment?: boolean;
  decorations?: boolean;
  additionalInfo?: string;
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone format (basic)
function isValidPhone(phone: string): boolean {
  // Allow digits, spaces, dashes, parentheses, and plus sign
  const phoneRegex = /^[\d\s\-()+ ]{7,20}$/;
  return phoneRegex.test(phone);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PrivateEventInquiry;

    // Validate required fields
    const errors: string[] = [];

    if (!body.firstName?.trim()) {
      errors.push('First name is required');
    }

    if (!body.lastName?.trim()) {
      errors.push('Last name is required');
    }

    if (!body.email?.trim()) {
      errors.push('Email address is required');
    } else if (!isValidEmail(body.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!body.phone?.trim()) {
      errors.push('Phone number is required');
    } else if (!isValidPhone(body.phone)) {
      errors.push('Please enter a valid phone number');
    }

    if (!body.eventType?.trim()) {
      errors.push('Event type is required');
    }

    // Return validation errors if any
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: errors.join(', ') },
        { status: 400 }
      );
    }

    // Log the inquiry (in production, this would send an email or store in a database)
    console.log('='.repeat(60));
    console.log('NEW PRIVATE EVENT INQUIRY');
    console.log('='.repeat(60));
    console.log(`Name: ${body.firstName} ${body.lastName}`);
    console.log(`Email: ${body.email}`);
    console.log(`Phone: ${body.phone}`);
    console.log(`Country: ${body.country || 'Not specified'}`);
    console.log(`Event Type: ${body.eventType}`);
    console.log(`Guest Count: ${body.guestCount || 'Not specified'}`);
    console.log(`Preferred Time: ${body.preferredTime || 'Not specified'}`);
    console.log(`Catering Needed: ${body.cateringNeeded ? 'Yes' : 'No'}`);
    console.log(`A/V Equipment: ${body.avEquipment ? 'Yes' : 'No'}`);
    console.log(`Decorations: ${body.decorations ? 'Yes' : 'No'}`);
    console.log(`Additional Info: ${body.additionalInfo || 'None'}`);
    console.log(`Submitted At: ${new Date().toISOString()}`);
    console.log('='.repeat(60));

    // In a production environment, you would:
    // 1. Send notification email to the restaurant
    // 2. Send confirmation email to the customer
    // 3. Store the inquiry in a database or CMS

    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Thank you for your inquiry! We will be in touch with you soon.',
    });
  } catch (error) {
    console.error('Error processing private event inquiry:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your request. Please try again.',
      },
      { status: 500 }
    );
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed. Please use POST to submit an inquiry.' },
    { status: 405 }
  );
}
