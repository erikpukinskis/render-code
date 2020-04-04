var library = require("module-library")(require)

library.using([
  ".",
  "web-site",
  "browser-bridge"],
  function(renderCode, WebSite, BrowserBridge) {

    // var food = [
    //   "library.using(",
    //   "  function(WebSite, webElement) {",
    //   "    var products = [",
    //   "      webElement([",
    //   "        webElement(\"button\", \"Add to cart\"),",
    //   "        \"Oasis hummus\"),",
    //   "      webElement([",
    //   "        webElement(\"button\", \"Add to cart\"),",
    //   "        \"Oasis lavash\"),",
    //   "      webElement([",
    //   "        webElement(\"button\", \"Add to cart\"),",
    //   "        \"Gluten free bagels\"),",
    //   "      webElement([",
    //   "        webElement(\"button\", \"Add to cart\"),",
    //   "        \"Tempeh\")]",
    //   "",
    //   "    var cart = webElement(",
    //   "      \"form\",{",
    //   "      \"method\": \"GET\",",
    //   "      \"action\": \"/order\"},[",
    //   "      webElement(\"h2\", \"Cart\"),",
    //   "      \"Oasis hummus, Oasis lavash, tempeh\",",
    //   "      webElement(",
    //   "        \"input\",{",
    //   "        \"type\": \"text\",",
    //   "        \"placeholder\": \"Enter your name\",",
    //   "        \"name\": \"subscriberName\"}),",
    //   "      webElement(",
    //   "        \"input\",{",
    //   "        \"type\": \"submit\",",
    //   "        \"value\": \"Check out\"})])",
    //   "",
    //   "    var order = [",
    //   "      webElement(\"h1\", \"Thank you for your interest!\"),",
    //   "      webElement(\"p\", \"To place your order text the following code to Erik: (812-***-****\"),",
    //   "      webElement(",
    //   "        \"p\",",
    //   "        webElement(\"strong\", \"HLTK\")]",
    //   "",
    //   "    var site = new WebSite()",
    //   "",
    //   "    var column = webElement.template(",
    //   "      \".column\",",
    //   "      webElement.style({",
    //   "        \"float\": \"left\",",
    //   "        \"max-width\": \"200px\",",
    //   "        \"margin-left\": \"15px\",",
    //   "        \"margin-top\": \"50px\"}))",
    //   "",
    //   "    var stylesheet = webElement.stylesheet(",
    //   "      column)",
    //   "",
    //   "    var productsPage = [",
    //   "      column(products),",
    //   "      column(cart),",
    //   "      stylesheet]",
    //   "",
    //   "    var orderPage = webElement(",
    //   "      \".lil-page\",",
    //   "      order,",
    //   "      stylesheet)",
    //   "",
    //   "    site.addRoute(",
    //   "      \"get\",",
    //   "      \"/\",",
    //   "      productsPage)",
    //   "",
    //   "    site.addRoute(",
    //   "      \"get\",",
    //   "      \"/order\",",
    //   "      orderPage)})",
    // ]

    var math = [
      "// Simple example of a module call and a closure that does some work",
      "doStuffWithNumbers(",
      "  function(sum) {",
      "    var foo = [",
      "      4000,",
      "      4001,",
      "      400,",
      "      4002]",
      "    sum(",
      "      foo)})",
    ]

    var stylesheet = [
      "// Example using all of the different syntax available in EZJS, including objects and tag strings",
      "dogs.do(",
      "  \"laugh\",[",
      "  \"one\",",
      "  \"two. two Two they function they drop a line or two\"],",
      "  // wasn't that a long string?",
      "  function (this, that, theOther) {",
      "    var bone = new Treat(",
      "      1,",
      "      2,",
      "      3)",
      "    dogs.start(",
      "      \"#before holiday\",",
      "      \"#foretold\",",
      "      \"#ROI\",",
      "      \"#asmr\",",
      "      \"#watercolor\",",
      "      \"#corgis\",",
      "      \"#solid\",",
      "      \"#queer\",",
      "      \"#underwater ballet\",",
      "      \"#verocious\",",
      "      \"#monument valley\",",
      "      \"#knock-out\",{",
      "      \"go\":\"go go\"})})",
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


    var basicSite = [
      "// Hello world site demonstrating a complete web application",
      "library.define(",
      "  \"hello world\",[",
      "  \"web-site\",",
      "  \"web-element\",",
      "  \"browser-bridge\"],",
      "  function(WebSite, element, BrowserBridge) {",
      "    var site = new WebSite(",
      "      )",
      "    site.start(",
      "      3444)",
      "    var page = element(",
      "      \"hello world\")",
      "    site.addRoute(",
      "      \"get\",",
      "      \"/\",",
      "      function(_, response) {",
      "        var bridge = new BrowserBridge(",
      "          ).forResponse(",
      "            response)",
      "        bridge.send(",
      "          page)})})",
    ]

    var empty = ["*"]

    var site = new WebSite()
    site.start(1710)

    site.addRoute(
      "get",
      "/",
      function(request, response) {
        var bridge = new BrowserBridge().forResponse(response)

        var code = bridge.partial()
        renderCode(code, math)

        var code2 = bridge.partial()
        renderCode(code2, basicSite)

        // var code3 = bridge.partial()
        // renderCode(code3, stylesheet)

        // var code4 = bridge.partial()
        // renderCode(code4, food)

        // var swatches = bridge.partial()
        // renderCode.colorSwatches(swatches)

        bridge.send([code, code2])
      }
    )

  }
)
