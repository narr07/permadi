<script lang="ts" setup>
// Gunakan useScroll dari VueUse
const { y } = useScroll(window)

// Buat ref untuk mengelola state scroll
const isScrollingUp = ref(true)
let lastScrollPosition = 0

// Pantau perubahan posisi scroll
watch(y, (newY) => {
  isScrollingUp.value = newY < lastScrollPosition
  lastScrollPosition = newY
})

const menuItems = [
  { text: 'Home', icon: 'i-ph-house-duotone', path: '/' },
  { text: 'Blog', icon: 'i-ph-notebook-duotone', path: '/blog' },
  { text: 'Gallery', icon: 'i-ph-image-square-duotone', path: '/gallery' },
]
</script>

<template>
  <!-- ========== HEADER ========== -->
  <div>
    <div class="fixed top-2 z-50 w-full transition-transform duration-500" :class="[isScrollingUp ? 'transform-none' : '-translate-y-32']">
      <UContainer>
        <UCard>
          <div class="flex justify-between items-center flex-row">
            <UTooltip text="Home" placement="bottom" :popper="{ arrow: true }">
              <ULink aria-label="logo" to="/">
                <Logo />
              </ULink>
            </UTooltip>
            <div class="flex">
              <ul class="flex md:space-x-2">
                <li v-for="item in menuItems" :key="item.path">
                  <UTooltip :text="item.text" placement="bottom" :popper="{ arrow: true }">
                    <UButton
                      square
                      role="link"
                      :title="item.text"
                      :aria-label="item.text"
                      rel="noopener noreferrer"
                      class="uppercase"
                      :icon="item.icon"
                      color="gray"
                      :variant="$route.path === item.path ? 'solid' : 'ghost'"
                      :to="item.path"
                    >
                      <div class="hidden md:block">
                        {{ item.text }}
                      </div>
                    </UButton>
                  </UTooltip>
                </li>
              </ul>
            </div>
            <div class="flex">
              <DocsSearchButton />
              <DarkMode />
            </div>
          </div>
        </UCard>
      </UContainer>
    </div>
  </div>
  <!-- ========== END HEADER ========== -->
</template>

<style scoped>
.fixed-top {
  top: 0; /* Adjust this value as needed */
  transition: transform 0.2s ease-in-out;
}
</style>
