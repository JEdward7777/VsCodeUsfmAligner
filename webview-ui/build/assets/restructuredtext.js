/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "<", close: ">", notIn: ["string"] }
  ],
  surroundingPairs: [
    { open: "(", close: ")" },
    { open: "[", close: "]" },
    { open: "`", close: "`" }
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*<!--\\s*#?region\\b.*-->"),
      end: new RegExp("^\\s*<!--\\s*#?endregion\\b.*-->")
    }
  }
};
var language = {
  defaultToken: "",
  tokenPostfix: ".rst",
  control: /[\\`*_\[\]{}()#+\-\.!]/,
  escapes: /\\(?:@control)/,
  empty: [
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "link",
    "meta",
    "param"
  ],
  alphanumerics: /[A-Za-z0-9]/,
  simpleRefNameWithoutBq: /(?:@alphanumerics[-_+:.]*@alphanumerics)+|(?:@alphanumerics+)/,
  simpleRefName: /(?:`@phrase`|@simpleRefNameWithoutBq)/,
  phrase: /@simpleRefNameWithoutBq(?:\s@simpleRefNameWithoutBq)*/,
  citationName: /[A-Za-z][A-Za-z0-9-_.]*/,
  blockLiteralStart: /(?:[!"#$%&'()*+,-./:;<=>?@\[\]^_`{|}~]|[\s])/,
  precedingChars: /(?:[ -:/'"<([{])/,
  followingChars: /(?:[ -.,:;!?/'")\]}>]|$)/,
  punctuation: /(=|-|~|`|#|"|\^|\+|\*|:|\.|'|_|\+)/,
  tokenizer: {
    root: [
      [/^(@punctuation{3,}$){1,1}?/, "keyword"],
      [/^\s*([\*\-+‣•]|[a-zA-Z0-9]+\.|\([a-zA-Z0-9]+\)|[a-zA-Z0-9]+\))\s/, "keyword"],
      [/([ ]::)\s*$/, "keyword", "@blankLineOfLiteralBlocks"],
      [/(::)\s*$/, "keyword", "@blankLineOfLiteralBlocks"],
      { include: "@tables" },
      { include: "@explicitMarkupBlocks" },
      { include: "@inlineMarkup" }
    ],
    explicitMarkupBlocks: [
      { include: "@citations" },
      { include: "@footnotes" },
      [
        /^(\.\.\s)(@simpleRefName)(::\s)(.*)$/,
        [{ token: "", next: "subsequentLines" }, "keyword", "", ""]
      ],
      [
        /^(\.\.)(\s+)(_)(@simpleRefName)(:)(\s+)(.*)/,
        [{ token: "", next: "hyperlinks" }, "", "", "string.link", "", "", "string.link"]
      ],
      [
        /^((?:(?:\.\.)(?:\s+))?)(__)(:)(\s+)(.*)/,
        [{ token: "", next: "subsequentLines" }, "", "", "", "string.link"]
      ],
      [/^(__\s+)(.+)/, ["", "string.link"]],
      [
        /^(\.\.)( \|)([^| ]+[^|]*[^| ]*)(\| )(@simpleRefName)(:: .*)/,
        [{ token: "", next: "subsequentLines" }, "", "string.link", "", "keyword", ""],
        "@rawBlocks"
      ],
      [/(\|)([^| ]+[^|]*[^| ]*)(\|_{0,2})/, ["", "string.link", ""]],
      [/^(\.\.)([ ].*)$/, [{ token: "", next: "@comments" }, "comment"]]
    ],
    inlineMarkup: [
      { include: "@citationsReference" },
      { include: "@footnotesReference" },
      [/(@simpleRefName)(_{1,2})/, ["string.link", ""]],
      [/(`)([^<`]+\s+)(<)(.*)(>)(`)(_)/, ["", "string.link", "", "string.link", "", "", ""]],
      [/\*\*([^\\*]|\*(?!\*))+\*\*/, "strong"],
      [/\*[^*]+\*/, "emphasis"],
      [/(``)((?:[^`]|\`(?!`))+)(``)/, ["", "keyword", ""]],
      [/(__\s+)(.+)/, ["", "keyword"]],
      [/(:)((?:@simpleRefNameWithoutBq)?)(:`)([^`]+)(`)/, ["", "keyword", "", "", ""]],
      [/(`)([^`]+)(`:)((?:@simpleRefNameWithoutBq)?)(:)/, ["", "", "", "keyword", ""]],
      [/(`)([^`]+)(`)/, ""],
      [/(_`)(@phrase)(`)/, ["", "string.link", ""]]
    ],
    citations: [
      [
        /^(\.\.\s+\[)((?:@citationName))(\]\s+)(.*)/,
        [{ token: "", next: "@subsequentLines" }, "string.link", "", ""]
      ]
    ],
    citationsReference: [[/(\[)(@citationName)(\]_)/, ["", "string.link", ""]]],
    footnotes: [
      [
        /^(\.\.\s+\[)((?:[0-9]+))(\]\s+.*)/,
        [{ token: "", next: "@subsequentLines" }, "string.link", ""]
      ],
      [
        /^(\.\.\s+\[)((?:#@simpleRefName?))(\]\s+)(.*)/,
        [{ token: "", next: "@subsequentLines" }, "string.link", "", ""]
      ],
      [
        /^(\.\.\s+\[)((?:\*))(\]\s+)(.*)/,
        [{ token: "", next: "@subsequentLines" }, "string.link", "", ""]
      ]
    ],
    footnotesReference: [
      [/(\[)([0-9]+)(\])(_)/, ["", "string.link", "", ""]],
      [/(\[)(#@simpleRefName?)(\])(_)/, ["", "string.link", "", ""]],
      [/(\[)(\*)(\])(_)/, ["", "string.link", "", ""]]
    ],
    blankLineOfLiteralBlocks: [
      [/^$/, "", "@subsequentLinesOfLiteralBlocks"],
      [/^.*$/, "", "@pop"]
    ],
    subsequentLinesOfLiteralBlocks: [
      [/(@blockLiteralStart+)(.*)/, ["keyword", ""]],
      [/^(?!blockLiteralStart)/, "", "@popall"]
    ],
    subsequentLines: [
      [/^[\s]+.*/, ""],
      [/^(?!\s)/, "", "@pop"]
    ],
    hyperlinks: [
      [/^[\s]+.*/, "string.link"],
      [/^(?!\s)/, "", "@pop"]
    ],
    comments: [
      [/^[\s]+.*/, "comment"],
      [/^(?!\s)/, "", "@pop"]
    ],
    tables: [
      [/\+-[+-]+/, "keyword"],
      [/\+=[+=]+/, "keyword"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdHJ1Y3R1cmVkdGV4dC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL21vbmFjby1lZGl0b3IvZXNtL3ZzL2Jhc2ljLWxhbmd1YWdlcy9yZXN0cnVjdHVyZWR0ZXh0L3Jlc3RydWN0dXJlZHRleHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL3Jlc3RydWN0dXJlZHRleHQvcmVzdHJ1Y3R1cmVkdGV4dC50c1xudmFyIGNvbmYgPSB7XG4gIGJyYWNrZXRzOiBbXG4gICAgW1wie1wiLCBcIn1cIl0sXG4gICAgW1wiW1wiLCBcIl1cIl0sXG4gICAgW1wiKFwiLCBcIilcIl1cbiAgXSxcbiAgYXV0b0Nsb3NpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogXCI8XCIsIGNsb3NlOiBcIj5cIiwgbm90SW46IFtcInN0cmluZ1wiXSB9XG4gIF0sXG4gIHN1cnJvdW5kaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiYFwiLCBjbG9zZTogXCJgXCIgfVxuICBdLFxuICBmb2xkaW5nOiB7XG4gICAgbWFya2Vyczoge1xuICAgICAgc3RhcnQ6IG5ldyBSZWdFeHAoXCJeXFxcXHMqPCEtLVxcXFxzKiM/cmVnaW9uXFxcXGIuKi0tPlwiKSxcbiAgICAgIGVuZDogbmV3IFJlZ0V4cChcIl5cXFxccyo8IS0tXFxcXHMqIz9lbmRyZWdpb25cXFxcYi4qLS0+XCIpXG4gICAgfVxuICB9XG59O1xudmFyIGxhbmd1YWdlID0ge1xuICBkZWZhdWx0VG9rZW46IFwiXCIsXG4gIHRva2VuUG9zdGZpeDogXCIucnN0XCIsXG4gIGNvbnRyb2w6IC9bXFxcXGAqX1xcW1xcXXt9KCkjK1xcLVxcLiFdLyxcbiAgZXNjYXBlczogL1xcXFwoPzpAY29udHJvbCkvLFxuICBlbXB0eTogW1xuICAgIFwiYXJlYVwiLFxuICAgIFwiYmFzZVwiLFxuICAgIFwiYmFzZWZvbnRcIixcbiAgICBcImJyXCIsXG4gICAgXCJjb2xcIixcbiAgICBcImZyYW1lXCIsXG4gICAgXCJoclwiLFxuICAgIFwiaW1nXCIsXG4gICAgXCJpbnB1dFwiLFxuICAgIFwiaXNpbmRleFwiLFxuICAgIFwibGlua1wiLFxuICAgIFwibWV0YVwiLFxuICAgIFwicGFyYW1cIlxuICBdLFxuICBhbHBoYW51bWVyaWNzOiAvW0EtWmEtejAtOV0vLFxuICBzaW1wbGVSZWZOYW1lV2l0aG91dEJxOiAvKD86QGFscGhhbnVtZXJpY3NbLV8rOi5dKkBhbHBoYW51bWVyaWNzKSt8KD86QGFscGhhbnVtZXJpY3MrKS8sXG4gIHNpbXBsZVJlZk5hbWU6IC8oPzpgQHBocmFzZWB8QHNpbXBsZVJlZk5hbWVXaXRob3V0QnEpLyxcbiAgcGhyYXNlOiAvQHNpbXBsZVJlZk5hbWVXaXRob3V0QnEoPzpcXHNAc2ltcGxlUmVmTmFtZVdpdGhvdXRCcSkqLyxcbiAgY2l0YXRpb25OYW1lOiAvW0EtWmEtel1bQS1aYS16MC05LV8uXSovLFxuICBibG9ja0xpdGVyYWxTdGFydDogLyg/OlshXCIjJCUmJygpKissLS4vOjs8PT4/QFxcW1xcXV5fYHt8fX5dfFtcXHNdKS8sXG4gIHByZWNlZGluZ0NoYXJzOiAvKD86WyAtOi8nXCI8KFt7XSkvLFxuICBmb2xsb3dpbmdDaGFyczogLyg/OlsgLS4sOjshPy8nXCIpXFxdfT5dfCQpLyxcbiAgcHVuY3R1YXRpb246IC8oPXwtfH58YHwjfFwifFxcXnxcXCt8XFwqfDp8XFwufCd8X3xcXCspLyxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgWy9eKEBwdW5jdHVhdGlvbnszLH0kKXsxLDF9Py8sIFwia2V5d29yZFwiXSxcbiAgICAgIFsvXlxccyooW1xcKlxcLSvigKPigKJdfFthLXpBLVowLTldK1xcLnxcXChbYS16QS1aMC05XStcXCl8W2EtekEtWjAtOV0rXFwpKVxccy8sIFwia2V5d29yZFwiXSxcbiAgICAgIFsvKFsgXTo6KVxccyokLywgXCJrZXl3b3JkXCIsIFwiQGJsYW5rTGluZU9mTGl0ZXJhbEJsb2Nrc1wiXSxcbiAgICAgIFsvKDo6KVxccyokLywgXCJrZXl3b3JkXCIsIFwiQGJsYW5rTGluZU9mTGl0ZXJhbEJsb2Nrc1wiXSxcbiAgICAgIHsgaW5jbHVkZTogXCJAdGFibGVzXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAZXhwbGljaXRNYXJrdXBCbG9ja3NcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBpbmxpbmVNYXJrdXBcIiB9XG4gICAgXSxcbiAgICBleHBsaWNpdE1hcmt1cEJsb2NrczogW1xuICAgICAgeyBpbmNsdWRlOiBcIkBjaXRhdGlvbnNcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBmb290bm90ZXNcIiB9LFxuICAgICAgW1xuICAgICAgICAvXihcXC5cXC5cXHMpKEBzaW1wbGVSZWZOYW1lKSg6OlxccykoLiopJC8sXG4gICAgICAgIFt7IHRva2VuOiBcIlwiLCBuZXh0OiBcInN1YnNlcXVlbnRMaW5lc1wiIH0sIFwia2V5d29yZFwiLCBcIlwiLCBcIlwiXVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgL14oXFwuXFwuKShcXHMrKShfKShAc2ltcGxlUmVmTmFtZSkoOikoXFxzKykoLiopLyxcbiAgICAgICAgW3sgdG9rZW46IFwiXCIsIG5leHQ6IFwiaHlwZXJsaW5rc1wiIH0sIFwiXCIsIFwiXCIsIFwic3RyaW5nLmxpbmtcIiwgXCJcIiwgXCJcIiwgXCJzdHJpbmcubGlua1wiXVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgL14oKD86KD86XFwuXFwuKSg/OlxccyspKT8pKF9fKSg6KShcXHMrKSguKikvLFxuICAgICAgICBbeyB0b2tlbjogXCJcIiwgbmV4dDogXCJzdWJzZXF1ZW50TGluZXNcIiB9LCBcIlwiLCBcIlwiLCBcIlwiLCBcInN0cmluZy5saW5rXCJdXG4gICAgICBdLFxuICAgICAgWy9eKF9fXFxzKykoLispLywgW1wiXCIsIFwic3RyaW5nLmxpbmtcIl1dLFxuICAgICAgW1xuICAgICAgICAvXihcXC5cXC4pKCBcXHwpKFtefCBdK1tefF0qW158IF0qKShcXHwgKShAc2ltcGxlUmVmTmFtZSkoOjogLiopLyxcbiAgICAgICAgW3sgdG9rZW46IFwiXCIsIG5leHQ6IFwic3Vic2VxdWVudExpbmVzXCIgfSwgXCJcIiwgXCJzdHJpbmcubGlua1wiLCBcIlwiLCBcImtleXdvcmRcIiwgXCJcIl0sXG4gICAgICAgIFwiQHJhd0Jsb2Nrc1wiXG4gICAgICBdLFxuICAgICAgWy8oXFx8KShbXnwgXStbXnxdKltefCBdKikoXFx8X3swLDJ9KS8sIFtcIlwiLCBcInN0cmluZy5saW5rXCIsIFwiXCJdXSxcbiAgICAgIFsvXihcXC5cXC4pKFsgXS4qKSQvLCBbeyB0b2tlbjogXCJcIiwgbmV4dDogXCJAY29tbWVudHNcIiB9LCBcImNvbW1lbnRcIl1dXG4gICAgXSxcbiAgICBpbmxpbmVNYXJrdXA6IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAY2l0YXRpb25zUmVmZXJlbmNlXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAZm9vdG5vdGVzUmVmZXJlbmNlXCIgfSxcbiAgICAgIFsvKEBzaW1wbGVSZWZOYW1lKShfezEsMn0pLywgW1wic3RyaW5nLmxpbmtcIiwgXCJcIl1dLFxuICAgICAgWy8oYCkoW148YF0rXFxzKykoPCkoLiopKD4pKGApKF8pLywgW1wiXCIsIFwic3RyaW5nLmxpbmtcIiwgXCJcIiwgXCJzdHJpbmcubGlua1wiLCBcIlwiLCBcIlwiLCBcIlwiXV0sXG4gICAgICBbL1xcKlxcKihbXlxcXFwqXXxcXCooPyFcXCopKStcXCpcXCovLCBcInN0cm9uZ1wiXSxcbiAgICAgIFsvXFwqW14qXStcXCovLCBcImVtcGhhc2lzXCJdLFxuICAgICAgWy8oYGApKCg/OlteYF18XFxgKD8hYCkpKykoYGApLywgW1wiXCIsIFwia2V5d29yZFwiLCBcIlwiXV0sXG4gICAgICBbLyhfX1xccyspKC4rKS8sIFtcIlwiLCBcImtleXdvcmRcIl1dLFxuICAgICAgWy8oOikoKD86QHNpbXBsZVJlZk5hbWVXaXRob3V0QnEpPykoOmApKFteYF0rKShgKS8sIFtcIlwiLCBcImtleXdvcmRcIiwgXCJcIiwgXCJcIiwgXCJcIl1dLFxuICAgICAgWy8oYCkoW15gXSspKGA6KSgoPzpAc2ltcGxlUmVmTmFtZVdpdGhvdXRCcSk/KSg6KS8sIFtcIlwiLCBcIlwiLCBcIlwiLCBcImtleXdvcmRcIiwgXCJcIl1dLFxuICAgICAgWy8oYCkoW15gXSspKGApLywgXCJcIl0sXG4gICAgICBbLyhfYCkoQHBocmFzZSkoYCkvLCBbXCJcIiwgXCJzdHJpbmcubGlua1wiLCBcIlwiXV1cbiAgICBdLFxuICAgIGNpdGF0aW9uczogW1xuICAgICAgW1xuICAgICAgICAvXihcXC5cXC5cXHMrXFxbKSgoPzpAY2l0YXRpb25OYW1lKSkoXFxdXFxzKykoLiopLyxcbiAgICAgICAgW3sgdG9rZW46IFwiXCIsIG5leHQ6IFwiQHN1YnNlcXVlbnRMaW5lc1wiIH0sIFwic3RyaW5nLmxpbmtcIiwgXCJcIiwgXCJcIl1cbiAgICAgIF1cbiAgICBdLFxuICAgIGNpdGF0aW9uc1JlZmVyZW5jZTogW1svKFxcWykoQGNpdGF0aW9uTmFtZSkoXFxdXykvLCBbXCJcIiwgXCJzdHJpbmcubGlua1wiLCBcIlwiXV1dLFxuICAgIGZvb3Rub3RlczogW1xuICAgICAgW1xuICAgICAgICAvXihcXC5cXC5cXHMrXFxbKSgoPzpbMC05XSspKShcXF1cXHMrLiopLyxcbiAgICAgICAgW3sgdG9rZW46IFwiXCIsIG5leHQ6IFwiQHN1YnNlcXVlbnRMaW5lc1wiIH0sIFwic3RyaW5nLmxpbmtcIiwgXCJcIl1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC9eKFxcLlxcLlxccytcXFspKCg/OiNAc2ltcGxlUmVmTmFtZT8pKShcXF1cXHMrKSguKikvLFxuICAgICAgICBbeyB0b2tlbjogXCJcIiwgbmV4dDogXCJAc3Vic2VxdWVudExpbmVzXCIgfSwgXCJzdHJpbmcubGlua1wiLCBcIlwiLCBcIlwiXVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgL14oXFwuXFwuXFxzK1xcWykoKD86XFwqKSkoXFxdXFxzKykoLiopLyxcbiAgICAgICAgW3sgdG9rZW46IFwiXCIsIG5leHQ6IFwiQHN1YnNlcXVlbnRMaW5lc1wiIH0sIFwic3RyaW5nLmxpbmtcIiwgXCJcIiwgXCJcIl1cbiAgICAgIF1cbiAgICBdLFxuICAgIGZvb3Rub3Rlc1JlZmVyZW5jZTogW1xuICAgICAgWy8oXFxbKShbMC05XSspKFxcXSkoXykvLCBbXCJcIiwgXCJzdHJpbmcubGlua1wiLCBcIlwiLCBcIlwiXV0sXG4gICAgICBbLyhcXFspKCNAc2ltcGxlUmVmTmFtZT8pKFxcXSkoXykvLCBbXCJcIiwgXCJzdHJpbmcubGlua1wiLCBcIlwiLCBcIlwiXV0sXG4gICAgICBbLyhcXFspKFxcKikoXFxdKShfKS8sIFtcIlwiLCBcInN0cmluZy5saW5rXCIsIFwiXCIsIFwiXCJdXVxuICAgIF0sXG4gICAgYmxhbmtMaW5lT2ZMaXRlcmFsQmxvY2tzOiBbXG4gICAgICBbL14kLywgXCJcIiwgXCJAc3Vic2VxdWVudExpbmVzT2ZMaXRlcmFsQmxvY2tzXCJdLFxuICAgICAgWy9eLiokLywgXCJcIiwgXCJAcG9wXCJdXG4gICAgXSxcbiAgICBzdWJzZXF1ZW50TGluZXNPZkxpdGVyYWxCbG9ja3M6IFtcbiAgICAgIFsvKEBibG9ja0xpdGVyYWxTdGFydCspKC4qKS8sIFtcImtleXdvcmRcIiwgXCJcIl1dLFxuICAgICAgWy9eKD8hYmxvY2tMaXRlcmFsU3RhcnQpLywgXCJcIiwgXCJAcG9wYWxsXCJdXG4gICAgXSxcbiAgICBzdWJzZXF1ZW50TGluZXM6IFtcbiAgICAgIFsvXltcXHNdKy4qLywgXCJcIl0sXG4gICAgICBbL14oPyFcXHMpLywgXCJcIiwgXCJAcG9wXCJdXG4gICAgXSxcbiAgICBoeXBlcmxpbmtzOiBbXG4gICAgICBbL15bXFxzXSsuKi8sIFwic3RyaW5nLmxpbmtcIl0sXG4gICAgICBbL14oPyFcXHMpLywgXCJcIiwgXCJAcG9wXCJdXG4gICAgXSxcbiAgICBjb21tZW50czogW1xuICAgICAgWy9eW1xcc10rLiovLCBcImNvbW1lbnRcIl0sXG4gICAgICBbL14oPyFcXHMpLywgXCJcIiwgXCJAcG9wXCJdXG4gICAgXSxcbiAgICB0YWJsZXM6IFtcbiAgICAgIFsvXFwrLVsrLV0rLywgXCJrZXl3b3JkXCJdLFxuICAgICAgWy9cXCs9Wys9XSsvLCBcImtleXdvcmRcIl1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULFVBQVU7QUFBQSxJQUNSLENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxLQUFLLEdBQUc7QUFB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
