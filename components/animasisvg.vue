<template>
  <main class="px-2 py-10 md:px-14">
    <div class="flex  flex-col md:flex-row  w-full">
      <div class="w-full relative md:w-1/2 ">
        <h1
          class="text-center teksguru absolute  text-3xl justify-center items-center">
          Guru
        </h1>
        <h1
          class="text-center teksprogrammer absolute  text-3xl justify-center items-center">
          Programmer
        </h1>
        <h1
          class="text-center teksdesigner absolute  text-3xl justify-center items-center">
          Designer
        </h1>
      </div>
      <div class="w-full relative md:w-1/2">
        <SvgGuru class="guru absolute top-0" />
        <SvgProgrammer class="programmer absolute top-0 " />
        <SvgDesigner class="designer absolute top-0 " />
      </div>
    </div>
    <div class="w-full flex h-[500] bg-merah">
        INI CARD
    </div>
  </main>
</template>
<script setup>
  onMounted(() => {
    useAnime
      .timeline({
        easing: "easeOutExpo",
        duration: 1500,
        loop: true,
      })
      .add({
        translateY: [100, 0],
        targets: ".guru, .teksguru",
        scale: [0, 1],
      })
      .add({
        translateY: [0, 100],
        targets: ".guru , .teksguru",
        scale: [1, 0],
        delay: 1000,
        duration: 500,
      })
      .add({
        translateY: [100, 0],
        targets: ".programmer, .teksprogrammer",
        scale: [0, 1],
      })
      .add({
        translateY: [0, 100],
        targets: ".programmer, .teksprogrammer",
        scale: [1, 0],
        delay: 1000,
        duration: 500,
      })
      .add({
        translateY: [100, 0],
        targets: ".designer, .teksdesigner",
        scale: [0, 1],
      })
      .add({
        translateY: [0, 100],
        targets: ".designer, .teksdesigner",
        scale: [1, 0],
        delay: 1000,
        duration: 500,
      });
  });
</script>
