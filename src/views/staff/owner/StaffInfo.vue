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

        <ion-button
            expand="block"
            class="auth-button-size auth-button-border-radius uppercase button-text-white my-8 mx-auto w-5/6"
            @click="createMember"
        >
          {{ $t('owner.createStaff') }}
        </ion-button>

        <StaffCard
            v-for="member in staff"
            :key="member.id"
            :member="member"
            @edit-member="editMember(member)"
            :button="true"
        >
          <div class="absolute top-1.5 right-3 z-40">
            <ion-icon :icon="close" class="text-2xl text-danger ml-2" slot="icon-only"
                      @click="deleteMember(member, $event)"></ion-icon>
          </div>
        </StaffCard>
      </div>
      <Modal
          :is-open="isModalOpen"
          css-class="custom-edit-staff-modal"
          @didDismiss="openModal(false);"
          :swipeToClose="false"
          width="90%"
      >
        <CreateEditStaffModal
            :staff="modalData"
            @dismiss="openModal(false)"
        />
      </Modal>
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
import Modal                from '@/components/Modal';
import CreateEditStaffModal from '@/components/staff/modals/CreateEditStaffModal';


import { useToastNotifications } from '@/composables/useToastNotifications';

import {
  close,
}                   from 'ionicons/icons';
import { useModal } from '@/composables/useModal';

export default defineComponent({
  name: "StaffInfo",
  components: {
    IonPage,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonButton,
    IonIcon,
    StaffCard,
    Modal,
    CreateEditStaffModal,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const staff = computed(() => store.getters['owner/staff']);

    /* Composables */
    const { showErrorToast } = useToastNotifications();
    const { t } = useI18n();
    const { isModalOpen, modalData, openModal } = useModal();

    /* Lifecycle hooks */

    /* Event handlers */
    const createMember = async() => {
      modalData.value = null;

      openModal(true);
    };
    const editMember = async(member, event = null) => {
      event?.stopPropagation();

      openModal(true, member);
    };
    const deleteMember = async(member, event = null) => {
      event?.stopPropagation();

      const alert = await alertController
          .create({
            header: t('staff.alertRemoveStaffHeader'),
            message: t('staff.removeStaffMessage', { staff: `${member.fname} ${member.lname}` }),
            mode: 'ios',
            buttons: [
              {
                text: t('disagree'),
                role: 'cancel',
              },
              {
                text: t('agree'),
                handler: async() => {
                  try {
                    await store.dispatch('owner/deleteStaff', member.id);
                  }catch(errors) {
                    showErrorToast(
                        null,
                        {
                          pushNotificationPermission: t('generalAlertError'),
                        });
                  }
                },
              },
            ],
          });
      await alert.present();
    };
    const refresh = async(event) => {
      try {
        await store.dispatch('owner/getStaffInfo');
      }catch(error) {
        showErrorToast(
            null,
            {
              pushNotificationPermission: t('dataFetchingError'),
            });
      }finally {
        event.target.complete();
      }
    };

    return {
      /* Component properties */
      staff,
      isModalOpen,
      modalData,

      /* Event handlers */
      createMember,
      editMember,
      deleteMember,
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