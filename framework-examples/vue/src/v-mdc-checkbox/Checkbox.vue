
<template>
<div ref="root" class="mdc-checkbox" :class="classes">
  <input ref="native"
         type="checkbox"
         class="mdc-checkbox__native-control"
         @change="fireEvent"
         :checked="value"
         :id="id"
         :aria-labelledby="labelId" />
  <div class="mdc-checkbox__background">
    <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
      <path class="mdc-checkbox__checkmark__path" fill="none" stroke="white"
            d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
    </svg>
  <div class="mdc-checkbox__mixedmark"></div>
  </div>
</div>
</template>

<script lang="babel">
import { MDCCheckboxFoundation } from '@material/checkbox';

const { ANIM_END_EVENT_NAME } = MDCCheckboxFoundation.strings;

export default {
  props: ['id', 'value'],
  data () {
    return {
      classes: {},
      changeHandlers: [],
      foundation: null
    };
  },
  mounted () {
    let vm = this;
    this.foundation = new MDCCheckboxFoundation({
      addClass (className) {
        vm.$set(vm.classes, className, true);
      },
      removeClass (className) {
        vm.$delete(vm.classes, className);
      },
      registerChangeHandler (handler) {
        vm.changeHandlers.push(handler);
      },
      deregisterChangeHandler (handler) {
        let index = vm.changeHandlers.indexOf(handler);
        if (index >= 0) {
          vm.changeHandlers.splice(index, 1)
        }
      },
      registerAnimationEndHandler (handler) {
        vm.$refs.root.addEventListener(ANIM_END_EVENT_NAME, handler);
      },
      deregisterAnimationEndHandler (handler) {
        vm.$refs.root.removeEventListener(ANIM_END_EVENT_NAME, handler);
      },
      getNativeControl () {
        return vm.$refs.native;
      },

      isAttachedToDOM () {
        return Boolean(vm.$el);
      }
    });
    this.foundation.init();
  },
  beforeDestroy () {
    this.foundation.destroy();
  },
  methods: {
    fireEvent (event) {
      this.changeHandlers.forEach((h) => h(event));
      this.$emit('input', event.target.checked);
    }
  },
  computed: {
    labelId () {
      return this.id + '-label';
    }
  }
}

</script>

<style lang="scss">
@import '@material/checkbox/mdc-checkbox';
</style>
