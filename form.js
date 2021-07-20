const email = document.getElementById("exampleInputEmail1") 
const password = document.getElementById("exampleInputPassword1")
const form = document.getElementById("form")
const error = document.getElementById("error")

form.addEventListener("submit", (e) => {
    let messages = []

    if(email.value === "" || email.value === null)
        messages.push("Email is required")

    if(messages.length > 0)
        e.preventDefault() // evita che venga effettuata l'operazione di default quando si clicca submit
        error.innerText = messages.join()
        document.getElementById("error").style.color = '#d00'

})