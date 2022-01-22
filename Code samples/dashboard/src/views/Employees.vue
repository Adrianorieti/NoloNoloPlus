<template>
  <div>
    <div class="card-list">
      <card
        v-for="employee in employees"
        :key="employee.email"
        :title="employee.name + ' ' + employee.surname"
        :email="employee.email"
        :path="'employees/' + employee.email"
      />
    </div>
  </div>
</template>

<script>
import card from "../components/imagecard";

export default {
  name: "employees",
  data() {
    return {
      employees: [],
    };
  },
  components: {
    card,
  },
  mounted() {
    this.getAllEmployees();
  },
  methods: {
    getAllEmployees() {
      let fetch_options = {
        method: "GET",
        headers: new Headers({ "Content-type": "application/json" }),
      };
      let url = "http://localhost:8001/api/employee/rest/";
      fetch(url, fetch_options)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((data) => {
          this.employees = data.employees;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.card-list {
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
</style>