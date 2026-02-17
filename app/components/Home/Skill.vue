<script setup lang="ts">
interface SkillItem {
  icon: string
  title: string
  link: string
}

const props = withDefaults(defineProps<{
  frontend?: SkillItem[]
  backend?: SkillItem[]
  tools?: SkillItem[]
}>(), {
  frontend: () => [
    { icon: 'i-simple-icons-vuedotjs', title: 'Vue.js', link: 'https://vuejs.org' },
    { icon: 'i-simple-icons-nuxtdotjs', title: 'Nuxt.js', link: 'https://nuxt.com' },
    { icon: 'i-simple-icons-tailwindcss', title: 'Tailwind CSS', link: 'https://tailwindcss.com' },
    { icon: 'i-simple-icons-typescript', title: 'TypeScript', link: 'https://www.typescriptlang.org' },
    { icon: 'i-simple-icons-javascript', title: 'JavaScript', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  ],
  backend: () => [
    { icon: 'i-simple-icons-nodedotjs', title: 'Node.js', link: 'https://nodejs.org' },
    { icon: 'i-simple-icons-hono', title: 'Hono', link: 'https://hono.dev' },
    { icon: 'i-simple-icons-sqlite', title: 'SQLite', link: 'https://www.sqlite.org' },
    { icon: 'i-simple-icons-postgresql', title: 'PostgreSQL', link: 'https://www.postgresql.org' },
    { icon: 'i-simple-icons-drizzle', title: 'Drizzle ORM', link: 'https://orm.drizzle.team' },
  ],
  tools: () => [
    { icon: 'i-simple-icons-visualstudiocode', title: 'VS Code', link: 'https://code.visualstudio.com' },
    { icon: 'i-simple-icons-figma', title: 'Figma', link: 'https://www.figma.com' },
    { icon: 'i-simple-icons-git', title: 'Git', link: 'https://git-scm.com' },
    { icon: 'i-simple-icons-github', title: 'GitHub', link: 'https://github.com' },
    { icon: 'i-simple-icons-pnpm', title: 'PNPM', link: 'https://pnpm.io' },
  ],
})

const categories = [
  {
    title: 'Frontend',
    icon: 'i-heroicons-computer-desktop',
    description: 'Modern web technologies I use to build beautiful interfaces.',
    skills: props.frontend,
  },
  {
    title: 'Backend',
    icon: 'i-heroicons-server-stack',
    description: 'Robust server-side solutions and database management.',
    skills: props.backend,
  },
  {
    title: 'Tools',
    icon: 'i-heroicons-wrench-screwdriver',
    description: 'Essential tools and software for efficient development.',
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
    >
      <div class="flex flex-wrap gap-3 mt-6">
        <div
          v-for="skill in category.skills"
          :key="skill.title"
        >
          <UTooltip :text="skill.title">
            <UButton
              :icon="skill.icon" size="xl" variant="ghost" :to="skill.link"
            />
          </UTooltip>
        </div>
      </div>
    </UPageCard>
  </div>
</template>
