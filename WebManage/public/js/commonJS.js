function selectLoginMethod () {
  Swal.fire({
    html: `
            <div class="container-login">
            <div class="login-content">
                <div class="login-header">
                    <img src="/resource/airsense/wp-content/img/airsense.jpg" alt="">
                    <h1 class="login-heading">Đăng nhập vào Airsense</h1>
                </div>
                <div class="login-ways">
                    <div class="login-item login-ad">
                        <i class="fa-solid fa-user"></i>
                        <p>Đăng nhập với tư cách Admin</p>
                    </div>
                    <div class="login-item login-custom">
                        <i class="fa-solid fa-user-tie"></i>
                        <p>Đăng nhập với tư cách Customer</p>
                    </div>
                    <div class="login-item login-user">
                        <i class="fa-regular fa-user"></i>
                        <p>Đăng nhập với tư cách User</p>
                    </div>
                </div>
                <div class="sign-up">
                    Bạn chưa có tài khoản? <a href="" class="sign-up_link">Đăng ký</a>
                </div>
                <div class="login-term">
                    Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với <a href="" class="term_link">Điều khoản sử dụng</a> của chúng tôi
                </div>
            </div>
            `,
    showConfirmButton: false,
    width: '700px'
  })
}

async function getInfoData (urlLink, callBack) {
  await $.ajax({
    type: 'GET',
    enctype: 'multipart/form-data',
    url: urlLink,
    data: {},
    processData: false, //prevent jQuery from automatically transforming the data into a query string
    contentType: false,
    cache: false,
    success: data => {
      var dataJson = JSON.parse(data)
      callBack(dataJson)
    },
    error: e => {
      console.log(e.responseText)
      callBack([])
    }
  })
}

async function getInfoHtml (urlLink, callBack) {
  await $.ajax({
    type: 'GET',
    enctype: 'multipart/form-data',
    url: urlLink,
    data: {},
    processData: false, //prevent jQuery from automatically transforming the data into a query string
    contentType: false,
    cache: false,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Beard ' + localStorage.getItem('token_AIRSENSE')
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    success: data => {
      callBack(data)
    },
    error: e => {
      console.log(e.responseText)
      callBack('')
    }
  })
}

async function postInfoData (urlLink, dataInfo, callBack) {
  await $.ajax({
    type: 'post',
    method: 'POST',
    url: urlLink,
    body: JSON.stringify(dataInfo), // body data type must match "Content-Type" header
    data: JSON.stringify(dataInfo), // body data type must match "Content-Type" header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    dataType: 'json',
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Beard ' + localStorage.getItem('token')
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    success: function (dataReturn) {
      callBack(dataReturn)
    },
    error: function (loadcofig) {
      callBack([])
    }
  })
}
function setItemFormITemAds (item) {
  var html =
    ' <div class="sb-img-hust-tech ">  <img class="image-hust-tech" src ="' +
    item.content_img +
    '"/>' +
    '</div>' +
    '<div class="div-left-hust-tech"> <label class="sb-font-hust-tech" >' +
    item.title +
    '</label></div>'
  return html
}

function setFormToMenuShowAds (dataJson, itemToSet) {
  var textHtml = ''
  for (var i = 0; i < dataJson.length; i++) {
    if (dataJson[i].is_main_pages_id == -1) {
      textHtml +=
        ' <a class="side-menu-item sb-border-hust-tech"  href="../group_page/' +
        dataJson[i].content_page_id +
        '" >' +
        setItemFormITemAds(dataJson[i]) +
        '</a>'
    } else {
      var linkEdit = dataJson[i].filesave.replaceAll('/', '+')
      textHtml +=
        ' <a class="side-menu-item sb-border-hust-tech"  href="../detail_page/' +
        linkEdit +
        '" >' +
        setItemFormITemAds(dataJson[i]) +
        '</a>'
    }
  }
  $(itemToSet).html(textHtml)
}

function setFormToShowPages (item, urlDetail) {
  var start = '<div class="ItemBlog">'
  var limkUrl = '<a href="' + urlDetail
  if (item.is_main_pages_id == -1) {
    limkUrl +=
      'group_page/' +
      item.content_page_id +
      '"style="" class="btn btn-primary">Xem thêm</a>'
  } else {
    limkUrl +=
      'detail_page/' +
      item.filesave.replace('/', '+') +
      '"style="" class="btn btn-primary">Xem thêm</a>'
  }
  // console.log(limkUrl)
  var content =
    '<div class="col-sm-4 col-md-4"><div class="card">' +
    '<img src="' +
    item.content_img +
    '" alt="images"  class="card-img-top"/> <div class="card-body">' +
    '<h5 class="card-title">' +
    item.title +
    '</h5> <p class="card-text">' +
    item.content +
    '</p>' +
    limkUrl +
    '</div></div></div></div>'
  console.log(content)
  return start + content
}

function getInfoDetailPages (nameDivControl, dataView, urlDetail) {
  $.ajax({
    type: 'GET',
    enctype: 'multipart/form-data',
    url: '/api/document/document_detail/' + dataView,
    data: {},
    processData: false, //prevent jQuery from automatically transforming the data into a query string
    contentType: false,
    cache: false,
    success: data => {
      console.log(data)
      var dataJson = JSON.parse(data)
      console.log(dataJson)
      var textHtml = ''
      dataJson = dataJson.sort(function (a, b) {
        return a.content_sub_id - b.content_sub_id
      })
      console.log(dataJson)
      var titleSub = ''
      var startRow =
        '<div class="row" style="display: grid; grid-template-columns: repeat(3, 1fr);">'
      var closeRow = '</div>'
      for (var i = 0; i < dataJson.length; i++) {
        if (dataJson[i].content_group != titleSub) {
          if (dataJson[i] == 0) {
            titleSub = dataJson[i].content_group
            textHtml +=
              "<center><H2 class='heading-blog'>" +
              titleSub +
              '</H2></center>' +
              startRow
          } else {
            textHtml += closeRow
            titleSub = dataJson[i].content_group
            textHtml +=
              "<center><H2 class='heading-blog'>" +
              titleSub +
              '</H2></center>' +
              startRow
          }
        }
        textHtml += setFormToShowPages(dataJson[i], urlDetail)
      }
      textHtml += closeRow
      console.log(textHtml)
      $('#' + nameDivControl).html(textHtml) //.replaceAll("</p>","<br/>").replaceAll("<p>","<br/>")
    },
    error: e => {
      console.log(e.responseText)
    }
  })
}

function getInfoAbs (nameDivControl, dataView) {
  $.ajax({
    type: 'GET',
    enctype: 'multipart/form-data',
    url: '/api/document/lastest_detail/' + dataView,
    data: {},
    processData: false, //prevent jQuery from automatically transforming the data into a query string
    contentType: false,
    cache: false,
    success: data => {
      console.log(data)
      var dataJson = JSON.parse(data)
      console.log(dataJson)
      setFormToMenuShowAds(dataJson, nameDivControl)
    },
    error: e => {
      console.log(e.responseText)
    }
  })
}

// Course
function setFormToMenuShowCourse (dataJson, itemToSet) {
  var textHtml = ''
  for (var i = 0; i < dataJson.length; i++) {
    if (dataJson[i].is_main_pages_id == -1) {
      textHtml +=
        ' <a class="side-menu-item sb-border-hust-tech"  href="../group_lesson/' +
        dataJson[i].course_page_id +
        '" >' +
        setItemFormITemAds(dataJson[i]) +
        '</a>'
    } else {
      var linkEdit = dataJson[i].filesave.replaceAll('/', '+')
      textHtml +=
        ' <a class="side-menu-item sb-border-hust-tech"  href="../detail_lesson/' +
        linkEdit +
        '" >' +
        setItemFormITemAds(dataJson[i]) +
        '</a>'
    }
  }
  $(itemToSet).html(textHtml)
}
function setFormToShowCourse (item, urlDetail) {
  var start = '<div class="ItemBlog">'
  var limkUrl = '<a href="' + urlDetail
  if (item.is_main_pages_id == -1) {
    limkUrl +=
      'group_lesson/' +
      item.course_page_id +
      '"style="" class="to-preview-course"></a>'
  } else {
    limkUrl +=
      'detail_lesson/' +
      item.filesave.replace('/', '+') +
      '"style="" class="to-preview-course"></a>'
  }
  // console.log(limkUrl)
  var content =
    '<div class="course-new__item-wrapper col l-3"><div class="course-new__item">' +
    limkUrl +
    '<div class="course-new__img" style="background-image: url(' +
    item.content_img +
    ');">' +
    limkUrl +
    '</div>' +
    '<div class="course-new__main"><div class="course-new__info"><h5 class="course-new__name-course">' +
    item.title +
    '</h5> <span class="course-new__author">' +
    item.content +
    '</span><div class="course-new__rating-icon"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fal fa-star"></i></div></div><i class="course-new__heart-icon-liked course-new__heart-icon--active fas fa-heart"></i><i class="course-new__heart-icon-default course-new__heart-icon--active fal fa-heart"></i></div><div class="course-new__time"><div class="course-new__time-left"><i class="fal fa-clock"></i>12 hours</div><div class="course-new__lecture"><i class="fal fa-play-circle"></i>12 lessons</div></div></div></div></div>'
  console.log(content)
  return start + content
}

async function getInfoDetailCourse (nameDivControl, dataView, urlDetail) {
  await $.ajax({
    type: 'GET',
    enctype: 'multipart/form-data',
    url: '/api/document/detail_lesson/' + dataView,
    data: {},
    processData: false, //prevent jQuery from automatically transforming the data into a query string
    contentType: false,
    cache: false,
    success: data => {
      console.log(data)
      var dataJson = JSON.parse(data)
      console.log(dataJson)
      var textHtml = ''
      dataJson = dataJson.sort(function (a, b) {
        return a.course_id - b.course_id
      })
      console.log(dataJson)
      var titleSub = ''
      var startRow =
        '<div class="row" style="display: grid; grid-template-columns: repeat(4, 1fr);">'
      var closeRow = '</div>'
      for (var i = 0; i < dataJson.length; i++) {
        if (dataJson[i].course_group != titleSub) {
          if (dataJson[i] == 0) {
            titleSub = dataJson[i].course_group
            textHtml +=
              '<div class="course__heading-wrapper"><h2 class="course__heading">' +
              titleSub +
              '</h2><div class="course__separator"></div></div>' +
              startRow
          } else {
            textHtml += closeRow
            titleSub = dataJson[i].course_group
            textHtml +=
              '<div class="course__heading-wrapper"><h2 class="course__heading">' +
              titleSub +
              '</h2><div class="course__separator"></div></div>' +
              startRow
          }
        }
        textHtml += setFormToShowCourse(dataJson[i], urlDetail)
      }
      textHtml += closeRow
      console.log(textHtml)
      $('#' + nameDivControl).html(textHtml) //.replaceAll("</p>","<br/>").replaceAll("<p>","<br/>")
    },
    error: e => {
      console.log(e.responseText)
    }
  })
}

async function getInfoAbsCourse (nameDivControl, dataView) {
  await $.ajax({
    type: 'GET',
    enctype: 'multipart/form-data',
    url: '/api/document/lastest_detail_lesson/' + dataView,
    data: {},
    processData: false, //prevent jQuery from automatically transforming the data into a query string
    contentType: false,
    cache: false,
    success: data => {
      console.log(data)
      var dataJson = JSON.parse(data)
      console.log(dataJson)
      setFormToMenuShowCourse(dataJson, nameDivControl)
    },
    error: e => {
      console.log(e.responseText)
    }
  })
}

// end course common

// Exam
function setFormToMenuShowExam (dataJson, itemToSet) {
  var textHtml = ''
  for (var i = 0; i < dataJson.length; i++) {
    if (dataJson[i].is_main_pages_id == -1) {
      textHtml +=
        ' <a class="side-menu-item sb-border-hust-tech"  href="../exam_group/' +
        dataJson[i].exam_detail_id +
        '" >' +
        setItemFormITemAds(dataJson[i]) +
        '</a>'
    } else {
      var linkEdit = dataJson[i].filesave.replaceAll('/', '+')
      textHtml +=
        ' <a class="side-menu-item sb-border-hust-tech"  href="../detail_exam/' +
        linkEdit +
        '" >' +
        setItemFormITemAds(dataJson[i]) +
        '</a>'
    }
  }
  $(itemToSet).html(textHtml)
}
function setFormToShowExam (item, urlDetail) {
  var start = '<div class="ItemBlog">'
  var limkUrl = '<a href="' + urlDetail
  if (item.is_main_pages_id == -1) {
    limkUrl +=
      'exam_group/' +
      item.exam_detail_id +
      '"style="" class="btn btn-primary">Xem thêm</a>'
  } else {
    limkUrl +=
      'detail_exam/' +
      item.filesave.replace('/', '+') +
      '"style="" class="btn btn-primary">Xem thêm</a>'
  }
  // console.log(limkUrl)
  var content =
    '<div class="col-sm-4 col-md-4"><div class="card">' +
    '<img src="' +
    item.content_img +
    '" alt="images"  class="card-img-top"/> <div class="card-body">' +
    '<h5 class="card-title">' +
    item.title +
    '</h5> <p class="card-text">' +
    item.content +
    '</p>' +
    limkUrl +
    '</div></div></div></div>'
  console.log(content)
  return start + content
}

function getInfoDetailExam (nameDivControl, dataView, urlDetail) {
  $.ajax({
    type: 'GET',
    enctype: 'multipart/form-data',
    url: '/api/document/detail_exam/' + dataView,
    data: {},
    processData: false, //prevent jQuery from automatically transforming the data into a query string
    contentType: false,
    cache: false,
    success: data => {
      console.log(data)
      var dataJson = JSON.parse(data)
      console.log(dataJson)
      var textHtml = ''
      dataJson = dataJson.sort(function (a, b) {
        return a.exam_id - b.exam_id
      })
      console.log(dataJson)
      var titleSub = ''
      var startRow =
        '<div class="row" style="display: grid; grid-template-columns: repeat(3, 1fr);">'
      var closeRow = '</div>'
      for (var i = 0; i < dataJson.length; i++) {
        if (dataJson[i].exam_group != titleSub) {
          if (dataJson[i] == 0) {
            titleSub = dataJson[i].exam_group
            textHtml +=
              "<center><H2 class='heading-blog'>" +
              titleSub +
              '</H2></center>' +
              startRow
          } else {
            textHtml += closeRow
            titleSub = dataJson[i].exam_group
            textHtml +=
              "<center><H2 class='heading-blog'>" +
              titleSub +
              '</H2></center>' +
              startRow
          }
        }
        textHtml += setFormToShowExam(dataJson[i], urlDetail)
      }
      textHtml += closeRow
      console.log(textHtml)
      $('#' + nameDivControl).html(textHtml) //.replaceAll("</p>","<br/>").replaceAll("<p>","<br/>")
    },
    error: e => {
      console.log(e.responseText)
    }
  })
}

function getInfoAbsExam (nameDivControl, dataView) {
  $.ajax({
    type: 'GET',
    enctype: 'multipart/form-data',
    url: '/api/document/lastest_detail_exam/' + dataView,
    data: {},
    processData: false, //prevent jQuery from automatically transforming the data into a query string
    contentType: false,
    cache: false,
    success: data => {
      console.log(data)
      var dataJson = JSON.parse(data)
      console.log(dataJson)
      setFormToMenuShowExam(dataJson, nameDivControl)
    },
    error: e => {
      console.log(e.responseText)
    }
  })
}

// end exam common

function checkUserAuthen2 () {
  var mname = localStorage.getItem('tocken_LVC')
  $.ajax({
    type: 'post',
    dataType: 'json',
    url: '/user',
    data: {
      user: 'check'
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + mname)
    },
    success: function (authen) {
      console.log('authen success')
      if (!authen) {
        $('#managerAuthen').attr('href', 'login')
        $('#managerAuthen').html('Login')
        // window.location.href = "/login";
      }
    },
    complete: function (authen) {
      console.log('authen complete')
      console.log(authen.responseText)
    },
    error: function (authen) {
      console.log('authen error')
      console.log(authen)
    }
  })
}

function checkUserAuthenSecsion () {
  localStorage.setItem('role', 'none')
  var mname = localStorage.getItem('tocken_LVC')
  $.ajax({
    type: 'post',
    dataType: 'json',
    url: '/user',
    data: { user: 'check' },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + mname)
    },
    success: function (authen) {
      if (authen == false) {
        console.log('authen falsejjjj')
        $('#managerAuthen').attr('href', 'login')
        $('#managerAuthen').html('Login')
        // window.location.href = "/login";
      }
      localStorage.setItem('role', authen.role)
      var role = localStorage.getItem('role')
      if (role == 'manager' || role == 'supporter') {
        $('#report-station').show()
        $('#manager-station').show()
      }
      if (role == 'manager') {
        $('#manage-user').show()
        $('#manage-blog').show()
      }
    },
    error: function (authen) {
      console.log('authen error')
      console.log(authen)
      $('#managerAuthen').attr('href', 'login')
      $('#managerAuthen').html('Login')
      // window.location.href = "/login";
    }
  })
}

function gotoRegister () {
  window.location.href = '/register'
}
function gotoCheckUserStorage () {
  var userData = localStorage.getItem('name_LVC')
  if (userData) {
    $('#managerAuthen').attr('href', 'profile')
    $('#managerAuthen').html(userData)
    $('#managerLogout').attr('href', 'logout')
    $('#managerLogout').html('Đăng xuất')
  } else {
    $('#managerAuthen').attr('href', 'login')
    $('#managerAuthen').html('Login')
    $('#managerLogout').attr('href', 'logout')
    $('#managerLogout').html('')
  }
}
//sale
function setFillertProductToView (items, itemHtml, type = 'product') {
  var html = ''
  console.log('items: ', items)
  items.forEach(element => {
    html += `<div class="col-xs-12"> 
            <a href="/${type}/${setPadamDetailSale(element)}">
              <div class="best-seller-item">
                <div class="image-block-view">
                    <div class="image-block-view-250" >
                        <img
                          src="${element.thumbnail}"
                          class="best-seller-item-image img-fluid"
                          alt=""
                        />
                    </div>
                </div>
                <div class="best-seller-item-info">
                  <div class="info-name">${element.title}</div> <!-- 
                  <div class="info-star">
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                  </div> -->
                  <div class="info-price">
                    <span class="info-price-discount">${
                      element.mid_cost
                    }VND</span>
                    <span class="info-price-percent"
                      ><del>${element.final_cost}VND</del 
                      ><span class="text-discount">${
                        element.promotion != null ? element.promotion : ''
                      }</span></span
                    >
                  </div>
                </div>
              </div>
            </a>
          </div>`
  })
  $(itemHtml).html(html)
}

function setPadamDetailSale (element) {
  return (
    `product_detail?type=` +
    element.product_id +
    `&block=` +
    element.group_sub_id
  )
}
function showLoader () {
  document.getElementById('loader-container').style.display = 'block'
}

function hideLoader () {
  document.getElementById('loader-container').style.display = 'none'
}

function notify (message, status) {
  var x = document.getElementById('snackbar')
  x.innerHTML = message
  x.className = 'show'
  setTimeout(function () {
    x.className = x.className.replace('show', '')
  }, 3000)
  document.getElementById('snackbar').classList.add(status)
}
