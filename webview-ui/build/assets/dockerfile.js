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
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ]
};
var language = {
  defaultToken: "",
  tokenPostfix: ".dockerfile",
  variable: /\${?[\w]+}?/,
  tokenizer: {
    root: [
      { include: "@whitespace" },
      { include: "@comment" },
      [/(ONBUILD)(\s+)/, ["keyword", ""]],
      [/(ENV)(\s+)([\w]+)/, ["keyword", "", { token: "variable", next: "@arguments" }]],
      [
        /(FROM|MAINTAINER|RUN|EXPOSE|ENV|ADD|ARG|VOLUME|LABEL|USER|WORKDIR|COPY|CMD|STOPSIGNAL|SHELL|HEALTHCHECK|ENTRYPOINT)/,
        { token: "keyword", next: "@arguments" }
      ]
    ],
    arguments: [
      { include: "@whitespace" },
      { include: "@strings" },
      [
        /(@variable)/,
        {
          cases: {
            "@eos": { token: "variable", next: "@popall" },
            "@default": "variable"
          }
        }
      ],
      [
        /\\/,
        {
          cases: {
            "@eos": "",
            "@default": ""
          }
        }
      ],
      [
        /./,
        {
          cases: {
            "@eos": { token: "", next: "@popall" },
            "@default": ""
          }
        }
      ]
    ],
    whitespace: [
      [
        /\s+/,
        {
          cases: {
            "@eos": { token: "", next: "@popall" },
            "@default": ""
          }
        }
      ]
    ],
    comment: [[/(^#.*$)/, "comment", "@popall"]],
    strings: [
      [/\\'$/, "", "@popall"],
      [/\\'/, ""],
      [/'$/, "string", "@popall"],
      [/'/, "string", "@stringBody"],
      [/"$/, "string", "@popall"],
      [/"/, "string", "@dblStringBody"]
    ],
    stringBody: [
      [
        /[^\\\$']/,
        {
          cases: {
            "@eos": { token: "string", next: "@popall" },
            "@default": "string"
          }
        }
      ],
      [/\\./, "string.escape"],
      [/'$/, "string", "@popall"],
      [/'/, "string", "@pop"],
      [/(@variable)/, "variable"],
      [/\\$/, "string"],
      [/$/, "string", "@popall"]
    ],
    dblStringBody: [
      [
        /[^\\\$"]/,
        {
          cases: {
            "@eos": { token: "string", next: "@popall" },
            "@default": "string"
          }
        }
      ],
      [/\\./, "string.escape"],
      [/"$/, "string", "@popall"],
      [/"/, "string", "@pop"],
      [/(@variable)/, "variable"],
      [/\\$/, "string"],
      [/$/, "string", "@popall"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2VyZmlsZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL21vbmFjby1lZGl0b3IvZXNtL3ZzL2Jhc2ljLWxhbmd1YWdlcy9kb2NrZXJmaWxlL2RvY2tlcmZpbGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2RvY2tlcmZpbGUvZG9ja2VyZmlsZS50c1xudmFyIGNvbmYgPSB7XG4gIGJyYWNrZXRzOiBbXG4gICAgW1wie1wiLCBcIn1cIl0sXG4gICAgW1wiW1wiLCBcIl1cIl0sXG4gICAgW1wiKFwiLCBcIilcIl1cbiAgXSxcbiAgYXV0b0Nsb3NpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfVxuICBdLFxuICBzdXJyb3VuZGluZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiB9XG4gIF1cbn07XG52YXIgbGFuZ3VhZ2UgPSB7XG4gIGRlZmF1bHRUb2tlbjogXCJcIixcbiAgdG9rZW5Qb3N0Zml4OiBcIi5kb2NrZXJmaWxlXCIsXG4gIHZhcmlhYmxlOiAvXFwkez9bXFx3XSt9Py8sXG4gIHRva2VuaXplcjoge1xuICAgIHJvb3Q6IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGNvbW1lbnRcIiB9LFxuICAgICAgWy8oT05CVUlMRCkoXFxzKykvLCBbXCJrZXl3b3JkXCIsIFwiXCJdXSxcbiAgICAgIFsvKEVOVikoXFxzKykoW1xcd10rKS8sIFtcImtleXdvcmRcIiwgXCJcIiwgeyB0b2tlbjogXCJ2YXJpYWJsZVwiLCBuZXh0OiBcIkBhcmd1bWVudHNcIiB9XV0sXG4gICAgICBbXG4gICAgICAgIC8oRlJPTXxNQUlOVEFJTkVSfFJVTnxFWFBPU0V8RU5WfEFERHxBUkd8Vk9MVU1FfExBQkVMfFVTRVJ8V09SS0RJUnxDT1BZfENNRHxTVE9QU0lHTkFMfFNIRUxMfEhFQUxUSENIRUNLfEVOVFJZUE9JTlQpLyxcbiAgICAgICAgeyB0b2tlbjogXCJrZXl3b3JkXCIsIG5leHQ6IFwiQGFyZ3VtZW50c1wiIH1cbiAgICAgIF1cbiAgICBdLFxuICAgIGFyZ3VtZW50czogW1xuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAc3RyaW5nc1wiIH0sXG4gICAgICBbXG4gICAgICAgIC8oQHZhcmlhYmxlKS8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAZW9zXCI6IHsgdG9rZW46IFwidmFyaWFibGVcIiwgbmV4dDogXCJAcG9wYWxsXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJ2YXJpYWJsZVwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvXFxcXC8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAZW9zXCI6IFwiXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8uLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBlb3NcIjogeyB0b2tlbjogXCJcIiwgbmV4dDogXCJAcG9wYWxsXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIF0sXG4gICAgd2hpdGVzcGFjZTogW1xuICAgICAgW1xuICAgICAgICAvXFxzKy8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAZW9zXCI6IHsgdG9rZW46IFwiXCIsIG5leHQ6IFwiQHBvcGFsbFwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICBdLFxuICAgIGNvbW1lbnQ6IFtbLyheIy4qJCkvLCBcImNvbW1lbnRcIiwgXCJAcG9wYWxsXCJdXSxcbiAgICBzdHJpbmdzOiBbXG4gICAgICBbL1xcXFwnJC8sIFwiXCIsIFwiQHBvcGFsbFwiXSxcbiAgICAgIFsvXFxcXCcvLCBcIlwiXSxcbiAgICAgIFsvJyQvLCBcInN0cmluZ1wiLCBcIkBwb3BhbGxcIl0sXG4gICAgICBbLycvLCBcInN0cmluZ1wiLCBcIkBzdHJpbmdCb2R5XCJdLFxuICAgICAgWy9cIiQvLCBcInN0cmluZ1wiLCBcIkBwb3BhbGxcIl0sXG4gICAgICBbL1wiLywgXCJzdHJpbmdcIiwgXCJAZGJsU3RyaW5nQm9keVwiXVxuICAgIF0sXG4gICAgc3RyaW5nQm9keTogW1xuICAgICAgW1xuICAgICAgICAvW15cXFxcXFwkJ10vLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGVvc1wiOiB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiBcIkBwb3BhbGxcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9cXFxcLi8sIFwic3RyaW5nLmVzY2FwZVwiXSxcbiAgICAgIFsvJyQvLCBcInN0cmluZ1wiLCBcIkBwb3BhbGxcIl0sXG4gICAgICBbLycvLCBcInN0cmluZ1wiLCBcIkBwb3BcIl0sXG4gICAgICBbLyhAdmFyaWFibGUpLywgXCJ2YXJpYWJsZVwiXSxcbiAgICAgIFsvXFxcXCQvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvJC8sIFwic3RyaW5nXCIsIFwiQHBvcGFsbFwiXVxuICAgIF0sXG4gICAgZGJsU3RyaW5nQm9keTogW1xuICAgICAgW1xuICAgICAgICAvW15cXFxcXFwkXCJdLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBlb3NcIjogeyB0b2tlbjogXCJzdHJpbmdcIiwgbmV4dDogXCJAcG9wYWxsXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJzdHJpbmdcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbL1wiJC8sIFwic3RyaW5nXCIsIFwiQHBvcGFsbFwiXSxcbiAgICAgIFsvXCIvLCBcInN0cmluZ1wiLCBcIkBwb3BcIl0sXG4gICAgICBbLyhAdmFyaWFibGUpLywgXCJ2YXJpYWJsZVwiXSxcbiAgICAgIFsvXFxcXCQvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvJC8sIFwic3RyaW5nXCIsIFwiQHBvcGFsbFwiXVxuICAgIF1cbiAgfVxufTtcbmV4cG9ydCB7XG4gIGNvbmYsXG4gIGxhbmd1YWdlXG59O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVFHLElBQUMsT0FBTztBQUFBLEVBQ1QsVUFBVTtBQUFBLElBQ1IsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLEVBQ1Y7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLEVBQzFCO0FBQUEsRUFDRCxrQkFBa0I7QUFBQSxJQUNoQixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxFQUMxQjtBQUNIO0FBQ0csSUFBQyxXQUFXO0FBQUEsRUFDYixjQUFjO0FBQUEsRUFDZCxjQUFjO0FBQUEsRUFDZCxVQUFVO0FBQUEsRUFDVixXQUFXO0FBQUEsSUFDVCxNQUFNO0FBQUEsTUFDSixFQUFFLFNBQVMsY0FBZTtBQUFBLE1BQzFCLEVBQUUsU0FBUyxXQUFZO0FBQUEs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
