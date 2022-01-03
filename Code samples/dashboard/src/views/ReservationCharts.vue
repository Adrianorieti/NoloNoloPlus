<template>
<div>
  <div class="chart-wrapper"> 
    <chart :type="type" :chartdata="data" :key="key" />
  </div>
</div>
</template>

<script>
import chart from "../components/chart"

export default {
  name: 'ReservationsCharts',
  data() {
    return{
      key: 0,
      reservations: [],
      averageReservationPrice : 0,
      data: {},
      type: 'bar'
    }
  },
  components: {
    chart
  },
  mounted(){
    let fetch_options = {
      method: 'GET',
      headers: new Headers({ 'Content-type': 'application/json'})
    }
    let url = 'http://localhost:8001/api/customer/user';
    fetch(url, fetch_options)
    .then(response => {
      if (response.status === 200){
        return response.json();
      } 
    }).then(data => {
      let sum = 0, numOfRes=0;
      for(let usr of data.users){
        if(usr.pastReservations.length > 0)
          this.reservations.push(usr.pastReservations);
          for(let res of usr.pastReservations){
            sum += res.expense;
          }
          numOfRes += usr.pastReservations.length;
      }
      this.averageReservationPrice = sum / numOfRes;
      this.createChart();
    })
    .catch(error => {
      console.log(error);
    })  
  },
  methods: {
    //POSSO METTERE A LATO DEL CHART DELLE STATISTICHE SPICCE. E POI DA QUALCHE ALTRA PARTE METTERE ALTRI GRAFICI.
    createChart(){
      let labels = [];
      let chartData = [];
      let colors = [];
      for (let res of this.reservations){
        labels.push(res[0].usermail);
        chartData.push(res[0].expense);
        colors.push(this.getRandomColor());
      }
      this.data = {
        labels: labels,
        datasets: [{
          label: 'User per amount of cash paid',
          backgroundColor: colors,
          borderColor: colors,
          data: chartData
        }]
      };
      this.key += 1;
    },
    getRandomColor() {
      return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
    }
  }
}
</script>

<style scoped>
</style>
