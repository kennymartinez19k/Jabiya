<template>
  <div class="container">
    <ul class="progressbar">
      <li
        class="stepOne"
        :class="{ active: resultScan !== null }"
        @click="getShow('scan')"
      >
        <div class="info active"><font-awesome-icon icon="check" /></div>
        <div><img src="../assets/img/qr.png" alt="" srcset="" /></div>
      </li>
      <li
        class="stepTwo"
        :class="{
          'uk-disabled': step !== 1,
          active: imagiElement.length !== 0 && imagiElement.length === 3,
        }"
        @click="getShow('camera')"
      >
        <div class="info active"><font-awesome-icon icon="check" /></div>
        <div><img src="../assets/img/cam.png" alt="" srcset="" /></div>
        <div :class="{ disabled: step < 1 }"></div>
      </li>
      <li
        class="stepThree"
        :class="{ 'uk-disabled': step !== 2, active: digitalFirm !== null }"
        @click="getShow('firm')"
      >
        <div class="info"><font-awesome-icon icon="check" /></div>
        <div><img src="../assets/img/firma.png" alt="" srcset="" /></div>
        <div :class="{ disabled: step < 2 }"></div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    step: Number,
    exception: Boolean,
    resultScan: String,
    imagiElement: Array,
    digitalFirm: String,
  },
  data() {
    return {
      stepCurrent: 0,
    };
  },
  methods: {
    getShow(value) {
      this.$emit("action", value);
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
}
.disabled {
  position: absolute;
  width: 76px;
  height: 60px;
  top: 40px;
  left: 22px;
  background: #ffffffc4;
}
img {
  width: 50%;
}
.progressbar li {
  float: left;
  width: 33%;
  position: relative;
  text-align: center;
}
.stepTwo {
  float: left;
  width: 25% !important;
  position: relative;
  text-align: center;
}
ul {
  list-style: none;
  padding: 0px;
}
.progressbar li:before {
  content: "";
  width: 30px;
  height: 30px;
}
.progressbar li .info {
  content: "";
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
  z-index: -1;
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
