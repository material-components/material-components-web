
<template>
<div>
  <div class="demo-toolbar mdc-theme--primary-bg mdc-theme--text-primary-on-primary mdc-typography--title mdc-elevation--z4">
    <button class="demo-menu material-icons" @click="$refs.drawer.open()">menu</button>
  </div>

  <temporary-drawer ref="drawer" style="z-index: 20;">
    <div slot="header" class="mdc-temporary-drawer__header-content mdc-theme--primary-bg mdc-them--text-primary-on-primary">
      Header here
    </div>

    <nav class="mdc-list-group">
      <div id="icon-with-text-demo" class="mdc-list">
        <a class="mdc-list-item mdc-temporary-drawer--selected" href="#">
          <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">inbox</i>Inbox
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">star</i>Star
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">send</i>Sent Mail
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">drafts</i>Drafts
        </a>
      </div>

      <hr class="mdc-list-divider">

      <div class="mdc-list">
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">email</i>All Mail
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">delete</i>Trash
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">report</i>Spam
        </a>
      </div>
    </nav>
  </temporary-drawer>

  <main>
    <div class="demo-surface" v-ripple><p>{{label}}</p></div>
    <div>
      <form-field :align-end='alignEnd'>
        <checkbox v-model="checked" label="Test me" id="my-check" label-id="my-check-label"></checkbox>
        <checkbox-label id="my-check-label" for="my-check" :label="label"></checkbox-label>
      </form-field>
    </div>
    <div>
      <form-field>
        <checkbox v-model="alignEnd" label="Test me" id="my-check" label-id="my-check-label"></checkbox>
        <checkbox-label id="my-check-label" for="my-check" label="Align End?"></checkbox-label>
      </form-field>
      <input v-model="label"></input>
    </div>
    <div>
     <p>Change count: {{changeCount}}</p>
    </div>
    <button type="button" @click="showSnackbar">Show Snackbar</button>
    <snackbar event='mailSent'></snackbar>

    <icon-toggle v-model="favorited"
                 :toggle-on="{'label': favoritedLabel, 'content': 'favorite'}"
                 :toggle-off="{'label': 'Add to favorites', 'content': 'favorite_border'}">
    </icon-toggle>
    <div>
     <div>
       <label for="favorited-label">Favorited Label</label>
       <input id="favorited-label" v-model="favoritedLabel"></input>
     </div>
     <p>Favorited?: {{favorited}}</p>
    </div>
  </main>
</div>
</template>

<script lang="babel">
import Ripple from './v-mdc-ripple/Ripple';
import Snackbar from './v-mdc-snackbar/Snackbar';
import Checkbox from './v-mdc-checkbox/Checkbox';
import IconToggle from './v-mdc-icon-toggle/IconToggle';
import CheckboxLabel from './v-mdc-checkbox/CheckboxLabel';
import FormField from './v-mdc-form-field/FormField';
import TemporaryDrawer from './v-mdc-drawer/TemporaryDrawer';

export default {
  data () {
    return {
      label: 'Test Me',
      checked: true,
      alignEnd: false,
      changeCount: 0,
      favorited: true,
      favoritedLabel: 'Remove from favorites'
    }
  },
  components: { FormField, Checkbox, CheckboxLabel, IconToggle, Snackbar, TemporaryDrawer },
  directives: { Ripple },
  watch: {
    checked () {
      this.changeCount++;
    }
  },
  methods: {
    showSnackbar () {
      this.$root.$emit('mailSent', {
        message: 'Mail Sent',
        actionText: 'Undo',
        actionHandler: () => console.log('Undo it')
      });
    }
  }
}
</script>

<style lang="scss">
@import '@material/ripple/mdc-ripple';
@import '@material/elevation/mdc-elevation';
@import '@material/list/mdc-list';
@import '@material/theme/mdc-theme';

.demo-toolbar {
  width: 100%;
  height: 56px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
}
@media (min-width: 600px) {
  .demo-toolbar {
    height: 64px;
  }
}

.demo-menu {
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  padding: 0;
  margin: 0;
  color: #FFF;
  box-sizing: border-box;
}

.demo-surface {
  @include mdc-elevation(2);
  width: 150px;
  height: 150px;
}

main {
  padding: 12px;
}
</style>
