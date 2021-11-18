<template>
  <div class="uk-container">
      <div class="uk-flex ">
          <div class="uk-card uk-card-default uk-card-hover uk-card-body">
            <h3 class="uk-card-title">Acciones</h3>
           <div class="uk-flex">
                <div class="uk-flex uk-flex-column">
                 <font-awesome-icon class=""  icon="circle" />
                <img src="../assets/img/qr.png" class="qr" alt="">
            </div>
               <div class="uk-flex uk-flex-column">
                 <font-awesome-icon class=""  icon="circle" />
                <img src="../assets/img/qr.png" class="qr" alt="">
            </div>
               <div class="uk-flex uk-flex-column">
                 <font-awesome-icon class=""  icon="circle" />
                <img src="../assets/img/qr.png" class="qr" alt="">
            </div>
           </div>
           
           </div>
      </div>
  </div>
</template>

<script>
import {} from '../assets/img/qr.png'
export default {
    name: 'DeliveryActions'

}
</script>

<style>
.qr {
    width: 60%; 
}

</style>