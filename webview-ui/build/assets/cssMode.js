var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { m as monaco_editor_core_star } from "./index.js";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var monaco_editor_core_exports = {};
__reExport(monaco_editor_core_exports, monaco_editor_core_star);
var STOP_WHEN_IDLE_FOR = 2 * 60 * 1e3;
var WorkerManager = class {
  constructor(defaults) {
    __publicField(this, "_defaults");
    __publicField(this, "_idleCheckInterval");
    __publicField(this, "_lastUsedTime");
    __publicField(this, "_configChangeListener");
    __publicField(this, "_worker");
    __publicField(this, "_client");
    this._defaults = defaults;
    this._worker = null;
    this._client = null;
    this._idleCheckInterval = window.setInterval(() => this._checkIfIdle(), 30 * 1e3);
    this._lastUsedTime = 0;
    this._configChangeListener = this._defaults.onDidChange(() => this._stopWorker());
  }
  _stopWorker() {
    if (this._worker) {
      this._worker.dispose();
      this._worker = null;
    }
    this._client = null;
  }
  dispose() {
    clearInterval(this._idleCheckInterval);
    this._configChangeListener.dispose();
    this._stopWorker();
  }
  _checkIfIdle() {
    if (!this._worker) {
      return;
    }
    let timePassedSinceLastUsed = Date.now() - this._lastUsedTime;
    if (timePassedSinceLastUsed > STOP_WHEN_IDLE_FOR) {
      this._stopWorker();
    }
  }
  _getClient() {
    this._lastUsedTime = Date.now();
    if (!this._client) {
      this._worker = monaco_editor_core_exports.editor.createWebWorker({
        moduleId: "vs/language/css/cssWorker",
        label: this._defaults.languageId,
        createData: {
          options: this._defaults.options,
          languageId: this._defaults.languageId
        }
      });
      this._client = this._worker.getProxy();
    }
    return this._client;
  }
  getLanguageServiceWorker(...resources) {
    let _client;
    return this._getClient().then((client) => {
      _client = client;
    }).then((_) => {
      if (this._worker) {
        return this._worker.withSyncedResources(resources);
      }
    }).then((_) => _client);
  }
};
var integer;
(function(integer2) {
  integer2.MIN_VALUE = -2147483648;
  integer2.MAX_VALUE = 2147483647;
})(integer || (integer = {}));
var uinteger;
(function(uinteger2) {
  uinteger2.MIN_VALUE = 0;
  uinteger2.MAX_VALUE = 2147483647;
})(uinteger || (uinteger = {}));
var Position;
(function(Position3) {
  function create(line, character) {
    if (line === Number.MAX_VALUE) {
      line = uinteger.MAX_VALUE;
    }
    if (character === Number.MAX_VALUE) {
      character = uinteger.MAX_VALUE;
    }
    return { line, character };
  }
  Position3.create = create;
  function is(value) {
    var candidate = value;
    return Is.objectLiteral(candidate) && Is.uinteger(candidate.line) && Is.uinteger(candidate.character);
  }
  Position3.is = is;
})(Position || (Position = {}));
var Range;
(function(Range3) {
  function create(one, two, three, four) {
    if (Is.uinteger(one) && Is.uinteger(two) && Is.uinteger(three) && Is.uinteger(four)) {
      return { start: Position.create(one, two), end: Position.create(three, four) };
    } else if (Position.is(one) && Position.is(two)) {
      return { start: one, end: two };
    } else {
      throw new Error("Range#create called with invalid arguments[" + one + ", " + two + ", " + three + ", " + four + "]");
    }
  }
  Range3.create = create;
  function is(value) {
    var candidate = value;
    return Is.objectLiteral(candidate) && Position.is(candidate.start) && Position.is(candidate.end);
  }
  Range3.is = is;
})(Range || (Range = {}));
var Location;
(function(Location2) {
  function create(uri, range) {
    return { uri, range };
  }
  Location2.create = create;
  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Range.is(candidate.range) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
  }
  Location2.is = is;
})(Location || (Location = {}));
var LocationLink;
(function(LocationLink2) {
  function create(targetUri, targetRange, targetSelectionRange, originSelectionRange) {
    return { targetUri, targetRange, targetSelectionRange, originSelectionRange };
  }
  LocationLink2.create = create;
  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Range.is(candidate.targetRange) && Is.string(candidate.targetUri) && (Range.is(candidate.targetSelectionRange) || Is.undefined(candidate.targetSelectionRange)) && (Range.is(candidate.originSelectionRange) || Is.undefined(candidate.originSelectionRange));
  }
  LocationLink2.is = is;
})(LocationLink || (LocationLink = {}));
var Color;
(function(Color2) {
  function create(red, green, blue, alpha) {
    return {
      red,
      green,
      blue,
      alpha
    };
  }
  Color2.create = create;
  function is(value) {
    var candidate = value;
    return Is.numberRange(candidate.red, 0, 1) && Is.numberRange(candidate.green, 0, 1) && Is.numberRange(candidate.blue, 0, 1) && Is.numberRange(candidate.alpha, 0, 1);
  }
  Color2.is = is;
})(Color || (Color = {}));
var ColorInformation;
(function(ColorInformation2) {
  function create(range, color) {
    return {
      range,
      color
    };
  }
  ColorInformation2.create = create;
  function is(value) {
    var candidate = value;
    return Range.is(candidate.range) && Color.is(candidate.color);
  }
  ColorInformation2.is = is;
})(ColorInformation || (ColorInformation = {}));
var ColorPresentation;
(function(ColorPresentation2) {
  function create(label, textEdit, additionalTextEdits) {
    return {
      label,
      textEdit,
      additionalTextEdits
    };
  }
  ColorPresentation2.create = create;
  function is(value) {
    var candidate = value;
    return Is.string(candidate.label) && (Is.undefined(candidate.textEdit) || TextEdit.is(candidate)) && (Is.undefined(candidate.additionalTextEdits) || Is.typedArray(candidate.additionalTextEdits, TextEdit.is));
  }
  ColorPresentation2.is = is;
})(ColorPresentation || (ColorPresentation = {}));
var FoldingRangeKind;
(function(FoldingRangeKind2) {
  FoldingRangeKind2["Comment"] = "comment";
  FoldingRangeKind2["Imports"] = "imports";
  FoldingRangeKind2["Region"] = "region";
})(FoldingRangeKind || (FoldingRangeKind = {}));
var FoldingRange;
(function(FoldingRange2) {
  function create(startLine, endLine, startCharacter, endCharacter, kind) {
    var result = {
      startLine,
      endLine
    };
    if (Is.defined(startCharacter)) {
      result.startCharacter = startCharacter;
    }
    if (Is.defined(endCharacter)) {
      result.endCharacter = endCharacter;
    }
    if (Is.defined(kind)) {
      result.kind = kind;
    }
    return result;
  }
  FoldingRange2.create = create;
  function is(value) {
    var candidate = value;
    return Is.uinteger(candidate.startLine) && Is.uinteger(candidate.startLine) && (Is.undefined(candidate.startCharacter) || Is.uinteger(candidate.startCharacter)) && (Is.undefined(candidate.endCharacter) || Is.uinteger(candidate.endCharacter)) && (Is.undefined(candidate.kind) || Is.string(candidate.kind));
  }
  FoldingRange2.is = is;
})(FoldingRange || (FoldingRange = {}));
var DiagnosticRelatedInformation;
(function(DiagnosticRelatedInformation2) {
  function create(location, message) {
    return {
      location,
      message
    };
  }
  DiagnosticRelatedInformation2.create = create;
  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Location.is(candidate.location) && Is.string(candidate.message);
  }
  DiagnosticRelatedInformation2.is = is;
})(DiagnosticRelatedInformation || (DiagnosticRelatedInformation = {}));
var DiagnosticSeverity;
(function(DiagnosticSeverity2) {
  DiagnosticSeverity2.Error = 1;
  DiagnosticSeverity2.Warning = 2;
  DiagnosticSeverity2.Information = 3;
  DiagnosticSeverity2.Hint = 4;
})(DiagnosticSeverity || (DiagnosticSeverity = {}));
var DiagnosticTag;
(function(DiagnosticTag2) {
  DiagnosticTag2.Unnecessary = 1;
  DiagnosticTag2.Deprecated = 2;
})(DiagnosticTag || (DiagnosticTag = {}));
var CodeDescription;
(function(CodeDescription2) {
  function is(value) {
    var candidate = value;
    return candidate !== void 0 && candidate !== null && Is.string(candidate.href);
  }
  CodeDescription2.is = is;
})(CodeDescription || (CodeDescription = {}));
var Diagnostic;
(function(Diagnostic2) {
  function create(range, message, severity, code, source, relatedInformation) {
    var result = { range, message };
    if (Is.defined(severity)) {
      result.severity = severity;
    }
    if (Is.defined(code)) {
      result.code = code;
    }
    if (Is.defined(source)) {
      result.source = source;
    }
    if (Is.defined(relatedInformation)) {
      result.relatedInformation = relatedInformation;
    }
    return result;
  }
  Diagnostic2.create = create;
  function is(value) {
    var _a;
    var candidate = value;
    return Is.defined(candidate) && Range.is(candidate.range) && Is.string(candidate.message) && (Is.number(candidate.severity) || Is.undefined(candidate.severity)) && (Is.integer(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code)) && (Is.undefined(candidate.codeDescription) || Is.string((_a = candidate.codeDescription) === null || _a === void 0 ? void 0 : _a.href)) && (Is.string(candidate.source) || Is.undefined(candidate.source)) && (Is.undefined(candidate.relatedInformation) || Is.typedArray(candidate.relatedInformation, DiagnosticRelatedInformation.is));
  }
  Diagnostic2.is = is;
})(Diagnostic || (Diagnostic = {}));
var Command;
(function(Command2) {
  function create(title, command) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    var result = { title, command };
    if (Is.defined(args) && args.length > 0) {
      result.arguments = args;
    }
    return result;
  }
  Command2.create = create;
  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.command);
  }
  Command2.is = is;
})(Command || (Command = {}));
var TextEdit;
(function(TextEdit2) {
  function replace(range, newText) {
    return { range, newText };
  }
  TextEdit2.replace = replace;
  function insert(position, newText) {
    return { range: { start: position, end: position }, newText };
  }
  TextEdit2.insert = insert;
  function del(range) {
    return { range, newText: "" };
  }
  TextEdit2.del = del;
  function is(value) {
    var candidate = value;
    return Is.objectLiteral(candidate) && Is.string(candidate.newText) && Range.is(candidate.range);
  }
  TextEdit2.is = is;
})(TextEdit || (TextEdit = {}));
var ChangeAnnotation;
(function(ChangeAnnotation2) {
  function create(label, needsConfirmation, description) {
    var result = { label };
    if (needsConfirmation !== void 0) {
      result.needsConfirmation = needsConfirmation;
    }
    if (description !== void 0) {
      result.description = description;
    }
    return result;
  }
  ChangeAnnotation2.create = create;
  function is(value) {
    var candidate = value;
    return candidate !== void 0 && Is.objectLiteral(candidate) && Is.string(candidate.label) && (Is.boolean(candidate.needsConfirmation) || candidate.needsConfirmation === void 0) && (Is.string(candidate.description) || candidate.description === void 0);
  }
  ChangeAnnotation2.is = is;
})(ChangeAnnotation || (ChangeAnnotation = {}));
var ChangeAnnotationIdentifier;
(function(ChangeAnnotationIdentifier2) {
  function is(value) {
    var candidate = value;
    return typeof candidate === "string";
  }
  ChangeAnnotationIdentifier2.is = is;
})(ChangeAnnotationIdentifier || (ChangeAnnotationIdentifier = {}));
var AnnotatedTextEdit;
(function(AnnotatedTextEdit2) {
  function replace(range, newText, annotation) {
    return { range, newText, annotationId: annotation };
  }
  AnnotatedTextEdit2.replace = replace;
  function insert(position, newText, annotation) {
    return { range: { start: position, end: position }, newText, annotationId: annotation };
  }
  AnnotatedTextEdit2.insert = insert;
  function del(range, annotation) {
    return { range, newText: "", annotationId: annotation };
  }
  AnnotatedTextEdit2.del = del;
  function is(value) {
    var candidate = value;
    return TextEdit.is(candidate) && (ChangeAnnotation.is(candidate.annotationId) || ChangeAnnotationIdentifier.is(candidate.annotationId));
  }
  AnnotatedTextEdit2.is = is;
})(AnnotatedTextEdit || (AnnotatedTextEdit = {}));
var TextDocumentEdit;
(function(TextDocumentEdit2) {
  function create(textDocument, edits) {
    return { textDocument, edits };
  }
  TextDocumentEdit2.create = create;
  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && OptionalVersionedTextDocumentIdentifier.is(candidate.textDocument) && Array.isArray(candidate.edits);
  }
  TextDocumentEdit2.is = is;
})(TextDocumentEdit || (TextDocumentEdit = {}));
var CreateFile;
(function(CreateFile2) {
  function create(uri, options, annotation) {
    var result = {
      kind: "create",
      uri
    };
    if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
      result.options = options;
    }
    if (annotation !== void 0) {
      result.annotationId = annotation;
    }
    return result;
  }
  CreateFile2.create = create;
  function is(value) {
    var candidate = value;
    return candidate && candidate.kind === "create" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
  }
  CreateFile2.is = is;
})(CreateFile || (CreateFile = {}));
var RenameFile;
(function(RenameFile2) {
  function create(oldUri, newUri, options, annotation) {
    var result = {
      kind: "rename",
      oldUri,
      newUri
    };
    if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
      result.options = options;
    }
    if (annotation !== void 0) {
      result.annotationId = annotation;
    }
    return result;
  }
  RenameFile2.create = create;
  function is(value) {
    var candidate = value;
    return candidate && candidate.kind === "rename" && Is.string(candidate.oldUri) && Is.string(candidate.newUri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
  }
  RenameFile2.is = is;
})(RenameFile || (RenameFile = {}));
var DeleteFile;
(function(DeleteFile2) {
  function create(uri, options, annotation) {
    var result = {
      kind: "delete",
      uri
    };
    if (options !== void 0 && (options.recursive !== void 0 || options.ignoreIfNotExists !== void 0)) {
      result.options = options;
    }
    if (annotation !== void 0) {
      result.annotationId = annotation;
    }
    return result;
  }
  DeleteFile2.create = create;
  function is(value) {
    var candidate = value;
    return candidate && candidate.kind === "delete" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.recursive === void 0 || Is.boolean(candidate.options.recursive)) && (candidate.options.ignoreIfNotExists === void 0 || Is.boolean(candidate.options.ignoreIfNotExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
  }
  DeleteFile2.is = is;
})(DeleteFile || (DeleteFile = {}));
var WorkspaceEdit;
(function(WorkspaceEdit2) {
  function is(value) {
    var candidate = value;
    return candidate && (candidate.changes !== void 0 || candidate.documentChanges !== void 0) && (candidate.documentChanges === void 0 || candidate.documentChanges.every(function(change) {
      if (Is.string(change.kind)) {
        return CreateFile.is(change) || RenameFile.is(change) || DeleteFile.is(change);
      } else {
        return TextDocumentEdit.is(change);
      }
    }));
  }
  WorkspaceEdit2.is = is;
})(WorkspaceEdit || (WorkspaceEdit = {}));
var TextEditChangeImpl = function() {
  function TextEditChangeImpl2(edits, changeAnnotations) {
    this.edits = edits;
    this.changeAnnotations = changeAnnotations;
  }
  TextEditChangeImpl2.prototype.insert = function(position, newText, annotation) {
    var edit;
    var id;
    if (annotation === void 0) {
      edit = TextEdit.insert(position, newText);
    } else if (ChangeAnnotationIdentifier.is(annotation)) {
      id = annotation;
      edit = AnnotatedTextEdit.insert(position, newText, annotation);
    } else {
      this.assertChangeAnnotations(this.changeAnnotations);
      id = this.changeAnnotations.manage(annotation);
      edit = AnnotatedTextEdit.insert(position, newText, id);
    }
    this.edits.push(edit);
    if (id !== void 0) {
      return id;
    }
  };
  TextEditChangeImpl2.prototype.replace = function(range, newText, annotation) {
    var edit;
    var id;
    if (annotation === void 0) {
      edit = TextEdit.replace(range, newText);
    } else if (ChangeAnnotationIdentifier.is(annotation)) {
      id = annotation;
      edit = AnnotatedTextEdit.replace(range, newText, annotation);
    } else {
      this.assertChangeAnnotations(this.changeAnnotations);
      id = this.changeAnnotations.manage(annotation);
      edit = AnnotatedTextEdit.replace(range, newText, id);
    }
    this.edits.push(edit);
    if (id !== void 0) {
      return id;
    }
  };
  TextEditChangeImpl2.prototype.delete = function(range, annotation) {
    var edit;
    var id;
    if (annotation === void 0) {
      edit = TextEdit.del(range);
    } else if (ChangeAnnotationIdentifier.is(annotation)) {
      id = annotation;
      edit = AnnotatedTextEdit.del(range, annotation);
    } else {
      this.assertChangeAnnotations(this.changeAnnotations);
      id = this.changeAnnotations.manage(annotation);
      edit = AnnotatedTextEdit.del(range, id);
    }
    this.edits.push(edit);
    if (id !== void 0) {
      return id;
    }
  };
  TextEditChangeImpl2.prototype.add = function(edit) {
    this.edits.push(edit);
  };
  TextEditChangeImpl2.prototype.all = function() {
    return this.edits;
  };
  TextEditChangeImpl2.prototype.clear = function() {
    this.edits.splice(0, this.edits.length);
  };
  TextEditChangeImpl2.prototype.assertChangeAnnotations = function(value) {
    if (value === void 0) {
      throw new Error("Text edit change is not configured to manage change annotations.");
    }
  };
  return TextEditChangeImpl2;
}();
var ChangeAnnotations = function() {
  function ChangeAnnotations2(annotations) {
    this._annotations = annotations === void 0 ? /* @__PURE__ */ Object.create(null) : annotations;
    this._counter = 0;
    this._size = 0;
  }
  ChangeAnnotations2.prototype.all = function() {
    return this._annotations;
  };
  Object.defineProperty(ChangeAnnotations2.prototype, "size", {
    get: function() {
      return this._size;
    },
    enumerable: false,
    configurable: true
  });
  ChangeAnnotations2.prototype.manage = function(idOrAnnotation, annotation) {
    var id;
    if (ChangeAnnotationIdentifier.is(idOrAnnotation)) {
      id = idOrAnnotation;
    } else {
      id = this.nextId();
      annotation = idOrAnnotation;
    }
    if (this._annotations[id] !== void 0) {
      throw new Error("Id " + id + " is already in use.");
    }
    if (annotation === void 0) {
      throw new Error("No annotation provided for id " + id);
    }
    this._annotations[id] = annotation;
    this._size++;
    return id;
  };
  ChangeAnnotations2.prototype.nextId = function() {
    this._counter++;
    return this._counter.toString();
  };
  return ChangeAnnotations2;
}();
(function() {
  function WorkspaceChange2(workspaceEdit) {
    var _this = this;
    this._textEditChanges = /* @__PURE__ */ Object.create(null);
    if (workspaceEdit !== void 0) {
      this._workspaceEdit = workspaceEdit;
      if (workspaceEdit.documentChanges) {
        this._changeAnnotations = new ChangeAnnotations(workspaceEdit.changeAnnotations);
        workspaceEdit.changeAnnotations = this._changeAnnotations.all();
        workspaceEdit.documentChanges.forEach(function(change) {
          if (TextDocumentEdit.is(change)) {
            var textEditChange = new TextEditChangeImpl(change.edits, _this._changeAnnotations);
            _this._textEditChanges[change.textDocument.uri] = textEditChange;
          }
        });
      } else if (workspaceEdit.changes) {
        Object.keys(workspaceEdit.changes).forEach(function(key) {
          var textEditChange = new TextEditChangeImpl(workspaceEdit.changes[key]);
          _this._textEditChanges[key] = textEditChange;
        });
      }
    } else {
      this._workspaceEdit = {};
    }
  }
  Object.defineProperty(WorkspaceChange2.prototype, "edit", {
    get: function() {
      this.initDocumentChanges();
      if (this._changeAnnotations !== void 0) {
        if (this._changeAnnotations.size === 0) {
          this._workspaceEdit.changeAnnotations = void 0;
        } else {
          this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
        }
      }
      return this._workspaceEdit;
    },
    enumerable: false,
    configurable: true
  });
  WorkspaceChange2.prototype.getTextEditChange = function(key) {
    if (OptionalVersionedTextDocumentIdentifier.is(key)) {
      this.initDocumentChanges();
      if (this._workspaceEdit.documentChanges === void 0) {
        throw new Error("Workspace edit is not configured for document changes.");
      }
      var textDocument = { uri: key.uri, version: key.version };
      var result = this._textEditChanges[textDocument.uri];
      if (!result) {
        var edits = [];
        var textDocumentEdit = {
          textDocument,
          edits
        };
        this._workspaceEdit.documentChanges.push(textDocumentEdit);
        result = new TextEditChangeImpl(edits, this._changeAnnotations);
        this._textEditChanges[textDocument.uri] = result;
      }
      return result;
    } else {
      this.initChanges();
      if (this._workspaceEdit.changes === void 0) {
        throw new Error("Workspace edit is not configured for normal text edit changes.");
      }
      var result = this._textEditChanges[key];
      if (!result) {
        var edits = [];
        this._workspaceEdit.changes[key] = edits;
        result = new TextEditChangeImpl(edits);
        this._textEditChanges[key] = result;
      }
      return result;
    }
  };
  WorkspaceChange2.prototype.initDocumentChanges = function() {
    if (this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0) {
      this._changeAnnotations = new ChangeAnnotations();
      this._workspaceEdit.documentChanges = [];
      this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
    }
  };
  WorkspaceChange2.prototype.initChanges = function() {
    if (this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0) {
      this._workspaceEdit.changes = /* @__PURE__ */ Object.create(null);
    }
  };
  WorkspaceChange2.prototype.createFile = function(uri, optionsOrAnnotation, options) {
    this.initDocumentChanges();
    if (this._workspaceEdit.documentChanges === void 0) {
      throw new Error("Workspace edit is not configured for document changes.");
    }
    var annotation;
    if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
      annotation = optionsOrAnnotation;
    } else {
      options = optionsOrAnnotation;
    }
    var operation;
    var id;
    if (annotation === void 0) {
      operation = CreateFile.create(uri, options);
    } else {
      id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
      operation = CreateFile.create(uri, options, id);
    }
    this._workspaceEdit.documentChanges.push(operation);
    if (id !== void 0) {
      return id;
    }
  };
  WorkspaceChange2.prototype.renameFile = function(oldUri, newUri, optionsOrAnnotation, options) {
    this.initDocumentChanges();
    if (this._workspaceEdit.documentChanges === void 0) {
      throw new Error("Workspace edit is not configured for document changes.");
    }
    var annotation;
    if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
      annotation = optionsOrAnnotation;
    } else {
      options = optionsOrAnnotation;
    }
    var operation;
    var id;
    if (annotation === void 0) {
      operation = RenameFile.create(oldUri, newUri, options);
    } else {
      id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
      operation = RenameFile.create(oldUri, newUri, options, id);
    }
    this._workspaceEdit.documentChanges.push(operation);
    if (id !== void 0) {
      return id;
    }
  };
  WorkspaceChange2.prototype.deleteFile = function(uri, optionsOrAnnotation, options) {
    this.initDocumentChanges();
    if (this._workspaceEdit.documentChanges === void 0) {
      throw new Error("Workspace edit is not configured for document changes.");
    }
    var annotation;
    if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
      annotation = optionsOrAnnotation;
    } else {
      options = optionsOrAnnotation;
    }
    var operation;
    var id;
    if (annotation === void 0) {
      operation = DeleteFile.create(uri, options);
    } else {
      id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
      operation = DeleteFile.create(uri, options, id);
    }
    this._workspaceEdit.documentChanges.push(operation);
    if (id !== void 0) {
      return id;
    }
  };
  return WorkspaceChange2;
})();
var TextDocumentIdentifier;
(function(TextDocumentIdentifier2) {
  function create(uri) {
    return { uri };
  }
  TextDocumentIdentifier2.create = create;
  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri);
  }
  TextDocumentIdentifier2.is = is;
})(TextDocumentIdentifier || (TextDocumentIdentifier = {}));
var VersionedTextDocumentIdentifier;
(function(VersionedTextDocumentIdentifier2) {
  function create(uri, version) {
    return { uri, version };
  }
  VersionedTextDocumentIdentifier2.create = create;
  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri) && Is.integer(candidate.version);
  }
  VersionedTextDocumentIdentifier2.is = is;
})(VersionedTextDocumentIdentifier || (VersionedTextDocumentIdentifier = {}));
var OptionalVersionedTextDocumentIdentifier;
(function(OptionalVersionedTextDocumentIdentifier2) {
  function create(uri, version) {
    return { uri, version };
  }
  OptionalVersionedTextDocumentIdentifier2.create = create;
  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri) && (candidate.version === null || Is.integer(candidate.version));
  }
  OptionalVersionedTextDocumentIdentifier2.is = is;
})(OptionalVersionedTextDocumentIdentifier || (OptionalVersionedTextDocumentIdentifier = {}));
var TextDocumentItem;
(function(TextDocumentItem2) {
  function create(uri, languageId, version, text) {
    return { uri, languageId, version, text };
  }
  TextDocumentItem2.create = create;
  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.integer(candidate.version) && Is.string(candidate.text);
  }
  TextDocumentItem2.is = is;
})(TextDocumentItem || (TextDocumentItem = {}));
var MarkupKind;
(function(MarkupKind2) {
  MarkupKind2.PlainText = "plaintext";
  MarkupKind2.Markdown = "markdown";
})(MarkupKind || (MarkupKind = {}));
(function(MarkupKind2) {
  function is(value) {
    var candidate = value;
    return candidate === MarkupKind2.PlainText || candidate === MarkupKind2.Markdown;
  }
  MarkupKind2.is = is;
})(MarkupKind || (MarkupKind = {}));
var MarkupContent;
(function(MarkupContent2) {
  function is(value) {
    var candidate = value;
    return Is.objectLiteral(value) && MarkupKind.is(candidate.kind) && Is.string(candidate.value);
  }
  MarkupContent2.is = is;
})(MarkupContent || (MarkupContent = {}));
var CompletionItemKind;
(function(CompletionItemKind2) {
  CompletionItemKind2.Text = 1;
  CompletionItemKind2.Method = 2;
  CompletionItemKind2.Function = 3;
  CompletionItemKind2.Constructor = 4;
  CompletionItemKind2.Field = 5;
  CompletionItemKind2.Variable = 6;
  CompletionItemKind2.Class = 7;
  CompletionItemKind2.Interface = 8;
  CompletionItemKind2.Module = 9;
  CompletionItemKind2.Property = 10;
  CompletionItemKind2.Unit = 11;
  CompletionItemKind2.Value = 12;
  CompletionItemKind2.Enum = 13;
  CompletionItemKind2.Keyword = 14;
  CompletionItemKind2.Snippet = 15;
  CompletionItemKind2.Color = 16;
  CompletionItemKind2.File = 17;
  CompletionItemKind2.Reference = 18;
  CompletionItemKind2.Folder = 19;
  CompletionItemKind2.EnumMember = 20;
  CompletionItemKind2.Constant = 21;
  CompletionItemKind2.Struct = 22;
  CompletionItemKind2.Event = 23;
  CompletionItemKind2.Operator = 24;
  CompletionItemKind2.TypeParameter = 25;
})(CompletionItemKind || (CompletionItemKind = {}));
var InsertTextFormat;
(function(InsertTextFormat2) {
  InsertTextFormat2.PlainText = 1;
  InsertTextFormat2.Snippet = 2;
})(InsertTextFormat || (InsertTextFormat = {}));
var CompletionItemTag;
(function(CompletionItemTag2) {
  CompletionItemTag2.Deprecated = 1;
})(CompletionItemTag || (CompletionItemTag = {}));
var InsertReplaceEdit;
(function(InsertReplaceEdit2) {
  function create(newText, insert, replace) {
    return { newText, insert, replace };
  }
  InsertReplaceEdit2.create = create;
  function is(value) {
    var candidate = value;
    return candidate && Is.string(candidate.newText) && Range.is(candidate.insert) && Range.is(candidate.replace);
  }
  InsertReplaceEdit2.is = is;
})(InsertReplaceEdit || (InsertReplaceEdit = {}));
var InsertTextMode;
(function(InsertTextMode2) {
  InsertTextMode2.asIs = 1;
  InsertTextMode2.adjustIndentation = 2;
})(InsertTextMode || (InsertTextMode = {}));
var CompletionItem;
(function(CompletionItem2) {
  function create(label) {
    return { label };
  }
  CompletionItem2.create = create;
})(CompletionItem || (CompletionItem = {}));
var CompletionList;
(function(CompletionList2) {
  function create(items, isIncomplete) {
    return { items: items ? items : [], isIncomplete: !!isIncomplete };
  }
  CompletionList2.create = create;
})(CompletionList || (CompletionList = {}));
var MarkedString;
(function(MarkedString2) {
  function fromPlainText(plainText) {
    return plainText.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
  }
  MarkedString2.fromPlainText = fromPlainText;
  function is(value) {
    var candidate = value;
    return Is.string(candidate) || Is.objectLiteral(candidate) && Is.string(candidate.language) && Is.string(candidate.value);
  }
  MarkedString2.is = is;
})(MarkedString || (MarkedString = {}));
var Hover;
(function(Hover2) {
  function is(value) {
    var candidate = value;
    return !!candidate && Is.objectLiteral(candidate) && (MarkupContent.is(candidate.contents) || MarkedString.is(candidate.contents) || Is.typedArray(candidate.contents, MarkedString.is)) && (value.range === void 0 || Range.is(value.range));
  }
  Hover2.is = is;
})(Hover || (Hover = {}));
var ParameterInformation;
(function(ParameterInformation2) {
  function create(label, documentation) {
    return documentation ? { label, documentation } : { label };
  }
  ParameterInformation2.create = create;
})(ParameterInformation || (ParameterInformation = {}));
var SignatureInformation;
(function(SignatureInformation2) {
  function create(label, documentation) {
    var parameters = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      parameters[_i - 2] = arguments[_i];
    }
    var result = { label };
    if (Is.defined(documentation)) {
      result.documentation = documentation;
    }
    if (Is.defined(parameters)) {
      result.parameters = parameters;
    } else {
      result.parameters = [];
    }
    return result;
  }
  SignatureInformation2.create = create;
})(SignatureInformation || (SignatureInformation = {}));
var DocumentHighlightKind;
(function(DocumentHighlightKind2) {
  DocumentHighlightKind2.Text = 1;
  DocumentHighlightKind2.Read = 2;
  DocumentHighlightKind2.Write = 3;
})(DocumentHighlightKind || (DocumentHighlightKind = {}));
var DocumentHighlight;
(function(DocumentHighlight2) {
  function create(range, kind) {
    var result = { range };
    if (Is.number(kind)) {
      result.kind = kind;
    }
    return result;
  }
  DocumentHighlight2.create = create;
})(DocumentHighlight || (DocumentHighlight = {}));
var SymbolKind;
(function(SymbolKind2) {
  SymbolKind2.File = 1;
  SymbolKind2.Module = 2;
  SymbolKind2.Namespace = 3;
  SymbolKind2.Package = 4;
  SymbolKind2.Class = 5;
  SymbolKind2.Method = 6;
  SymbolKind2.Property = 7;
  SymbolKind2.Field = 8;
  SymbolKind2.Constructor = 9;
  SymbolKind2.Enum = 10;
  SymbolKind2.Interface = 11;
  SymbolKind2.Function = 12;
  SymbolKind2.Variable = 13;
  SymbolKind2.Constant = 14;
  SymbolKind2.String = 15;
  SymbolKind2.Number = 16;
  SymbolKind2.Boolean = 17;
  SymbolKind2.Array = 18;
  SymbolKind2.Object = 19;
  SymbolKind2.Key = 20;
  SymbolKind2.Null = 21;
  SymbolKind2.EnumMember = 22;
  SymbolKind2.Struct = 23;
  SymbolKind2.Event = 24;
  SymbolKind2.Operator = 25;
  SymbolKind2.TypeParameter = 26;
})(SymbolKind || (SymbolKind = {}));
var SymbolTag;
(function(SymbolTag2) {
  SymbolTag2.Deprecated = 1;
})(SymbolTag || (SymbolTag = {}));
var SymbolInformation;
(function(SymbolInformation2) {
  function create(name, kind, range, uri, containerName) {
    var result = {
      name,
      kind,
      location: { uri, range }
    };
    if (containerName) {
      result.containerName = containerName;
    }
    return result;
  }
  SymbolInformation2.create = create;
})(SymbolInformation || (SymbolInformation = {}));
var DocumentSymbol;
(function(DocumentSymbol2) {
  function create(name, detail, kind, range, selectionRange, children) {
    var result = {
      name,
      detail,
      kind,
      range,
      selectionRange
    };
    if (children !== void 0) {
      result.children = children;
    }
    return result;
  }
  DocumentSymbol2.create = create;
  function is(value) {
    var candidate = value;
    return candidate && Is.string(candidate.name) && Is.number(candidate.kind) && Range.is(candidate.range) && Range.is(candidate.selectionRange) && (candidate.detail === void 0 || Is.string(candidate.detail)) && (candidate.deprecated === void 0 || Is.boolean(candidate.deprecated)) && (candidate.children === void 0 || Array.isArray(candidate.children)) && (candidate.tags === void 0 || Array.isArray(candidate.tags));
  }
  DocumentSymbol2.is = is;
})(DocumentSymbol || (DocumentSymbol = {}));
var CodeActionKind;
(function(CodeActionKind2) {
  CodeActionKind2.Empty = "";
  CodeActionKind2.QuickFix = "quickfix";
  CodeActionKind2.Refactor = "refactor";
  CodeActionKind2.RefactorExtract = "refactor.extract";
  CodeActionKind2.RefactorInline = "refactor.inline";
  CodeActionKind2.RefactorRewrite = "refactor.rewrite";
  CodeActionKind2.Source = "source";
  CodeActionKind2.SourceOrganizeImports = "source.organizeImports";
  CodeActionKind2.SourceFixAll = "source.fixAll";
})(CodeActionKind || (CodeActionKind = {}));
var CodeActionContext;
(function(CodeActionContext2) {
  function create(diagnostics, only) {
    var result = { diagnostics };
    if (only !== void 0 && only !== null) {
      result.only = only;
    }
    return result;
  }
  CodeActionContext2.create = create;
  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Is.typedArray(candidate.diagnostics, Diagnostic.is) && (candidate.only === void 0 || Is.typedArray(candidate.only, Is.string));
  }
  CodeActionContext2.is = is;
})(CodeActionContext || (CodeActionContext = {}));
var CodeAction;
(function(CodeAction2) {
  function create(title, kindOrCommandOrEdit, kind) {
    var result = { title };
    var checkKind = true;
    if (typeof kindOrCommandOrEdit === "string") {
      checkKind = false;
      result.kind = kindOrCommandOrEdit;
    } else if (Command.is(kindOrCommandOrEdit)) {
      result.command = kindOrCommandOrEdit;
    } else {
      result.edit = kindOrCommandOrEdit;
    }
    if (checkKind && kind !== void 0) {
      result.kind = kind;
    }
    return result;
  }
  CodeAction2.create = create;
  function is(value) {
    var candidate = value;
    return candidate && Is.string(candidate.title) && (candidate.diagnostics === void 0 || Is.typedArray(candidate.diagnostics, Diagnostic.is)) && (candidate.kind === void 0 || Is.string(candidate.kind)) && (candidate.edit !== void 0 || candidate.command !== void 0) && (candidate.command === void 0 || Command.is(candidate.command)) && (candidate.isPreferred === void 0 || Is.boolean(candidate.isPreferred)) && (candidate.edit === void 0 || WorkspaceEdit.is(candidate.edit));
  }
  CodeAction2.is = is;
})(CodeAction || (CodeAction = {}));
var CodeLens;
(function(CodeLens2) {
  function create(range, data) {
    var result = { range };
    if (Is.defined(data)) {
      result.data = data;
    }
    return result;
  }
  CodeLens2.create = create;
  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
  }
  CodeLens2.is = is;
})(CodeLens || (CodeLens = {}));
var FormattingOptions;
(function(FormattingOptions2) {
  function create(tabSize, insertSpaces) {
    return { tabSize, insertSpaces };
  }
  FormattingOptions2.create = create;
  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Is.uinteger(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
  }
  FormattingOptions2.is = is;
})(FormattingOptions || (FormattingOptions = {}));
var DocumentLink;
(function(DocumentLink2) {
  function create(range, target, data) {
    return { range, target, data };
  }
  DocumentLink2.create = create;
  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.target) || Is.string(candidate.target));
  }
  DocumentLink2.is = is;
})(DocumentLink || (DocumentLink = {}));
var SelectionRange;
(function(SelectionRange2) {
  function create(range, parent) {
    return { range, parent };
  }
  SelectionRange2.create = create;
  function is(value) {
    var candidate = value;
    return candidate !== void 0 && Range.is(candidate.range) && (candidate.parent === void 0 || SelectionRange2.is(candidate.parent));
  }
  SelectionRange2.is = is;
})(SelectionRange || (SelectionRange = {}));
var TextDocument;
(function(TextDocument2) {
  function create(uri, languageId, version, content) {
    return new FullTextDocument(uri, languageId, version, content);
  }
  TextDocument2.create = create;
  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.uinteger(candidate.lineCount) && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
  }
  TextDocument2.is = is;
  function applyEdits(document, edits) {
    var text = document.getText();
    var sortedEdits = mergeSort(edits, function(a, b) {
      var diff = a.range.start.line - b.range.start.line;
      if (diff === 0) {
        return a.range.start.character - b.range.start.character;
      }
      return diff;
    });
    var lastModifiedOffset = text.length;
    for (var i = sortedEdits.length - 1; i >= 0; i--) {
      var e = sortedEdits[i];
      var startOffset = document.offsetAt(e.range.start);
      var endOffset = document.offsetAt(e.range.end);
      if (endOffset <= lastModifiedOffset) {
        text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
      } else {
        throw new Error("Overlapping edit");
      }
      lastModifiedOffset = startOffset;
    }
    return text;
  }
  TextDocument2.applyEdits = applyEdits;
  function mergeSort(data, compare) {
    if (data.length <= 1) {
      return data;
    }
    var p = data.length / 2 | 0;
    var left = data.slice(0, p);
    var right = data.slice(p);
    mergeSort(left, compare);
    mergeSort(right, compare);
    var leftIdx = 0;
    var rightIdx = 0;
    var i = 0;
    while (leftIdx < left.length && rightIdx < right.length) {
      var ret = compare(left[leftIdx], right[rightIdx]);
      if (ret <= 0) {
        data[i++] = left[leftIdx++];
      } else {
        data[i++] = right[rightIdx++];
      }
    }
    while (leftIdx < left.length) {
      data[i++] = left[leftIdx++];
    }
    while (rightIdx < right.length) {
      data[i++] = right[rightIdx++];
    }
    return data;
  }
})(TextDocument || (TextDocument = {}));
var FullTextDocument = function() {
  function FullTextDocument2(uri, languageId, version, content) {
    this._uri = uri;
    this._languageId = languageId;
    this._version = version;
    this._content = content;
    this._lineOffsets = void 0;
  }
  Object.defineProperty(FullTextDocument2.prototype, "uri", {
    get: function() {
      return this._uri;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(FullTextDocument2.prototype, "languageId", {
    get: function() {
      return this._languageId;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(FullTextDocument2.prototype, "version", {
    get: function() {
      return this._version;
    },
    enumerable: false,
    configurable: true
  });
  FullTextDocument2.prototype.getText = function(range) {
    if (range) {
      var start = this.offsetAt(range.start);
      var end = this.offsetAt(range.end);
      return this._content.substring(start, end);
    }
    return this._content;
  };
  FullTextDocument2.prototype.update = function(event, version) {
    this._content = event.text;
    this._version = version;
    this._lineOffsets = void 0;
  };
  FullTextDocument2.prototype.getLineOffsets = function() {
    if (this._lineOffsets === void 0) {
      var lineOffsets = [];
      var text = this._content;
      var isLineStart = true;
      for (var i = 0; i < text.length; i++) {
        if (isLineStart) {
          lineOffsets.push(i);
          isLineStart = false;
        }
        var ch = text.charAt(i);
        isLineStart = ch === "\r" || ch === "\n";
        if (ch === "\r" && i + 1 < text.length && text.charAt(i + 1) === "\n") {
          i++;
        }
      }
      if (isLineStart && text.length > 0) {
        lineOffsets.push(text.length);
      }
      this._lineOffsets = lineOffsets;
    }
    return this._lineOffsets;
  };
  FullTextDocument2.prototype.positionAt = function(offset) {
    offset = Math.max(Math.min(offset, this._content.length), 0);
    var lineOffsets = this.getLineOffsets();
    var low = 0, high = lineOffsets.length;
    if (high === 0) {
      return Position.create(0, offset);
    }
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (lineOffsets[mid] > offset) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }
    var line = low - 1;
    return Position.create(line, offset - lineOffsets[line]);
  };
  FullTextDocument2.prototype.offsetAt = function(position) {
    var lineOffsets = this.getLineOffsets();
    if (position.line >= lineOffsets.length) {
      return this._content.length;
    } else if (position.line < 0) {
      return 0;
    }
    var lineOffset = lineOffsets[position.line];
    var nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
    return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
  };
  Object.defineProperty(FullTextDocument2.prototype, "lineCount", {
    get: function() {
      return this.getLineOffsets().length;
    },
    enumerable: false,
    configurable: true
  });
  return FullTextDocument2;
}();
var Is;
(function(Is2) {
  var toString = Object.prototype.toString;
  function defined(value) {
    return typeof value !== "undefined";
  }
  Is2.defined = defined;
  function undefined2(value) {
    return typeof value === "undefined";
  }
  Is2.undefined = undefined2;
  function boolean(value) {
    return value === true || value === false;
  }
  Is2.boolean = boolean;
  function string(value) {
    return toString.call(value) === "[object String]";
  }
  Is2.string = string;
  function number(value) {
    return toString.call(value) === "[object Number]";
  }
  Is2.number = number;
  function numberRange(value, min, max) {
    return toString.call(value) === "[object Number]" && min <= value && value <= max;
  }
  Is2.numberRange = numberRange;
  function integer2(value) {
    return toString.call(value) === "[object Number]" && -2147483648 <= value && value <= 2147483647;
  }
  Is2.integer = integer2;
  function uinteger2(value) {
    return toString.call(value) === "[object Number]" && 0 <= value && value <= 2147483647;
  }
  Is2.uinteger = uinteger2;
  function func(value) {
    return toString.call(value) === "[object Function]";
  }
  Is2.func = func;
  function objectLiteral(value) {
    return value !== null && typeof value === "object";
  }
  Is2.objectLiteral = objectLiteral;
  function typedArray(value, check) {
    return Array.isArray(value) && value.every(check);
  }
  Is2.typedArray = typedArray;
})(Is || (Is = {}));
var DiagnosticsAdapter = class {
  constructor(_languageId, _worker, configChangeEvent) {
    __publicField(this, "_disposables", []);
    __publicField(this, "_listener", /* @__PURE__ */ Object.create(null));
    this._languageId = _languageId;
    this._worker = _worker;
    const onModelAdd = (model) => {
      let modeId = model.getLanguageId();
      if (modeId !== this._languageId) {
        return;
      }
      let handle;
      this._listener[model.uri.toString()] = model.onDidChangeContent(() => {
        window.clearTimeout(handle);
        handle = window.setTimeout(() => this._doValidate(model.uri, modeId), 500);
      });
      this._doValidate(model.uri, modeId);
    };
    const onModelRemoved = (model) => {
      monaco_editor_core_exports.editor.setModelMarkers(model, this._languageId, []);
      let uriStr = model.uri.toString();
      let listener = this._listener[uriStr];
      if (listener) {
        listener.dispose();
        delete this._listener[uriStr];
      }
    };
    this._disposables.push(monaco_editor_core_exports.editor.onDidCreateModel(onModelAdd));
    this._disposables.push(monaco_editor_core_exports.editor.onWillDisposeModel(onModelRemoved));
    this._disposables.push(monaco_editor_core_exports.editor.onDidChangeModelLanguage((event) => {
      onModelRemoved(event.model);
      onModelAdd(event.model);
    }));
    this._disposables.push(configChangeEvent((_) => {
      monaco_editor_core_exports.editor.getModels().forEach((model) => {
        if (model.getLanguageId() === this._languageId) {
          onModelRemoved(model);
          onModelAdd(model);
        }
      });
    }));
    this._disposables.push({
      dispose: () => {
        monaco_editor_core_exports.editor.getModels().forEach(onModelRemoved);
        for (let key in this._listener) {
          this._listener[key].dispose();
        }
      }
    });
    monaco_editor_core_exports.editor.getModels().forEach(onModelAdd);
  }
  dispose() {
    this._disposables.forEach((d) => d && d.dispose());
    this._disposables.length = 0;
  }
  _doValidate(resource, languageId) {
    this._worker(resource).then((worker) => {
      return worker.doValidation(resource.toString());
    }).then((diagnostics) => {
      const markers = diagnostics.map((d) => toDiagnostics(resource, d));
      let model = monaco_editor_core_exports.editor.getModel(resource);
      if (model && model.getLanguageId() === languageId) {
        monaco_editor_core_exports.editor.setModelMarkers(model, languageId, markers);
      }
    }).then(void 0, (err) => {
      console.error(err);
    });
  }
};
function toSeverity(lsSeverity) {
  switch (lsSeverity) {
    case DiagnosticSeverity.Error:
      return monaco_editor_core_exports.MarkerSeverity.Error;
    case DiagnosticSeverity.Warning:
      return monaco_editor_core_exports.MarkerSeverity.Warning;
    case DiagnosticSeverity.Information:
      return monaco_editor_core_exports.MarkerSeverity.Info;
    case DiagnosticSeverity.Hint:
      return monaco_editor_core_exports.MarkerSeverity.Hint;
    default:
      return monaco_editor_core_exports.MarkerSeverity.Info;
  }
}
function toDiagnostics(resource, diag) {
  let code = typeof diag.code === "number" ? String(diag.code) : diag.code;
  return {
    severity: toSeverity(diag.severity),
    startLineNumber: diag.range.start.line + 1,
    startColumn: diag.range.start.character + 1,
    endLineNumber: diag.range.end.line + 1,
    endColumn: diag.range.end.character + 1,
    message: diag.message,
    code,
    source: diag.source
  };
}
var CompletionAdapter = class {
  constructor(_worker, _triggerCharacters) {
    this._worker = _worker;
    this._triggerCharacters = _triggerCharacters;
  }
  get triggerCharacters() {
    return this._triggerCharacters;
  }
  provideCompletionItems(model, position, context, token) {
    const resource = model.uri;
    return this._worker(resource).then((worker) => {
      return worker.doComplete(resource.toString(), fromPosition(position));
    }).then((info) => {
      if (!info) {
        return;
      }
      const wordInfo = model.getWordUntilPosition(position);
      const wordRange = new monaco_editor_core_exports.Range(position.lineNumber, wordInfo.startColumn, position.lineNumber, wordInfo.endColumn);
      const items = info.items.map((entry) => {
        const item = {
          label: entry.label,
          insertText: entry.insertText || entry.label,
          sortText: entry.sortText,
          filterText: entry.filterText,
          documentation: entry.documentation,
          detail: entry.detail,
          command: toCommand(entry.command),
          range: wordRange,
          kind: toCompletionItemKind(entry.kind)
        };
        if (entry.textEdit) {
          if (isInsertReplaceEdit(entry.textEdit)) {
            item.range = {
              insert: toRange(entry.textEdit.insert),
              replace: toRange(entry.textEdit.replace)
            };
          } else {
            item.range = toRange(entry.textEdit.range);
          }
          item.insertText = entry.textEdit.newText;
        }
        if (entry.additionalTextEdits) {
          item.additionalTextEdits = entry.additionalTextEdits.map(toTextEdit);
        }
        if (entry.insertTextFormat === InsertTextFormat.Snippet) {
          item.insertTextRules = monaco_editor_core_exports.languages.CompletionItemInsertTextRule.InsertAsSnippet;
        }
        return item;
      });
      return {
        isIncomplete: info.isIncomplete,
        suggestions: items
      };
    });
  }
};
function fromPosition(position) {
  if (!position) {
    return void 0;
  }
  return { character: position.column - 1, line: position.lineNumber - 1 };
}
function fromRange(range) {
  if (!range) {
    return void 0;
  }
  return {
    start: {
      line: range.startLineNumber - 1,
      character: range.startColumn - 1
    },
    end: { line: range.endLineNumber - 1, character: range.endColumn - 1 }
  };
}
function toRange(range) {
  if (!range) {
    return void 0;
  }
  return new monaco_editor_core_exports.Range(range.start.line + 1, range.start.character + 1, range.end.line + 1, range.end.character + 1);
}
function isInsertReplaceEdit(edit) {
  return typeof edit.insert !== "undefined" && typeof edit.replace !== "undefined";
}
function toCompletionItemKind(kind) {
  const mItemKind = monaco_editor_core_exports.languages.CompletionItemKind;
  switch (kind) {
    case CompletionItemKind.Text:
      return mItemKind.Text;
    case CompletionItemKind.Method:
      return mItemKind.Method;
    case CompletionItemKind.Function:
      return mItemKind.Function;
    case CompletionItemKind.Constructor:
      return mItemKind.Constructor;
    case CompletionItemKind.Field:
      return mItemKind.Field;
    case CompletionItemKind.Variable:
      return mItemKind.Variable;
    case CompletionItemKind.Class:
      return mItemKind.Class;
    case CompletionItemKind.Interface:
      return mItemKind.Interface;
    case CompletionItemKind.Module:
      return mItemKind.Module;
    case CompletionItemKind.Property:
      return mItemKind.Property;
    case CompletionItemKind.Unit:
      return mItemKind.Unit;
    case CompletionItemKind.Value:
      return mItemKind.Value;
    case CompletionItemKind.Enum:
      return mItemKind.Enum;
    case CompletionItemKind.Keyword:
      return mItemKind.Keyword;
    case CompletionItemKind.Snippet:
      return mItemKind.Snippet;
    case CompletionItemKind.Color:
      return mItemKind.Color;
    case CompletionItemKind.File:
      return mItemKind.File;
    case CompletionItemKind.Reference:
      return mItemKind.Reference;
  }
  return mItemKind.Property;
}
function toTextEdit(textEdit) {
  if (!textEdit) {
    return void 0;
  }
  return {
    range: toRange(textEdit.range),
    text: textEdit.newText
  };
}
function toCommand(c) {
  return c && c.command === "editor.action.triggerSuggest" ? { id: c.command, title: c.title, arguments: c.arguments } : void 0;
}
var HoverAdapter = class {
  constructor(_worker) {
    this._worker = _worker;
  }
  provideHover(model, position, token) {
    let resource = model.uri;
    return this._worker(resource).then((worker) => {
      return worker.doHover(resource.toString(), fromPosition(position));
    }).then((info) => {
      if (!info) {
        return;
      }
      return {
        range: toRange(info.range),
        contents: toMarkedStringArray(info.contents)
      };
    });
  }
};
function isMarkupContent(thing) {
  return thing && typeof thing === "object" && typeof thing.kind === "string";
}
function toMarkdownString(entry) {
  if (typeof entry === "string") {
    return {
      value: entry
    };
  }
  if (isMarkupContent(entry)) {
    if (entry.kind === "plaintext") {
      return {
        value: entry.value.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&")
      };
    }
    return {
      value: entry.value
    };
  }
  return { value: "```" + entry.language + "\n" + entry.value + "\n```\n" };
}
function toMarkedStringArray(contents) {
  if (!contents) {
    return void 0;
  }
  if (Array.isArray(contents)) {
    return contents.map(toMarkdownString);
  }
  return [toMarkdownString(contents)];
}
var DocumentHighlightAdapter = class {
  constructor(_worker) {
    this._worker = _worker;
  }
  provideDocumentHighlights(model, position, token) {
    const resource = model.uri;
    return this._worker(resource).then((worker) => worker.findDocumentHighlights(resource.toString(), fromPosition(position))).then((entries) => {
      if (!entries) {
        return;
      }
      return entries.map((entry) => {
        return {
          range: toRange(entry.range),
          kind: toDocumentHighlightKind(entry.kind)
        };
      });
    });
  }
};
function toDocumentHighlightKind(kind) {
  switch (kind) {
    case DocumentHighlightKind.Read:
      return monaco_editor_core_exports.languages.DocumentHighlightKind.Read;
    case DocumentHighlightKind.Write:
      return monaco_editor_core_exports.languages.DocumentHighlightKind.Write;
    case DocumentHighlightKind.Text:
      return monaco_editor_core_exports.languages.DocumentHighlightKind.Text;
  }
  return monaco_editor_core_exports.languages.DocumentHighlightKind.Text;
}
var DefinitionAdapter = class {
  constructor(_worker) {
    this._worker = _worker;
  }
  provideDefinition(model, position, token) {
    const resource = model.uri;
    return this._worker(resource).then((worker) => {
      return worker.findDefinition(resource.toString(), fromPosition(position));
    }).then((definition) => {
      if (!definition) {
        return;
      }
      return [toLocation(definition)];
    });
  }
};
function toLocation(location) {
  return {
    uri: monaco_editor_core_exports.Uri.parse(location.uri),
    range: toRange(location.range)
  };
}
var ReferenceAdapter = class {
  constructor(_worker) {
    this._worker = _worker;
  }
  provideReferences(model, position, context, token) {
    const resource = model.uri;
    return this._worker(resource).then((worker) => {
      return worker.findReferences(resource.toString(), fromPosition(position));
    }).then((entries) => {
      if (!entries) {
        return;
      }
      return entries.map(toLocation);
    });
  }
};
var RenameAdapter = class {
  constructor(_worker) {
    this._worker = _worker;
  }
  provideRenameEdits(model, position, newName, token) {
    const resource = model.uri;
    return this._worker(resource).then((worker) => {
      return worker.doRename(resource.toString(), fromPosition(position), newName);
    }).then((edit) => {
      return toWorkspaceEdit(edit);
    });
  }
};
function toWorkspaceEdit(edit) {
  if (!edit || !edit.changes) {
    return void 0;
  }
  let resourceEdits = [];
  for (let uri in edit.changes) {
    const _uri = monaco_editor_core_exports.Uri.parse(uri);
    for (let e of edit.changes[uri]) {
      resourceEdits.push({
        resource: _uri,
        versionId: void 0,
        textEdit: {
          range: toRange(e.range),
          text: e.newText
        }
      });
    }
  }
  return {
    edits: resourceEdits
  };
}
var DocumentSymbolAdapter = class {
  constructor(_worker) {
    this._worker = _worker;
  }
  provideDocumentSymbols(model, token) {
    const resource = model.uri;
    return this._worker(resource).then((worker) => worker.findDocumentSymbols(resource.toString())).then((items) => {
      if (!items) {
        return;
      }
      return items.map((item) => ({
        name: item.name,
        detail: "",
        containerName: item.containerName,
        kind: toSymbolKind(item.kind),
        range: toRange(item.location.range),
        selectionRange: toRange(item.location.range),
        tags: []
      }));
    });
  }
};
function toSymbolKind(kind) {
  let mKind = monaco_editor_core_exports.languages.SymbolKind;
  switch (kind) {
    case SymbolKind.File:
      return mKind.Array;
    case SymbolKind.Module:
      return mKind.Module;
    case SymbolKind.Namespace:
      return mKind.Namespace;
    case SymbolKind.Package:
      return mKind.Package;
    case SymbolKind.Class:
      return mKind.Class;
    case SymbolKind.Method:
      return mKind.Method;
    case SymbolKind.Property:
      return mKind.Property;
    case SymbolKind.Field:
      return mKind.Field;
    case SymbolKind.Constructor:
      return mKind.Constructor;
    case SymbolKind.Enum:
      return mKind.Enum;
    case SymbolKind.Interface:
      return mKind.Interface;
    case SymbolKind.Function:
      return mKind.Function;
    case SymbolKind.Variable:
      return mKind.Variable;
    case SymbolKind.Constant:
      return mKind.Constant;
    case SymbolKind.String:
      return mKind.String;
    case SymbolKind.Number:
      return mKind.Number;
    case SymbolKind.Boolean:
      return mKind.Boolean;
    case SymbolKind.Array:
      return mKind.Array;
  }
  return mKind.Function;
}
var DocumentLinkAdapter = class {
  constructor(_worker) {
    this._worker = _worker;
  }
  provideLinks(model, token) {
    const resource = model.uri;
    return this._worker(resource).then((worker) => worker.findDocumentLinks(resource.toString())).then((items) => {
      if (!items) {
        return;
      }
      return {
        links: items.map((item) => ({
          range: toRange(item.range),
          url: item.target
        }))
      };
    });
  }
};
var DocumentFormattingEditProvider = class {
  constructor(_worker) {
    this._worker = _worker;
  }
  provideDocumentFormattingEdits(model, options, token) {
    const resource = model.uri;
    return this._worker(resource).then((worker) => {
      return worker.format(resource.toString(), null, fromFormattingOptions(options)).then((edits) => {
        if (!edits || edits.length === 0) {
          return;
        }
        return edits.map(toTextEdit);
      });
    });
  }
};
var DocumentRangeFormattingEditProvider = class {
  constructor(_worker) {
    __publicField(this, "canFormatMultipleRanges", false);
    this._worker = _worker;
  }
  provideDocumentRangeFormattingEdits(model, range, options, token) {
    const resource = model.uri;
    return this._worker(resource).then((worker) => {
      return worker.format(resource.toString(), fromRange(range), fromFormattingOptions(options)).then((edits) => {
        if (!edits || edits.length === 0) {
          return;
        }
        return edits.map(toTextEdit);
      });
    });
  }
};
function fromFormattingOptions(options) {
  return {
    tabSize: options.tabSize,
    insertSpaces: options.insertSpaces
  };
}
var DocumentColorAdapter = class {
  constructor(_worker) {
    this._worker = _worker;
  }
  provideDocumentColors(model, token) {
    const resource = model.uri;
    return this._worker(resource).then((worker) => worker.findDocumentColors(resource.toString())).then((infos) => {
      if (!infos) {
        return;
      }
      return infos.map((item) => ({
        color: item.color,
        range: toRange(item.range)
      }));
    });
  }
  provideColorPresentations(model, info, token) {
    const resource = model.uri;
    return this._worker(resource).then((worker) => worker.getColorPresentations(resource.toString(), info.color, fromRange(info.range))).then((presentations) => {
      if (!presentations) {
        return;
      }
      return presentations.map((presentation) => {
        let item = {
          label: presentation.label
        };
        if (presentation.textEdit) {
          item.textEdit = toTextEdit(presentation.textEdit);
        }
        if (presentation.additionalTextEdits) {
          item.additionalTextEdits = presentation.additionalTextEdits.map(toTextEdit);
        }
        return item;
      });
    });
  }
};
var FoldingRangeAdapter = class {
  constructor(_worker) {
    this._worker = _worker;
  }
  provideFoldingRanges(model, context, token) {
    const resource = model.uri;
    return this._worker(resource).then((worker) => worker.getFoldingRanges(resource.toString(), context)).then((ranges) => {
      if (!ranges) {
        return;
      }
      return ranges.map((range) => {
        const result = {
          start: range.startLine + 1,
          end: range.endLine + 1
        };
        if (typeof range.kind !== "undefined") {
          result.kind = toFoldingRangeKind(range.kind);
        }
        return result;
      });
    });
  }
};
function toFoldingRangeKind(kind) {
  switch (kind) {
    case FoldingRangeKind.Comment:
      return monaco_editor_core_exports.languages.FoldingRangeKind.Comment;
    case FoldingRangeKind.Imports:
      return monaco_editor_core_exports.languages.FoldingRangeKind.Imports;
    case FoldingRangeKind.Region:
      return monaco_editor_core_exports.languages.FoldingRangeKind.Region;
  }
  return void 0;
}
var SelectionRangeAdapter = class {
  constructor(_worker) {
    this._worker = _worker;
  }
  provideSelectionRanges(model, positions, token) {
    const resource = model.uri;
    return this._worker(resource).then((worker) => worker.getSelectionRanges(resource.toString(), positions.map(fromPosition))).then((selectionRanges) => {
      if (!selectionRanges) {
        return;
      }
      return selectionRanges.map((selectionRange) => {
        const result = [];
        while (selectionRange) {
          result.push({ range: toRange(selectionRange.range) });
          selectionRange = selectionRange.parent;
        }
        return result;
      });
    });
  }
};
function setupMode(defaults) {
  const disposables = [];
  const providers = [];
  const client = new WorkerManager(defaults);
  disposables.push(client);
  const worker = (...uris) => {
    return client.getLanguageServiceWorker(...uris);
  };
  function registerProviders() {
    const { languageId, modeConfiguration } = defaults;
    disposeAll(providers);
    if (modeConfiguration.completionItems) {
      providers.push(monaco_editor_core_exports.languages.registerCompletionItemProvider(languageId, new CompletionAdapter(worker, ["/", "-", ":"])));
    }
    if (modeConfiguration.hovers) {
      providers.push(monaco_editor_core_exports.languages.registerHoverProvider(languageId, new HoverAdapter(worker)));
    }
    if (modeConfiguration.documentHighlights) {
      providers.push(monaco_editor_core_exports.languages.registerDocumentHighlightProvider(languageId, new DocumentHighlightAdapter(worker)));
    }
    if (modeConfiguration.definitions) {
      providers.push(monaco_editor_core_exports.languages.registerDefinitionProvider(languageId, new DefinitionAdapter(worker)));
    }
    if (modeConfiguration.references) {
      providers.push(monaco_editor_core_exports.languages.registerReferenceProvider(languageId, new ReferenceAdapter(worker)));
    }
    if (modeConfiguration.documentSymbols) {
      providers.push(monaco_editor_core_exports.languages.registerDocumentSymbolProvider(languageId, new DocumentSymbolAdapter(worker)));
    }
    if (modeConfiguration.rename) {
      providers.push(monaco_editor_core_exports.languages.registerRenameProvider(languageId, new RenameAdapter(worker)));
    }
    if (modeConfiguration.colors) {
      providers.push(monaco_editor_core_exports.languages.registerColorProvider(languageId, new DocumentColorAdapter(worker)));
    }
    if (modeConfiguration.foldingRanges) {
      providers.push(monaco_editor_core_exports.languages.registerFoldingRangeProvider(languageId, new FoldingRangeAdapter(worker)));
    }
    if (modeConfiguration.diagnostics) {
      providers.push(new DiagnosticsAdapter(languageId, worker, defaults.onDidChange));
    }
    if (modeConfiguration.selectionRanges) {
      providers.push(monaco_editor_core_exports.languages.registerSelectionRangeProvider(languageId, new SelectionRangeAdapter(worker)));
    }
    if (modeConfiguration.documentFormattingEdits) {
      providers.push(monaco_editor_core_exports.languages.registerDocumentFormattingEditProvider(languageId, new DocumentFormattingEditProvider(worker)));
    }
    if (modeConfiguration.documentRangeFormattingEdits) {
      providers.push(monaco_editor_core_exports.languages.registerDocumentRangeFormattingEditProvider(languageId, new DocumentRangeFormattingEditProvider(worker)));
    }
  }
  registerProviders();
  disposables.push(asDisposable(providers));
  return asDisposable(disposables);
}
function asDisposable(disposables) {
  return { dispose: () => disposeAll(disposables) };
}
function disposeAll(disposables) {
  while (disposables.length) {
    disposables.pop().dispose();
  }
}
export {
  CompletionAdapter,
  DefinitionAdapter,
  DiagnosticsAdapter,
  DocumentColorAdapter,
  DocumentFormattingEditProvider,
  DocumentHighlightAdapter,
  DocumentLinkAdapter,
  DocumentRangeFormattingEditProvider,
  DocumentSymbolAdapter,
  FoldingRangeAdapter,
  HoverAdapter,
  ReferenceAdapter,
  RenameAdapter,
  SelectionRangeAdapter,
  WorkerManager,
  fromPosition,
  fromRange,
  setupMode,
  toRange,
  toTextEdit
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzTW9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL21vbmFjby1lZGl0b3IvZXNtL3ZzL2xhbmd1YWdlL2Nzcy9jc3NNb2RlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFZlcnNpb246IDAuNDUuMCg1ZTVhZjAxM2Y4ZDI5NTU1NWE3MjEwZGYwZDVmMmNlYTBiZjVkZDU2KVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L21vbmFjby1lZGl0b3IvYmxvYi9tYWluL0xJQ0VOU0UudHh0XG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxudmFyIF9fZGVmUHJvcCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbnZhciBfX2dldE93blByb3BEZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbnZhciBfX2dldE93blByb3BOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xudmFyIF9faGFzT3duUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgX19jb3B5UHJvcHMgPSAodG8sIGZyb20sIGV4Y2VwdCwgZGVzYykgPT4ge1xuICBpZiAoZnJvbSAmJiB0eXBlb2YgZnJvbSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgZnJvbSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZm9yIChsZXQga2V5IG9mIF9fZ2V0T3duUHJvcE5hbWVzKGZyb20pKVxuICAgICAgaWYgKCFfX2hhc093blByb3AuY2FsbCh0bywga2V5KSAmJiBrZXkgIT09IGV4Y2VwdClcbiAgICAgICAgX19kZWZQcm9wKHRvLCBrZXksIHsgZ2V0OiAoKSA9PiBmcm9tW2tleV0sIGVudW1lcmFibGU6ICEoZGVzYyA9IF9fZ2V0T3duUHJvcERlc2MoZnJvbSwga2V5KSkgfHwgZGVzYy5lbnVtZXJhYmxlIH0pO1xuICB9XG4gIHJldHVybiB0bztcbn07XG52YXIgX19yZUV4cG9ydCA9ICh0YXJnZXQsIG1vZCwgc2Vjb25kVGFyZ2V0KSA9PiAoX19jb3B5UHJvcHModGFyZ2V0LCBtb2QsIFwiZGVmYXVsdFwiKSwgc2Vjb25kVGFyZ2V0ICYmIF9fY29weVByb3BzKHNlY29uZFRhcmdldCwgbW9kLCBcImRlZmF1bHRcIikpO1xuXG4vLyBzcmMvZmlsbGVycy9tb25hY28tZWRpdG9yLWNvcmUudHNcbnZhciBtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cyA9IHt9O1xuX19yZUV4cG9ydChtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cywgbW9uYWNvX2VkaXRvcl9jb3JlX3N0YXIpO1xuaW1wb3J0ICogYXMgbW9uYWNvX2VkaXRvcl9jb3JlX3N0YXIgZnJvbSBcIi4uLy4uL2VkaXRvci9lZGl0b3IuYXBpLmpzXCI7XG5cbi8vIHNyYy9sYW5ndWFnZS9jc3Mvd29ya2VyTWFuYWdlci50c1xudmFyIFNUT1BfV0hFTl9JRExFX0ZPUiA9IDIgKiA2MCAqIDFlMztcbnZhciBXb3JrZXJNYW5hZ2VyID0gY2xhc3Mge1xuICBfZGVmYXVsdHM7XG4gIF9pZGxlQ2hlY2tJbnRlcnZhbDtcbiAgX2xhc3RVc2VkVGltZTtcbiAgX2NvbmZpZ0NoYW5nZUxpc3RlbmVyO1xuICBfd29ya2VyO1xuICBfY2xpZW50O1xuICBjb25zdHJ1Y3RvcihkZWZhdWx0cykge1xuICAgIHRoaXMuX2RlZmF1bHRzID0gZGVmYXVsdHM7XG4gICAgdGhpcy5fd29ya2VyID0gbnVsbDtcbiAgICB0aGlzLl9jbGllbnQgPSBudWxsO1xuICAgIHRoaXMuX2lkbGVDaGVja0ludGVydmFsID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHRoaXMuX2NoZWNrSWZJZGxlKCksIDMwICogMWUzKTtcbiAgICB0aGlzLl9sYXN0VXNlZFRpbWUgPSAwO1xuICAgIHRoaXMuX2NvbmZpZ0NoYW5nZUxpc3RlbmVyID0gdGhpcy5fZGVmYXVsdHMub25EaWRDaGFuZ2UoKCkgPT4gdGhpcy5fc3RvcFdvcmtlcigpKTtcbiAgfVxuICBfc3RvcFdvcmtlcigpIHtcbiAgICBpZiAodGhpcy5fd29ya2VyKSB7XG4gICAgICB0aGlzLl93b3JrZXIuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5fd29ya2VyID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5fY2xpZW50ID0gbnVsbDtcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5faWRsZUNoZWNrSW50ZXJ2YWwpO1xuICAgIHRoaXMuX2NvbmZpZ0NoYW5nZUxpc3RlbmVyLmRpc3Bvc2UoKTtcbiAgICB0aGlzLl9zdG9wV29ya2VyKCk7XG4gIH1cbiAgX2NoZWNrSWZJZGxlKCkge1xuICAgIGlmICghdGhpcy5fd29ya2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCB0aW1lUGFzc2VkU2luY2VMYXN0VXNlZCA9IERhdGUubm93KCkgLSB0aGlzLl9sYXN0VXNlZFRpbWU7XG4gICAgaWYgKHRpbWVQYXNzZWRTaW5jZUxhc3RVc2VkID4gU1RPUF9XSEVOX0lETEVfRk9SKSB7XG4gICAgICB0aGlzLl9zdG9wV29ya2VyKCk7XG4gICAgfVxuICB9XG4gIF9nZXRDbGllbnQoKSB7XG4gICAgdGhpcy5fbGFzdFVzZWRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICBpZiAoIXRoaXMuX2NsaWVudCkge1xuICAgICAgdGhpcy5fd29ya2VyID0gbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMuZWRpdG9yLmNyZWF0ZVdlYldvcmtlcih7XG4gICAgICAgIG1vZHVsZUlkOiBcInZzL2xhbmd1YWdlL2Nzcy9jc3NXb3JrZXJcIixcbiAgICAgICAgbGFiZWw6IHRoaXMuX2RlZmF1bHRzLmxhbmd1YWdlSWQsXG4gICAgICAgIGNyZWF0ZURhdGE6IHtcbiAgICAgICAgICBvcHRpb25zOiB0aGlzLl9kZWZhdWx0cy5vcHRpb25zLFxuICAgICAgICAgIGxhbmd1YWdlSWQ6IHRoaXMuX2RlZmF1bHRzLmxhbmd1YWdlSWRcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9jbGllbnQgPSB0aGlzLl93b3JrZXIuZ2V0UHJveHkoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2NsaWVudDtcbiAgfVxuICBnZXRMYW5ndWFnZVNlcnZpY2VXb3JrZXIoLi4ucmVzb3VyY2VzKSB7XG4gICAgbGV0IF9jbGllbnQ7XG4gICAgcmV0dXJuIHRoaXMuX2dldENsaWVudCgpLnRoZW4oKGNsaWVudCkgPT4ge1xuICAgICAgX2NsaWVudCA9IGNsaWVudDtcbiAgICB9KS50aGVuKChfKSA9PiB7XG4gICAgICBpZiAodGhpcy5fd29ya2VyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93b3JrZXIud2l0aFN5bmNlZFJlc291cmNlcyhyZXNvdXJjZXMpO1xuICAgICAgfVxuICAgIH0pLnRoZW4oKF8pID0+IF9jbGllbnQpO1xuICB9XG59O1xuXG4vLyBub2RlX21vZHVsZXMvdnNjb2RlLWxhbmd1YWdlc2VydmVyLXR5cGVzL2xpYi9lc20vbWFpbi5qc1xudmFyIGludGVnZXI7XG4oZnVuY3Rpb24oaW50ZWdlcjIpIHtcbiAgaW50ZWdlcjIuTUlOX1ZBTFVFID0gLTIxNDc0ODM2NDg7XG4gIGludGVnZXIyLk1BWF9WQUxVRSA9IDIxNDc0ODM2NDc7XG59KShpbnRlZ2VyIHx8IChpbnRlZ2VyID0ge30pKTtcbnZhciB1aW50ZWdlcjtcbihmdW5jdGlvbih1aW50ZWdlcjIpIHtcbiAgdWludGVnZXIyLk1JTl9WQUxVRSA9IDA7XG4gIHVpbnRlZ2VyMi5NQVhfVkFMVUUgPSAyMTQ3NDgzNjQ3O1xufSkodWludGVnZXIgfHwgKHVpbnRlZ2VyID0ge30pKTtcbnZhciBQb3NpdGlvbjtcbihmdW5jdGlvbihQb3NpdGlvbjMpIHtcbiAgZnVuY3Rpb24gY3JlYXRlKGxpbmUsIGNoYXJhY3Rlcikge1xuICAgIGlmIChsaW5lID09PSBOdW1iZXIuTUFYX1ZBTFVFKSB7XG4gICAgICBsaW5lID0gdWludGVnZXIuTUFYX1ZBTFVFO1xuICAgIH1cbiAgICBpZiAoY2hhcmFjdGVyID09PSBOdW1iZXIuTUFYX1ZBTFVFKSB7XG4gICAgICBjaGFyYWN0ZXIgPSB1aW50ZWdlci5NQVhfVkFMVUU7XG4gICAgfVxuICAgIHJldHVybiB7IGxpbmUsIGNoYXJhY3RlciB9O1xuICB9XG4gIFBvc2l0aW9uMy5jcmVhdGUgPSBjcmVhdGU7XG4gIGZ1bmN0aW9uIGlzKHZhbHVlKSB7XG4gICAgdmFyIGNhbmRpZGF0ZSA9IHZhbHVlO1xuICAgIHJldHVybiBJcy5vYmplY3RMaXRlcmFsKGNhbmRpZGF0ZSkgJiYgSXMudWludGVnZXIoY2FuZGlkYXRlLmxpbmUpICYmIElzLnVpbnRlZ2VyKGNhbmRpZGF0ZS5jaGFyYWN0ZXIpO1xuICB9XG4gIFBvc2l0aW9uMy5pcyA9IGlzO1xufSkoUG9zaXRpb24gfHwgKFBvc2l0aW9uID0ge30pKTtcbnZhciBSYW5nZTtcbihmdW5jdGlvbihSYW5nZTMpIHtcbiAgZnVuY3Rpb24gY3JlYXRlKG9uZSwgdHdvLCB0aHJlZSwgZm91cikge1xuICAgIGlmIChJcy51aW50ZWdlcihvbmUpICYmIElzLnVpbnRlZ2VyKHR3bykgJiYgSXMudWludGVnZXIodGhyZWUpICYmIElzLnVpbnRlZ2VyKGZvdXIpKSB7XG4gICAgICByZXR1cm4geyBzdGFydDogUG9zaXRpb24uY3JlYXRlKG9uZSwgdHdvKSwgZW5kOiBQb3NpdGlvbi5jcmVhdGUodGhyZWUsIGZvdXIpIH07XG4gICAgfSBlbHNlIGlmIChQb3NpdGlvbi5pcyhvbmUpICYmIFBvc2l0aW9uLmlzKHR3bykpIHtcbiAgICAgIHJldHVybiB7IHN0YXJ0OiBvbmUsIGVuZDogdHdvIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlJhbmdlI2NyZWF0ZSBjYWxsZWQgd2l0aCBpbnZhbGlkIGFyZ3VtZW50c1tcIiArIG9uZSArIFwiLCBcIiArIHR3byArIFwiLCBcIiArIHRocmVlICsgXCIsIFwiICsgZm91ciArIFwiXVwiKTtcbiAgICB9XG4gIH1cbiAgUmFuZ2UzLmNyZWF0ZSA9IGNyZWF0ZTtcbiAgZnVuY3Rpb24gaXModmFsdWUpIHtcbiAgICB2YXIgY2FuZGlkYXRlID0gdmFsdWU7XG4gICAgcmV0dXJuIElzLm9iamVjdExpdGVyYWwoY2FuZGlkYXRlKSAmJiBQb3NpdGlvbi5pcyhjYW5kaWRhdGUuc3RhcnQpICYmIFBvc2l0aW9uLmlzKGNhbmRpZGF0ZS5lbmQpO1xuICB9XG4gIFJhbmdlMy5pcyA9IGlzO1xufSkoUmFuZ2UgfHwgKFJhbmdlID0ge30pKTtcbnZhciBMb2NhdGlvbjtcbihmdW5jdGlvbihMb2NhdGlvbjIpIHtcbiAgZnVuY3Rpb24gY3JlYXRlKHVyaSwgcmFuZ2UpIHtcbiAgICByZXR1cm4geyB1cmksIHJhbmdlIH07XG4gIH1cbiAgTG9jYXRpb24yLmNyZWF0ZSA9IGNyZWF0ZTtcbiAgZnVuY3Rpb24gaXModmFsdWUpIHtcbiAgICB2YXIgY2FuZGlkYXRlID0gdmFsdWU7XG4gICAgcmV0dXJuIElzLmRlZmluZWQoY2FuZGlkYXRlKSAmJiBSYW5nZS5pcyhjYW5kaWRhdGUucmFuZ2UpICYmIChJcy5zdHJpbmcoY2FuZGlkYXRlLnVyaSkgfHwgSXMudW5kZWZpbmVkKGNhbmRpZGF0ZS51cmkpKTtcbiAgfVxuICBMb2NhdGlvbjIuaXMgPSBpcztcbn0pKExvY2F0aW9uIHx8IChMb2NhdGlvbiA9IHt9KSk7XG52YXIgTG9jYXRpb25MaW5rO1xuKGZ1bmN0aW9uKExvY2F0aW9uTGluazIpIHtcbiAgZnVuY3Rpb24gY3JlYXRlKHRhcmdldFVyaSwgdGFyZ2V0UmFuZ2UsIHRhcmdldFNlbGVjdGlvblJhbmdlLCBvcmlnaW5TZWxlY3Rpb25SYW5nZSkge1xuICAgIHJldHVybiB7IHRhcmdldFVyaSwgdGFyZ2V0UmFuZ2UsIHRhcmdldFNlbGVjdGlvblJhbmdlLCBvcmlnaW5TZWxlY3Rpb25SYW5nZSB9O1xuICB9XG4gIExvY2F0aW9uTGluazIuY3JlYXRlID0gY3JlYXRlO1xuICBmdW5jdGlvbiBpcyh2YWx1ZSkge1xuICAgIHZhciBjYW5kaWRhdGUgPSB2YWx1ZTtcbiAgICByZXR1cm4gSXMuZGVmaW5lZChjYW5kaWRhdGUpICYmIFJhbmdlLmlzKGNhbmRpZGF0ZS50YXJnZXRSYW5nZSkgJiYgSXMuc3RyaW5nKGNhbmRpZGF0ZS50YXJnZXRVcmkpICYmIChSYW5nZS5pcyhjYW5kaWRhdGUudGFyZ2V0U2VsZWN0aW9uUmFuZ2UpIHx8IElzLnVuZGVmaW5lZChjYW5kaWRhdGUudGFyZ2V0U2VsZWN0aW9uUmFuZ2UpKSAmJiAoUmFuZ2UuaXMoY2FuZGlkYXRlLm9yaWdpblNlbGVjdGlvblJhbmdlKSB8fCBJcy51bmRlZmluZWQoY2FuZGlkYXRlLm9yaWdpblNlbGVjdGlvblJhbmdlKSk7XG4gIH1cbiAgTG9jYXRpb25MaW5rMi5pcyA9IGlzO1xufSkoTG9jYXRpb25MaW5rIHx8IChMb2NhdGlvbkxpbmsgPSB7fSkpO1xudmFyIENvbG9yO1xuKGZ1bmN0aW9uKENvbG9yMikge1xuICBmdW5jdGlvbiBjcmVhdGUocmVkLCBncmVlbiwgYmx1ZSwgYWxwaGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVkLFxuICAgICAgZ3JlZW4sXG4gICAgICBibHVlLFxuICAgICAgYWxwaGFcbiAgICB9O1xuICB9XG4gIENvbG9yMi5jcmVhdGUgPSBjcmVhdGU7XG4gIGZ1bmN0aW9uIGlzKHZhbHVlKSB7XG4gICAgdmFyIGNhbmRpZGF0ZSA9IHZhbHVlO1xuICAgIHJldHVybiBJcy5udW1iZXJSYW5nZShjYW5kaWRhdGUucmVkLCAwLCAxKSAmJiBJcy5udW1iZXJSYW5nZShjYW5kaWRhdGUuZ3JlZW4sIDAsIDEpICYmIElzLm51bWJlclJhbmdlKGNhbmRpZGF0ZS5ibHVlLCAwLCAxKSAmJiBJcy5udW1iZXJSYW5nZShjYW5kaWRhdGUuYWxwaGEsIDAsIDEpO1xuICB9XG4gIENvbG9yMi5pcyA9IGlzO1xufSkoQ29sb3IgfHwgKENvbG9yID0ge30pKTtcbnZhciBDb2xvckluZm9ybWF0aW9uO1xuKGZ1bmN0aW9uKENvbG9ySW5mb3JtYXRpb24yKSB7XG4gIGZ1bmN0aW9uIGNyZWF0ZShyYW5nZSwgY29sb3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmFuZ2UsXG4gICAgICBjb2xvclxuICAgIH07XG4gIH1cbiAgQ29sb3JJbmZvcm1hdGlvbjIuY3JlYXRlID0gY3JlYXRlO1xuICBmdW5jdGlvbiBpcyh2YWx1ZSkge1xuICAgIHZhciBjYW5kaWRhdGUgPSB2YWx1ZTtcbiAgICByZXR1cm4gUmFuZ2UuaXMoY2FuZGlkYXRlLnJhbmdlKSAmJiBDb2xvci5pcyhjYW5kaWRhdGUuY29sb3IpO1xuICB9XG4gIENvbG9ySW5mb3JtYXRpb24yLmlzID0gaXM7XG59KShDb2xvckluZm9ybWF0aW9uIHx8IChDb2xvckluZm9ybWF0aW9uID0ge30pKTtcbnZhciBDb2xvclByZXNlbnRhdGlvbjtcbihmdW5jdGlvbihDb2xvclByZXNlbnRhdGlvbjIpIHtcbiAgZnVuY3Rpb24gY3JlYXRlKGxhYmVsLCB0ZXh0RWRpdCwgYWRkaXRpb25hbFRleHRFZGl0cykge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbCxcbiAgICAgIHRleHRFZGl0LFxuICAgICAgYWRkaXRpb25hbFRleHRFZGl0c1xuICAgIH07XG4gIH1cbiAgQ29sb3JQcmVzZW50YXRpb24yLmNyZWF0ZSA9IGNyZWF0ZTtcbiAgZnVuY3Rpb24gaXModmFsdWUpIHtcbiAgICB2YXIgY2FuZGlkYXRlID0gdmFsdWU7XG4gICAgcmV0dXJuIElzLnN0cmluZyhjYW5kaWRhdGUubGFiZWwpICYmIChJcy51bmRlZmluZWQoY2FuZGlkYXRlLnRleHRFZGl0KSB8fCBUZXh0RWRpdC5pcyhjYW5kaWRhdGUpKSAmJiAoSXMudW5kZWZpbmVkKGNhbmRpZGF0ZS5hZGRpdGlvbmFsVGV4dEVkaXRzKSB8fCBJcy50eXBlZEFycmF5KGNhbmRpZGF0ZS5hZGRpdGlvbmFsVGV4dEVkaXRzLCBUZXh0RWRpdC5pcykpO1xuICB9XG4gIENvbG9yUHJlc2VudGF0aW9uMi5pcyA9IGlzO1xufSkoQ29sb3JQcmVzZW50YXRpb24gfHwgKENvbG9yUHJlc2VudGF0aW9uID0ge30pKTtcbnZhciBGb2xkaW5nUmFuZ2VLaW5kO1xuKGZ1bmN0aW9uKEZvbGRpbmdSYW5nZUtpbmQyKSB7XG4gIEZvbGRpbmdSYW5nZUtpbmQyW1wiQ29tbWVudFwiXSA9IFwiY29tbWVudFwiO1xuICBGb2xkaW5nUmFuZ2VLaW5kMltcIkltcG9ydHNcIl0gPSBcImltcG9ydHNcIjtcbiAgRm9sZGluZ1JhbmdlS2luZDJbXCJSZWdpb25cIl0gPSBcInJlZ2lvblwiO1xufSkoRm9sZGluZ1JhbmdlS2luZCB8fCAoRm9sZGluZ1JhbmdlS2luZCA9IHt9KSk7XG52YXIgRm9sZGluZ1JhbmdlO1xuKGZ1bmN0aW9uKEZvbGRpbmdSYW5nZTIpIHtcbiAgZnVuY3Rpb24gY3JlYXRlKHN0YXJ0TGluZSwgZW5kTGluZSwgc3RhcnRDaGFyYWN0ZXIsIGVuZENoYXJhY3Rlciwga2luZCkge1xuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICBzdGFydExpbmUsXG4gICAgICBlbmRMaW5lXG4gICAgfTtcbiAgICBpZiAoSXMuZGVmaW5lZChzdGFydENoYXJhY3RlcikpIHtcbiAgICAgIHJlc3VsdC5zdGFydENoYXJhY3RlciA9IHN0YXJ0Q2hhcmFjdGVyO1xuICAgIH1cbiAgICBpZiAoSXMuZGVmaW5lZChlbmRDaGFyYWN0ZXIpKSB7XG4gICAgICByZXN1bHQuZW5kQ2hhcmFjdGVyID0gZW5kQ2hhcmFjdGVyO1xuICAgIH1cbiAgICBpZiAoSXMuZGVmaW5lZChraW5kKSkge1xuICAgICAgcmVzdWx0LmtpbmQgPSBraW5kO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIEZvbGRpbmdSYW5nZTIuY3JlYXRlID0gY3JlYXRlO1xuICBmdW5jdGlvbiBpcyh2YWx1ZSkge1xuICAgIHZhciBjYW5kaWRhdGUgPSB2YWx1ZTtcbiAgICByZXR1cm4gSXMudWludGVnZXIoY2FuZGlkYXRlLnN0YXJ0TGluZSkgJiYgSXMudWludGVnZXIoY2FuZGlkYXRlLnN0YXJ0TGluZSkgJiYgKElzLnVuZGVmaW5lZChjYW5kaWRhdGUuc3RhcnRDaGFyYWN0ZXIpIHx8IElzLnVpbnRlZ2VyKGNhbmRpZGF0ZS5zdGFydENoYXJhY3RlcikpICYmIChJcy51bmRlZmluZWQoY2FuZGlkYXRlLmVuZENoYXJhY3RlcikgfHwgSXMudWludGVnZXIoY2FuZGlkYXRlLmVuZENoYXJhY3RlcikpICYmIChJcy51bmRlZmluZWQoY2FuZGlkYXRlLmtpbmQpIHx8IElzLnN0cmluZyhjYW5kaWRhdGUua2luZCkpO1xuICB9XG4gIEZvbGRpbmdSYW5nZTIuaXMgPSBpcztcbn0pKEZvbGRpbmdSYW5nZSB8fCAoRm9sZGluZ1JhbmdlID0ge30pKTtcbnZhciBEaWFnbm9zdGljUmVsYXRlZEluZm9ybWF0aW9uO1xuKGZ1bmN0aW9uKERpYWdub3N0aWNSZWxhdGVkSW5mb3JtYXRpb24yKSB7XG4gIGZ1bmN0aW9uIGNyZWF0ZShsb2NhdGlvbiwgbWVzc2FnZSkge1xuICAgIHJldHVybiB7XG4gICAgICBsb2NhdGlvbixcbiAgICAgIG1lc3NhZ2VcbiAgICB9O1xuICB9XG4gIERpYWdub3N0aWNSZWxhdGVkSW5mb3JtYXRpb24yLmNyZWF0ZSA9IGNyZWF0ZTtcbiAgZnVuY3Rpb24gaXModmFsdWUpIHtcbiAgICB2YXIgY2FuZGlkYXRlID0gdmFsdWU7XG4gICAgcmV0dXJuIElzLmRlZmluZWQoY2FuZGlkYXRlKSAmJiBMb2NhdGlvbi5pcyhjYW5kaWRhdGUubG9jYXRpb24pICYmIElzLnN0cmluZyhjYW5kaWRhdGUubWVzc2FnZSk7XG4gIH1cbiAgRGlhZ25vc3RpY1JlbGF0ZWRJbmZvcm1hdGlvbjIuaXMgPSBpcztcbn0pKERpYWdub3N0aWNSZWxhdGVkSW5mb3JtYXRpb24gfHwgKERpYWdub3N0aWNSZWxhdGVkSW5mb3JtYXRpb24gPSB7fSkpO1xudmFyIERpYWdub3N0aWNTZXZlcml0eTtcbihmdW5jdGlvbihEaWFnbm9zdGljU2V2ZXJpdHkyKSB7XG4gIERpYWdub3N0aWNTZXZlcml0eTIuRXJyb3IgPSAxO1xuICBEaWFnbm9zdGljU2V2ZXJpdHkyLldhcm5pbmcgPSAyO1xuICBEaWFnbm9zdGljU2V2ZXJpdHkyLkluZm9ybWF0aW9uID0gMztcbiAgRGlhZ25vc3RpY1NldmVyaXR5Mi5IaW50ID0gNDtcbn0pKERpYWdub3N0aWNTZXZlcml0eSB8fCAoRGlhZ25vc3RpY1NldmVyaXR5ID0ge30pKTtcbnZhciBEaWFnbm9zdGljVGFnO1xuKGZ1bmN0aW9uKERpYWdub3N0aWNUYWcyKSB7XG4gIERpYWdub3N0aWNUYWcyLlVubmVjZXNzYXJ5ID0gMTtcbiAgRGlhZ25vc3RpY1RhZzIuRGVwcmVjYXRlZCA9IDI7XG59KShEaWFnbm9zdGljVGFnIHx8IChEaWFnbm9zdGljVGFnID0ge30pKTtcbnZhciBDb2RlRGVzY3JpcHRpb247XG4oZnVuY3Rpb24oQ29kZURlc2NyaXB0aW9uMikge1xuICBmdW5jdGlvbiBpcyh2YWx1ZSkge1xuICAgIHZhciBjYW5kaWRhdGUgPSB2YWx1ZTtcbiAgICByZXR1cm4gY2FuZGlkYXRlICE9PSB2b2lkIDAgJiYgY2FuZGlkYXRlICE9PSBudWxsICYmIElzLnN0cmluZyhjYW5kaWRhdGUuaHJlZik7XG4gIH1cbiAgQ29kZURlc2NyaXB0aW9uMi5pcyA9IGlzO1xufSkoQ29kZURlc2NyaXB0aW9uIHx8IChDb2RlRGVzY3JpcHRpb24gPSB7fSkpO1xudmFyIERpYWdub3N0aWM7XG4oZnVuY3Rpb24oRGlhZ25vc3RpYzIpIHtcbiAgZnVuY3Rpb24gY3JlYXRlKHJhbmdlLCBtZXNzYWdlLCBzZXZlcml0eSwgY29kZSwgc291cmNlLCByZWxhdGVkSW5mb3JtYXRpb24pIHtcbiAgICB2YXIgcmVzdWx0ID0geyByYW5nZSwgbWVzc2FnZSB9O1xuICAgIGlmIChJcy5kZWZpbmVkKHNldmVyaXR5KSkge1xuICAgICAgcmVzdWx0LnNldmVyaXR5ID0gc2V2ZXJpdHk7XG4gICAgfVxuICAgIGlmIChJcy5kZWZpbmVkKGNvZGUpKSB7XG4gICAgICByZXN1bHQuY29kZSA9IGNvZGU7XG4gICAgfVxuICAgIGlmIChJcy5kZWZpbmVkKHNvdXJjZSkpIHtcbiAgICAgIHJlc3VsdC5zb3VyY2UgPSBzb3VyY2U7XG4gICAgfVxuICAgIGlmIChJcy5kZWZpbmVkKHJlbGF0ZWRJbmZvcm1hdGlvbikpIHtcbiAgICAgIHJlc3VsdC5yZWxhdGVkSW5mb3JtYXRpb24gPSByZWxhdGVkSW5mb3JtYXRpb247XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgRGlhZ25vc3RpYzIuY3JlYXRlID0gY3JlYXRlO1xuICBmdW5jdGlvbiBpcyh2YWx1ZSkge1xuICAgIHZhciBfYTtcbiAgICB2YXIgY2FuZGlkYXRlID0gdmFsdWU7XG4gICAgcmV0dXJuIElzLmRlZmluZWQoY2FuZGlkYXRlKSAmJiBSYW5nZS5pcyhjYW5kaWRhdGUucmFuZ2UpICYmIElzLnN0cmluZyhjYW5kaWRhdGUubWVzc2FnZSkgJiYgKElzLm51bWJlcihjYW5kaWRhdGUuc2V2ZXJpdHkpIHx8IElzLnVuZGVmaW5lZChjYW5kaWRhdGUuc2V2ZXJpdHkpKSAmJiAoSXMuaW50ZWdlcihjYW5kaWRhdGUuY29kZSkgfHwgSXMuc3RyaW5nKGNhbmRpZGF0ZS5jb2RlKSB8fCBJcy51bmRlZmluZWQoY2FuZGlkYXRlLmNvZGUpKSAmJiAoSXMudW5kZWZpbmVkKGNhbmRpZGF0ZS5jb2RlRGVzY3JpcHRpb24pIHx8IElzLnN0cmluZygoX2EgPSBjYW5kaWRhdGUuY29kZURlc2NyaXB0aW9uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaHJlZikpICYmIChJcy5zdHJpbmcoY2FuZGlkYXRlLnNvdXJjZSkgfHwgSXMudW5kZWZpbmVkKGNhbmRpZGF0ZS5zb3VyY2UpKSAmJiAoSXMudW5kZWZpbmVkKGNhbmRpZGF0ZS5yZWxhdGVkSW5mb3JtYXRpb24pIHx8IElzLnR5cGVkQXJyYXkoY2FuZGlkYXRlLnJlbGF0ZWRJbmZvcm1hdGlvbiwgRGlhZ25vc3RpY1JlbGF0ZWRJbmZvcm1hdGlvbi5pcykpO1xuICB9XG4gIERpYWdub3N0aWMyLmlzID0gaXM7XG59KShEaWFnbm9zdGljIHx8IChEaWFnbm9zdGljID0ge30pKTtcbnZhciBDb21tYW5kO1xuKGZ1bmN0aW9uKENvbW1hbmQyKSB7XG4gIGZ1bmN0aW9uIGNyZWF0ZSh0aXRsZSwgY29tbWFuZCkge1xuICAgIHZhciBhcmdzID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIGFyZ3NbX2kgLSAyXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSB7IHRpdGxlLCBjb21tYW5kIH07XG4gICAgaWYgKElzLmRlZmluZWQoYXJncykgJiYgYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICByZXN1bHQuYXJndW1lbnRzID0gYXJncztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBDb21tYW5kMi5jcmVhdGUgPSBjcmVhdGU7XG4gIGZ1bmN0aW9uIGlzKHZhbHVlKSB7XG4gICAgdmFyIGNhbmRpZGF0ZSA9IHZhbHVlO1xuICAgIHJldHVybiBJcy5kZWZpbmVkKGNhbmRpZGF0ZSkgJiYgSXMuc3RyaW5nKGNhbmRpZGF0ZS50aXRsZSkgJiYgSXMuc3RyaW5nKGNhbmRpZGF0ZS5jb21tYW5kKTtcbiAgfVxuICBDb21tYW5kMi5pcyA9IGlzO1xufSkoQ29tbWFuZCB8fCAoQ29tbWFuZCA9IHt9KSk7XG52YXIgVGV4dEVkaXQ7XG4oZnVuY3Rpb24oVGV4dEVkaXQyKSB7XG4gIGZ1bmN0aW9uIHJlcGxhY2UocmFuZ2UsIG5ld1RleHQpIHtcbiAgICByZXR1cm4geyByYW5nZSwgbmV3VGV4dCB9O1xuICB9XG4gIFRleHRFZGl0Mi5yZXBsYWNlID0gcmVwbGFjZTtcbiAgZnVuY3Rpb24gaW5zZXJ0KHBvc2l0aW9uLCBuZXdUZXh0KSB7XG4gICAgcmV0dXJuIHsgcmFuZ2U6IHsgc3RhcnQ6IHBvc2l0aW9uLCBlbmQ6IHBvc2l0aW9uIH0sIG5ld1RleHQgfTtcbiAgfVxuICBUZXh0RWRpdDIuaW5zZXJ0ID0gaW5zZXJ0O1xuICBmdW5jdGlvbiBkZWwocmFuZ2UpIHtcbiAgICByZXR1cm4geyByYW5nZSwgbmV3VGV4dDogXCJcIiB9O1xuICB9XG4gIFRleHRFZGl0Mi5kZWwgPSBkZWw7XG4gIGZ1bmN0aW9uIGlzKHZhbHVlKSB7XG4gICAgdmFyIGNhbmRpZGF0ZSA9IHZhbHVlO1xuICAgIHJldHVybiBJcy5vYmplY3RMaXRlcmFsKGNhbmRpZGF0ZSkgJiYgSXMuc3RyaW5nKGNhbmRpZGF0ZS5uZXdUZXh0KSAmJiBSYW5nZS5pcyhjYW5kaWRhdGUucmFuZ2UpO1xuICB9XG4gIFRleHRFZGl0Mi5pcyA9IGlzO1xufSkoVGV4dEVkaXQgfHwgKFRleHRFZGl0ID0ge30pKTtcbnZhciBDaGFuZ2VBbm5vdGF0aW9uO1xuKGZ1bmN0aW9uKENoYW5nZUFubm90YXRpb24yKSB7XG4gIGZ1bmN0aW9uIGNyZWF0ZShsYWJlbCwgbmVlZHNDb25maXJtYXRpb24sIGRlc2NyaXB0aW9uKSB7XG4gICAgdmFyIHJlc3VsdCA9IHsgbGFiZWwgfTtcbiAgICBpZiAobmVlZHNDb25maXJtYXRpb24gIT09IHZvaWQgMCkge1xuICAgICAgcmVzdWx0Lm5lZWRzQ29uZmlybWF0aW9uID0gbmVlZHNDb25maXJtYXRpb247XG4gICAgfVxuICAgIGlmIChkZXNjcmlwdGlvbiAhPT0gdm9pZCAwKSB7XG4gICAgICByZXN1bHQuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBDaGFuZ2VBbm5vdGF0aW9uMi5jcmVhdGUgPSBjcmVhdGU7XG4gIGZ1bmN0aW9uIGlzKHZhbHVlKSB7XG4gICAgdmFyIGNhbmRpZGF0ZSA9IHZhbHVlO1xuICAgIHJldHVybiBjYW5kaWRhdGUgIT09IHZvaWQgMCAmJiBJcy5vYmplY3RMaXRlcmFsKGNhbmRpZGF0ZSkgJiYgSXMuc3RyaW5nKGNhbmRpZGF0ZS5sYWJlbCkgJiYgKElzLmJvb2xlYW4oY2FuZGlkYXRlLm5lZWRzQ29uZmlybWF0aW9uKSB8fCBjYW5kaWRhdGUubmVlZHNDb25maXJtYXRpb24gPT09IHZvaWQgMCkgJiYgKElzLnN0cmluZyhjYW5kaWRhdGUuZGVzY3JpcHRpb24pIHx8IGNhbmRpZGF0ZS5kZXNjcmlwdGlvbiA9PT0gdm9pZCAwKTtcbiAgfVxuICBDaGFuZ2VBbm5vdGF0aW9uMi5pcyA9IGlzO1xufSkoQ2hhbmdlQW5ub3RhdGlvbiB8fCAoQ2hhbmdlQW5ub3RhdGlvbiA9IHt9KSk7XG52YXIgQ2hhbmdlQW5ub3RhdGlvbklkZW50aWZpZXI7XG4oZnVuY3Rpb24oQ2hhbmdlQW5ub3RhdGlvbklkZW50aWZpZXIyKSB7XG4gIGZ1bmN0aW9uIGlzKHZhbHVlKSB7XG4gICAgdmFyIGNhbmRpZGF0ZSA9IHZhbHVlO1xuICAgIHJldHVybiB0eXBlb2YgY2FuZGlkYXRlID09PSBcInN0cmluZ1wiO1xuICB9XG4gIENoYW5nZUFubm90YXRpb25JZGVudGlmaWVyMi5pcyA9IGlzO1xufSkoQ2hhbmdlQW5ub3RhdGlvbklkZW50aWZpZXIgfHwgKENoYW5nZUFubm90YXRpb25JZGVudGlmaWVyID0ge30pKTtcbnZhciBBbm5vdGF0ZWRUZXh0RWRpdDtcbihmdW5jdGlvbihBbm5vdGF0ZWRUZXh0RWRpdDIpIHtcbiAgZnVuY3Rpb24gcmVwbGFjZShyYW5nZSwgbmV3VGV4dCwgYW5ub3RhdGlvbikge1xuICAgIHJldHVybiB7IHJhbmdlLCBuZXdUZXh0LCBhbm5vdGF0aW9uSWQ6IGFubm90YXRpb24gfTtcbiAgfVxuICBBbm5vdGF0ZWRUZXh0RWRpdDIucmVwbGFjZSA9IHJlcGxhY2U7XG4gIGZ1bmN0aW9uIGluc2VydChwb3NpdGlvbiwgbmV3VGV4dCwgYW5ub3RhdGlvbikge1xuICAgIHJldHVybiB7IHJhbmdlOiB7IHN0YXJ0OiBwb3NpdGlvbiwgZW5kOiBwb3NpdGlvbiB9LCBuZXdUZXh0LCBhbm5vdGF0aW9uSWQ6IGFubm90YXRpb24gfTtcbiAgfVxuICBBbm5vdGF0ZWRUZXh0RWRpdDIuaW5zZXJ0ID0gaW5zZXJ0O1xuICBmdW5jdGlvbiBkZWwocmFuZ2UsIGFubm90YXRpb24pIHtcbiAgICByZXR1cm4geyByYW5nZSwgbmV3VGV4dDogXCJcIiwgYW5ub3RhdGlvbklkOiBhbm5vdGF0aW9uIH07XG4gIH1cbiAgQW5ub3RhdGVkVGV4dEVkaXQyLmRlbCA9IGRlbDtcbiAgZnVuY3Rpb24gaXModmFsdWUpIHtcbiAgICB2YXIgY2FuZGlkYXRlID0gdmFsdWU7XG4gICAgcmV0dXJuIFRleHRFZGl0LmlzKGNhbmRpZGF0ZSkgJiYgKENoYW5nZUFubm90YXRpb24uaXMoY2FuZGlkYXRlLmFubm90YXRpb25JZCkgfHwgQ2hhbmdlQW5ub3RhdGlvbklkZW50aWZpZXIuaXMoY2FuZGlkYXRlLmFubm90YXRpb25JZCkpO1xuICB9XG4gIEFubm90YXRlZFRleHRFZGl0Mi5pcyA9IGlzO1xufSkoQW5ub3RhdGVkVGV4dEVkaXQgfHwgKEFubm90YXRlZFRleHRFZGl0ID0ge30pKTtcbnZhciBUZXh0RG9jdW1lbnRFZGl0O1xuKGZ1bmN0aW9uKFRleHREb2N1bWVudEVkaXQyKSB7XG4gIGZ1bmN0aW9uIGNyZWF0ZSh0ZXh0RG9jdW1lbnQsIGVkaXRzKSB7XG4gICAgcmV0dXJuIHsgdGV4dERvY3VtZW50LCBlZGl0cyB9O1xuICB9XG4gIFRleHREb2N1bWVudEVkaXQyLmNyZWF0ZSA9IGNyZWF0ZTtcbiAgZnVuY3Rpb24gaXModmFsdWUpIHtcbiAgICB2YXIgY2FuZGlkYXRlID0gdmFsdWU7XG4gICAgcmV0dXJuIElzLmRlZmluZWQoY2FuZGlkYXRlKSAmJiBPcHRpb25hbFZlcnNpb25lZFRleHREb2N1bWVudElkZW50aWZpZXIuaXMoY2FuZGlkYXRlLnRleHREb2N1bWVudCkgJiYgQXJyYXkuaXNBcnJheShjYW5kaWRhdGUuZWRpdHMpO1xuICB9XG4gIFRleHREb2N1bWVudEVkaXQyLmlzID0gaXM7XG59KShUZXh0RG9jdW1lbnRFZGl0IHx8IChUZXh0RG9jdW1lbnRFZGl0ID0ge30pKTtcbnZhciBDcmVhdGVGaWxlO1xuKGZ1bmN0aW9uKENyZWF0ZUZpbGUyKSB7XG4gIGZ1bmN0aW9uIGNyZWF0ZSh1cmksIG9wdGlvbnMsIGFubm90YXRpb24pIHtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAga2luZDogXCJjcmVhdGVcIixcbiAgICAgIHVyaVxuICAgIH07XG4gICAgaWYgKG9wdGlvbnMgIT09IHZvaWQgMCAmJiAob3B0aW9ucy5vdmVyd3JpdGUgIT09IHZvaWQgMCB8fCBvcHRpb25zLmlnbm9yZUlmRXhpc3RzICE9PSB2b2lkIDApKSB7XG4gICAgICByZXN1bHQub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuICAgIGlmIChhbm5vdGF0aW9uICE9PSB2b2lkIDApIHtcbiAgICAgIHJlc3VsdC5hbm5vdGF0aW9uSWQgPSBhbm5vdGF0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIENyZWF0ZUZpbGUyLmNyZWF0ZSA9IGNyZWF0ZTtcbiAgZnVuY3Rpb24gaXModmFsdWUpIHtcbiAgICB2YXIgY2FuZGlkYXRlID0gdmFsdWU7XG4gICAgcmV0dXJuIGNhbmRpZGF0ZSAmJiBjYW5kaWRhdGUua2luZCA9PT0gXCJjcmVhdGVcIiAmJiBJcy5zdHJpbmcoY2FuZGlkYXRlLnVyaSkgJiYgKGNhbmRpZGF0ZS5vcHRpb25zID09PSB2b2lkIDAgfHwgKGNhbmRpZGF0ZS5vcHRpb25zLm92ZXJ3cml0ZSA9PT0gdm9pZCAwIHx8IElzLmJvb2xlYW4oY2FuZGlkYXRlLm9wdGlvbnMub3ZlcndyaXRlKSkgJiYgKGNhbmRpZGF0ZS5vcHRpb25zLmlnbm9yZUlmRXhpc3RzID09PSB2b2lkIDAgfHwgSXMuYm9vbGVhbihjYW5kaWRhdGUub3B0aW9ucy5pZ25vcmVJZkV4aXN0cykpKSAmJiAoY2FuZGlkYXRlLmFubm90YXRpb25JZCA9PT0gdm9pZCAwIHx8IENoYW5nZUFubm90YXRpb25JZGVudGlmaWVyLmlzKGNhbmRpZGF0ZS5hbm5vdGF0aW9uSWQpKTtcbiAgfVxuICBDcmVhdGVGaWxlMi5pcyA9IGlzO1xufSkoQ3JlYXRlRmlsZSB8fCAoQ3JlYXRlRmlsZSA9IHt9KSk7XG52YXIgUmVuYW1lRmlsZTtcbihmdW5jdGlvbihSZW5hbWVGaWxlMikge1xuICBmdW5jdGlvbiBjcmVhdGUob2xkVXJpLCBuZXdVcmksIG9wdGlvbnMsIGFubm90YXRpb24pIHtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAga2luZDogXCJyZW5hbWVcIixcbiAgICAgIG9sZFVyaSxcbiAgICAgIG5ld1VyaVxuICAgIH07XG4gICAgaWYgKG9wdGlvbnMgIT09IHZvaWQgMCAmJiAob3B0aW9ucy5vdmVyd3JpdGUgIT09IHZvaWQgMCB8fCBvcHRpb25zLmlnbm9yZUlmRXhpc3RzICE9PSB2b2lkIDApKSB7XG4gICAgICByZXN1bHQub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuICAgIGlmIChhbm5vdGF0aW9uICE9PSB2b2lkIDApIHtcbiAgICAgIHJlc3VsdC5hbm5vdGF0aW9uSWQgPSBhbm5vdGF0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIFJlbmFtZUZpbGUyLmNyZWF0ZSA9IGNyZWF0ZTtcbiAgZnVuY3Rpb24gaXModmFsdWUpIHtcbiAgICB2YXIgY2FuZGlkYXRlID0gdmFsdWU7XG4gICAgcmV0dXJuIGNhbmRpZGF0ZSAmJiBjYW5kaWRhdGUua2luZCA9PT0gXCJyZW5hbWVcIiAmJiBJcy5zdHJpbmcoY2FuZGlkYXRlLm9sZFVyaSkgJiYgSXMuc3RyaW5nKGNhbmRpZGF0ZS5uZXdVcmkpICYmIChjYW5kaWRhdGUub3B0aW9ucyA9PT0gdm9pZCAwIHx8IChjYW5kaWRhdGUub3B0aW9ucy5vdmVyd3JpdGUgPT09IHZvaWQgMCB8fCBJcy5ib29sZWFuKGNhbmRpZGF0ZS5vcHRpb25zLm92ZXJ3cml0ZSkpICYmIChjYW5kaWRhdGUub3B0aW9ucy5pZ25vcmVJZkV4aXN0cyA9PT0gdm9pZCAwIHx8IElzLmJvb2xlYW4oY2FuZGlkYXRlLm9wdGlvbnMuaWdub3JlSWZFeGlzdHMpKSkgJiYgKGNhbmRpZGF0ZS5hbm5vdGF0aW9uSWQgPT09IHZvaWQgMCB8fCBDaGFuZ2VBbm5vdGF0aW9uSWRlbnRpZmllci5pcyhjYW5kaWRhdGUuYW5ub3RhdGlvbklkKSk7XG4gIH1cbiAgUmVuYW1lRmlsZTIuaXMgPSBpcztcbn0pKFJlbmFtZUZpbGUgfHwgKFJlbmFtZUZpbGUgPSB7fSkpO1xudmFyIERlbGV0ZUZpbGU7XG4oZnVuY3Rpb24oRGVsZXRlRmlsZTIpIHtcbiAgZnVuY3Rpb24gY3JlYXRlKHVyaSwgb3B0aW9ucywgYW5ub3RhdGlvbikge1xuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICBraW5kOiBcImRlbGV0ZVwiLFxuICAgICAgdXJpXG4gICAgfTtcbiAgICBpZiAob3B0aW9ucyAhPT0gdm9pZCAwICYmIChvcHRpb25zLnJlY3Vyc2l2ZSAhPT0gdm9pZCAwIHx8IG9wdGlvbnMuaWdub3JlSWZOb3RFeGlzdHMgIT09IHZvaWQgMCkpIHtcbiAgICAgIHJlc3VsdC5vcHRpb25zID0gb3B0aW9ucztcbiAgICB9XG4gICAgaWYgKGFubm90YXRpb24gIT09IHZvaWQgMCkge1xuICAgICAgcmVzdWx0LmFubm90YXRpb25JZCA9IGFubm90YXRpb247XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgRGVsZXRlRmlsZTIuY3JlYXRlID0gY3JlYXRlO1xuICBmdW5jdGlvbiBpcyh2YWx1ZSkge1xuICAgIHZhciBjYW5kaWRhdGUgPSB2YWx1ZTtcbiAgICByZXR1cm4gY2FuZGlkYXRlICYmIGNhbmRpZGF0ZS5raW5kID09PSBcImRlbGV0ZVwiICYmIElzLnN0cmluZyhjYW5kaWRhdGUudXJpKSAmJiAoY2FuZGlkYXRlLm9wdGlvbnMgPT09IHZvaWQgMCB8fCAoY2FuZGlkYXRlLm9wdGlvbnMucmVjdXJzaXZlID09PSB2b2lkIDAgfHwgSXMuYm9vbGVhbihjYW5kaWRhdGUub3B0aW9ucy5yZWN1cnNpdmUpKSAmJiAoY2FuZGlkYXRlLm9wdGlvbnMuaWdub3JlSWZOb3RFeGlzdHMgPT09IHZvaWQgMCB8fCBJcy5ib29sZWFuKGNhbmRpZGF0ZS5vcHRpb25zLmlnbm9yZUlmTm90RXhpc3RzKSkpICYmIChjYW5kaWRhdGUuYW5ub3RhdGlvbklkID09PSB2b2lkIDAgfHwgQ2hhbmdlQW5ub3RhdGlvbklkZW50aWZpZXIuaXMoY2FuZGlkYXRlLmFubm90YXRpb25JZCkpO1xuICB9XG4gIERlbGV0ZUZpbGUyLmlzID0gaXM7XG59KShEZWxldGVGaWxlIHx8IChEZWxldGVGaWxlID0ge30pKTtcbnZhciBXb3Jrc3BhY2VFZGl0O1xuKGZ1bmN0aW9uKFdvcmtzcGFjZUVkaXQyKSB7XG4gIGZ1bmN0aW9uIGlzKHZhbHVlKSB7XG4gICAgdmFyIGNhbmRpZGF0ZSA9IHZhbHVlO1xuICAgIHJldHVybiBjYW5kaWRhdGUgJiYgKGNhbmRpZGF0ZS5jaGFuZ2VzICE9PSB2b2lkIDAgfHwgY2FuZGlkYXRlLmRvY3VtZW50Q2hhbmdlcyAhPT0gdm9pZCAwKSAmJiAoY2FuZGlkYXRlLmRvY3VtZW50Q2hhbmdlcyA9PT0gdm9pZCAwIHx8IGNhbmRpZGF0ZS5kb2N1bWVudENoYW5nZXMuZXZlcnkoZnVuY3Rpb24oY2hhbmdlKSB7XG4gICAgICBpZiAoSXMuc3RyaW5nKGNoYW5nZS5raW5kKSkge1xuICAgICAgICByZXR1cm4gQ3JlYXRlRmlsZS5pcyhjaGFuZ2UpIHx8IFJlbmFtZUZpbGUuaXMoY2hhbmdlKSB8fCBEZWxldGVGaWxlLmlzKGNoYW5nZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gVGV4dERvY3VtZW50RWRpdC5pcyhjaGFuZ2UpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxuICBXb3Jrc3BhY2VFZGl0Mi5pcyA9IGlzO1xufSkoV29ya3NwYWNlRWRpdCB8fCAoV29ya3NwYWNlRWRpdCA9IHt9KSk7XG52YXIgVGV4dEVkaXRDaGFuZ2VJbXBsID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFRleHRFZGl0Q2hhbmdlSW1wbDIoZWRpdHMsIGNoYW5nZUFubm90YXRpb25zKSB7XG4gICAgdGhpcy5lZGl0cyA9IGVkaXRzO1xuICAgIHRoaXMuY2hhbmdlQW5ub3RhdGlvbnMgPSBjaGFuZ2VBbm5vdGF0aW9ucztcbiAgfVxuICBUZXh0RWRpdENoYW5nZUltcGwyLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihwb3NpdGlvbiwgbmV3VGV4dCwgYW5ub3RhdGlvbikge1xuICAgIHZhciBlZGl0O1xuICAgIHZhciBpZDtcbiAgICBpZiAoYW5ub3RhdGlvbiA9PT0gdm9pZCAwKSB7XG4gICAgICBlZGl0ID0gVGV4dEVkaXQuaW5zZXJ0KHBvc2l0aW9uLCBuZXdUZXh0KTtcbiAgICB9IGVsc2UgaWYgKENoYW5nZUFubm90YXRpb25JZGVudGlmaWVyLmlzKGFubm90YXRpb24pKSB7XG4gICAgICBpZCA9IGFubm90YXRpb247XG4gICAgICBlZGl0ID0gQW5ub3RhdGVkVGV4dEVkaXQuaW5zZXJ0KHBvc2l0aW9uLCBuZXdUZXh0LCBhbm5vdGF0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hc3NlcnRDaGFuZ2VBbm5vdGF0aW9ucyh0aGlzLmNoYW5nZUFubm90YXRpb25zKTtcbiAgICAgIGlkID0gdGhpcy5jaGFuZ2VBbm5vdGF0aW9ucy5tYW5hZ2UoYW5ub3RhdGlvbik7XG4gICAgICBlZGl0ID0gQW5ub3RhdGVkVGV4dEVkaXQuaW5zZXJ0KHBvc2l0aW9uLCBuZXdUZXh0LCBpZCk7XG4gICAgfVxuICAgIHRoaXMuZWRpdHMucHVzaChlZGl0KTtcbiAgICBpZiAoaWQgIT09IHZvaWQgMCkge1xuICAgICAgcmV0dXJuIGlkO1xuICAgIH1cbiAgfTtcbiAgVGV4dEVkaXRDaGFuZ2VJbXBsMi5wcm90b3R5cGUucmVwbGFjZSA9IGZ1bmN0aW9uKHJhbmdlLCBuZXdUZXh0LCBhbm5vdGF0aW9uKSB7XG4gICAgdmFyIGVkaXQ7XG4gICAgdmFyIGlkO1xuICAgIGlmIChhbm5vdGF0aW9uID09PSB2b2lkIDApIHtcbiAgICAgIGVkaXQgPSBUZXh0RWRpdC5yZXBsYWNlKHJhbmdlLCBuZXdUZXh0KTtcbiAgICB9IGVsc2UgaWYgKENoYW5nZUFubm90YXRpb25JZGVudGlmaWVyLmlzKGFubm90YXRpb24pKSB7XG4gICAgICBpZCA9IGFubm90YXRpb247XG4gICAgICBlZGl0ID0gQW5ub3RhdGVkVGV4dEVkaXQucmVwbGFjZShyYW5nZSwgbmV3VGV4dCwgYW5ub3RhdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXNzZXJ0Q2hhbmdlQW5ub3RhdGlvbnModGhpcy5jaGFuZ2VBbm5vdGF0aW9ucyk7XG4gICAgICBpZCA9IHRoaXMuY2hhbmdlQW5ub3RhdGlvbnMubWFuYWdlKGFubm90YXRpb24pO1xuICAgICAgZWRpdCA9IEFubm90YXRlZFRleHRFZGl0LnJlcGxhY2UocmFuZ2UsIG5ld1RleHQsIGlkKTtcbiAgICB9XG4gICAgdGhpcy5lZGl0cy5wdXNoKGVkaXQpO1xuICAgIGlmIChpZCAhPT0gdm9pZCAwKSB7XG4gICAgICByZXR1cm4gaWQ7XG4gICAgfVxuICB9O1xuICBUZXh0RWRpdENoYW5nZUltcGwyLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbihyYW5nZSwgYW5ub3RhdGlvbikge1xuICAgIHZhciBlZGl0O1xuICAgIHZhciBpZDtcbiAgICBpZiAoYW5ub3RhdGlvbiA9PT0gdm9pZCAwKSB7XG4gICAgICBlZGl0ID0gVGV4dEVkaXQuZGVsKHJhbmdlKTtcbiAgICB9IGVsc2UgaWYgKENoYW5nZUFubm90YXRpb25JZGVudGlmaWVyLmlzKGFubm90YXRpb24pKSB7XG4gICAgICBpZCA9IGFubm90YXRpb247XG4gICAgICBlZGl0ID0gQW5ub3RhdGVkVGV4dEVkaXQuZGVsKHJhbmdlLCBhbm5vdGF0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hc3NlcnRDaGFuZ2VBbm5vdGF0aW9ucyh0aGlzLmNoYW5nZUFubm90YXRpb25zKTtcbiAgICAgIGlkID0gdGhpcy5jaGFuZ2VBbm5vdGF0aW9ucy5tYW5hZ2UoYW5ub3RhdGlvbik7XG4gICAgICBlZGl0ID0gQW5ub3RhdGVkVGV4dEVkaXQuZGVsKHJhbmdlLCBpZCk7XG4gICAgfVxuICAgIHRoaXMuZWRpdHMucHVzaChlZGl0KTtcbiAgICBpZiAoaWQgIT09IHZvaWQgMCkge1xuICAgICAgcmV0dXJuIGlkO1xuICAgIH1cbiAgfTtcbiAgVGV4dEVkaXRDaGFuZ2VJbXBsMi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oZWRpdCkge1xuICAgIHRoaXMuZWRpdHMucHVzaChlZGl0KTtcbiAgfTtcbiAgVGV4dEVkaXRDaGFuZ2VJbXBsMi5wcm90b3R5cGUuYWxsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdHM7XG4gIH07XG4gIFRleHRFZGl0Q2hhbmdlSW1wbDIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lZGl0cy5zcGxpY2UoMCwgdGhpcy5lZGl0cy5sZW5ndGgpO1xuICB9O1xuICBUZXh0RWRpdENoYW5nZUltcGwyLnByb3RvdHlwZS5hc3NlcnRDaGFuZ2VBbm5vdGF0aW9ucyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlRleHQgZWRpdCBjaGFuZ2UgaXMgbm90IGNvbmZpZ3VyZWQgdG8gbWFuYWdlIGNoYW5nZSBhbm5vdGF0aW9ucy5cIik7XG4gICAgfVxuICB9O1xuICByZXR1cm4gVGV4dEVkaXRDaGFuZ2VJbXBsMjtcbn0oKTtcbnZhciBDaGFuZ2VBbm5vdGF0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBDaGFuZ2VBbm5vdGF0aW9uczIoYW5ub3RhdGlvbnMpIHtcbiAgICB0aGlzLl9hbm5vdGF0aW9ucyA9IGFubm90YXRpb25zID09PSB2b2lkIDAgPyAvKiBAX19QVVJFX18gKi8gT2JqZWN0LmNyZWF0ZShudWxsKSA6IGFubm90YXRpb25zO1xuICAgIHRoaXMuX2NvdW50ZXIgPSAwO1xuICAgIHRoaXMuX3NpemUgPSAwO1xuICB9XG4gIENoYW5nZUFubm90YXRpb25zMi5wcm90b3R5cGUuYWxsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Fubm90YXRpb25zO1xuICB9O1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ2hhbmdlQW5ub3RhdGlvbnMyLnByb3RvdHlwZSwgXCJzaXplXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NpemU7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIENoYW5nZUFubm90YXRpb25zMi5wcm90b3R5cGUubWFuYWdlID0gZnVuY3Rpb24oaWRPckFubm90YXRpb24sIGFubm90YXRpb24pIHtcbiAgICB2YXIgaWQ7XG4gICAgaWYgKENoYW5nZUFubm90YXRpb25JZGVudGlmaWVyLmlzKGlkT3JBbm5vdGF0aW9uKSkge1xuICAgICAgaWQgPSBpZE9yQW5ub3RhdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWQgPSB0aGlzLm5leHRJZCgpO1xuICAgICAgYW5ub3RhdGlvbiA9IGlkT3JBbm5vdGF0aW9uO1xuICAgIH1cbiAgICBpZiAodGhpcy5fYW5ub3RhdGlvbnNbaWRdICE9PSB2b2lkIDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIklkIFwiICsgaWQgKyBcIiBpcyBhbHJlYWR5IGluIHVzZS5cIik7XG4gICAgfVxuICAgIGlmIChhbm5vdGF0aW9uID09PSB2b2lkIDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGFubm90YXRpb24gcHJvdmlkZWQgZm9yIGlkIFwiICsgaWQpO1xuICAgIH1cbiAgICB0aGlzLl9hbm5vdGF0aW9uc1tpZF0gPSBhbm5vdGF0aW9uO1xuICAgIHRoaXMuX3NpemUrKztcbiAgICByZXR1cm4gaWQ7XG4gIH07XG4gIENoYW5nZUFubm90YXRpb25zMi5wcm90b3R5cGUubmV4dElkID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fY291bnRlcisrO1xuICAgIHJldHVybiB0aGlzLl9jb3VudGVyLnRvU3RyaW5nKCk7XG4gIH07XG4gIHJldHVybiBDaGFuZ2VBbm5vdGF0aW9uczI7XG59KCk7XG52YXIgV29ya3NwYWNlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFdvcmtzcGFjZUNoYW5nZTIod29ya3NwYWNlRWRpdCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdGhpcy5fdGV4dEVkaXRDaGFuZ2VzID0gLyogQF9fUFVSRV9fICovIE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgaWYgKHdvcmtzcGFjZUVkaXQgIT09IHZvaWQgMCkge1xuICAgICAgdGhpcy5fd29ya3NwYWNlRWRpdCA9IHdvcmtzcGFjZUVkaXQ7XG4gICAgICBpZiAod29ya3NwYWNlRWRpdC5kb2N1bWVudENoYW5nZXMpIHtcbiAgICAgICAgdGhpcy5fY2hhbmdlQW5ub3RhdGlvbnMgPSBuZXcgQ2hhbmdlQW5ub3RhdGlvbnMod29ya3NwYWNlRWRpdC5jaGFuZ2VBbm5vdGF0aW9ucyk7XG4gICAgICAgIHdvcmtzcGFjZUVkaXQuY2hhbmdlQW5ub3RhdGlvbnMgPSB0aGlzLl9jaGFuZ2VBbm5vdGF0aW9ucy5hbGwoKTtcbiAgICAgICAgd29ya3NwYWNlRWRpdC5kb2N1bWVudENoYW5nZXMuZm9yRWFjaChmdW5jdGlvbihjaGFuZ2UpIHtcbiAgICAgICAgICBpZiAoVGV4dERvY3VtZW50RWRpdC5pcyhjaGFuZ2UpKSB7XG4gICAgICAgICAgICB2YXIgdGV4dEVkaXRDaGFuZ2UgPSBuZXcgVGV4dEVkaXRDaGFuZ2VJbXBsKGNoYW5nZS5lZGl0cywgX3RoaXMuX2NoYW5nZUFubm90YXRpb25zKTtcbiAgICAgICAgICAgIF90aGlzLl90ZXh0RWRpdENoYW5nZXNbY2hhbmdlLnRleHREb2N1bWVudC51cmldID0gdGV4dEVkaXRDaGFuZ2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAod29ya3NwYWNlRWRpdC5jaGFuZ2VzKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHdvcmtzcGFjZUVkaXQuY2hhbmdlcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICB2YXIgdGV4dEVkaXRDaGFuZ2UgPSBuZXcgVGV4dEVkaXRDaGFuZ2VJbXBsKHdvcmtzcGFjZUVkaXQuY2hhbmdlc1trZXldKTtcbiAgICAgICAgICBfdGhpcy5fdGV4dEVkaXRDaGFuZ2VzW2tleV0gPSB0ZXh0RWRpdENoYW5nZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3dvcmtzcGFjZUVkaXQgPSB7fTtcbiAgICB9XG4gIH1cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdvcmtzcGFjZUNoYW5nZTIucHJvdG90eXBlLCBcImVkaXRcIiwge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmluaXREb2N1bWVudENoYW5nZXMoKTtcbiAgICAgIGlmICh0aGlzLl9jaGFuZ2VBbm5vdGF0aW9ucyAhPT0gdm9pZCAwKSB7XG4gICAgICAgIGlmICh0aGlzLl9jaGFuZ2VBbm5vdGF0aW9ucy5zaXplID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5fd29ya3NwYWNlRWRpdC5jaGFuZ2VBbm5vdGF0aW9ucyA9IHZvaWQgMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl93b3Jrc3BhY2VFZGl0LmNoYW5nZUFubm90YXRpb25zID0gdGhpcy5fY2hhbmdlQW5ub3RhdGlvbnMuYWxsKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl93b3Jrc3BhY2VFZGl0O1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBXb3Jrc3BhY2VDaGFuZ2UyLnByb3RvdHlwZS5nZXRUZXh0RWRpdENoYW5nZSA9IGZ1bmN0aW9uKGtleSkge1xuICAgIGlmIChPcHRpb25hbFZlcnNpb25lZFRleHREb2N1bWVudElkZW50aWZpZXIuaXMoa2V5KSkge1xuICAgICAgdGhpcy5pbml0RG9jdW1lbnRDaGFuZ2VzKCk7XG4gICAgICBpZiAodGhpcy5fd29ya3NwYWNlRWRpdC5kb2N1bWVudENoYW5nZXMgPT09IHZvaWQgMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXb3Jrc3BhY2UgZWRpdCBpcyBub3QgY29uZmlndXJlZCBmb3IgZG9jdW1lbnQgY2hhbmdlcy5cIik7XG4gICAgICB9XG4gICAgICB2YXIgdGV4dERvY3VtZW50ID0geyB1cmk6IGtleS51cmksIHZlcnNpb246IGtleS52ZXJzaW9uIH07XG4gICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fdGV4dEVkaXRDaGFuZ2VzW3RleHREb2N1bWVudC51cmldO1xuICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgdmFyIGVkaXRzID0gW107XG4gICAgICAgIHZhciB0ZXh0RG9jdW1lbnRFZGl0ID0ge1xuICAgICAgICAgIHRleHREb2N1bWVudCxcbiAgICAgICAgICBlZGl0c1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl93b3Jrc3BhY2VFZGl0LmRvY3VtZW50Q2hhbmdlcy5wdXNoKHRleHREb2N1bWVudEVkaXQpO1xuICAgICAgICByZXN1bHQgPSBuZXcgVGV4dEVkaXRDaGFuZ2VJbXBsKGVkaXRzLCB0aGlzLl9jaGFuZ2VBbm5vdGF0aW9ucyk7XG4gICAgICAgIHRoaXMuX3RleHRFZGl0Q2hhbmdlc1t0ZXh0RG9jdW1lbnQudXJpXSA9IHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5pdENoYW5nZXMoKTtcbiAgICAgIGlmICh0aGlzLl93b3Jrc3BhY2VFZGl0LmNoYW5nZXMgPT09IHZvaWQgMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXb3Jrc3BhY2UgZWRpdCBpcyBub3QgY29uZmlndXJlZCBmb3Igbm9ybWFsIHRleHQgZWRpdCBjaGFuZ2VzLlwiKTtcbiAgICAgIH1cbiAgICAgIHZhciByZXN1bHQgPSB0aGlzLl90ZXh0RWRpdENoYW5nZXNba2V5XTtcbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIHZhciBlZGl0cyA9IFtdO1xuICAgICAgICB0aGlzLl93b3Jrc3BhY2VFZGl0LmNoYW5nZXNba2V5XSA9IGVkaXRzO1xuICAgICAgICByZXN1bHQgPSBuZXcgVGV4dEVkaXRDaGFuZ2VJbXBsKGVkaXRzKTtcbiAgICAgICAgdGhpcy5fdGV4dEVkaXRDaGFuZ2VzW2tleV0gPSByZXN1bHQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfTtcbiAgV29ya3NwYWNlQ2hhbmdlMi5wcm90b3R5cGUuaW5pdERvY3VtZW50Q2hhbmdlcyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLl93b3Jrc3BhY2VFZGl0LmRvY3VtZW50Q2hhbmdlcyA9PT0gdm9pZCAwICYmIHRoaXMuX3dvcmtzcGFjZUVkaXQuY2hhbmdlcyA9PT0gdm9pZCAwKSB7XG4gICAgICB0aGlzLl9jaGFuZ2VBbm5vdGF0aW9ucyA9IG5ldyBDaGFuZ2VBbm5vdGF0aW9ucygpO1xuICAgICAgdGhpcy5fd29ya3NwYWNlRWRpdC5kb2N1bWVudENoYW5nZXMgPSBbXTtcbiAgICAgIHRoaXMuX3dvcmtzcGFjZUVkaXQuY2hhbmdlQW5ub3RhdGlvbnMgPSB0aGlzLl9jaGFuZ2VBbm5vdGF0aW9ucy5hbGwoKTtcbiAgICB9XG4gIH07XG4gIFdvcmtzcGFjZUNoYW5nZTIucHJvdG90eXBlLmluaXRDaGFuZ2VzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuX3dvcmtzcGFjZUVkaXQuZG9jdW1lbnRDaGFuZ2VzID09PSB2b2lkIDAgJiYgdGhpcy5fd29ya3NwYWNlRWRpdC5jaGFuZ2VzID09PSB2b2lkIDApIHtcbiAgICAgIHRoaXMuX3dvcmtzcGFjZUVkaXQuY2hhbmdlcyA9IC8qIEBfX1BVUkVfXyAqLyBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIH1cbiAgfTtcbiAgV29ya3NwYWNlQ2hhbmdlMi5wcm90b3R5cGUuY3JlYXRlRmlsZSA9IGZ1bmN0aW9uKHVyaSwgb3B0aW9uc09yQW5ub3RhdGlvbiwgb3B0aW9ucykge1xuICAgIHRoaXMuaW5pdERvY3VtZW50Q2hhbmdlcygpO1xuICAgIGlmICh0aGlzLl93b3Jrc3BhY2VFZGl0LmRvY3VtZW50Q2hhbmdlcyA9PT0gdm9pZCAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXb3Jrc3BhY2UgZWRpdCBpcyBub3QgY29uZmlndXJlZCBmb3IgZG9jdW1lbnQgY2hhbmdlcy5cIik7XG4gICAgfVxuICAgIHZhciBhbm5vdGF0aW9uO1xuICAgIGlmIChDaGFuZ2VBbm5vdGF0aW9uLmlzKG9wdGlvbnNPckFubm90YXRpb24pIHx8IENoYW5nZUFubm90YXRpb25JZGVudGlmaWVyLmlzKG9wdGlvbnNPckFubm90YXRpb24pKSB7XG4gICAgICBhbm5vdGF0aW9uID0gb3B0aW9uc09yQW5ub3RhdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnNPckFubm90YXRpb247XG4gICAgfVxuICAgIHZhciBvcGVyYXRpb247XG4gICAgdmFyIGlkO1xuICAgIGlmIChhbm5vdGF0aW9uID09PSB2b2lkIDApIHtcbiAgICAgIG9wZXJhdGlvbiA9IENyZWF0ZUZpbGUuY3JlYXRlKHVyaSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkID0gQ2hhbmdlQW5ub3RhdGlvbklkZW50aWZpZXIuaXMoYW5ub3RhdGlvbikgPyBhbm5vdGF0aW9uIDogdGhpcy5fY2hhbmdlQW5ub3RhdGlvbnMubWFuYWdlKGFubm90YXRpb24pO1xuICAgICAgb3BlcmF0aW9uID0gQ3JlYXRlRmlsZS5jcmVhdGUodXJpLCBvcHRpb25zLCBpZCk7XG4gICAgfVxuICAgIHRoaXMuX3dvcmtzcGFjZUVkaXQuZG9jdW1lbnRDaGFuZ2VzLnB1c2gob3BlcmF0aW9uKTtcbiAgICBpZiAoaWQgIT09IHZvaWQgMCkge1xuICAgICAgcmV0dXJuIGlkO1xuICAgIH1cbiAgfTtcbiAgV29ya3NwYWNlQ2hhbmdlMi5wcm90b3R5cGUucmVuYW1lRmlsZSA9IGZ1bmN0aW9uKG9sZFVyaSwgbmV3VXJpLCBvcHRpb25zT3JBbm5vdGF0aW9uLCBvcHRpb25zKSB7XG4gICAgdGhpcy5pbml0RG9jdW1lbnRDaGFuZ2VzKCk7XG4gICAgaWYgKHRoaXMuX3dvcmtzcGFjZUVkaXQuZG9jdW1lbnRDaGFuZ2VzID09PSB2b2lkIDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIldvcmtzcGFjZSBlZGl0IGlzIG5vdCBjb25maWd1cmVkIGZvciBkb2N1bWVudCBjaGFuZ2VzLlwiKTtcbiAgICB9XG4gICAgdmFyIGFubm90YXRpb247XG4gICAgaWYgKENoYW5nZUFubm90YXRpb24uaXMob3B0aW9uc09yQW5ub3RhdGlvbikgfHwgQ2hhbmdlQW5ub3RhdGlvbklkZW50aWZpZXIuaXMob3B0aW9uc09yQW5ub3RhdGlvbikpIHtcbiAgICAgIGFubm90YXRpb24gPSBvcHRpb25zT3JBbm5vdGF0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9uc09yQW5ub3RhdGlvbjtcbiAgICB9XG4gICAgdmFyIG9wZXJhdGlvbjtcbiAgICB2YXIgaWQ7XG4gICAgaWYgKGFubm90YXRpb24gPT09IHZvaWQgMCkge1xuICAgICAgb3BlcmF0aW9uID0gUmVuYW1lRmlsZS5jcmVhdGUob2xkVXJpLCBuZXdVcmksIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZCA9IENoYW5nZUFubm90YXRpb25JZGVudGlmaWVyLmlzKGFubm90YXRpb24pID8gYW5ub3RhdGlvbiA6IHRoaXMuX2NoYW5nZUFubm90YXRpb25zLm1hbmFnZShhbm5vdGF0aW9uKTtcbiAgICAgIG9wZXJhdGlvbiA9IFJlbmFtZUZpbGUuY3JlYXRlKG9sZFVyaSwgbmV3VXJpLCBvcHRpb25zLCBpZCk7XG4gICAgfVxuICAgIHRoaXMuX3dvcmtzcGFjZUVkaXQuZG9jdW1lbnRDaGFuZ2VzLnB1c2gob3BlcmF0aW9uKTtcbiAgICBpZiAoaWQgIT09IHZvaWQgMCkge1xuICAgICAgcmV0dXJuIGlkO1xuICAgIH1cbiAgfTtcbiAgV29ya3NwYWNlQ2hhbmdlMi5wcm90b3R5cGUuZGVsZXRlRmlsZSA9IGZ1bmN0aW9uKHVyaSwgb3B0aW9uc09yQW5ub3RhdGlvbiwgb3B0aW9ucykge1xuICAgIHRoaXMuaW5pdERvY3VtZW50Q2hhbmdlcygpO1xuICAgIGlmICh0aGlzLl93b3Jrc3BhY2VFZGl0LmRvY3VtZW50Q2hhbmdlcyA9PT0gdm9pZCAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXb3Jrc3BhY2UgZWRpdCBpcyBub3QgY29uZmlndXJlZCBmb3IgZG9jdW1lbnQgY2hhbmdlcy5cIik7XG4gICAgfVxuICAgIHZhciBhbm5vdGF0aW9uO1xuICAgIGlmIChDaGFuZ2VBbm5vdGF0aW9uLmlzKG9wdGlvbnNPckFubm90YXRpb24pIHx8IENoYW5nZUFubm90YXRpb25JZGVudGlmaWVyLmlzKG9wdGlvbnNPckFubm90YXRpb24pKSB7XG4gICAgICBhbm5vdGF0aW9uID0gb3B0aW9uc09yQW5ub3RhdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnNPckFubm90YXRpb247XG4gICAgfVxuICAgIHZhciBvcGVyYXRpb247XG4gICAgdmFyIGlkO1xuICAgIGlmIChhbm5vdGF0aW9uID09PSB2b2lkIDApIHtcbiAgICAgIG9wZXJhdGlvbiA9IERlbGV0ZUZpbGUuY3JlYXRlKHVyaSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkID0gQ2hhbmdlQW5ub3RhdGlvbklkZW50aWZpZXIuaXMoYW5ub3RhdGlvbikgPyBhbm5vdGF0aW9uIDogdGhpcy5fY2hhbmdlQW5ub3RhdGlvbnMubWFuYWdlKGFubm90YXRpb24pO1xuICAgICAgb3BlcmF0aW9uID0gRGVsZXRlRmlsZS5jcmVhdGUodXJpLCBvcHRpb25zLCBpZCk7XG4gICAgfVxuICAgIHRoaXMuX3dvcmtzcGFjZUVkaXQuZG9jdW1lbnRDaGFuZ2VzLnB1c2gob3BlcmF0aW9uKTtcbiAgICBpZiAoaWQgIT09IHZvaWQgMCkge1xuICAgICAgcmV0dXJuIGlkO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIFdvcmtzcGFjZUNoYW5nZTI7XG59KCk7XG52YXIgVGV4dERvY3VtZW50SWRlbnRpZmllcjtcbihmdW5jdGlvbihUZXh0RG9jdW1lbnRJZGVudGlmaWVyMikge1xuICBmdW5jdGlvbiBjcmVhdGUodXJpKSB7XG4gICAgcmV0dXJuIHsgdXJpIH07XG4gIH1cbiAgVGV4dERvY3VtZW50SWRlbnRpZmllcjIuY3JlYXRlID0gY3JlYXRlO1xuICBmdW5jdGlvbiBpcyh2YWx1ZSkge1xuICAgIHZhciBjYW5kaWRhdGUgPSB2YWx1ZTtcbiAgICByZXR1cm4gSXMuZGVmaW5lZChjYW5kaWRhdGUpICYmIElzLnN0cmluZyhjYW5kaWRhdGUudXJpKTtcbiAgfVxuICBUZXh0RG9jdW1lbnRJZGVudGlmaWVyMi5pcyA9IGlzO1xufSkoVGV4dERvY3VtZW50SWRlbnRpZmllciB8fCAoVGV4dERvY3VtZW50SWRlbnRpZmllciA9IHt9KSk7XG52YXIgVmVyc2lvbmVkVGV4dERvY3VtZW50SWRlbnRpZmllcjtcbihmdW5jdGlvbihWZXJzaW9uZWRUZXh0RG9jdW1lbnRJZGVudGlmaWVyMikge1xuICBmdW5jdGlvbiBjcmVhdGUodXJpLCB2ZXJzaW9uKSB7XG4gICAgcmV0dXJuIHsgdXJpLCB2ZXJzaW9uIH07XG4gIH1cbiAgVmVyc2lvbmVkVGV4dERvY3VtZW50SWRlbnRpZmllcjIuY3JlYXRlID0gY3JlYXRlO1xuICBmdW5jdGlvbiBpcyh2YWx1ZSkge1xuICAgIHZhciBjYW5kaWRhdGUgPSB2YWx1ZTtcbiAgICByZXR1cm4gSXMuZGVmaW5lZChjYW5kaWRhdGUpICYmIElzLnN0cmluZyhjYW5kaWRhdGUudXJpKSAmJiBJcy5pbnRlZ2VyKGNhbmRpZGF0ZS52ZXJzaW9uKTtcbiAgfVxuICBWZXJzaW9uZWRUZXh0RG9jdW1lbnRJZGVudGlmaWVyMi5pcyA9IGlzO1xufSkoVmVyc2lvbmVkVGV4dERvY3VtZW50SWRlbnRpZmllciB8fCAoVmVyc2lvbmVkVGV4dERvY3VtZW50SWRlbnRpZmllciA9IHt9KSk7XG52YXIgT3B0aW9uYWxWZXJzaW9uZWRUZXh0RG9jdW1lbnRJZGVudGlmaWVyO1xuKGZ1bmN0aW9uKE9wdGlvbmFsVmVyc2lvbmVkVGV4dERvY3VtZW50SWRlbnRpZmllcjIpIHtcbiAgZnVuY3Rpb24gY3JlYXRlKHVyaSwgdmVyc2lvbikge1xuICAgIHJldHVybiB7IHVyaSwgdmVyc2lvbiB9O1xuICB9XG4gIE9wdGlvbmFsVmVyc2lvbmVkVGV4dERvY3VtZW50SWRlbnRpZmllcjIuY3JlYXRlID0gY3JlYXRlO1xuICBmdW5jdGlvbiBpcyh2YWx1ZSkge1xuICAgIHZhciBjYW5kaWRhdGUgPSB2YWx1ZTtcbiAgICByZXR1cm4gSXMuZGVmaW5lZChjYW5kaWRhdGUpICYmIElzLnN0cmluZyhjYW5kaWRhdGUudXJpKSAmJiAoY2FuZGlkYXRlLnZlcnNpb24gPT09IG51bGwgfHwgSXMuaW50ZWdlcihjYW5kaWRhdGUudmVyc2lvbikpO1xuICB9XG4gIE9wdGlvbmFsVmVyc2lvbmVkVGV4dERvY3VtZW50SWRlbnRpZmllcjIuaXMgPSBpcztcbn0pKE9wdGlvbmFsVmVyc2lvbmVkVGV4dERvY3VtZW50SWRlbnRpZmllciB8fCAoT3B0aW9uYWxWZXJzaW9uZWRUZXh0RG9jdW1lbnRJZGVudGlmaWVyID0ge30pKTtcbnZhciBUZXh0RG9jdW1lbnRJdGVtO1xuKGZ1bmN0aW9uKFRleHREb2N1bWVudEl0ZW0yKSB7XG4gIGZ1bmN0aW9uIGNyZWF0ZSh1cmksIGxhbmd1YWdlSWQsIHZlcnNpb24sIHRleHQpIHtcbiAgICByZXR1cm4geyB1cmksIGxhbmd1YWdlSWQsIHZlcnNpb24sIHRleHQgfTtcbiAgfVxuICBUZXh0RG9jdW1lbnRJdGVtMi5jcmVhdGUgPSBjcmVhdGU7XG4gIGZ1bmN0aW9uIGlzKHZhbHVlKSB7XG4gICAgdmFyIGNhbmRpZGF0ZSA9IHZhbHVlO1xuICAgIHJldHVybiBJcy5kZWZpbmVkKGNhbmRpZGF0ZSkgJiYgSXMuc3RyaW5nKGNhbmRpZGF0ZS51cmkpICYmIElzLnN0cmluZyhjYW5kaWRhdGUubGFuZ3VhZ2VJZCkgJiYgSXMuaW50ZWdlcihjYW5kaWRhdGUudmVyc2lvbikgJiYgSXMuc3RyaW5nKGNhbmRpZGF0ZS50ZXh0KTtcbiAgfVxuICBUZXh0RG9jdW1lbnRJdGVtMi5pcyA9IGlzO1xufSkoVGV4dERvY3VtZW50SXRlbSB8fCAoVGV4dERvY3VtZW50SXRlbSA9IHt9KSk7XG52YXIgTWFya3VwS2luZDtcbihmdW5jdGlvbihNYXJrdXBLaW5kMikge1xuICBNYXJrdXBLaW5kMi5QbGFpblRleHQgPSBcInBsYWludGV4dFwiO1xuICBNYXJrdXBLaW5kMi5NYXJrZG93biA9IFwibWFya2Rvd25cIjtcbn0pKE1hcmt1cEtpbmQgfHwgKE1hcmt1cEtpbmQgPSB7fSkpO1xuKGZ1bmN0aW9uKE1hcmt1cEtpbmQyKSB7XG4gIGZ1bmN0aW9uIGlzKHZhbHVlKSB7XG4gICAgdmFyIGNhbmRpZGF0ZSA9IHZhbHVlO1xuICAgIHJldHVybiBjYW5kaWRhdGUgPT09IE1hcmt1cEtpbmQyLlBsYWluVGV4dCB8fCBjYW5kaWRhdGUgPT09IE1hcmt1cEtpbmQyLk1hcmtkb3duO1xuICB9XG4gIE1hcmt1cEtpbmQyLmlzID0gaXM7XG59KShNYXJrdXBLaW5kIHx8IChNYXJrdXBLaW5kID0ge30pKTtcbnZhciBNYXJrdXBDb250ZW50O1xuKGZ1bmN0aW9uKE1hcmt1cENvbnRlbnQyKSB7XG4gIGZ1bmN0aW9uIGlzKHZhbHVlKSB7XG4gICAgdmFyIGNhbmRpZGF0ZSA9IHZhbHVlO1xuICAgIHJldHVybiBJcy5vYmplY3RMaXRlcmFsKHZhbHVlKSAmJiBNYXJrdXBLaW5kLmlzKGNhbmRpZGF0ZS5raW5kKSAmJiBJcy5zdHJpbmcoY2FuZGlkYXRlLnZhbHVlKTtcbiAgfVxuICBNYXJrdXBDb250ZW50Mi5pcyA9IGlzO1xufSkoTWFya3VwQ29udGVudCB8fCAoTWFya3VwQ29udGVudCA9IHt9KSk7XG52YXIgQ29tcGxldGlvbkl0ZW1LaW5kO1xuKGZ1bmN0aW9uKENvbXBsZXRpb25JdGVtS2luZDIpIHtcbiAgQ29tcGxldGlvbkl0ZW1LaW5kMi5UZXh0ID0gMTtcbiAgQ29tcGxldGlvbkl0ZW1LaW5kMi5NZXRob2QgPSAyO1xuICBDb21wbGV0aW9uSXRlbUtpbmQyLkZ1bmN0aW9uID0gMztcbiAgQ29tcGxldGlvbkl0ZW1LaW5kMi5Db25zdHJ1Y3RvciA9IDQ7XG4gIENvbXBsZXRpb25JdGVtS2luZDIuRmllbGQgPSA1O1xuICBDb21wbGV0aW9uSXRlbUtpbmQyLlZhcmlhYmxlID0gNjtcbiAgQ29tcGxldGlvbkl0ZW1LaW5kMi5DbGFzcyA9IDc7XG4gIENvbXBsZXRpb25JdGVtS2luZDIuSW50ZXJmYWNlID0gODtcbiAgQ29tcGxldGlvbkl0ZW1LaW5kMi5Nb2R1bGUgPSA5O1xuICBDb21wbGV0aW9uSXRlbUtpbmQyLlByb3BlcnR5ID0gMTA7XG4gIENvbXBsZXRpb25JdGVtS2luZDIuVW5pdCA9IDExO1xuICBDb21wbGV0aW9uSXRlbUtpbmQyLlZhbHVlID0gMTI7XG4gIENvbXBsZXRpb25JdGVtS2luZDIuRW51bSA9IDEzO1xuICBDb21wbGV0aW9uSXRlbUtpbmQyLktleXdvcmQgPSAxNDtcbiAgQ29tcGxldGlvbkl0ZW1LaW5kMi5TbmlwcGV0ID0gMTU7XG4gIENvbXBsZXRpb25JdGVtS2luZDIuQ29sb3IgPSAxNjtcbiAgQ29tcGxldGlvbkl0ZW1LaW5kMi5GaWxlID0gMTc7XG4gIENvbXBsZXRpb25JdGVtS2luZDIuUmVmZXJlbmNlID0gMTg7XG4gIENvbXBsZXRpb25JdGVtS2luZDIuRm9sZGVyID0gMTk7XG4gIENvbXBsZXRpb25JdGVtS2luZDIuRW51bU1lbWJlciA9IDIwO1xuICBDb21wbGV0aW9uSXRlbUtpbmQyLkNvbnN0YW50ID0gMjE7XG4gIENvbXBsZXRpb25JdGVtS2luZDIuU3RydWN0ID0gMjI7XG4gIENvbXBsZXRpb25JdGVtS2luZDIuRXZlbnQgPSAyMztcbiAgQ29tcGxldGlvbkl0ZW1LaW5kMi5PcGVyYXRvciA9IDI0O1xuICBDb21wbGV0aW9uSXRlbUtpbmQyLlR5cGVQYXJhbWV0ZXIgPSAyNTtcbn0pKENvbXBsZXRpb25JdGVtS2luZCB8fCAoQ29tcGxldGlvbkl0ZW1LaW5kID0ge30pKTtcbnZhciBJbnNlcnRUZXh0Rm9ybWF0O1xuKGZ1bmN0aW9uKEluc2VydFRleHRGb3JtYXQyKSB7XG4gIEluc2VydFRleHRGb3JtYXQyLlBsYWluVGV4dCA9IDE7XG4gIEluc2VydFRleHRGb3JtYXQyLlNuaXBwZXQgPSAyO1xufSkoSW5zZXJ0VGV4dEZvcm1hdCB8fCAoSW5zZXJ0VGV4dEZvcm1hdCA9IHt9KSk7XG52YXIgQ29tcGxldGlvbkl0ZW1UYWc7XG4oZnVuY3Rpb24oQ29tcGxldGlvbkl0ZW1UYWcyKSB7XG4gIENvbXBsZXRpb25JdGVtVGFnMi5EZXByZWNhdGVkID0gMTtcbn0pKENvbXBsZXRpb25JdGVtVGFnIHx8IChDb21wbGV0aW9uSXRlbVRhZyA9IHt9KSk7XG52YXIgSW5zZXJ0UmVwbGFjZUVkaXQ7XG4oZnVuY3Rpb24oSW5zZXJ0UmVwbGFjZUVkaXQyKSB7XG4gIGZ1bmN0aW9uIGNyZWF0ZShuZXdUZXh0LCBpbnNlcnQsIHJlcGxhY2UpIHtcbiAgICByZXR1cm4geyBuZXdUZXh0LCBpbnNlcnQsIHJlcGxhY2UgfTtcbiAgfVxuICBJbnNlcnRSZXBsYWNlRWRpdDIuY3JlYXRlID0gY3JlYXRlO1xuICBmdW5jdGlvbiBpcyh2YWx1ZSkge1xuICAgIHZhciBjYW5kaWRhdGUgPSB2YWx1ZTtcbiAgICByZXR1cm4gY2FuZGlkYXRlICYmIElzLnN0cmluZyhjYW5kaWRhdGUubmV3VGV4dCkgJiYgUmFuZ2UuaXMoY2FuZGlkYXRlLmluc2VydCkgJiYgUmFuZ2UuaXMoY2FuZGlkYXRlLnJlcGxhY2UpO1xuICB9XG4gIEluc2VydFJlcGxhY2VFZGl0Mi5pcyA9IGlzO1xufSkoSW5zZXJ0UmVwbGFjZUVkaXQgfHwgKEluc2VydFJlcGxhY2VFZGl0ID0ge30pKTtcbnZhciBJbnNlcnRUZXh0TW9kZTtcbihmdW5jdGlvbihJbnNlcnRUZXh0TW9kZTIpIHtcbiAgSW5zZXJ0VGV4dE1vZGUyLmFzSXMgPSAxO1xuICBJbnNlcnRUZXh0TW9kZTIuYWRqdXN0SW5kZW50YXRpb24gPSAyO1xufSkoSW5zZXJ0VGV4dE1vZGUgfHwgKEluc2VydFRleHRNb2RlID0ge30pKTtcbnZhciBDb21wbGV0aW9uSXRlbTtcbihmdW5jdGlvbihDb21wbGV0aW9uSXRlbTIpIHtcbiAgZnVuY3Rpb24gY3JlYXRlKGxhYmVsKSB7XG4gICAgcmV0dXJuIHsgbGFiZWwgfTtcbiAgfVxuICBDb21wbGV0aW9uSXRlbTIuY3JlYXRlID0gY3JlYXRlO1xufSkoQ29tcGxldGlvbkl0ZW0gfHwgKENvbXBsZXRpb25JdGVtID0ge30pKTtcbnZhciBDb21wbGV0aW9uTGlzdDtcbihmdW5jdGlvbihDb21wbGV0aW9uTGlzdDIpIHtcbiAgZnVuY3Rpb24gY3JlYXRlKGl0ZW1zLCBpc0luY29tcGxldGUpIHtcbiAgICByZXR1cm4geyBpdGVtczogaXRlbXMgPyBpdGVtcyA6IFtdLCBpc0luY29tcGxldGU6ICEhaXNJbmNvbXBsZXRlIH07XG4gIH1cbiAgQ29tcGxldGlvbkxpc3QyLmNyZWF0ZSA9IGNyZWF0ZTtcbn0pKENvbXBsZXRpb25MaXN0IHx8IChDb21wbGV0aW9uTGlzdCA9IHt9KSk7XG52YXIgTWFya2VkU3RyaW5nO1xuKGZ1bmN0aW9uKE1hcmtlZFN0cmluZzIpIHtcbiAgZnVuY3Rpb24gZnJvbVBsYWluVGV4dChwbGFpblRleHQpIHtcbiAgICByZXR1cm4gcGxhaW5UZXh0LnJlcGxhY2UoL1tcXFxcYCpfe31bXFxdKCkjK1xcLS4hXS9nLCBcIlxcXFwkJlwiKTtcbiAgfVxuICBNYXJrZWRTdHJpbmcyLmZyb21QbGFpblRleHQgPSBmcm9tUGxhaW5UZXh0O1xuICBmdW5jdGlvbiBpcyh2YWx1ZSkge1xuICAgIHZhciBjYW5kaWRhdGUgPSB2YWx1ZTtcbiAgICByZXR1cm4gSXMuc3RyaW5nKGNhbmRpZGF0ZSkgfHwgSXMub2JqZWN0TGl0ZXJhbChjYW5kaWRhdGUpICYmIElzLnN0cmluZyhjYW5kaWRhdGUubGFuZ3VhZ2UpICYmIElzLnN0cmluZyhjYW5kaWRhdGUudmFsdWUpO1xuICB9XG4gIE1hcmtlZFN0cmluZzIuaXMgPSBpcztcbn0pKE1hcmtlZFN0cmluZyB8fCAoTWFya2VkU3RyaW5nID0ge30pKTtcbnZhciBIb3ZlcjtcbihmdW5jdGlvbihIb3ZlcjIpIHtcbiAgZnVuY3Rpb24gaXModmFsdWUpIHtcbiAgICB2YXIgY2FuZGlkYXRlID0gdmFsdWU7XG4gICAgcmV0dXJuICEhY2FuZGlkYXRlICYmIElzLm9iamVjdExpdGVyYWwoY2FuZGlkYXRlKSAmJiAoTWFya3VwQ29udGVudC5pcyhjYW5kaWRhdGUuY29udGVudHMpIHx8IE1hcmtlZFN0cmluZy5pcyhjYW5kaWRhdGUuY29udGVudHMpIHx8IElzLnR5cGVkQXJyYXkoY2FuZGlkYXRlLmNvbnRlbnRzLCBNYXJrZWRTdHJpbmcuaXMpKSAmJiAodmFsdWUucmFuZ2UgPT09IHZvaWQgMCB8fCBSYW5nZS5pcyh2YWx1ZS5yYW5nZSkpO1xuICB9XG4gIEhvdmVyMi5pcyA9IGlzO1xufSkoSG92ZXIgfHwgKEhvdmVyID0ge30pKTtcbnZhciBQYXJhbWV0ZXJJbmZvcm1hdGlvbjtcbihmdW5jdGlvbihQYXJhbWV0ZXJJbmZvcm1hdGlvbjIpIHtcbiAgZnVuY3Rpb24gY3JlYXRlKGxhYmVsLCBkb2N1bWVudGF0aW9uKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50YXRpb24gPyB7IGxhYmVsLCBkb2N1bWVudGF0aW9uIH0gOiB7IGxhYmVsIH07XG4gIH1cbiAgUGFyYW1ldGVySW5mb3JtYXRpb24yLmNyZWF0ZSA9IGNyZWF0ZTtcbn0pKFBhcmFtZXRlckluZm9ybWF0aW9uIHx8IChQYXJhbWV0ZXJJbmZvcm1hdGlvbiA9IHt9KSk7XG52YXIgU2lnbmF0dXJlSW5mb3JtYXRpb247XG4oZnVuY3Rpb24oU2lnbmF0dXJlSW5mb3JtYXRpb24yKSB7XG4gIGZ1bmN0aW9uIGNyZWF0ZShsYWJlbCwgZG9jdW1lbnRhdGlvbikge1xuICAgIHZhciBwYXJhbWV0ZXJzID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHBhcmFtZXRlcnNbX2kgLSAyXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSB7IGxhYmVsIH07XG4gICAgaWYgKElzLmRlZmluZWQoZG9jdW1lbnRhdGlvbikpIHtcbiAgICAgIHJlc3VsdC5kb2N1bWVudGF0aW9uID0gZG9jdW1lbnRhdGlvbjtcbiAgICB9XG4gICAgaWYgKElzLmRlZmluZWQocGFyYW1ldGVycykpIHtcbiAgICAgIHJlc3VsdC5wYXJhbWV0ZXJzID0gcGFyYW1ldGVycztcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnBhcmFtZXRlcnMgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBTaWduYXR1cmVJbmZvcm1hdGlvbjIuY3JlYXRlID0gY3JlYXRlO1xufSkoU2lnbmF0dXJlSW5mb3JtYXRpb24gfHwgKFNpZ25hdHVyZUluZm9ybWF0aW9uID0ge30pKTtcbnZhciBEb2N1bWVudEhpZ2hsaWdodEtpbmQ7XG4oZnVuY3Rpb24oRG9jdW1lbnRIaWdobGlnaHRLaW5kMikge1xuICBEb2N1bWVudEhpZ2hsaWdodEtpbmQyLlRleHQgPSAxO1xuICBEb2N1bWVudEhpZ2hsaWdodEtpbmQyLlJlYWQgPSAyO1xuICBEb2N1bWVudEhpZ2hsaWdodEtpbmQyLldyaXRlID0gMztcbn0pKERvY3VtZW50SGlnaGxpZ2h0S2luZCB8fCAoRG9jdW1lbnRIaWdobGlnaHRLaW5kID0ge30pKTtcbnZhciBEb2N1bWVudEhpZ2hsaWdodDtcbihmdW5jdGlvbihEb2N1bWVudEhpZ2hsaWdodDIpIHtcbiAgZnVuY3Rpb24gY3JlYXRlKHJhbmdlLCBraW5kKSB7XG4gICAgdmFyIHJlc3VsdCA9IHsgcmFuZ2UgfTtcbiAgICBpZiAoSXMubnVtYmVyKGtpbmQpKSB7XG4gICAgICByZXN1bHQua2luZCA9IGtpbmQ7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgRG9jdW1lbnRIaWdobGlnaHQyLmNyZWF0ZSA9IGNyZWF0ZTtcbn0pKERvY3VtZW50SGlnaGxpZ2h0IHx8IChEb2N1bWVudEhpZ2hsaWdodCA9IHt9KSk7XG52YXIgU3ltYm9sS2luZDtcbihmdW5jdGlvbihTeW1ib2xLaW5kMikge1xuICBTeW1ib2xLaW5kMi5GaWxlID0gMTtcbiAgU3ltYm9sS2luZDIuTW9kdWxlID0gMjtcbiAgU3ltYm9sS2luZDIuTmFtZXNwYWNlID0gMztcbiAgU3ltYm9sS2luZDIuUGFja2FnZSA9IDQ7XG4gIFN5bWJvbEtpbmQyLkNsYXNzID0gNTtcbiAgU3ltYm9sS2luZDIuTWV0aG9kID0gNjtcbiAgU3ltYm9sS2luZDIuUHJvcGVydHkgPSA3O1xuICBTeW1ib2xLaW5kMi5GaWVsZCA9IDg7XG4gIFN5bWJvbEtpbmQyLkNvbnN0cnVjdG9yID0gOTtcbiAgU3ltYm9sS2luZDIuRW51bSA9IDEwO1xuICBTeW1ib2xLaW5kMi5JbnRlcmZhY2UgPSAxMTtcbiAgU3ltYm9sS2luZDIuRnVuY3Rpb24gPSAxMjtcbiAgU3ltYm9sS2luZDIuVmFyaWFibGUgPSAxMztcbiAgU3ltYm9sS2luZDIuQ29uc3RhbnQgPSAxNDtcbiAgU3ltYm9sS2luZDIuU3RyaW5nID0gMTU7XG4gIFN5bWJvbEtpbmQyLk51bWJlciA9IDE2O1xuICBTeW1ib2xLaW5kMi5Cb29sZWFuID0gMTc7XG4gIFN5bWJvbEtpbmQyLkFycmF5ID0gMTg7XG4gIFN5bWJvbEtpbmQyLk9iamVjdCA9IDE5O1xuICBTeW1ib2xLaW5kMi5LZXkgPSAyMDtcbiAgU3ltYm9sS2luZDIuTnVsbCA9IDIxO1xuICBTeW1ib2xLaW5kMi5FbnVtTWVtYmVyID0gMjI7XG4gIFN5bWJvbEtpbmQyLlN0cnVjdCA9IDIzO1xuICBTeW1ib2xLaW5kMi5FdmVudCA9IDI0O1xuICBTeW1ib2xLaW5kMi5PcGVyYXRvciA9IDI1O1xuICBTeW1ib2xLaW5kMi5UeXBlUGFyYW1ldGVyID0gMjY7XG59KShTeW1ib2xLaW5kIHx8IChTeW1ib2xLaW5kID0ge30pKTtcbnZhciBTeW1ib2xUYWc7XG4oZnVuY3Rpb24oU3ltYm9sVGFnMikge1xuICBTeW1ib2xUYWcyLkRlcHJlY2F0ZWQgPSAxO1xufSkoU3ltYm9sVGFnIHx8IChTeW1ib2xUYWcgPSB7fSkpO1xudmFyIFN5bWJvbEluZm9ybWF0aW9uO1xuKGZ1bmN0aW9uKFN5bWJvbEluZm9ybWF0aW9uMikge1xuICBmdW5jdGlvbiBjcmVhdGUobmFtZSwga2luZCwgcmFuZ2UsIHVyaSwgY29udGFpbmVyTmFtZSkge1xuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICBuYW1lLFxuICAgICAga2luZCxcbiAgICAgIGxvY2F0aW9uOiB7IHVyaSwgcmFuZ2UgfVxuICAgIH07XG4gICAgaWYgKGNvbnRhaW5lck5hbWUpIHtcbiAgICAgIHJlc3VsdC5jb250YWluZXJOYW1lID0gY29udGFpbmVyTmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBTeW1ib2xJbmZvcm1hdGlvbjIuY3JlYXRlID0gY3JlYXRlO1xufSkoU3ltYm9sSW5mb3JtYXRpb24gfHwgKFN5bWJvbEluZm9ybWF0aW9uID0ge30pKTtcbnZhciBEb2N1bWVudFN5bWJvbDtcbihmdW5jdGlvbihEb2N1bWVudFN5bWJvbDIpIHtcbiAgZnVuY3Rpb24gY3JlYXRlKG5hbWUsIGRldGFpbCwga2luZCwgcmFuZ2UsIHNlbGVjdGlvblJhbmdlLCBjaGlsZHJlbikge1xuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICBuYW1lLFxuICAgICAgZGV0YWlsLFxuICAgICAga2luZCxcbiAgICAgIHJhbmdlLFxuICAgICAgc2VsZWN0aW9uUmFuZ2VcbiAgICB9O1xuICAgIGlmIChjaGlsZHJlbiAhPT0gdm9pZCAwKSB7XG4gICAgICByZXN1bHQuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBEb2N1bWVudFN5bWJvbDIuY3JlYXRlID0gY3JlYXRlO1xuICBmdW5jdGlvbiBpcyh2YWx1ZSkge1xuICAgIHZhciBjYW5kaWRhdGUgPSB2YWx1ZTtcbiAgICByZXR1cm4gY2FuZGlkYXRlICYmIElzLnN0cmluZyhjYW5kaWRhdGUubmFtZSkgJiYgSXMubnVtYmVyKGNhbmRpZGF0ZS5raW5kKSAmJiBSYW5nZS5pcyhjYW5kaWRhdGUucmFuZ2UpICYmIFJhbmdlLmlzKGNhbmRpZGF0ZS5zZWxlY3Rpb25SYW5nZSkgJiYgKGNhbmRpZGF0ZS5kZXRhaWwgPT09IHZvaWQgMCB8fCBJcy5zdHJpbmcoY2FuZGlkYXRlLmRldGFpbCkpICYmIChjYW5kaWRhdGUuZGVwcmVjYXRlZCA9PT0gdm9pZCAwIHx8IElzLmJvb2xlYW4oY2FuZGlkYXRlLmRlcHJlY2F0ZWQpKSAmJiAoY2FuZGlkYXRlLmNoaWxkcmVuID09PSB2b2lkIDAgfHwgQXJyYXkuaXNBcnJheShjYW5kaWRhdGUuY2hpbGRyZW4pKSAmJiAoY2FuZGlkYXRlLnRhZ3MgPT09IHZvaWQgMCB8fCBBcnJheS5pc0FycmF5KGNhbmRpZGF0ZS50YWdzKSk7XG4gIH1cbiAgRG9jdW1lbnRTeW1ib2wyLmlzID0gaXM7XG59KShEb2N1bWVudFN5bWJvbCB8fCAoRG9jdW1lbnRTeW1ib2wgPSB7fSkpO1xudmFyIENvZGVBY3Rpb25LaW5kO1xuKGZ1bmN0aW9uKENvZGVBY3Rpb25LaW5kMikge1xuICBDb2RlQWN0aW9uS2luZDIuRW1wdHkgPSBcIlwiO1xuICBDb2RlQWN0aW9uS2luZDIuUXVpY2tGaXggPSBcInF1aWNrZml4XCI7XG4gIENvZGVBY3Rpb25LaW5kMi5SZWZhY3RvciA9IFwicmVmYWN0b3JcIjtcbiAgQ29kZUFjdGlvbktpbmQyLlJlZmFjdG9yRXh0cmFjdCA9IFwicmVmYWN0b3IuZXh0cmFjdFwiO1xuICBDb2RlQWN0aW9uS2luZDIuUmVmYWN0b3JJbmxpbmUgPSBcInJlZmFjdG9yLmlubGluZVwiO1xuICBDb2RlQWN0aW9uS2luZDIuUmVmYWN0b3JSZXdyaXRlID0gXCJyZWZhY3Rvci5yZXdyaXRlXCI7XG4gIENvZGVBY3Rpb25LaW5kMi5Tb3VyY2UgPSBcInNvdXJjZVwiO1xuICBDb2RlQWN0aW9uS2luZDIuU291cmNlT3JnYW5pemVJbXBvcnRzID0gXCJzb3VyY2Uub3JnYW5pemVJbXBvcnRzXCI7XG4gIENvZGVBY3Rpb25LaW5kMi5Tb3VyY2VGaXhBbGwgPSBcInNvdXJjZS5maXhBbGxcIjtcbn0pKENvZGVBY3Rpb25LaW5kIHx8IChDb2RlQWN0aW9uS2luZCA9IHt9KSk7XG52YXIgQ29kZUFjdGlvbkNvbnRleHQ7XG4oZnVuY3Rpb24oQ29kZUFjdGlvbkNvbnRleHQyKSB7XG4gIGZ1bmN0aW9uIGNyZWF0ZShkaWFnbm9zdGljcywgb25seSkge1xuICAgIHZhciByZXN1bHQgPSB7IGRpYWdub3N0aWNzIH07XG4gICAgaWYgKG9ubHkgIT09IHZvaWQgMCAmJiBvbmx5ICE9PSBudWxsKSB7XG4gICAgICByZXN1bHQub25seSA9IG9ubHk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgQ29kZUFjdGlvbkNvbnRleHQyLmNyZWF0ZSA9IGNyZWF0ZTtcbiAgZnVuY3Rpb24gaXModmFsdWUpIHtcbiAgICB2YXIgY2FuZGlkYXRlID0gdmFsdWU7XG4gICAgcmV0dXJuIElzLmRlZmluZWQoY2FuZGlkYXRlKSAmJiBJcy50eXBlZEFycmF5KGNhbmRpZGF0ZS5kaWFnbm9zdGljcywgRGlhZ25vc3RpYy5pcykgJiYgKGNhbmRpZGF0ZS5vbmx5ID09PSB2b2lkIDAgfHwgSXMudHlwZWRBcnJheShjYW5kaWRhdGUub25seSwgSXMuc3RyaW5nKSk7XG4gIH1cbiAgQ29kZUFjdGlvbkNvbnRleHQyLmlzID0gaXM7XG59KShDb2RlQWN0aW9uQ29udGV4dCB8fCAoQ29kZUFjdGlvbkNvbnRleHQgPSB7fSkpO1xudmFyIENvZGVBY3Rpb247XG4oZnVuY3Rpb24oQ29kZUFjdGlvbjIpIHtcbiAgZnVuY3Rpb24gY3JlYXRlKHRpdGxlLCBraW5kT3JDb21tYW5kT3JFZGl0LCBraW5kKSB7XG4gICAgdmFyIHJlc3VsdCA9IHsgdGl0bGUgfTtcbiAgICB2YXIgY2hlY2tLaW5kID0gdHJ1ZTtcbiAgICBpZiAodHlwZW9mIGtpbmRPckNvbW1hbmRPckVkaXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGNoZWNrS2luZCA9IGZhbHNlO1xuICAgICAgcmVzdWx0LmtpbmQgPSBraW5kT3JDb21tYW5kT3JFZGl0O1xuICAgIH0gZWxzZSBpZiAoQ29tbWFuZC5pcyhraW5kT3JDb21tYW5kT3JFZGl0KSkge1xuICAgICAgcmVzdWx0LmNvbW1hbmQgPSBraW5kT3JDb21tYW5kT3JFZGl0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQuZWRpdCA9IGtpbmRPckNvbW1hbmRPckVkaXQ7XG4gICAgfVxuICAgIGlmIChjaGVja0tpbmQgJiYga2luZCAhPT0gdm9pZCAwKSB7XG4gICAgICByZXN1bHQua2luZCA9IGtpbmQ7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgQ29kZUFjdGlvbjIuY3JlYXRlID0gY3JlYXRlO1xuICBmdW5jdGlvbiBpcyh2YWx1ZSkge1xuICAgIHZhciBjYW5kaWRhdGUgPSB2YWx1ZTtcbiAgICByZXR1cm4gY2FuZGlkYXRlICYmIElzLnN0cmluZyhjYW5kaWRhdGUudGl0bGUpICYmIChjYW5kaWRhdGUuZGlhZ25vc3RpY3MgPT09IHZvaWQgMCB8fCBJcy50eXBlZEFycmF5KGNhbmRpZGF0ZS5kaWFnbm9zdGljcywgRGlhZ25vc3RpYy5pcykpICYmIChjYW5kaWRhdGUua2luZCA9PT0gdm9pZCAwIHx8IElzLnN0cmluZyhjYW5kaWRhdGUua2luZCkpICYmIChjYW5kaWRhdGUuZWRpdCAhPT0gdm9pZCAwIHx8IGNhbmRpZGF0ZS5jb21tYW5kICE9PSB2b2lkIDApICYmIChjYW5kaWRhdGUuY29tbWFuZCA9PT0gdm9pZCAwIHx8IENvbW1hbmQuaXMoY2FuZGlkYXRlLmNvbW1hbmQpKSAmJiAoY2FuZGlkYXRlLmlzUHJlZmVycmVkID09PSB2b2lkIDAgfHwgSXMuYm9vbGVhbihjYW5kaWRhdGUuaXNQcmVmZXJyZWQpKSAmJiAoY2FuZGlkYXRlLmVkaXQgPT09IHZvaWQgMCB8fCBXb3Jrc3BhY2VFZGl0LmlzKGNhbmRpZGF0ZS5lZGl0KSk7XG4gIH1cbiAgQ29kZUFjdGlvbjIuaXMgPSBpcztcbn0pKENvZGVBY3Rpb24gfHwgKENvZGVBY3Rpb24gPSB7fSkpO1xudmFyIENvZGVMZW5zO1xuKGZ1bmN0aW9uKENvZGVMZW5zMikge1xuICBmdW5jdGlvbiBjcmVhdGUocmFuZ2UsIGRhdGEpIHtcbiAgICB2YXIgcmVzdWx0ID0geyByYW5nZSB9O1xuICAgIGlmIChJcy5kZWZpbmVkKGRhdGEpKSB7XG4gICAgICByZXN1bHQuZGF0YSA9IGRhdGE7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgQ29kZUxlbnMyLmNyZWF0ZSA9IGNyZWF0ZTtcbiAgZnVuY3Rpb24gaXModmFsdWUpIHtcbiAgICB2YXIgY2FuZGlkYXRlID0gdmFsdWU7XG4gICAgcmV0dXJuIElzLmRlZmluZWQoY2FuZGlkYXRlKSAmJiBSYW5nZS5pcyhjYW5kaWRhdGUucmFuZ2UpICYmIChJcy51bmRlZmluZWQoY2FuZGlkYXRlLmNvbW1hbmQpIHx8IENvbW1hbmQuaXMoY2FuZGlkYXRlLmNvbW1hbmQpKTtcbiAgfVxuICBDb2RlTGVuczIuaXMgPSBpcztcbn0pKENvZGVMZW5zIHx8IChDb2RlTGVucyA9IHt9KSk7XG52YXIgRm9ybWF0dGluZ09wdGlvbnM7XG4oZnVuY3Rpb24oRm9ybWF0dGluZ09wdGlvbnMyKSB7XG4gIGZ1bmN0aW9uIGNyZWF0ZSh0YWJTaXplLCBpbnNlcnRTcGFjZXMpIHtcbiAgICByZXR1cm4geyB0YWJTaXplLCBpbnNlcnRTcGFjZXMgfTtcbiAgfVxuICBGb3JtYXR0aW5nT3B0aW9uczIuY3JlYXRlID0gY3JlYXRlO1xuICBmdW5jdGlvbiBpcyh2YWx1ZSkge1xuICAgIHZhciBjYW5kaWRhdGUgPSB2YWx1ZTtcbiAgICByZXR1cm4gSXMuZGVmaW5lZChjYW5kaWRhdGUpICYmIElzLnVpbnRlZ2VyKGNhbmRpZGF0ZS50YWJTaXplKSAmJiBJcy5ib29sZWFuKGNhbmRpZGF0ZS5pbnNlcnRTcGFjZXMpO1xuICB9XG4gIEZvcm1hdHRpbmdPcHRpb25zMi5pcyA9IGlzO1xufSkoRm9ybWF0dGluZ09wdGlvbnMgfHwgKEZvcm1hdHRpbmdPcHRpb25zID0ge30pKTtcbnZhciBEb2N1bWVudExpbms7XG4oZnVuY3Rpb24oRG9jdW1lbnRMaW5rMikge1xuICBmdW5jdGlvbiBjcmVhdGUocmFuZ2UsIHRhcmdldCwgZGF0YSkge1xuICAgIHJldHVybiB7IHJhbmdlLCB0YXJnZXQsIGRhdGEgfTtcbiAgfVxuICBEb2N1bWVudExpbmsyLmNyZWF0ZSA9IGNyZWF0ZTtcbiAgZnVuY3Rpb24gaXModmFsdWUpIHtcbiAgICB2YXIgY2FuZGlkYXRlID0gdmFsdWU7XG4gICAgcmV0dXJuIElzLmRlZmluZWQoY2FuZGlkYXRlKSAmJiBSYW5nZS5pcyhjYW5kaWRhdGUucmFuZ2UpICYmIChJcy51bmRlZmluZWQoY2FuZGlkYXRlLnRhcmdldCkgfHwgSXMuc3RyaW5nKGNhbmRpZGF0ZS50YXJnZXQpKTtcbiAgfVxuICBEb2N1bWVudExpbmsyLmlzID0gaXM7XG59KShEb2N1bWVudExpbmsgfHwgKERvY3VtZW50TGluayA9IHt9KSk7XG52YXIgU2VsZWN0aW9uUmFuZ2U7XG4oZnVuY3Rpb24oU2VsZWN0aW9uUmFuZ2UyKSB7XG4gIGZ1bmN0aW9uIGNyZWF0ZShyYW5nZSwgcGFyZW50KSB7XG4gICAgcmV0dXJuIHsgcmFuZ2UsIHBhcmVudCB9O1xuICB9XG4gIFNlbGVjdGlvblJhbmdlMi5jcmVhdGUgPSBjcmVhdGU7XG4gIGZ1bmN0aW9uIGlzKHZhbHVlKSB7XG4gICAgdmFyIGNhbmRpZGF0ZSA9IHZhbHVlO1xuICAgIHJldHVybiBjYW5kaWRhdGUgIT09IHZvaWQgMCAmJiBSYW5nZS5pcyhjYW5kaWRhdGUucmFuZ2UpICYmIChjYW5kaWRhdGUucGFyZW50ID09PSB2b2lkIDAgfHwgU2VsZWN0aW9uUmFuZ2UyLmlzKGNhbmRpZGF0ZS5wYXJlbnQpKTtcbiAgfVxuICBTZWxlY3Rpb25SYW5nZTIuaXMgPSBpcztcbn0pKFNlbGVjdGlvblJhbmdlIHx8IChTZWxlY3Rpb25SYW5nZSA9IHt9KSk7XG52YXIgVGV4dERvY3VtZW50O1xuKGZ1bmN0aW9uKFRleHREb2N1bWVudDIpIHtcbiAgZnVuY3Rpb24gY3JlYXRlKHVyaSwgbGFuZ3VhZ2VJZCwgdmVyc2lvbiwgY29udGVudCkge1xuICAgIHJldHVybiBuZXcgRnVsbFRleHREb2N1bWVudCh1cmksIGxhbmd1YWdlSWQsIHZlcnNpb24sIGNvbnRlbnQpO1xuICB9XG4gIFRleHREb2N1bWVudDIuY3JlYXRlID0gY3JlYXRlO1xuICBmdW5jdGlvbiBpcyh2YWx1ZSkge1xuICAgIHZhciBjYW5kaWRhdGUgPSB2YWx1ZTtcbiAgICByZXR1cm4gSXMuZGVmaW5lZChjYW5kaWRhdGUpICYmIElzLnN0cmluZyhjYW5kaWRhdGUudXJpKSAmJiAoSXMudW5kZWZpbmVkKGNhbmRpZGF0ZS5sYW5ndWFnZUlkKSB8fCBJcy5zdHJpbmcoY2FuZGlkYXRlLmxhbmd1YWdlSWQpKSAmJiBJcy51aW50ZWdlcihjYW5kaWRhdGUubGluZUNvdW50KSAmJiBJcy5mdW5jKGNhbmRpZGF0ZS5nZXRUZXh0KSAmJiBJcy5mdW5jKGNhbmRpZGF0ZS5wb3NpdGlvbkF0KSAmJiBJcy5mdW5jKGNhbmRpZGF0ZS5vZmZzZXRBdCkgPyB0cnVlIDogZmFsc2U7XG4gIH1cbiAgVGV4dERvY3VtZW50Mi5pcyA9IGlzO1xuICBmdW5jdGlvbiBhcHBseUVkaXRzKGRvY3VtZW50LCBlZGl0cykge1xuICAgIHZhciB0ZXh0ID0gZG9jdW1lbnQuZ2V0VGV4dCgpO1xuICAgIHZhciBzb3J0ZWRFZGl0cyA9IG1lcmdlU29ydChlZGl0cywgZnVuY3Rpb24oYSwgYikge1xuICAgICAgdmFyIGRpZmYgPSBhLnJhbmdlLnN0YXJ0LmxpbmUgLSBiLnJhbmdlLnN0YXJ0LmxpbmU7XG4gICAgICBpZiAoZGlmZiA9PT0gMCkge1xuICAgICAgICByZXR1cm4gYS5yYW5nZS5zdGFydC5jaGFyYWN0ZXIgLSBiLnJhbmdlLnN0YXJ0LmNoYXJhY3RlcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkaWZmO1xuICAgIH0pO1xuICAgIHZhciBsYXN0TW9kaWZpZWRPZmZzZXQgPSB0ZXh0Lmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gc29ydGVkRWRpdHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBlID0gc29ydGVkRWRpdHNbaV07XG4gICAgICB2YXIgc3RhcnRPZmZzZXQgPSBkb2N1bWVudC5vZmZzZXRBdChlLnJhbmdlLnN0YXJ0KTtcbiAgICAgIHZhciBlbmRPZmZzZXQgPSBkb2N1bWVudC5vZmZzZXRBdChlLnJhbmdlLmVuZCk7XG4gICAgICBpZiAoZW5kT2Zmc2V0IDw9IGxhc3RNb2RpZmllZE9mZnNldCkge1xuICAgICAgICB0ZXh0ID0gdGV4dC5zdWJzdHJpbmcoMCwgc3RhcnRPZmZzZXQpICsgZS5uZXdUZXh0ICsgdGV4dC5zdWJzdHJpbmcoZW5kT2Zmc2V0LCB0ZXh0Lmxlbmd0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPdmVybGFwcGluZyBlZGl0XCIpO1xuICAgICAgfVxuICAgICAgbGFzdE1vZGlmaWVkT2Zmc2V0ID0gc3RhcnRPZmZzZXQ7XG4gICAgfVxuICAgIHJldHVybiB0ZXh0O1xuICB9XG4gIFRleHREb2N1bWVudDIuYXBwbHlFZGl0cyA9IGFwcGx5RWRpdHM7XG4gIGZ1bmN0aW9uIG1lcmdlU29ydChkYXRhLCBjb21wYXJlKSB7XG4gICAgaWYgKGRhdGEubGVuZ3RoIDw9IDEpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICB2YXIgcCA9IGRhdGEubGVuZ3RoIC8gMiB8IDA7XG4gICAgdmFyIGxlZnQgPSBkYXRhLnNsaWNlKDAsIHApO1xuICAgIHZhciByaWdodCA9IGRhdGEuc2xpY2UocCk7XG4gICAgbWVyZ2VTb3J0KGxlZnQsIGNvbXBhcmUpO1xuICAgIG1lcmdlU29ydChyaWdodCwgY29tcGFyZSk7XG4gICAgdmFyIGxlZnRJZHggPSAwO1xuICAgIHZhciByaWdodElkeCA9IDA7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChsZWZ0SWR4IDwgbGVmdC5sZW5ndGggJiYgcmlnaHRJZHggPCByaWdodC5sZW5ndGgpIHtcbiAgICAgIHZhciByZXQgPSBjb21wYXJlKGxlZnRbbGVmdElkeF0sIHJpZ2h0W3JpZ2h0SWR4XSk7XG4gICAgICBpZiAocmV0IDw9IDApIHtcbiAgICAgICAgZGF0YVtpKytdID0gbGVmdFtsZWZ0SWR4KytdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0YVtpKytdID0gcmlnaHRbcmlnaHRJZHgrK107XG4gICAgICB9XG4gICAgfVxuICAgIHdoaWxlIChsZWZ0SWR4IDwgbGVmdC5sZW5ndGgpIHtcbiAgICAgIGRhdGFbaSsrXSA9IGxlZnRbbGVmdElkeCsrXTtcbiAgICB9XG4gICAgd2hpbGUgKHJpZ2h0SWR4IDwgcmlnaHQubGVuZ3RoKSB7XG4gICAgICBkYXRhW2krK10gPSByaWdodFtyaWdodElkeCsrXTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbn0pKFRleHREb2N1bWVudCB8fCAoVGV4dERvY3VtZW50ID0ge30pKTtcbnZhciBGdWxsVGV4dERvY3VtZW50ID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEZ1bGxUZXh0RG9jdW1lbnQyKHVyaSwgbGFuZ3VhZ2VJZCwgdmVyc2lvbiwgY29udGVudCkge1xuICAgIHRoaXMuX3VyaSA9IHVyaTtcbiAgICB0aGlzLl9sYW5ndWFnZUlkID0gbGFuZ3VhZ2VJZDtcbiAgICB0aGlzLl92ZXJzaW9uID0gdmVyc2lvbjtcbiAgICB0aGlzLl9jb250ZW50ID0gY29udGVudDtcbiAgICB0aGlzLl9saW5lT2Zmc2V0cyA9IHZvaWQgMDtcbiAgfVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVsbFRleHREb2N1bWVudDIucHJvdG90eXBlLCBcInVyaVwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl91cmk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGdWxsVGV4dERvY3VtZW50Mi5wcm90b3R5cGUsIFwibGFuZ3VhZ2VJZFwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9sYW5ndWFnZUlkO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVsbFRleHREb2N1bWVudDIucHJvdG90eXBlLCBcInZlcnNpb25cIiwge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdmVyc2lvbjtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgRnVsbFRleHREb2N1bWVudDIucHJvdG90eXBlLmdldFRleHQgPSBmdW5jdGlvbihyYW5nZSkge1xuICAgIGlmIChyYW5nZSkge1xuICAgICAgdmFyIHN0YXJ0ID0gdGhpcy5vZmZzZXRBdChyYW5nZS5zdGFydCk7XG4gICAgICB2YXIgZW5kID0gdGhpcy5vZmZzZXRBdChyYW5nZS5lbmQpO1xuICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY29udGVudDtcbiAgfTtcbiAgRnVsbFRleHREb2N1bWVudDIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGV2ZW50LCB2ZXJzaW9uKSB7XG4gICAgdGhpcy5fY29udGVudCA9IGV2ZW50LnRleHQ7XG4gICAgdGhpcy5fdmVyc2lvbiA9IHZlcnNpb247XG4gICAgdGhpcy5fbGluZU9mZnNldHMgPSB2b2lkIDA7XG4gIH07XG4gIEZ1bGxUZXh0RG9jdW1lbnQyLnByb3RvdHlwZS5nZXRMaW5lT2Zmc2V0cyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLl9saW5lT2Zmc2V0cyA9PT0gdm9pZCAwKSB7XG4gICAgICB2YXIgbGluZU9mZnNldHMgPSBbXTtcbiAgICAgIHZhciB0ZXh0ID0gdGhpcy5fY29udGVudDtcbiAgICAgIHZhciBpc0xpbmVTdGFydCA9IHRydWU7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGlzTGluZVN0YXJ0KSB7XG4gICAgICAgICAgbGluZU9mZnNldHMucHVzaChpKTtcbiAgICAgICAgICBpc0xpbmVTdGFydCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjaCA9IHRleHQuY2hhckF0KGkpO1xuICAgICAgICBpc0xpbmVTdGFydCA9IGNoID09PSBcIlxcclwiIHx8IGNoID09PSBcIlxcblwiO1xuICAgICAgICBpZiAoY2ggPT09IFwiXFxyXCIgJiYgaSArIDEgPCB0ZXh0Lmxlbmd0aCAmJiB0ZXh0LmNoYXJBdChpICsgMSkgPT09IFwiXFxuXCIpIHtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0xpbmVTdGFydCAmJiB0ZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGluZU9mZnNldHMucHVzaCh0ZXh0Lmxlbmd0aCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9saW5lT2Zmc2V0cyA9IGxpbmVPZmZzZXRzO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbGluZU9mZnNldHM7XG4gIH07XG4gIEZ1bGxUZXh0RG9jdW1lbnQyLnByb3RvdHlwZS5wb3NpdGlvbkF0ID0gZnVuY3Rpb24ob2Zmc2V0KSB7XG4gICAgb2Zmc2V0ID0gTWF0aC5tYXgoTWF0aC5taW4ob2Zmc2V0LCB0aGlzLl9jb250ZW50Lmxlbmd0aCksIDApO1xuICAgIHZhciBsaW5lT2Zmc2V0cyA9IHRoaXMuZ2V0TGluZU9mZnNldHMoKTtcbiAgICB2YXIgbG93ID0gMCwgaGlnaCA9IGxpbmVPZmZzZXRzLmxlbmd0aDtcbiAgICBpZiAoaGlnaCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFBvc2l0aW9uLmNyZWF0ZSgwLCBvZmZzZXQpO1xuICAgIH1cbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgdmFyIG1pZCA9IE1hdGguZmxvb3IoKGxvdyArIGhpZ2gpIC8gMik7XG4gICAgICBpZiAobGluZU9mZnNldHNbbWlkXSA+IG9mZnNldCkge1xuICAgICAgICBoaWdoID0gbWlkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG93ID0gbWlkICsgMTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGxpbmUgPSBsb3cgLSAxO1xuICAgIHJldHVybiBQb3NpdGlvbi5jcmVhdGUobGluZSwgb2Zmc2V0IC0gbGluZU9mZnNldHNbbGluZV0pO1xuICB9O1xuICBGdWxsVGV4dERvY3VtZW50Mi5wcm90b3R5cGUub2Zmc2V0QXQgPSBmdW5jdGlvbihwb3NpdGlvbikge1xuICAgIHZhciBsaW5lT2Zmc2V0cyA9IHRoaXMuZ2V0TGluZU9mZnNldHMoKTtcbiAgICBpZiAocG9zaXRpb24ubGluZSA+PSBsaW5lT2Zmc2V0cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jb250ZW50Lmxlbmd0aDtcbiAgICB9IGVsc2UgaWYgKHBvc2l0aW9uLmxpbmUgPCAwKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgdmFyIGxpbmVPZmZzZXQgPSBsaW5lT2Zmc2V0c1twb3NpdGlvbi5saW5lXTtcbiAgICB2YXIgbmV4dExpbmVPZmZzZXQgPSBwb3NpdGlvbi5saW5lICsgMSA8IGxpbmVPZmZzZXRzLmxlbmd0aCA/IGxpbmVPZmZzZXRzW3Bvc2l0aW9uLmxpbmUgKyAxXSA6IHRoaXMuX2NvbnRlbnQubGVuZ3RoO1xuICAgIHJldHVybiBNYXRoLm1heChNYXRoLm1pbihsaW5lT2Zmc2V0ICsgcG9zaXRpb24uY2hhcmFjdGVyLCBuZXh0TGluZU9mZnNldCksIGxpbmVPZmZzZXQpO1xuICB9O1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVsbFRleHREb2N1bWVudDIucHJvdG90eXBlLCBcImxpbmVDb3VudFwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldExpbmVPZmZzZXRzKCkubGVuZ3RoO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICByZXR1cm4gRnVsbFRleHREb2N1bWVudDI7XG59KCk7XG52YXIgSXM7XG4oZnVuY3Rpb24oSXMyKSB7XG4gIHZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIGZ1bmN0aW9uIGRlZmluZWQodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlICE9PSBcInVuZGVmaW5lZFwiO1xuICB9XG4gIElzMi5kZWZpbmVkID0gZGVmaW5lZDtcbiAgZnVuY3Rpb24gdW5kZWZpbmVkMih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCI7XG4gIH1cbiAgSXMyLnVuZGVmaW5lZCA9IHVuZGVmaW5lZDI7XG4gIGZ1bmN0aW9uIGJvb2xlYW4odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09IGZhbHNlO1xuICB9XG4gIElzMi5ib29sZWFuID0gYm9vbGVhbjtcbiAgZnVuY3Rpb24gc3RyaW5nKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSBcIltvYmplY3QgU3RyaW5nXVwiO1xuICB9XG4gIElzMi5zdHJpbmcgPSBzdHJpbmc7XG4gIGZ1bmN0aW9uIG51bWJlcih2YWx1ZSkge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gXCJbb2JqZWN0IE51bWJlcl1cIjtcbiAgfVxuICBJczIubnVtYmVyID0gbnVtYmVyO1xuICBmdW5jdGlvbiBudW1iZXJSYW5nZSh2YWx1ZSwgbWluLCBtYXgpIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09IFwiW29iamVjdCBOdW1iZXJdXCIgJiYgbWluIDw9IHZhbHVlICYmIHZhbHVlIDw9IG1heDtcbiAgfVxuICBJczIubnVtYmVyUmFuZ2UgPSBudW1iZXJSYW5nZTtcbiAgZnVuY3Rpb24gaW50ZWdlcjIodmFsdWUpIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09IFwiW29iamVjdCBOdW1iZXJdXCIgJiYgLTIxNDc0ODM2NDggPD0gdmFsdWUgJiYgdmFsdWUgPD0gMjE0NzQ4MzY0NztcbiAgfVxuICBJczIuaW50ZWdlciA9IGludGVnZXIyO1xuICBmdW5jdGlvbiB1aW50ZWdlcjIodmFsdWUpIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09IFwiW29iamVjdCBOdW1iZXJdXCIgJiYgMCA8PSB2YWx1ZSAmJiB2YWx1ZSA8PSAyMTQ3NDgzNjQ3O1xuICB9XG4gIElzMi51aW50ZWdlciA9IHVpbnRlZ2VyMjtcbiAgZnVuY3Rpb24gZnVuYyh2YWx1ZSkge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiO1xuICB9XG4gIElzMi5mdW5jID0gZnVuYztcbiAgZnVuY3Rpb24gb2JqZWN0TGl0ZXJhbCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCI7XG4gIH1cbiAgSXMyLm9iamVjdExpdGVyYWwgPSBvYmplY3RMaXRlcmFsO1xuICBmdW5jdGlvbiB0eXBlZEFycmF5KHZhbHVlLCBjaGVjaykge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5ldmVyeShjaGVjayk7XG4gIH1cbiAgSXMyLnR5cGVkQXJyYXkgPSB0eXBlZEFycmF5O1xufSkoSXMgfHwgKElzID0ge30pKTtcblxuLy8gc3JjL2xhbmd1YWdlL2NvbW1vbi9sc3BMYW5ndWFnZUZlYXR1cmVzLnRzXG52YXIgRGlhZ25vc3RpY3NBZGFwdGVyID0gY2xhc3Mge1xuICBjb25zdHJ1Y3RvcihfbGFuZ3VhZ2VJZCwgX3dvcmtlciwgY29uZmlnQ2hhbmdlRXZlbnQpIHtcbiAgICB0aGlzLl9sYW5ndWFnZUlkID0gX2xhbmd1YWdlSWQ7XG4gICAgdGhpcy5fd29ya2VyID0gX3dvcmtlcjtcbiAgICBjb25zdCBvbk1vZGVsQWRkID0gKG1vZGVsKSA9PiB7XG4gICAgICBsZXQgbW9kZUlkID0gbW9kZWwuZ2V0TGFuZ3VhZ2VJZCgpO1xuICAgICAgaWYgKG1vZGVJZCAhPT0gdGhpcy5fbGFuZ3VhZ2VJZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsZXQgaGFuZGxlO1xuICAgICAgdGhpcy5fbGlzdGVuZXJbbW9kZWwudXJpLnRvU3RyaW5nKCldID0gbW9kZWwub25EaWRDaGFuZ2VDb250ZW50KCgpID0+IHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChoYW5kbGUpO1xuICAgICAgICBoYW5kbGUgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB0aGlzLl9kb1ZhbGlkYXRlKG1vZGVsLnVyaSwgbW9kZUlkKSwgNTAwKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fZG9WYWxpZGF0ZShtb2RlbC51cmksIG1vZGVJZCk7XG4gICAgfTtcbiAgICBjb25zdCBvbk1vZGVsUmVtb3ZlZCA9IChtb2RlbCkgPT4ge1xuICAgICAgbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMuZWRpdG9yLnNldE1vZGVsTWFya2Vycyhtb2RlbCwgdGhpcy5fbGFuZ3VhZ2VJZCwgW10pO1xuICAgICAgbGV0IHVyaVN0ciA9IG1vZGVsLnVyaS50b1N0cmluZygpO1xuICAgICAgbGV0IGxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJbdXJpU3RyXTtcbiAgICAgIGlmIChsaXN0ZW5lcikge1xuICAgICAgICBsaXN0ZW5lci5kaXNwb3NlKCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9saXN0ZW5lclt1cmlTdHJdO1xuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5fZGlzcG9zYWJsZXMucHVzaChtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5lZGl0b3Iub25EaWRDcmVhdGVNb2RlbChvbk1vZGVsQWRkKSk7XG4gICAgdGhpcy5fZGlzcG9zYWJsZXMucHVzaChtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5lZGl0b3Iub25XaWxsRGlzcG9zZU1vZGVsKG9uTW9kZWxSZW1vdmVkKSk7XG4gICAgdGhpcy5fZGlzcG9zYWJsZXMucHVzaChtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5lZGl0b3Iub25EaWRDaGFuZ2VNb2RlbExhbmd1YWdlKChldmVudCkgPT4ge1xuICAgICAgb25Nb2RlbFJlbW92ZWQoZXZlbnQubW9kZWwpO1xuICAgICAgb25Nb2RlbEFkZChldmVudC5tb2RlbCk7XG4gICAgfSkpO1xuICAgIHRoaXMuX2Rpc3Bvc2FibGVzLnB1c2goY29uZmlnQ2hhbmdlRXZlbnQoKF8pID0+IHtcbiAgICAgIG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmVkaXRvci5nZXRNb2RlbHMoKS5mb3JFYWNoKChtb2RlbCkgPT4ge1xuICAgICAgICBpZiAobW9kZWwuZ2V0TGFuZ3VhZ2VJZCgpID09PSB0aGlzLl9sYW5ndWFnZUlkKSB7XG4gICAgICAgICAgb25Nb2RlbFJlbW92ZWQobW9kZWwpO1xuICAgICAgICAgIG9uTW9kZWxBZGQobW9kZWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KSk7XG4gICAgdGhpcy5fZGlzcG9zYWJsZXMucHVzaCh7XG4gICAgICBkaXNwb3NlOiAoKSA9PiB7XG4gICAgICAgIG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmVkaXRvci5nZXRNb2RlbHMoKS5mb3JFYWNoKG9uTW9kZWxSZW1vdmVkKTtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuX2xpc3RlbmVyKSB7XG4gICAgICAgICAgdGhpcy5fbGlzdGVuZXJba2V5XS5kaXNwb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5lZGl0b3IuZ2V0TW9kZWxzKCkuZm9yRWFjaChvbk1vZGVsQWRkKTtcbiAgfVxuICBfZGlzcG9zYWJsZXMgPSBbXTtcbiAgX2xpc3RlbmVyID0gLyogQF9fUFVSRV9fICovIE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5fZGlzcG9zYWJsZXMuZm9yRWFjaCgoZCkgPT4gZCAmJiBkLmRpc3Bvc2UoKSk7XG4gICAgdGhpcy5fZGlzcG9zYWJsZXMubGVuZ3RoID0gMDtcbiAgfVxuICBfZG9WYWxpZGF0ZShyZXNvdXJjZSwgbGFuZ3VhZ2VJZCkge1xuICAgIHRoaXMuX3dvcmtlcihyZXNvdXJjZSkudGhlbigod29ya2VyKSA9PiB7XG4gICAgICByZXR1cm4gd29ya2VyLmRvVmFsaWRhdGlvbihyZXNvdXJjZS50b1N0cmluZygpKTtcbiAgICB9KS50aGVuKChkaWFnbm9zdGljcykgPT4ge1xuICAgICAgY29uc3QgbWFya2VycyA9IGRpYWdub3N0aWNzLm1hcCgoZCkgPT4gdG9EaWFnbm9zdGljcyhyZXNvdXJjZSwgZCkpO1xuICAgICAgbGV0IG1vZGVsID0gbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMuZWRpdG9yLmdldE1vZGVsKHJlc291cmNlKTtcbiAgICAgIGlmIChtb2RlbCAmJiBtb2RlbC5nZXRMYW5ndWFnZUlkKCkgPT09IGxhbmd1YWdlSWQpIHtcbiAgICAgICAgbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMuZWRpdG9yLnNldE1vZGVsTWFya2Vycyhtb2RlbCwgbGFuZ3VhZ2VJZCwgbWFya2Vycyk7XG4gICAgICB9XG4gICAgfSkudGhlbih2b2lkIDAsIChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9KTtcbiAgfVxufTtcbmZ1bmN0aW9uIHRvU2V2ZXJpdHkobHNTZXZlcml0eSkge1xuICBzd2l0Y2ggKGxzU2V2ZXJpdHkpIHtcbiAgICBjYXNlIERpYWdub3N0aWNTZXZlcml0eS5FcnJvcjpcbiAgICAgIHJldHVybiBtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5NYXJrZXJTZXZlcml0eS5FcnJvcjtcbiAgICBjYXNlIERpYWdub3N0aWNTZXZlcml0eS5XYXJuaW5nOlxuICAgICAgcmV0dXJuIG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLk1hcmtlclNldmVyaXR5Lldhcm5pbmc7XG4gICAgY2FzZSBEaWFnbm9zdGljU2V2ZXJpdHkuSW5mb3JtYXRpb246XG4gICAgICByZXR1cm4gbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMuTWFya2VyU2V2ZXJpdHkuSW5mbztcbiAgICBjYXNlIERpYWdub3N0aWNTZXZlcml0eS5IaW50OlxuICAgICAgcmV0dXJuIG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLk1hcmtlclNldmVyaXR5LkhpbnQ7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5NYXJrZXJTZXZlcml0eS5JbmZvO1xuICB9XG59XG5mdW5jdGlvbiB0b0RpYWdub3N0aWNzKHJlc291cmNlLCBkaWFnKSB7XG4gIGxldCBjb2RlID0gdHlwZW9mIGRpYWcuY29kZSA9PT0gXCJudW1iZXJcIiA/IFN0cmluZyhkaWFnLmNvZGUpIDogZGlhZy5jb2RlO1xuICByZXR1cm4ge1xuICAgIHNldmVyaXR5OiB0b1NldmVyaXR5KGRpYWcuc2V2ZXJpdHkpLFxuICAgIHN0YXJ0TGluZU51bWJlcjogZGlhZy5yYW5nZS5zdGFydC5saW5lICsgMSxcbiAgICBzdGFydENvbHVtbjogZGlhZy5yYW5nZS5zdGFydC5jaGFyYWN0ZXIgKyAxLFxuICAgIGVuZExpbmVOdW1iZXI6IGRpYWcucmFuZ2UuZW5kLmxpbmUgKyAxLFxuICAgIGVuZENvbHVtbjogZGlhZy5yYW5nZS5lbmQuY2hhcmFjdGVyICsgMSxcbiAgICBtZXNzYWdlOiBkaWFnLm1lc3NhZ2UsXG4gICAgY29kZSxcbiAgICBzb3VyY2U6IGRpYWcuc291cmNlXG4gIH07XG59XG52YXIgQ29tcGxldGlvbkFkYXB0ZXIgPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKF93b3JrZXIsIF90cmlnZ2VyQ2hhcmFjdGVycykge1xuICAgIHRoaXMuX3dvcmtlciA9IF93b3JrZXI7XG4gICAgdGhpcy5fdHJpZ2dlckNoYXJhY3RlcnMgPSBfdHJpZ2dlckNoYXJhY3RlcnM7XG4gIH1cbiAgZ2V0IHRyaWdnZXJDaGFyYWN0ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl90cmlnZ2VyQ2hhcmFjdGVycztcbiAgfVxuICBwcm92aWRlQ29tcGxldGlvbkl0ZW1zKG1vZGVsLCBwb3NpdGlvbiwgY29udGV4dCwgdG9rZW4pIHtcbiAgICBjb25zdCByZXNvdXJjZSA9IG1vZGVsLnVyaTtcbiAgICByZXR1cm4gdGhpcy5fd29ya2VyKHJlc291cmNlKS50aGVuKCh3b3JrZXIpID0+IHtcbiAgICAgIHJldHVybiB3b3JrZXIuZG9Db21wbGV0ZShyZXNvdXJjZS50b1N0cmluZygpLCBmcm9tUG9zaXRpb24ocG9zaXRpb24pKTtcbiAgICB9KS50aGVuKChpbmZvKSA9PiB7XG4gICAgICBpZiAoIWluZm8pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3Qgd29yZEluZm8gPSBtb2RlbC5nZXRXb3JkVW50aWxQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICBjb25zdCB3b3JkUmFuZ2UgPSBuZXcgbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMuUmFuZ2UocG9zaXRpb24ubGluZU51bWJlciwgd29yZEluZm8uc3RhcnRDb2x1bW4sIHBvc2l0aW9uLmxpbmVOdW1iZXIsIHdvcmRJbmZvLmVuZENvbHVtbik7XG4gICAgICBjb25zdCBpdGVtcyA9IGluZm8uaXRlbXMubWFwKChlbnRyeSkgPT4ge1xuICAgICAgICBjb25zdCBpdGVtID0ge1xuICAgICAgICAgIGxhYmVsOiBlbnRyeS5sYWJlbCxcbiAgICAgICAgICBpbnNlcnRUZXh0OiBlbnRyeS5pbnNlcnRUZXh0IHx8IGVudHJ5LmxhYmVsLFxuICAgICAgICAgIHNvcnRUZXh0OiBlbnRyeS5zb3J0VGV4dCxcbiAgICAgICAgICBmaWx0ZXJUZXh0OiBlbnRyeS5maWx0ZXJUZXh0LFxuICAgICAgICAgIGRvY3VtZW50YXRpb246IGVudHJ5LmRvY3VtZW50YXRpb24sXG4gICAgICAgICAgZGV0YWlsOiBlbnRyeS5kZXRhaWwsXG4gICAgICAgICAgY29tbWFuZDogdG9Db21tYW5kKGVudHJ5LmNvbW1hbmQpLFxuICAgICAgICAgIHJhbmdlOiB3b3JkUmFuZ2UsXG4gICAgICAgICAga2luZDogdG9Db21wbGV0aW9uSXRlbUtpbmQoZW50cnkua2luZClcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGVudHJ5LnRleHRFZGl0KSB7XG4gICAgICAgICAgaWYgKGlzSW5zZXJ0UmVwbGFjZUVkaXQoZW50cnkudGV4dEVkaXQpKSB7XG4gICAgICAgICAgICBpdGVtLnJhbmdlID0ge1xuICAgICAgICAgICAgICBpbnNlcnQ6IHRvUmFuZ2UoZW50cnkudGV4dEVkaXQuaW5zZXJ0KSxcbiAgICAgICAgICAgICAgcmVwbGFjZTogdG9SYW5nZShlbnRyeS50ZXh0RWRpdC5yZXBsYWNlKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXRlbS5yYW5nZSA9IHRvUmFuZ2UoZW50cnkudGV4dEVkaXQucmFuZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpdGVtLmluc2VydFRleHQgPSBlbnRyeS50ZXh0RWRpdC5uZXdUZXh0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbnRyeS5hZGRpdGlvbmFsVGV4dEVkaXRzKSB7XG4gICAgICAgICAgaXRlbS5hZGRpdGlvbmFsVGV4dEVkaXRzID0gZW50cnkuYWRkaXRpb25hbFRleHRFZGl0cy5tYXAodG9UZXh0RWRpdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVudHJ5Lmluc2VydFRleHRGb3JtYXQgPT09IEluc2VydFRleHRGb3JtYXQuU25pcHBldCkge1xuICAgICAgICAgIGl0ZW0uaW5zZXJ0VGV4dFJ1bGVzID0gbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLkNvbXBsZXRpb25JdGVtSW5zZXJ0VGV4dFJ1bGUuSW5zZXJ0QXNTbmlwcGV0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc0luY29tcGxldGU6IGluZm8uaXNJbmNvbXBsZXRlLFxuICAgICAgICBzdWdnZXN0aW9uczogaXRlbXNcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbn07XG5mdW5jdGlvbiBmcm9tUG9zaXRpb24ocG9zaXRpb24pIHtcbiAgaWYgKCFwb3NpdGlvbikge1xuICAgIHJldHVybiB2b2lkIDA7XG4gIH1cbiAgcmV0dXJuIHsgY2hhcmFjdGVyOiBwb3NpdGlvbi5jb2x1bW4gLSAxLCBsaW5lOiBwb3NpdGlvbi5saW5lTnVtYmVyIC0gMSB9O1xufVxuZnVuY3Rpb24gZnJvbVJhbmdlKHJhbmdlKSB7XG4gIGlmICghcmFuZ2UpIHtcbiAgICByZXR1cm4gdm9pZCAwO1xuICB9XG4gIHJldHVybiB7XG4gICAgc3RhcnQ6IHtcbiAgICAgIGxpbmU6IHJhbmdlLnN0YXJ0TGluZU51bWJlciAtIDEsXG4gICAgICBjaGFyYWN0ZXI6IHJhbmdlLnN0YXJ0Q29sdW1uIC0gMVxuICAgIH0sXG4gICAgZW5kOiB7IGxpbmU6IHJhbmdlLmVuZExpbmVOdW1iZXIgLSAxLCBjaGFyYWN0ZXI6IHJhbmdlLmVuZENvbHVtbiAtIDEgfVxuICB9O1xufVxuZnVuY3Rpb24gdG9SYW5nZShyYW5nZSkge1xuICBpZiAoIXJhbmdlKSB7XG4gICAgcmV0dXJuIHZvaWQgMDtcbiAgfVxuICByZXR1cm4gbmV3IG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLlJhbmdlKHJhbmdlLnN0YXJ0LmxpbmUgKyAxLCByYW5nZS5zdGFydC5jaGFyYWN0ZXIgKyAxLCByYW5nZS5lbmQubGluZSArIDEsIHJhbmdlLmVuZC5jaGFyYWN0ZXIgKyAxKTtcbn1cbmZ1bmN0aW9uIGlzSW5zZXJ0UmVwbGFjZUVkaXQoZWRpdCkge1xuICByZXR1cm4gdHlwZW9mIGVkaXQuaW5zZXJ0ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBlZGl0LnJlcGxhY2UgIT09IFwidW5kZWZpbmVkXCI7XG59XG5mdW5jdGlvbiB0b0NvbXBsZXRpb25JdGVtS2luZChraW5kKSB7XG4gIGNvbnN0IG1JdGVtS2luZCA9IG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmxhbmd1YWdlcy5Db21wbGV0aW9uSXRlbUtpbmQ7XG4gIHN3aXRjaCAoa2luZCkge1xuICAgIGNhc2UgQ29tcGxldGlvbkl0ZW1LaW5kLlRleHQ6XG4gICAgICByZXR1cm4gbUl0ZW1LaW5kLlRleHQ7XG4gICAgY2FzZSBDb21wbGV0aW9uSXRlbUtpbmQuTWV0aG9kOlxuICAgICAgcmV0dXJuIG1JdGVtS2luZC5NZXRob2Q7XG4gICAgY2FzZSBDb21wbGV0aW9uSXRlbUtpbmQuRnVuY3Rpb246XG4gICAgICByZXR1cm4gbUl0ZW1LaW5kLkZ1bmN0aW9uO1xuICAgIGNhc2UgQ29tcGxldGlvbkl0ZW1LaW5kLkNvbnN0cnVjdG9yOlxuICAgICAgcmV0dXJuIG1JdGVtS2luZC5Db25zdHJ1Y3RvcjtcbiAgICBjYXNlIENvbXBsZXRpb25JdGVtS2luZC5GaWVsZDpcbiAgICAgIHJldHVybiBtSXRlbUtpbmQuRmllbGQ7XG4gICAgY2FzZSBDb21wbGV0aW9uSXRlbUtpbmQuVmFyaWFibGU6XG4gICAgICByZXR1cm4gbUl0ZW1LaW5kLlZhcmlhYmxlO1xuICAgIGNhc2UgQ29tcGxldGlvbkl0ZW1LaW5kLkNsYXNzOlxuICAgICAgcmV0dXJuIG1JdGVtS2luZC5DbGFzcztcbiAgICBjYXNlIENvbXBsZXRpb25JdGVtS2luZC5JbnRlcmZhY2U6XG4gICAgICByZXR1cm4gbUl0ZW1LaW5kLkludGVyZmFjZTtcbiAgICBjYXNlIENvbXBsZXRpb25JdGVtS2luZC5Nb2R1bGU6XG4gICAgICByZXR1cm4gbUl0ZW1LaW5kLk1vZHVsZTtcbiAgICBjYXNlIENvbXBsZXRpb25JdGVtS2luZC5Qcm9wZXJ0eTpcbiAgICAgIHJldHVybiBtSXRlbUtpbmQuUHJvcGVydHk7XG4gICAgY2FzZSBDb21wbGV0aW9uSXRlbUtpbmQuVW5pdDpcbiAgICAgIHJldHVybiBtSXRlbUtpbmQuVW5pdDtcbiAgICBjYXNlIENvbXBsZXRpb25JdGVtS2luZC5WYWx1ZTpcbiAgICAgIHJldHVybiBtSXRlbUtpbmQuVmFsdWU7XG4gICAgY2FzZSBDb21wbGV0aW9uSXRlbUtpbmQuRW51bTpcbiAgICAgIHJldHVybiBtSXRlbUtpbmQuRW51bTtcbiAgICBjYXNlIENvbXBsZXRpb25JdGVtS2luZC5LZXl3b3JkOlxuICAgICAgcmV0dXJuIG1JdGVtS2luZC5LZXl3b3JkO1xuICAgIGNhc2UgQ29tcGxldGlvbkl0ZW1LaW5kLlNuaXBwZXQ6XG4gICAgICByZXR1cm4gbUl0ZW1LaW5kLlNuaXBwZXQ7XG4gICAgY2FzZSBDb21wbGV0aW9uSXRlbUtpbmQuQ29sb3I6XG4gICAgICByZXR1cm4gbUl0ZW1LaW5kLkNvbG9yO1xuICAgIGNhc2UgQ29tcGxldGlvbkl0ZW1LaW5kLkZpbGU6XG4gICAgICByZXR1cm4gbUl0ZW1LaW5kLkZpbGU7XG4gICAgY2FzZSBDb21wbGV0aW9uSXRlbUtpbmQuUmVmZXJlbmNlOlxuICAgICAgcmV0dXJuIG1JdGVtS2luZC5SZWZlcmVuY2U7XG4gIH1cbiAgcmV0dXJuIG1JdGVtS2luZC5Qcm9wZXJ0eTtcbn1cbmZ1bmN0aW9uIHRvVGV4dEVkaXQodGV4dEVkaXQpIHtcbiAgaWYgKCF0ZXh0RWRpdCkge1xuICAgIHJldHVybiB2b2lkIDA7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICByYW5nZTogdG9SYW5nZSh0ZXh0RWRpdC5yYW5nZSksXG4gICAgdGV4dDogdGV4dEVkaXQubmV3VGV4dFxuICB9O1xufVxuZnVuY3Rpb24gdG9Db21tYW5kKGMpIHtcbiAgcmV0dXJuIGMgJiYgYy5jb21tYW5kID09PSBcImVkaXRvci5hY3Rpb24udHJpZ2dlclN1Z2dlc3RcIiA/IHsgaWQ6IGMuY29tbWFuZCwgdGl0bGU6IGMudGl0bGUsIGFyZ3VtZW50czogYy5hcmd1bWVudHMgfSA6IHZvaWQgMDtcbn1cbnZhciBIb3ZlckFkYXB0ZXIgPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKF93b3JrZXIpIHtcbiAgICB0aGlzLl93b3JrZXIgPSBfd29ya2VyO1xuICB9XG4gIHByb3ZpZGVIb3Zlcihtb2RlbCwgcG9zaXRpb24sIHRva2VuKSB7XG4gICAgbGV0IHJlc291cmNlID0gbW9kZWwudXJpO1xuICAgIHJldHVybiB0aGlzLl93b3JrZXIocmVzb3VyY2UpLnRoZW4oKHdvcmtlcikgPT4ge1xuICAgICAgcmV0dXJuIHdvcmtlci5kb0hvdmVyKHJlc291cmNlLnRvU3RyaW5nKCksIGZyb21Qb3NpdGlvbihwb3NpdGlvbikpO1xuICAgIH0pLnRoZW4oKGluZm8pID0+IHtcbiAgICAgIGlmICghaW5mbykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICByYW5nZTogdG9SYW5nZShpbmZvLnJhbmdlKSxcbiAgICAgICAgY29udGVudHM6IHRvTWFya2VkU3RyaW5nQXJyYXkoaW5mby5jb250ZW50cylcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbn07XG5mdW5jdGlvbiBpc01hcmt1cENvbnRlbnQodGhpbmcpIHtcbiAgcmV0dXJuIHRoaW5nICYmIHR5cGVvZiB0aGluZyA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdGhpbmcua2luZCA9PT0gXCJzdHJpbmdcIjtcbn1cbmZ1bmN0aW9uIHRvTWFya2Rvd25TdHJpbmcoZW50cnkpIHtcbiAgaWYgKHR5cGVvZiBlbnRyeSA9PT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogZW50cnlcbiAgICB9O1xuICB9XG4gIGlmIChpc01hcmt1cENvbnRlbnQoZW50cnkpKSB7XG4gICAgaWYgKGVudHJ5LmtpbmQgPT09IFwicGxhaW50ZXh0XCIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiBlbnRyeS52YWx1ZS5yZXBsYWNlKC9bXFxcXGAqX3t9W1xcXSgpIytcXC0uIV0vZywgXCJcXFxcJCZcIilcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogZW50cnkudmFsdWVcbiAgICB9O1xuICB9XG4gIHJldHVybiB7IHZhbHVlOiBcImBgYFwiICsgZW50cnkubGFuZ3VhZ2UgKyBcIlxcblwiICsgZW50cnkudmFsdWUgKyBcIlxcbmBgYFxcblwiIH07XG59XG5mdW5jdGlvbiB0b01hcmtlZFN0cmluZ0FycmF5KGNvbnRlbnRzKSB7XG4gIGlmICghY29udGVudHMpIHtcbiAgICByZXR1cm4gdm9pZCAwO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KGNvbnRlbnRzKSkge1xuICAgIHJldHVybiBjb250ZW50cy5tYXAodG9NYXJrZG93blN0cmluZyk7XG4gIH1cbiAgcmV0dXJuIFt0b01hcmtkb3duU3RyaW5nKGNvbnRlbnRzKV07XG59XG52YXIgRG9jdW1lbnRIaWdobGlnaHRBZGFwdGVyID0gY2xhc3Mge1xuICBjb25zdHJ1Y3Rvcihfd29ya2VyKSB7XG4gICAgdGhpcy5fd29ya2VyID0gX3dvcmtlcjtcbiAgfVxuICBwcm92aWRlRG9jdW1lbnRIaWdobGlnaHRzKG1vZGVsLCBwb3NpdGlvbiwgdG9rZW4pIHtcbiAgICBjb25zdCByZXNvdXJjZSA9IG1vZGVsLnVyaTtcbiAgICByZXR1cm4gdGhpcy5fd29ya2VyKHJlc291cmNlKS50aGVuKCh3b3JrZXIpID0+IHdvcmtlci5maW5kRG9jdW1lbnRIaWdobGlnaHRzKHJlc291cmNlLnRvU3RyaW5nKCksIGZyb21Qb3NpdGlvbihwb3NpdGlvbikpKS50aGVuKChlbnRyaWVzKSA9PiB7XG4gICAgICBpZiAoIWVudHJpZXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVudHJpZXMubWFwKChlbnRyeSkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJhbmdlOiB0b1JhbmdlKGVudHJ5LnJhbmdlKSxcbiAgICAgICAgICBraW5kOiB0b0RvY3VtZW50SGlnaGxpZ2h0S2luZChlbnRyeS5raW5kKVxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn07XG5mdW5jdGlvbiB0b0RvY3VtZW50SGlnaGxpZ2h0S2luZChraW5kKSB7XG4gIHN3aXRjaCAoa2luZCkge1xuICAgIGNhc2UgRG9jdW1lbnRIaWdobGlnaHRLaW5kLlJlYWQ6XG4gICAgICByZXR1cm4gbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLkRvY3VtZW50SGlnaGxpZ2h0S2luZC5SZWFkO1xuICAgIGNhc2UgRG9jdW1lbnRIaWdobGlnaHRLaW5kLldyaXRlOlxuICAgICAgcmV0dXJuIG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmxhbmd1YWdlcy5Eb2N1bWVudEhpZ2hsaWdodEtpbmQuV3JpdGU7XG4gICAgY2FzZSBEb2N1bWVudEhpZ2hsaWdodEtpbmQuVGV4dDpcbiAgICAgIHJldHVybiBtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5sYW5ndWFnZXMuRG9jdW1lbnRIaWdobGlnaHRLaW5kLlRleHQ7XG4gIH1cbiAgcmV0dXJuIG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmxhbmd1YWdlcy5Eb2N1bWVudEhpZ2hsaWdodEtpbmQuVGV4dDtcbn1cbnZhciBEZWZpbml0aW9uQWRhcHRlciA9IGNsYXNzIHtcbiAgY29uc3RydWN0b3IoX3dvcmtlcikge1xuICAgIHRoaXMuX3dvcmtlciA9IF93b3JrZXI7XG4gIH1cbiAgcHJvdmlkZURlZmluaXRpb24obW9kZWwsIHBvc2l0aW9uLCB0b2tlbikge1xuICAgIGNvbnN0IHJlc291cmNlID0gbW9kZWwudXJpO1xuICAgIHJldHVybiB0aGlzLl93b3JrZXIocmVzb3VyY2UpLnRoZW4oKHdvcmtlcikgPT4ge1xuICAgICAgcmV0dXJuIHdvcmtlci5maW5kRGVmaW5pdGlvbihyZXNvdXJjZS50b1N0cmluZygpLCBmcm9tUG9zaXRpb24ocG9zaXRpb24pKTtcbiAgICB9KS50aGVuKChkZWZpbml0aW9uKSA9PiB7XG4gICAgICBpZiAoIWRlZmluaXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFt0b0xvY2F0aW9uKGRlZmluaXRpb24pXTtcbiAgICB9KTtcbiAgfVxufTtcbmZ1bmN0aW9uIHRvTG9jYXRpb24obG9jYXRpb24pIHtcbiAgcmV0dXJuIHtcbiAgICB1cmk6IG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLlVyaS5wYXJzZShsb2NhdGlvbi51cmkpLFxuICAgIHJhbmdlOiB0b1JhbmdlKGxvY2F0aW9uLnJhbmdlKVxuICB9O1xufVxudmFyIFJlZmVyZW5jZUFkYXB0ZXIgPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKF93b3JrZXIpIHtcbiAgICB0aGlzLl93b3JrZXIgPSBfd29ya2VyO1xuICB9XG4gIHByb3ZpZGVSZWZlcmVuY2VzKG1vZGVsLCBwb3NpdGlvbiwgY29udGV4dCwgdG9rZW4pIHtcbiAgICBjb25zdCByZXNvdXJjZSA9IG1vZGVsLnVyaTtcbiAgICByZXR1cm4gdGhpcy5fd29ya2VyKHJlc291cmNlKS50aGVuKCh3b3JrZXIpID0+IHtcbiAgICAgIHJldHVybiB3b3JrZXIuZmluZFJlZmVyZW5jZXMocmVzb3VyY2UudG9TdHJpbmcoKSwgZnJvbVBvc2l0aW9uKHBvc2l0aW9uKSk7XG4gICAgfSkudGhlbigoZW50cmllcykgPT4ge1xuICAgICAgaWYgKCFlbnRyaWVzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbnRyaWVzLm1hcCh0b0xvY2F0aW9uKTtcbiAgICB9KTtcbiAgfVxufTtcbnZhciBSZW5hbWVBZGFwdGVyID0gY2xhc3Mge1xuICBjb25zdHJ1Y3Rvcihfd29ya2VyKSB7XG4gICAgdGhpcy5fd29ya2VyID0gX3dvcmtlcjtcbiAgfVxuICBwcm92aWRlUmVuYW1lRWRpdHMobW9kZWwsIHBvc2l0aW9uLCBuZXdOYW1lLCB0b2tlbikge1xuICAgIGNvbnN0IHJlc291cmNlID0gbW9kZWwudXJpO1xuICAgIHJldHVybiB0aGlzLl93b3JrZXIocmVzb3VyY2UpLnRoZW4oKHdvcmtlcikgPT4ge1xuICAgICAgcmV0dXJuIHdvcmtlci5kb1JlbmFtZShyZXNvdXJjZS50b1N0cmluZygpLCBmcm9tUG9zaXRpb24ocG9zaXRpb24pLCBuZXdOYW1lKTtcbiAgICB9KS50aGVuKChlZGl0KSA9PiB7XG4gICAgICByZXR1cm4gdG9Xb3Jrc3BhY2VFZGl0KGVkaXQpO1xuICAgIH0pO1xuICB9XG59O1xuZnVuY3Rpb24gdG9Xb3Jrc3BhY2VFZGl0KGVkaXQpIHtcbiAgaWYgKCFlZGl0IHx8ICFlZGl0LmNoYW5nZXMpIHtcbiAgICByZXR1cm4gdm9pZCAwO1xuICB9XG4gIGxldCByZXNvdXJjZUVkaXRzID0gW107XG4gIGZvciAobGV0IHVyaSBpbiBlZGl0LmNoYW5nZXMpIHtcbiAgICBjb25zdCBfdXJpID0gbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMuVXJpLnBhcnNlKHVyaSk7XG4gICAgZm9yIChsZXQgZSBvZiBlZGl0LmNoYW5nZXNbdXJpXSkge1xuICAgICAgcmVzb3VyY2VFZGl0cy5wdXNoKHtcbiAgICAgICAgcmVzb3VyY2U6IF91cmksXG4gICAgICAgIHZlcnNpb25JZDogdm9pZCAwLFxuICAgICAgICB0ZXh0RWRpdDoge1xuICAgICAgICAgIHJhbmdlOiB0b1JhbmdlKGUucmFuZ2UpLFxuICAgICAgICAgIHRleHQ6IGUubmV3VGV4dFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBlZGl0czogcmVzb3VyY2VFZGl0c1xuICB9O1xufVxudmFyIERvY3VtZW50U3ltYm9sQWRhcHRlciA9IGNsYXNzIHtcbiAgY29uc3RydWN0b3IoX3dvcmtlcikge1xuICAgIHRoaXMuX3dvcmtlciA9IF93b3JrZXI7XG4gIH1cbiAgcHJvdmlkZURvY3VtZW50U3ltYm9scyhtb2RlbCwgdG9rZW4pIHtcbiAgICBjb25zdCByZXNvdXJjZSA9IG1vZGVsLnVyaTtcbiAgICByZXR1cm4gdGhpcy5fd29ya2VyKHJlc291cmNlKS50aGVuKCh3b3JrZXIpID0+IHdvcmtlci5maW5kRG9jdW1lbnRTeW1ib2xzKHJlc291cmNlLnRvU3RyaW5nKCkpKS50aGVuKChpdGVtcykgPT4ge1xuICAgICAgaWYgKCFpdGVtcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlbXMubWFwKChpdGVtKSA9PiAoe1xuICAgICAgICBuYW1lOiBpdGVtLm5hbWUsXG4gICAgICAgIGRldGFpbDogXCJcIixcbiAgICAgICAgY29udGFpbmVyTmFtZTogaXRlbS5jb250YWluZXJOYW1lLFxuICAgICAgICBraW5kOiB0b1N5bWJvbEtpbmQoaXRlbS5raW5kKSxcbiAgICAgICAgcmFuZ2U6IHRvUmFuZ2UoaXRlbS5sb2NhdGlvbi5yYW5nZSksXG4gICAgICAgIHNlbGVjdGlvblJhbmdlOiB0b1JhbmdlKGl0ZW0ubG9jYXRpb24ucmFuZ2UpLFxuICAgICAgICB0YWdzOiBbXVxuICAgICAgfSkpO1xuICAgIH0pO1xuICB9XG59O1xuZnVuY3Rpb24gdG9TeW1ib2xLaW5kKGtpbmQpIHtcbiAgbGV0IG1LaW5kID0gbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLlN5bWJvbEtpbmQ7XG4gIHN3aXRjaCAoa2luZCkge1xuICAgIGNhc2UgU3ltYm9sS2luZC5GaWxlOlxuICAgICAgcmV0dXJuIG1LaW5kLkFycmF5O1xuICAgIGNhc2UgU3ltYm9sS2luZC5Nb2R1bGU6XG4gICAgICByZXR1cm4gbUtpbmQuTW9kdWxlO1xuICAgIGNhc2UgU3ltYm9sS2luZC5OYW1lc3BhY2U6XG4gICAgICByZXR1cm4gbUtpbmQuTmFtZXNwYWNlO1xuICAgIGNhc2UgU3ltYm9sS2luZC5QYWNrYWdlOlxuICAgICAgcmV0dXJuIG1LaW5kLlBhY2thZ2U7XG4gICAgY2FzZSBTeW1ib2xLaW5kLkNsYXNzOlxuICAgICAgcmV0dXJuIG1LaW5kLkNsYXNzO1xuICAgIGNhc2UgU3ltYm9sS2luZC5NZXRob2Q6XG4gICAgICByZXR1cm4gbUtpbmQuTWV0aG9kO1xuICAgIGNhc2UgU3ltYm9sS2luZC5Qcm9wZXJ0eTpcbiAgICAgIHJldHVybiBtS2luZC5Qcm9wZXJ0eTtcbiAgICBjYXNlIFN5bWJvbEtpbmQuRmllbGQ6XG4gICAgICByZXR1cm4gbUtpbmQuRmllbGQ7XG4gICAgY2FzZSBTeW1ib2xLaW5kLkNvbnN0cnVjdG9yOlxuICAgICAgcmV0dXJuIG1LaW5kLkNvbnN0cnVjdG9yO1xuICAgIGNhc2UgU3ltYm9sS2luZC5FbnVtOlxuICAgICAgcmV0dXJuIG1LaW5kLkVudW07XG4gICAgY2FzZSBTeW1ib2xLaW5kLkludGVyZmFjZTpcbiAgICAgIHJldHVybiBtS2luZC5JbnRlcmZhY2U7XG4gICAgY2FzZSBTeW1ib2xLaW5kLkZ1bmN0aW9uOlxuICAgICAgcmV0dXJuIG1LaW5kLkZ1bmN0aW9uO1xuICAgIGNhc2UgU3ltYm9sS2luZC5WYXJpYWJsZTpcbiAgICAgIHJldHVybiBtS2luZC5WYXJpYWJsZTtcbiAgICBjYXNlIFN5bWJvbEtpbmQuQ29uc3RhbnQ6XG4gICAgICByZXR1cm4gbUtpbmQuQ29uc3RhbnQ7XG4gICAgY2FzZSBTeW1ib2xLaW5kLlN0cmluZzpcbiAgICAgIHJldHVybiBtS2luZC5TdHJpbmc7XG4gICAgY2FzZSBTeW1ib2xLaW5kLk51bWJlcjpcbiAgICAgIHJldHVybiBtS2luZC5OdW1iZXI7XG4gICAgY2FzZSBTeW1ib2xLaW5kLkJvb2xlYW46XG4gICAgICByZXR1cm4gbUtpbmQuQm9vbGVhbjtcbiAgICBjYXNlIFN5bWJvbEtpbmQuQXJyYXk6XG4gICAgICByZXR1cm4gbUtpbmQuQXJyYXk7XG4gIH1cbiAgcmV0dXJuIG1LaW5kLkZ1bmN0aW9uO1xufVxudmFyIERvY3VtZW50TGlua0FkYXB0ZXIgPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKF93b3JrZXIpIHtcbiAgICB0aGlzLl93b3JrZXIgPSBfd29ya2VyO1xuICB9XG4gIHByb3ZpZGVMaW5rcyhtb2RlbCwgdG9rZW4pIHtcbiAgICBjb25zdCByZXNvdXJjZSA9IG1vZGVsLnVyaTtcbiAgICByZXR1cm4gdGhpcy5fd29ya2VyKHJlc291cmNlKS50aGVuKCh3b3JrZXIpID0+IHdvcmtlci5maW5kRG9jdW1lbnRMaW5rcyhyZXNvdXJjZS50b1N0cmluZygpKSkudGhlbigoaXRlbXMpID0+IHtcbiAgICAgIGlmICghaXRlbXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGlua3M6IGl0ZW1zLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgICByYW5nZTogdG9SYW5nZShpdGVtLnJhbmdlKSxcbiAgICAgICAgICB1cmw6IGl0ZW0udGFyZ2V0XG4gICAgICAgIH0pKVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxufTtcbnZhciBEb2N1bWVudEZvcm1hdHRpbmdFZGl0UHJvdmlkZXIgPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKF93b3JrZXIpIHtcbiAgICB0aGlzLl93b3JrZXIgPSBfd29ya2VyO1xuICB9XG4gIHByb3ZpZGVEb2N1bWVudEZvcm1hdHRpbmdFZGl0cyhtb2RlbCwgb3B0aW9ucywgdG9rZW4pIHtcbiAgICBjb25zdCByZXNvdXJjZSA9IG1vZGVsLnVyaTtcbiAgICByZXR1cm4gdGhpcy5fd29ya2VyKHJlc291cmNlKS50aGVuKCh3b3JrZXIpID0+IHtcbiAgICAgIHJldHVybiB3b3JrZXIuZm9ybWF0KHJlc291cmNlLnRvU3RyaW5nKCksIG51bGwsIGZyb21Gb3JtYXR0aW5nT3B0aW9ucyhvcHRpb25zKSkudGhlbigoZWRpdHMpID0+IHtcbiAgICAgICAgaWYgKCFlZGl0cyB8fCBlZGl0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVkaXRzLm1hcCh0b1RleHRFZGl0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59O1xudmFyIERvY3VtZW50UmFuZ2VGb3JtYXR0aW5nRWRpdFByb3ZpZGVyID0gY2xhc3Mge1xuICBjb25zdHJ1Y3Rvcihfd29ya2VyKSB7XG4gICAgdGhpcy5fd29ya2VyID0gX3dvcmtlcjtcbiAgfVxuICBjYW5Gb3JtYXRNdWx0aXBsZVJhbmdlcyA9IGZhbHNlO1xuICBwcm92aWRlRG9jdW1lbnRSYW5nZUZvcm1hdHRpbmdFZGl0cyhtb2RlbCwgcmFuZ2UsIG9wdGlvbnMsIHRva2VuKSB7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBtb2RlbC51cmk7XG4gICAgcmV0dXJuIHRoaXMuX3dvcmtlcihyZXNvdXJjZSkudGhlbigod29ya2VyKSA9PiB7XG4gICAgICByZXR1cm4gd29ya2VyLmZvcm1hdChyZXNvdXJjZS50b1N0cmluZygpLCBmcm9tUmFuZ2UocmFuZ2UpLCBmcm9tRm9ybWF0dGluZ09wdGlvbnMob3B0aW9ucykpLnRoZW4oKGVkaXRzKSA9PiB7XG4gICAgICAgIGlmICghZWRpdHMgfHwgZWRpdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlZGl0cy5tYXAodG9UZXh0RWRpdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcbmZ1bmN0aW9uIGZyb21Gb3JtYXR0aW5nT3B0aW9ucyhvcHRpb25zKSB7XG4gIHJldHVybiB7XG4gICAgdGFiU2l6ZTogb3B0aW9ucy50YWJTaXplLFxuICAgIGluc2VydFNwYWNlczogb3B0aW9ucy5pbnNlcnRTcGFjZXNcbiAgfTtcbn1cbnZhciBEb2N1bWVudENvbG9yQWRhcHRlciA9IGNsYXNzIHtcbiAgY29uc3RydWN0b3IoX3dvcmtlcikge1xuICAgIHRoaXMuX3dvcmtlciA9IF93b3JrZXI7XG4gIH1cbiAgcHJvdmlkZURvY3VtZW50Q29sb3JzKG1vZGVsLCB0b2tlbikge1xuICAgIGNvbnN0IHJlc291cmNlID0gbW9kZWwudXJpO1xuICAgIHJldHVybiB0aGlzLl93b3JrZXIocmVzb3VyY2UpLnRoZW4oKHdvcmtlcikgPT4gd29ya2VyLmZpbmREb2N1bWVudENvbG9ycyhyZXNvdXJjZS50b1N0cmluZygpKSkudGhlbigoaW5mb3MpID0+IHtcbiAgICAgIGlmICghaW5mb3MpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGluZm9zLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgY29sb3I6IGl0ZW0uY29sb3IsXG4gICAgICAgIHJhbmdlOiB0b1JhbmdlKGl0ZW0ucmFuZ2UpXG4gICAgICB9KSk7XG4gICAgfSk7XG4gIH1cbiAgcHJvdmlkZUNvbG9yUHJlc2VudGF0aW9ucyhtb2RlbCwgaW5mbywgdG9rZW4pIHtcbiAgICBjb25zdCByZXNvdXJjZSA9IG1vZGVsLnVyaTtcbiAgICByZXR1cm4gdGhpcy5fd29ya2VyKHJlc291cmNlKS50aGVuKCh3b3JrZXIpID0+IHdvcmtlci5nZXRDb2xvclByZXNlbnRhdGlvbnMocmVzb3VyY2UudG9TdHJpbmcoKSwgaW5mby5jb2xvciwgZnJvbVJhbmdlKGluZm8ucmFuZ2UpKSkudGhlbigocHJlc2VudGF0aW9ucykgPT4ge1xuICAgICAgaWYgKCFwcmVzZW50YXRpb25zKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcmVzZW50YXRpb25zLm1hcCgocHJlc2VudGF0aW9uKSA9PiB7XG4gICAgICAgIGxldCBpdGVtID0ge1xuICAgICAgICAgIGxhYmVsOiBwcmVzZW50YXRpb24ubGFiZWxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHByZXNlbnRhdGlvbi50ZXh0RWRpdCkge1xuICAgICAgICAgIGl0ZW0udGV4dEVkaXQgPSB0b1RleHRFZGl0KHByZXNlbnRhdGlvbi50ZXh0RWRpdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByZXNlbnRhdGlvbi5hZGRpdGlvbmFsVGV4dEVkaXRzKSB7XG4gICAgICAgICAgaXRlbS5hZGRpdGlvbmFsVGV4dEVkaXRzID0gcHJlc2VudGF0aW9uLmFkZGl0aW9uYWxUZXh0RWRpdHMubWFwKHRvVGV4dEVkaXQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn07XG52YXIgRm9sZGluZ1JhbmdlQWRhcHRlciA9IGNsYXNzIHtcbiAgY29uc3RydWN0b3IoX3dvcmtlcikge1xuICAgIHRoaXMuX3dvcmtlciA9IF93b3JrZXI7XG4gIH1cbiAgcHJvdmlkZUZvbGRpbmdSYW5nZXMobW9kZWwsIGNvbnRleHQsIHRva2VuKSB7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBtb2RlbC51cmk7XG4gICAgcmV0dXJuIHRoaXMuX3dvcmtlcihyZXNvdXJjZSkudGhlbigod29ya2VyKSA9PiB3b3JrZXIuZ2V0Rm9sZGluZ1JhbmdlcyhyZXNvdXJjZS50b1N0cmluZygpLCBjb250ZXh0KSkudGhlbigocmFuZ2VzKSA9PiB7XG4gICAgICBpZiAoIXJhbmdlcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gcmFuZ2VzLm1hcCgocmFuZ2UpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgICAgIHN0YXJ0OiByYW5nZS5zdGFydExpbmUgKyAxLFxuICAgICAgICAgIGVuZDogcmFuZ2UuZW5kTGluZSArIDFcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGVvZiByYW5nZS5raW5kICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgcmVzdWx0LmtpbmQgPSB0b0ZvbGRpbmdSYW5nZUtpbmQocmFuZ2Uua2luZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59O1xuZnVuY3Rpb24gdG9Gb2xkaW5nUmFuZ2VLaW5kKGtpbmQpIHtcbiAgc3dpdGNoIChraW5kKSB7XG4gICAgY2FzZSBGb2xkaW5nUmFuZ2VLaW5kLkNvbW1lbnQ6XG4gICAgICByZXR1cm4gbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLkZvbGRpbmdSYW5nZUtpbmQuQ29tbWVudDtcbiAgICBjYXNlIEZvbGRpbmdSYW5nZUtpbmQuSW1wb3J0czpcbiAgICAgIHJldHVybiBtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5sYW5ndWFnZXMuRm9sZGluZ1JhbmdlS2luZC5JbXBvcnRzO1xuICAgIGNhc2UgRm9sZGluZ1JhbmdlS2luZC5SZWdpb246XG4gICAgICByZXR1cm4gbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLkZvbGRpbmdSYW5nZUtpbmQuUmVnaW9uO1xuICB9XG4gIHJldHVybiB2b2lkIDA7XG59XG52YXIgU2VsZWN0aW9uUmFuZ2VBZGFwdGVyID0gY2xhc3Mge1xuICBjb25zdHJ1Y3Rvcihfd29ya2VyKSB7XG4gICAgdGhpcy5fd29ya2VyID0gX3dvcmtlcjtcbiAgfVxuICBwcm92aWRlU2VsZWN0aW9uUmFuZ2VzKG1vZGVsLCBwb3NpdGlvbnMsIHRva2VuKSB7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBtb2RlbC51cmk7XG4gICAgcmV0dXJuIHRoaXMuX3dvcmtlcihyZXNvdXJjZSkudGhlbigod29ya2VyKSA9PiB3b3JrZXIuZ2V0U2VsZWN0aW9uUmFuZ2VzKHJlc291cmNlLnRvU3RyaW5nKCksIHBvc2l0aW9ucy5tYXAoZnJvbVBvc2l0aW9uKSkpLnRoZW4oKHNlbGVjdGlvblJhbmdlcykgPT4ge1xuICAgICAgaWYgKCFzZWxlY3Rpb25SYW5nZXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGVjdGlvblJhbmdlcy5tYXAoKHNlbGVjdGlvblJhbmdlKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICB3aGlsZSAoc2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgICAgICByZXN1bHQucHVzaCh7IHJhbmdlOiB0b1JhbmdlKHNlbGVjdGlvblJhbmdlLnJhbmdlKSB9KTtcbiAgICAgICAgICBzZWxlY3Rpb25SYW5nZSA9IHNlbGVjdGlvblJhbmdlLnBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn07XG5cbi8vIHNyYy9sYW5ndWFnZS9jc3MvY3NzTW9kZS50c1xuZnVuY3Rpb24gc2V0dXBNb2RlKGRlZmF1bHRzKSB7XG4gIGNvbnN0IGRpc3Bvc2FibGVzID0gW107XG4gIGNvbnN0IHByb3ZpZGVycyA9IFtdO1xuICBjb25zdCBjbGllbnQgPSBuZXcgV29ya2VyTWFuYWdlcihkZWZhdWx0cyk7XG4gIGRpc3Bvc2FibGVzLnB1c2goY2xpZW50KTtcbiAgY29uc3Qgd29ya2VyID0gKC4uLnVyaXMpID0+IHtcbiAgICByZXR1cm4gY2xpZW50LmdldExhbmd1YWdlU2VydmljZVdvcmtlciguLi51cmlzKTtcbiAgfTtcbiAgZnVuY3Rpb24gcmVnaXN0ZXJQcm92aWRlcnMoKSB7XG4gICAgY29uc3QgeyBsYW5ndWFnZUlkLCBtb2RlQ29uZmlndXJhdGlvbiB9ID0gZGVmYXVsdHM7XG4gICAgZGlzcG9zZUFsbChwcm92aWRlcnMpO1xuICAgIGlmIChtb2RlQ29uZmlndXJhdGlvbi5jb21wbGV0aW9uSXRlbXMpIHtcbiAgICAgIHByb3ZpZGVycy5wdXNoKG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmxhbmd1YWdlcy5yZWdpc3RlckNvbXBsZXRpb25JdGVtUHJvdmlkZXIobGFuZ3VhZ2VJZCwgbmV3IENvbXBsZXRpb25BZGFwdGVyKHdvcmtlciwgW1wiL1wiLCBcIi1cIiwgXCI6XCJdKSkpO1xuICAgIH1cbiAgICBpZiAobW9kZUNvbmZpZ3VyYXRpb24uaG92ZXJzKSB7XG4gICAgICBwcm92aWRlcnMucHVzaChtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5sYW5ndWFnZXMucmVnaXN0ZXJIb3ZlclByb3ZpZGVyKGxhbmd1YWdlSWQsIG5ldyBIb3ZlckFkYXB0ZXIod29ya2VyKSkpO1xuICAgIH1cbiAgICBpZiAobW9kZUNvbmZpZ3VyYXRpb24uZG9jdW1lbnRIaWdobGlnaHRzKSB7XG4gICAgICBwcm92aWRlcnMucHVzaChtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5sYW5ndWFnZXMucmVnaXN0ZXJEb2N1bWVudEhpZ2hsaWdodFByb3ZpZGVyKGxhbmd1YWdlSWQsIG5ldyBEb2N1bWVudEhpZ2hsaWdodEFkYXB0ZXIod29ya2VyKSkpO1xuICAgIH1cbiAgICBpZiAobW9kZUNvbmZpZ3VyYXRpb24uZGVmaW5pdGlvbnMpIHtcbiAgICAgIHByb3ZpZGVycy5wdXNoKG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmxhbmd1YWdlcy5yZWdpc3RlckRlZmluaXRpb25Qcm92aWRlcihsYW5ndWFnZUlkLCBuZXcgRGVmaW5pdGlvbkFkYXB0ZXIod29ya2VyKSkpO1xuICAgIH1cbiAgICBpZiAobW9kZUNvbmZpZ3VyYXRpb24ucmVmZXJlbmNlcykge1xuICAgICAgcHJvdmlkZXJzLnB1c2gobW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLnJlZ2lzdGVyUmVmZXJlbmNlUHJvdmlkZXIobGFuZ3VhZ2VJZCwgbmV3IFJlZmVyZW5jZUFkYXB0ZXIod29ya2VyKSkpO1xuICAgIH1cbiAgICBpZiAobW9kZUNvbmZpZ3VyYXRpb24uZG9jdW1lbnRTeW1ib2xzKSB7XG4gICAgICBwcm92aWRlcnMucHVzaChtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5sYW5ndWFnZXMucmVnaXN0ZXJEb2N1bWVudFN5bWJvbFByb3ZpZGVyKGxhbmd1YWdlSWQsIG5ldyBEb2N1bWVudFN5bWJvbEFkYXB0ZXIod29ya2VyKSkpO1xuICAgIH1cbiAgICBpZiAobW9kZUNvbmZpZ3VyYXRpb24ucmVuYW1lKSB7XG4gICAgICBwcm92aWRlcnMucHVzaChtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5sYW5ndWFnZXMucmVnaXN0ZXJSZW5hbWVQcm92aWRlcihsYW5ndWFnZUlkLCBuZXcgUmVuYW1lQWRhcHRlcih3b3JrZXIpKSk7XG4gICAgfVxuICAgIGlmIChtb2RlQ29uZmlndXJhdGlvbi5jb2xvcnMpIHtcbiAgICAgIHByb3ZpZGVycy5wdXNoKG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmxhbmd1YWdlcy5yZWdpc3RlckNvbG9yUHJvdmlkZXIobGFuZ3VhZ2VJZCwgbmV3IERvY3VtZW50Q29sb3JBZGFwdGVyKHdvcmtlcikpKTtcbiAgICB9XG4gICAgaWYgKG1vZGVDb25maWd1cmF0aW9uLmZvbGRpbmdSYW5nZXMpIHtcbiAgICAgIHByb3ZpZGVycy5wdXNoKG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmxhbmd1YWdlcy5yZWdpc3RlckZvbGRpbmdSYW5nZVByb3ZpZGVyKGxhbmd1YWdlSWQsIG5ldyBGb2xkaW5nUmFuZ2VBZGFwdGVyKHdvcmtlcikpKTtcbiAgICB9XG4gICAgaWYgKG1vZGVDb25maWd1cmF0aW9uLmRpYWdub3N0aWNzKSB7XG4gICAgICBwcm92aWRlcnMucHVzaChuZXcgRGlhZ25vc3RpY3NBZGFwdGVyKGxhbmd1YWdlSWQsIHdvcmtlciwgZGVmYXVsdHMub25EaWRDaGFuZ2UpKTtcbiAgICB9XG4gICAgaWYgKG1vZGVDb25maWd1cmF0aW9uLnNlbGVjdGlvblJhbmdlcykge1xuICAgICAgcHJvdmlkZXJzLnB1c2gobW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLnJlZ2lzdGVyU2VsZWN0aW9uUmFuZ2VQcm92aWRlcihsYW5ndWFnZUlkLCBuZXcgU2VsZWN0aW9uUmFuZ2VBZGFwdGVyKHdvcmtlcikpKTtcbiAgICB9XG4gICAgaWYgKG1vZGVDb25maWd1cmF0aW9uLmRvY3VtZW50Rm9ybWF0dGluZ0VkaXRzKSB7XG4gICAgICBwcm92aWRlcnMucHVzaChtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5sYW5ndWFnZXMucmVnaXN0ZXJEb2N1bWVudEZvcm1hdHRpbmdFZGl0UHJvdmlkZXIobGFuZ3VhZ2VJZCwgbmV3IERvY3VtZW50Rm9ybWF0dGluZ0VkaXRQcm92aWRlcih3b3JrZXIpKSk7XG4gICAgfVxuICAgIGlmIChtb2RlQ29uZmlndXJhdGlvbi5kb2N1bWVudFJhbmdlRm9ybWF0dGluZ0VkaXRzKSB7XG4gICAgICBwcm92aWRlcnMucHVzaChtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5sYW5ndWFnZXMucmVnaXN0ZXJEb2N1bWVudFJhbmdlRm9ybWF0dGluZ0VkaXRQcm92aWRlcihsYW5ndWFnZUlkLCBuZXcgRG9jdW1lbnRSYW5nZUZvcm1hdHRpbmdFZGl0UHJvdmlkZXIod29ya2VyKSkpO1xuICAgIH1cbiAgfVxuICByZWdpc3RlclByb3ZpZGVycygpO1xuICBkaXNwb3NhYmxlcy5wdXNoKGFzRGlzcG9zYWJsZShwcm92aWRlcnMpKTtcbiAgcmV0dXJuIGFzRGlzcG9zYWJsZShkaXNwb3NhYmxlcyk7XG59XG5mdW5jdGlvbiBhc0Rpc3Bvc2FibGUoZGlzcG9zYWJsZXMpIHtcbiAgcmV0dXJuIHsgZGlzcG9zZTogKCkgPT4gZGlzcG9zZUFsbChkaXNwb3NhYmxlcykgfTtcbn1cbmZ1bmN0aW9uIGRpc3Bvc2VBbGwoZGlzcG9zYWJsZXMpIHtcbiAgd2hpbGUgKGRpc3Bvc2FibGVzLmxlbmd0aCkge1xuICAgIGRpc3Bvc2FibGVzLnBvcCgpLmRpc3Bvc2UoKTtcbiAgfVxufVxuZXhwb3J0IHtcbiAgQ29tcGxldGlvbkFkYXB0ZXIsXG4gIERlZmluaXRpb25BZGFwdGVyLFxuICBEaWFnbm9zdGljc0FkYXB0ZXIsXG4gIERvY3VtZW50Q29sb3JBZGFwdGVyLFxuICBEb2N1bWVudEZvcm1hdHRpbmdFZGl0UHJvdmlkZXIsXG4gIERvY3VtZW50SGlnaGxpZ2h0QWRhcHRlcixcbiAgRG9jdW1lbnRMaW5rQWRhcHRlcixcbiAgRG9jdW1lbnRSYW5nZUZvcm1hdHRpbmdFZGl0UHJvdmlkZXIsXG4gIERvY3VtZW50U3ltYm9sQWRhcHRlcixcbiAgRm9sZGluZ1JhbmdlQWRhcHRlcixcbiAgSG92ZXJBZGFwdGVyLFxuICBSZWZlcmVuY2VBZGFwdGVyLFxuICBSZW5hbWVBZGFwdGVyLFxuICBTZWxlY3Rpb25SYW5nZUFkYXB0ZXIsXG4gIFdvcmtlck1hbmFnZXIsXG4gIGZyb21Qb3NpdGlvbixcbiAgZnJvbVJhbmdlLFxuICBzZXR1cE1vZGUsXG4gIHRvUmFuZ2UsXG4gIHRvVGV4dEVkaXRcbn07XG4iXSwibmFtZXMiOlsiX19kZWZQcm9wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT0EsSUFBSUEsYUFBWSxPQUFPO0FBQ3ZCLElBQUksbUJBQW1CLE9BQU87QUFDOUIsSUFBSSxvQkFBb0IsT0FBTztBQUMvQixJQUFJLGVBQWUsT0FBTyxVQUFVO0FBQ3BDLElBQUksY0FBYyxDQUFDLElBQUksTUFBTSxRQUFRLFNBQVM7QUFDNUMsTUFBSSxRQUFRLE9BQU8sU0FBUyxZQUFZLE9BQU8sU0FBUyxZQUFZO0FBQ2xFLGFBQVMsT0FBTyxrQkFBa0IsSUFBSTtBQUNwQyxVQUFJLENBQUMsYUFBYSxLQUFLLElBQUksR0FBRyxLQUFLLFFBQVE7QUFDekMsUUFBQUEsV0FBVSxJQUFJLEtBQUssRUFBRSxLQUFLLE1BQU0sS0FBSyxHQUFHLEdBQUcsWUFBWSxFQUFFLE9BQU8saUJBQWlCLE1BQU0sR0FBRyxNQUFNLEtBQUssV0FBVSxDQUFFO0FBQUEsRUFDdEg7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
