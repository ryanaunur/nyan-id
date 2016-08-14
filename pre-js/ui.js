/* Core JS */
debug = true;

function appsLoad() {
  checkCookie();
  getDevice();
  document.getElementById('list__device').innerHTML = localStorage.getItem("lastDeviceList");
}

(function() {
  'use strict';
  window['counter'] = 0;
  var snackbarContainer = document.querySelector('#demo-show-toast');
  var showToastButton = document.querySelector('#apps-button-help');
  showToastButton.addEventListener('click', function() {
    'use strict';
    var data = {message: 'Masukkan ID Device dan Password'};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
  }, false);
}());

function openMainPages() {
  document.getElementById('login-pages').style.display = 'none';
  document.getElementById('main-pages').style.display = 'block';
  showToast("Login Successfuly")
  setdebug("Login Successfuly");
}

function doLogin() {
    var iddevice = $("#deviceid").val();
    var passwd = $('#password').val();

    var form = new FormData();
    form.append("id", iddevice);
    form.append("passwd", passwd);

    if (iddevice != "" && passwd != "") {
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://api.stkip-jbg.com/TalkToNyanAPI/api/auth",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
      }

      $.ajax(settings).done(function (response) {
        var status = response;
        if (status == "allowed") {
           setCookie("deviceID", iddevice, 30);
           setdebug("Login Successfuly with ID " + iddevice);
           openMainPages();
        }
      });

    } else {
      showToast("Masukkan ID Device dan Password");
    }


}

function showToast(datanya) {
  var snackbarContainer = document.querySelector('#demo-show-toast');
  var showToastButton = document.querySelector('#apps-button-help');
  var data = {message: datanya};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

function setdebug(datalog) {
  var date = new Date();
  if (window.debug == true) {
    console.log(date + " - " + datalog);
  }
}

var space = false;
$(function() {
  $(document).keyup(function(evt) {
    if (evt.keyCode == 32) {
      space = false;
    }
  }).keydown(function(evt) {
    if (evt.keyCode == 32) {
      space = true;
      console.log('space')
    }
  });
});

function getDevice() {
  $.ajax({ 
    type: 'GET', 
    url: 'http://api.stkip-jbg.com/TalkToNyanAPI/api/status/' + getCookie("deviceID") +'/json', 
    dataType: 'json', 
    success: function (data) { 
      var hasil = data.status.length + " Perangkat Tersedia"; 
      var listDevice = "";
      for (i = 0; i < data.status.length; i++) { 
        var dataJsonTime = data.devicetime[i].time;  
        var dataJsonStatus = data.status[i];
        var statusDevice = dataJsonStatus.status;
        var nameDevice = dataJsonStatus.name;
        var typeDevice = dataJsonStatus.devicetype;
        if (typeDevice == "ac") {
          var suhuDevice = dataJsonStatus.suhu;
          typeDevice = "wb_iridescent";
          nameDevice = nameDevice + " ( #" + dataJsonStatus.id + " )";
          if (statusDevice == "1") {
            statusDevice = "Menyala sejak " + dataJsonTime + " - Suhu Terakhir " + suhuDevice + "&deg;C";
            var anotherStatusDevice = "offline_pin";
            var onoroff = "device-on-icon";
          } else {
            statusDevice = "Mati sejak " + dataJsonTime + " - Suhu Terakhir " + suhuDevice + "&deg;C";
            var anotherStatusDevice = "power_settings_new";
            var onoroff = "device-off-icon";
          }
        } else if (typeDevice == "lampu") {
          typeDevice = "wb_incandescent";
          nameDevice = nameDevice + " ( #" + dataJsonStatus.id + " )";
          if (statusDevice == "1") {
            statusDevice = "Menyala sejak " + dataJsonTime;
            var anotherStatusDevice = "offline_pin";
            var onoroff = "device-on-icon";
          } else {
            statusDevice = "Mati sejak " + dataJsonTime;
            var anotherStatusDevice = "power_settings_new";
            var onoroff = "device-off-icon";
          }
        }
        listDevice += "<li class='mdl-list__item mdl-list__item--three-line'><span class='mdl-list__item-primary-content'><i class='material-icons mdl-list__item-avatar icon-avatar " + onoroff + "'>" + typeDevice + "</i><span>" + nameDevice + "</span><span class='mdl-list__item-text-body'>" + statusDevice + "</span></span><span class='mdl-list__item-secondary-content'><a class='mdl-list__item-secondary-action' href='#'><i class='material-icons'>" + anotherStatusDevice + "</i></a></span></li>";; 
      }

      setdebug("Data Device dari API success");
      document.getElementById('deviceavailable').innerHTML = hasil;
      localStorage.setItem("lastDeviceList", listDevice);
      document.getElementById('list__device').innerHTML = listDevice;
      setTimeout(function(){getDevice();}, 3000);
   }
 });
}



/* 
    Cookies Engine 
*/
function getCookie(c_name)
{
var c_value = document.cookie;
var c_start = c_value.indexOf(" " + c_name + "=");
if (c_start == -1)
  {
  c_start = c_value.indexOf(c_name + "=");
  }
if (c_start == -1)
  {
  c_value = null;
  }
else
  {
  c_start = c_value.indexOf("=", c_start) + 1;
  var c_end = c_value.indexOf(";", c_start);
  if (c_end == -1)
    {
    c_end = c_value.length;
    }
  c_value = unescape(c_value.substring(c_start,c_end));
  }
return c_value;
}

function setCookie(c_name,value,exdays)
{
// Example setCookie("username",username,365);
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value;
}

function checkCookie()
{
var username=getCookie("deviceID");
if (username!=null && username!="")
  {
    setdebug("Device ID " + username);
    document.getElementById('login-pages').style.display = 'none';
    document.getElementById('main-pages').style.display = 'block';
    getDevice();
  }
else 
  {
    document.getElementById('login-pages').style.display = 'block';
}
}