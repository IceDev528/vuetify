<template>
  <div>
    <v-row
      justify="center"
      align="center"
    >
      <v-col class="text-center">
        <div class="text-subtitle-2">Offset Top</div>
        {{ offsetTop }}
      </v-col>
    </v-row>
    <v-container
      id="scroll-target"
      style="max-height: 400px"
      class="overflow-y-auto"
    >
      <v-row
        v-scroll:#scroll-target="onScroll"
        align="center"
        justify="center"
        style="height: 1000px"
      >
      </v-row>
    </v-container>
  </div>
</template>

<script>
  export default {
    data: () => ({
      offsetTop: 0,
    }),

    methods: {
      onScroll (e) {
        this.offsetTop = e.target.scrollTop
      },
    },
  }
</script>
