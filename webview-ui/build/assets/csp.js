/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  brackets: [],
  autoClosingPairs: [],
  surroundingPairs: []
};
var language = {
  keywords: [],
  typeKeywords: [],
  tokenPostfix: ".csp",
  operators: [],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  tokenizer: {
    root: [
      [/child-src/, "string.quote"],
      [/connect-src/, "string.quote"],
      [/default-src/, "string.quote"],
      [/font-src/, "string.quote"],
      [/frame-src/, "string.quote"],
      [/img-src/, "string.quote"],
      [/manifest-src/, "string.quote"],
      [/media-src/, "string.quote"],
      [/object-src/, "string.quote"],
      [/script-src/, "string.quote"],
      [/style-src/, "string.quote"],
      [/worker-src/, "string.quote"],
      [/base-uri/, "string.quote"],
      [/plugin-types/, "string.quote"],
      [/sandbox/, "string.quote"],
      [/disown-opener/, "string.quote"],
      [/form-action/, "string.quote"],
      [/frame-ancestors/, "string.quote"],
      [/report-uri/, "string.quote"],
      [/report-to/, "string.quote"],
      [/upgrade-insecure-requests/, "string.quote"],
      [/block-all-mixed-content/, "string.quote"],
      [/require-sri-for/, "string.quote"],
      [/reflected-xss/, "string.quote"],
      [/referrer/, "string.quote"],
      [/policy-uri/, "string.quote"],
      [/'self'/, "string.quote"],
      [/'unsafe-inline'/, "string.quote"],
      [/'unsafe-eval'/, "string.quote"],
      [/'strict-dynamic'/, "string.quote"],
      [/'unsafe-hashed-attributes'/, "string.quote"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NwLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL2NzcC9jc3AuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2NzcC9jc3AudHNcbnZhciBjb25mID0ge1xuICBicmFja2V0czogW10sXG4gIGF1dG9DbG9zaW5nUGFpcnM6IFtdLFxuICBzdXJyb3VuZGluZ1BhaXJzOiBbXVxufTtcbnZhciBsYW5ndWFnZSA9IHtcbiAga2V5d29yZHM6IFtdLFxuICB0eXBlS2V5d29yZHM6IFtdLFxuICB0b2tlblBvc3RmaXg6IFwiLmNzcFwiLFxuICBvcGVyYXRvcnM6IFtdLFxuICBzeW1ib2xzOiAvWz0+PCF+PzomfCtcXC0qXFwvXFxeJV0rLyxcbiAgZXNjYXBlczogL1xcXFwoPzpbYWJmbnJ0dlxcXFxcIiddfHhbMC05QS1GYS1mXXsxLDR9fHVbMC05QS1GYS1mXXs0fXxVWzAtOUEtRmEtZl17OH0pLyxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgWy9jaGlsZC1zcmMvLCBcInN0cmluZy5xdW90ZVwiXSxcbiAgICAgIFsvY29ubmVjdC1zcmMvLCBcInN0cmluZy5xdW90ZVwiXSxcbiAgICAgIFsvZGVmYXVsdC1zcmMvLCBcInN0cmluZy5xdW90ZVwiXSxcbiAgICAgIFsvZm9udC1zcmMvLCBcInN0cmluZy5xdW90ZVwiXSxcbiAgICAgIFsvZnJhbWUtc3JjLywgXCJzdHJpbmcucXVvdGVcIl0sXG4gICAgICBbL2ltZy1zcmMvLCBcInN0cmluZy5xdW90ZVwiXSxcbiAgICAgIFsvbWFuaWZlc3Qtc3JjLywgXCJzdHJpbmcucXVvdGVcIl0sXG4gICAgICBbL21lZGlhLXNyYy8sIFwic3RyaW5nLnF1b3RlXCJdLFxuICAgICAgWy9vYmplY3Qtc3JjLywgXCJzdHJpbmcucXVvdGVcIl0sXG4gICAgICBbL3NjcmlwdC1zcmMvLCBcInN0cmluZy5xdW90ZVwiXSxcbiAgICAgIFsvc3R5bGUtc3JjLywgXCJzdHJpbmcucXVvdGVcIl0sXG4gICAgICBbL3dvcmtlci1zcmMvLCBcInN0cmluZy5xdW90ZVwiXSxcbiAgICAgIFsvYmFzZS11cmkvLCBcInN0cmluZy5xdW90ZVwiXSxcbiAgICAgIFsvcGx1Z2luLXR5cGVzLywgXCJzdHJpbmcucXVvdGVcIl0sXG4gICAgICBbL3NhbmRib3gvLCBcInN0cmluZy5xdW90ZVwiXSxcbiAgICAgIFsvZGlzb3duLW9wZW5lci8sIFwic3RyaW5nLnF1b3RlXCJdLFxuICAgICAgWy9mb3JtLWFjdGlvbi8sIFwic3RyaW5nLnF1b3RlXCJdLFxuICAgICAgWy9mcmFtZS1hbmNlc3RvcnMvLCBcInN0cmluZy5xdW90ZVwiXSxcbiAgICAgIFsvcmVwb3J0LXVyaS8sIFwic3RyaW5nLnF1b3RlXCJdLFxuICAgICAgWy9yZXBvcnQtdG8vLCBcInN0cmluZy5xdW90ZVwiXSxcbiAgICAgIFsvdXBncmFkZS1pbnNlY3VyZS1yZXF1ZXN0cy8sIFwic3RyaW5nLnF1b3RlXCJdLFxuICAgICAgWy9ibG9jay1hbGwtbWl4ZWQtY29udGVudC8sIFwic3RyaW5nLnF1b3RlXCJdLFxuICAgICAgWy9yZXF1aXJlLXNyaS1mb3IvLCBcInN0cmluZy5xdW90ZVwiXSxcbiAgICAgIFsvcmVmbGVjdGVkLXhzcy8sIFwic3RyaW5nLnF1b3RlXCJdLFxuICAgICAgWy9yZWZlcnJlci8sIFwic3RyaW5nLnF1b3RlXCJdLFxuICAgICAgWy9wb2xpY3ktdXJpLywgXCJzdHJpbmcucXVvdGVcIl0sXG4gICAgICBbLydzZWxmJy8sIFwic3RyaW5nLnF1b3RlXCJdLFxuICAgICAgWy8ndW5zYWZlLWlubGluZScvLCBcInN0cmluZy5xdW90ZVwiXSxcbiAgICAgIFsvJ3Vuc2FmZS1ldmFsJy8sIFwic3RyaW5nLnF1b3RlXCJdLFxuICAgICAgWy8nc3RyaWN0LWR5bmFtaWMnLywgXCJzdHJpbmcucXVvdGVcIl0sXG4gICAgICBbLyd1bnNhZmUtaGFzaGVkLWF0dHJpYnV0ZXMnLywgXCJzdHJpbmcucXVvdGVcIl1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULFVBQVUsQ0FBRTtBQUFBLEVBQ1osa0JBQWtCLENBQUU7QUFBQSxFQUNwQixrQkFBa0IsQ0FBRTtBQUN0QjtBQUNHLElBQUMsV0FBVztBQUFBLEVBQ2IsVUFBVSxDQUFFO0FBQUEsRUFDWixjQUFjLENBQUU7QUFBQSxFQUNoQixjQUFjO0FBQUEsRUFDZCxXQUFXLENBQUU7QUFBQSxFQUNiLFNBQVM7QUFBQSxFQUNULFNBQVM7QUFBQSxFQUNULFdBQVc7QUFBQSxJQUNULE1BQU07QUFBQSxNQUNKLENBQUMsYUFBYSxjQUFjO0FBQUEsTUFDNUIsQ0FBQyxlQUFlLGNBQWM7QUFBQSxNQUM5QixDQUFDLGVBQWUsY0FBYztBQUFBLE1BQzlCLENBQUMsWUFBWSxjQUFjO0FBQUEsTUFDM0IsQ0FBQyxhQUFhLGNBQWM7QUFBQSxNQUM1QixDQUFDLFdBQVcsY0FBYztBQUFBLE1BQzFCLENBQUMsZ0JBQWdCLGNBQWM7QUFBQSxNQUMvQixDQUFDLGFBQWEsY0FBYztBQUFBLE1BQzVCLENBQUMsY0FBYyxjQUFjO0FBQUEsTUFDN0IsQ0FBQyxjQUFjLGNBQWM7QUFBQSxNQUM3QixDQUFDLGFBQWEsY0FBYztBQUFBLE1BQzVCLENBQUMsY0FBYyxjQUFjO0FBQUEsTUFDN0IsQ0FBQyxZQUFZLGNBQWM7QUFBQSxNQUMzQixDQUFDLGdCQUFnQixjQUFjO0FBQUEsTUFDL0IsQ0FBQyxXQUFXLGNBQWM7QUFBQSxNQUMxQixDQUFDLGlCQUFpQixjQUFjO0FBQUEsTUFDaEMsQ0FBQyxlQUFlLGNBQWM7QUFBQSxNQUM5QixDQUFDLG1CQUFtQixjQUFjO0FBQUEsTUFDbEMsQ0FBQyxjQUFjLGNBQWM7QUFBQSxNQUM3QixDQUFDLGFBQWEsY0FBYztBQUFBLE1BQzVCLENBQUMsNkJBQTZCLGNBQWM7QUFBQSxNQUM1QyxDQUFDLDJCQUEyQixjQUFjO0FBQUEsTUFDMUMsQ0FBQyxtQkFBbUIsY0FBYztBQUFBLE1BQ2xDLENBQUMsaUJBQWlCLGNBQWM7QUFBQSxNQUNoQyxDQUFDLFlBQVksY0FBYztBQUFBLE1BQzNCLENBQUMsY0FBYyxjQUFjO0FBQUEsTUFDN0IsQ0FBQyxVQUFVLGNBQWM7QUFBQSxNQUN6QixDQUFDLG1CQUFtQixjQUFjO0FBQUEsTUFDbEMsQ0FBQyxpQkFBaUIsY0FBYztBQUFBLE1BQ2hDLENBQUMsb0JBQW9CLGNBQWM7QUFBQSxNQUNuQyxDQUFDLDhCQUE4QixjQUFjO0FBQUEsSUFDOUM7QUFBQSxFQUNGO0FBQ0g7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdfQ==
