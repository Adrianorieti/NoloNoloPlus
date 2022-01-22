<template>
  <div>
    <div>
      <HorizontalCard :title="employeeEmail" :text="text" :key="key" />
    </div>
    <div class="chart-wrapper">
      <chart :type="'pie'" :id="'pieChart'" :chartdata="pieData" :key="key" />
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
import HorizontalCard from "../components/horizontalImageCard";

export default {
  name: "singleEmployee",
  data() {
    return {
      key: 0,
      employee: {},
      pieData: {},
      lineData: {},
      text: "",
    };
  },
  props: ["employeeEmail"],
  watch: {
    employeeEmail() {
      this.getSingleEmployee();
    },
  },
  components: {
    chart,
    HorizontalCard,
  },
  mounted() {
    this.getSingleEmployee();
  },
  methods: {
    getSingleEmployee() {
      let fetch_options = {
        method: "GET",
        headers: new Headers({ "Content-type": "application/json" }),
      };
      let url = "http://localhost:8001/api/employee/rest/" + this.employeeEmail;
      fetch(url, fetch_options)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((data) => {
          this.employee = data.employee;
          this.gatherStatistics();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    gatherStatistics() {
      let numOfRes = this.employee.pastReservations.length;
      let earnings = 0;
      let averageEarnings = 0,
        averageLength = 0;
      let maxEarnings = 0,
        minEarnings = 0;
      let numOfDaysOfRes = 0;
      let maxDaysOfRents = 0,
        minDaysOfRent = 0;
      if (numOfRes > 0) {
        maxEarnings = this.employee.pastReservations[0].expense;
        minEarnings = this.employee.pastReservations[0].expense;
        for (let res of this.employee.pastReservations) {
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
        this.employee.pastReservations.length,
        this.employee.futureReservations.length +
          this.employee.activeReservations.length,
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
      for (let res of this.employee.pastReservations) {
        let end = new Date(res.end);
        labels.push(
          end.getDate() + "-" + (end.getMonth() + 1) + "-" + end.getFullYear()
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

<style>
</style>