<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>Tables of</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" class="ion-padding">
            <div v-if="!loading">
                <div v-for="table in cafe" :key="table.id">
                    {{ table }}
                </div>
            </div>
            <div v-else>
                Loading...
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
    import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle } from '@ionic/vue';
    import TableService                                             from '../services/TableService';
    //import { getError }                                             from '../utils/helpers';

    export default {
        name: "Table",
        components: {
            IonPage,
            IonHeader,
            IonToolbar,
            IonContent,
            IonTitle,
        },
        data() {
            return {
                cafe: {},
                loading: false,
            };
        },
        created() {
            this.loading = true;
            TableService.show(1, 2)
                        .then((response) => {
                            this.cafe = response.data;
                            this.loading = false;
                        })
                        .catch(error => {
                            console.log(error);
                            this.loading = false;
                        });
        },
    };
</script>