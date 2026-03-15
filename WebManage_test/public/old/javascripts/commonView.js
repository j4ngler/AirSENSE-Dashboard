

function checkUserAuthen2() {
    var mname = localStorage.getItem("tocken_LVC");
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/api/auth/user',
        data: {
            user: "check"
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + mname);
        },
        success: function (authen) {
            console.log('authen success');
            if (!authen) {
                $("#managerAuthen").attr("href", "login");
                $("#managerAuthen").html('Login');
               // window.location.href = "/login";
            }

        },
        complete: function (authen) {
            console.log('authen complete')
            console.log(authen.responseText);
        },
        error: function (authen) {
            console.log('authen error');
            console.log(authen);
        }
    });
}

function checkUserAuthenSecsion() {
    localStorage.setItem("role", "none");
    var mname = localStorage.getItem("tocken_LVC");
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/api/auth/user',
        data: { user: "check" },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + mname);
        },
        success: function (authen) {
            if(authen == false) {
                console.log("authen falsejjjj")
                $("#managerAuthen").attr("href", "login");
                $("#managerAuthen").html('Login');
               // window.location.href = "/login";
            }
            localStorage.setItem("role", authen.role);
            var role = localStorage.getItem("role");
            if(role=="manager" || role =="supporter") {
                $('#report-station').show();
                $('#manager-station').show();
            }
            if(role=="manager") {
                $('#manage-user').show();
                $('#manage-blog').show();
            }
        },
        error: function (authen) {
            console.log('authen error')
            console.log(authen);
            $("#managerAuthen").attr("href", "login");
            $("#managerAuthen").html('Login');
            //window.location.href = "/login";
        }
    });
}

function gotoRegister() {
    window.location.href = "/register";
}
function gotoCheckUserStorage() {
    var userData = localStorage.getItem("name_LVC");
    if (userData) {
        $("#managerAuthen").attr("href", "profile");
        $("#managerAuthen").html(userData);
        $("#managerLogout").attr("href", "logout");
        $("#managerLogout").html("Đăng xuất");
    }
    else {
        $("#managerAuthen").attr("href", "login");
        $("#managerAuthen").html('Login');
        $("#managerLogout").attr("href", "logout");
        $("#managerLogout").html("");
    }
}

function showLoader() {
    document.getElementById("loader-container").style.display = 'block';
}

function hideLoader() {
    document.getElementById("loader-container").style.display = 'none';
}

function notify(message, status) {
    var x = document.getElementById("snackbar");
    x.innerHTML  = message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    document.getElementById("snackbar").classList.add(status);
}
// When the user clicks anywhere outside of the modal, close it
