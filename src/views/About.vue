<template>
  <article>
    <div class="root">
     <div class="container">
          <ul class="progressbar">
            <li class="active">
              <div class="info active"><font-awesome-icon icon="check" /></div>
              Step 1
            </li>
            <li>
              <div class="info active"><font-awesome-icon icon="check" /></div>
              Step 2
            </li>
            <li>
              <div class="info active"><font-awesome-icon icon="check" /></div>
              Step 3
            </li>
            <li>
              <div class="info active"><font-awesome-icon icon="check" /></div>
              Step 4
            </li>
            <li>
              <div class="info active"><font-awesome-icon icon="check" /></div>
              Step 5
            </li>
          </ul>
      </div>
  </div>
  </article>
</template>

<script>
import moment from 'moment'
export default {
  data: () => {
    return {
      currentPage: 1,
      maxPerPage: 1,
      totalResults: 100,
      showloader: false,
      date: new Date(),
      dateAvalaible: [],
      articles: []
    };
  },
  methods: {
    scrollTrigger() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach( async (entry) => {
          if (entry.intersectionRatio > 0) {
            var contDate = this.date.setDate(this.date.getDate() - 1);
            var date = moment(contDate).format('MM/DD/YYYY')
            console.log(date)
            const result = await this.$services.loadsServices.getLoadsbyDate(date)
            console.log(result)
            if(result.length == 0){
                this.scrollTrigger()
            }else{
                this.dateAvalaible = 1
            }
            result.forEach(x => this.articles.push(x))
            this.showloader = true;
            setTimeout(() => {
              this.currentPage += 1;
              this.showloader = false;
            }, 1000); // simulate Ajax-Call ;-)
          }
            console.log(entry)

        });
      });
      observer.observe(this.$refs.infinitescrolltrigger);
    },
  },
  mounted() {
    this.scrollTrigger();
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
  width: 100%;
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
  width: 30px;
  height: 30px;
  border: 2px solid #bebebe;
  display: block;
  margin: 0 5px;
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
    width: 2%;
    height: 57px;
    background: #979797;
    top: -28px;
    left: 3%;
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
