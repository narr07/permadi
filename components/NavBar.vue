<script setup>
  const colorMode = useColorMode();
  const isDark = computed({
    get() {
      return colorMode.value === "dark";
    },
    set() {
      colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
    },
  });
</script>
<template>
  <section>
    <UContainer class="fixed top-2 z-50 w-full ">
      <div class="flex flex-row items-center justify-between bg-permadi-100 dark:bg-permadi-800 rounded p-2 ring-1 ring-permadi-800 drop-shadow-1">
        <Logo />
        <div class="flex items-center">
          <NuxtLink  to="/" >Home</NuxtLink>
          <NuxtLink  to="/blog" >Blog</NuxtLink>
          <DarkMode />
        </div>
      </div>
    </UContainer>
  </section>
</template>
