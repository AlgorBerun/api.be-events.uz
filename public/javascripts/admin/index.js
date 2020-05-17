function contentLoad() {
	$.ajax({
		url: '/admin/content',
		type: 'GET',
		dataType: 'json',
		success: (data) => {
			let docs = data;
			let rows = [];
			for(let i in docs) {
				rows.push(`<tr><td>${(i+1)}</td><td>${docs[i].name}</td><td>${docs[i].section}</td><td><button class="delete-content btn-floating btn-small waves-effect waves-light red" id="${docs[i]._id}"><i class="material-icons">delete</i></button></td></tr>`)
			}
			$('#tbody').html(rows.join(''));
			$('.delete-content').click(function(event) {
				deleteContent($(this).attr('id'));
				console.log($(this).attr('id'));
			})
		},
		error: (err) => {
			console.log(err);
		}
	});
}
function deleteContent(id) {
	$.ajax({
		url: '/admin/content/'+id,
		type: 'DELETE',
		dataType: 'json',
		success: (data) => {
			console.log(data);
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


	$("#uploadForm").on('submit', function(e){
        e.preventDefault();
        $.ajax({
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = ((evt.loaded / evt.total) * 100);
                        $(".progress-bar").width(percentComplete + '%');
                        $(".progress-bar").html(percentComplete+'%');
                    }
                }, false);
                return xhr;
            },
            type: 'POST',
            url: '/admin/content/',
          headers: {
            "admin-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsX25hbWUiOiJEb3N0b24iLCJfaWQiOiI1ZWI3NmM4MThkZWQwYzI1NTQ0ZGZkMjEiLCJpYXQiOjE1ODkwNzkxNjksImV4cCI6Ni4wMDAwMDAwMDAwMDAwMTZlKzIzfQ.f1bM2Hw4_o89-0_XUzK2oBVWEJWPQlHLRSGNaqSug"
          },
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData:false,
            beforeSend: function(){
                $(".progress-bar").width('0%');
                $('#uploadStatus').html('<img src="images/loading.gif"/>');
            },
            error:function(){
                $('#uploadStatus').html('<p style="color:#EA4335;">File upload failed, please try again.</p>');
            },
            success: function(resp){
              console.log(resp);
                if(resp == 'ok'){
                    $('#uploadForm')[0].reset();
                    $('#uploadStatus').html('<p style="color:#28A74B;">File has uploaded successfully!</p>');
                }else if(resp == 'err'){
                    $('#uploadStatus').html('<p style="color:#EA4335;">Please select a valid file to upload.</p>');
                }
                contentLoad();
            }
        });
    });
	
    // File type validation
    $("#fileInputImg").change(function(){
        var allowedTypes = ['application/pdf', 'application/zip', 'application/msword', 'application/vnd.ms-office', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        var file = this.files[0];
        var fileType = file.type;
        if(!allowedTypes.includes(fileType)){
            alert('Please select a valid file (PDF/DOC/DOCX/JPEG/JPG/PNG/GIF).');
            $("#fileInput").val('');
            return false;
        }
    });
});