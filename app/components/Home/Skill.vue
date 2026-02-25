<script setup lang="ts">

const props = withDefaults(defineProps<{
  frontend?: SkillItem[]
  backend?: SkillItem[]
  tools?: SkillItem[]
}>(), {
  frontend: () => [
    { icon: 'i-narr-f-nuxt', title: 'Nuxt.js', link: 'https://nuxt.com' },
    { icon: 'i-narr-f-vue', title: 'Vue.js', link: 'https://vuejs.org' },
    { icon: 'i-narr-f-tailwind', title: 'Tailwind CSS', link: 'https://tailwindcss.com' },
    { icon: 'i-narr-f-next', title: 'Next.js', link: 'https://nextjs.org' },
    { icon: 'i-narr-f-svg', title: 'SVG', link: 'https://developer.mozilla.org/en-US/docs/Web/SVG' },
    { icon: 'i-narr-f-astro', title: 'Astro', link: 'https://astro.build' },
    { icon: 'i-narr-f-flutter', title: 'Flutter', link: 'https://flutter.dev' },
  ],
  backend: () => [
    { icon: 'i-narr-b-bun', title: 'Bun', link: 'https://bun.sh' },
    { icon: 'i-narr-b-dart', title: 'Dart', link: 'https://dart.dev' },
    { icon: 'i-narr-b-django', title: 'Django', link: 'https://www.djangoproject.com' },
    { icon: 'i-narr-b-laravel', title: 'Laravel', link: 'https://laravel.com' },
    { icon: 'i-narr-b-node', title: 'Node.js', link: 'https://nodejs.org' },
    { icon: 'i-narr-b-python', title: 'Python', link: 'https://python.org' },
    { icon: 'i-narr-b-supabase', title: 'Supabase', link: 'https://supabase.com' },

  ],
  tools: () => [
    { icon: 'i-narr-d-illustrator', title: 'Adobe Illustrator', link: 'https://www.adobe.com/products/illustrator.html' },
    { icon: 'i-narr-d-photoshop', title: 'Adobe Photoshop', link: 'https://www.adobe.com/products/photoshop.html' },
    { icon: 'i-narr-d-figma', title: 'Figma', link: 'https://www.figma.com' },
    { icon: 'i-narr-d-premiere', title: 'Adobe Premiere', link: 'https://www.adobe.com/products/premiere.html' },
    { icon: 'i-narr-d-aftereffect', title: 'Adobe After Effects', link: 'https://www.adobe.com/products/aftereffects.html' },
    { icon: 'i-narr-d-xd', title: 'Adobe XD', link: 'https://www.adobe.com/products/xd.html' },
    { icon: 'i-narr-d-affinity', title: 'Affinity Designer', link: 'https://affinity.serif.com/designer' },
  ],
})

const { t } = useI18n()

interface SkillItem {
  icon: string
  title: string
  link: string
}

const categories = [
  {
    title: 'Frontend',
    icon: 'i-narr-pc',
    description: t('skill.frontend'),
    skills: props.frontend,
  },
  {
    title: 'Backend',
    icon: 'i-narr-database',
    description: t('skill.backend'),
    skills: props.backend,
  },
  {
    title: 'Tools',
    icon: 'i-narr-tools',
    description: t('skill.tools'),
    skills: props.tools,
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <UPageCard
      v-for="category in categories"
      :key="category.title"
      variant="outline"
      :title="category.title"
      :description="category.description"
      :icon="category.icon"
      spotlight
      spotlight-color="primary"
      class="h-full"
    >
      <div class="flex flex-wrap justify-evenly gap-2 mt-4">
        <div
          v-for="skill in category.skills"
          :key="skill.title"
        >
          <UTooltip :text="skill.title">
            <NuxtLink
              :to="skill.link"
              target="_blank"
            >
              <UIcon :name="skill.icon" class="size-10" />
              <span class="sr-only">{{ skill.title }}</span>
            </NuxtLink>
          </UTooltip>
        </div>
      </div>
    </UPageCard>
  </div>
</template>
