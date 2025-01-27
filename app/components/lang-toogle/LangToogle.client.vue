<!-- eslint-disable no-console -->
<!-- app/components/lang-toggle/LangToggle.client.vue -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, locales, setLocale } = useI18n()

interface ILanguage {
  value: 'id' | 'en'
  code: string
  icon: string
  id: string
}

// Buat daftar bahasa dengan ikon terkait
const languages: globalThis.ComputedRef<ILanguage[]> = computed(() =>
  locales.value.map(locale => ({
    ...locale,
    icon:
      locale.value === 'en'
        ? 'openmoji:flag-england'
        : 'openmoji:flag-indonesia',
    id: locale.code,
  })),
)

// Tentukan bahasa yang dipilih berdasarkan locale saat ini
const selected = ref<ILanguage>(
  languages.value.find(language => language.value === locale.value) as ILanguage
  || languages.value[0],
)

// Cegah pemanggilan `setLocale` yang tidak perlu saat komponen di-mount
onMounted(() => {
  if (locale.value !== selected.value.value) {
    setLocale(selected.value.value)
  }
})

// Pantau perubahan pada `selected` dan ubah locale jika diperlukan
watch(selected, (newLanguage) => {
  if (locale.value !== newLanguage.value) {
    setLocale(newLanguage.value)
  }
})

// Fungsi untuk mengganti bahasa
function toggleLocale() {
  const newLocale = selected.value.value === 'en' ? 'id' : 'en'
  const newLanguage = languages.value.find(language => language.value === newLocale)
  if (newLanguage) {
    selected.value = newLanguage
  }
}
</script>

<template>
  <div>
    <!-- Tooltip untuk tombol -->
    <UTooltip :text="selected.value === 'en' ? 'Switch to Indonesian' : 'Ubah ke Inggris'" placement="bottom">
      <div
        v-motion
        :initial="{ scale: 1 }"
        :hovered="{ scale: 1.1 }"
        :tapped="{ scale: 0.9 }"
      >
        <!-- Tombol untuk mengganti bahasa -->
        <UButton
          rel="alternate"
          square
          @click="toggleLocale"
        >
          <UIcon class="size-6" :name="selected.icon" />
          <span class="sr-only">Lang</span>
        </UButton>
      </div>
    </UTooltip>
  </div>
</template>
