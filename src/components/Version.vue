<template>
<div class="uk-container">

  <div class="uk-card uk-card-default uk-card-body uk-text-left uk-margin-top">
    <h3 class="uk-card-title title">Flai App <span>&reg;</span></h3>
    <p class="item"><span class="uk-text-bold">Versión:</span> <span>{{version}} </span></p>
    <p class="item"><span class="uk-text-bold">Fecha:</span> <span>{{date}} </span></p>
    <p class="item"><span class="uk-text-bold">Autores:</span> <span>{{authors}} </span></p>
    <p class="item"><span class="uk-text-bold">Copyright:</span> <span>{{copyright}} &copy; </span></p>
</div>
</div>

</template>

<script>
export default {
    name: 'Version',
    alias: 'Version',
    data() {
        return {
            version: '1.0.8',
            date: 'Feb 20, 2022',
            authors: 'Wilson Soto, Kenny Martinez, Miguel Gonzalez',
            copyright: `Flai Logistics, 2022 `
        }
    },

}
</script>

<style scoped>
.uk-card{
    padding: 10px;
}
@media (min-width: 600px){
    .uk-card{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .title{
        width: 100%;
    }
    .item{
        width: 45%;
    }
}
</style>