function login(event)
      {
        event.preventDefault();
          let mail = $('#inputEmail').val();
          let pass = $('#inputPassword').val();
         
          const encodedpass = btoa(pass);
          console.log(pass);
          let data = `{
            "email": "${mail}",
            "password": "${encodedpass}"
          }`;

          $.post({
            type: 'POST',
              url: 'http://localhost:8001/api/account/login/admin',
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              data: data
            }, function(data){
              sessionStorage.setItem('token', data.accessToken);
              sessionStorage.setItem('email', mail);
              window.location.href = `http://localhost:8001/employee/panel`;
            }).fail(function(err)
            {
              document.getElementById('err').innerHTML ="Invalid credentials";
            })
}
/** Get all single products from database */
function goToRentalHypothesis()
{
  sessionStorage.clear();
  window.location.href = `http://localhost:8001/employee/rentalHypothesis`;
}