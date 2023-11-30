<script setup>
  const items = ref();
  defineProps({ blok: Object });
</script>
<template>
  <UContainer v-editable="blok" class="md:pb-20 pb-16">
    <UTabs :items="blok.list" :default-index="0">
      <template #item="{ item }">
        <UCard v-editable="blok">
          <div class="grid md:grid-cols-2 p-2 items-center gap-4 md:gap-8">
            <div class="flex flex-col justify-center pb-4 md:pb-0">
              <h2>
                {{ item.label }}
              </h2>
              <p class="mt-1 md:text-left">
                {{ item.content }}
              </p>
            </div>
          </div>
        </UCard>
      </template>
    </UTabs>
  </UContainer>
</template>
