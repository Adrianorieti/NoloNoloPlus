<template>
  <div>
    <div class="button-wrapper">
      <button @click="changeType('bar')">bar</button>
      <button @click="changeType('line')">line</button>
    </div>
    <div class="chart-wrapper">
      <chart :type="type" :chartdata="data" :id="'ProductsCharts'" :key="key" />
    </div>
  </div>
</template>

<script>
import chart from "../components/chart";

export default {
  name: "ProductCharts",
  data() {
    return {
      key: 0,
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
  methods: {
    changeChart() {
      let attribute;
      if (this.chartView === "rental") {
        attribute = "numberOfRents";
      } else if (this.chartiView === "conditions") {
        attribute = "status"; //serve trovare un altro modo per stampare lo status
      } else {
        attribute = "totalSales";
      }
      let mappedProducts = this.products.map((prod) => ({
        name: prod.name,
        attribute: prod[attribute],
      }));
      let labels = [];
      let chartData = [];
      let colors = [];
      for (let prod of mappedProducts) {
        labels.push(prod.name);
        chartData.push(prod.attribute);
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