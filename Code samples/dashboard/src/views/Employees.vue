<template>
  <div>
    <div class="search-wrapper">
      <div class="form-floating w-75">
        <input
          type="email"
          class="form-control"
          id="floatingFilter"
          v-model="searchQuery"
          placeholder="username@domain.it"
        />
        <label for="floatingFilter">Filter for Email Address</label>
      </div>
      <button
        type="button"
        class="btn btn-outline-success"
        @click="route('employees/create')"
      >
        CREATE EMPLOYEE
      </button>
    </div>
    <div class="divide">
      <div
        class="card custom-card"
        v-for="employee in resultQuery"
        :key="employee.email"
      >
        <img
          :src="'http://localhost:8001/images/employees/' + employee.image"
          class="card-img-top"
          alt="employee profile pic"
        />
        <div class="card-body">
          <h5 class="card-title">
            <a
              :href="'/employee/' + employee.email"
              @click.prevent="route('/dashboard/employees/' + employee.email)"
              class="stretched-link st_link_dec"
            >
              {{ employee.email }}</a
            >
          </h5>
          <p class="card-text">
            Full Name: {{ employee.name + " " + employee.surname }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "employees",
  data() {
    return {
      employees: [],
      searchQuery: "",
    };
  },
  mounted() {
    let url = "http://site202145.tw.cs.unibo.it/api/employee/";
    fetch(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((data) => {
        this.employees = data.emp;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  computed: {
    resultQuery() {
      if (this.searchQuery) {
        return this.employees.filter((employee) => {
          return this.searchQuery
            .toLowerCase()
            .split(" ")
            .every((v) => employee.email.toLowerCase().includes(v));
        });
      } else {
        return this.employees;
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
  justify-content: space-around;
}

.btn {
  margin-left: 1rem;
}
</style>