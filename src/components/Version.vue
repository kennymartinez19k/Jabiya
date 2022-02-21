<template>
<div class="uk-container">

  <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-text-left uk-margin-top">
    <h3 class="uk-card-title">Flai App <span>&reg;</span></h3>
    <p><span class="uk-text-bold">Versión:</span> <span>{{version}} </span></p>
    <p><span class="uk-text-bold">Fecha:</span> <span>{{date}} </span></p>
    <p><span class="uk-text-bold">Autores:</span> <span>{{authors}} </span></p>
    <p><span class="uk-text-bold">Copyright:</span> <span>{{copyright}} &copy; </span></p>
</div>
</div>

</template>

<script>
export default {
    name: 'Version',
    data() {
        return {
            version: '1.0.0',
            date: 'Feb 20, 2022',
            authors: 'Wilson Soto, Kenny Martinez, Miguel Gonzalez',
            copyright: `Flai Logistics, 2022 `
        }
    },

}
</script>

<style scoped>
.uk-card{
    padding: 10px
}
</style>