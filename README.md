**render-code** takes a carefully formatted subset of JavaScript and renders it as HTML with various symbols and indentation rendered.

```javascript
var renderCode = require("render-code")
var express = require("express")()
var BrowserBridge = require("browser-bridge")

var sampleCode = [
  "someFunction(",
  "  just,",
  "  \"a bit of code\")",
]

var baseBridge = new BrowserBridge()

express.get(
  "/",
  function(request, response) {
    var bridge = baseBridge.forResponse(response)
    var partial = bridge.partial()
    renderCode(partial, sampleCode)
    bridge.send(partial)
  }
)
```