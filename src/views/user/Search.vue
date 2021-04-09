<template>
  <ion-page>
    <UserHeader
        :hasSearchFilter="false"
        :mainHeading="'Pretraga'"
        :notificationIcon="notificationsReceivedOutline"
        @searchFilterChanged="searchFilterChanged"
    >
      <SlidingFilter :hasTitle="true"/>
    </UserHeader>

    <ion-content ref="content" class="ion-padding">
      <InfiniteScroll :cafeSearchString="cafeSearchString" @scrollToTop="scrollToTop"/>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref }                               from 'vue';
import {
  IonContent,
  IonPage,
}                                                             from '@ionic/vue';
import { mapGetters, useStore }                               from 'vuex';
import UserHeader                                             from '@/components/user/UserHeader';
import SlidingFilter                                          from '@/components/user/SlidingFilter';
import InfiniteScroll                                         from '@/components/InfiniteScroll';
import { notificationsOutline, notificationsReceivedOutline } from '@/assets/icons';


export default defineComponent({
  name: 'Search',
  components: {
    IonContent,
    IonPage,
    UserHeader,
    SlidingFilter,
    InfiniteScroll,
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
  },
  setup() {
    /* Global properties and methods */
    const store = useStore();

    /* Properties */
    const cafeSearchString = ref(null);
    const content = ref(null);

    /* Methods */
    const searchFilterChanged = (searchInputValue) => {
      cafeSearchString.value = searchInputValue;
    };

    // When search term is changed infinity scroll component changes data and
    // this function scrolls user back to top to see new filtered data from start
    const scrollToTop = async() => {
      content.value?.$el.scrollToTop(700);
    };

    const logout = () => store.dispatch('auth/logout');

    return {
      /* Properties */
      cafeSearchString,
      content,

      /* Methods */
      logout,
      searchFilterChanged,
      scrollToTop,

      /* Icons */
      notificationsOutline,
      notificationsReceivedOutline,
    };
  },
});
</script>