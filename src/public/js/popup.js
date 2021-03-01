function setCookie(name, value, expiredays) {
  var todayDate = new Date();
  todayDate.setDate(todayDate.getDate() + expiredays);
  document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";";
}

function closePop0() {
  if (document.frm0.pop0.checked) {
    setCookie("popname0", "done", 1);
  }
  document.getElementById("popForm0").style.display = "none";
}

function closePop1() {
  if (document.frm1.pop1.checked) {
    setCookie("popname1", "done", 1);
  }
  document.getElementById("popForm1").style.display = "none";
}

function closePop2() {
  if (document.frm2.pop2.checked) {
    setCookie("popname2", "done", 1);
  }
  document.getElementById("popForm2").style.display = "none";
}

cookiedata = document.cookie;
console.log(cookiedata.indexOf('popname0=done'))
console.log(cookiedata.indexOf('popname1=done'))
console.log(cookiedata.indexOf('popname2=done'))
if (cookiedata.indexOf('popname0=done') >= 0) {
  document.getElementById('popForm0').style.display = "none";
}

// cookiedata = document.cookie;
if (cookiedata.indexOf('popname1=done') >= 0) {
  document.getElementById('popForm1').style.display = "none";
}
// if ((cookiedata === '') || (cookiedata === "popname0=done")) {
//   // console.log('2')
// } else if (cookiedata.indexOf("popname1=done") < 0) {
//   document.getElementById('popForm1').style.display = "block";
// } else {
//   document.getElementById('popForm1').style.display = "none";
// }

// cookiedata = document.cookie;
if (cookiedata.indexOf('popname2=done') >= 0) {
  document.getElementById('popForm2').style.display = "none";
}
// if ((cookiedata === '') || (cookiedata === "popname0=done") || (cookiedata === "popname1=done")) {
//   // console.log('3')
// } else if (cookiedata.indexOf("popname2=done") < 0) {
//   document.getElementById('popForm2').style.display = "block";
// } else {
//   document.getElementById('popForm2').style.display = "none";
// }