<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-btn
      v-bind="$attrs"
    >
      <v-icon v-if="$attrs.fab || $attrs.icon">
        $mdiVuetify
      </v-icon>

      <span v-else>Click Me</span>
    </v-btn>
  </v-row>
</template>

<script>
  export default {
    name: 'Usage',

    inheritAttrs: false,

    data: () => ({
      defaults: {
        block: false,
        color: null,
        depressed: false,
        disabled: false,
        elevation: 2,
        fab: true,
        icon: false,
        large: false,
        loading: false,
        outlined: false,
        rounded: false,
        small: false,
        text: false,
        tile: false,
        'x-large': false,
        'x-small': false,
      },
      options: {
        booleans: [
          'block',
          'disabled',
          'large',
          'loading',
          'small',
          'x-large',
          'x-small',
        ],
        sliders: {
          elevation: [0, 24],
        },
        selects: {
          color: [
            'accent',
            'primary',
            'secondary',
          ],
        },
      },
      tabs: [
        'depressed',
        'icon',
        'outlined',
        'raised',
        'rounded',
        'text',
        'tile',
      ],
    }),
  }
</script>
