<template>
  <div class="px-2 md:px-14 space-y-6 flex-col py-10 overflow-x-hidden">
    <ColorModeButton />
    <div class=" bg-merah p-2 h-96">INI HOME</div>
    <div class="con justify-end w-1/2 bg-merah-100 p-2 h-96">INI HOME</div>
    <div class=" bg-merah-500 p-2 h-96">INI HOME</div>
    <div class="bg-merah p-2 h-96">INI HOME</div>
    <div class="bg-merah p-2 h-96">INI HOME</div>
    <div class="bg-merah p-2 h-96">INI HOME</div>
    <div class="bg-merah p-2 h-96">INI HOME</div>
  </div>
</template>
<script setup>
  onMounted(() => {
    const animation = useAnime({
      targets: ".con",
      // opacity: [0, 1],
      translateX: [1500, 0.5],
      delay: function (el, i) {
        return i * 100;
      },
      elasticity: 200,
      easing: "easeInOutSine",
      autoplay: false,
    });
    window.addEventListener("scroll", function () {
      animation.seek(window.scrollY * 1.85);
    });
  });
</script>
