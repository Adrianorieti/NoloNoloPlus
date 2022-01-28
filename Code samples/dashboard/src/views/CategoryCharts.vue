<template>
  <div>
    <div class="button-wrapper">
      <button @click="changeType('bar')">bar</button>
      <button @click="changeType('line')">line</button>
    </div>
    <div class="chart-wrapper">
      <chart
        :type="type"
        :chartdata="data"
        :id="'categoriesCharts'"
        :key="key"
      />
    </div>
  </div>
</template>

<script>
import chart from "../components/chart";

export default {
  name: "CategoryCharts",
  data() {
    return {
      key: 0,
      categories: [],
      products: [],
      data: {},
      type: "bar",
    };
  },
  props: ["chartView"],
  watch: {
    chartView() {
      this.changeChart();
    },
  },
  components: {
    chart,
  },
  mounted() {
    let fetch_options = {
      method: "GET",
      headers: new Headers({ "Content-type": "application/json" }),
    };
    let url = "http://localhost:8001/api/category/";
    fetch(url, fetch_options)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((data) => {
        this.categories = data.category;
        this.takeProducts();
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    takeProducts() {
      let fetch_options = {
        method: "GET",
        headers: new Headers({ "Content-type": "application/json" }),
      };
      let url = "http://localhost:8001/api/customer/product";
      fetch(url, fetch_options)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((data) => {
          this.products = data.products;
          this.changeChart();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeChart() {
      let labels = [];
      let chartData = [];
      let colors = [];
      for (let cat of this.categories) {
        let filteredProducts = this.products.filter(
          (prod) => prod.type === cat.name
        );
        labels.push(cat.name);
        if (
          this.chartView === "numberOfRents" ||
          this.chartView === "totalSales"
        ) {
          let sum = 0;
          for (let prod of filteredProducts) {
            sum += prod[this.chartView];
          }
          chartData.push(sum);
        } else {
          chartData.push(filteredProducts.length);
        }
        colors.push(this.getRandomColor());
      }
      this.data = {
        labels: labels,
        datasets: [
          {
            label: "roba a casa",
            backgroundColor: colors,
            borderColor: colors,
            data: chartData,
          },
        ],
      };
      this.key += 1;
    },
    changeType(chartype) {
      this.type = chartype;
      this.key += 1;
    },
    getRandomColor() {
      return "#" + (Math.random().toString(16) + "0000000").slice(2, 8);
    },
  },
};
</script>

<style scoped>
.button-wrapper {
  display: flex;
  justify-content: center;
}
</style>