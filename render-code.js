var library = require("module-library")(require)

module.exports = library.export(
  "render-code",
  ["web-element", "parse-a-little-js"],
  function(element, parseALittle) {

    function backlog() {}

    backlog([
      "strings should be indented according to the spaces. RN it's just set to work at one level I think"])


    var colorOf = {
      a: "red brown",
      b: "white gray blue",
      c: "yellow white gray",
      d: "gray white",
      e: "yellow white gray red",
      f: "pink brown",
      g: "green brown gray",
      h: "gray brown",
      i: "black white yellow blue",
      j: "red yellow",
      k: "gray black blue",
      l: "yellow gray",
      m: "blue red brown",
      n: "green brown",
      o: "white red",
      p: "gray green",
      q: "yellow green",
      r: "red black",
      s: "yellow white",
      t: "black green",
      u: "yellow blue gray",
      v: "gray blue purple",
      w: "black brown green gray",
      x: "gray brown red yellow",
      y: "yellow gray",
      z: "red brown green yellow",
    }

    var hexColor = {
      a: ["#F5C5BF", "#D44542"],
      b: ["#E5E5E5", "#9b88c7"],
      c: ["#FFFA9D", "#A3A298"],
      d: ["#999999", "#F8F7F7"],

      e: ["#F09687", "#FFFCC9"],
      f: ["#d47279", "#F6CFD7"],
      g: ["#576F2B", "#C7A6A1"],
      h: ["#939393", "#D3A3A9"],

      i: ["#4A4A4A", "#E4E089"],
      j: ["#FDF441", "#EA473D"],
      k: ["#3C3A4E", "#BBBBBB"],
      l: ["#CCDC64", "#FEF9A0"],

      m: ["#C643A7", "#D8A8B0"],
      n: ["#71A359", "#BE6F73"],
      o: ["#FCEFEF", "#EC7571"],
      p: ["#828C80", "#64984E"],

      q: ["#77AB23", "#FCF63B"],
      r: ["#502322", "#a0271f"],
      s: ["#7fa557", "#b0deb6"],
      t: ["#1E231C", "#5B7F4E"],

      u: ["#EDE9DF", "#8873AF"],
      v: ["#C6CBE7", "#7E47A3"],
      w: ["#9499e4", "#516d63"],
      x: ["#A85057","#C2BEBF"],

      y: ["#A3A298", "#FFFA9D"],
      z: ["#9F473F", "#D24440"],
    }

    var swatchStyles = element.stylesheet([
      element.style(
        ".bar",{
          "content": "x",
          "height": "2em",
          "flex": "1"}),

      element.style(
        ".letter",{
        "width": "0",
        "position": "relative",
        "left": "-50%",
        "font-size": "2em",
        "font-family": "sans-serif",
        "font-style": "italic",
        "flex-grow": "0"}),

      element.style(
        ".swatch",{
        "width": "100px",
        "display": "flex",
        "flex-direction": "row",
        "margin": "0 40px 20px 0"}),

      element.style(
        ".swatch-wrap",{
        "display": "inline-block"}),

    ])

    function colorSwatches(bridge) {
      if (!bridge.remember("render-code/color-swatches")) {
        bridge.addToHead(swatchStyles)
        bridge.see("render-code/color-swatches", true)
      }

      var content = []
      for(var letter in colorOf) {
        var colors = colorOf[letter].split(" ")

        if (hexColor[letter]) {
          var colorBars = element(
            ".bar",
            element.style({
              "background": hexColor[letter][0]}))

          var foregroundColor = hexColor[letter][1]

        } else {
          var foregroundColor = colors[0]

          var colorBars = colors.map(function(color) {
            return element(
              ".bar",
              element.style({
                "background": color}))
            })}


        var letterEl = element(
          ".letter",
          element.style({
              "color": foregroundColor}),
          letter.toUpperCase())

        var swatch = element(
          "."+letter+"-swatch.swatch", colorBars, letterEl)

        content.push(element(".swatch-wrap", swatch))
      }

      bridge.send(element(
        element.style({"margin-top": "2em"}), content))
    }

    renderCode.colorSwatches = colorSwatches

    function renderCode(bridge, lines, options) {

      prepareBridge(bridge)

      if (options && options.editLoop) {
        var editLoop = options.editLoop
      } else {
        var editLoop = bridge.noop()}

      if (options && options.noLogo) {
        var yesLogo = false
      } else {
        var yesLogo = true
      }
      
      var stack = []

      if (typeof lines == "function") {
        var source = lines.toString()

        source = source.replace(/^function\s*\w*\s*\([^)]*\)\s\{/, "")

        source = source.replace(/\}\s*$/, "")

        lines = source.split("\n")
      } else if (typeof lines == "string") {
        lines = lines.split("\n")
      }

      var lineElements = []

      lines.forEach(
        function(line) {
          console.log("\n",line)
          var segments = parseALittle(line)

          if (!segments) {
            return }

          var spaces = line.match(/^ */)[0]
          var nonbreakingSpaces = "<indent>"+spaces.split("").map(function() { return "&nbsp;"}).join("")+"</indent>"

          line = line.slice(spaces.length)
          var width = spaces.length/1.5+"em"


          var isString = segments.intros && segments.intros[0] == "\"" && segments.intros.length == 1 && segments.outros && segments.outros[0] == "\""

          var isHash = isString && segments.secondHalf[0] == "#"

          var isComment = line.match(/^\s*\/\//)

          var isNumber = line.match(/^\s*[0-9,\.]+[^A-Za-z]*$/)

          if (isHash) {
            var letter = segments.secondHalf && segments.secondHalf[1].toLowerCase()
            var foreground = hexColor[letter] ? hexColor[letter][0] : hexColor.y[0]
            var background = hexColor[letter] ? hexColor[letter][1] : hexColor.y[1]
          }

          var el = element(
            element.tag(
              "line"),
            nonbreakingSpaces,
            lineContents(
              bridge,
              segments,
              stack,
              editLoop,
              background,
              foreground))

          if (isHash) {
            el.addSelector(".tag")
          } else if (isComment) {
            el.addSelector(".comment")
          } else if (isNumber) {
            el.addSelector(".number")
          }

          lineElements.push(el)
        }
      )

      var logo = element(
        element.tag("line"),
        ".comment.logo",
        element(
          element.tag("indent"),
          "&nbsp;&nbsp;"),
        element(
          element.tag("sym"),
          ".text.comment",
          "//"),
        element(
          element.tag("txt"),{
          "spellcheck": "false"},
          " ezjs"))

      if (yesLogo) {
        lineElements.push(
          logo)}

      var handleEdits = editLoop.withArgs(
        bridge.event)
        .evalable()

      var program = element(
        ".editable",{
        "contenteditable": "true",
        "onkeyup": handleEdits},
        lineElements)

      bridge.send(
        element(".editable-container",
          program))
    }

    const OPENERS = ["[", "{", "("]
    const CLOSERS = ["]", "}", ")"]

    console.indent = function() {
      const lines = Array.prototype.slice.call(
        arguments)
        .join(
          " ")
        .split(
          "\n")

      console.log(
        lines.map(
          function(line) {
            return new Array(40).join(" ")+line
          }
        )
        .join(
          "\n"))}

    function lineContents(bridge, segments, stack, editLoop, background, foreground) {

      console.indent("SEGMENTS "+JSON.stringify(segments, null, 2))
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
        } else if (sym == "(") {
          if (isFunctionLiteral) {
            stack.push(
              "argument signature")
          } else {
            stack.push(
              "function call")
          }
        }
      }

      function noticeClosingSymbol(sym) {
        if (sym == "]") {
          var peek = stack.pop()
          if (peek != "array literal") {
            throw new Error("Expected "+sym+" to be closing an array")
          }
        } else if (sym == "}") {
          var peek = stack.pop()
          if (peek != "function literal" && peek != "object literal") {
            throw new Error("Expected "+sym+"to be closing a function or object literal")
          }
        } else if (sym == ")") {
          var peek = stack.pop()
          if (peek != "argument signature" && peek != "function call") {
            throw new Error("Expected "+sym+"to be closing an argument signature or function call")
          }
        }
        console.indent("🥞  ", sym, "successfully closed", peek)   
      }

      function renderSymbol(sym) {
        if (OPENERS.includes(sym)) {
          noticeOpeningSymbol(sym)
          console.indent("🥞  ", "sym", sym, "was an opener, stack is", stack.join(" ⊃ "))
        }
        var html = renderSym(stack, sym)
        if (CLOSERS.includes(sym)) {
          noticeClosingSymbol(sym)
          console.indent("🥞  ", "sym", sym, "was a closer, stack is", stack.join(" ⊃ "))
        }
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
              segments.secondHalf, background, foreground))}

        if (segments.outros) {
          contents = contents.concat(
            ["<closers>"],
            segments.outros.map(
            renderSymbol),
            ["</closers>"])}

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

    function renderTxt(text, background, foreground) {
      var el = element(element.tag("txt"), text)
      el.appendStyles({
        "background": background,
        "border-left": SYM_PADDING+" solid "+background,
        "border-right": SYM_PADDING+" solid "+background,
        "color": foreground})
      return el.html()
    }

    function literalClass(stack, sym) {
      if (sym == "#") {
        return "hash"
      }

      if (sym.length > 1) {
        var classes = "text"
      } else {
        var classes = ""
      }

      if (sym == "//") {
        return classes + " comment"
      }

      if (sym == "\"") {
        classes += " quote"
      }

      var top = stack[stack.length-1]

      if (top == "array literal") {
        return classes+" array";
      } else if (top == "object literal") {
        return classes+" object";
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
    var SYM_BACKGROUND = "#dbe3f1"
    var LIGHT_SYM = "#e5eeff"
    var ULTRALIGHT_SYM = "#f6f6ff"
    var DARK_SYM = "#c6d4ef"
    var TAG_RED = "#5fe0a4"
    var TAG_TEXT = "white"

    var stylesheet = element.stylesheet([
      element.style(".editable-container",{
        "min-width": "15em",
        "max-width": "400px",
        "min-height": "5em",
        "border": "3px solid "+LIGHT_SYM,
        "box-sizing": "border-box",
        "border-radius": "8px",
        "padding": "5px",
        "background": "rgba(255,255,255,0.9)",
        }),

      element.style(".editable",{
        "padding": "0.5em 0.5em 0.5em 3.25em",
      }),

      element.style(".number",{
        " txt": {
          "font-weight": "600",
        },
      }),

      element.style(".tag",{
        " txt": {
          "background": TAG_RED,
          "color": TAG_TEXT,
          "border-radius": "100px",
          "border-left": SYM_PADDING+" solid "+TAG_RED,
          "border-right": SYM_PADDING+" solid "+TAG_RED,
          "font-weight": "bold",
          "font-size": "0.8em",
          "padding": "0.2em",
          "vertical-align": "middle",
        },

        " sym.quote": {
          "display": "none"},
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

        "border-left": SYM_PADDING+" solid "+ULTRALIGHT_SYM,
        "border-right": SYM_PADDING+" solid "+ULTRALIGHT_SYM,
        "border-bottom": "0.15em solid "+ULTRALIGHT_SYM,
        "text-align": "center",
        "font-weight": "bold",
        "background-color": ULTRALIGHT_SYM,
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
        "border-bottom": "none",
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
        "border-right": "5px solid white",
      }),

      element.style("line", {
        "display": "block",
        "flex-direction": "row",
        "margin-bottom": "0.4em",
        "text-indent": "-2.15em",
        "line-height": "1.4em",
        "font-family": "sans-serif",
        "font-size": "1.3em",
      }),

      element.style("body", {
        "padding-left": "5vw",
        "padding-top": "10vw",
        "padding-bottom": "10vw",
      })
    ])

    function prepareBridge(bridge) {
      if (!bridge.remember("render-code")) {
        bridge.addToHead(stylesheet)
        bridge.see("render-code", true)
      }
    }

    return renderCode
  }
)
