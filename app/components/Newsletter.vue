<script setup lang="ts">
const { t } = useI18n()
const toast = useToast()

const email = ref('')
const isSubmitting = ref(false)
const isSubscribed = ref(false)

async function handleSubscribe() {
  if (!email.value)
    return

  const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-z]{2,}$/i
  if (!emailRegex.test(email.value)) {
    toast.add({
      title: t('toast.error_title'),
      description: t('newsletter.invalid_email'),
      color: 'error',
    })
    return
  }

  isSubmitting.value = true

  try {
    const result = await $fetch('/api/subscribe', {
      method: 'POST',
      body: { email: email.value },
    })

    if ('message' in result && result.message === 'already_subscribed') {
      toast.add({
        title: 'Newsletter',
        description: t('newsletter.already_subscribed'),
        color: 'warning',
      })
    }
    else {
      isSubscribed.value = true
      toast.add({
        title: 'Newsletter',
        description: t('newsletter.success'),
        color: 'success',
      })
    }
    email.value = ''
  }
  catch {
    toast.add({
      title: t('toast.error_title'),
      description: t('newsletter.error'),
      color: 'error',
    })
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UBanner
    v-if="!isSubscribed"
    id="newsletter-subscribe"
    icon="i-lucide-mail"
    :title="t('newsletter.description')"
    color="neutral"
    close
  >
    <template #actions>
      <form class="flex items-center gap-2" @submit.prevent="handleSubscribe">
        <UInput
          v-model="email"
          type="email"
          :placeholder="t('newsletter.email_placeholder')"
          :disabled="isSubmitting"
          size="xs"
          class="w-48"
          :ui="{ root: 'ring-0' }"
        />
        <UButton
          type="submit"
          :loading="isSubmitting"
          :disabled="!email || isSubmitting"
          size="xs"
          color="primary"
        >
          {{ t('newsletter.subscribe') }}
        </UButton>
      </form>
    </template>
  </UBanner>
</template>
