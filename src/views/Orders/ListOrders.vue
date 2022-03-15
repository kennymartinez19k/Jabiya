<template>
  <div class="uk-card container">
      <div class="menu">
        
      </div>
      <div class="section">
          <div class="item" v-for="order in orders" :key="order">
              <div class="icon">
                <font-awesome-icon icon="pen" class="icon-action"/>
                <font-awesome-icon icon="trash-alt" class="icon-action"/>
              </div>
              <span style="font-size: 10px">Creada</span>
              <div class="info">
                <p><strong> Nombre:</strong> Wilson company</p>
                <div class="uk-flex uk-flex-wrap">
                  <p><strong>No. de orden:</strong> 43</p>
                  <p><strong>Shipper:</strong> Jabiya</p>
                </div>
                <div class="uk-flex uk-flex-between uk-flex-wrap" style="align-items: center">
                    <p><strong> Fecha de Espera:</strong> 2022/03/10 17:02</p>
                </div>
              </div>
             
          </div>
      </div>
  </div>
</template>

<script>
export default {
    alias: 'Lista de Ordenes',
    data() {
        return {
            orders: []
        }
    },
    async mounted() {
        this.orders = await this.$services.manageOrders.getOrders()
        console.log(this.orders)
    },
}
</script>

<style scoped>
p{
    margin: 2px 10px 2px 0px;
}
.container{
    padding: 15px;
}
.item{
    margin: 10px 0px;
    border-radius: 10px;
    box-shadow: 0px 0px 1px #000;
    padding: 10px;
    text-align: initial;
    position: relative;
}
.icon{
    display: flex;
    width: 58px;
    position: fixed;
    right: 10px;
}
.icon-action{
    margin-left:  10px;
    font-size: 15px;
}
.info{
    margin-top: 15px;
}
</style>