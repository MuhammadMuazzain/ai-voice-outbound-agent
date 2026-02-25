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
export declare function checkAvailability(options: {
    dateFrom: string;
    dateTo: string;
    calendarId?: string;
}): Promise<CalendarSlot[]>;
/**
 * Book an appointment slot
 */
export declare function bookAppointment(slotId: string, contactInfo: {
    name: string;
    email: string;
    phone: string;
    company?: string;
}): Promise<{
    appointmentId: string;
    confirmationUrl?: string;
}>;
/**
 * Create or update a contact in GHL
 */
export declare function createContact(contactData: ContactData): Promise<{
    id: string;
    email: string;
}>;
/**
 * Get all calendars for the location
 */
export declare function getCalendars(): Promise<Array<{
    id: string;
    name: string;
    timezone: string;
}>>;
/**
 * Update contact with call outcome
 */
export declare function updateContactWithCallOutcome(contactId: string, outcome: {
    callId: string;
    status: 'completed' | 'no-answer' | 'failed';
    transcript?: string;
    appointmentBooked?: boolean;
    notes?: string;
}): Promise<void>;
//# sourceMappingURL=calendar.d.ts.map