<template>
  <div class="h-full px-8 pb-2 flex flex-col justify-between">
    <div>
      <div>
        <div class="mb-6">
          <MainImagePreview
              :path="mainImagePath"
              :label="$t('image', 2)"
              @click="openPreview(place)"
          />
        </div>
        <ion-item
            lines="none"
            class="flex rounded-2xl h-11"
            :class="{ 'error-border' : errorNames.hasOwnProperty('name') }"
        >
          <ion-icon :icon="createOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
          <ion-input
              v-capitalize
              v-model.lazy="place.name"
              @keyup.enter="cityInput.$el?.setFocus()"
              type="text"
              debounce="100"
              :placeholder="$t('name')"
              :autofocus="true"
              required
          ></ion-input>
        </ion-item>
        <ion-item
            lines="none"
            class="flex rounded-2xl h-11 mt-3.5"
            :class="{ 'error-border' : errorNames.hasOwnProperty('city') }"
        >
          <ion-icon :icon="navigateOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
          <ion-input
              v-capitalize
              ref="cityInput"
              v-model.lazy="place.city"
              @keyup.enter="addressInput.$el?.setFocus()"
              type="text"
              debounce="100"
              :placeholder="$t('city')"
              required
          ></ion-input>
        </ion-item>
        <ion-item
            lines="none"
            class="flex rounded-2xl h-11 mt-3.5"
            :class="{ 'error-border' : errorNames.hasOwnProperty('address') }"
        >
          <ion-icon :icon="homeOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
          <ion-input
              ref="addressInput"
              v-model.lazy="place.address"
              @keyup.enter="emailInput.$el?.setFocus()"
              type="text"
              debounce="100"
              :placeholder="$t('address')"
              required
          ></ion-input>
        </ion-item>
        <ion-item
            lines="none"
            class="flex rounded-2xl h-11 mt-3.5"
            :class="{ 'error-border' : errorNames.hasOwnProperty('email') }"
        >
          <ion-icon :icon="mailOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
          <ion-input
              ref="emailInput"
              v-model.lazy="place.email"
              @keyup.enter="phoneInput.$el?.setFocus()"
              type="email"
              debounce="100"
              :placeholder="$t('place.email')"
              required
          ></ion-input>
        </ion-item>
        <ion-item
            lines="none"
            class="flex rounded-2xl h-11 mt-3.5"
            :class="{ 'error-border' : errorNames.hasOwnProperty('phone') }"
        >
          <ion-icon :icon="callOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
          <ion-input
              ref="phoneInput"
              v-model.lazy="place.phone"
              @keyup.enter="update"
              type="tel"
              debounce="100"
              :placeholder="$t('phone')"
              required
          ></ion-input>
        </ion-item>
      </div>
      <ion-item slot="end" class="ion-no-padding ion-no-margin no-border pl-5 mt-2 bg-transparent">
        <ion-label class="settings-fade-text">{{ $t('workingHours') }}</ion-label>
        <ion-toggle
            :checked="showWorkingHours"
            @ionChange="toggleWorkingHours($event)"
            mode="md"
        ></ion-toggle>
      </ion-item>
      <div v-show="showWorkingHours">
        <ion-item
            lines="none"
            class="flex rounded-2xl h-11 mt-3.5"
            :class="{ 'error-border' : errorNames.hasOwnProperty('mon_fri') }"
        >
          <ion-label class="settings-fade-text">{{ `${$t('monday')}-${$t('friday')}` }}</ion-label>
          <ion-datetime
              v-model="place.mon_fri_start"
              :doneText="$t('choose')"
              :cancelText="$t('cancel')"
              display-format="HH:mm"
              value="04:20"
              :placeholder="$t('selectTime')"
          ></ion-datetime>
          &nbsp;
          -
          <ion-datetime
              v-model="place.mon_fri_end"
              :doneText="$t('choose')"
              :cancelText="$t('cancel')"
              display-format="HH:mm"
              value="04:20"
              :placeholder="$t('selectTime')"
          ></ion-datetime>
        </ion-item>
        <ion-item
            lines="none"
            class="flex rounded-2xl h-11 mt-3.5"
            :class="{ 'error-border' : errorNames.hasOwnProperty('satudrady') }"
        >
          <ion-label class="settings-fade-text">{{ $t('saturday') }}</ion-label>
          <ion-datetime
              v-model="place.saturday_start"
              :doneText="$t('choose')"
              :cancelText="$t('cancel')"
              display-format="HH:mm"
              value="04:20"
              :placeholder="$t('selectTime')"
          ></ion-datetime>
          &nbsp;
          -
          <ion-datetime
              v-model="place.saturday_end"
              :doneText="$t('choose')"
              :cancelText="$t('cancel')"
              display-format="HH:mm"
              value="04:20"
              :placeholder="$t('selectTime')"
          ></ion-datetime>
        </ion-item>
        <ion-item
            lines="none"
            class="flex rounded-2xl h-11 mt-3.5"
            :class="{ 'error-border' : errorNames.hasOwnProperty('sunday') }"
        >
          <ion-label class="settings-fade-text">{{ $t('sunday') }}</ion-label>
          <ion-datetime
              v-model="place.sunday_start"
              :doneText="$t('choose')"
              :cancelText="$t('cancel')"
              display-format="HH:mm"
              value="04:20"
              :placeholder="$t('selectTime')"
          ></ion-datetime>
          &nbsp;
          -
          <ion-datetime
              v-model="place.sunday_end"
              :doneText="$t('choose')"
              :cancelText="$t('cancel')"
              display-format="HH:mm"
              value="04:20"
              :placeholder="$t('selectTime')"
          ></ion-datetime>
        </ion-item>
      </div>
    </div>

    <div class="mt-10">
      <ion-button
          :disabled="loading"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white relative"
          @click="update"
      >
        {{ loading ? $t('checking') : $t('update') }}
        <ion-spinner v-if="loading" name="crescent" class="absolute right-0"></ion-spinner>
      </ion-button>
      <ion-button
          :disabled="loading"
          fill="clear"
          @click="$router.back()"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-black mt-4"
      >
        {{ $t('cancel') }}
      </ion-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, computed, watch, toRefs } from 'vue';
import { useStore }                                                           from 'vuex';
import { useI18n }                                                            from 'vue-i18n';
import {
  IonItem,
  IonInput,
  IonIcon,
  IonButton,
  IonSpinner,
  IonToggle,
  IonLabel,
  IonDatetime,
  modalController,
}
                                                                              from "@ionic/vue";

import MainImagePreview    from '@/components/MainImagePreview';
import AddPlaceImagesModal from '@/components/owner/modals/AddPlaceImagesModal';

import { useToastNotifications } from '@/composables/useToastNotifications';

import { getError, hideNativeKeyboard, sleep } from "@/utils/helpers";

import {
  createOutline,
  navigateOutline,
  homeOutline,
  mailOutline,
  callOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: "EditPlaceForm",
  components: {
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    IonSpinner,
    IonToggle,
    IonLabel,
    IonDatetime,
    MainImagePreview,
  },
  props: {
    resetInputs: {
      type: Boolean,
      default: false,
    },
    refresher: {
      type: Object,
    },
  },
  setup(props) {
    /* Global properties and methods */
    const store = useStore();
    const { t } = useI18n();

    /* Computed properties */
    const placeInfo = computed(() => {
      return store.getters['owner/place'];
    });
    const mainImagePath = computed(() => {
      if(placeInfo.value.images?.length > 0) {
        return placeInfo.value.images.find(image => image.is_main)?.path ??
            placeInfo.value.images[0]?.path;
      }else {
        return '/places/default_place_cover.png';
      }
    });

    /* Component properties */
    const place = reactive({});
    const errorNames = ref({});
    const cityInput = ref(null);
    const addressInput = ref(null);
    const emailInput = ref(null);
    const phoneInput = ref(null);
    const loading = ref(false);
    const { resetInputs } = toRefs(props);
    const showWorkingHours = ref(false);


    /* Lifecycle hooks */

    onMounted(async() => {
      resetInput();
    });

    /* Composables */
    const { showSuccessToast, showErrorToast } = useToastNotifications();


    /* Methods */
    const resetInput = () => {
      showWorkingHours.value = false;

      const mon_fri_hours = placeInfo.value.working_hours.mon_fri.split('-');
      const saturday_hours = placeInfo.value.working_hours.saturday.split('-');
      const sunday_hours = placeInfo.value.working_hours.sunday.split('-');

      place.name = placeInfo.value.name;
      place.city = placeInfo.value.city;
      place.address = placeInfo.value.address;
      place.email = placeInfo.value.email;
      place.phone = placeInfo.value.phone;
      place.mon_fri_start = mon_fri_hours[0];
      place.mon_fri_end = mon_fri_hours[1];
      place.saturday_start = saturday_hours[0];
      place.saturday_end = saturday_hours[1];
      place.sunday_start = sunday_hours[0];
      place.sunday_end = sunday_hours[1];
    };

    /* Event handlers */
    const update = async() => {
      loading.value = true;
      await hideNativeKeyboard()
      try {
        await store.dispatch("owner/updatePlaceInfo", place);

        showSuccessToast(t('successUpdate'));
      }catch(errors) {
        errorNames.value = getError(errors);
        await showErrorToast(errors);
        await sleep(Object.keys(errorNames.value).length * 900);
        errorNames.value = {};
      }finally {
        loading.value = false;
      }
    };
    const openPreview = async() => {
      const modal = await modalController
          .create({
            component: AddPlaceImagesModal,
            cssClass: 'custom-gallery-modal',
          });
      return modal.present();
    };
    const toggleWorkingHours = (e) => {
      showWorkingHours.value = e.target.checked;
    };

    /* Watchers */
    watch(resetInputs, () => {
      if(resetInputs.value) {
        showWorkingHours.value = false;
        resetInput();
      }
    });
    watch(props.refresher, async() => {
      if(props.refresher.isActive) {
        await store.dispatch("owner/getPlaceInfo");

        resetInput();

        props.refresher.event.target.complete();
      }
    });


    return {
      /* Global properties */
      place,

      /* Component properties */
      errorNames,
      cityInput,
      addressInput,
      phoneInput,
      emailInput,
      loading,
      mainImagePath,
      showWorkingHours,

      /* Event handlers  */
      update,
      openPreview,
      toggleWorkingHours,
      resetInput,

      /* Icons */
      createOutline,
      navigateOutline,
      homeOutline,
      mailOutline,
      callOutline,
    };
  },
});
</script>
<style scoped>

</style>