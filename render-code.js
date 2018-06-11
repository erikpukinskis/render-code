var library = require("module-library")(require)

module.exports = library.export(
  "render-code",
  ["web-element"],
  function(element) {

    function renderCode(bridge, lines) {
      prepareBridge(bridge)

      var percent = percentToNewMoon()

      var base = percent * 2

      if (base > 1) {
        var overage = base - 1.0
        var distance = 1 - overage
      } else {
        var distance = base
      }

      var highlight = rgbBetween(
        DAY_HIGLIGHT,
        NIGHT_HIGHLIGHT,
        distance)

      var bodyBackground = rgbBetween(
        DAY_BACKGROUND,
        NIGHT_BACKGROUND,
        distance)

      var theme = element.stylesheet([
        element.style(
          "sym",{
          "background": highlight}),
        element.style(
          "empty, sym.logo",{
          "border-color": highlight}),
        element.style(
          "body",{
          "background": bodyBackground}),
      ])

      bridge.addToHead(theme)

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
      var parts = line.match(/^(function|var|ezjs)/)
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
        "width": "0.8em",
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
        "margin-left": "0.2em",
        "margin-right": "0.2em",
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


    // Moon colors

    var DAY_BACKGROUND = [255,210,255]
    var NIGHT_BACKGROUND = [230,230,245]
    var DAY_HIGLIGHT = [255,240,240]
    var NIGHT_HIGHLIGHT = [250,250,255]

    function rgbBetween(color1, color2, distance) {

      function component(x) {
        var pointsDifferent = color2[x] - color1[x]
        var offset = pointsDifferent * distance
        return color1[x] + offset
      }

      return "rgb("+component(0)+","+component(1)+","+component(2)+")"
    }

    var MOON_SPEED_OVERRIDE = null

    function percentToNewMoon () {
      var moonOrbitInDays = 27.32158
      var seconds = 1000
      var minutes = 60 * seconds
      var hours = 60 * minutes
      var oneDay = 24 * hours
      var daysSinceEpoch = Date.now() / oneDay
      var daysSinceFirstMoon = daysSinceEpoch + moonOrbitInDays  + MOON_SPEED_OVERRIDE||0
      var orbitsSinceEpoch = Math.floor(daysSinceFirstMoon / moonOrbitInDays)
      var daysSinceNewMoon = daysSinceFirstMoon - orbitsSinceEpoch * moonOrbitInDays
      var percent = daysSinceNewMoon / moonOrbitInDays

      return percent
    }


    function prepareBridge(bridge) {
      if (!bridge.remember("write-code")) {
        bridge.addToHead(stylesheet)
        bridge.remember("write-code")
      }
    }

    renderCode.setMoonSpeed =
      function(value) {
        MOON_SPEED_OVERRIDE = value
      }

    return renderCode
  }
)
