<template>
  <div>
    <b-card
      :title="this.title"
      :img-src="this.imageSrc"
      :img-alt="this.title + ' profile pic'"
      img-top
      tag="article"
      style="max-width: 20rem"
      class="mb-2"
    >
      <b-card-text>
        Email: {{ this.email }}
        <br />
        {{ this.text }}
      </b-card-text>

      <b-button @click="route()" variant="primary"
        >Go to Personal Page</b-button
      >
    </b-card>
  </div>
</template>

<script>
export default {
  name: "imagecard",
  props: ["email", "title", "text", "path", "imageSrc"],
  methods: {
    route() {
      this.$router.push({ path: this.path });
    },
  },
};
</script>

<style scoped>
</style>
