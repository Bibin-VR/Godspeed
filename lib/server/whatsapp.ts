import "server-only"

type WelcomeMessageInput = {
  phone: string
  name?: string | null
  planName: string
}

function toE164(phone: string): string {
  const trimmed = phone.trim()
  const digits = trimmed.replace(/\D/g, "")

  if (!digits) {
    throw new Error("Invalid phone number")
  }

  if (trimmed.startsWith("+")) {
    return `+${digits}`
  }

  const defaultCountryCode = (process.env.WHATSAPP_DEFAULT_COUNTRY_CODE ?? "91").replace(/\D/g, "") || "91"

  if (digits.startsWith(defaultCountryCode)) {
    return `+${digits}`
  }

  return `+${defaultCountryCode}${digits}`
}

export async function sendWhatsAppWelcomeMessage(input: WelcomeMessageInput) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM

  if (!accountSid || !authToken || !from) {
    return { sent: false, reason: "whatsapp_not_configured" as const }
  }

  const to = toE164(input.phone)
  const fromAddress = from.startsWith("whatsapp:") ? from : `whatsapp:${from}`
  const toAddress = `whatsapp:${to}`

  const customerName = input.name?.trim() ? input.name.trim() : "Athlete"
  const message = `Welcome to GodSpeed Fitness, ${customerName}! ✅ Your ${input.planName} membership is active. Reply here anytime for support.`

  const form = new URLSearchParams({
    From: fromAddress,
    To: toAddress,
    Body: message,
  })

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
    cache: "no-store",
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`WhatsApp send failed: ${response.status} ${errorBody}`)
  }

  return { sent: true as const }
}
