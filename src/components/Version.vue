<template>
<div class="uk-container">

  <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-text-left uk-margin-top">
    <h3 class="uk-card-title">Flai App <span>&reg;</span></h3>
    <p>Numero de version: <span>{{version}} </span></p>
    <p>Fecha: <span>{{date}} </span></p>
</div>
</div>

</template>

<script>
export default {
    name: 'Version',
    data() {
        return {
            date: '18/02/2022',
            version: '1.0.0',
        }
    },

}
</script>

<style>

</style>