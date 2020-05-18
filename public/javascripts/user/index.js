function contentLoad() {
	let body = document.getElementsByTagName('body')[0];
	body.style.display = 'block';
	$('.contents').click(function(e) {
		let content_id  = this.getAttribute('data-video-src');
		let video = document.getElementById('video');
		video.src = '/site/v/'+content_id;
		video.webkitRequestFullscreen();
		video.play();
	});
}
function signInUser(){
	let fio = prompt("Familiya Ism Sharifingizni to'liq kiriting: ")
	let tel = prompt("Telefon raqamingizni kiritng: ");
	if(fio && tel) {
		$.ajax({
			url: '/user/register',
			type: 'POST',
			dataType: 'json',
			data: {full_name: fio, phone_number: tel},
			success: (data) => {
				console.log(data);
				if(!data.error) {
					let body = document.getElementsByTagName('body')[0];
					localStorage.setItem("fio", fio);
					localStorage.setItem("accessToken", data.accessToken);
					localStorage.setItem("refreshToken", data.refreshToken);
					localStorage.setItem("_id", data._id);
					body.style.display = 'block';
					contentLoad();
				} else if(data.error == 1) {
					alert("Kechirasiz bunday telefon raqamli foydalanuvchi mavjud ma'lumotlarni qayta kiriting!");
					signInUser();
				}
			}
		});
	}
}
let body = document.getElementsByTagName('body')[0];
	console.log(body.style.display);
$(document).ready(function(){
	$('.sidenav').sidenav();
	let body = document.getElementsByTagName('body')[0];
	console.log(body.style.display);
	body.style.display = 'none';
	if(!localStorage.getItem('_id')) {
		signInUser();
	} else {
		$.ajax({
			url: '/user/access/'+localStorage.getItem('_id'),
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				console.log(data);
				if(data.error != 0) {
					alert(data.message);
					body.style.display = 'none';
				} else {
					for(let i in data.user.access_content){
						if(data.user.access_content[i].access == false || data.user.access_content[i].access == "false") {
							$("#"+data.user.access_content[i].content_id).addClass('disabled');
						}
					}
					contentLoad();
				}
			}
		});

	}
});
