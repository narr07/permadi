// server/utils/resend.ts
// Resend REST API helper (auto-imported in server routes)
// Uses $fetch instead of SDK to avoid @react-email/render bundling issue on Cloudflare

const RESEND_API = 'https://api.resend.com'

function getResendHeaders() {
  const config = useRuntimeConfig()
  return {
    'Authorization': `Bearer ${config.resendApiKey}`,
    'Content-Type': 'application/json',
  }
}

export function useResendConfig() {
  const config = useRuntimeConfig()
  return {
    apiKey: config.resendApiKey,
    audienceId: config.resendAudienceId,
  }
}

// Contacts API
export async function resendCreateContact(audienceId: string, email: string, firstName = '', lastName = '') {
  return $fetch<{ id: string }>(`${RESEND_API}/audiences/${audienceId}/contacts`, {
    method: 'POST',
    headers: getResendHeaders(),
    body: { email, first_name: firstName, last_name: lastName, unsubscribed: false },
  })
}

export async function resendListContacts(audienceId: string) {
  return $fetch<{ data: Array<{ id: string, email: string, unsubscribed: boolean }> }>(
    `${RESEND_API}/audiences/${audienceId}/contacts`,
    { headers: getResendHeaders() },
  )
}

export async function resendUpdateContact(audienceId: string, contactId: string, data: { unsubscribed?: boolean }) {
  return $fetch(`${RESEND_API}/audiences/${audienceId}/contacts/${contactId}`, {
    method: 'PATCH',
    headers: getResendHeaders(),
    body: data,
  })
}

// Emails API
export async function resendSendEmail(options: {
  from: string
  to: string | string[]
  subject: string
  html: string
  tags?: Array<{ name: string, value: string }>
}) {
  return $fetch<{ id: string }>(`${RESEND_API}/emails`, {
    method: 'POST',
    headers: getResendHeaders(),
    body: options,
  })
}
