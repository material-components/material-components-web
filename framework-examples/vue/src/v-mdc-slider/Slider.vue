<template>
  <div :tabindex="tabIndex" :class="classes" :aria-valuemin="min" :aria-valuemax="max" :aria-valuenow="value" :aria-label="label">
    <div class="mdc-slider__track-container">
      <div ref="track"  class="mdc-slider__track"></div>
    </div>
    <div ref="thumbContainer" class="mdc-slider__thumb-container">
      <svg class="mdc-slider__thumb" width="21" height="21">
        <circle cx="10.5" cy="10.5" r="7.875"></circle>
      </svg>
      <div class="mdc-slider__focus-ring"></div>
    </div>
  </div>
</template>

<script lang="babel">
/* global CustomEvent */
import {MDCSliderFoundation} from '@material/slider';

function emit (el, evtType, evtData) {
  let evt;
  if (typeof CustomEvent === 'function') {
    evt = new CustomEvent(evtType, {detail: evtData});
  } else {
    evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(evtType, false, false, evtData);
  }
  el.dispatchEvent(evt);
}

export default {
  props: {
    value: {type: Number},
    max: {type: Number, default: 100},
    min: {type: Number, default: 0},
    label: {type: String, required: false},
    step: {type: Number, default: 0},
    tabIndex: {type: String, default: '0'},
    disabled: {
      required: false
    }
  },
  data () {
    return {
      classes: {'mdc-slider': true},
      foundation: null
    };
  },
  mounted () {
    const vm = this;

    this.foundation = new MDCSliderFoundation({
      addClass (className) {
        vm.$set(vm.classes, className, true);
      },
      removeClass (className) {
        vm.$delete(vm.classes, className);
      },
      getAttribute (name) {
        return vm.$el.getAttribute(name);
      },
      setAttribute (name, value) {
        vm.$el.setAttribute(name, value);
      },
      rmAttribute (name) {
        vm.$el.removeAttribute(name);
      },
      computeBoundingRect () {
        return vm.$el.getBoundingClientRect();
      },
      getTabIndex () {
        return vm.tabIndex;
      },
      registerInteractionHandler (type, handler) {
        vm.$el.addEventListener(type, handler);
      },
      deregisterInteractionHandler (type, handler) {
        vm.$el.removeEventListener(type, handler);
      },
      registerThumbContainerInteractionHandler (type, handler) {
        const thumbContainer = vm.$refs.thumbContainer;
        thumbContainer.addEventListener(type, handler);
      },
      deregisterThumbContainerInteractionHandler (type, handler) {
        const thumbContainer = vm.$refs.thumbContainer;
        thumbContainer.removeEventListener(type, handler);
      },
      registerBodyInteractionHandler (type, handler) {
        document.body.addEventListener(type, handler);
      },
      deregisterBodyInteractionHandler (type, handler) {
        document.body.removeEventListener(type, handler);
      },
      registerResizeHandler (handler) {
        window.addEventListener('resize', handler);
      },
      deregisterResizeHandler (handler) {
        window.removeEventListener('resize', handler);
      },
      notifyInput () {
        const data = vm.foundation.getValue();
        vm.$emit('input', data);
        emit(vm.$el, 'MDCSlider:input', {item: vm, value: data});
      },
      notifyChange () {
        const data = vm.foundation.getValue();
        vm.$emit('input', data);
        emit(vm.$el, 'MDCSlider:change', {item: vm, value: data});
      },
      setThumbContainerStyleProperty (propertyName, value) {
        vm.$refs.thumbContainer.style.setProperty(propertyName, value);
      },
      setTrackStyleProperty (propertyName, value) {
        vm.$refs.track.style.setProperty(propertyName, value);
      },
      isRTL () {
        return window.getComputedStyle(vm.$el).getPropertyValue('direction') === 'rtl';
      }
    });
    this.foundation.init();
    this.initialSyncWithDOM();
  },
  methods: {
    initialSyncWithDOM () {
      this.foundation.setValue(this.value);
      this.foundation.setMin(this.min);
      this.foundation.setMax(this.max);
      this.foundation.setStep(this.step);
      this.foundation.setDisabled(this.disabled);
    }
  },
  watch: {
    disabled (val) {
      if (this.foundation.isDisabled() === val) {
        return;
      }

      this.foundation.setDisabled(val);
    }
  },
  beforeDestroy () {
    this.foundation.destroy();
  }
};
</script>

<style lang="scss">
@import '@material/slider/mdc-slider';
</style>
