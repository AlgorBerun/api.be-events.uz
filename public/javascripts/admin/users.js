let users = [];
function contentLoad() {
	$.ajax({
		url: '/admin/users',
		type: 'GET',
		dataType: 'json',
		success: (data) => {
			let docs = data;
            users = docs;
			let rows = [];
				
			for(let i in docs) {
                let n = Number(i)+1;
                rows.push(`<tr>
                            <td>${(n)}</td>
                            <td>${docs[i].full_name}</td>
                            <td>${docs[i].phone_number}</td>
                            <td>
                                <button class="delete-user btn-floating btn-small waves-effect waves-light red" id="${docs[i]._id}">
                                    <i class="material-icons">delete</i>
                                </button>
                                <button data-target="modal1" id="${i}" data-id="${docs[i]._id}" class="edit-access-user btn-floating btn-small waves-effect waves-light green modal-trigger">
                                    <i class="material-icons">content_paste</i>
                                </button>
                            </td>
                        </tr>`)
			}
			$('#tbody').html(rows.join(''));
            $('.delete-user').click(function(event) {
                deleteUser($(this).attr('id'));
            });
			$('.edit-access-user').click(function(event) {
				editAccessUser($(this).attr('data-id'));
			});
            $('.modal').modal();
		},
		error: (err) => {
			console.log(err);
		}
	});
}
function editAccessUser(id) {
	$.ajax({
		url: '/admin/user/'+id,
		type: 'GET',
		dataType: 'json',
		success: (data) => {
			console.log(data);
            $('#model-content').html('');
            let email = (data.email)? data.email : "Emailini kiritmagan";
            let d = new Date(data.created_at);
            let date = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds();
			let info = `
                <b>FIO:</b> ${data.full_name}; <br/>
                <b>Telefon raqami:</b> ${data.phone_number}; <br/>
                <b>Email:</b> ${email}; <br/>
                <b>Ro'yxatdan o'tgan sanasi:</b> ${date}; <br/>
                <hr />
                `;
            let rows = [];
            for(let i=0; i<data.access_content.length; i++) {
                rows.push(`
                        <tr>
                            <td>${(i+1)}</td>
                            <td>${data.access_content[i].content_name}</td>
                            <td>
                                <div class="switch">
                                    <label>
                                      Off
                                      <input type="checkbox" class="my-check" 
                                        checked="${new Boolean(data.access_content[i].access)}"
                                        data-id="${data.access_content[i].content_id}" 
                                        data-index="${i}" 
                                        id="id${i}" 
                                        data-user-id="${data._id}" />
                                      <span class="lever"></span>
                                      On
                                    </label>
                                </div>
                            </td>
                        </tr>
                    `)
            }
            let tbody = `<tbody>${rows.join('')}</tbody>`;
            let table = `
                <table class="highlight">
                    <thead>
                        <th>#</th>
                        <th>Video nomi</th>
                        <th>Ruxsat berish</th>
                    </thead>
                    ${tbody}
                </table>
            `;
            $('#model-content').html(info+table);
            let ch = document.getElementsByClassName("my-check");
            console.clear();
            console.log(ch);
            for(let i=0; i<ch.length; i++) {
                let dasd = (ch[i].checked == "false")? false : true;
                console.log(ch[i].id);
                console.log(typeof ch[i].checked);
                console.log(ch[i].checked);
                $("#id"+i).prop('checked', dasd);
            }
            $(".switch").find("input[type=checkbox]").on("change",function() {

                var status = $(this).prop('checked');
                console.log($(this).attr('data-id')+ " " + status);
                let user_id = $(this).attr('data-user-id');
                let content_id = $(this).attr('data-id');
                let access_content_index = $(this).attr('data-index');
                let access = $(this).prop('checked');
                $.ajax({
                    url: `/admin/access_content/${user_id}/${content_id}/${access_content_index}/${access}`,
                    type: 'GET',
                    dataType: 'JSON',
                    success: (data) => {
                        console.log('ruxsat berish o\'xshadi');
                    },  
                    error: (err) => {
                        console.log(err);
                        alert("Ruxsat amali o'xshamadi!");
                    }
                });
                
            });
		},
		error: (err) => {
			console.log(err);
		}
	});
}
function deleteUser(id){
    $.ajax({
     url: '/admin/user/'+id,
     type: 'DELETE',
     dataType: 'json',
     success: (data) => {
         contentLoad();
     },
     error: (err) => {
         console.log(err);
     }
    });
}
jQuery(document).ready(function($) {
	contentLoad();
	$('.modal').modal();
	$('.sidenav').sidenav();
});