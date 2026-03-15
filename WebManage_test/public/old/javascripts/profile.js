$( document ).ready(function() {
    var mname = localStorage.getItem("tocken_LVC");
    $(".cancel").on("click",function() {
        getUser();
    });

    $(".save").on("click",function() {
        saveUser();
    });

    function getUser() {
        showLoader();
        var link = "/api/auth/user";
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: link,
            data: {},
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer '+mname);
            },
            success: function (data) {
                var user =data.user;
                hideLoader();
                $('#userid').val(user.userid);
                $('#fullname').val(user.fullname);
                $('#email').val(user.email);
                $('#phone').val(user.phoneNumber);
                $('#contact').val(user.contact);
                $('#role').val(user.content);
                $('#avatar').attr("src",user.avatar);
            },
            error: function (err) {
                hideLoader();
                console.log(err);
            }
        });
    }

    getUser();

    function saveUser() {
        var user = {};
        user.userid = $('#userid').val();
        user.fullname = $('#fullname').val();
        user.email = $('#email').val();
        user.phoneNumber = $('#phone').val();
        user.contact = $('#contact').val();
        user.table = "users";
        if(!(user.fullname && user.email)) {
            notify("Input is invalid!", "warning");
            return;
        }
        var link = "/api/users/manager_update";
        showLoader();
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: link,
            //data: user,
            data: JSON.stringify(user), // body data type must match "Content-Type" header
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            dataType: 'json',
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+mname,
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            success: function (user) {
                getUser();
                notify("Update successfully!", "success");
            },
            error: function (err) {
                hideLoader();
                notify("Some thing went wrong!", "error");
                console.log(err);
            }
        });
    }
    
});