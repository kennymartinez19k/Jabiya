<template>
  <div class="container">
    <ul class="progressbar">
      <li
        class="stepOne"
        :class="{ active: 1  }"
        @click="setMethod(action)"
      >
        <span class="info"><font-awesome-icon icon="check" /></span>
        <div><img :src="require('../assets/' + action.img)" alt="" srcset="" /></div>
        <span>{{action.name}}</span>
        <div :class="{ disabled: step < 1 }"></div>
      </li>
     
      <li
        class="stepFour"
        @click="getShow('finish')"
      >
        <div class="info"><font-awesome-icon icon="check" /></div>
        <div><img src="../assets/check.png" alt="" srcset="" /></div>
        <span>Completado</span>
        <div :class="{ disabled: step < 2 }"></div>
      </li>
    </ul>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
 
  props: {
    step: Number,
    actions: Array,
    stepTrip: Number
  },

  computed: {
    ...mapGetters([
      'settings'
    ])
  },

  methods: {
    uploadTrip(){
      alert('s')
    },
    startTrip(){
      alert(2)
    },
    setMethod(val){
      val.step = true
       this.$emit("action", val.actionName);
    }
  },
};
</script>

<style scoped>
.container {
  width: 100%;
}
.disabled {
  position: absolute;
  width: 90px;
  height: 70px;
  top: 40px;
  left: 10px;
  background: #ffffffc4;
}
img {
  width: 45%;
}
.progressbar li {
  float: left;
  width: 30%;
  position: relative;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0px;
  margin: 0px auto;
  display: flex;
  justify-content: center;
}
.progressbar li:before {
  content: "";
  width: 30px;
  height: 30px;
}
.progressbar li .info {
  content: "";
  position: relative;
  z-index: 1;
  width: 30px;
  height: 30px;
  border: 2px solid #bebebe;
  display: block;
  margin: 0 auto 10px auto;
  border-radius: 50%;
  line-height: 27px;
  background: white;
  color: #bebebe;
  text-align: center;
  font-weight: bold;
}



.progressbar li:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 3px;
  background: #979797;
  top: 15px;
  left: -50%;
}
.progressbar li:first-child:after {
  content: none;
}
.progressbar li.active + li:after {
  background: #3aac5d;
}
.active .info {
  border-color: #3aac5d !important;
  background: #3aac5d !important;
  color: white !important;
}
</style>
