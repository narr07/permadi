<script lang="ts" setup>
const designIcon = ref([
  { title: 'Illustrator', iconName: 'i-logos-adobe-illustrator', url: 'https://www.adobe.com/products/illustrator.html' },
  { title: 'Photoshop', iconName: 'i-logos-adobe-photoshop', url: 'https://www.adobe.com/products/photoshop.html' },
  { title: 'Figma', iconName: 'i-skill-icons-figma-dark', url: 'https://www.figma.com/' },
  { title: 'XD', iconName: 'i-logos-adobe-xd', url: 'https://www.adobe.com/products/xd.html' },
  { title: 'Premiere', iconName: 'i-logos-adobe-premiere', url: 'https://www.adobe.com/products/premiere.html' },
  { title: 'After Effect', iconName: 'i-logos-adobe-after-effects', url: 'https://www.adobe.com/products/aftereffects.html' },
  { title: 'Lightroom', iconName: 'i-logos-adobe-lightroom', url: 'https://www.adobe.com/products/photoshop-lightroom.html' },
  { title: 'Animate', iconName: 'i-logos-adobe-animate', url: 'https://www.adobe.com/products/animate.html' },
  { title: 'Affinity Designer', iconName: 'i-vscode-icons-file-type-affinitydesigner', url: 'https://affinity.serif.com/en-us/designer/' },
  { title: 'Corel Draw', iconName: 'i-file-icons-coreldraw-alt', url: 'https://www.coreldraw.com/' },
  { title: 'Blender', iconName: 'i-skill-icons-blender-dark', url: 'https://www.blender.org/' },
  { title: 'Gimp', iconName: 'i-devicon-gimp', url: 'https://www.gimp.org/' },
  { title: 'Sketch', iconName: 'i-devicon-sketch', url: 'https://www.sketch.com/' },
  { title: 'InDesign', iconName: 'i-logos-adobe-indesign', url: 'https://www.adobe.com/products/indesign.html' },
])

const techIcons = [
  { title: 'Python', iconName: 'i-skill-icons-python-dark', url: 'https://www.python.org/' },
  { title: 'Nuxt.js', iconName: 'i-skill-icons-nuxtjs-dark', url: 'https://nuxtjs.org/' },
  { title: 'Flutter', iconName: 'i-skill-icons-flutter-dark', url: 'https://flutter.dev/' },
  { title: 'Tailwind CSS', iconName: 'i-skill-icons-tailwindcss-dark', url: 'https://tailwindcss.com/' },
  { title: 'Next.js', iconName: 'i-skill-icons-nextjs-dark', url: 'https://nextjs.org/' },
  { title: 'JavaScript', iconName: 'i-skill-icons-javascript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { title: 'Dart', iconName: 'i-skill-icons-dart-dark', url: 'https://dart.dev/' },
  { title: 'Flask', iconName: 'i-skill-icons-flask-dark', url: 'https://flask.palletsprojects.com/' },
  { title: 'Django', iconName: 'i-skill-icons-django', url: 'https://www.djangoproject.com/' },
  { title: 'Vue.js', iconName: 'i-skill-icons-vuejs-dark', url: 'https://vuejs.org/' },
  { title: 'PHP', iconName: 'i-skill-icons-php-dark', url: 'https://www.php.net/' },
  { title: 'Laravel', iconName: 'i-skill-icons-laravel-dark', url: 'https://laravel.com/' },
  { title: 'React', iconName: 'i-skill-icons-react-dark', url: 'https://reactjs.org/' },
  { title: 'TypeScript', iconName: 'i-skill-icons-typescript', url: 'https://www.typescriptlang.org/' },
]
const tabitems = [
  { slot: 'user', icon: 'i-ph-user-duotone' },
  { slot: 'desain', icon: 'i-ph-palette-duotone' },
  { slot: 'teknologi', icon: 'i-ph-code-duotone' },
]
</script>

<template>
  <UContainer class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <UCard>
      <!-- <PageEducation /> -->
      <UTabs class="h-full flex flex-col" :items="tabitems" color="neutral">
        <template #default="{ item }">
          <div class="flex items-center gap-1 relative truncate">
            <span class="sr-only">
              {{ item.slot }}
            </span>
          </div>
        </template>
        <!-- tombol tab -->
        <!-- konten tab 1 -->
        <template #user>
          <div>
            <UCard class="my-auto flex-grow h-full p-2">
              <div>
                <p class=" text-balance">
                  {{ $t('tabHome.eduText') }}
                </p>
              </div>
            </UCard>
          </div>
        </template>
        <!-- konten tab 2 -->
        <template #desain>
          <div>
            <UCard class="flex-grow h-full">
              <div class="items-center">
                <div class="flex flex-wrap gap-2 md:gap-4 justify-center">
                  <div v-for="(button, index) in designIcon" :key="index">
                    <UTooltip :delay-duration="0" :text="button.title" placement="bottom" :popper="{ arrow: true }">
                      <UButton
                        class="px-1.5" color="primary" variant="subtle" :to="`${button.url}?ref=dinarpermadiyusup`" target="_blank"
                        :title="button.title" :aria-label="button.title" rel="noopener noreferrer nofollow"
                      >
                        <UIcon v-if="button.iconName" class="w-10 h-10" :name="button.iconName" />
                        <USkeleton v-else class="h-10 w-10 rounded" />
                        <span class="sr-only">{{ button.title }}</span>
                      </UButton>
                    </UTooltip>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </template>
        <!-- konten tab 3 -->
        <template #teknologi>
          <div>
            <UCard class="flex-grow h-full">
              <div class="items-center">
                <div class="flex flex-wrap gap-2 md:gap-4 justify-center">
                  <div v-for="(techIcon, index) in techIcons" :key="index">
                    <UTooltip :delay-duration="0" :text="techIcon.title" placement="bottom" :popper="{ arrow: true }">
                      <UButton
                        class="px-1.5" color="primary" variant="subtle" :to="`${techIcon.url}?ref=dinarpermadiyusup`" target="_blank"
                        :aria-label="techIcon.title" :title="techIcon.title" rel="noopener noreferrer nofollow"
                      >
                        <UIcon class="w-10 h-10" :name="techIcon.iconName" />
                        <span class="sr-only">{{ techIcon.title }}</span>
                      </UButton>
                    </UTooltip>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </template>
      </UTabs>
    </UCard>
    <HomeLast />
  </UContainer>
</template>
