<template>
  <form aria-labelledby="register-employee" v-on:submit.prevent="sendData()">
    <fieldset>
      <legend id="register-employee">Add a new Employee</legend>
      <div class="form">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-person-circle"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            <path
              fill-rule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
            />
          </svg>
        </span>
        <input
          v-model="name"
          id="firstName"
          type="text"
          class="form-control"
          placeholder="John"
          required="required"
        />
        <label for="firstName" class="form-label">First Name</label>
      </div>

      <div class="mb-3">
        <label for="secondName" class="form-label">Second name</label>
        <input
          v-model="surname"
          id="secondName"
          type="text"
          class="form-control"
          placeholder="Doe"
          required="required"
        />
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          v-model="email"
          id="email"
          type="email"
          class="form-control"
          placeholder="username@studio.unibo.it"
          required="required"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          title="not valid email"
        />
        <label id="registermail-error" for="email" class="error"
          >{this.emailError}</label
        >
      </div>

      <div class="mb-3">
        <label for="phone" class="form-label">Phone Number</label>
        <input
          v-model="phone"
          id="phone"
          type="tel"
          class="form-control"
          required="required"
          pattern="[0-9]{10}"
          title="not a valid phone number"
        />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          v-model="password"
          id="password"
          type="password"
          class="form-control"
          required="required"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Password must contain a number, a capital letter and a length of at least 8 characters"
        />
      </div>

      <div class="mb-3">
        <label for="repeatPassword" class="form-label">Repeat Password</label>
        <input
          v-model="repeatPassw"
          id="repeatPassword"
          type="password"
          class="form-control"
          required="required"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Password must contain a number, a capital letter and a length of at least 8 characters"
        />
        <label for="repeatPassword" class="error"
          >{this.repeatPasswError}</label
        >
      </div>

      <input type="submit" class="btn btn-primary" value="Create" />
    </fieldset>
  </form>
</template> 

<script>
export default {
  name: "EmployeeForm",
  data() {
    return {
      name: "",
      surname: "",
      phone: "",
      email: "",
      password: "",
      repeatPassw: "",
      repeatPasswError: "",
      emailError: "",
    };
  },
  methods: {
    sendData() {
      if (this.check) {
        alert("stiamo mandando dati");
        //   fetch("http://localhost:8001/api/categories/", {
        //     method: "POST",
        //     body: formData,
        //   })
        //     .then((response) => {
        //       return response.json();
        //     })
        //     .then((data) => {
        //       console.log(data.message);
        //       this.name = "";
        //       this.description = "";
        //       this.price = 0;
        //     })
        //     .catch((err) => {
        //       console.log(err);
        //     });
      }
    },
    check() {
      if (this.password !== this.repeatPassw) {
        this.repeatPasswError = "Passwords do not match";
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style scoped>
.error {
  font-size: 1em;
  color: red;
}

form {
  display: flex;
  justify-content: center;
}
fieldset {
  width: 50%;
  padding: 1rem;
  border: 1px solid black;
  border-radius: 5%;
}
</style>