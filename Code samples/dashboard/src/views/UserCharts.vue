<template>
<div>
  <div class="button-wrapper">
    <button @click="changeType('bar')">bar</button>
    <button @click="changeType('line')">line</button>
  </div>
  <div class="chart-wrapper"> 
    <chart :type="type" :chartdata="data" :key="key" />
  </div>
</div>
</template>

<script>
import chart from "../components/chart"

export default {
  name: 'UserCharts',
  data() {
    return{
      key: 0,
      users: [],
      data: {},
      type: 'bar'
    }
  },
  props: ["chartView"],
  watch: {
    'chartView'(){
      this.changeChart();
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
      this.users = data.users;
      this.changeChart();
    })
    .catch(error => {
      console.log(error);
    })  
  },
  methods: {
    changeChart(){
      let mappedUsers,attribute;
      if(this.chartView === 'rental'){
        attribute = 'pastReservations';
        mappedUsers = this.users.map(user => ({ email: user.email, attribute: user[attribute].length }));
      }
      else{
        attribute = 'amountPaid';
        mappedUsers = this.users.map(user => ({ email: user.email, attribute: user[attribute] }));
      }
      let labels = [];
      let chartData = [];
      let colors = [];
      for (let user of mappedUsers){
        labels.push(user.email);
        chartData.push(user.attribute);
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
    changeType(chartype) {
      this.type = chartype;
      this.key += 1;
    },
    getRandomColor() {
      return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
    }
  }
}
</script>

<style scoped>
.button-wrapper{
  display: flex;
  justify-Content: center;
}
</style>