import { m as monaco_editor_core_star } from "./index.js";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var monaco_editor_core_exports = {};
__reExport(monaco_editor_core_exports, monaco_editor_core_star);
var EMPTY_ELEMENTS = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "menuitem",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];
var conf = {
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,
  comments: {
    blockComment: ["{{!--", "--}}"]
  },
  brackets: [
    ["<!--", "-->"],
    ["<", ">"],
    ["{{", "}}"],
    ["{", "}"],
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
    { open: "<", close: ">" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  onEnterRules: [
    {
      beforeText: new RegExp(`<(?!(?:${EMPTY_ELEMENTS.join("|")}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`, "i"),
      afterText: /^<\/(\w[\w\d]*)\s*>$/i,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.IndentOutdent
      }
    },
    {
      beforeText: new RegExp(`<(?!(?:${EMPTY_ELEMENTS.join("|")}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`, "i"),
      action: { indentAction: monaco_editor_core_exports.languages.IndentAction.Indent }
    }
  ]
};
var language = {
  defaultToken: "",
  tokenPostfix: "",
  tokenizer: {
    root: [
      [/\{\{!--/, "comment.block.start.handlebars", "@commentBlock"],
      [/\{\{!/, "comment.start.handlebars", "@comment"],
      [/\{\{/, { token: "@rematch", switchTo: "@handlebarsInSimpleState.root" }],
      [/<!DOCTYPE/, "metatag.html", "@doctype"],
      [/<!--/, "comment.html", "@commentHtml"],
      [/(<)(\w+)(\/>)/, ["delimiter.html", "tag.html", "delimiter.html"]],
      [/(<)(script)/, ["delimiter.html", { token: "tag.html", next: "@script" }]],
      [/(<)(style)/, ["delimiter.html", { token: "tag.html", next: "@style" }]],
      [/(<)([:\w]+)/, ["delimiter.html", { token: "tag.html", next: "@otherTag" }]],
      [/(<\/)(\w+)/, ["delimiter.html", { token: "tag.html", next: "@otherTag" }]],
      [/</, "delimiter.html"],
      [/\{/, "delimiter.html"],
      [/[^<{]+/]
    ],
    doctype: [
      [
        /\{\{/,
        {
          token: "@rematch",
          switchTo: "@handlebarsInSimpleState.comment"
        }
      ],
      [/[^>]+/, "metatag.content.html"],
      [/>/, "metatag.html", "@pop"]
    ],
    comment: [
      [/\}\}/, "comment.end.handlebars", "@pop"],
      [/./, "comment.content.handlebars"]
    ],
    commentBlock: [
      [/--\}\}/, "comment.block.end.handlebars", "@pop"],
      [/./, "comment.content.handlebars"]
    ],
    commentHtml: [
      [
        /\{\{/,
        {
          token: "@rematch",
          switchTo: "@handlebarsInSimpleState.comment"
        }
      ],
      [/-->/, "comment.html", "@pop"],
      [/[^-]+/, "comment.content.html"],
      [/./, "comment.content.html"]
    ],
    otherTag: [
      [
        /\{\{/,
        {
          token: "@rematch",
          switchTo: "@handlebarsInSimpleState.otherTag"
        }
      ],
      [/\/?>/, "delimiter.html", "@pop"],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [/[ \t\r\n]+/]
    ],
    script: [
      [
        /\{\{/,
        {
          token: "@rematch",
          switchTo: "@handlebarsInSimpleState.script"
        }
      ],
      [/type/, "attribute.name", "@scriptAfterType"],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@scriptEmbedded.text/javascript",
          nextEmbedded: "text/javascript"
        }
      ],
      [/[ \t\r\n]+/],
      [
        /(<\/)(script\s*)(>)/,
        ["delimiter.html", "tag.html", { token: "delimiter.html", next: "@pop" }]
      ]
    ],
    scriptAfterType: [
      [
        /\{\{/,
        {
          token: "@rematch",
          switchTo: "@handlebarsInSimpleState.scriptAfterType"
        }
      ],
      [/=/, "delimiter", "@scriptAfterTypeEquals"],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@scriptEmbedded.text/javascript",
          nextEmbedded: "text/javascript"
        }
      ],
      [/[ \t\r\n]+/],
      [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    scriptAfterTypeEquals: [
      [
        /\{\{/,
        {
          token: "@rematch",
          switchTo: "@handlebarsInSimpleState.scriptAfterTypeEquals"
        }
      ],
      [
        /"([^"]*)"/,
        {
          token: "attribute.value",
          switchTo: "@scriptWithCustomType.$1"
        }
      ],
      [
        /'([^']*)'/,
        {
          token: "attribute.value",
          switchTo: "@scriptWithCustomType.$1"
        }
      ],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@scriptEmbedded.text/javascript",
          nextEmbedded: "text/javascript"
        }
      ],
      [/[ \t\r\n]+/],
      [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    scriptWithCustomType: [
      [
        /\{\{/,
        {
          token: "@rematch",
          switchTo: "@handlebarsInSimpleState.scriptWithCustomType.$S2"
        }
      ],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@scriptEmbedded.$S2",
          nextEmbedded: "$S2"
        }
      ],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [/[ \t\r\n]+/],
      [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    scriptEmbedded: [
      [
        /\{\{/,
        {
          token: "@rematch",
          switchTo: "@handlebarsInEmbeddedState.scriptEmbedded.$S2",
          nextEmbedded: "@pop"
        }
      ],
      [/<\/script/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }]
    ],
    style: [
      [
        /\{\{/,
        {
          token: "@rematch",
          switchTo: "@handlebarsInSimpleState.style"
        }
      ],
      [/type/, "attribute.name", "@styleAfterType"],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@styleEmbedded.text/css",
          nextEmbedded: "text/css"
        }
      ],
      [/[ \t\r\n]+/],
      [
        /(<\/)(style\s*)(>)/,
        ["delimiter.html", "tag.html", { token: "delimiter.html", next: "@pop" }]
      ]
    ],
    styleAfterType: [
      [
        /\{\{/,
        {
          token: "@rematch",
          switchTo: "@handlebarsInSimpleState.styleAfterType"
        }
      ],
      [/=/, "delimiter", "@styleAfterTypeEquals"],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@styleEmbedded.text/css",
          nextEmbedded: "text/css"
        }
      ],
      [/[ \t\r\n]+/],
      [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    styleAfterTypeEquals: [
      [
        /\{\{/,
        {
          token: "@rematch",
          switchTo: "@handlebarsInSimpleState.styleAfterTypeEquals"
        }
      ],
      [
        /"([^"]*)"/,
        {
          token: "attribute.value",
          switchTo: "@styleWithCustomType.$1"
        }
      ],
      [
        /'([^']*)'/,
        {
          token: "attribute.value",
          switchTo: "@styleWithCustomType.$1"
        }
      ],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@styleEmbedded.text/css",
          nextEmbedded: "text/css"
        }
      ],
      [/[ \t\r\n]+/],
      [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    styleWithCustomType: [
      [
        /\{\{/,
        {
          token: "@rematch",
          switchTo: "@handlebarsInSimpleState.styleWithCustomType.$S2"
        }
      ],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@styleEmbedded.$S2",
          nextEmbedded: "$S2"
        }
      ],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [/[ \t\r\n]+/],
      [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    styleEmbedded: [
      [
        /\{\{/,
        {
          token: "@rematch",
          switchTo: "@handlebarsInEmbeddedState.styleEmbedded.$S2",
          nextEmbedded: "@pop"
        }
      ],
      [/<\/style/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }]
    ],
    handlebarsInSimpleState: [
      [/\{\{\{?/, "delimiter.handlebars"],
      [/\}\}\}?/, { token: "delimiter.handlebars", switchTo: "@$S2.$S3" }],
      { include: "handlebarsRoot" }
    ],
    handlebarsInEmbeddedState: [
      [/\{\{\{?/, "delimiter.handlebars"],
      [
        /\}\}\}?/,
        {
          token: "delimiter.handlebars",
          switchTo: "@$S2.$S3",
          nextEmbedded: "$S3"
        }
      ],
      { include: "handlebarsRoot" }
    ],
    handlebarsRoot: [
      [/"[^"]*"/, "string.handlebars"],
      [/[#/][^\s}]+/, "keyword.helper.handlebars"],
      [/else\b/, "keyword.helper.handlebars"],
      [/[\s]+/],
      [/[^}]/, "variable.parameter.handlebars"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlYmFycy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL21vbmFjby1lZGl0b3IvZXNtL3ZzL2Jhc2ljLWxhbmd1YWdlcy9oYW5kbGViYXJzL2hhbmRsZWJhcnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3JlRXhwb3J0ID0gKHRhcmdldCwgbW9kLCBzZWNvbmRUYXJnZXQpID0+IChfX2NvcHlQcm9wcyh0YXJnZXQsIG1vZCwgXCJkZWZhdWx0XCIpLCBzZWNvbmRUYXJnZXQgJiYgX19jb3B5UHJvcHMoc2Vjb25kVGFyZ2V0LCBtb2QsIFwiZGVmYXVsdFwiKSk7XG5cbi8vIHNyYy9maWxsZXJzL21vbmFjby1lZGl0b3ItY29yZS50c1xudmFyIG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzID0ge307XG5fX3JlRXhwb3J0KG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLCBtb25hY29fZWRpdG9yX2NvcmVfc3Rhcik7XG5pbXBvcnQgKiBhcyBtb25hY29fZWRpdG9yX2NvcmVfc3RhciBmcm9tIFwiLi4vLi4vZWRpdG9yL2VkaXRvci5hcGkuanNcIjtcblxuLy8gc3JjL2Jhc2ljLWxhbmd1YWdlcy9oYW5kbGViYXJzL2hhbmRsZWJhcnMudHNcbnZhciBFTVBUWV9FTEVNRU5UUyA9IFtcbiAgXCJhcmVhXCIsXG4gIFwiYmFzZVwiLFxuICBcImJyXCIsXG4gIFwiY29sXCIsXG4gIFwiZW1iZWRcIixcbiAgXCJoclwiLFxuICBcImltZ1wiLFxuICBcImlucHV0XCIsXG4gIFwia2V5Z2VuXCIsXG4gIFwibGlua1wiLFxuICBcIm1lbnVpdGVtXCIsXG4gIFwibWV0YVwiLFxuICBcInBhcmFtXCIsXG4gIFwic291cmNlXCIsXG4gIFwidHJhY2tcIixcbiAgXCJ3YnJcIlxuXTtcbnZhciBjb25mID0ge1xuICB3b3JkUGF0dGVybjogLygtP1xcZCpcXC5cXGRcXHcqKXwoW15cXGBcXH5cXCFcXEBcXCRcXF5cXCZcXCpcXChcXClcXD1cXCtcXFtcXHtcXF1cXH1cXFxcXFx8XFw7XFw6XFwnXFxcIlxcLFxcLlxcPFxcPlxcL1xcc10rKS9nLFxuICBjb21tZW50czoge1xuICAgIGJsb2NrQ29tbWVudDogW1wie3shLS1cIiwgXCItLX19XCJdXG4gIH0sXG4gIGJyYWNrZXRzOiBbXG4gICAgW1wiPCEtLVwiLCBcIi0tPlwiXSxcbiAgICBbXCI8XCIsIFwiPlwiXSxcbiAgICBbXCJ7e1wiLCBcIn19XCJdLFxuICAgIFtcIntcIiwgXCJ9XCJdLFxuICAgIFtcIihcIiwgXCIpXCJdXG4gIF0sXG4gIGF1dG9DbG9zaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiIH1cbiAgXSxcbiAgc3Vycm91bmRpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCI8XCIsIGNsb3NlOiBcIj5cIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfVxuICBdLFxuICBvbkVudGVyUnVsZXM6IFtcbiAgICB7XG4gICAgICBiZWZvcmVUZXh0OiBuZXcgUmVnRXhwKGA8KD8hKD86JHtFTVBUWV9FTEVNRU5UUy5qb2luKFwifFwiKX0pKShcXFxcd1tcXFxcd1xcXFxkXSopKFteLz5dKig/IS8pPilbXjxdKiRgLCBcImlcIiksXG4gICAgICBhZnRlclRleHQ6IC9ePFxcLyhcXHdbXFx3XFxkXSopXFxzKj4kL2ksXG4gICAgICBhY3Rpb246IHtcbiAgICAgICAgaW5kZW50QWN0aW9uOiBtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5sYW5ndWFnZXMuSW5kZW50QWN0aW9uLkluZGVudE91dGRlbnRcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIGJlZm9yZVRleHQ6IG5ldyBSZWdFeHAoYDwoPyEoPzoke0VNUFRZX0VMRU1FTlRTLmpvaW4oXCJ8XCIpfSkpKFxcXFx3W1xcXFx3XFxcXGRdKikoW14vPl0qKD8hLyk+KVtePF0qJGAsIFwiaVwiKSxcbiAgICAgIGFjdGlvbjogeyBpbmRlbnRBY3Rpb246IG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmxhbmd1YWdlcy5JbmRlbnRBY3Rpb24uSW5kZW50IH1cbiAgICB9XG4gIF1cbn07XG52YXIgbGFuZ3VhZ2UgPSB7XG4gIGRlZmF1bHRUb2tlbjogXCJcIixcbiAgdG9rZW5Qb3N0Zml4OiBcIlwiLFxuICB0b2tlbml6ZXI6IHtcbiAgICByb290OiBbXG4gICAgICBbL1xce1xceyEtLS8sIFwiY29tbWVudC5ibG9jay5zdGFydC5oYW5kbGViYXJzXCIsIFwiQGNvbW1lbnRCbG9ja1wiXSxcbiAgICAgIFsvXFx7XFx7IS8sIFwiY29tbWVudC5zdGFydC5oYW5kbGViYXJzXCIsIFwiQGNvbW1lbnRcIl0sXG4gICAgICBbL1xce1xcey8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgc3dpdGNoVG86IFwiQGhhbmRsZWJhcnNJblNpbXBsZVN0YXRlLnJvb3RcIiB9XSxcbiAgICAgIFsvPCFET0NUWVBFLywgXCJtZXRhdGFnLmh0bWxcIiwgXCJAZG9jdHlwZVwiXSxcbiAgICAgIFsvPCEtLS8sIFwiY29tbWVudC5odG1sXCIsIFwiQGNvbW1lbnRIdG1sXCJdLFxuICAgICAgWy8oPCkoXFx3KykoXFwvPikvLCBbXCJkZWxpbWl0ZXIuaHRtbFwiLCBcInRhZy5odG1sXCIsIFwiZGVsaW1pdGVyLmh0bWxcIl1dLFxuICAgICAgWy8oPCkoc2NyaXB0KS8sIFtcImRlbGltaXRlci5odG1sXCIsIHsgdG9rZW46IFwidGFnLmh0bWxcIiwgbmV4dDogXCJAc2NyaXB0XCIgfV1dLFxuICAgICAgWy8oPCkoc3R5bGUpLywgW1wiZGVsaW1pdGVyLmh0bWxcIiwgeyB0b2tlbjogXCJ0YWcuaHRtbFwiLCBuZXh0OiBcIkBzdHlsZVwiIH1dXSxcbiAgICAgIFsvKDwpKFs6XFx3XSspLywgW1wiZGVsaW1pdGVyLmh0bWxcIiwgeyB0b2tlbjogXCJ0YWcuaHRtbFwiLCBuZXh0OiBcIkBvdGhlclRhZ1wiIH1dXSxcbiAgICAgIFsvKDxcXC8pKFxcdyspLywgW1wiZGVsaW1pdGVyLmh0bWxcIiwgeyB0b2tlbjogXCJ0YWcuaHRtbFwiLCBuZXh0OiBcIkBvdGhlclRhZ1wiIH1dXSxcbiAgICAgIFsvPC8sIFwiZGVsaW1pdGVyLmh0bWxcIl0sXG4gICAgICBbL1xcey8sIFwiZGVsaW1pdGVyLmh0bWxcIl0sXG4gICAgICBbL1tePHtdKy9dXG4gICAgXSxcbiAgICBkb2N0eXBlOiBbXG4gICAgICBbXG4gICAgICAgIC9cXHtcXHsvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiQHJlbWF0Y2hcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAaGFuZGxlYmFyc0luU2ltcGxlU3RhdGUuY29tbWVudFwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1tePl0rLywgXCJtZXRhdGFnLmNvbnRlbnQuaHRtbFwiXSxcbiAgICAgIFsvPi8sIFwibWV0YXRhZy5odG1sXCIsIFwiQHBvcFwiXVxuICAgIF0sXG4gICAgY29tbWVudDogW1xuICAgICAgWy9cXH1cXH0vLCBcImNvbW1lbnQuZW5kLmhhbmRsZWJhcnNcIiwgXCJAcG9wXCJdLFxuICAgICAgWy8uLywgXCJjb21tZW50LmNvbnRlbnQuaGFuZGxlYmFyc1wiXVxuICAgIF0sXG4gICAgY29tbWVudEJsb2NrOiBbXG4gICAgICBbLy0tXFx9XFx9LywgXCJjb21tZW50LmJsb2NrLmVuZC5oYW5kbGViYXJzXCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvLi8sIFwiY29tbWVudC5jb250ZW50LmhhbmRsZWJhcnNcIl1cbiAgICBdLFxuICAgIGNvbW1lbnRIdG1sOiBbXG4gICAgICBbXG4gICAgICAgIC9cXHtcXHsvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiQHJlbWF0Y2hcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAaGFuZGxlYmFyc0luU2ltcGxlU3RhdGUuY29tbWVudFwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbLy0tPi8sIFwiY29tbWVudC5odG1sXCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvW14tXSsvLCBcImNvbW1lbnQuY29udGVudC5odG1sXCJdLFxuICAgICAgWy8uLywgXCJjb21tZW50LmNvbnRlbnQuaHRtbFwiXVxuICAgIF0sXG4gICAgb3RoZXJUYWc6IFtcbiAgICAgIFtcbiAgICAgICAgL1xce1xcey8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJAcmVtYXRjaFwiLFxuICAgICAgICAgIHN3aXRjaFRvOiBcIkBoYW5kbGViYXJzSW5TaW1wbGVTdGF0ZS5vdGhlclRhZ1wiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1xcLz8+LywgXCJkZWxpbWl0ZXIuaHRtbFwiLCBcIkBwb3BcIl0sXG4gICAgICBbL1wiKFteXCJdKilcIi8sIFwiYXR0cmlidXRlLnZhbHVlXCJdLFxuICAgICAgWy8nKFteJ10qKScvLCBcImF0dHJpYnV0ZS52YWx1ZVwiXSxcbiAgICAgIFsvW1xcd1xcLV0rLywgXCJhdHRyaWJ1dGUubmFtZVwiXSxcbiAgICAgIFsvPS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9bIFxcdFxcclxcbl0rL11cbiAgICBdLFxuICAgIHNjcmlwdDogW1xuICAgICAgW1xuICAgICAgICAvXFx7XFx7LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcIkByZW1hdGNoXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQGhhbmRsZWJhcnNJblNpbXBsZVN0YXRlLnNjcmlwdFwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL3R5cGUvLCBcImF0dHJpYnV0ZS5uYW1lXCIsIFwiQHNjcmlwdEFmdGVyVHlwZVwiXSxcbiAgICAgIFsvXCIoW15cIl0qKVwiLywgXCJhdHRyaWJ1dGUudmFsdWVcIl0sXG4gICAgICBbLycoW14nXSopJy8sIFwiYXR0cmlidXRlLnZhbHVlXCJdLFxuICAgICAgWy9bXFx3XFwtXSsvLCBcImF0dHJpYnV0ZS5uYW1lXCJdLFxuICAgICAgWy89LywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbXG4gICAgICAgIC8+LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImRlbGltaXRlci5odG1sXCIsXG4gICAgICAgICAgbmV4dDogXCJAc2NyaXB0RW1iZWRkZWQudGV4dC9qYXZhc2NyaXB0XCIsXG4gICAgICAgICAgbmV4dEVtYmVkZGVkOiBcInRleHQvamF2YXNjcmlwdFwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvXSxcbiAgICAgIFtcbiAgICAgICAgLyg8XFwvKShzY3JpcHRcXHMqKSg+KS8sXG4gICAgICAgIFtcImRlbGltaXRlci5odG1sXCIsIFwidGFnLmh0bWxcIiwgeyB0b2tlbjogXCJkZWxpbWl0ZXIuaHRtbFwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgICAgXVxuICAgIF0sXG4gICAgc2NyaXB0QWZ0ZXJUeXBlOiBbXG4gICAgICBbXG4gICAgICAgIC9cXHtcXHsvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiQHJlbWF0Y2hcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAaGFuZGxlYmFyc0luU2ltcGxlU3RhdGUuc2NyaXB0QWZ0ZXJUeXBlXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvPS8sIFwiZGVsaW1pdGVyXCIsIFwiQHNjcmlwdEFmdGVyVHlwZUVxdWFsc1wiXSxcbiAgICAgIFtcbiAgICAgICAgLz4vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiZGVsaW1pdGVyLmh0bWxcIixcbiAgICAgICAgICBuZXh0OiBcIkBzY3JpcHRFbWJlZGRlZC50ZXh0L2phdmFzY3JpcHRcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwidGV4dC9qYXZhc2NyaXB0XCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dLFxuICAgICAgWy88XFwvc2NyaXB0XFxzKj4vLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBzY3JpcHRBZnRlclR5cGVFcXVhbHM6IFtcbiAgICAgIFtcbiAgICAgICAgL1xce1xcey8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJAcmVtYXRjaFwiLFxuICAgICAgICAgIHN3aXRjaFRvOiBcIkBoYW5kbGViYXJzSW5TaW1wbGVTdGF0ZS5zY3JpcHRBZnRlclR5cGVFcXVhbHNcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvXCIoW15cIl0qKVwiLyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImF0dHJpYnV0ZS52YWx1ZVwiLFxuICAgICAgICAgIHN3aXRjaFRvOiBcIkBzY3JpcHRXaXRoQ3VzdG9tVHlwZS4kMVwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8nKFteJ10qKScvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiYXR0cmlidXRlLnZhbHVlXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQHNjcmlwdFdpdGhDdXN0b21UeXBlLiQxXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgLz4vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiZGVsaW1pdGVyLmh0bWxcIixcbiAgICAgICAgICBuZXh0OiBcIkBzY3JpcHRFbWJlZGRlZC50ZXh0L2phdmFzY3JpcHRcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwidGV4dC9qYXZhc2NyaXB0XCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dLFxuICAgICAgWy88XFwvc2NyaXB0XFxzKj4vLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBzY3JpcHRXaXRoQ3VzdG9tVHlwZTogW1xuICAgICAgW1xuICAgICAgICAvXFx7XFx7LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcIkByZW1hdGNoXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQGhhbmRsZWJhcnNJblNpbXBsZVN0YXRlLnNjcmlwdFdpdGhDdXN0b21UeXBlLiRTMlwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8+LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImRlbGltaXRlci5odG1sXCIsXG4gICAgICAgICAgbmV4dDogXCJAc2NyaXB0RW1iZWRkZWQuJFMyXCIsXG4gICAgICAgICAgbmV4dEVtYmVkZGVkOiBcIiRTMlwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1wiKFteXCJdKilcIi8sIFwiYXR0cmlidXRlLnZhbHVlXCJdLFxuICAgICAgWy8nKFteJ10qKScvLCBcImF0dHJpYnV0ZS52YWx1ZVwiXSxcbiAgICAgIFsvW1xcd1xcLV0rLywgXCJhdHRyaWJ1dGUubmFtZVwiXSxcbiAgICAgIFsvPS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9bIFxcdFxcclxcbl0rL10sXG4gICAgICBbLzxcXC9zY3JpcHRcXHMqPi8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHNjcmlwdEVtYmVkZGVkOiBbXG4gICAgICBbXG4gICAgICAgIC9cXHtcXHsvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiQHJlbWF0Y2hcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAaGFuZGxlYmFyc0luRW1iZWRkZWRTdGF0ZS5zY3JpcHRFbWJlZGRlZC4kUzJcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwiQHBvcFwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbLzxcXC9zY3JpcHQvLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQHBvcFwiLCBuZXh0RW1iZWRkZWQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBzdHlsZTogW1xuICAgICAgW1xuICAgICAgICAvXFx7XFx7LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcIkByZW1hdGNoXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQGhhbmRsZWJhcnNJblNpbXBsZVN0YXRlLnN0eWxlXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvdHlwZS8sIFwiYXR0cmlidXRlLm5hbWVcIiwgXCJAc3R5bGVBZnRlclR5cGVcIl0sXG4gICAgICBbL1wiKFteXCJdKilcIi8sIFwiYXR0cmlidXRlLnZhbHVlXCJdLFxuICAgICAgWy8nKFteJ10qKScvLCBcImF0dHJpYnV0ZS52YWx1ZVwiXSxcbiAgICAgIFsvW1xcd1xcLV0rLywgXCJhdHRyaWJ1dGUubmFtZVwiXSxcbiAgICAgIFsvPS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgW1xuICAgICAgICAvPi8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJkZWxpbWl0ZXIuaHRtbFwiLFxuICAgICAgICAgIG5leHQ6IFwiQHN0eWxlRW1iZWRkZWQudGV4dC9jc3NcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwidGV4dC9jc3NcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9bIFxcdFxcclxcbl0rL10sXG4gICAgICBbXG4gICAgICAgIC8oPFxcLykoc3R5bGVcXHMqKSg+KS8sXG4gICAgICAgIFtcImRlbGltaXRlci5odG1sXCIsIFwidGFnLmh0bWxcIiwgeyB0b2tlbjogXCJkZWxpbWl0ZXIuaHRtbFwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgICAgXVxuICAgIF0sXG4gICAgc3R5bGVBZnRlclR5cGU6IFtcbiAgICAgIFtcbiAgICAgICAgL1xce1xcey8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJAcmVtYXRjaFwiLFxuICAgICAgICAgIHN3aXRjaFRvOiBcIkBoYW5kbGViYXJzSW5TaW1wbGVTdGF0ZS5zdHlsZUFmdGVyVHlwZVwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbLz0vLCBcImRlbGltaXRlclwiLCBcIkBzdHlsZUFmdGVyVHlwZUVxdWFsc1wiXSxcbiAgICAgIFtcbiAgICAgICAgLz4vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiZGVsaW1pdGVyLmh0bWxcIixcbiAgICAgICAgICBuZXh0OiBcIkBzdHlsZUVtYmVkZGVkLnRleHQvY3NzXCIsXG4gICAgICAgICAgbmV4dEVtYmVkZGVkOiBcInRleHQvY3NzXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dLFxuICAgICAgWy88XFwvc3R5bGVcXHMqPi8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHN0eWxlQWZ0ZXJUeXBlRXF1YWxzOiBbXG4gICAgICBbXG4gICAgICAgIC9cXHtcXHsvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiQHJlbWF0Y2hcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAaGFuZGxlYmFyc0luU2ltcGxlU3RhdGUuc3R5bGVBZnRlclR5cGVFcXVhbHNcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvXCIoW15cIl0qKVwiLyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImF0dHJpYnV0ZS52YWx1ZVwiLFxuICAgICAgICAgIHN3aXRjaFRvOiBcIkBzdHlsZVdpdGhDdXN0b21UeXBlLiQxXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgLycoW14nXSopJy8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJhdHRyaWJ1dGUudmFsdWVcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAc3R5bGVXaXRoQ3VzdG9tVHlwZS4kMVwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8+LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImRlbGltaXRlci5odG1sXCIsXG4gICAgICAgICAgbmV4dDogXCJAc3R5bGVFbWJlZGRlZC50ZXh0L2Nzc1wiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCJ0ZXh0L2Nzc1wiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvXSxcbiAgICAgIFsvPFxcL3N0eWxlXFxzKj4vLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBzdHlsZVdpdGhDdXN0b21UeXBlOiBbXG4gICAgICBbXG4gICAgICAgIC9cXHtcXHsvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiQHJlbWF0Y2hcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAaGFuZGxlYmFyc0luU2ltcGxlU3RhdGUuc3R5bGVXaXRoQ3VzdG9tVHlwZS4kUzJcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvPi8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJkZWxpbWl0ZXIuaHRtbFwiLFxuICAgICAgICAgIG5leHQ6IFwiQHN0eWxlRW1iZWRkZWQuJFMyXCIsXG4gICAgICAgICAgbmV4dEVtYmVkZGVkOiBcIiRTMlwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1wiKFteXCJdKilcIi8sIFwiYXR0cmlidXRlLnZhbHVlXCJdLFxuICAgICAgWy8nKFteJ10qKScvLCBcImF0dHJpYnV0ZS52YWx1ZVwiXSxcbiAgICAgIFsvW1xcd1xcLV0rLywgXCJhdHRyaWJ1dGUubmFtZVwiXSxcbiAgICAgIFsvPS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9bIFxcdFxcclxcbl0rL10sXG4gICAgICBbLzxcXC9zdHlsZVxccyo+LywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgc3R5bGVFbWJlZGRlZDogW1xuICAgICAgW1xuICAgICAgICAvXFx7XFx7LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcIkByZW1hdGNoXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQGhhbmRsZWJhcnNJbkVtYmVkZGVkU3RhdGUuc3R5bGVFbWJlZGRlZC4kUzJcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwiQHBvcFwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbLzxcXC9zdHlsZS8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIsIG5leHRFbWJlZGRlZDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIGhhbmRsZWJhcnNJblNpbXBsZVN0YXRlOiBbXG4gICAgICBbL1xce1xce1xcez8vLCBcImRlbGltaXRlci5oYW5kbGViYXJzXCJdLFxuICAgICAgWy9cXH1cXH1cXH0/LywgeyB0b2tlbjogXCJkZWxpbWl0ZXIuaGFuZGxlYmFyc1wiLCBzd2l0Y2hUbzogXCJAJFMyLiRTM1wiIH1dLFxuICAgICAgeyBpbmNsdWRlOiBcImhhbmRsZWJhcnNSb290XCIgfVxuICAgIF0sXG4gICAgaGFuZGxlYmFyc0luRW1iZWRkZWRTdGF0ZTogW1xuICAgICAgWy9cXHtcXHtcXHs/LywgXCJkZWxpbWl0ZXIuaGFuZGxlYmFyc1wiXSxcbiAgICAgIFtcbiAgICAgICAgL1xcfVxcfVxcfT8vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiZGVsaW1pdGVyLmhhbmRsZWJhcnNcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAJFMyLiRTM1wiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCIkUzNcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgeyBpbmNsdWRlOiBcImhhbmRsZWJhcnNSb290XCIgfVxuICAgIF0sXG4gICAgaGFuZGxlYmFyc1Jvb3Q6IFtcbiAgICAgIFsvXCJbXlwiXSpcIi8sIFwic3RyaW5nLmhhbmRsZWJhcnNcIl0sXG4gICAgICBbL1sjL11bXlxcc31dKy8sIFwia2V5d29yZC5oZWxwZXIuaGFuZGxlYmFyc1wiXSxcbiAgICAgIFsvZWxzZVxcYi8sIFwia2V5d29yZC5oZWxwZXIuaGFuZGxlYmFyc1wiXSxcbiAgICAgIFsvW1xcc10rL10sXG4gICAgICBbL1tefV0vLCBcInZhcmlhYmxlLnBhcmFtZXRlci5oYW5kbGViYXJzXCJdXG4gICAgXVxuICB9XG59O1xuZXhwb3J0IHtcbiAgY29uZixcbiAgbGFuZ3VhZ2Vcbn07XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9BLElBQUksWUFBWSxPQUFPO0FBQ3ZCLElBQUksbUJBQW1CLE9BQU87QUFDOUIsSUFBSSxvQkFBb0IsT0FBTztBQUMvQixJQUFJLGVBQWUsT0FBTyxVQUFVO0FBQ3BDLElBQUksY0FBYyxDQUFDLElBQUksTUFBTSxRQUFRLFNBQVM7QUFDNUMsTUFBSSxRQUFRLE9BQU8sU0FBUyxZQUFZLE9BQU8sU0FBUyxZQUFZO0FBQ2xFLGFBQVMsT0FBTyxrQkFBa0IsSUFBSTtBQUNwQyxVQUFJLENBQUMsYUFBYSxLQUFLLElBQUksR0FBRyxLQUFLLFFBQVE7QUFDekMsa0JBQVUsSUFBSSxLQUFLLEVBQUUsS0FBSyxNQUFNLEtBQUssR0FBRyxHQUFHLFlBQVksRUFBRSxPQUFPLGlCQUFpQixNQUFNLEdBQUcsTUFBTSxLQUFLLFdBQVUsQ0FBRTtBQUFBLEVBQ3RIO0FBQ0QsU0FBTztBQUNUO0FBQ0EsSUFBSSxhQUFhLENBQUMsUUFBUSxLQUFLLGtCQUFrQixZQUFZLFFBQVEsS0FBSyxTQUFTLEdBQUcsZ0JBQWdCLFlBQVksY0FBYyxLQUFLLFNBQVM7QUFHOUksSUFBSSw2QkFBNkIsQ0FBQTtBQUNqQyxXQUFXLDRCQUE0Qix1QkFBdUI7QUFJ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QSxRQUNmO0FBQUEsTUFDRjtBQUFBLE1BQ0QsQ0FBQyxZQUFZO0FBQUEsTUFDYixDQUFDLGdCQUFnQixFQUFFLE9BQU8sWUFBWSxNQUFNLE9BQU0sQ0FBRTtBQUFBLElBQ3JEO0FBQUEsSUFDRCxxQkFBcUI7QUFBQSxNQUNuQjtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsVUFDUCxVQUFVO0FBQUEsUUFDWDtBQUFBLE1BQ0Y7QUFBQSxNQUNEO0FBQUEsUUFDRTtBQUFBLFFBQ0E7QUFBQSxVQUNFLE9BQU87QUFBQSxVQUNQLE1BQU07QUFBQSxVQUNOLGNBQWM7QUFBQSxRQUNmO0FBQUEsTUFDRjtBQUFBLE1BQ0QsQ0FBQyxhQUFhLGlCQUFpQjtBQUFBLE1BQy9CLENBQUMsYUFBYSxpQkFBaUI7QUFBQSxNQUMvQixDQUFDLFdBQVcsZ0JBQWdCO0FBQUEsTUFDNUIsQ0FBQyxLQUFLLFdBQVc7QUFBQSxNQUNqQixDQUFDLFlBQVk7QUFBQSxNQUNiLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxZQUFZLE1BQU0sT0FBTSxDQUFFO0FBQUEsSUFDckQ7QUFBQSxJQUNELGVBQWU7QUFBQSxNQUNiO0FBQUEsUUFDRTtBQUFBLFFBQ0E7QUFBQSxVQUNFLE9BQU87QUFBQSxVQUNQLFVBQVU7QUFBQSxVQUNWLGNBQWM7QUFBQSxRQUNmO0FBQUEsTUFDRjtBQUFBLE1BQ0QsQ0FBQyxZQUFZLEVBQUUsT0FBTyxZQUFZLE1BQU0sUUFBUSxjQUFjLFFBQVE7QUFBQSxJQUN2RTtBQUFBLElBQ0QseUJBQXlCO0FBQUEsTUFDdkIsQ0FBQyxXQUFXLHNCQUFzQjtBQUFBLE1BQ2xDLENBQUMsV0FBVyxFQUFFLE9BQU8sd0JBQXdCLFVBQVUsV0FBVSxDQUFFO0FBQUEsTUFDbkUsRUFBRSxTQUFTLGlCQUFrQjtBQUFBLElBQzlCO0FBQUEsSUFDRCwyQkFBMkI7QUFBQSxNQUN6QixDQUFDLFdBQVcsc0JBQXNCO0FBQUEsTUFDbEM7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFVBQ1AsVUFBVTtBQUFBLFVBQ1YsY0FBYztBQUFBLFFBQ2Y7QUFBQSxNQUNGO0FBQUEsTUFDRCxFQUFFLFNBQVMsaUJBQWtCO0FBQUEsSUFDOUI7QUFBQSxJQUNELGdCQUFnQjtBQUFBLE1BQ2QsQ0FBQyxXQUFXLG1CQUFtQjtBQUFBLE1BQy9CLENBQUMsZUFBZSwyQkFBMkI7QUFBQSxNQUMzQyxDQUFDLFVBQVUsMkJBQTJCO0FBQUEsTUFDdEMsQ0FBQyxPQUFPO0FBQUEsTUFDUixDQUFDLFFBQVEsK0JBQStCO0FBQUEsSUFDekM7QUFBQSxFQUNGO0FBQ0g7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdfQ==
