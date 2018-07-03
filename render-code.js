var library = require("module-library")(require)

module.exports = library.export(
  "render-code",
  ["web-element"],
  function(element) {

    function renderCode(bridge, lines) {
      prepareBridge(bridge)

      var allowObjects = lines[0] == "dogs.do("
      var stack = []

      var linesOfHtml = lines.map(function(line) {
        var symbol
        var text

        var spaces = line.match(/^ */)[0].length
        var width = spaces/1.5+"em"
        line = line.slice(spaces)
        var html = "<line style=\"padding-left: "+width+"\">"
        var sym
        var txt

        function biteSymbol() {
          var symbolText = grabSymbol(line)
          if (symbolText) {
            line = line.slice(symbolText.length)
            return symbolText
          }
        }

        function upTilSymbols(text) {
          return text.match(/^[^"}{)(=]*/)[0]
        }

        function biteText() {
          if (grabSymbol(line)) {
            return
          }
          if (line.length > 0) {
            var last3 = line.substr(line.length - 3, 3)

            if (last3 == "new") {
              var withoutNew = line.substr(0, line.length - 3)
              var text = upTilSymbols(withoutNew)
            } else {
              var text = upTilSymbols(line)
            }

            line = line.slice(text.length)
            return text
          }
        }

        while((sym = biteSymbol()) || (txt = biteText())) {
          if (sym == "ezjs") {
            html += "<sym class=\"logo\">ezjs</sym>"
          } else if (sym == "*") {
            html += "<empty></empty>"
          } else if (sym) {
            if (["[", "{"].includes(sym)) {
              stack.push(sym)
            }

            html += "<sym class=\""+literalClass(stack, sym, allowObjects)+"\">"+sym+"</sym>"

            if (["}", "]"].includes(sym)) {
              stack.pop()
            }

          } else if (txt) {
            html += "<txt>"+txt+"</txt>"
          }
        }

        html += "</line>"

        return html
      })

      bridge.send(linesOfHtml.join("\n"))
    }

    function literalClass(stack, sym, allowObjects) {
      if (sym.length > 1) {
        var classes = "text "
      } else {
        var classes = ""
      }

      var top = stack[stack.length-1]
      var b = Math.max(255,stack.length*25);

      if (top == "[") {
        return classes+"array";
      } else if (stack.length == 2 && allowObjects) {
        return classes+"object";
      } else {
        return classes
      }
    }

    function grabSymbol(line) {
      if (line == ",") {
        return ","
      }
      var parts = line.match(/^\s*(function|var|ezjs|new)/)
      if (parts) {
        return parts[0]
      } else if (line == "new") {
        return "new"
      }
      var firstCharacter = line[0]
      if (["*", "\"", "{", "}", "(", ")", "[", "]", "=", ":", ".", ","].includes(firstCharacter)) {
        return firstCharacter
      }
    }

    var stylesheet = element.stylesheet([
      element.style("line", {
        "line-height": "1.25em",
        "margin-bottom": "0.4em",
        "font-family": "sans-serif",
        "font-size": "1.4em",
        "display": "block",
        "max-width": "18em",
        "box-sizing": "border-box",
        "text-indent": "-1.4em",
      }),

      element.style("sym", {
        "font-family": "sans-serif",
        "text-indent": "0",
        "text-align": "center",
        "width": "0.9em",
        "background-color": "#f6f6ff",
        "color": "#9b9bd9",
        "border-radius": "0.1em",
      }),

      element.style("sym.text, sym.logo", {
        "width": "auto",
        "padding-left": "0.2em",
        "padding-right": "0.2em",
      }),

      element.style("sym.array", {
        "color": "#abdbfc",
      }),

      element.style("sym.object", {
        "color": "#b83",
      }), 

      element.style("sym.logo", {
        "margin-top": "0.5em",
        "line-height": "0.85em",
        "vertical-align": "0.1em",
        "font-size": "150%",
        "box-sizing": "border-box",
        "border-radius": "0.35em",
        "background": "none",
        "border": "0.21em solid",
        "opacity": "0.75",
        "padding-bottom": "0.1em",
      }),


      element.style("sym, empty", {
        "display": "inline-block",
        "margin-left": "0.15em",
        "margin-right": "0.15em",
      }),

      element.style("empty", {
        "width": "1.2em",
        "height": "1.2em",
        "box-sizing": "border-box",
        "border-radius": "0.35em",
        "border": "0.25em solid #ddd",
        "vertical-align": "-0.29em",
      }),


      element.style("empty:first-child, sym:first-child", {
        "margin-left": "0",
      }),

      element.style("txt", {
        "color": "rgba(10,0,0,0.75)",
        "-webkit-font-smoothing": "antialiased",
        "display": "inline",
      }),

      element.style("body", {
        "padding-left": "6em",
        "padding-top": "8em",
        "padding-bottom": "6em",
      })
    ])

    function prepareBridge(bridge) {
      if (!bridge.remember("write-code")) {
        bridge.addToHead(stylesheet)
        bridge.remember("write-code")
      }
    }



    return renderCode
  }
)
