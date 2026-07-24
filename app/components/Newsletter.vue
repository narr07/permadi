<!-- eslint-disable unused-imports/no-unused-vars -->
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
  catch (e) {
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
  <div v-if="!isSubscribed" class="w-full py-4">
    <form @submit.prevent="handleSubscribe">
      <UFormField
        name="email"
        :label="t('newsletter.title') || 'Subscribe to our newsletter'"
        size="lg"
        :description="t('newsletter.description') || 'Stay updated on new releases and features, guides, and community updates.'"
        :ui="{ label: 'font-semibold', container: 'mt-3' }"
      >
        <UInput
          v-model="email"
          type="email"
          :placeholder="t('newsletter.email_placeholder') || 'you@domain.com'"
          required
          autocomplete="off"
          class="max-w-sm w-full"
          :disabled="isSubmitting"
        >
          <template #trailing>
            <UButton
              type="submit"
              size="xs"
              color="neutral"
              :label="isSubmitting ? t('newsletter.subscribing') || 'Subscribing' : t('newsletter.subscribe') || 'Subscribe'"
              :loading="isSubmitting"
              :disabled="!email || isSubmitting"
            />
          </template>
        </UInput>
      </UFormField>
    </form>
  </div>
</template>
