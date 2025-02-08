<script setup lang="ts">
const items = [
  {
    label: 'Education',
    icon: 'i-ph-graduation-cap-duotone',
    content: 'Saya sekolah di UPI',
    list: [{
      label: 'Sekolah Dasar',
      icon: 'i-lucide-school',
      content: 'Saya sekolah di SDN 1 Cimahi',
    }, {
      label: 'Sekolah Menengah Pertama',
      icon: 'i-lucide-school',
      content: 'Saya sekolah',
    }],
  },
  {
    label: 'Social media',
    icon: 'i-lucide-lock',
    content: 'Saya sekolah di UPI',
    list: [{
      label: 'Instagram',
      icon: 'i-lucide-instagram',
      content: 'Saya sekolah di SDN 1 Cimahi',
    }, {
      label: 'Facebook',
      icon: 'i-lucide-facebook',
      content: 'Saya sekolah',
    }, {
      label: 'Twitter',
      icon: 'i-lucide-twitter',
      content: 'Saya sekolah',
    }],
  },
]
</script>

<template>
  <UTabs :items="items" class="w-full" color="neutral">
    <template #content="{ item }">
      <p>{{ item.content }} {{ item.label }} </p>
      <ul v-if="item.list">
        <li v-for="(subItem, index) in item.list" :key="index">
          <i :class="subItem.icon" /> {{ subItem.label }}: {{ subItem.content }}
        </li>
      </ul>
    </template>
  </UTabs>
</template>
