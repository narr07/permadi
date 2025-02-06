<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator color="#f9bc60" />

    <NavBar />
    <UApp>
      <div class="pt-16">
        <NuxtPage />
      </div>
    </UApp>
  </div>
</template>
