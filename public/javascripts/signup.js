let kirish;
$(document).ready(function() {
  // $('select').material_select();
  kirish = document.getElementById("kirish");
  kirish.onclick = function() {
  	let first_name = document.getElementById("first_name");
  	let last_name = document.getElementById("last_name");
  	let email = document.getElementById("email");
  	let phone = document.getElementById("phone");
  	if(!first_name.value || !last_name.value || !phone.value || !ValidateEmail(email.value)) {
  		M.toast({html: 'Iltimos barcha maydonlarni to\'ldiring'});
  	} else {
  		M.toast({html: 'OK'});
  		location.pathname = "/view";
  	}
  }
});
function ValidateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    return (false)
}