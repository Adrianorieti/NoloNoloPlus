<template>
  <div>
    <div v-if="loading">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else>
      <HorizontalCard
        :title="userEmail"
        :text="text"
        :imageSrc="'http://localhost:8001/images/users/' + this.user.image"
        :key="key"
      />
    </div>
    <div class="chart-wrapper">
      <chart
        :type="'pie'"
        :id="'pieChart'"
        :class="'pie'"
        :chartdata="pieData"
        :key="key"
      />
    </div>
    <div class="chart-wrapper">
      <chart
        :type="'line'"
        :id="'lineChart'"
        :chartdata="lineData"
        :key="key"
      />
    </div>
    <div class="chart-wrapper">
      <chart :type="'bar'" :id="'barChart'" :chartdata="barData" :key="key" />
    </div>
  </div>
</template>

<script>
import chart from "../components/chart";
import HorizontalCard from "../components/horizontalImageCard";

export default {
  name: "singleUser",
  data() {
    return {
      key: 0,
      user: {},
      pieData: {},
      barData: {},
      lineData: {},
      text: "",
      loading: true,
    };
  },
  props: ["userEmail"],
  watch: {
    userMail() {
      this.getSingleUser();
    },
  },
  components: {
    chart,
    HorizontalCard,
  },
  created() {
    this.getSingleUser();
  },
  methods: {
    getSingleUser() {
      this.loading = true;
      let url = "http://site202145.tw.cs.unibo.it/api/user/" + this.userEmail;
      fetch(url)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((data) => {
          this.user = data.user;
          this.loading = false;
          this.gatherStatistics();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    gatherStatistics() {
      let numOfRes = this.user.pastReservations.length;
      let amountPaid = this.user.amountPaid;
      let averagePrice = 0,
        averageLength = 0;
      let maxPrice = 0,
        minPrice = 0;
      let numOfDaysOfRes = 0;
      let maxDaysOfRents = 0,
        minDaysOfRent = 0;
      if (numOfRes > 0) {
        averagePrice = amountPaid / numOfRes;
        maxPrice = this.user.pastReservations[0].expense;
        minPrice = this.user.pastReservations[0].expense;
        for (let res of this.user.pastReservations) {
          //expense part
          if (maxPrice < res.expense) maxPrice = res.expense;
          if (minPrice > res.expense) minPrice = res.expense;
          //rental part
          let lengthOfRes = this.getLengthRes(res);
          numOfDaysOfRes += lengthOfRes;
          if (maxDaysOfRents < lengthOfRes) maxDaysOfRents = lengthOfRes;
          if (minDaysOfRent > lengthOfRes) minDaysOfRent = lengthOfRes;
        }
        averageLength = numOfDaysOfRes / numOfRes;
        //rounding to just two decimals:
        averagePrice = Math.round(averagePrice * 100) / 100;
        averageLength = Math.round(averageLength * 100) / 100;
      }
      this.text =
        `Number of reservations ended: ${numOfRes} \n` +
        `Total paid for reservations: ${amountPaid}$ \n ` +
        `Average price for reservation: ${averagePrice}$ \n` +
        `Max price for reservations: ${maxPrice}$ \n` +
        `Min price for reservation: ${minPrice}$ \n` +
        `Average length for reservation: ${averageLength} days\n` +
        `Max length for reservation: ${maxDaysOfRents}  days\n ` +
        `Min length for reservation: ${minDaysOfRent}  days\n `;
      this.createPieResChart();
      this.createLineSpendingTimeChart();
      this.createBarNumOfResPerCat();
      this.key += 1;
    },
    createPieResChart() {
      //reservations pie chart!
      let labels = ["past", "active", "future"];
      let active = 0;
      if (this.user.activeReservation) {
        active = 1;
      }
      let chartData = [
        this.user.pastReservations.length,
        active,
        this.user.futureReservations.length,
      ];
      let colors = [
        this.getRandomColor(),
        this.getRandomColor(),
        this.getRandomColor,
      ];
      if (this.user.activeReservation) {
        chartData[1] = 1;
      }
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
    createLineSpendingTimeChart() {
      let labels = [];
      let chartData = [];
      let colors = [];
      this.user.pastReservations.reverse();
      for (let res of this.user.pastReservations) {
        let start = new Date(res.start);
        let newDate = start.getDate() +"-" +(start.getMonth() + 1) +"-" +start.getFullYear();
        if(labels.includes(newDate)){
          let index = labels.indexOf(newDate);
          chartData[index] += res.expense;
        }
        else{
          labels.push(newDate);
          chartData.push(res.expense);
        }
        colors.push(this.getRandomColor());
      }
      this.lineData = {
        labels: labels,
        datasets: [
          {
            label: "Spending over time",
            backgroundColor: colors,
            borderColor: colors,
            data: chartData,
          },
        ],
      };
    },
    createBarNumOfResPerCat() {
      //Bisogna fare richiesta per avere i prodotti, da cui mi ricavo tutte le categorie e poi paragono prodotto al tipo di categoria. Devo creare una specie di dizionario.
      let url = "http://site202145.tw.cs.unibo.it/api/products/";
      fetch(url)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((data) => {
          let prod = data.productList;
          let mapProdToCat = {};
          let category = [];
          let catVal = [];
          let colors = [];
          for (let p of prod) {
            mapProdToCat[p.name] = p.type;
            if (!category.includes(p.type)) {
              category.push(p.type);
              catVal.push(0);
              colors.push(this.getRandomColor());
            }
          }
          for (let res of this.user.pastReservations) {
            let cat = mapProdToCat[res.product];
            catVal[category.indexOf(cat)] += 1;
          }
          this.barData = {
            labels: category,
            datasets: [
              {
                label: "Category rented",
                backgroundColor: colors,
                borderColor: colors,
                data: catVal,
              },
            ],
          };
          this.key += 1;
        })
        .catch((error) => {
          console.log(error);
        });
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
