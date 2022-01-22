<template>
  <div>
    <b-card
      :title="this.title"
      img-src="https://picsum.photos/600/300/?image=25"
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

      <b-button @click="route()" variant="primary">Go to Persona Page</b-button>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "imagecard",
  props: ["email", "title", "text", "path"],
  methods: {
    route() {
      //questo per ora è fisso ma non rimarrà così a lungo
      //this.$router.push({ path: `users/${this.email}` });
      this.$router.push({ path: this.path });
    },
  },
};
</script>

<style scoped>
</style>
