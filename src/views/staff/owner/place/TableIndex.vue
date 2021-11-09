<template>
  <ion-page>
    <ion-content scrollY="false">
      <div class="h-full flex flex-col justify-between">
        <div>
          <TheOwnerSegmentNavigation/>

          <div class="flex flex-col items-center">
            <div class="mb-2 secondary-heading text-center">{{ $t('addTableText') }}</div>
            <Table/>
          </div>

          <div class="px-4">
            <TableEdit
                :tables="tables"
                @open-table-edit-modal="showTableModal"
            />

            <div
                class="flex justify-between items-center mt-6"
            >
              <ion-button
                  fill="clear"
                  class="reset-button-size"
                  @click="addSection"
              >
                <ion-icon
                    slot="icon-only"
                    :icon="addCircle"
                    class="active-status-text-color"
                ></ion-icon>
              </ion-button>
              <div>
                <h1 class="text-lg primary-text-color">
                  {{
                    `${$t('add')}${activeSection !== 1 ? `/${$t('update')}` : ''} ${$t('sectionEdit').toLowerCase()}`
                  }}
                </h1>
              </div>
              <div
                  v-show="activeSection !== 1"
                  class="flex items-center"
              >
                <ion-button
                    fill="clear"
                    class="reset-button-size edit-button"
                    @click="editSection"
                >
                  <ion-icon
                      slot="icon-only"
                      :icon="create"
                      class="text-blue flex"
                  ></ion-icon>
                </ion-button>
                <ion-button
                    fill="clear"
                    class="reset-button-size"
                    @click="removeSection"
                >
                  <ion-icon
                      slot="icon-only"
                      :icon="removeCircle"
                      class="text-danger"
                  ></ion-icon>
                </ion-button>
              </div>
              <div v-show="activeSection === 1">
              </div>
            </div>

            <div class="flex justify-center items-center flex-wrap mt-4 w-full">
              <ion-chip
                  :outline="true"
                  class="flex-shrink-0"
                  :class="activeSection === 1  ? 'section-active' : 'section-inactive'"
                  @click="changeSection(1)"
              >
                <ion-label class="uppercase">{{ $t('uncategorized', 2) }}</ion-label>
              </ion-chip>
              <ion-chip
                  v-for="section in tableSections"
                  :key="section.id"
                  :outline="true"
                  class="flex-shrink-0"
                  :class="activeSection === section.id ? 'section-active' : 'section-inactive'"
                  @click="changeSection(section.id)"
              >
                <ion-label class="uppercase">{{ section.name }}</ion-label>
              </ion-chip>
            </div>
          </div>

        </div>

        <div class="flex flex-col items-center">
          <ion-button
              expand="block"
              class="auth-button-size auth-button-border-radius uppercase button-text-white mt-8 mb-3 mx-auto w-5/6"
              @click="updateTables"
              :disabled="loading >= 0"
          >
            {{ loading === 0 ? `${$t('updating')}...` : $t('update') }}
          </ion-button>
          <ion-button
              expand="block"
              fill="clear"
              class="auth-button-size auth-button-border-radius uppercase button-text-black mb-4 mx-auto w-5/6"
              @click="resetTables"
              :disabled="loading >= 0"
          >
            {{ loading === 1 ? `${$t('resetting')}...` : $t('reset') }}
          </ion-button>
        </div>
      </div>

      <AppModal
          :is-open="isModalOpen"
          css-class="custom-edit-table-modal"
          :swipe-to-close="false"
          width="90%"
          @didDismiss="openModal(false);"
      >
        <TableEditModal
            v-if="visibleModal === 'table'"
            :table-prop="modalData"
            @dismiss="openModal(false)"
        />
        <SectionCreateEditModal
            v-if="visibleModal === 'section'"
            :section="modalData"
            @dismiss="openModal(false)"
        />
      </AppModal>
    </ion-content>
  </ion-page>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useStore }                                  from 'vuex';
import { useI18n }                                   from 'vue-i18n';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonChip,
  IonLabel,
  onIonViewWillLeave,
  onIonViewDidEnter, alertController,
}                                                    from '@ionic/vue';

import TheOwnerSegmentNavigation from '@/components/owner/TheOwnerSegmentNavigation';
import TableEdit                 from '@/components/owner/TableEdit';
import Table                     from '@/components/Table';
import AppModal                  from '@/components/AppModal';
import TableEditModal            from '@/components/owner/modals/TableEditModal';
import SectionCreateEditModal    from '@/components/owner/modals/SectionCreateEditModal';


import { useErrorHandling } from '@/composables/useErrorHandling';
import { useModal }         from '@/composables/useModal';

import { removeClonedTableElements } from '@/utils/helpers';

import {
  addCircle,
  create,
  removeCircle,
} from 'ionicons/icons';

export default defineComponent({
  name: "TableIndex",
  components: {
    IonPage,
    IonContent,
    IonButton,
    IonIcon,
    IonChip,
    IonLabel,
    TheOwnerSegmentNavigation,
    TableEdit,
    Table,
    AppModal,
    TableEditModal,
    SectionCreateEditModal,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const tables = computed(() => {
      return store.getters['owner/tables'].filter(table => !table.clone && table.section.id === activeSection.value);
    });
    const tableSections = computed(() => store.getters['owner/tableSections']);
    const loading = ref(-1);
    let outlet = null;
    const swiperHandler = ref({});
    const activeSection = ref(1);

    /* Composables */
    const { isModalOpen, modalData, visibleModal, openModal } = useModal();
    const { tryCatch } = useErrorHandling();
    const { t } = useI18n();

    /* Lifecycle hooks */
    onMounted(() => {
      outlet = document.getElementById('admin-outlet');

      swiperHandler.value = outlet.swipeHandler;
    });
    onIonViewDidEnter(() => {
      if(outlet) {
        outlet.swipeHandler = null;
      }
    });
    onIonViewWillLeave(() => {
      removeClonedTableElements();
      store.commit('owner/REMOVE_CLONED_TABLES');

      outlet.swipeHandler = swiperHandler.value;
    });

    /* Methods */
    /* Event handlers */
    const updateTables = async() => {
      loading.value = 0;

      await tryCatch(
          async() => {
            await store.dispatch(
                "owner/updateTables",
                tableSections.value.find(section => section.id === activeSection.value),
            );
          },
          'owner.updateTables',
      );

      loading.value = -1;
    };
    const resetTables = async() => {
      loading.value = 1;

      await tryCatch(
          async() => {
            await store.dispatch("owner/getTables");
          },
      );
      loading.value = -1;
    };
    const showTableModal = async(table) => {
      visibleModal.value = 'table';
      openModal(true, table);
    };
    const changeSection = async(section) => {
      activeSection.value = section;
    };
    const addSection = async() => {
      visibleModal.value = 'section';
      openModal(true);
    };
    const editSection = () => {
      visibleModal.value = 'section';
      openModal(true, tableSections.value.find(section => section.id === activeSection.value));
    };
    const removeSection = async() => {
      const alert = await alertController
          .create({
            header: t(
                'alertRemovingSectionHeader',
                { section: tableSections.value.find(section => section.id === activeSection.value).name },
            ),
            message: t('alertRemovingSectionMessage'),
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
                        await store.dispatch("owner/deleteTableSection", activeSection.value);

                        removeClonedTableElements();

                        activeSection.value = 1;
                      },
                      'owner.removeSection',
                  );
                },
              },
            ],
          });
      await alert.present();
    };

    return {
      /* Component properties */
      tables,
      tableSections,
      loading,
      isModalOpen,
      modalData,
      activeSection,
      visibleModal,

      /* Event handlers */
      updateTables,
      resetTables,
      showTableModal,
      openModal,
      changeSection,
      addSection,
      editSection,
      removeSection,

      /* Icons */
      addCircle,
      create,
      removeCircle,
    };
  },

});
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
}

.section-active {
  --color: white;
  background: var(--primary-button);
  font-weight: 500;
}

.section-inactive {
  --color: var(--primary-button);
  background: var(--show-paint);
  font-weight: 500;
}

.edit-button {
  margin-right: 0.5rem !important;
  margin-bottom: 2px !important;
}

h1 {
  font-weight: 500;
}
</style>