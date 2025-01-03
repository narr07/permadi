<script setup lang="ts">
defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array as () => number[],
    default: () => [],
  },
  meta: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    default: null,
  },
  style: {
    type: [String, Object],
    default: null,
  },
})
const { copy, copied } = useClipboard()
const toast = useToast()
</script>

<template>
  <ProseCode
    :code="code"
    :language="language"
    :filename="filename"
    :highlights="highlights"
    :meta="meta"
  >
    <UCard
      :ui="{
        root: 'bg-permadi-100 dark:bg-permadi-600 ring ring-[var(--ui-border)] divide-y divide-[var(--ui-border)] sm:mt-0 mt-0  rounded-[calc(var(--ui-radius)*2)] shadow-sm',
        header: 'sm:px-2 px-2 py-1  sm:py-1 text-permadi-900  dark:text-permadi-300 m-0',
        body: 'sm:px-0 px-0 bg-permadi-400 dark:bg-permadi-950 py-0 p-0  m-0 sm:my-0 sm:m-0 sm:py-0 sm:p-0 rounded',
        footer: 'p-4 sm:px-6 rounde',
      }"
    >
      <template #header>
        <div class="justify-between   flex items-center">
          <div
            class="font-mono select-all font-bold text-[12px]"
          >
            {{ filename }}
          </div>
          <div class="flex justify-end">
            <UButton
              color="primary"
              variant="ghost"
              aria-label="Theme"
              gap="xs"
              square
            >
              <UIcon
                class="w-4 h-4"
                :name="copied ? 'i-ph-check-square-duotone' : 'i-ph-copy-duotone'"
                dynamic
                @click="copy(code); toast.add({ title: 'Berhasil di Salin', icon: 'i-ph-check-fat-duotone', duration: 1500 })"
              />
            </UButton>
          </div>
        </div>
      </template>
      <pre
        :class="$props.class"
        class="-mt-1 sm:-mt-1 md:-mt-1 lg:-mt-1 ring ring-[var(--ui-border)] bg-permadi-800 dark:bg-permadi-900 rounded-t-none bg-opacity-0"
        :style="style"
      ><slot /></pre>
    </UCard>
  </ProseCode>
</template>
