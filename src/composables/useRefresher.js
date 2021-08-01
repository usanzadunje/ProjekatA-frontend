// import { useToastNotifications } from '@/composables/useToastNotifications';
// import { useGeolocation }        from '@/composables/useGeolocation';
// import { useI18n }               from 'vue-i18n';
//
// export function useRefresher() {
//
//     /* Global properties */
//     const { t } = useI18n();
//
//     /* Methods */
//     const { showErrorToast } = useToastNotifications();
//     const { checkForLocationPermission, tryGettingLocation } = useGeolocation();
//     const refresh = async(event, promises) => {
//         await checkForLocationPermission();
//         await tryGettingLocation();
//         // Only after both cafe arrays have been updated then complete refresher
//         // Fetching 4 cafes in each category with new live data
//         Promise.all([
//             promises
//         ]).then((response) => {
//             return response;
//         }).catch(() => {
//             showErrorToast(
//                 null,
//                 {
//                     pushNotificationPermission: t('dataFetchingError'),
//                 });
//         });
//     };
//
//     return {
//         /* Methods */
//         refresh,
//     };
// }
