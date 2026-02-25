# AI Voice Outbound Automation for Home Remodeling Businesses

An automated outbound calling system using Retell AI that connects with GoHighLevel (GHL) calendar for scheduling appointments with home remodeling businesses.

## Delivery

**This can be fully set up and delivered within 24 hours.**

## One-Time Setup

This is a permanent, self-running automation with no ongoing dependencies. Once deployed, it runs forever with no subscription or maintenance fees from me. You own everything — the code, the agent, and the integration.

## The Pitch Script

The AI uses a natural, conversational approach that gets to the point fast (under 30 seconds):

```
"Hi, this is [AI Name] calling. I know you're probably busy, so I'll be quick.
I'm reaching out to select remodeling companies in your area about a lead
generation opportunity. Do you have about 30 seconds?"

"We work with homeowners looking for remodeling projects - things like kitchen
renovations, bathroom remodels, additions. We pre-qualify these leads and
connect them with trusted contractors. I'd like to schedule a quick 15-minute
call to see if this might be a good fit for your business."
```

It handles objections gracefully (busy, not interested, pricing questions, send info) and always tries to book the calendar appointment.

## Features

- Natural-sounding AI voice calls using Retell AI
- Automated outbound calling to home remodeling businesses
- GHL Calendar integration for real-time scheduling
- Quick, professional pitch delivery
- Call outcome tracking and logging

## Prerequisites

1. **Retell AI Account** - Sign up at https://retell.ai
2. **GoHighLevel Account** - With calendar access
3. **Node.js 18+** - Runtime environment
4. **ngrok** - For webhook testing (optional, for local development)

## Project Structure

```
ai-voice-outbound/
├── src/
│   ├── index.ts              # Main entry point
│   ├── retell/
│   │   ├── client.ts         # Retell AI client setup
│   │   ├── call-handler.ts   # Call initiation and management
│   │   └── webhook.ts        # Webhook handler for call events
│   ├── ghl/
│   │   ├── client.ts         # GHL API client
│   │   └── calendar.ts       # Calendar integration
│   ├── prompts/
│   │   └── system-prompt.ts  # AI conversation prompt
│   └── utils/
│       ├── logger.ts         # Logging utility
│       └── config.ts         # Configuration management
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required credentials:
- `RETELL_API_KEY` - Your Retell AI API key
- `RETELL_AGENT_ID` - Your Retell agent ID (created after setup)
- `GHL_API_KEY` - Your GoHighLevel API key
- `GHL_LOCATION_ID` - Your GHL location ID
- `GHL_CALENDAR_ID` - Your GHL calendar ID
- `WEBHOOK_URL` - Your webhook URL for call events

### 3. Create Your Retell AI Agent

1. Go to https://app.retell.ai
2. Navigate to "Agents" and create a new agent
3. Use the prompt from `src/prompts/system-prompt.ts`
4. Configure voice settings (recommended: "Anna" or "Domi" for natural sound)
5. Copy your Agent ID to `.env`

### 4. Set Up Webhook Endpoint

For production:
- Deploy to your preferred hosting (Vercel, Railway, etc.)
- Update the webhook URL in Retell AI dashboard

For local testing:
```bash
ngrok http 3000
```

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## Usage

### Making an Outbound Call

```typescript
import { makeOutboundCall } from './src/retell/call-handler';

await makeOutboundCall({
  phoneNumber: '+1234567890',
  businessName: 'ABC Remodeling',
  contactName: 'John Smith',
  purpose: 'partnership_discussion'
});
```

### Checking Calendar Availability

```typescript
import { checkAvailability } from './src/ghl/calendar';

const slots = await checkAvailability({
  dateFrom: '2024-01-15',
  dateTo: '2024-01-20'
});
```

## Customization

### Modifying the Call Script

Edit `src/prompts/system-prompt.ts` to customize the conversation flow.

### Adjusting Voice Settings

Modify voice configuration in `src/retell/client.ts`.

## Troubleshooting

- **Calls not connecting**: Verify Retell API key and agent ID
- **Calendar not syncing**: Check GHL API key and location/calendar IDs
- **Webhook not receiving events**: Ensure webhook URL is publicly accessible

## No Ongoing Costs or Dependencies

This automation runs independently forever. You only pay for:
- Retell AI usage (per-minute call costs)
- GoHighLevel subscription (you likely already have this)
- Hosting (free on Vercel/Railway Render)

No subscription to me, no maintenance fees, no lock-in. The code is yours.

## Support

For issues or questions, please refer to:
- [Retell AI Documentation](https://docs.retell.ai)
- [GoHighLevel API Docs](https://highlevel.stoplight.io/docs/integrations)

## Ownership

This is a one-time setup with no ongoing fees or dependencies. Once deployed:
- You own the Retell AI agent
- You own the code
- No subscription required from me
- Runs autonomously 24/7
