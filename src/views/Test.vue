<template>
  <ion-page>
    <ion-content>
      <ion-accordion-group>
        <ion-accordion value="colors">
          <ion-item slot="header">
            <ion-label>Colors</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item
                v-for="(product, index) in products"
                :key="index"
            >
              <ion-label>{{ product }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="numbers">
          <ion-item slot="header">
            <ion-label>Numbers</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item>
              <ion-label>1</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>2</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>3</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>

      <ion-button @click="add">ADD</ion-button>
      <ion-input
          type="color"
      ></ion-input>
    </ion-content>
  </ion-page>
</template>

<script>
import { ref } from 'vue';
import {
  IonContent,
  IonPage,
  IonInput,
  IonAccordionGroup,
  IonAccordion,
}              from '@ionic/vue';

export default {
  name: 'TestS',
  components: {
    IonContent,
    IonPage,
    IonInput,
    IonAccordionGroup,
    IonAccordion,
  },
  setup() {
    const products = ref([
      'FuEzI',
      'aZpLZ',
      'boUhy',
      'bVsNy',
      'YdMPB',
      'KCWpq',
      'vtBBp',
      'XWCsZ',
      'uPQjM',
      'oRiER',
    ]);

    const add = () => {
      products.value.pop();
    };

    return {
      products,
      add,
    };
  },
};
</script>
<style scoped>

</style>