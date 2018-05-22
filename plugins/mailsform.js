/* eslint-disable */

export default () => {
  /*
  ** Only run on client-side and only in production mode
  */
  if (process.env.NODE_ENV !== 'production') return

  var script = document.createElement('script');
  script.src = "//downloads.mailchimp.com/js/signup-forms/popup/embed.js"
  script.setAttribute('data-dojo-config', 'usePlainJson: true, isDebug: false');
  document.body.appendChild(script);

  var chimpPopup = document.createElement("script");
  chimpPopup.appendChild(document.createTextNode('require(["mojo/signup-forms/Loader"], function (L) { L.start({"baseUrl":"mc.us18.list-manage.com","uuid":"f2a6cbc588ae02f3e4991dd3d","lid":"c84e62e0f7"})});'));

  script.onload = function() {
    document.body.appendChild(chimpPopup);
  }

}