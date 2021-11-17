<template>
  <div class="uk-card uk-card-default uk-width-1-2@m container"> 
      <div class="uk-card-header" style="padding-top: 5px !important">
        <div class="uk-width-expand uk-flex uk-flex-center">
          <p class="uk-text-meta uk-margin-remove-top date">
            <time datetime="2016-04-01T19:00" class="uk-text-bold">{{date}}</time>
          </p>
        </div>
      </div>
  
      <div>
        <div
          v-for="load in userOrden"
          :key="load"
          class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
        >
          <div class="uk-text-left info-user">
            <p><strong> Estado: </strong><span>{{load.status}}</span></p>
            <p><strong>Cliente: </strong> <span>{{load.client}}</span></p>
            <p><strong>No. de load(es): </strong>{{load.numberOfOrden}}<span>2</span></p>
            <p><strong>Zona: </strong><span>{{load.zone}}</span></p>
          </div>
          <div class="btn">
            <div >
            <span>{{load.hour}}</span>
            <div style="margin-top: 1px">
              <font-awesome-icon class="icon-load" :style="[load.icon]" icon="truck-moving" />
            </div>
          </div>
            <button class="uk-button uk-button-purple" @click="load.action">{{load.btnAction}}</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    props:{
        userOrden: Array,
        date: String
    }

}
</script>

<style scoped>
.uk-card{
  padding: 20px 10px;
}
.uk-card-body{
  box-shadow: 0px 0.5px 1.2px;
  margin-bottom: 10px;
  align-items: center;
  padding: 16px 10px;
}
.container {
  padding: 5px 14px 5px;
  box-shadow: 0px 0px;
}
.uk-button {
  padding: 0px 5px !important;
  font-size: 12px;
}

.date {
  background: #2535ff21;
  color: #000;
  border-radius: 5px;
  padding: 1px 8px;
}
.icon-load {
  font-size: 20px;
  margin-bottom: 10px;
}
.btn{
  display: flex;
  flex-direction: column;
  justify-content: end;
  margin-left: 10px;
  min-width: 125px;

}
button{
  font-size: 9px !important;
}

</style>