<template>
<div class="mdc-form-field" :class="{'mdc-form-field--align-end': alignEnd}">
  <slot></slot>
</div>
</template>

<script lang="babel">
export default {
  props: ['alignEnd']
}
</script>

<style lang="scss">
@import "@material/form-field/mdc-form-field";
</style>
