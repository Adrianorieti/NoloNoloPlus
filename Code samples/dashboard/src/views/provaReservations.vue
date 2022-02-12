<template>
  <div>
    <div class="chart-wrapper">
      <chart
        :type="'line'"
        :id="'lineResCharts'"
        :chartdata="lineData"
        :key="key"
      />
    </div>
    <div class="chart-wrapper">
      <chart
        :type="'bar'"
        :id="'barResCharts'"
        :chartdata="barData"
        :key="key"
      />
    </div>
  </div>
</template>

<script>
import chart from "../components/chart";

export default {
  name: "ReservationsCharts",
  data() {
    return {
      foundationYear: 2017,
      reservations: {},
      labels: [],
      barData: {},
      lineData: {},
      key: 0,
    };
  },
  components: {
    chart,
  },
  created() {
    for (
      let year = this.foundationYear;
      year <= new Date().getFullYear();
      year++
    ) {
      this.reservations[year] = [];
      this.labels.push(year);
    }
  },
  mounted() {
    let fetch_options = {
      method: "GET",
      headers: new Headers({ "Content-type": "application/json" }),
    };
    let url = "http://site202145.tw.cs.unibo.it/api/user/";
    fetch(url, fetch_options)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((data) => {
        for (let usr of data.users) {
          if (usr.pastReservations.length > 0)
            for (let res of usr.pastReservations) {
              let year = new Date(res.end).getFullYear();
              this.reservations[year].push(res);
            }
        }
        this.createLineChart();
        this.createbarChart();
        this.key += 1;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    //allora la situazione è che abbiamo diviso tutte le reservations in base all'anno.
    //con bar vorrei mostrare anche il numero di reservation per anno
    //poi a inizio della pagina facciamo delle statistiche basic.
    //statistiche = numero di utenti registrati, numero di utenti attivi(con almeno una fatta nell'anno o past, da vedere).
    //statistiche su qualche categoria ha più rents nell'hanno.
    createLineChart() {
      let counter = 0;
      let chartData = [],
        keys = [],
        colors = [];
      for (const [key, value] of Object.entries(this.reservations)) {
        let sumOfYear = 0;
        keys.push(key);
        for (let res of value) {
          sumOfYear += res.expense;
        }
        chartData[counter] = sumOfYear;
        colors.push(this.getRandomColor());
        counter++;
      }
      this.lineData = {
        labels: this.labels,
        datasets: [
          {
            label: "Earning per years",
            backgroundColor: colors,
            borderColor: colors,
            data: chartData,
          },
        ],
      };
    },
    createbarChart() {
      let chartData = [],
        colors = [],
        keys = [];
      for (const [key, value] of Object.entries(this.reservations)) {
        keys.push(key);
        chartData.push(value.length);
        colors.push(this.getRandomColor());
      }
      this.barData = {
        labels: this.labels,
        datasets: [
          {
            label: "Reservations per years",
            backgroundColor: colors,
            borderColor: colors,
            data: chartData,
          },
        ],
      };
    },
    getRandomColor() {
      return "#" + (Math.random().toString(16) + "0000000").slice(2, 8);
    },
  },
};
</script>

<style scoped>
</style>
