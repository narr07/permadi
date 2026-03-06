// server/utils/resend.ts
// Resend configuration helper (auto-imported in server routes)

import { Resend } from 'resend'

let _resend: Resend | null = null

export function useResend() {
  if (!_resend) {
    const config = useRuntimeConfig()
    _resend = new Resend(config.resendApiKey)
  }
  return _resend
}

export function useResendConfig() {
  const config = useRuntimeConfig()
  return {
    audienceId: config.resendAudienceId,
  }
}
