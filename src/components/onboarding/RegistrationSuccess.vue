<template>
  <div class="flex flex-col justify-center text-center full-size bg">
    <h1 class="text-4xl onboarding-headings text-white">
      Uspesno ste se registrovali!
    </h1>
    <p class="onboarding-paragraphs text-white mt-3.5">
      Dobrodosli u Project A. Nastavi dalje kako bi video sta vam nasa aplikacija nudi.
    </p>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RegistrationSuccess',
});
</script>
<style scoped>
div.bg {
  background: url('https://resize.rs/storage/img/onboarding/successful-registration.png') no-repeat center fixed;
  background-size: cover;
}
</style>