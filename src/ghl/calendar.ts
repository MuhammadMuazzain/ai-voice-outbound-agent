import { ghlClient } from './client.js';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

export interface CalendarSlot {
  slotId: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  tags?: string[];
}

export interface BookingData {
  slotId: string;
  contactId: string;
  calendarId: string;
}

/**
 * Get available calendar slots
 */
export async function checkAvailability(options: {
  dateFrom: string;
  dateTo: string;
  calendarId?: string;
}): Promise<CalendarSlot[]> {
  logger.info(
    { dateFrom: options.dateFrom, dateTo: options.dateTo },
    'Checking calendar availability'
  );

  try {
    const calendarId = options.calendarId || config.GHL_CALENDAR_ID;

    // GHL calendar availability endpoint
    const response = await ghlClient.get<{
      slots: Array<{
        id: string;
        start: string;
        end: string;
        bookingUrl?: string;
      }>;
    }>(`/calendars/${calendarId}/availability`, {
      startDate: options.dateFrom,
      endDate: options.dateTo,
    });

    return (response.slots || []).map((slot) => ({
      slotId: slot.id,
      startTime: slot.start,
      endTime: slot.end,
      available: !slot.bookingUrl,
    }));
  } catch (error) {
    logger.error({ error }, 'Failed to check calendar availability');
    throw error;
  }
}

/**
 * Book an appointment slot
 */
export async function bookAppointment(
  slotId: string,
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  }
): Promise<{ appointmentId: string; confirmationUrl?: string }> {
  logger.info(
    { slotId, contactName: contactInfo.name },
    'Booking appointment'
  );

  try {
    // First, create or find the contact
    const contact = await createContact({
      name: contactInfo.name,
      email: contactInfo.email,
      phone: contactInfo.phone,
      company: contactInfo.company,
      tags: ['ai-outbound-call', 'remodeling-lead'],
    });

    // Book the slot
    const response = await ghlClient.post<{
      id: string;
      confirmationUrl?: string;
    }>(`/calendars/${config.GHL_CALENDAR_ID}/slots/${slotId}/book`, {
      contactId: contact.id,
      source: 'AI Voice Outbound',
    });

    logger.info(
      { appointmentId: response.id, contactId: contact.id },
      'Appointment booked successfully'
    );

    return {
      appointmentId: response.id,
      confirmationUrl: response.confirmationUrl,
    };
  } catch (error) {
    logger.error({ error, slotId }, 'Failed to book appointment');
    throw error;
  }
}

/**
 * Create or update a contact in GHL
 */
export async function createContact(
  contactData: ContactData
): Promise<{ id: string; email: string }> {
  logger.info({ email: contactData.email }, 'Creating contact in GHL');

  try {
    // Check if contact exists by email
    const existingContacts = await ghlClient.get<{ contacts: Array<{ id: string; email: string }> }>(
      `/locations/${config.GHL_LOCATION_ID}/contacts`,
      { email: contactData.email }
    );

    if (existingContacts.contacts && existingContacts.contacts.length > 0) {
      logger.info({ email: contactData.email }, 'Contact already exists');
      return existingContacts.contacts[0];
    }

    // Create new contact
    const response = await ghlClient.post<{ id: string; email: string }>(
      `/locations/${config.GHL_LOCATION_ID}/contacts`,
      {
        email: contactData.email,
        name: contactData.name,
        phone: contactData.phone,
        company: contactData.company,
        tags: contactData.tags || [],
      }
    );

    logger.info({ contactId: response.id }, 'Contact created successfully');
    return response;
  } catch (error) {
    logger.error({ error, email: contactData.email }, 'Failed to create contact');
    throw error;
  }
}

/**
 * Get all calendars for the location
 */
export async function getCalendars(): Promise<
  Array<{ id: string; name: string; timezone: string }>
> {
  logger.info('Fetching calendars');

  try {
    const response = await ghlClient.get<{ calendars: Array<{ id: string; name: string; timezone: string }> }>(
      `/locations/${config.GHL_LOCATION_ID}/calendars`
    );

    return response.calendars || [];
  } catch (error) {
    logger.error({ error }, 'Failed to get calendars');
    throw error;
  }
}

/**
 * Update contact with call outcome
 */
export async function updateContactWithCallOutcome(
  contactId: string,
  outcome: {
    callId: string;
    status: 'completed' | 'no-answer' | 'failed';
    transcript?: string;
    appointmentBooked?: boolean;
    notes?: string;
  }
): Promise<void> {
  logger.info({ contactId, callId: outcome.callId }, 'Updating contact with call outcome');

  try {
    const customFields: Record<string, string> = {
      last_call_date: new Date().toISOString(),
      last_call_status: outcome.status,
      retell_call_id: outcome.callId,
    };

    if (outcome.appointmentBooked) {
      customFields.appointment_status = 'booked';
    }

    await ghlClient.put(`/locations/${config.GHL_LOCATION_ID}/contacts/${contactId}`, {
      custom_fields: customFields,
      notes: outcome.notes
        ? `Call ${outcome.callId}: ${outcome.notes}`
        : undefined,
    });

    logger.info({ contactId }, 'Contact updated with call outcome');
  } catch (error) {
    logger.error({ error, contactId }, 'Failed to update contact');
    // Don't throw - this is non-critical
  }
}
