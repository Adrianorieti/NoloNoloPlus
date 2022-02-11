<template>
  <form aria-labelledby="register-employee" v-on:submit.prevent="sendData()">
    <fieldset>
      <legend id="register-employee">Add a new Employee</legend>
      <div>
        <label for="firstName" class="form-label">First Name</label>
        <div class="input-group">
          <div class="input-group-text">
            <i
              class="bi bi-person-circle"
              aria-hidden="true"
              style="font-size: 1rem"
            ></i>
          </div>
          <input
            v-model="name"
            id="firstName"
            type="text"
            class="form-control"
            placeholder="John"
            required="required"
          />
        </div>
      </div>

      <div>
        <label for="secondName" class="form-label">Second Name</label>
        <div class="input-group">
          <div class="input-group-text">
            <i
              class="bi bi-person-circle"
              aria-hidden="true"
              style="font-size: 1rem"
            ></i>
          </div>
          <input
            v-model="surname"
            id="secondName"
            type="text"
            class="form-control"
            placeholder="Doe"
            required="required"
          />
        </div>
      </div>

      <div>
        <label for="role" class="form-label">Role</label>
        <div class="input-group">
          <div class="input-group-text">
            <i
              class="bi bi-person-circle"
              aria-hidden="true"
              style="font-size: 1rem"
            ></i>
          </div>
          <select class="form-select" required v-model="role" id="role">
            <option value="" selected disabled>Please select one</option>
            <option value="employee">Admin</option>
            <option value="manager">Manager</option>
          </select>
        </div>
      </div>

      <div>
        <label for="phone" class="form-label">Phone Number</label>
        <div class="input-group">
          <div class="input-group-text">
            <i
              class="bi bi-telephone-fill"
              aria-hidden="true"
              style="font-size: 1rem"
            ></i>
          </div>
          <input
            v-model="phone"
            id="phone"
            type="tel"
            class="form-control"
            required="required"
            placeholder="0123456789"
            pattern="[0-9]{10}"
            title="not a valid phone number"
          />
        </div>
      </div>

      <div>
        <label for="file" class="form-label">Employee Photo</label>
        <div class="input-group">
          <div class="input-group-text">
            <i
              class="bi bi-paperclip"
              aria-hidden="true"
              style="font-size: 1rem"
            ></i>
          </div>
          <input
            id="file"
            type="file"
            class="form-control"
            required="required"
          />
        </div>
      </div>

      <div>
        <label for="email" class="form-label">Email</label>
        <div class="input-group">
          <div class="input-group-text">
            <i
              class="bi bi-envelope"
              aria-hidden="true"
              style="font-size: 1rem"
            ></i>
          </div>
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
        </div>
        <label id="registermail-error" for="email" class="error">{{
          this.emailError
        }}</label>
      </div>

      <div>
        <label for="password" class="form-label">Password</label>
        <div class="input-group">
          <div class="input-group-text">
            <i
              class="bi bi-lock-fill"
              aria-hidden="true"
              style="font-size: 1rem"
            ></i>
          </div>
          <input
            v-model="password"
            id="password"
            type="password"
            class="form-control"
            required="required"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Password must contain a number, a capital letter and a length of at least 8 characters"
          />
          <div class="input-group-text show-password">
            <i
              :class="{
                'bi bi-eye-slash-fill': !showPassword,
                'bi bi-eye-fill': showPassword,
              }"
              role="button"
              aria-label="show password"
              tabindex="0"
              @click="changePassVisibility()"
              style="font-size: 1rem"
            ></i>
          </div>
        </div>
      </div>

      <div>
        <label for="repeatPassword" class="form-label">Repeat Password</label>
        <div class="input-group">
          <div class="input-group-text">
            <i
              class="bi bi-lock-fill"
              aria-hidden="true"
              style="font-size: 1rem"
            ></i>
          </div>
          <input
            v-model="repeatPassw"
            id="repeatPassword"
            type="password"
            class="form-control"
            required="required"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Password must contain a number, a capital letter and a length of at least 8 characters"
          />
          <div class="input-group-text show-password">
            <i
              :class="{
                'bi bi-eye-slash-fill': !showRepPassw,
                'bi bi-eye-fill': showRepPassw,
              }"
              role="button"
              aria-label="show password"
              tabindex="0"
              @click="changeRepPassVisibility()"
              style="font-size: 1rem"
            ></i>
          </div>
        </div>
        <label for="repeatPassword" class="error">{{
          this.repeatPasswError
        }}</label>
      </div>

      <input type="submit" class="btn btn-primary" value="Create" />
      <button class="btn btn-warning back" @click="route()">Back</button>
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
      role: "",
      phone: "",
      email: "",
      password: "",
      repeatPassw: "",
      repeatPasswError: "",
      emailError: "",
      showRepPassw: false,
      showPassword: false,
    };
  },
  methods: {
    sendData() {
      if (this.check()) {
        let photo = document.getElementById("file").files[0];
        let formData = new FormData();
        formData.append("img", photo);
        formData.append("name", this.name);
        formData.append("surname", this.surname);
        formData.append("phone", this.phone);
        formData.append("email", this.email);
        formData.append("password", this.password);
        if (!this.role) {
          this.role = "employee";
        }
        fetch("http://localhost:8001/api/" + this.role + "/" + this.email, {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data.message);
            this.route();
          })
          .catch((err) => {
            console.log(err);
          });
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
    changePassVisibility() {
      let input = document.getElementById("password");
      if (this.showPassword) {
        //if it's true, i'm showing the passw
        input.type = "password";
        this.showPassword = !this.showPassword;
      } else {
        input.type = "text";
        this.showPassword = !this.showPassword;
      }
    },
    changeRepPassVisibility() {
      let input = document.getElementById("repeatPassword");
      if (this.showRepPassw) {
        //if it's true, i'm showing the passw
        input.type = "password";
        this.showRepPassw = !this.showRepPassw;
      } else {
        input.type = "text";
        this.showRepPassw = !this.showRepPassw;
      }
    },
    route() {
      this.$router.push({ path: "/dashboard/employees" });
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

.show-password {
  background-color: transparent !important;
}

.back {
  margin-left: 2rem;
}
</style>