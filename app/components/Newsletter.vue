<script setup lang="ts">
const { t } = useI18n()
const toast = useToast()

const email = ref('')
const isSubmitting = ref(false)
const isSubscribed = ref(false)
const isModalOpen = ref(false)

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
    isModalOpen.value = false
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
    icon="i-narr-soc-mail"
    :title="t('newsletter.description')"
    color="info"
    close
    :ui="{ root: 'rounded-lg' }"
  >
    <template #actions>
      <UButton
        size="xs"
        color="primary"
        @click="isModalOpen = true"
      >
        {{ t('newsletter.subscribe') }}
      </UButton>
    </template>
  </UBanner>

  <UModal v-model:open="isModalOpen" :close="true" title="Newsletter" :description="t('newsletter.description')">
    <template #body>
      <form class="flex flex-col gap-4" @submit.prevent="handleSubscribe">
        <UInput
          v-model="email"
          type="email"
          icon="i-narr-soc-mail"
          :placeholder="t('newsletter.email_placeholder')"
          :disabled="isSubmitting"
          size="lg"
        />
        <UButton
          type="submit"
          :loading="isSubmitting"
          :disabled="!email || isSubmitting"
          block
        >
          {{ t('newsletter.subscribe') }}
        </UButton>
      </form>
    </template>
  </UModal>
</template>
