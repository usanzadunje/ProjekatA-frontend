import { ref }                   from 'vue';
import { useI18n }               from 'vue-i18n';
import { actionSheetController } from '@ionic/vue';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { useToastNotifications } from '@/composables/useToastNotifications';

import { camera, image } from 'ionicons/icons';

export function usePhotos() {
    /* Component properties */
    const photo = ref('');
    /* Composables */
    const { showErrorToast } = useToastNotifications();
    const { t } = useI18n();

    /* Computed properties */
    //Returns error key name from backend


    /* Methods */
    const getBase64Image = async(sourceType = CameraSource.Camera) => {
        try {
            const image = await Camera.getPhoto({
                resultType: CameraResultType.DataUrl,
                source: sourceType,
                quality: 50,
            });

            photo.value = image.dataUrl;
        }catch(error) {
            photo.value = null;
        }
    };
    const selectImageSource = async() => {
        const buttons = [
            {
                text: 'Take Photo',
                icon: camera,
                handler: () => {
                    getBase64Image();
                },
            },
            {
                text: 'Choose From Gallery',
                icon: image,
                handler: () => {
                    getBase64Image(CameraSource.Photos);
                },
            },
        ];

        try {
            const actionSheet = await actionSheetController.create({
                header: 'Select image source',
                buttons,
            });

            await actionSheet.present();
        }catch(error) {
            showErrorToast(
                null,
                {
                    generalError: t('generalAlertError'),
                });
        }
    };

    return {
        /* Component properties  */
        photo,

        /* Methods */
        selectImageSource,
    };
}
