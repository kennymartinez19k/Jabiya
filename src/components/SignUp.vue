<template>
  <BackButton />
  <div class="cont">
      
  </div>
</template>

<script>
import BackButton from "../components/Buttons/BackButton.vue";

export default {
  components: {
    BackButton,
  },
  data() {
    return {
        list: [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6]
    };
  },
  methods: {
    go() {
      this.$router.push({ name: "direct-access" }).catch(() => {});
    },
  },
};
</script>

<style scoped>

.green{
    background: green;
}
@media screen and (max-width: 639px) {
  .container {
    height: 55vh;
  }
}

ul{
    display: flex;
    list-style: none;
    flex-wrap: wrap;
    width: 200px;
}
li{
    border: 1px solid #ccc
}

</style>
