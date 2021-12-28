<template>
  <article>
    <section v-for="(n, index) in dateAvalaible" :key="index">
        <span>{{date}}</span>
        <div v-for="article in articles" style="height: 200px" :key="article">
            <h5>{{article.shipper}}</h5>
            <h6>{{article.loadNumber}}</h6>
            <p>{{article.loadId}}
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
            </p>
        </div>
    </section>
    <footer>
      <div ref="infinitescrolltrigger" id="scoll-trigger"></div>
      <div class="circle-loader" v-if="showloader"></div>
    </footer>
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
article {
  margin: 0 auto;
  width: 400px;
}
article footer {
  position: relative;
  width: 400px;
  height: 100px;
}
article footer .circle-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-top: 5px solid #fff;
  animation: animate 1.5s infinite linear;
}
article footer #scroll-trigger {
  height: 50px;
}
article section {
  width: 400px;
  margin-bottom: 20px;
  border-radius: 10px;
  background-color: #efefef;
  color: #04525a;
  overflow: hidden;
}
article section p {
  margin: 0;
  padding: 10px 20px;
}
@keyframes animate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
