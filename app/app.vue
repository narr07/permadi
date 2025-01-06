<template>
  <div>
    <UApp>
      <NuxtRouteAnnouncer />
      <NavBar />
      <div class="py-[70px]">
        <NuxtPage />
      </div>
      <Footer />
    </UApp>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(20px);
  filter: blur(1rem);
}
</style>
