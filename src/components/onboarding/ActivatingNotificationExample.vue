<template>
  <div class="full-size flex items-center text-center bg">
    <div id="container" class="mt-44">
      <h1 id="heading" class="text-4xl onboarding-headings px-1">{{ $t('onboardingNotification') }}</h1>
      <p class="onboarding-paragraphs mt-3.5">
        {{ $t('onboardingNotificationT') }}
      </p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ActivatingNotificationExample',
});
</script>
<style scoped>
div.bg {
  background: url('https://resize.rs/storage/img/onboarding/notification-example.png') no-repeat center;
  background-size: cover;
}

@media (max-height: 600px) {
  #heading {
    padding: 0 1.25rem;
  }
}

@media (min-height: 601px) {
  #container {
    margin-top: 16rem;
  }
}
</style>