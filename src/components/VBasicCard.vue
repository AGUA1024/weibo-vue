<template>
  <v-card color="blue lighten-5" light>
    <v-toolbar
      v-if="fillHeader"
      flat
      dense
      color="transparent"
      :height="toolbarHeight"
    >
      <v-toolbar-title>
        <v-subheader class="pl-0 text-h5" >
          {{ title }}
        </v-subheader>
      </v-toolbar-title>
    </v-toolbar>
    <v-divider v-if="fillHeader"></v-divider>
    <v-card-text >
      <slot name="card-content"></slot>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'VBasicCard',
  props: {
    fillHeader: {
      type: Boolean,
      default: true,
    },
    toolbarHeight: {
      type: [Number, String],
      default: undefined,
    },
    title: {
      type: String,
    },
  },
};
</script>
