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
  name: 'EmployeeCharts',
  data() {
    return{
      key: 0,
      employees: [],
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
    let url = 'http://localhost:8001/api/customer/employee';
    fetch(url, fetch_options)
    .then(response => {
      if (response.status === 200){
        return response.json();
      } 
    }).then(data => {
      this.employees = data.employees;
      this.changeChart();
    })
    .catch(error => {
      console.log(error);
    })  
  },
  methods: {
    changeChart(){
      let mappedEmp;
      if(this.chartView === 'rental'){
        mappedEmp = this.employees.map(emp => ({ email: emp.email, attribute: emp.pastReservations.length }));
      }
      else{
        mappedEmp = this.employees.map(emp => ({ email: emp.email, attribute: emp.pastReservations }));
        for (let emp of mappedEmp){
          let sum = 0;
          for(let res of emp.attribute){
            sum += res.expense;
          }
          emp.attribute = sum;
        }
      }
      let labels = [];
      let chartData = [];
      let colors = [];
      for (let emp of mappedEmp){
        labels.push(emp.email);
        chartData.push(emp.attribute);
        colors.push(this.getRandomColor());
      }
      this.data = {
        labels: labels,
        datasets: [{
          label: 'PEr ora la metto a caso',
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