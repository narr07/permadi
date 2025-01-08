<!-- eslint-disable no-console -->
<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

interface ILanguage {
  value: 'id' | 'en'
  code: string
  icon: string
  id: string
}

const languages: globalThis.ComputedRef<ILanguage[]> = computed(() =>
  locales.value.map((locale) => {
    return {
      ...locale,
      icon:
        locale.value === 'en'
          ? 'openmoji:flag-england'
          : 'openmoji:flag-indonesia',
      id: locale.code,
    }
  }),
)

const selected = ref<ILanguage>(
  languages.value.find(language => language.value === locale.value) as ILanguage
  || languages.value[0],
)

onMounted(() => {
  setLocale(selected.value.value)
})

watch(selected, (newLanguage) => {
  setLocale(newLanguage.value)
})

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
    <UTooltip :text="selected.value === 'en' ? 'Switch to Indonesian' : 'Ubah ke Inggris'" placement="bottom">
      <div
        v-motion
        :initial="{
          scale: 1,
        }"
        :hovered="{
          scale: 1,
        }"
        :tapped="{
          scale: 0.8,
        }"
      >
        <UButton

          color="secondary"
          variant="outline"

          square
          @click="toggleLocale"
        >
          <UIcon class="size-6" :name="selected.icon" />
        </UButton>
      </div>
    </UTooltip>
  </div>
</template>
