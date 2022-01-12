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
        email: {{ this.email }}
        <br />
        payment: {{ this.payment }}
      </b-card-text>

      <b-button @click="route()" variant="primary">Go somewhere</b-button>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "imagecard",
  props: ["title", "email", "payment"],
  methods: {
    route() {
      //questo per ora è fisso ma non rimarrà così a lungo
      this.$router.push({ path: `users/${this.email}` });
    },
  },
};
</script>

<style scoped>
</style>
