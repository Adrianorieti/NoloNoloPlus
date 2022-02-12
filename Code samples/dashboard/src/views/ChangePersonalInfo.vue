<template>
<div>
    <form aria-labelledby="change-manager" v-on:submit.prevent="sendData()">
        <fieldset>
        <legend id="change-manager">Change Your's Informations</legend>
        <div class="image-wrapper" v-if="manager.image">
            <img
                :src="'http://site202145.tw.cs.unibo.it/images/employees/' + manager.image"
                alt="employee profile pic"
            />
        </div>
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
                required="required"
            />
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
                pattern="[0-9]{10}"
                title="not a valid phone number"
            />
            </div>
        </div>

        <div>
            <label for="file" class="form-label">Photo</label>
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
            />
            </div>
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

        <input type="submit" class="btn btn-primary" value="Update" />
        </fieldset>
    </form>
</div>
</template> 

<script>
//quello che voglio fare qui è:
// o avere varie carte con varie funzionalità (aggiunta categoria e employee.)
//o essere un wrapper di funzionalità per mandare ad altre pagine.
//il discount lo mettiamo sempre medio, poi il resto vediamo, il price lo facciamo inserire

export default {
    name: "ManagerForm",
  data() {
      return {
        manager: {},
        name: "",
        surname: "",
        phone: 0,
        password: "",
        repeatPassw: "",
        repeatPasswError: "",
        showRepPassw: false,
        showPassword: false,
    };
  },
    async mounted() {
    let url = "http://site202145.tw.cs.unibo.it/api/manager/";
    try {
      let response = await fetch(url);
      let man = await response.json();
      let myEmail = sessionStorage.getItem("email");
      for(let m of man){
          if(m.email === myEmail){
              this.manager = m;
              this.name = m.name;
              this.surname = m.surname;
              this.phone = m.phone;
              break;
          }
      }
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    sendData() {
        if(this.check()){
            let photo = document.getElementById("file").files[0];
            let formData= new FormData();
                formData.append("name", this.name);
                formData.append("surname", this.surname);
                formData.append("phone", this.phone);
            if(photo){
                formData.append("img", photo);
                formData.append("oldImg", this.manager.image);
            }
            else if(this.password !== ""){
                formData.append("password", this.password);
            }
            fetch("http://site202145.tw.cs.unibo.it/api/manager/"+this.manager.email, {
                method: "PATCH",
                body: formData,
            })
            .then((response) => {
                if(response.status === 200){
                    this.$router.go(0);
                }
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
  },
};
</script>

<style scoped>
form {
  display: flex;
  justify-content: center;
}
fieldset {
  width: 50%;
  padding: 1rem;
  border: 1px solid black;
  border-radius: 2%;
}

image{
    max-width: 15rem;
    max-height: 15rem;
}

.back {
  margin-left: 2rem;
}

.show-password {
  background-color: transparent !important;
}


.error {
  font-size: 1em;
  color: red;
}
</style>