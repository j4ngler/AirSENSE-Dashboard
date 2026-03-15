
//login
function login(){
    $.ajax({
            type: 'post',
            method: 'POST',
            url: '/api/auth/login',
         //   body: JSON.stringify({type:dataView}), // body data type must match "Content-Type" header
            data: JSON.stringify( {
                email: $("#mname").val(),
                password: $("#mpass").val()
            }), // body data type must match "Content-Type" header
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
                'Authorization': 'Beard ' + localStorage.getItem('token'),
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },


success: function(loadcofig) {
  console.log(loadcofig);
  console.log(loadcofig);
  if (loadcofig.tocken) {
      localStorage.setItem("tocken_AIRSENSE", loadcofig.tocken);
      localStorage.setItem("name_AIRSENSE", mname);
      localStorage.setItem("username_AIRSENSE", loadcofig.userName);
      window.location.href = "/";
  } else {
      alert("Thông tin đăng nhập lỗi,Xin vui lòng thử lại");
  }
},
complete: function(loadcofig) {
  console.log(loadcofig.responseText);
},
error: function(loadcofig) {
  console.log(loadcofig);
}
});
}



// log out

function gotoLogout() {
    var mname = localStorage.getItem("tocken_AIRSENSE");

    $.ajax({
        type: 'post',
        dataType: 'json',
        url: '/api/auth/logout',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + mname);
        },
        data: {},
        success: function(loadcofig) {
            console.log('loadcofig in success: ',loadcofig)
            if (loadcofig.responseText == "ok") {
                localStorage.setItem("tocken_AIRSENSE", '');
                localStorage.setItem("name_AIRSENSE", '');
                alert("Bạn đã đăng xuât thành công");
                window.location.href = "/";
            } else {
                alert("Xin vui lòng thử lại");
            }

        },
        complete: function(loadcofig) {
            console.log('loadcofig in complete: ',loadcofig)
            console.log(loadcofig.responseText);
            if (loadcofig.responseText == "ok") {
                localStorage.setItem("tocken_AIRSENSE", '');
                localStorage.setItem("name_AIRSENSE", '');
                alert("Bạn đã đăng xuât thành công");
                window.location.href = "/";
            } else {
                alert("Xin vui lòng thử lại");
            }
        },
        error: function(loadcofig) {
            console.log(loadcofig);
        }
    });
}


// appear user name 
      var tocken = localStorage.getItem("tocken_AIRSENSE");
        var allInfoStation=null;
        console.log('gpbt');

        function gotoCheckUserStorage() {
    var userData = localStorage.getItem("username_AIRSENSE");
    console.log(userData);
    let managerAuthen = document.getElementById('managerAuthen');
    console.log(managerAuthen);
    managerAuthen.setAttribute('href', '/api/auth/login');
    managerAuthen.innerHTML=userData;
    if (userData) {
        managerAuthen.setAttribute('href', '/api/auth/profile');
        managerAuthen.innerHTML=userData;

    }
    else {
        managerAuthen.setAttribute('href', '/api/auth/login');
        managerAuthen.innerHTML='Đăng nhập';

}

        }


        gotoCheckUserStorage();
