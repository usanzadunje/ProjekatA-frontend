<template>
  <ion-page>
    <div
        id="uh"
        class="pull-transition"
    >
      <UserHeader
          :hasSearchFilter="false"
          :mainHeading="'Pretraga'"
          :notificationIcon="notificationsReceivedOutline"
          @searchFilterChanged="searchFilterChanged"
      >
        <SlidingFilter :hasTitle="true" @sortHasChanged="sortHasChanged"/>
      </UserHeader>
    </div>

    <ion-content ref="content" :scroll-events="true" class="ion-padding" @ionScrollStart="pullAnimation" @ionScroll="pullAnimation">
      <InfiniteScroll :cafeSearchString="cafeSearchString" :sortBy="sortBy" @scrollToTop="scrollToTop"/>
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
    const cafeSearchString = ref('');
    const sortBy = ref('');
    const content = ref(null);
    let isHeaderVisible = ref(true);

    /* Event handlers */
    const searchFilterChanged = (searchInputValue) => {
      cafeSearchString.value = searchInputValue;
    };
    const sortHasChanged = (sortValue) => {
      sortBy.value = sortValue;
    };
    const pullAnimation = () => {
      if(!isHeaderVisible.value) {
        document.querySelector('#uh').classList.remove('add-margin');
        document.querySelector('#uh').classList.add('remove-margin');
      }else {
        document.querySelector('#uh').classList.remove('remove-margin');
        document.querySelector('#uh').classList.add('add-margin');
      }
      isHeaderVisible.value = !isHeaderVisible.value;
    };

    /* Methods */
    // When search term is changed infinity scroll component changes data and
    // this function scrolls user back to top to see new filtered data from start
    const scrollToTop = async() => {
      content.value?.$el.scrollToTop(700);
    };

    const logout = () => store.dispatch('auth/logout');

    return {
      /* Properties */
      cafeSearchString,
      sortBy,
      content,

      /* Event handlers */
      searchFilterChanged,
      sortHasChanged,
      pullAnimation,

      /* Methods */
      logout,
      scrollToTop,

      /* Icons */
      notificationsOutline,
      notificationsReceivedOutline,
    };
  },
});
</script>
<style scoped>
.add-margin {
  margin-top: -266px !important;
}

.remove-margin {
  margin-top: 0 !important;
}

.pull-transition {
  transition: all 0.5s ease-in;
}
</style>