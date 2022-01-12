<template>
  <div :class="type">
    <canvas :id="id" role="img"></canvas>
  </div>
</template>


<script>
import Chart from "chart.js/auto";
//SERVE UN METODO PER RENDERE I DATI ACCESSIBILE, DEVO SOLO TRASFORMARLO IN UNA SCRITTA.
//  PROSSIMA COSA DA IMPLEMENTARE È ACCESSIBILITÀ E ABBELLIMENTO DEI CHARTS! -> con labels etc etc.
// VORREI AGGIUNGERE ANCHE UN TITOLO.
//IMPLEMENTARE DELLE MEDIA QUERY PER LA GRANDEZZA DEL GRAFICO!
//devo farmi passare l'id come props mi sa
export default {
  name: "chart",
  props: ["type", "chartdata", "id"],
  mounted() {
    if (this.id == null) {
      this.id = "user-chart";
    }
    const ctx = document.getElementById(this.id);
    const config = {
      type: this.type,
      data: this.chartdata,
      options: {
        responsive: true,
      },
    };
    new Chart(ctx, config);
  },
};
</script>

<style scoped>
div {
  width: 65%;
}
.pie {
  width: 50%;
}
</style>
