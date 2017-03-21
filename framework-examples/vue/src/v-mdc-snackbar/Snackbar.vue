
<template>
<div ref="root" class="mdc-snackbar" :class="classes" aria-live="assertive" aria-atomic="true" :aria-hidden="hidden">
  <div class="mdc-snackbar__text">{{message}}</div>
  <div class="mdc-snackbar__action-wrapper">
    <button type="button" @click="actionClicked" class="mdc-button mdc-snackbar__action-button" :aria-hidden="actionHidden">{{actionText}}</button>
  </div>
</div>
</template>

<script lang="babel">
import { MDCSnackbarFoundation } from '@material/snackbar';
import { getCorrectEventName } from '@material/animation';

export default {
  props: {
    event: String,
    eventSource: {
      required: false,
      default () {
        return this.$root;
      }
    }
  },
  data () {
    return {
      classes: {},
      message: '',
      actionText: '',
      hidden: false,
      actionHidden: false,
      animHandlers: [],
      actionClickHandlers: [],
      foundation: null
    };
  },
  mounted () {
    let vm = this;
    this.foundation = new MDCSnackbarFoundation({
      addClass (className) {
        vm.$set(vm.classes, className, true);
      },
      removeClass (className) {
        vm.$delete(vm.classes, className);
      },
      setAriaHidden () {
        vm.hidden = true;
      },
      unsetAriaHidden () {
        vm.hidden = false;
      },
      setActionAriaHidden () {
        vm.actionHidden = true;
      },
      unsetActionAriaHidden () {
        vm.actionHidden = false;
      },
      setMessageText (message) {
        vm.message = message;
      },
      setActionText (actionText) {
        vm.actionText = actionText;
      },
      registerActionClickHandler (handler) {
        vm.actionClickHandlers.push(handler);
      },
      deregisterChangeHandler (handler) {
        let index = vm.actionClickHandlers.indexOf(handler);
        if (index >= 0) {
          vm.actionClickHandlers.splice(index, 1)
        }
      },
      registerTransitionEndHandler (handler) {
        vm.$refs.root.addEventListener(getCorrectEventName(window, 'transitionend'), handler);
      },
      deregisterTransitionEndHandler (handler) {
        vm.$refs.root.removeEventListener(getCorrectEventName(window, 'transitionend'), handler);
      }
    });
    this.foundation.init();

    this.eventSource.$on(this.event, (data) => {
      this.foundation.show(data)
    });
  },
  beforeDestroy () {
    this.foundation.destroy();
  },
  methods: {
    actionClicked (event) {
      this.actionClickHandlers.forEach((h) => h(event));
    }
  }
}

</script>

<style lang="scss">
@import '@material/button/mdc-button';
@import '@material/snackbar/mdc-snackbar';
</style>
