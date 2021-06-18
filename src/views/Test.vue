<template>
  <ion-page>
    <ion-content :fullscreen="true" :scroll-events="true">


    </ion-content>
  </ion-page>
</template>
<script>

import { IonContent, IonPage } from '@ionic/vue';


import { Http } from '@capacitor-community/http';
import axios    from "axios";


export default {
  components: {
    IonContent,
    IonPage,
  },
  setup() {

    Http.get({
      url: 'https://projekata-hgego.ondigitalocean.app/api/cafes',
    }).then((response) => {
      console.log(response.data);
    });

    axios.get(
        `https://projekata-hgego.ondigitalocean.app/api/cafes`,
    ).then((response) => {
      console.log(response.data);
    });


    return {};
  },
};
</script>
<style scoped>

</style>