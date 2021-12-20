<template>
  <div class="h-full px-8 flex flex-col justify-between">
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
            class="rounded-2xl h-11"
            :class="{ 'error-border' : errorNames.hasOwnProperty('name') }"
        >
          <ion-icon
              slot="start"
              :icon="createOutline"
              class="mr-2 text-xl text-gray-500"
          ></ion-icon>
          <ion-input
              v-model.lazy="place.name"
              v-capitalize
              type="text"
              debounce="100"
              :placeholder="$t('name')"
              :autofocus="true"
              required
              @keyup.enter="cityInput.$el?.setFocus()"
          ></ion-input>
        </ion-item>
        <ion-item
            lines="none"
            class="rounded-2xl h-11 mt-3.5"
            :class="{ 'error-border' : errorNames.hasOwnProperty('city') }"
        >
          <ion-icon
              slot="start"
              :icon="navigateOutline"
              class="mr-2 text-xl text-gray-500"
          ></ion-icon>
          <ion-input
              ref="cityInput"
              v-model.lazy="place.city"
              v-capitalize
              type="text"
              debounce="100"
              :placeholder="$t('city')"
              required
              @keyup.enter="addressInput.$el?.setFocus()"
          ></ion-input>
        </ion-item>
        <ion-item
            lines="none"
            class="rounded-2xl h-11 mt-3.5"
            :class="{ 'error-border' : errorNames.hasOwnProperty('address') }"
        >
          <ion-icon
              slot="start"
              :icon="homeOutline"
              class="mr-2 text-xl text-gray-500"
          ></ion-icon>
          <ion-input
              ref="addressInput"
              v-model.lazy="place.address"
              type="text"
              debounce="100"
              :placeholder="$t('address')"
              required
              @keyup.enter="emailInput.$el?.setFocus()"
          ></ion-input>
        </ion-item>
        <ion-item
            lines="none"
            class="rounded-2xl h-11 mt-3.5"
            :class="{ 'error-border' : errorNames.hasOwnProperty('email') }"
        >
          <ion-icon
              slot="start"
              :icon="mailOutline"
              class="mr-2 text-xl text-gray-500"
          ></ion-icon>
          <ion-input
              ref="emailInput"
              v-model.lazy="place.email"
              type="email"
              debounce="100"
              :placeholder="$t('place.email')"
              required
              @keyup.enter="phoneInput.$el?.setFocus()"
          ></ion-input>
        </ion-item>
        <ion-item
            lines="none"
            class="rounded-2xl h-11 mt-3.5"
            :class="{ 'error-border' : errorNames.hasOwnProperty('phone') }"
        >
          <ion-icon
              slot="start"
              :icon="callOutline"
              class="mr-2 text-xl text-gray-500"
          ></ion-icon>
          <ion-input
              ref="phoneInput"
              v-model.lazy="place.phone"
              type="tel"
              debounce="100"
              :placeholder="$t('phone')"
              required
              @keyup.enter="update"
          ></ion-input>
        </ion-item>
      </div>
      <ion-item slot="end" class="ion-no-padding ion-no-margin no-border pl-5 mt-2 bg-transparent">
        <ion-label class="settings-fade-text">{{ $t('workingHours') }}</ion-label>
        <ion-toggle
            :checked="showWorkingHours"
            mode="md"
            @ionChange="toggleWorkingHours($event)"
        ></ion-toggle>
      </ion-item>
      <div v-show="showWorkingHours">
        <ion-item
            lines="none"
            class="rounded-2xl h-11 mt-3.5"
            :class="{ 'error-border' : errorNames.hasOwnProperty('mon_fri') }"
        >
          <ion-label slot="start" class="settings-fade-text">{{ `${$t('monday')}-${$t('friday')}` }}</ion-label>

          <AppFromToTimePicker
              :canInitialize="showWorkingHours"
              start-trigger-id="open-mon-fri-start-picker"
              end-trigger-id="open-mon-fri-end-picker"
              :start-value="place.mon_fri_start"
              :end-value="place.mon_fri_end"
              @start-changed="place.mon_fri_start = $event"
              @end-changed="place.mon_fri_end = $event"
          />
        </ion-item>
        <ion-item
            lines="none"
            class="rounded-2xl h-11 mt-3.5"
            :class="{ 'error-border' : errorNames.hasOwnProperty('saturday') }"
        >
          <ion-label slot="start" class="settings-fade-text">{{ $t('saturday') }}</ion-label>

          <AppFromToTimePicker
              :canInitialize="showWorkingHours"
              start-trigger-id="open-saturday-start-picker"
              end-trigger-id="open-saturday-end-picker"
              :start-value="place.saturday_start"
              :end-value="place.saturday_end"
              @start-changed="place.saturday_start = $event"
              @end-changed="place.saturday_end = $event"
          />
        </ion-item>
        <ion-item
            lines="none"
            class="rounded-2xl h-11 mt-3.5"
            :class="{ 'error-border' : errorNames.hasOwnProperty('sunday') }"
        >
          <ion-label slot="start" class="settings-fade-text">{{ $t('sunday') }}</ion-label>

          <AppFromToTimePicker
              :canInitialize="showWorkingHours"
              start-trigger-id="open-sunday-start-picker"
              end-trigger-id="open-sunday-end-picker"
              :start-value="place.sunday_start"
              :end-value="place.sunday_end"
              @start-changed="place.sunday_start = $event"
              @end-changed="place.sunday_end = $event"
          />
        </ion-item>
      </div>
    </div>

    <div class="mt-10 safe-pb">
      <ion-button
          :disabled="loading"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white relative"
          @click="update"
      >
        {{ loading ? $t('checking') : $t('update') }}
        <ion-spinner
            v-if="loading"
            name="crescent"
            class="absolute right-0"
        ></ion-spinner>
      </ion-button>
      <ion-button
          :disabled="loading"
          fill="clear"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-black mt-4"
          @click="resetInput"
      >
        {{ $t('reset') }}
      </ion-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, computed, watch, toRefs } from 'vue';
import { useStore }                                                           from 'vuex';
import {
  IonItem,
  IonInput,
  IonIcon,
  IonButton,
  IonSpinner,
  IonToggle,
  IonLabel,
  modalController,
}
                                                                              from "@ionic/vue";

import MainImagePreview    from '@/components/MainImagePreview';
import PlaceImagesAddModal from '@/components/owner/modals/PlaceImagesAddModal';
import AppFromToTimePicker from '@/components/AppFromToTimePicker';

import { useErrorHandling }   from '@/composables/useErrorHandling';
import { hideNativeKeyboard } from '@/composables/useDevice';

import {
  createOutline,
  navigateOutline,
  homeOutline,
  mailOutline,
  callOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: "PlaceEditForm",
  components: {
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    IonSpinner,
    IonToggle,
    IonLabel,
    MainImagePreview,
    AppFromToTimePicker,
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
  emits: ['scrollToTop'],
  setup(props, { emit }) {
    /* Global properties and methods */
    const store = useStore();

    /* Computed properties */
    const placeInfo = computed(() => {
      return store.getters['owner/place'];
    });
    const mainImagePath = computed(() => {
      if(placeInfo.value.images?.length > 0) {
        return placeInfo.value.images?.find(image => image.is_main)?.path ??
            placeInfo.value.images[0]?.path;
      }else {
        return '/places/image_placeholder.png';
      }
    });

    /* Component properties */
    const place = reactive({});
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
    const { errorNames, tryCatch } = useErrorHandling();

    /* Methods */
    const resetInput = () => {
      showWorkingHours.value = false;

      const monFriHours = placeInfo.value.working_hours.mon_fri.split('-');
      const saturdayHours = placeInfo.value.working_hours.saturday.split('-');
      const sundayHours = placeInfo.value.working_hours.sunday.split('-');

      place.name = placeInfo.value.name;
      place.city = placeInfo.value.city;
      place.address = placeInfo.value.address;
      place.email = placeInfo.value.email;
      place.phone = placeInfo.value.phone;
      place.mon_fri_start = monFriHours[0];
      place.mon_fri_end = monFriHours[1];
      place.saturday_start = saturdayHours[0];
      place.saturday_end = saturdayHours[1];
      place.sunday_start = sundayHours[0];
      place.sunday_end = sundayHours[1];

      emit('scrollToTop');
    };

    /* Event handlers */
    const update = async() => {
      loading.value = true;
      await hideNativeKeyboard();

      await tryCatch(
          async() => {
            place.working_hours = {};
            place.working_hours.mon_fri = `${place.mon_fri_start}-${place.mon_fri_end}`;
            place.working_hours.saturday = `${place.saturday_start}-${place.saturday_end}`;
            place.working_hours.sunday = `${place.sunday_start}-${place.sunday_end}`;

            await store.dispatch("owner/updatePlaceInfo", place);
          },
          {
            successMessageKey: 'successUpdate',
          },
      );

      loading.value = false;
    };
    const openPreview = async() => {
      const modal = await modalController
          .create({
            component: PlaceImagesAddModal,
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
        await tryCatch(
            async() => {
              await store.dispatch("owner/getPlaceInfo");
            },
            {
              errorMessageKey: 'dataFetchingError',
            },
        );

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