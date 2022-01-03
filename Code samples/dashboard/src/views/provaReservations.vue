<template>
<div>
  <div class="chart-wrapper"> 
    <chart :type="pie" :chartdata="numOfResData" />
  </div>
</div>
</template>

<script>
import chart from "../components/chart"

export default {
  name: 'ReservationsCharts',
  data() {
    return{
      foundationYear: 2017,
      reservations: {},
      yearsChartsData: {},
      numOfResData: {}
    }
  },
  components: {
    chart
  },
  created(){
    for (let year = foundationYear; year<=new Date().getFullYear(); year++){
        this.reservations[year] = [];
        this.yearsChartsData[year] = {};
    }
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
      for(let usr of data.users){
        if(usr.pastReservations.length > 0)
          for(let res of usr.pastReservations){
            let year = res.start.getFullYear();
            this.reservations[year].push(res);
          }
      }
      this.createCharts();
    })
    .catch(error => {
      console.log(error);
    })  
  },
  methods: {
    //devo creare array, per ogni tipo di chart che voglio creare.
    createCharts(){
        
    },
    getRandomColor() {
      return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
    }
  }
}
</script>

<style scoped>
</style>
