var library = require("module-library")(require)

library.using([
  ".",
  "web-site",
  "browser-bridge"],
  function(renderCode, WebSite, BrowserBridge) {

    var stylesheet = [
      "dogs.do(",
      "  \"laugh\",[",
      "  \"one\",",
      "  \"two. two Two they function they drop a line or two\"],",
      "  // wasn't that a long string?",
      "  function (this, that, theOther) {",
      "    var bone =newTreat(",
      "      )",
      "    dogs.start(",
      "      3433,{",
      "      \"go\":\"go go\"},",
      "      browserBridge(",
      "        ).forResponse(",
      "          response))})",
      "  // ezjs",
    ]

    // var backlog = [
    //   "prioritizedProductBacklog(",
    //   "  \"Something is delivered\",",
    //   "  \"the code that changed is visible where the story was delivered\",",
    //   "  \"The story is marked as done\",",
    //   "  \"1 d.u. (delivered unit) is disbursed to the story\",",
    //   "  \"the various contractors are awared shares in payment for labor and their own materials\",",
    //   "  \"A Wild ROI Appears:\",",
    //   "  eROI = (expected cost - expected revenue) / (expected cost * time until realization) * Risks,",
    //   "  new ROI = opportunity costs / previous revenue + whatever is left from the 1 d.u.,",
    //   "  \"A delta ROI is awarded to the product manager\",",
    //   "  \"Any Scrum Guidance Body recommendations and project stories that were active on the Product Story \",",
    //   "  \"whatever is left of the actual money goes to the Scrum Guidance Body recommendations and into a pot for the collective good\",",
    //   "  \"People just have d.u.'s. That's it. That's the game.\")",
    // ]


    // var basicSite = [
    //   "library.define(",
    //   "  \"hello world\",[",
    //   "  \"web-site\",",
    //   "  \"web-element\",",
    //   "  \"browser-bridge\"],",
    //   "  function*(WebSite, element, BrowserBridge) {",
    //   "    var site =newWebSite(",
    //   "      *)",
    //   "    site.start(",
    //   "      3444)",
    //   "    var page = element(",
    //   "      \"hello world\")",
    //   "    site.addRoute(",
    //   "      \"get\",",
    //   "      \"/\",",
    //   "      function*(_, response) {",
    //   "        var bridge =newBrowserBridge(",
    //   "          ).forResponse(",
    //   "            response)",
    //   "        bridge.send(",
    //   "          page)})})",
    //   "          ezjs",
    // ]

    var empty = ["*"]

    var site = new WebSite()
    site.start(1710)

    site.addRoute(
      "get",
      "/",
      function(request, response) {
        var bridge = new BrowserBridge().forResponse(response)

        renderCode(bridge, stylesheet)
      }
    )

  }
)
