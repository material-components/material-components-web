
<template>
<label class="mdc-checkbox-label" :for="labelFor" :id="id">{{label}}</label>
</template>

<script lang="babel">
export default {
  props: ['id', 'label', 'for'],
  computed: {
    labelFor () {
      return this['for'];
    }
  }
}
</script>

<style lang="scss">
@import '@material/checkbox/mdc-checkbox';
</style>
