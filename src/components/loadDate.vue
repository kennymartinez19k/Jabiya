<template>
  <div class="uk-card uk-card-default uk-width-1-2@m container"
  > 
      <div class="uk-card-header" style="padding: 5px 30px !important">
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
          :class="{
            'asigned':load.status == 'Asignada', 'delivered': load.status == 'Entregada',
            'onWay':load.status == 'En Ruta', 'dispatch': load.status == 'Despacho Aprobado'
          }"
        >
          <div 
            class="uk-text-left info-user" 
            >
            
            <p ><strong> Estado: </strong><span>{{load.status}}</span></p>
            <p><strong>Cliente: </strong> <span>{{load.client}}</span></p>
            <p><strong>No. de Orden(es): </strong>{{load.numberOfOrden}}<span>2</span></p>
            <p><strong>Zona: </strong><span>{{load.zone}}</span></p>
          </div>
          <div class="btn">
            <div >
            <span v-if="load.status != 'Entregada'">{{load.hour}}</span>
            <span v-else><img class="check-load" src="data:image/png;base64,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" alt=""></span>
            <div style="margin-top: 1px">
              <img v-if="load.status == 'Asignada'" src="../assets/truckGreen.png" class="icon-load" alt="">
              <img v-if="load.status == 'Entregada'" src="../assets/truckDefault.png" class="icon-load" alt="">
              <img v-if="load.status == 'En Ruta'" src="../assets/truckBlack.png" class="icon-load" alt="">
              <img v-if="load.status == 'Despacho Aprobado'" src="../assets/truckOrange.png" class="icon-load" alt="">
              
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
    },
    methods: {
      setload (valueOrder) {
      this.$store.commit('setloadStore', valueOrder)
      console.log(valueOrder, 'valueo')
       this.$router.push({ name: "orders" }).catch(() => {})

      }
    },

}
</script>

<style scoped>
p{
  margin: 7px 0px !important
}
.uk-card{
  padding: 20px 10px;
}
.uk-card-body{
      /* box-shadow: 0px 0px 1.5px; */
    border-radius: 2px;
    margin-bottom: 15px;
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
  width: 60px;
  margin-bottom: 5px;
}
.check-load{
      position: absolute;
    z-index: 1;
    right: 69px;
    width: 24px;
    top: 34px;
    color: #00b200;
    font-size: 22.5px;;
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
.asigned{
    color: rgb(73 73 73)
}
.asigned button{
    color: white;
    background: #008700 !important;
    border: 1px solid #009b08;
    animation: mymove 1.5s infinite;
    font-weight: 700;
    box-shadow: 0px 0.5px 2px;
    
     -webkit-border-radius: 10px;
  border-radius: 10px;
  display: inline-block;
  padding: 5px 10px;
  -webkit-animation: glowing 800ms infinite

}
body {
  background: black;
}

@-webkit-keyframes glowing {
  0% { background-color: transparent; -webkit-box-shadow: 0 0 1px #146d02; }
  50% { background-color: transparent; -webkit-box-shadow: 0 0 8px #025a11; }
  100% { background-color: transparent; -webkit-box-shadow: 0 0 0px #02691c; }
}

.delivered{
    color: rgb(130, 127, 127)!important
}
.delivered button{
    box-shadow: 0px 0.5px 3px #424242;
    background: #ffffff;
    color: #252525;
}
.onWay{
    color: rgb(73 73 73)
  }

.onWay button{
    background: #fff;
    color: #238900;
    box-shadow: 0px 0.5px 3px #236f00;

}

.dispatch{
color: #000
}
.dispatch button{
        box-shadow: 0px 0.5px 3px #c58002;
    color: #c58002;
    background: transparent;
}

a {
  text-decoration:none;
  color:#FFF;
}
.rainbow-button {
  width:calc(20vw + 6px);
  height:calc(8vw + 6px);
  background-image: linear-gradient(90deg, #00C0FF 0%, #FFCF00 49%, #FC4F4F 80%, #00C0FF 100%);
  border-radius:5px;
  display:flex;
  align-items:center;
  justify-content:center;
  text-transform:uppercase;
  font-size:3vw;
  font-weight:bold;
}
.rainbow-button:after {
  content:attr(alt);
  width:20vw;
  height:8vw;
  background-color:#191919;
  display:flex;
  align-items:center;
  justify-content:center;
}
.rainbow-button:hover {
  animation:slidebg 2s linear infinite;
}

@keyframes slidebg {
  to {
    background-position:20vw;
  }
}
</style>