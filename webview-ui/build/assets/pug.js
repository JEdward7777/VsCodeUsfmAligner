/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  comments: {
    lineComment: "//"
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: '"', close: '"', notIn: ["string", "comment"] },
    { open: "'", close: "'", notIn: ["string", "comment"] },
    { open: "{", close: "}", notIn: ["string", "comment"] },
    { open: "[", close: "]", notIn: ["string", "comment"] },
    { open: "(", close: ")", notIn: ["string", "comment"] }
  ],
  folding: {
    offSide: true
  }
};
var language = {
  defaultToken: "",
  tokenPostfix: ".pug",
  ignoreCase: true,
  brackets: [
    { token: "delimiter.curly", open: "{", close: "}" },
    { token: "delimiter.array", open: "[", close: "]" },
    { token: "delimiter.parenthesis", open: "(", close: ")" }
  ],
  keywords: [
    "append",
    "block",
    "case",
    "default",
    "doctype",
    "each",
    "else",
    "extends",
    "for",
    "if",
    "in",
    "include",
    "mixin",
    "typeof",
    "unless",
    "var",
    "when"
  ],
  tags: [
    "a",
    "abbr",
    "acronym",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "basefont",
    "bdi",
    "bdo",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "center",
    "cite",
    "code",
    "col",
    "colgroup",
    "command",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "font",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "keygen",
    "kbd",
    "label",
    "li",
    "link",
    "map",
    "mark",
    "menu",
    "meta",
    "meter",
    "nav",
    "noframes",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strike",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "tracks",
    "tt",
    "u",
    "ul",
    "video",
    "wbr"
  ],
  symbols: /[\+\-\*\%\&\|\!\=\/\.\,\:]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  tokenizer: {
    root: [
      [
        /^(\s*)([a-zA-Z_-][\w-]*)/,
        {
          cases: {
            "$2@tags": {
              cases: {
                "@eos": ["", "tag"],
                "@default": ["", { token: "tag", next: "@tag.$1" }]
              }
            },
            "$2@keywords": ["", { token: "keyword.$2" }],
            "@default": ["", ""]
          }
        }
      ],
      [
        /^(\s*)(#[a-zA-Z_-][\w-]*)/,
        {
          cases: {
            "@eos": ["", "tag.id"],
            "@default": ["", { token: "tag.id", next: "@tag.$1" }]
          }
        }
      ],
      [
        /^(\s*)(\.[a-zA-Z_-][\w-]*)/,
        {
          cases: {
            "@eos": ["", "tag.class"],
            "@default": ["", { token: "tag.class", next: "@tag.$1" }]
          }
        }
      ],
      [/^(\s*)(\|.*)$/, ""],
      { include: "@whitespace" },
      [
        /[a-zA-Z_$][\w$]*/,
        {
          cases: {
            "@keywords": { token: "keyword.$0" },
            "@default": ""
          }
        }
      ],
      [/[{}()\[\]]/, "@brackets"],
      [/@symbols/, "delimiter"],
      [/\d+\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/\d+/, "number"],
      [/"/, "string", '@string."'],
      [/'/, "string", "@string.'"]
    ],
    tag: [
      [/(\.)(\s*$)/, [{ token: "delimiter", next: "@blockText.$S2." }, ""]],
      [/\s+/, { token: "", next: "@simpleText" }],
      [
        /#[a-zA-Z_-][\w-]*/,
        {
          cases: {
            "@eos": { token: "tag.id", next: "@pop" },
            "@default": "tag.id"
          }
        }
      ],
      [
        /\.[a-zA-Z_-][\w-]*/,
        {
          cases: {
            "@eos": { token: "tag.class", next: "@pop" },
            "@default": "tag.class"
          }
        }
      ],
      [/\(/, { token: "delimiter.parenthesis", next: "@attributeList" }]
    ],
    simpleText: [
      [/[^#]+$/, { token: "", next: "@popall" }],
      [/[^#]+/, { token: "" }],
      [
        /(#{)([^}]*)(})/,
        {
          cases: {
            "@eos": [
              "interpolation.delimiter",
              "interpolation",
              {
                token: "interpolation.delimiter",
                next: "@popall"
              }
            ],
            "@default": ["interpolation.delimiter", "interpolation", "interpolation.delimiter"]
          }
        }
      ],
      [/#$/, { token: "", next: "@popall" }],
      [/#/, ""]
    ],
    attributeList: [
      [/\s+/, ""],
      [
        /(\w+)(\s*=\s*)("|')/,
        ["attribute.name", "delimiter", { token: "attribute.value", next: "@value.$3" }]
      ],
      [/\w+/, "attribute.name"],
      [
        /,/,
        {
          cases: {
            "@eos": {
              token: "attribute.delimiter",
              next: "@popall"
            },
            "@default": "attribute.delimiter"
          }
        }
      ],
      [/\)$/, { token: "delimiter.parenthesis", next: "@popall" }],
      [/\)/, { token: "delimiter.parenthesis", next: "@pop" }]
    ],
    whitespace: [
      [/^(\s*)(\/\/.*)$/, { token: "comment", next: "@blockText.$1.comment" }],
      [/[ \t\r\n]+/, ""],
      [/<!--/, { token: "comment", next: "@comment" }]
    ],
    blockText: [
      [
        /^\s+.*$/,
        {
          cases: {
            "($S2\\s+.*$)": { token: "$S3" },
            "@default": { token: "@rematch", next: "@popall" }
          }
        }
      ],
      [/./, { token: "@rematch", next: "@popall" }]
    ],
    comment: [
      [/[^<\-]+/, "comment.content"],
      [/-->/, { token: "comment", next: "@pop" }],
      [/<!--/, "comment.content.invalid"],
      [/[<\-]/, "comment.content"]
    ],
    string: [
      [
        /[^\\"'#]+/,
        {
          cases: {
            "@eos": { token: "string", next: "@popall" },
            "@default": "string"
          }
        }
      ],
      [
        /@escapes/,
        {
          cases: {
            "@eos": { token: "string.escape", next: "@popall" },
            "@default": "string.escape"
          }
        }
      ],
      [
        /\\./,
        {
          cases: {
            "@eos": {
              token: "string.escape.invalid",
              next: "@popall"
            },
            "@default": "string.escape.invalid"
          }
        }
      ],
      [/(#{)([^}]*)(})/, ["interpolation.delimiter", "interpolation", "interpolation.delimiter"]],
      [/#/, "string"],
      [
        /["']/,
        {
          cases: {
            "$#==$S2": { token: "string", next: "@pop" },
            "@default": { token: "string" }
          }
        }
      ]
    ],
    value: [
      [
        /[^\\"']+/,
        {
          cases: {
            "@eos": { token: "attribute.value", next: "@popall" },
            "@default": "attribute.value"
          }
        }
      ],
      [
        /\\./,
        {
          cases: {
            "@eos": { token: "attribute.value", next: "@popall" },
            "@default": "attribute.value"
          }
        }
      ],
      [
        /["']/,
        {
          cases: {
            "$#==$S2": { token: "attribute.value", next: "@pop" },
            "@default": { token: "attribute.value" }
          }
        }
      ]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVnLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL3B1Zy9wdWcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL3B1Zy9wdWcudHNcbnZhciBjb25mID0ge1xuICBjb21tZW50czoge1xuICAgIGxpbmVDb21tZW50OiBcIi8vXCJcbiAgfSxcbiAgYnJhY2tldHM6IFtcbiAgICBbXCJ7XCIsIFwifVwiXSxcbiAgICBbXCJbXCIsIFwiXVwiXSxcbiAgICBbXCIoXCIsIFwiKVwiXVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJywgbm90SW46IFtcInN0cmluZ1wiLCBcImNvbW1lbnRcIl0gfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIsIG5vdEluOiBbXCJzdHJpbmdcIiwgXCJjb21tZW50XCJdIH0sXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiLCBub3RJbjogW1wic3RyaW5nXCIsIFwiY29tbWVudFwiXSB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiwgbm90SW46IFtcInN0cmluZ1wiLCBcImNvbW1lbnRcIl0gfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIsIG5vdEluOiBbXCJzdHJpbmdcIiwgXCJjb21tZW50XCJdIH1cbiAgXSxcbiAgZm9sZGluZzoge1xuICAgIG9mZlNpZGU6IHRydWVcbiAgfVxufTtcbnZhciBsYW5ndWFnZSA9IHtcbiAgZGVmYXVsdFRva2VuOiBcIlwiLFxuICB0b2tlblBvc3RmaXg6IFwiLnB1Z1wiLFxuICBpZ25vcmVDYXNlOiB0cnVlLFxuICBicmFja2V0czogW1xuICAgIHsgdG9rZW46IFwiZGVsaW1pdGVyLmN1cmx5XCIsIG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IHRva2VuOiBcImRlbGltaXRlci5hcnJheVwiLCBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyB0b2tlbjogXCJkZWxpbWl0ZXIucGFyZW50aGVzaXNcIiwgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9XG4gIF0sXG4gIGtleXdvcmRzOiBbXG4gICAgXCJhcHBlbmRcIixcbiAgICBcImJsb2NrXCIsXG4gICAgXCJjYXNlXCIsXG4gICAgXCJkZWZhdWx0XCIsXG4gICAgXCJkb2N0eXBlXCIsXG4gICAgXCJlYWNoXCIsXG4gICAgXCJlbHNlXCIsXG4gICAgXCJleHRlbmRzXCIsXG4gICAgXCJmb3JcIixcbiAgICBcImlmXCIsXG4gICAgXCJpblwiLFxuICAgIFwiaW5jbHVkZVwiLFxuICAgIFwibWl4aW5cIixcbiAgICBcInR5cGVvZlwiLFxuICAgIFwidW5sZXNzXCIsXG4gICAgXCJ2YXJcIixcbiAgICBcIndoZW5cIlxuICBdLFxuICB0YWdzOiBbXG4gICAgXCJhXCIsXG4gICAgXCJhYmJyXCIsXG4gICAgXCJhY3JvbnltXCIsXG4gICAgXCJhZGRyZXNzXCIsXG4gICAgXCJhcmVhXCIsXG4gICAgXCJhcnRpY2xlXCIsXG4gICAgXCJhc2lkZVwiLFxuICAgIFwiYXVkaW9cIixcbiAgICBcImJcIixcbiAgICBcImJhc2VcIixcbiAgICBcImJhc2Vmb250XCIsXG4gICAgXCJiZGlcIixcbiAgICBcImJkb1wiLFxuICAgIFwiYmxvY2txdW90ZVwiLFxuICAgIFwiYm9keVwiLFxuICAgIFwiYnJcIixcbiAgICBcImJ1dHRvblwiLFxuICAgIFwiY2FudmFzXCIsXG4gICAgXCJjYXB0aW9uXCIsXG4gICAgXCJjZW50ZXJcIixcbiAgICBcImNpdGVcIixcbiAgICBcImNvZGVcIixcbiAgICBcImNvbFwiLFxuICAgIFwiY29sZ3JvdXBcIixcbiAgICBcImNvbW1hbmRcIixcbiAgICBcImRhdGFsaXN0XCIsXG4gICAgXCJkZFwiLFxuICAgIFwiZGVsXCIsXG4gICAgXCJkZXRhaWxzXCIsXG4gICAgXCJkZm5cIixcbiAgICBcImRpdlwiLFxuICAgIFwiZGxcIixcbiAgICBcImR0XCIsXG4gICAgXCJlbVwiLFxuICAgIFwiZW1iZWRcIixcbiAgICBcImZpZWxkc2V0XCIsXG4gICAgXCJmaWdjYXB0aW9uXCIsXG4gICAgXCJmaWd1cmVcIixcbiAgICBcImZvbnRcIixcbiAgICBcImZvb3RlclwiLFxuICAgIFwiZm9ybVwiLFxuICAgIFwiZnJhbWVcIixcbiAgICBcImZyYW1lc2V0XCIsXG4gICAgXCJoMVwiLFxuICAgIFwiaDJcIixcbiAgICBcImgzXCIsXG4gICAgXCJoNFwiLFxuICAgIFwiaDVcIixcbiAgICBcImg2XCIsXG4gICAgXCJoZWFkXCIsXG4gICAgXCJoZWFkZXJcIixcbiAgICBcImhncm91cFwiLFxuICAgIFwiaHJcIixcbiAgICBcImh0bWxcIixcbiAgICBcImlcIixcbiAgICBcImlmcmFtZVwiLFxuICAgIFwiaW1nXCIsXG4gICAgXCJpbnB1dFwiLFxuICAgIFwiaW5zXCIsXG4gICAgXCJrZXlnZW5cIixcbiAgICBcImtiZFwiLFxuICAgIFwibGFiZWxcIixcbiAgICBcImxpXCIsXG4gICAgXCJsaW5rXCIsXG4gICAgXCJtYXBcIixcbiAgICBcIm1hcmtcIixcbiAgICBcIm1lbnVcIixcbiAgICBcIm1ldGFcIixcbiAgICBcIm1ldGVyXCIsXG4gICAgXCJuYXZcIixcbiAgICBcIm5vZnJhbWVzXCIsXG4gICAgXCJub3NjcmlwdFwiLFxuICAgIFwib2JqZWN0XCIsXG4gICAgXCJvbFwiLFxuICAgIFwib3B0Z3JvdXBcIixcbiAgICBcIm9wdGlvblwiLFxuICAgIFwib3V0cHV0XCIsXG4gICAgXCJwXCIsXG4gICAgXCJwYXJhbVwiLFxuICAgIFwicHJlXCIsXG4gICAgXCJwcm9ncmVzc1wiLFxuICAgIFwicVwiLFxuICAgIFwicnBcIixcbiAgICBcInJ0XCIsXG4gICAgXCJydWJ5XCIsXG4gICAgXCJzXCIsXG4gICAgXCJzYW1wXCIsXG4gICAgXCJzY3JpcHRcIixcbiAgICBcInNlY3Rpb25cIixcbiAgICBcInNlbGVjdFwiLFxuICAgIFwic21hbGxcIixcbiAgICBcInNvdXJjZVwiLFxuICAgIFwic3BhblwiLFxuICAgIFwic3RyaWtlXCIsXG4gICAgXCJzdHJvbmdcIixcbiAgICBcInN0eWxlXCIsXG4gICAgXCJzdWJcIixcbiAgICBcInN1bW1hcnlcIixcbiAgICBcInN1cFwiLFxuICAgIFwidGFibGVcIixcbiAgICBcInRib2R5XCIsXG4gICAgXCJ0ZFwiLFxuICAgIFwidGV4dGFyZWFcIixcbiAgICBcInRmb290XCIsXG4gICAgXCJ0aFwiLFxuICAgIFwidGhlYWRcIixcbiAgICBcInRpbWVcIixcbiAgICBcInRpdGxlXCIsXG4gICAgXCJ0clwiLFxuICAgIFwidHJhY2tzXCIsXG4gICAgXCJ0dFwiLFxuICAgIFwidVwiLFxuICAgIFwidWxcIixcbiAgICBcInZpZGVvXCIsXG4gICAgXCJ3YnJcIlxuICBdLFxuICBzeW1ib2xzOiAvW1xcK1xcLVxcKlxcJVxcJlxcfFxcIVxcPVxcL1xcLlxcLFxcOl0rLyxcbiAgZXNjYXBlczogL1xcXFwoPzpbYWJmbnJ0dlxcXFxcIiddfHhbMC05QS1GYS1mXXsxLDR9fHVbMC05QS1GYS1mXXs0fXxVWzAtOUEtRmEtZl17OH0pLyxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgW1xuICAgICAgICAvXihcXHMqKShbYS16QS1aXy1dW1xcdy1dKikvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiJDJAdGFnc1wiOiB7XG4gICAgICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICAgICAgXCJAZW9zXCI6IFtcIlwiLCBcInRhZ1wiXSxcbiAgICAgICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFtcIlwiLCB7IHRva2VuOiBcInRhZ1wiLCBuZXh0OiBcIkB0YWcuJDFcIiB9XVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIkMkBrZXl3b3Jkc1wiOiBbXCJcIiwgeyB0b2tlbjogXCJrZXl3b3JkLiQyXCIgfV0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFtcIlwiLCBcIlwiXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgL14oXFxzKikoI1thLXpBLVpfLV1bXFx3LV0qKS8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAZW9zXCI6IFtcIlwiLCBcInRhZy5pZFwiXSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogW1wiXCIsIHsgdG9rZW46IFwidGFnLmlkXCIsIG5leHQ6IFwiQHRhZy4kMVwiIH1dXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvXihcXHMqKShcXC5bYS16QS1aXy1dW1xcdy1dKikvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGVvc1wiOiBbXCJcIiwgXCJ0YWcuY2xhc3NcIl0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFtcIlwiLCB7IHRva2VuOiBcInRhZy5jbGFzc1wiLCBuZXh0OiBcIkB0YWcuJDFcIiB9XVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvXihcXHMqKShcXHwuKikkLywgXCJcIl0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgW1xuICAgICAgICAvW2EtekEtWl8kXVtcXHckXSovLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IHsgdG9rZW46IFwia2V5d29yZC4kMFwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1t7fSgpXFxbXFxdXS8sIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgWy9Ac3ltYm9scy8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9cXGQrXFwuXFxkKyhbZUVdW1xcLStdP1xcZCspPy8sIFwibnVtYmVyLmZsb2F0XCJdLFxuICAgICAgWy9cXGQrLywgXCJudW1iZXJcIl0sXG4gICAgICBbL1wiLywgXCJzdHJpbmdcIiwgJ0BzdHJpbmcuXCInXSxcbiAgICAgIFsvJy8sIFwic3RyaW5nXCIsIFwiQHN0cmluZy4nXCJdXG4gICAgXSxcbiAgICB0YWc6IFtcbiAgICAgIFsvKFxcLikoXFxzKiQpLywgW3sgdG9rZW46IFwiZGVsaW1pdGVyXCIsIG5leHQ6IFwiQGJsb2NrVGV4dC4kUzIuXCIgfSwgXCJcIl1dLFxuICAgICAgWy9cXHMrLywgeyB0b2tlbjogXCJcIiwgbmV4dDogXCJAc2ltcGxlVGV4dFwiIH1dLFxuICAgICAgW1xuICAgICAgICAvI1thLXpBLVpfLV1bXFx3LV0qLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBlb3NcIjogeyB0b2tlbjogXCJ0YWcuaWRcIiwgbmV4dDogXCJAcG9wXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJ0YWcuaWRcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgL1xcLlthLXpBLVpfLV1bXFx3LV0qLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBlb3NcIjogeyB0b2tlbjogXCJ0YWcuY2xhc3NcIiwgbmV4dDogXCJAcG9wXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJ0YWcuY2xhc3NcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvXFwoLywgeyB0b2tlbjogXCJkZWxpbWl0ZXIucGFyZW50aGVzaXNcIiwgbmV4dDogXCJAYXR0cmlidXRlTGlzdFwiIH1dXG4gICAgXSxcbiAgICBzaW1wbGVUZXh0OiBbXG4gICAgICBbL1teI10rJC8sIHsgdG9rZW46IFwiXCIsIG5leHQ6IFwiQHBvcGFsbFwiIH1dLFxuICAgICAgWy9bXiNdKy8sIHsgdG9rZW46IFwiXCIgfV0sXG4gICAgICBbXG4gICAgICAgIC8oI3spKFtefV0qKSh9KS8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAZW9zXCI6IFtcbiAgICAgICAgICAgICAgXCJpbnRlcnBvbGF0aW9uLmRlbGltaXRlclwiLFxuICAgICAgICAgICAgICBcImludGVycG9sYXRpb25cIixcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRva2VuOiBcImludGVycG9sYXRpb24uZGVsaW1pdGVyXCIsXG4gICAgICAgICAgICAgICAgbmV4dDogXCJAcG9wYWxsXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogW1wiaW50ZXJwb2xhdGlvbi5kZWxpbWl0ZXJcIiwgXCJpbnRlcnBvbGF0aW9uXCIsIFwiaW50ZXJwb2xhdGlvbi5kZWxpbWl0ZXJcIl1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbLyMkLywgeyB0b2tlbjogXCJcIiwgbmV4dDogXCJAcG9wYWxsXCIgfV0sXG4gICAgICBbLyMvLCBcIlwiXVxuICAgIF0sXG4gICAgYXR0cmlidXRlTGlzdDogW1xuICAgICAgWy9cXHMrLywgXCJcIl0sXG4gICAgICBbXG4gICAgICAgIC8oXFx3KykoXFxzKj1cXHMqKShcInwnKS8sXG4gICAgICAgIFtcImF0dHJpYnV0ZS5uYW1lXCIsIFwiZGVsaW1pdGVyXCIsIHsgdG9rZW46IFwiYXR0cmlidXRlLnZhbHVlXCIsIG5leHQ6IFwiQHZhbHVlLiQzXCIgfV1cbiAgICAgIF0sXG4gICAgICBbL1xcdysvLCBcImF0dHJpYnV0ZS5uYW1lXCJdLFxuICAgICAgW1xuICAgICAgICAvLC8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAZW9zXCI6IHtcbiAgICAgICAgICAgICAgdG9rZW46IFwiYXR0cmlidXRlLmRlbGltaXRlclwiLFxuICAgICAgICAgICAgICBuZXh0OiBcIkBwb3BhbGxcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJhdHRyaWJ1dGUuZGVsaW1pdGVyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1xcKSQvLCB7IHRva2VuOiBcImRlbGltaXRlci5wYXJlbnRoZXNpc1wiLCBuZXh0OiBcIkBwb3BhbGxcIiB9XSxcbiAgICAgIFsvXFwpLywgeyB0b2tlbjogXCJkZWxpbWl0ZXIucGFyZW50aGVzaXNcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHdoaXRlc3BhY2U6IFtcbiAgICAgIFsvXihcXHMqKShcXC9cXC8uKikkLywgeyB0b2tlbjogXCJjb21tZW50XCIsIG5leHQ6IFwiQGJsb2NrVGV4dC4kMS5jb21tZW50XCIgfV0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvLCBcIlwiXSxcbiAgICAgIFsvPCEtLS8sIHsgdG9rZW46IFwiY29tbWVudFwiLCBuZXh0OiBcIkBjb21tZW50XCIgfV1cbiAgICBdLFxuICAgIGJsb2NrVGV4dDogW1xuICAgICAgW1xuICAgICAgICAvXlxccysuKiQvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiKCRTMlxcXFxzKy4qJClcIjogeyB0b2tlbjogXCIkUzNcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQHBvcGFsbFwiIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbLy4vLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQHBvcGFsbFwiIH1dXG4gICAgXSxcbiAgICBjb21tZW50OiBbXG4gICAgICBbL1tePFxcLV0rLywgXCJjb21tZW50LmNvbnRlbnRcIl0sXG4gICAgICBbLy0tPi8sIHsgdG9rZW46IFwiY29tbWVudFwiLCBuZXh0OiBcIkBwb3BcIiB9XSxcbiAgICAgIFsvPCEtLS8sIFwiY29tbWVudC5jb250ZW50LmludmFsaWRcIl0sXG4gICAgICBbL1s8XFwtXS8sIFwiY29tbWVudC5jb250ZW50XCJdXG4gICAgXSxcbiAgICBzdHJpbmc6IFtcbiAgICAgIFtcbiAgICAgICAgL1teXFxcXFwiJyNdKy8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAZW9zXCI6IHsgdG9rZW46IFwic3RyaW5nXCIsIG5leHQ6IFwiQHBvcGFsbFwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwic3RyaW5nXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC9AZXNjYXBlcy8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAZW9zXCI6IHsgdG9rZW46IFwic3RyaW5nLmVzY2FwZVwiLCBuZXh0OiBcIkBwb3BhbGxcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcInN0cmluZy5lc2NhcGVcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgL1xcXFwuLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBlb3NcIjoge1xuICAgICAgICAgICAgICB0b2tlbjogXCJzdHJpbmcuZXNjYXBlLmludmFsaWRcIixcbiAgICAgICAgICAgICAgbmV4dDogXCJAcG9wYWxsXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwic3RyaW5nLmVzY2FwZS5pbnZhbGlkXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbLygjeykoW159XSopKH0pLywgW1wiaW50ZXJwb2xhdGlvbi5kZWxpbWl0ZXJcIiwgXCJpbnRlcnBvbGF0aW9uXCIsIFwiaW50ZXJwb2xhdGlvbi5kZWxpbWl0ZXJcIl1dLFxuICAgICAgWy8jLywgXCJzdHJpbmdcIl0sXG4gICAgICBbXG4gICAgICAgIC9bXCInXS8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCIkIz09JFMyXCI6IHsgdG9rZW46IFwic3RyaW5nXCIsIG5leHQ6IFwiQHBvcFwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IHsgdG9rZW46IFwic3RyaW5nXCIgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIF0sXG4gICAgdmFsdWU6IFtcbiAgICAgIFtcbiAgICAgICAgL1teXFxcXFwiJ10rLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBlb3NcIjogeyB0b2tlbjogXCJhdHRyaWJ1dGUudmFsdWVcIiwgbmV4dDogXCJAcG9wYWxsXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJhdHRyaWJ1dGUudmFsdWVcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgL1xcXFwuLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBlb3NcIjogeyB0b2tlbjogXCJhdHRyaWJ1dGUudmFsdWVcIiwgbmV4dDogXCJAcG9wYWxsXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJhdHRyaWJ1dGUudmFsdWVcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgL1tcIiddLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIiQjPT0kUzJcIjogeyB0b2tlbjogXCJhdHRyaWJ1dGUudmFsdWVcIiwgbmV4dDogXCJAcG9wXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogeyB0b2tlbjogXCJhdHRyaWJ1dGUudmFsdWVcIiB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgXVxuICB9XG59O1xuZXhwb3J0IHtcbiAgY29uZixcbiAgbGFuZ3VhZ2Vcbn07XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUUcsSUFBQyxPQUFPO0FBQUEsRUFDVCxVQUFVO0FBQUEsSUFDUixhQUFhO0FBQUEsRUFDZDtBQUFBLEVBQ0QsVUFBVTtBQUFBLElBQ1IsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLEVBQ1Y7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLENBQUMsVUFBVSxTQUFTLEVBQUc7QUFBQSxJQUN2RCxFQUFFLE1BQU0sS0FBSyxPQUFPLEtBQUssT0FBTyxDQUFDLFVBQVUsU0FBUyxFQUFHO0FBQUEsSUFDdkQsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sQ0FBQyxVQUFVLFNBQVMsRUFBRztBQUFBLElBQ3ZELEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLENBQUMsVUFBVSxTQUFTLEVBQUc7QUFBQSxJQUN2RCxFQUFFLE1BQU0sS0FBSyxPQUFPLEtBQUssT0FBTyxDQUFDLFVBQVUsU0FBUyxFQUFHO0FBQUEsRUFDeEQ7QUFBQSxFQUNELFNBQVM7QUFBQSxJQUNQLFNBQVM7QUFBQSxFQUNWO0FBQ0g7QUFDRyxJQUFDLFdBQVc7QUFBQSxFQUNiLGNBQWM7QUFBQSxFQUNkLGNBQWM7QUFBQSxFQUNkLFlBQVk7QUFBQSxFQUNaLFVBQVU7QUFBQSxJQUNSLEVBQUUsT0FBTyxtQkFBbUIsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ25ELEVBQUUsT0FBTyxtQkFBbUIsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ25ELEVBQUUsT0FBTyx5QkFBeUIsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLEVBQzFEO0FBQUEsRUFDRCxVQUFVO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDRCxNQUFNO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Q7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
