<template>
  <div>
    <div class="button-wrapper">
    <button
      type="button"
      class="btn btn-outline-success"
      @click="route('/categories/create')"
    >
      CREATE NEW CATEGORY
    </button>
    <button
      type="button"
      class="btn btn-outline-success"
      @click="route('/categories/change')"
    >
      CHANGE CATEGORY
    </button>
    </div>
    <div class="chart-wrapper">
      <chart
        :type="'bar'"
        :chartdata="data[0]"
        :id="'categoriesSalesVolume'"
        :key="key"
      />
    </div>
    <div class="chart-wrapper">
      <chart
        :type="'line'"
        :chartdata="data[1]"
        :id="'categoriesNOfRentals'"
        :key="key"
      />
    </div>
    <div class="chart-wrapper">
      <chart
        :type="'bar'"
        :chartdata="data[2]"
        :id="'categoriesNOfObj'"
        :key="key"
      />
    </div>
  </div>
</template>

<script>
import chart from "../components/chart";

export default {
  name: "Categories",
  data() {
    return {
      categories: [],
      products: [],
      data: [],
      key: 0,
    };
  },
  components: {
    chart,
  },
  async mounted() {
    let url = "http://localhost:8001/api/categories/";
    try {
      let response = await fetch(url);
      this.categories = await response.json();
      this.takeProducts();
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    takeProducts() {
      let url = "http://localhost:8001/api/products/";
      fetch(url)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((data) => {
          this.products = data.productList;
          this.createCharts();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    createCharts() {
      this.createSalVolChart();
      this.createNumberOfRentalsChart();
      this.createNumOfObjChart();
      this.key++;
    },
    createSalVolChart() {
      let labels = [];
      let chartData = [];
      let colors = [];
      for (let cat of this.categories) {
        let filteredProducts = this.products.filter(
          (prod) => prod.type === cat.name
        );
        labels.push(cat.name);
        let sum = 0;
        if (filteredProducts) {
          for (let prod of filteredProducts) {
            sum += prod.totalSales;
          }
        }
        chartData.push(sum);
        colors.push(this.getRandomColor());
      }
      this.data.push({
        labels: labels,
        datasets: [
          {
            label: "Sales Volume per Category",
            backgroundColor: colors,
            borderColor: colors,
            data: chartData,
          },
        ],
      });
    },
    createNumberOfRentalsChart() {
      let labels = [];
      let chartData = [];
      let colors = [];
      for (let cat of this.categories) {
        let filteredProducts = this.products.filter(
          (prod) => prod.type === cat.name
        );
        labels.push(cat.name);
        let sum = 0;
        if (filteredProducts) {
          for (let prod of filteredProducts) {
            sum += prod.numberOfRents;
          }
        }
        chartData.push(sum);
        colors.push(this.getRandomColor());
      }
      this.data.push({
        labels: labels,
        datasets: [
          {
            label: "Numbers of Rentals per Category",
            backgroundColor: colors,
            borderColor: colors,
            data: chartData,
          },
        ],
      });
    },
    createNumOfObjChart() {
      let labels = [];
      let chartData = [];
      let colors = [];
      for (let cat of this.categories) {
        let filteredProducts = this.products.filter(
          (prod) => prod.type === cat.name
        );
        labels.push(cat.name);
        let numOfObj = 0;
        if (filteredProducts) {
          numOfObj = filteredProducts.length;
        }
        chartData.push(numOfObj);
        colors.push(this.getRandomColor());
      }
      this.data.push({
        labels: labels,
        datasets: [
          {
            label: "Numbers of Objects per Category",
            backgroundColor: colors,
            borderColor: colors,
            data: chartData,
          },
        ],
      });
    },
    getRandomColor() {
      return "#" + (Math.random().toString(16) + "0000000").slice(2, 8);
    },
    route(path) {
      this.$router.push({ path: path });
    },
  },
};
</script>

<style scoped>
.button-wrapper{
  display: flex;
  justify-content: space-around;
}

.chart-wrapper {
  display: flex;
  justify-content: center;
}
</style>