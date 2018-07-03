var library = require("module-library")(require)

library.using(
  [".", "web-element", "web-site", "browser-bridge", "basic-styles"],
  function(renderCode, element, WebSite, BrowserBridge, basicStyles) {
    var baseBridge = new BrowserBridge()
    var site = new WebSite()
    basicStyles.addTo(baseBridge)

    var webPage = [
      "library.using([",
      "  \"web-element\",",
      "  \"web-site\",",
      "  \"browser-bridge\",",
      "  \"basic-styles\"],",
      "  function*(element, WebSite, BrowserBridge, basicStyles) {",
      "    var baseBridge = new BrowserBridge(*)",
      "    var site = new WebSite(*)",
      "    basicStyles.addTo(",
      "      baseBridge)",
      "    var page = element(",
      "      \"button\",",
      "      \"Press Me\")",
      "    site.addRoute(",
      "      \"get\",",
      "      \"/\",",
      "      baseBridge.requestHandler(page))",
      "    site.start(PORT)",
      "    *})",
    ]

    var activity = [
      "orMaybe(",
      "  just,",
      "  \"a bit of poetry\"",
      "  \"new and bold\")",
      "*",
      "ezjs",
    ]

    var baseBridge = new BrowserBridge()

    var site = new WebSite()

    site.addRoute(
      "get",
      "/",
      function(request, response) {
        var bridge = baseBridge.forResponse(response)

        var left = bridge.partial()
        var right = bridge.partial()
        renderCode(left, webPage)
        renderCode(right, activity)

        left = element(element.style({
          "margin-right": "100px",
        }), left)

        var page = element(
          element.style({
            "display": "flex",
          }),[
          left,
          right])

        bridge.send(page)
      }
    )
    site.start(9919)
  })


