<template>
  <div class="card-wrapper">
    <div class="card wdt">
      <div class="row g-0">
      <div class="col-md-6">
        <img :src="this.imageSrc" alt="Profile Image" class="img-fluid rounded-start" >
      </div>
      <div class="col-md-6">
        <div class="card-body">
          <h5 class="card-title">{{this.title}}</h5>
          <p class="card-text"><pre>{{this.text}}</pre></p>
        </div>
      </div>
  </div>
</div>
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
  width: 80%;
}
img {
  height: 100%;
  width: 100%;
  max-height: 35rem;
  max-width: 35rem;
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