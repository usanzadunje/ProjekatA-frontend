<template>
  <div class="px-12">
    <div class="flex justify-end">
      <ion-button
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white"
          @click="createCategory"
      >
        {{ $t('create') }}
      </ion-button>
    </div>

    <ion-list class="rounded-2xl mt-4" lines="none">
      <ion-item-sliding
          ref="slidingItem"
          v-for="(category, index) in categories"
          :key="category.id"
          class="ion-no-padding"
          :class="{ 'item-border': index !== categories.length - 1 }"
          @click="closeOpenItems"
      >
        <ion-item class="ion-no-padding ion-no-margin" @click="editCategory(category)">
          <div class="px-4 flex justify-between items-center w-full">
            <span>{{ category.name }}</span>
            <div>
              <ion-icon
                  slot="icon-only"
                  :icon="createOutline"
                  class="text-2xl text-blue"
              ></ion-icon>
              <ion-icon
                  slot="icon-only"
                  :icon="trashOutline"
                  class="text-2xl text-danger ml-2"
                  @click="showAlert(category, false, $event)"
              ></ion-icon>
            </div>
          </div>
        </ion-item>
        <ion-item-options side="end" @ionSwipe="showAlert(category, true)">
          <ion-item-option type="button" :expandable="true" @click="showAlert(category, false, $event)">
            <ion-icon
                slot="icon-only"
                :icon="trashOutline"
                class="text-2xl"
            ></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>
    <AppModal
        :is-open="isModalOpen"
        css-class="custom-edit-staff-modal"
        :swipe-to-close="false"
        width="90%"
        @didDismiss="openModal(false);"
    >
      <CategoryCreateEditModal
          :category="modalData"
          @dismiss="openModal(false)"
      />
    </AppModal>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useStore }                  from 'vuex';
import { useI18n }                   from 'vue-i18n';
import {
  IonButton,
  IonList,
  IonItemSliding,
  IonItem,
  IonIcon,
  IonItemOptions,
  IonItemOption, alertController,
}                                    from '@ionic/vue';

import AppModal                   from '@/components/AppModal';
import CategoryCreateEditModal from '@/components/owner/modals/CategoryCreateEditModal';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useModal }              from '@/composables/useModal';

import {
  createOutline,
  trashOutline,
} from 'ionicons/icons';

import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useSlidingItem }       from '@/composables/useSlidingItem';

export default defineComponent({
  name: 'Categories',
  components: {
    IonButton,
    IonList,
    IonItemSliding,
    IonItem,
    IonIcon,
    IonItemOptions,
    IonItemOption,
    AppModal,
    CategoryCreateEditModal,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const categories = computed(() => store.getters['owner/createdCategories']);

    /* Composables */
    const { slidingItem, closeOpenItems } = useSlidingItem();
    /* Lifecycle hooks */
    const { t } = useI18n();
    const { showSuccessToast, showErrorToast } = useToastNotifications();
    const { isModalOpen, modalData, openModal } = useModal();

    /* Methods */
    const removeCategory = async(id) => {
      try {
        await store.dispatch("owner/deleteCategory", id);

        showSuccessToast(t('owner.removeCategory'));
      }catch(errors) {
        await showErrorToast(errors);
      }
    };
    /* Event handlers */
    const createCategory = async() => {
      modalData.value = null;

      openModal(true);
    };
    const editCategory = async(category, event = null) => {
      event?.stopPropagation();

      openModal(true, category);
    };
    const showAlert = async(category, swiping = null, event = null) => {
      event?.stopPropagation();

      if(swiping) {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      }

      const alert = await alertController
          .create({
            header: t('alertRemovingCategoryHeader', { category: category.name }),
            message: t('alertRemovingCategoryMessage'),
            mode: 'ios',
            buttons: [
              {
                text: t('disagree'),
                role: 'cancel',
              },
              {
                text: t('agree'),
                handler: () => {
                  removeCategory(category.id);
                },
              },
            ],
          });
      await alert.present();
    };

    return {
      /* Component properties */
      categories,
      isModalOpen,
      modalData,
      slidingItem,

      /* Event handlers */
      openModal,
      createCategory,
      editCategory,
      showAlert,
      closeOpenItems,

      /* Icons */
      createOutline,
      trashOutline,
    };
  },
});
</script>

<style scoped>
ion-list {
  background: #F3F4F6;
}

ion-list.list-md {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

ion-item {
  --background: #F3F4F6;
  --inner-padding-end: 0;
}


ion-item-options {
  --border-style: none;
  background-color: #E01B43 !important;
  border-top-right-radius: 15px !important;
  border-bottom-right-radius: 15px !important;
}

ion-item-option {
  --border-style: none;
  --background: #e01b43;
}

ion-item-option:active {
  --background: #E01B43;
}
</style>