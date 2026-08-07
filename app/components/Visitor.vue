<script setup lang="ts">
const { t } = useI18n()
const visitors = ref(0)
const { open } = useWebSocket('/ws/visitors', {
  immediate: false,
  autoReconnect: false,
  onError() {
    // Silent catch to prevent uncaught WebSocket connection errors in browser console
  },
  async onMessage(ws, event) {
    // We parse the number of connected users from the message
    // The message might be a string or a Blob
    visitors.value = Number.parseInt(typeof event.data === 'string' ? event.data : await event.data.text(), 10) || 0
  },
})

// We open the connection when the component is mounted
onMounted(() => {
  try {
    open()
  }
  catch {
    // Ignore WebSocket initiation failure
  }
})
</script>

<template>
  <div>
    <UTooltip :text="t('visitors.online')">
      <UButton color="neutral" variant="ghost" icon="i-narr-caution">
        <h1>{{ visitors }}</h1>
      </UButton>
    </UTooltip>
  </div>
</template>
