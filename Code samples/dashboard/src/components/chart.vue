<template>
  <div>
    <canvas id="user-Chart" role="img"></canvas>
  </div>
</template>


<script>
import Chart from 'chart.js/auto'
//SERVE UN METODO PER RENDERE I DATI ACCESSIBILE, DEVO SOLO TRASFORMARLO IN UNA SCRITTA.
//  PROSSIMA COSA DA IMPLEMENTARE È ACCESSIBILITÀ E ABBELLIMENTO DEI CHARTS! -> con labels etc etc.
// VORREI AGGIUNGERE ANCHE UN TITOLO.
//IMPLEMENTARE DELLE MEDIA QUERY PER LA GRANDEZZA DEL GRAFICO!
export default{
    name: "chart",
    props: ['type','chartdata'],
    mounted(){
        const ctx = document.getElementById('user-Chart');
        const config = {
            type: this.type,
            data: this.chartdata,
            options: {
              responsive : true
            }
        };
        new Chart(ctx, config);
    }
}
</script>

<style scoped>
div{
  width: 65%;
}
</style>
