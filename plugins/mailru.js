
export default ({ app }) => {

  if (process.env.NODE_ENV !== 'production') return

  var _tmr = window._tmr || (window._tmr = []);
  _tmr.push({id: "3118866", type: "pageView", start: (new Date()).getTime()});
  (function (d, w, id) {
  if (d.getElementById(id)) return;
  var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
  ts.src = "https://top-fwz1.mail.ru/js/code.js";
  var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
  if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
  })(document, window, "topmailru-code");

  var pixel = document.createElement('noscript');
  var pixelDiv = document.createElement('div');
  var pixelImg = document.createElement('img');
  pixelImg.src = "https://top-fwz1.mail.ru/counter?id=3118866;js=na"
  pixelImg.setAttribute('style', 'border:0;position:absolute;left:-9999px;')
  pixelImg.setAttribute('alt', 'Top.Mail.Ru')

  document.body.appendChild(pixel);
  pixel.appendChild(pixelDiv);
  pixelDiv.appendChild(pixelImg);

}