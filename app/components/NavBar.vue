<template>
  <nav class="fixed w-full z-50  top-2">
    <UContainer class="max-w-6xl mx-auto">
      <div class="bg-permadi-300 border-2 dark:bg-permadi-900 p-2 rounded">
        <div class=" flex items-center justify-between">
          <div
            class="flex items-center"
          >
            <UTooltip text="Home" placement="bottom" :popper="{ arrow: true }">
              <ULink aria-label="logo" to="/">
                <Logo />
              </ULink>
            </UTooltip>
          </div>
          <div class="flex md:space-x-2">
            <div>
              TES
            </div>
          </div>
          <ColorModeButton />
        </div>
      </div>
    </UContainer>
  </nav>
</template>
