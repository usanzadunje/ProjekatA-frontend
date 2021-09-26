<template>
  <ion-item @click="chooseLanguage" slot="end" class="ion-no-padding ion-no-margin no-border mr-1">
    <ion-button fill="clear" class="settings-fade-text">
      {{ localization.text || 'SRB' }}
    </ion-button>
  </ion-item>
</template>
<script>

import { defineComponent, computed } from 'vue';
import { useStore }                  from 'vuex';
import { getLanguages }              from '@/lang';
import { useI18n }                   from 'vue-i18n';
import {
  IonItem,
  IonButton,
  pickerController,
}                                    from '@ionic/vue';

export default defineComponent({
  name: 'LanguagePicker',
  components: {
    IonItem,
    IonButton,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const localization = computed(() => store.getters['user/localization']);

    /* Composables */
    const { t } = useI18n();

    /* Event handlers */
    const chooseLanguage = async() => {
      const picker = await pickerController.create({
        columns: [
          {
            name: 'language',
            options: getLanguages(localization.value),
          },
        ],
        buttons: [
          {
            text: t('cancel'),
            role: "cancel",
          },
          {
            text: t('confirm'),
            role: "confirm",
            handler: async(value) => {
              await store.dispatch('user/setLocalization', value.language);
              await picker.dismiss(null, "confirm");
            },
          },
        ],
      });
      await picker.present();
    };


    return {
      /* Component properties */
      localization,

      /* Event handlers */
      chooseLanguage,

    };
  },
});
</script>
<style scoped>
ion-item {
  --background: var(--primary-paint);
  --border-color: rgba(112, 112, 112, 0.1);
  --inner-padding-end: 0;
}
</style>