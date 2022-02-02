<template>
  <div>
    <div v-if="loading">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="card-wrapper" v-else>
      <div class="card">
        <img
          :src="'http://localhost:8001/images/categories/' + this.product.image"
          class="card-img-top"
          alt="product pic"
        />
        <div class="card-body">
          <h3 class="card-title">{{ this.productName }}</h3>
          <p class="card-text">
            Category: {{ this.product.type }}
            <br />
            Price: {{ this.product.price }}
            <br />
            Status: {{ this.product.status }}
          </p>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h1>Statistics</h1>
          <p class="card-stat">
            <pre>{{this.text}}</pre>
          </p>
        </div>
      </div>
    </div>
        <div class="chart-wrapper">
      <chart :type="'pie'" :id="'pieChart'" :class="'pie'" :chartdata="pieData" :key="key" />
    </div>
    <div class="chart-wrapper">
      <chart
        :type="'line'"
        :id="'lineChart'"
        :chartdata="lineData"
        :key="key"
      />
    </div>
  </div>
</template> 

<script>
import chart from "../components/chart";

export default {
  name: "SingleProduct",
  data() {
    return {
      key: 0,
      product: {},
      pieData: {},
      lineData: {},
      text: "",
      loading: true,
    };
  },
  props: ["productName"],
  watch: {
    productName() {
      this.getSingleProduct();
    },
  },
  components: {
    chart,
  },
  mounted() {
    this.getSingleProduct();
  },
  methods: {
    getSingleProduct() {
      this.loading = true;
      let url = "http://localhost:8001/api/products/" + this.productName;
      fetch(url)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((data) => {
          this.product = data.product[0];
          this.loading = false;
          this.gatherStatistics();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    gatherStatistics() {
      let numOfRes = this.product.pastReservations.length;
      let earnings = 0;
      let averageEarnings = 0,
        averageLength = 0;
      let maxEarnings = 0,
        minEarnings = 0;
      let numOfDaysOfRes = 0;
      let maxDaysOfRents = 0,
        minDaysOfRent = 0;
      if (numOfRes > 0) {
        maxEarnings = this.product.pastReservations[0].expense;
        minEarnings = this.product.pastReservations[0].expense;
        for (let res of this.product.pastReservations) {
          //expense part
          earnings += res.expense;
          if (maxEarnings < res.expense) maxEarnings = res.expense;
          if (minEarnings > res.expense) minEarnings = res.expense;
          //rental part
          let lengthOfRes = this.getLengthRes(res);
          numOfDaysOfRes += lengthOfRes;
          if (maxDaysOfRents < lengthOfRes) maxDaysOfRents = lengthOfRes;
          if (minDaysOfRent > lengthOfRes) minDaysOfRent = lengthOfRes;
        }
        averageEarnings = earnings / numOfRes;
        averageLength = numOfDaysOfRes / numOfRes;
      }
      this.text =
        `Number of reservations ended: ${numOfRes} \n` +
        `Total earnings for reservations: ${earnings}$ \n ` +
        `Average earning for reservation: ${averageEarnings}$ \n` +
        `Max earning for reservations: ${maxEarnings}$ \n` +
        `Min earning for reservation: ${minEarnings}$ \n` +
        `Average length for reservation: ${averageLength} days \n` +
        `Max length for reservation: ${maxDaysOfRents} days \n ` +
        `Min length for reservation: ${minDaysOfRent} days \n `;
      this.createPieResChart();
      this.createLineEarningTimeChart();
      this.key += 1;
    },
    createPieResChart() {
      //reservations pie chart!
      let labels = ["Completed", "Incomplete"];
      let chartData = [
        this.product.pastReservations.length,
        this.product.futureReservations.length +
          this.product.activeReservations.length,
      ];
      let colors = [this.getRandomColor(), this.getRandomColor()];
      this.pieData = {
        labels: labels,
        datasets: [
          {
            label: "Type of reservations",
            backgroundColor: colors,
            borderColor: colors,
            data: chartData,
          },
        ],
      };
    },
    createLineEarningTimeChart() {
      let labels = [];
      let chartData = [];
      let colors = [];
      for (let res of this.product.pastReservations) {
        let start = new Date(res.start);
        labels.push(
          start.getDate() +
            "-" +
            (start.getMonth() + 1) +
            "-" +
            start.getFullYear()
        );
        chartData.push(res.expense);
        colors.push(this.getRandomColor());
      }
      this.lineData = {
        labels: labels,
        datasets: [
          {
            label: "Earning over time",
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
    getLengthRes(res) {
      const msPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds per day
      let end = new Date(res.end);
      let start = new Date(res.start);
      let daysLeft = (end.getTime() - start.getTime()) / msPerDay;
      return Math.round(daysLeft);
    },
  },
};
</script>

<style scoped>
.card-wrapper {
  display: flex;
  justify-content: space-around;
}

h3 {
  font-weight: 700;
}

h1 {
  font-size: 4rem;
  font-weight: 900;
}

.card-text {
  font-size: 1.5rem;
}

.card-stat {
  font-size: 2rem;
}
</style>