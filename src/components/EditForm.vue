<template>
  <form @submit.prevent="editUser">
    <ion-grid>
      <ion-row color="primary" class="justify-content-center">
        <ion-col class="align-self-center" size-md="6" size-lg="5" size-xs="12">
          <div class="padding">
            <ion-item>
              <ion-label position="floating">First Name</ion-label>
              <ion-input v-model="fname" name="fname" type="text" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Last Name</ion-label>
              <ion-input v-model="lname" name="lname" type="text" required></ion-input>
            </ion-item>
            <ion-item class="ion-padding-top">
              <ion-label>Birthday</ion-label>
              <ion-datetime
                  :value="bday"
                  @ionChange="bday = $event.target.value.substring(0,10)"
              ></ion-datetime>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Phone</ion-label>
              <ion-input v-model="phone" name="phone" type="tel" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Username</ion-label>
              <ion-input v-model="username" name="username" type="text" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Email</ion-label>
              <ion-input v-model="email" name="email" type="email" required></ion-input>
            </ion-item>
          </div>
          <div class="padding">
            <ion-button size="large" type="submit" expand="block">Update
            </ion-button>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
    <FlashMessage :error="error"/>
  </form>
</template>

<script>
import { IonGrid, IonCol, IonRow, IonItem, IonInput, IonButton, IonLabel, IonDatetime } from "@ionic/vue";
import AuthService                                                                      from '@/services/AuthService';
import { getError }                                                                     from '@/utils/helpers';
import FlashMessage
                                                                                        from '@/components/FlashMessage';
import { mapGetters }                                                                   from 'vuex';

export default {
  name: "EditForm",
  components: {
    IonGrid,
    IonCol,
    IonRow,
    IonItem,
    IonInput,
    IonButton,
    IonLabel,
    IonDatetime,
    FlashMessage,
  },
  data() {
    return {
      fname: null,
      lname: null,
      bday: null,
      phone: null,
      username: null,
      email: null,
      error: null,
    };
  },
  methods: {
    editUser() {
      const payload = {
        fname: this.fname,
        lname: this.lname,
        bday: this.bday,
        phone: this.phone,
        username: this.username,
        email: this.email,
      };
      AuthService.updateUser(payload)
                 .then(() => this.$store.dispatch('auth/getAuthUser'))
                 .then(() => this.$router.push({ name: 'dashboard' }))
                 .catch((error) => {
                   this.error = getError(error);
                 });
    },
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
  },
  beforeMount() {
    let fullName = this.authUser.full_name.split(' ');
    this.fname = fullName[0];
    this.lname = fullName[1];
    this.bday = this.authUser.bday;
    this.phone = this.authUser.phone;
    this.username = this.authUser.username;
    this.email = this.authUser.email;
  },
};
</script>