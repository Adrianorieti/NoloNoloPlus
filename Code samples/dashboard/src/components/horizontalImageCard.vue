<template>
  <div class="card-wrapper">
    <b-card no-body class="overflow-hidden wdt">
      <b-row no-gutters>
        <b-col md="6">
          <!-- qui va cambiato qualcosa perchè non prova a prendere subito l'immagine, invece non dovrebbe essere così. -->
          <b-card-img
            :src="this.imageSrc"
            alt="Image"
            class="rounded-0"
          ></b-card-img>
        </b-col>
        <b-col md="6">
          <b-card-body :title="this.title">
            <b-card-text>
              <pre>{{ this.text }}</pre>
            </b-card-text>
          </b-card-body>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "horizontalimageCard",
  props: ["title", "text", "imageSrc"],
};
</script>

<style scoped>
.wdt {
  width: 67%;
}
.card-wrapper {
  display: flex;
  justify-content: center;
  font-size: 1.5rem;
}
.card-title {
  font-weight: bold;
  font-size: 2.2rem;
}
</style>