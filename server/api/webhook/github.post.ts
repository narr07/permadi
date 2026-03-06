// server/api/webhook/github.post.ts
// GitHub webhook handler — detects new blog posts and triggers newsletter
// Configure in GitHub: Settings → Webhooks → Add webhook
// Payload URL: https://permadi.dev/api/webhook/github
// Content type: application/json
// Secret: your NUXT_GITHUB_WEBHOOK_SECRET
// Events: Just the push event

import { Buffer } from 'node:buffer'
import { createHmac, timingSafeEqual } from 'node:crypto'

function verifyGitHubSignature(payload: string, signature: string | undefined, secret: string): boolean {
  if (!signature)
    return false
  const hmac = createHmac('sha256', secret)
  hmac.update(payload)
  const digest = `sha256=${hmac.digest('hex')}`
  try {
    return timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
  }
  catch {
    return false
  }
}

// Extract blog metadata from raw markdown content
function extractFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  const matchContent = match?.[1]
  if (!matchContent)
    return {}

  const frontmatter: Record<string, string> = {}
  const lines = matchContent.split('\n')

  for (const line of lines) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1)
      continue
    const key = line.slice(0, colonIdx).trim()
    let value = line.slice(colonIdx + 1).trim()
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
      value = value.slice(1, -1)
    }
    frontmatter[key] = value
  }

  return frontmatter
}

// Generate slug from filename (e.g., "6.tutorial-sdnteja1-part-1.md" → "tutorial-sdnteja1-part-1")
function filenameToSlug(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .replace(/^\d+\./, '')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Read raw body for signature verification
  const rawBody = await readRawBody(event, 'utf8')
  if (!rawBody) {
    throw createError({ statusCode: 400, message: 'Empty body' })
  }

  // Verify GitHub webhook signature
  const signature = getRequestHeader(event, 'x-hub-signature-256')
  if (!verifyGitHubSignature(rawBody, signature, config.githubWebhookSecret)) {
    throw createError({ statusCode: 401, message: 'Invalid signature' })
  }

  const payload = JSON.parse(rawBody)

  // Only process push events to master branch
  if (payload.ref !== 'refs/heads/master') {
    return { ok: true, skipped: true, reason: 'Not master branch' }
  }

  // Find new blog files in the commits (only Indonesian blog as source of truth)
  const newBlogFiles: string[] = []

  for (const commit of payload.commits || []) {
    for (const added of commit.added || []) {
      // Match new blog files in Indonesian content (source of truth)
      if (added.startsWith('content/id/blog/') && added.endsWith('.md')) {
        newBlogFiles.push(added)
      }
    }
  }

  if (newBlogFiles.length === 0) {
    return { ok: true, skipped: true, reason: 'No new blog posts' }
  }

  // Fetch blog content from GitHub to extract metadata
  const repo = payload.repository?.full_name // e.g., "narr07/permadi"
  const results = []

  for (const filePath of newBlogFiles) {
    try {
      // Fetch raw file content from GitHub
      const fileUrl = `https://raw.githubusercontent.com/${repo}/${payload.after}/${filePath}`
      const content = await $fetch<string>(fileUrl, { responseType: 'text' })

      const frontmatter = extractFrontmatter(content)
      const filename = filePath.split('/').pop() || ''
      const slug = filenameToSlug(filename)

      if (!frontmatter.title) {
        results.push({ file: filePath, skipped: true, reason: 'No title in frontmatter' })
        continue
      }

      // Send newsletter to subscribers
      const { audienceId } = useResendConfig()

      if (!audienceId) {
        results.push({ file: filePath, skipped: true, reason: 'No audience configured' })
        continue
      }

      // Get subscribers
      const contacts = await resendListContacts(audienceId)

      const subscribedEmails = contacts?.data
        ?.filter(c => !c.unsubscribed)
        ?.map(c => c.email)
        || []

      if (subscribedEmails.length === 0) {
        results.push({ file: filePath, skipped: true, reason: 'No subscribers' })
        continue
      }

      const blogUrl = `https://permadi.dev/blog/${slug}`

      const htmlContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #134e43; margin: 0;">Permadi</h2>
            <p style="color: #6b7280; font-size: 14px;">Blog baru telah dipublikasikan!</p>
          </div>

          <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h1 style="font-size: 22px; color: #111827; margin: 0 0 12px 0;">${frontmatter.title}</h1>
            <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">${frontmatter.description || ''}</p>
            <a href="${blogUrl}" style="display: inline-block; background: #134e43; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Baca Selengkapnya &rarr;</a>
          </div>

          <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px;">
              Kamu menerima email ini karena berlangganan newsletter Permadi.<br>
              <a href="https://permadi.dev" style="color: #9ca3af;">permadi.dev</a>
            </p>
          </div>
        </div>
      `

      // Send in batches of 50
      const batchSize = 50
      let sent = 0

      for (let i = 0; i < subscribedEmails.length; i += batchSize) {
        const batch = subscribedEmails.slice(i, i + batchSize)
        try {
          await resendSendEmail({
            from: 'Dinar Permadi <narr@permadi.dev>',
            to: batch,
            subject: `📝 Blog Baru: ${frontmatter.title}`,
            html: htmlContent,
            tags: [
              { name: 'category', value: 'newsletter' },
              { name: 'slug', value: slug },
            ],
          })
          sent += batch.length
        }
        catch {
          // continue with next batch
        }
      }

      results.push({ file: filePath, title: frontmatter.title, slug, sent })
    }
    catch (err: any) {
      results.push({ file: filePath, error: err.message })
    }
  }

  return { ok: true, results }
})
