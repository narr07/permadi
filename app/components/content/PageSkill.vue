<script lang="ts" setup>
interface SkillItem {
  name: string
  url: string
  title: string
}

const skill = await queryCollection('skills')
  .all() as unknown as { meta: { body: SkillItem[] } }[]
</script>

<template>
  <UContainer class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <UCard>
      <div class="grid grid-cols-4 md:grid-cols-6 gap-4">
        <div v-for="(item, index) in skill?.[0]?.meta?.body" :key="index" class="flex justify-center items-center">
          <UButton
            :to="item.url" color="neutral" variant="soft" square
            class="hover:scale-110 justify-center transform transition"
          >
            <UIcon :name="item.name" class="size-10" />
          </UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
