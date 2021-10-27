<template>
  <div class="full-size flex items-center text-center bg">
    <div class="mt-20">
      <h1 class="text-4xl onboarding-headings">
        {{ $t('onboardingSearch') }}
      </h1>
      <p class="onboarding-paragraphs mt-3.5">
        {{ $t('onboardingSearchT') }}
      </p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SearchingExample',
});
</script>
<style scoped>
div.bg {
  background: url('https://resize.rs/storage/img/onboarding/searching-example.png') no-repeat center;
  background-size: cover;
}
</style>