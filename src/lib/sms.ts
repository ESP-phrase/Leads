import twilio from 'twilio'

export function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const apiKey = process.env.TWILIO_API_KEY
  const apiSecret = process.env.TWILIO_API_SECRET

  if (apiKey && apiSecret && accountSid) {
    return twilio(apiKey, apiSecret, { accountSid })
  }
  // fallback to auth token
  return twilio(accountSid, process.env.TWILIO_AUTH_TOKEN)
}

export async function sendSms(to: string, body: string) {
  const client = getTwilioClient()
  const message = await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER!,
    to,
    body,
  })
  return { sid: message.sid, status: message.status }
}

export async function initiateCall(to: string): Promise<{ sid: string; status: string }> {
  const operatorPhone = process.env.OPERATOR_PHONE_NUMBER
  if (!operatorPhone) throw new Error('OPERATOR_PHONE_NUMBER not set')

  const client = getTwilioClient()
  // Calls operator first. When they pick up, they're connected to the lead.
  const call = await client.calls.create({
    from: process.env.TWILIO_PHONE_NUMBER!,
    to: operatorPhone,
    twiml: `<Response><Say>Connecting you to ${to} now.</Say><Dial>${to}</Dial></Response>`,
  })
  return { sid: call.sid, status: call.status }
}

export function buildPreviewMessage(businessName: string, previewUrl: string) {
  return `Hey — I tried reaching you about ${businessName}. I put together a quick website demo so you can see what an updated online presence could look like.

Preview: ${previewUrl}

Reply STOP to opt out.`
}
