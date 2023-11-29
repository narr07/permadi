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
  <UContainer>
    <Logo />
    <DarkMode />
  </UContainer>
</template>
