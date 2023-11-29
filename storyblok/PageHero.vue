<script setup>
const props = defineProps({ blok: Object })
  // Fungsi untuk mengubah tanda ":" menjadi "-"
  const replaceColonWithDash = (originalString) => {
    return originalString.replace(/:/g, "-");
  };
  // Fungsi untuk mengonversi format ikon
  const convertIconFormat = (originalIcon) => {
    // Pastikan format ikon sesuai kebutuhan Anda
    // Contoh: ph:download-duotone menjadi download-duotone
    const cleanedIcon = originalIcon.startsWith("ph:")
      ? originalIcon.slice(3)
      : originalIcon;
    // Menggunakan fungsi replaceColonWithDash untuk mengubah ":" menjadi "-"
    return replaceColonWithDash(cleanedIcon);
  };
  // Menggunakan computed untuk mendapatkan URL ikon
  const iconUrl = computed(() => {
    // Mengonversi format ikon menggunakan fungsi convertIconFormat
    const convertedIcon = convertIconFormat(props.blok.cta_icon.icon);
    // Membuat URL ikon dengan menggabungkan string
    return `https://icon-sets.iconify.design/${convertedIcon}.svg`;
  });
</script>
<template>
  <header class="relative overflow-hidden bgPage">
    <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
      <h1 class="text-g3 md:text-g4 text-center" itemprop="headline">
        {{ blok.headline }}
      </h1>
      <div class="mt-5 max-w-3xl text-center mx-auto">
        <p itemprop="description">
          {{ blok.subhealine }}
        </p>
      </div>
      <div class="mt-8 gap-3 flex justify-center">
        <UButton
          class="animate-bounce ring-1 ring-primary-800"
          :icon="`i-${iconUrl}`"
          :label="blok.cta" />
      </div>
    </div>
  </header>
</template>
