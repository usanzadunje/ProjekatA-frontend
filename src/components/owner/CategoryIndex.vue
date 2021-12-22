<template>
  <div>
    <div
        class="xs:px-6"
        v-if="categories.length > 0"
    >
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
              <div class="flex items-center">
                <ion-icon
                    :icon="categoryIcons[category.icon]"
                    class="text-2xl text-gray-500"
                ></ion-icon>
                <span class="break-all ml-4">{{ category.name }}</span>
              </div>
              <div class="flex-shrink-0">
                <ion-icon
                    :icon="createOutline"
                    class="text-2xl text-blue"
                ></ion-icon>
                <ion-icon
                    :icon="trashOutline"
                    class="text-2xl text-danger ml-2"
                    @click="showAlert(category, false, $event)"
                ></ion-icon>
              </div>
            </div>
          </ion-item>
          <ion-item-options
              side="end"
              :class="{ 'rounded-tl-3xl	': index === 0, 'rounded-bl-3xl	': index === categories.length - 1 }"
              @ionSwipe="showAlert(category, true, $event)">
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
    </div>
    <div
        v-else
        class="w-full h-full flex flex-col items-start justify-center mt-4 px-6"
    >
      <AddEntriesPlaceholderImage/>

      <div class="flex flex-col items-center mt-2">
        <p class="text-center placeholder-heading-big primary-text-color">
          {{ $t('noCategoriesHeading1') }}
        </p>
        <p class="text-center placeholder-heading-small primary-text-color break-words">
          {{ $t('noCategoriesHeading2') }}
        </p>

        <ion-button
            class="user-selected-button-background mt-2"
            @click="createCategory"
        >
          {{ $t('add') }}
        </ion-button>
      </div>
    </div>

    <AppModal
        :is-open="isModalOpen"
        css-class="custom-category-modal"
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
import CategoryCreateEditModal    from '@/components/owner/modals/CategoryCreateEditModal';
import AddEntriesPlaceholderImage from '@/components/images/AddEntriesPlaceholderImage';

import { useModal }         from '@/composables/useModal';
import { useSlidingItem }   from '@/composables/useSlidingItem';
import { useErrorHandling } from '@/composables/useErrorHandling';
import { shrink, swipe }    from '@/composables/useAnimations';
import { useIcons }         from '@/composables/useIcons';

import {
  createOutline,
  trashOutline,
} from 'ionicons/icons';

import { Haptics, ImpactStyle } from '@capacitor/haptics';

export default defineComponent({
  name: 'CategoryIndex',
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
    AddEntriesPlaceholderImage,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const categories = computed(() => store.getters['owner/createdCategories']);

    /* Lifecycle hooks */
    /* Composables */
    const { slidingItem, closeOpenItems } = useSlidingItem();
    const { t } = useI18n();
    const { isModalOpen, modalData, openModal } = useModal();
    const { tryCatch } = useErrorHandling();
    const { fullSwipeLeft } = swipe();
    const { shrinkToMiddle } = shrink();
    const { categoryIcons } = useIcons();

    /* Methods */
    const removeCategory = async(id) => {
      await tryCatch(
          async() => {
            await store.dispatch("owner/deleteCategory", id);
          },
          {
            successMessageKey: 'owner.removeCategory',
          },
      );
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
            buttons: [
              {
                text: t('disagree'),
                role: 'cancel',
              },
              {
                text: t('agree'),
                handler: () => {
                  removeCategory(category.id);
                  if(swiping) {
                    fullSwipeLeft(event.target.parentElement.firstChild);
                    shrinkToMiddle(event.target.parentElement);
                  }else {
                    fullSwipeLeft(event.target.parentElement.parentElement.parentElement.firstChild);
                    shrinkToMiddle(event.target.parentElement.parentElement.parentElement);
                  }
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
      categoryIcons,
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
}

ion-item-option {
  --border-style: none;
  --background: #e01b43;
  background: #e01b43;
}

ion-item-option:active {
  background: #d95c75;
}

</style>