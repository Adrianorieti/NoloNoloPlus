<template>
  <div>
    <div class="search-wrapper">
      <div class="form-floating w-75">
        <input
          type="text"
          class="form-control"
          id="floatingFilter"
          v-model="searchQuery"
          placeholder="Product Name"
        />
        <label for="floatingFilter">Filter for Product Name</label>
      </div>
    </div>
    <div class="divide">
      <div
        class="card custom-card"
        v-for="product in resultQuery"
        :key="product.name"
      >
        <img
          :src="'http://localhost:8001/images/categories/' + product.image"
          class="card-img-top"
          alt="product pic"
        />
        <div class="card-body">
          <h5 class="card-title">
            <a
              :href="'/products/' + product.name"
              @click.prevent="route('/dashboard/products/' + product.name)"
              class="stretched-link st_link_dec"
            >
              {{ product.name }}</a
            >
          </h5>
          <p class="card-text">Category: {{ product.type }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Products",
  data() {
    return {
      products: [],
      searchQuery: "",
    };
  },
  mounted() {
    let url = "http://site202145.tw.cs.unibo.it/api/products/";
    fetch(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((data) => {
        this.products = data.productList;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  computed: {
    resultQuery() {
      if (this.searchQuery) {
        return this.products.filter((product) => {
          return this.searchQuery
            .toLowerCase()
            .split(" ")
            .every((v) => product.name.toLowerCase().includes(v));
        });
      } else {
        return this.products;
      }
    },
  },
  methods: {
    route(path) {
      this.$router.push({ path: path });
    },
  },
};
</script>

<style scoped>
.st_link_dec {
  text-decoration: none;
  color: black;
  font-size: 1.3em;
}

.divide {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: space-around;
}

img{
  max-height: 25rem;
}

.custom-card {
  max-width: 20rem;
  margin-top: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
}

.custom-card:hover {
  box-shadow: 5px 10px 20px 5px rgba(0, 0, 0, 0.4);
  transform: scale(1.1);
}

.search-wrapper {
  display: flex;
  justify-content: center;
}
</style>
