<template>
  <div class="home">
    <h1>questa diventerà una pagina piena di magnifici grafici</h1>
    <b-button @click="prova">ciao</b-button>
  </div>
</template>

<script>

export default {
  name: 'Home',
  methods : {
    prova() {
      let options = {
        // Creiamo il payload da mandare al server
          method: 'GET',
          headers: new Headers({ 'Content-type': 'application/json'})
        };
      let url = 'http://localhost:8001/api/customer/name';
      fetch(url, options)
        .then(response => {
          if (response.status == 200) {
            return response.json();
          }
        }).then(data =>{
          console.log(data);
        })
      console.log("prova fatta");
    }
  }
}
</script>
