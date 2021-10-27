<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-refresher pull-min="60" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>
      <div class="wrap">
        <h1 class="secondary-heading text-center uppercase">{{ $t('owner.staff') }}</h1>

        <div class="flex justify-end w-5/6 mx-auto mt-6 mb-4">
          <ion-button
              expand="block"
              class="auth-button-size auth-button-border-radius uppercase button-text-white"
              @click="createStaffMember"
          >
            {{ $t('create') }}
          </ion-button>
        </div>

        <StaffCard
            v-for="staffMember in staff"
            :key="staffMember.id"
            :staff="staffMember"
            :button="true"
            @edit-staff="editStaffMember(staffMember)"
        >
          <div class="absolute top-1.5 right-3 z-40">
            <ion-icon
                :icon="close"
                slot="icon-only"
                class="text-2xl text-danger ml-2"
                @click="deleteStaffMember(staffMember, $event)"></ion-icon>
          </div>
        </StaffCard>
      </div>
      <AppModal
          :is-open="isModalOpen"
          css-class="custom-edit-staff-modal"
          :swipeToClose="false"
          width="90%"
          @didDismiss="openModal(false);"
      >
        <StaffCreateEditModal
            :staff="modalData"
            @dismiss="openModal(false)"
        />
      </AppModal>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useStore }                  from 'vuex';
import { useI18n }                   from 'vue-i18n';
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonButton,
  IonIcon,
  alertController,
}                                    from '@ionic/vue';

import StaffCard            from '@/components/staff/cards/StaffCard';
import AppModal             from '@/components/AppModal';
import StaffCreateEditModal from '@/components/staff/modals/StaffCreateEditModal';

import { useModal }         from '@/composables/useModal';
import { useErrorHandling } from '@/composables/useErrorHandling';

import {
  close,
} from 'ionicons/icons';

export default defineComponent({
  name: "StaffIndex",
  components: {
    IonPage,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonButton,
    IonIcon,
    StaffCard,
    AppModal,
    StaffCreateEditModal,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const staff = computed(() => store.getters['owner/staff']);

    /* Composables */
    const { t } = useI18n();
    const { isModalOpen, modalData, openModal } = useModal();
    const { tryCatch } = useErrorHandling();

    /* Lifecycle hooks */

    /* Event handlers */
    const createStaffMember = async() => {
      modalData.value = null;

      openModal(true);
    };
    const editStaffMember = async(staffMember, event = null) => {
      event?.stopPropagation();

      openModal(true, staffMember);
    };
    const deleteStaffMember = async(staffMember, event = null) => {
      event?.stopPropagation();

      const alert = await alertController
          .create({
            header: t('staff.alertRemoveStaffHeader'),
            message: t('staff.removeStaffMessage', { staff: `${staffMember.fname} ${staffMember.lname}` }),
            mode: 'ios',
            buttons: [
              {
                text: t('disagree'),
                role: 'cancel',
              },
              {
                text: t('agree'),
                handler: async() => {
                  await tryCatch(
                      async() => {
                        await store.dispatch('owner/deleteStaff', staffMember.id);
                      },
                      null,
                      'generalAlertError',
                  );
                },
              },
            ],
          });
      await alert.present();
    };
    const refresh = async(event) => {
      await tryCatch(
          async() => {
            await store.dispatch('owner/getStaffInfo');
          },
          null,
          'dataFetchingError',
      );

      event.target.complete();
    };

    return {
      /* Component properties */
      staff,
      isModalOpen,
      modalData,

      /* Event handlers */
      createStaffMember,
      editStaffMember,
      deleteStaffMember,
      refresh,
      openModal,

      /* Icons */
      close,
    };
  },

});
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
  background: var(--show-paint);
}
</style>