<script setup lang="ts">
const { setLocale, locales, locale } = useI18n()

const items = locales.value.map(_locale => ({
  label: _locale.code,
  id: _locale.code,
  icon: _locale.code === 'en' ? 'openmoji:flag-england' : 'openmoji:flag-indonesia',
}))

const value = ref(locale.value)

watch(value, (newLocale) => {
  setLocale(newLocale)
})

const icon = computed(() => items.find(item => item.id === value.value)?.icon)
</script>

<template>
  <USelect
    v-model="value" :ui="{
      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
    }" :icon="icon" class="ring rounded ring-permadi-900 dark:ring-permadi-800" value-key="id" size="md" :items="items"
  />
</template>
