<template>
  <div>
    <div class="card custom-card border border-dark">
      <img :src="imageSrc" class="card-img-top" alt="profile pic" />
      <div class="card-body">
        <h5 class="card-title">
          <a
            :href="path"
            @click.prevent="route(this.path)"
            class="stretched-link st_link_dec"
          >
            {{ this.email }}</a
          >
        </h5>
        <p class="card-text">{{ this.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "card",
  props: ["email", "text", "path", "imageSrc"],
  methods: {
    route(path) {
      this.$router.push({ path: path });
    },
  },
};
</script>

<style scoped>
.st_link_dec {
  text-decoration: none;
  color: black;
  font-size: 1.3em;
}
.custom-card {
  margin-top: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
}

.custom-card:hover {
  box-shadow: 5px 10px 20px 5px rgba(0, 0, 0, 0.4);
  transform: scale(1.1);
}
</style>
