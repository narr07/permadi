<script setup>
const props = defineProps({ blok: Object })
const toast = useToast()
const { copy, copied } = useClipboard()
</script>

<template>
  <UCard
    class="text-sm"
    :ui="{
      blok: {
        padding: 'py-1 p-1 sm:p-1 sm:px-2 -mb-6 sm:-mb-5 sm:py-1 ',
      },
      header: {
        padding: 'py-0 p-1 sm:p-1 sm:py-0',
      },
      footer: {
        padding: 'px-1 py-0 ',
      },
    }"
  >
    <template #header>
      <div class="w-full text-sm -mb-6 flex p-1 items-center justify-between">
        <span>{{ blok.title }}</span>
        <div class="flex w-full justify-end">
          <UButton
            size="xs"
            :icon="copied ? 'i-ph-check-square-duotone' : 'i-ph-copy-duotone'"
            color="gray"
            variant="ghost"
            aria-label="Theme"
            @click="
              copy(blok.code);
              toast.add({
                title: 'Code berhasil di copy',
                timeout: 1500,
                icon: 'i-ph-check-circle-duotone',
              });
            "
          />
          <template />
          {{ blok.code }}
          <!-- Gunakan props.code -->
        </div>
      </div>
    </template>
    <template #body>
      <code>{{ blok.code }}</code>
    </template>
  </UCard>
</template>
