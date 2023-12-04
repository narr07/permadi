<script setup>
  const items = ref();
  defineProps({ blok: Object });
</script>
<template>
  <UContainer v-editable="blok" class="mx-auto h-full grid grid-cols-1 gap-6 md:grid-cols-2">
      <UCard class="cardHover" data-aos="zoom-in" data-aos-duration="300">
        <div>
          <Swiper
            :modules="[SwiperAutoplay, SwiperPagination]"
            :slides-per-view="1"
            :pagination="true"
            :loop="true"
            :autoplay="{
              delay: 2000,
              disableOnInteraction: true,
            }">
            <SwiperSlide>
              <div class="flex justify-center items-center w-full">
                <SvgGuru />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div class="flex justify-center items-center w-full">
                <SvgProgrammer />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div class="flex justify-center items-center w-full">
                <SvgDesigner />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </UCard>
      <UTabs
        data-aos="zoom-in"
        data-aos-duration="300"
        :items="blok.list"
        :default-index="0">
        <template #item="{ item }">
          <UCard
            data-aos="zoom-in"
            data-aos-duration="300"
            v-editable="blok"
            class="cardHover">
            <div class=" p-2 items-center gap-4 md:gap-8">
              <div class="flex flex-col justify-center pb-4 md:pb-0 w-full">
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
