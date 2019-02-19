var library = require("module-library")(require)

module.exports = library.export(
  "render-code",
  ["web-element", "parse-a-little-js"],
  function(element, parseALittle) {

    function renderCode(bridge, lines, editLoop) {

      if (!editLoop) {
        editLoop = bridge.defineFunction(function noop(){})}

      prepareBridge(bridge)

      var stack = []

      var lines = lines.map(
        function(line) {
          var segments = parseALittle(line)

          var spaces = line.match(/^ */)[0]
          var nonbreakingSpaces = "<indent>"+spaces.split("").map(function() { return "&nbsp;"}).join("")+"</indent>"

          line = line.slice(spaces.length)
          var width = spaces.length/1.5+"em"

          var el = element(
            element.tag(
              "line"),
            nonbreakingSpaces,
            lineContents(
              bridge,
              segments,
              stack,
              editLoop))

          if (line.match(/^\s*\/\//)) {
            el.addSelector(".comment")
          }
          if (line.match(/\/\/ ezjs/)) {
            el.addSelector(".logo")
            // el.addAttribute("contenteditable", "false")
          }
          return el
        }
      )

      var handleEdits = editLoop.withArgs(
        bridge.event)
        .evalable()

      var program = element(
        ".editable",{
        "contenteditable": "true",
        "onkeyup": handleEdits},
        lines)

      bridge.send(
        element(".editable-container",
          program))
    }

    function lineContents(bridge, segments, stack, editLoop) {

      var contents = []

      var allSymbols = [].concat(
        segments.intros || [],
        segments.separators || [],
        segments.outros || [])

      var isFunctionLiteral = contains(segments.intros, "function")

      function noticeOpeningSymbol(sym) {
        if (sym == "[") {
          stack.push("array literal")
        } else if (sym == "{") {
          if (isFunctionLiteral) {
            stack.push(
              "function literal")
          } else {
            stack.push(
              "object literal")
          }
        }
      }

      function noticeClosingSymbol(stack, sym) {
        if (sym == "]") {
          var peek = stack.pop()
          if (peek != "array literal") {
            throw new Error("Expected to be closing an array")
          }
        } else if (sym == "}") {
          var peek = stack.pop()
          if (peek != "function literal" && peek != "object literal") {
            throw new Error("Expected to be closing a function or object literal")
          }
        }      
      }

      function renderSymbol(sym) {
        noticeOpeningSymbol(sym)
        var html = renderSym(stack, sym)
        noticeClosingSymbol(sym)
        return html }

      while(segments) {

        if (!segments.intros && !segments.secondHalf && !segments.separators && segments.outros && segments.outros[0] == ")") {
          // If we're on a line with no argument, add an empty symbol
          contents.push(
            renderSym(
              stack,
              "*"))}

        if (segments.intros) {
          contents = contents.concat(segments.intros.map(
            renderSymbol))}

        if (segments.firstHalf) {
          contents.push(
            renderTxt(
              segments.firstHalf))

        } else if (isFunctionLiteral) {
          // If we're in a function literal with no first half, add an empty symbol
          contents.push(
            renderSym(
              stack,
              "*"))}

        if (segments.separators) {
          contents = contents.concat(segments.separators.map(renderSymbol))}

        if (segments.secondHalf) {
          contents.push(
            renderTxt(
              segments.secondHalf))}

        if (segments.outros) {
          contents = contents.concat(segments.outros.map(
            renderSymbol))}

        segments = segments.remainder && parseALittle(
          segments.remainder)
      }

      return contents.join("")
    }

    function renderSym(stack, sym) {
      if (sym == "ezjs") {
        return "<sym contenteditable=\"true\" spellcheck=\"false\" class=\"logo\">ezjs</sym>"

      } else if (sym == "*") {
        return "<empty contenteditable=\"true\"> </empty>"

      } else if (sym) {
        return "<sym class=\""+literalClass(stack, sym)+"\">"+sym+"</sym>"
      }
    }

    function renderTxt(text) {
      var isLogo = text == " ezjs"
      var spelling = isLogo ? " spellcheck=\"false\"" : ""
      return "<txt"+spelling+">"+text+"</txt>"      
    }

    function literalClass(stack, sym) {
      if (sym.length > 1) {
        var classes = "text "
      } else {
        var classes = ""
      }

      if (sym == "//") {
        return classes + " comment"
      }

      var top = stack[stack.length-1]

      if (top == "array literal") {
        return classes+"array";
      } else if (top == "object literal") {
        return classes+"object";
      } else {
        return classes
      }
    }

    function contains(array, value) {
      if (!Array.isArray(array)) {
        return false
      }
      var index = -1;
      var length = array.length;
      while (++index < length) {
        if (array[index] == value) {
          return true;
        }
      }
      return false;
    }

    var SYM_PADDING = "8px"
    var LOGO_COLOR = "red"
    var SYM_BACKGROUND = "#e5eeff"
    var LIGHT_SYM = "#f6f6ff"
    var DARK_SYM = "#c6d4ef"

    var stylesheet = element.stylesheet([
      element.style(".editable-container",{
        "min-width": "16em",
        "max-width": "24em",
        "min-height": "4em",
        "border": "3px solid #e5eeff",
        "box-siding": "border-box",
        "border-radius": "8px",
        "padding": "5px",
        }),

      element.style(".editable",{
        "padding": "0.5em 0.5em 0.5em 3.25em",
      }),

      element.style(".editable sym, .editable sym.text, sym.array, .editable txt", {
      }),

      element.style("indent", {
        "display": "inline",
        "letter-spacing": "0.25em",
      }),

      element.style("indent + sym", {
        "margin-left": "-0.3em",
      }),

      element.style("sym", {
        "display": "inline",
        "margin": "0 0.15em",

        "border-left": SYM_PADDING+" solid "+LIGHT_SYM,
        "border-right": SYM_PADDING+" solid "+LIGHT_SYM,
        "text-align": "center",
        "font-weight": "bold",
        "background-color": LIGHT_SYM,
        "color": "#7c7cfa",
        "border-radius": "0.2em",
      }),

      element.style("line.comment",{
        "margin": "1.4em 0 1.5em 0em",
      }),

      element.style("line.comment txt",{
        "color": "#faa",
        "-webkit-font-smoothing": "subpixel-antialiased",
      }),

      element.style("sym.text.comment",{
        "color": "white",
        "background": "#fbb",
        "border-left": SYM_PADDING+" solid #fbb",
        "border-right": SYM_PADDING+" solid #fbb",
        "padding": "0 5px 0 8px",
        "letter-spacing": "3px",
      }),

      element.style("sym.array", {
        "color": "#79caff",
      }),

      element.style("sym.object", {
        "color": "#79caff",
      }), 

      element.style("line.logo sym.text.comment",{
        "margin-top": "2em",
        "background": SYM_BACKGROUND,
        "border-color": SYM_BACKGROUND,
      }),

      element.style("line.logo txt",{
        "color": DARK_SYM,
      }),

      element.style("empty", {
        "letter-spacing": "0.9em",
        "font-size": "0.5em",
        "vertical-align": "0.3em",
        "border-radius": "5px",
        "border": "3px solid #e5eeff",
      }),


      element.style("empty:first-child, sym:first-child", {
        "margin-left": "0",
      }),

      element.style("txt", {
        "color": "#635d5a",
        "-webkit-font-smoothing": "antialiased",
        "display": "inline",
      }),

      element.style("line", {
        "display": "block",
        "flex-direction": "row",

        "margin-bottom": "0.4em",
        "text-indent": "-2.15em",
        "line-height": "1.2em",

        "font-family": "sans-serif",
        "font-size": "1.3em",
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
