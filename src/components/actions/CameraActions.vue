<template>
  <div>

  </div>
</template>

<script>
import { Camera, CameraResultType } from '@capacitor/camera'
export default {
    mounted () {
        this.getPickImages()
    },
    methods:{
         async getCam () {
        this.cont = this.cont + 1;
           this.getCheckPermissions()
        let imagi = []
          imagi.push(await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            limit: 3,
            resultType: CameraResultType.Uri
         }))
         
          var imageUrl = imagi[0].webPath;
          this.imagiElement[this.cont] = imageUrl;
          console.log(imagi, 'imagi.webPath')
        if (imagi === 1) {
        // this.getPickImages()
        }          
    
          
      },

      async getPickImages () {
         let imagi = []
         imagi.push(await Camera.pickImages({
             quality: 90,
            allowEditing: true,
            correctOrientation: true,
            width: '25%',
            limit: null,
            resultType: CameraResultType.Uri
           }))
      },

      async getCheckPermissions() {
        const permissions = Camera.checkPermissions('prompt-with-rationale')
        console.log(permissions, 'ddddddddddppppp')
        this.getRequestPermissions()
      },

      async getRequestPermissions() {
        try {
         const permissions1 = Camera.requestPermissions({permissions:['camera' | 'photos']})
         console.log(permissions1, 'ddddddddddppppp')
        } catch (error) {
          console.log(error, 'aaaaaaaaaaaa')
        }
      
      }

    }
}
</script>

<style>

</style>