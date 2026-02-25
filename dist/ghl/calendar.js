"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAvailability = checkAvailability;
exports.bookAppointment = bookAppointment;
exports.createContact = createContact;
exports.getCalendars = getCalendars;
exports.updateContactWithCallOutcome = updateContactWithCallOutcome;
const client_js_1 = require("./client.js");
const config_js_1 = require("../utils/config.js");
const logger_js_1 = require("../utils/logger.js");
/**
 * Get available calendar slots
 */
async function checkAvailability(options) {
    logger_js_1.logger.info({ dateFrom: options.dateFrom, dateTo: options.dateTo }, 'Checking calendar availability');
    try {
        const calendarId = options.calendarId || config_js_1.config.GHL_CALENDAR_ID;
        // GHL calendar availability endpoint
        const response = await client_js_1.ghlClient.get(`/calendars/${calendarId}/availability`, {
            startDate: options.dateFrom,
            endDate: options.dateTo,
        });
        return (response.slots || []).map((slot) => ({
            slotId: slot.id,
            startTime: slot.start,
            endTime: slot.end,
            available: !slot.bookingUrl,
        }));
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to check calendar availability');
        throw error;
    }
}
/**
 * Book an appointment slot
 */
async function bookAppointment(slotId, contactInfo) {
    logger_js_1.logger.info({ slotId, contactName: contactInfo.name }, 'Booking appointment');
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
        const response = await client_js_1.ghlClient.post(`/calendars/${config_js_1.config.GHL_CALENDAR_ID}/slots/${slotId}/book`, {
            contactId: contact.id,
            source: 'AI Voice Outbound',
        });
        logger_js_1.logger.info({ appointmentId: response.id, contactId: contact.id }, 'Appointment booked successfully');
        return {
            appointmentId: response.id,
            confirmationUrl: response.confirmationUrl,
        };
    }
    catch (error) {
        logger_js_1.logger.error({ error, slotId }, 'Failed to book appointment');
        throw error;
    }
}
/**
 * Create or update a contact in GHL
 */
async function createContact(contactData) {
    logger_js_1.logger.info({ email: contactData.email }, 'Creating contact in GHL');
    try {
        // Check if contact exists by email
        const existingContacts = await client_js_1.ghlClient.get(`/locations/${config_js_1.config.GHL_LOCATION_ID}/contacts`, { email: contactData.email });
        if (existingContacts.contacts && existingContacts.contacts.length > 0) {
            logger_js_1.logger.info({ email: contactData.email }, 'Contact already exists');
            return existingContacts.contacts[0];
        }
        // Create new contact
        const response = await client_js_1.ghlClient.post(`/locations/${config_js_1.config.GHL_LOCATION_ID}/contacts`, {
            email: contactData.email,
            name: contactData.name,
            phone: contactData.phone,
            company: contactData.company,
            tags: contactData.tags || [],
        });
        logger_js_1.logger.info({ contactId: response.id }, 'Contact created successfully');
        return response;
    }
    catch (error) {
        logger_js_1.logger.error({ error, email: contactData.email }, 'Failed to create contact');
        throw error;
    }
}
/**
 * Get all calendars for the location
 */
async function getCalendars() {
    logger_js_1.logger.info('Fetching calendars');
    try {
        const response = await client_js_1.ghlClient.get(`/locations/${config_js_1.config.GHL_LOCATION_ID}/calendars`);
        return response.calendars || [];
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to get calendars');
        throw error;
    }
}
/**
 * Update contact with call outcome
 */
async function updateContactWithCallOutcome(contactId, outcome) {
    logger_js_1.logger.info({ contactId, callId: outcome.callId }, 'Updating contact with call outcome');
    try {
        const customFields = {
            last_call_date: new Date().toISOString(),
            last_call_status: outcome.status,
            retell_call_id: outcome.callId,
        };
        if (outcome.appointmentBooked) {
            customFields.appointment_status = 'booked';
        }
        await client_js_1.ghlClient.put(`/locations/${config_js_1.config.GHL_LOCATION_ID}/contacts/${contactId}`, {
            custom_fields: customFields,
            notes: outcome.notes
                ? `Call ${outcome.callId}: ${outcome.notes}`
                : undefined,
        });
        logger_js_1.logger.info({ contactId }, 'Contact updated with call outcome');
    }
    catch (error) {
        logger_js_1.logger.error({ error, contactId }, 'Failed to update contact');
        // Don't throw - this is non-critical
    }
}
//# sourceMappingURL=calendar.js.map