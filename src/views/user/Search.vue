<template>
  <ion-page>
    <div
        id="header"
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

    <ion-content ref="content" :scroll-events="true" @ionScroll="pullAnimation" class="ion-padding">
      <InfiniteScroll :cafeSearchString="cafeSearchString" :sortBy="sortBy" @scrollToTop="scrollToTop"/>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';

import { useRoute } from 'vue-router';

import {
  IonContent,
  IonPage,
}
  from '@ionic/vue';

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
  setup() {
    /* Global properties and methods */
    const route = useRoute();

    /* Properties */
    const cafeSearchString = ref('');
    const sortBy = ref('');
    const content = ref(null);
    let scrollTopOffset = ref(0);

    /* Lifecycle hooks */
    console.log(route.query.searchTerm);

    /* Event handlers */
    const searchFilterChanged = (searchInputValue) => {
      cafeSearchString.value = searchInputValue;
    };
    const sortHasChanged = (sortValue) => {
      sortBy.value = sortValue;
    };
    const pullAnimation = async() => {
      let scrollElement = await content.value?.$el.getScrollElement();

      if(scrollElement.scrollTop > scrollTopOffset.value) {
        document.querySelector('#header').classList.add('hide-header');
      }else {
        document.querySelector('#header').classList.remove('hide-header');
      }

      scrollTopOffset.value = scrollElement.scrollTop;
    };

    /* Methods */
    // When search term is changed infinity scroll component changes data and
    // this function scrolls user back to top to see new filtered data from start
    const scrollToTop = () => {
      content.value?.$el.scrollToTop(500);
    };

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
      scrollToTop,

      /* Icons */
      notificationsOutline,
      notificationsReceivedOutline,
    };
  },
});
</script>
<style scoped>
.hide-header {
  margin-top: -266px !important;
}

.pull-transition {
  transition: all 0.5s ease-in;
}
</style>