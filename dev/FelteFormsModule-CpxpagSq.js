/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a, _b;
const global$1 = globalThis;
const debugLogEvent = (event) => {
  const shouldEmit = global$1.emitLitDebugLogEvents;
  if (!shouldEmit) {
    return;
  }
  global$1.dispatchEvent(new CustomEvent("lit-debug", {
    detail: event
  }));
};
let debugLogRenderId = 0;
let issueWarning;
{
  global$1.litIssuedWarnings ?? (global$1.litIssuedWarnings = /* @__PURE__ */ new Set());
  issueWarning = (code, warning) => {
    warning += code ? ` See https://lit.dev/msg/${code} for more information.` : "";
    if (!global$1.litIssuedWarnings.has(warning)) {
      console.warn(warning);
      global$1.litIssuedWarnings.add(warning);
    }
  };
  issueWarning("dev-mode", `Lit is in dev mode. Not recommended for production!`);
}
const wrap = ((_a = global$1.ShadyDOM) == null ? void 0 : _a.inUse) && ((_b = global$1.ShadyDOM) == null ? void 0 : _b.noPatch) === true ? global$1.ShadyDOM.wrap : (node) => node;
const trustedTypes = global$1.trustedTypes;
const policy = trustedTypes ? trustedTypes.createPolicy("lit-html", {
  createHTML: (s) => s
}) : void 0;
const identityFunction = (value) => value;
const noopSanitizer = (_node, _name, _type) => identityFunction;
const setSanitizer = (newSanitizer) => {
  if (sanitizerFactoryInternal !== noopSanitizer) {
    throw new Error(`Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.`);
  }
  sanitizerFactoryInternal = newSanitizer;
};
const _testOnlyClearSanitizerFactoryDoNotCallOrElse = () => {
  sanitizerFactoryInternal = noopSanitizer;
};
const createSanitizer = (node, name, type) => {
  return sanitizerFactoryInternal(node, name, type);
};
const boundAttributeSuffix = "$lit$";
const marker = `lit$${Math.random().toFixed(9).slice(2)}$`;
const markerMatch = "?" + marker;
const nodeMarker = `<${markerMatch}>`;
const d = document;
const createMarker = () => d.createComment("");
const isPrimitive = (value) => value === null || typeof value != "object" && typeof value != "function";
const isArray = Array.isArray;
const isIterable = (value) => isArray(value) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
typeof (value == null ? void 0 : value[Symbol.iterator]) === "function";
const SPACE_CHAR = `[ 	
\f\r]`;
const ATTR_VALUE_CHAR = `[^ 	
\f\r"'\`<>=]`;
const NAME_CHAR = `[^\\s"'>=/]`;
const textEndRegex = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
const COMMENT_START = 1;
const TAG_NAME = 2;
const DYNAMIC_TAG_NAME = 3;
const commentEndRegex = /-->/g;
const comment2EndRegex = />/g;
const tagEndRegex = new RegExp(`>|${SPACE_CHAR}(?:(${NAME_CHAR}+)(${SPACE_CHAR}*=${SPACE_CHAR}*(?:${ATTR_VALUE_CHAR}|("|')|))|$)`, "g");
const ENTIRE_MATCH = 0;
const ATTRIBUTE_NAME = 1;
const SPACES_AND_EQUALS = 2;
const QUOTE_CHAR = 3;
const singleQuoteAttrEndRegex = /'/g;
const doubleQuoteAttrEndRegex = /"/g;
const rawTextElement = /^(?:script|style|textarea|title)$/i;
const HTML_RESULT = 1;
const SVG_RESULT = 2;
const MATHML_RESULT = 3;
const ATTRIBUTE_PART = 1;
const CHILD_PART = 2;
const PROPERTY_PART = 3;
const BOOLEAN_ATTRIBUTE_PART = 4;
const EVENT_PART = 5;
const ELEMENT_PART = 6;
const COMMENT_PART = 7;
const tag = (type) => (strings, ...values) => {
  if (strings.some((s) => s === void 0)) {
    console.warn("Some template strings are undefined.\nThis is probably caused by illegal octal escape sequences.");
  }
  {
    if (values.some((val) => val == null ? void 0 : val["_$litStatic$"])) {
      issueWarning("", `Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.
Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`);
    }
  }
  return {
    // This property needs to remain unminified.
    ["_$litType$"]: type,
    strings,
    values
  };
};
const html = tag(HTML_RESULT);
const noChange = Symbol.for("lit-noChange");
const nothing = Symbol.for("lit-nothing");
const templateCache = /* @__PURE__ */ new WeakMap();
const walker = d.createTreeWalker(
  d,
  129
  /* NodeFilter.SHOW_{ELEMENT|COMMENT} */
);
let sanitizerFactoryInternal = noopSanitizer;
function trustFromTemplateString(tsa, stringFromTSA) {
  if (!isArray(tsa) || !tsa.hasOwnProperty("raw")) {
    let message = "invalid template strings array";
    {
      message = `
          Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.
        `.trim().replace(/\n */g, "\n");
    }
    throw new Error(message);
  }
  return policy !== void 0 ? policy.createHTML(stringFromTSA) : stringFromTSA;
}
const getTemplateHtml = (strings, type) => {
  const l = strings.length - 1;
  const attrNames = [];
  let html2 = type === SVG_RESULT ? "<svg>" : type === MATHML_RESULT ? "<math>" : "";
  let rawTextEndRegex;
  let regex = textEndRegex;
  for (let i = 0; i < l; i++) {
    const s = strings[i];
    let attrNameEndIndex = -1;
    let attrName;
    let lastIndex = 0;
    let match;
    while (lastIndex < s.length) {
      regex.lastIndex = lastIndex;
      match = regex.exec(s);
      if (match === null) {
        break;
      }
      lastIndex = regex.lastIndex;
      if (regex === textEndRegex) {
        if (match[COMMENT_START] === "!--") {
          regex = commentEndRegex;
        } else if (match[COMMENT_START] !== void 0) {
          regex = comment2EndRegex;
        } else if (match[TAG_NAME] !== void 0) {
          if (rawTextElement.test(match[TAG_NAME])) {
            rawTextEndRegex = new RegExp(`</${match[TAG_NAME]}`, "g");
          }
          regex = tagEndRegex;
        } else if (match[DYNAMIC_TAG_NAME] !== void 0) {
          {
            throw new Error("Bindings in tag names are not supported. Please use static templates instead. See https://lit.dev/docs/templates/expressions/#static-expressions");
          }
        }
      } else if (regex === tagEndRegex) {
        if (match[ENTIRE_MATCH] === ">") {
          regex = rawTextEndRegex ?? textEndRegex;
          attrNameEndIndex = -1;
        } else if (match[ATTRIBUTE_NAME] === void 0) {
          attrNameEndIndex = -2;
        } else {
          attrNameEndIndex = regex.lastIndex - match[SPACES_AND_EQUALS].length;
          attrName = match[ATTRIBUTE_NAME];
          regex = match[QUOTE_CHAR] === void 0 ? tagEndRegex : match[QUOTE_CHAR] === '"' ? doubleQuoteAttrEndRegex : singleQuoteAttrEndRegex;
        }
      } else if (regex === doubleQuoteAttrEndRegex || regex === singleQuoteAttrEndRegex) {
        regex = tagEndRegex;
      } else if (regex === commentEndRegex || regex === comment2EndRegex) {
        regex = textEndRegex;
      } else {
        regex = tagEndRegex;
        rawTextEndRegex = void 0;
      }
    }
    {
      console.assert(attrNameEndIndex === -1 || regex === tagEndRegex || regex === singleQuoteAttrEndRegex || regex === doubleQuoteAttrEndRegex, "unexpected parse state B");
    }
    const end = regex === tagEndRegex && strings[i + 1].startsWith("/>") ? " " : "";
    html2 += regex === textEndRegex ? s + nodeMarker : attrNameEndIndex >= 0 ? (attrNames.push(attrName), s.slice(0, attrNameEndIndex) + boundAttributeSuffix + s.slice(attrNameEndIndex)) + marker + end : s + marker + (attrNameEndIndex === -2 ? i : end);
  }
  const htmlResult = html2 + (strings[l] || "<?>") + (type === SVG_RESULT ? "</svg>" : type === MATHML_RESULT ? "</math>" : "");
  return [trustFromTemplateString(strings, htmlResult), attrNames];
};
class Template {
  constructor({ strings, ["_$litType$"]: type }, options) {
    this.parts = [];
    let node;
    let nodeIndex = 0;
    let attrNameIndex = 0;
    const partCount = strings.length - 1;
    const parts = this.parts;
    const [html2, attrNames] = getTemplateHtml(strings, type);
    this.el = Template.createElement(html2, options);
    walker.currentNode = this.el.content;
    if (type === SVG_RESULT || type === MATHML_RESULT) {
      const wrapper = this.el.content.firstChild;
      wrapper.replaceWith(...wrapper.childNodes);
    }
    while ((node = walker.nextNode()) !== null && parts.length < partCount) {
      if (node.nodeType === 1) {
        {
          const tag2 = node.localName;
          if (/^(?:textarea|template)$/i.test(tag2) && node.innerHTML.includes(marker)) {
            const m = `Expressions are not supported inside \`${tag2}\` elements. See https://lit.dev/msg/expression-in-${tag2} for more information.`;
            if (tag2 === "template") {
              throw new Error(m);
            } else
              issueWarning("", m);
          }
        }
        if (node.hasAttributes()) {
          for (const name of node.getAttributeNames()) {
            if (name.endsWith(boundAttributeSuffix)) {
              const realName = attrNames[attrNameIndex++];
              const value = node.getAttribute(name);
              const statics = value.split(marker);
              const m = /([.?@])?(.*)/.exec(realName);
              parts.push({
                type: ATTRIBUTE_PART,
                index: nodeIndex,
                name: m[2],
                strings: statics,
                ctor: m[1] === "." ? PropertyPart : m[1] === "?" ? BooleanAttributePart : m[1] === "@" ? EventPart : AttributePart
              });
              node.removeAttribute(name);
            } else if (name.startsWith(marker)) {
              parts.push({
                type: ELEMENT_PART,
                index: nodeIndex
              });
              node.removeAttribute(name);
            }
          }
        }
        if (rawTextElement.test(node.tagName)) {
          const strings2 = node.textContent.split(marker);
          const lastIndex = strings2.length - 1;
          if (lastIndex > 0) {
            node.textContent = trustedTypes ? trustedTypes.emptyScript : "";
            for (let i = 0; i < lastIndex; i++) {
              node.append(strings2[i], createMarker());
              walker.nextNode();
              parts.push({ type: CHILD_PART, index: ++nodeIndex });
            }
            node.append(strings2[lastIndex], createMarker());
          }
        }
      } else if (node.nodeType === 8) {
        const data = node.data;
        if (data === markerMatch) {
          parts.push({ type: CHILD_PART, index: nodeIndex });
        } else {
          let i = -1;
          while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
            parts.push({ type: COMMENT_PART, index: nodeIndex });
            i += marker.length - 1;
          }
        }
      }
      nodeIndex++;
    }
    {
      if (attrNames.length !== attrNameIndex) {
        throw new Error(`Detected duplicate attribute bindings. This occurs if your template has duplicate attributes on an element tag. For example "<input ?disabled=\${true} ?disabled=\${false}>" contains a duplicate "disabled" attribute. The error was detected in the following template: 
\`` + strings.join("${...}") + "`");
      }
    }
    debugLogEvent && debugLogEvent({
      kind: "template prep",
      template: this,
      clonableTemplate: this.el,
      parts: this.parts,
      strings
    });
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @nocollapse */
  static createElement(html2, _options) {
    const el = d.createElement("template");
    el.innerHTML = html2;
    return el;
  }
}
function resolveDirective(part, value, parent = part, attributeIndex) {
  var _a2, _b2;
  if (value === noChange) {
    return value;
  }
  let currentDirective = attributeIndex !== void 0 ? (_a2 = parent.__directives) == null ? void 0 : _a2[attributeIndex] : parent.__directive;
  const nextDirectiveConstructor = isPrimitive(value) ? void 0 : (
    // This property needs to remain unminified.
    value["_$litDirective$"]
  );
  if ((currentDirective == null ? void 0 : currentDirective.constructor) !== nextDirectiveConstructor) {
    (_b2 = currentDirective == null ? void 0 : currentDirective["_$notifyDirectiveConnectionChanged"]) == null ? void 0 : _b2.call(currentDirective, false);
    if (nextDirectiveConstructor === void 0) {
      currentDirective = void 0;
    } else {
      currentDirective = new nextDirectiveConstructor(part);
      currentDirective._$initialize(part, parent, attributeIndex);
    }
    if (attributeIndex !== void 0) {
      (parent.__directives ?? (parent.__directives = []))[attributeIndex] = currentDirective;
    } else {
      parent.__directive = currentDirective;
    }
  }
  if (currentDirective !== void 0) {
    value = resolveDirective(part, currentDirective._$resolve(part, value.values), currentDirective, attributeIndex);
  }
  return value;
}
class TemplateInstance {
  constructor(template, parent) {
    this._$parts = [];
    this._$disconnectableChildren = void 0;
    this._$template = template;
    this._$parent = parent;
  }
  // Called by ChildPart parentNode getter
  get parentNode() {
    return this._$parent.parentNode;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  // This method is separate from the constructor because we need to return a
  // DocumentFragment and we don't want to hold onto it with an instance field.
  _clone(options) {
    const { el: { content }, parts } = this._$template;
    const fragment = ((options == null ? void 0 : options.creationScope) ?? d).importNode(content, true);
    walker.currentNode = fragment;
    let node = walker.nextNode();
    let nodeIndex = 0;
    let partIndex = 0;
    let templatePart = parts[0];
    while (templatePart !== void 0) {
      if (nodeIndex === templatePart.index) {
        let part;
        if (templatePart.type === CHILD_PART) {
          part = new ChildPart(node, node.nextSibling, this, options);
        } else if (templatePart.type === ATTRIBUTE_PART) {
          part = new templatePart.ctor(node, templatePart.name, templatePart.strings, this, options);
        } else if (templatePart.type === ELEMENT_PART) {
          part = new ElementPart(node, this, options);
        }
        this._$parts.push(part);
        templatePart = parts[++partIndex];
      }
      if (nodeIndex !== (templatePart == null ? void 0 : templatePart.index)) {
        node = walker.nextNode();
        nodeIndex++;
      }
    }
    walker.currentNode = d;
    return fragment;
  }
  _update(values) {
    let i = 0;
    for (const part of this._$parts) {
      if (part !== void 0) {
        debugLogEvent && debugLogEvent({
          kind: "set part",
          part,
          value: values[i],
          valueIndex: i,
          values,
          templateInstance: this
        });
        if (part.strings !== void 0) {
          part._$setValue(values, part, i);
          i += part.strings.length - 2;
        } else {
          part._$setValue(values[i]);
        }
      }
      i++;
    }
  }
}
class ChildPart {
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    var _a2;
    return ((_a2 = this._$parent) == null ? void 0 : _a2._$isConnected) ?? this.__isConnected;
  }
  constructor(startNode, endNode, parent, options) {
    this.type = CHILD_PART;
    this._$committedValue = nothing;
    this._$disconnectableChildren = void 0;
    this._$startNode = startNode;
    this._$endNode = endNode;
    this._$parent = parent;
    this.options = options;
    this.__isConnected = (options == null ? void 0 : options.isConnected) ?? true;
    {
      this._textSanitizer = void 0;
    }
  }
  /**
   * The parent node into which the part renders its content.
   *
   * A ChildPart's content consists of a range of adjacent child nodes of
   * `.parentNode`, possibly bordered by 'marker nodes' (`.startNode` and
   * `.endNode`).
   *
   * - If both `.startNode` and `.endNode` are non-null, then the part's content
   * consists of all siblings between `.startNode` and `.endNode`, exclusively.
   *
   * - If `.startNode` is non-null but `.endNode` is null, then the part's
   * content consists of all siblings following `.startNode`, up to and
   * including the last child of `.parentNode`. If `.endNode` is non-null, then
   * `.startNode` will always be non-null.
   *
   * - If both `.endNode` and `.startNode` are null, then the part's content
   * consists of all child nodes of `.parentNode`.
   */
  get parentNode() {
    let parentNode = wrap(this._$startNode).parentNode;
    const parent = this._$parent;
    if (parent !== void 0 && (parentNode == null ? void 0 : parentNode.nodeType) === 11) {
      parentNode = parent.parentNode;
    }
    return parentNode;
  }
  /**
   * The part's leading marker node, if any. See `.parentNode` for more
   * information.
   */
  get startNode() {
    return this._$startNode;
  }
  /**
   * The part's trailing marker node, if any. See `.parentNode` for more
   * information.
   */
  get endNode() {
    return this._$endNode;
  }
  _$setValue(value, directiveParent = this) {
    var _a2;
    if (this.parentNode === null) {
      throw new Error(`This \`ChildPart\` has no \`parentNode\` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's \`innerHTML\` or \`textContent\` can do this.`);
    }
    value = resolveDirective(this, value, directiveParent);
    if (isPrimitive(value)) {
      if (value === nothing || value == null || value === "") {
        if (this._$committedValue !== nothing) {
          debugLogEvent && debugLogEvent({
            kind: "commit nothing to child",
            start: this._$startNode,
            end: this._$endNode,
            parent: this._$parent,
            options: this.options
          });
          this._$clear();
        }
        this._$committedValue = nothing;
      } else if (value !== this._$committedValue && value !== noChange) {
        this._commitText(value);
      }
    } else if (value["_$litType$"] !== void 0) {
      this._commitTemplateResult(value);
    } else if (value.nodeType !== void 0) {
      if (((_a2 = this.options) == null ? void 0 : _a2.host) === value) {
        this._commitText(`[probable mistake: rendered a template's host in itself (commonly caused by writing \${this} in a template]`);
        console.warn(`Attempted to render the template host`, value, `inside itself. This is almost always a mistake, and in dev mode `, `we render some warning text. In production however, we'll `, `render it, which will usually result in an error, and sometimes `, `in the element disappearing from the DOM.`);
        return;
      }
      this._commitNode(value);
    } else if (isIterable(value)) {
      this._commitIterable(value);
    } else {
      this._commitText(value);
    }
  }
  _insert(node) {
    return wrap(wrap(this._$startNode).parentNode).insertBefore(node, this._$endNode);
  }
  _commitNode(value) {
    var _a2;
    if (this._$committedValue !== value) {
      this._$clear();
      if (sanitizerFactoryInternal !== noopSanitizer) {
        const parentNodeName = (_a2 = this._$startNode.parentNode) == null ? void 0 : _a2.nodeName;
        if (parentNodeName === "STYLE" || parentNodeName === "SCRIPT") {
          let message = "Forbidden";
          {
            if (parentNodeName === "STYLE") {
              message = `Lit does not support binding inside style nodes. This is a security risk, as style injection attacks can exfiltrate data and spoof UIs. Consider instead using css\`...\` literals to compose styles, and do dynamic styling with css custom properties, ::parts, <slot>s, and by mutating the DOM rather than stylesheets.`;
            } else {
              message = `Lit does not support binding inside script nodes. This is a security risk, as it could allow arbitrary code execution.`;
            }
          }
          throw new Error(message);
        }
      }
      debugLogEvent && debugLogEvent({
        kind: "commit node",
        start: this._$startNode,
        parent: this._$parent,
        value,
        options: this.options
      });
      this._$committedValue = this._insert(value);
    }
  }
  _commitText(value) {
    if (this._$committedValue !== nothing && isPrimitive(this._$committedValue)) {
      const node = wrap(this._$startNode).nextSibling;
      {
        if (this._textSanitizer === void 0) {
          this._textSanitizer = createSanitizer(node, "data", "property");
        }
        value = this._textSanitizer(value);
      }
      debugLogEvent && debugLogEvent({
        kind: "commit text",
        node,
        value,
        options: this.options
      });
      node.data = value;
    } else {
      {
        const textNode = d.createTextNode("");
        this._commitNode(textNode);
        if (this._textSanitizer === void 0) {
          this._textSanitizer = createSanitizer(textNode, "data", "property");
        }
        value = this._textSanitizer(value);
        debugLogEvent && debugLogEvent({
          kind: "commit text",
          node: textNode,
          value,
          options: this.options
        });
        textNode.data = value;
      }
    }
    this._$committedValue = value;
  }
  _commitTemplateResult(result) {
    var _a2;
    const { values, ["_$litType$"]: type } = result;
    const template = typeof type === "number" ? this._$getTemplate(result) : (type.el === void 0 && (type.el = Template.createElement(trustFromTemplateString(type.h, type.h[0]), this.options)), type);
    if (((_a2 = this._$committedValue) == null ? void 0 : _a2._$template) === template) {
      debugLogEvent && debugLogEvent({
        kind: "template updating",
        template,
        instance: this._$committedValue,
        parts: this._$committedValue._$parts,
        options: this.options,
        values
      });
      this._$committedValue._update(values);
    } else {
      const instance = new TemplateInstance(template, this);
      const fragment = instance._clone(this.options);
      debugLogEvent && debugLogEvent({
        kind: "template instantiated",
        template,
        instance,
        parts: instance._$parts,
        options: this.options,
        fragment,
        values
      });
      instance._update(values);
      debugLogEvent && debugLogEvent({
        kind: "template instantiated and updated",
        template,
        instance,
        parts: instance._$parts,
        options: this.options,
        fragment,
        values
      });
      this._commitNode(fragment);
      this._$committedValue = instance;
    }
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @internal */
  _$getTemplate(result) {
    let template = templateCache.get(result.strings);
    if (template === void 0) {
      templateCache.set(result.strings, template = new Template(result));
    }
    return template;
  }
  _commitIterable(value) {
    if (!isArray(this._$committedValue)) {
      this._$committedValue = [];
      this._$clear();
    }
    const itemParts = this._$committedValue;
    let partIndex = 0;
    let itemPart;
    for (const item of value) {
      if (partIndex === itemParts.length) {
        itemParts.push(itemPart = new ChildPart(this._insert(createMarker()), this._insert(createMarker()), this, this.options));
      } else {
        itemPart = itemParts[partIndex];
      }
      itemPart._$setValue(item);
      partIndex++;
    }
    if (partIndex < itemParts.length) {
      this._$clear(itemPart && wrap(itemPart._$endNode).nextSibling, partIndex);
      itemParts.length = partIndex;
    }
  }
  /**
   * Removes the nodes contained within this Part from the DOM.
   *
   * @param start Start node to clear from, for clearing a subset of the part's
   *     DOM (used when truncating iterables)
   * @param from  When `start` is specified, the index within the iterable from
   *     which ChildParts are being removed, used for disconnecting directives in
   *     those Parts.
   *
   * @internal
   */
  _$clear(start = wrap(this._$startNode).nextSibling, from) {
    var _a2;
    (_a2 = this._$notifyConnectionChanged) == null ? void 0 : _a2.call(this, false, true, from);
    while (start && start !== this._$endNode) {
      const n = wrap(start).nextSibling;
      wrap(start).remove();
      start = n;
    }
  }
  /**
   * Implementation of RootPart's `isConnected`. Note that this method
   * should only be called on `RootPart`s (the `ChildPart` returned from a
   * top-level `render()` call). It has no effect on non-root ChildParts.
   * @param isConnected Whether to set
   * @internal
   */
  setConnected(isConnected) {
    var _a2;
    if (this._$parent === void 0) {
      this.__isConnected = isConnected;
      (_a2 = this._$notifyConnectionChanged) == null ? void 0 : _a2.call(this, isConnected);
    } else {
      throw new Error("part.setConnected() may only be called on a RootPart returned from render().");
    }
  }
}
class AttributePart {
  get tagName() {
    return this.element.tagName;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  constructor(element, name, strings, parent, options) {
    this.type = ATTRIBUTE_PART;
    this._$committedValue = nothing;
    this._$disconnectableChildren = void 0;
    this.element = element;
    this.name = name;
    this._$parent = parent;
    this.options = options;
    if (strings.length > 2 || strings[0] !== "" || strings[1] !== "") {
      this._$committedValue = new Array(strings.length - 1).fill(new String());
      this.strings = strings;
    } else {
      this._$committedValue = nothing;
    }
    {
      this._sanitizer = void 0;
    }
  }
  /**
   * Sets the value of this part by resolving the value from possibly multiple
   * values and static strings and committing it to the DOM.
   * If this part is single-valued, `this._strings` will be undefined, and the
   * method will be called with a single value argument. If this part is
   * multi-value, `this._strings` will be defined, and the method is called
   * with the value array of the part's owning TemplateInstance, and an offset
   * into the value array from which the values should be read.
   * This method is overloaded this way to eliminate short-lived array slices
   * of the template instance values, and allow a fast-path for single-valued
   * parts.
   *
   * @param value The part value, or an array of values for multi-valued parts
   * @param valueIndex the index to start reading values from. `undefined` for
   *   single-valued parts
   * @param noCommit causes the part to not commit its value to the DOM. Used
   *   in hydration to prime attribute parts with their first-rendered value,
   *   but not set the attribute, and in SSR to no-op the DOM operation and
   *   capture the value for serialization.
   *
   * @internal
   */
  _$setValue(value, directiveParent = this, valueIndex, noCommit) {
    const strings = this.strings;
    let change = false;
    if (strings === void 0) {
      value = resolveDirective(this, value, directiveParent, 0);
      change = !isPrimitive(value) || value !== this._$committedValue && value !== noChange;
      if (change) {
        this._$committedValue = value;
      }
    } else {
      const values = value;
      value = strings[0];
      let i, v;
      for (i = 0; i < strings.length - 1; i++) {
        v = resolveDirective(this, values[valueIndex + i], directiveParent, i);
        if (v === noChange) {
          v = this._$committedValue[i];
        }
        change || (change = !isPrimitive(v) || v !== this._$committedValue[i]);
        if (v === nothing) {
          value = nothing;
        } else if (value !== nothing) {
          value += (v ?? "") + strings[i + 1];
        }
        this._$committedValue[i] = v;
      }
    }
    if (change && !noCommit) {
      this._commitValue(value);
    }
  }
  /** @internal */
  _commitValue(value) {
    if (value === nothing) {
      wrap(this.element).removeAttribute(this.name);
    } else {
      {
        if (this._sanitizer === void 0) {
          this._sanitizer = sanitizerFactoryInternal(this.element, this.name, "attribute");
        }
        value = this._sanitizer(value ?? "");
      }
      debugLogEvent && debugLogEvent({
        kind: "commit attribute",
        element: this.element,
        name: this.name,
        value,
        options: this.options
      });
      wrap(this.element).setAttribute(this.name, value ?? "");
    }
  }
}
class PropertyPart extends AttributePart {
  constructor() {
    super(...arguments);
    this.type = PROPERTY_PART;
  }
  /** @internal */
  _commitValue(value) {
    {
      if (this._sanitizer === void 0) {
        this._sanitizer = sanitizerFactoryInternal(this.element, this.name, "property");
      }
      value = this._sanitizer(value);
    }
    debugLogEvent && debugLogEvent({
      kind: "commit property",
      element: this.element,
      name: this.name,
      value,
      options: this.options
    });
    this.element[this.name] = value === nothing ? void 0 : value;
  }
}
class BooleanAttributePart extends AttributePart {
  constructor() {
    super(...arguments);
    this.type = BOOLEAN_ATTRIBUTE_PART;
  }
  /** @internal */
  _commitValue(value) {
    debugLogEvent && debugLogEvent({
      kind: "commit boolean attribute",
      element: this.element,
      name: this.name,
      value: !!(value && value !== nothing),
      options: this.options
    });
    wrap(this.element).toggleAttribute(this.name, !!value && value !== nothing);
  }
}
class EventPart extends AttributePart {
  constructor(element, name, strings, parent, options) {
    super(element, name, strings, parent, options);
    this.type = EVENT_PART;
    if (this.strings !== void 0) {
      throw new Error(`A \`<${element.localName}>\` has a \`@${name}=...\` listener with invalid content. Event listeners in templates must have exactly one expression and no surrounding text.`);
    }
  }
  // EventPart does not use the base _$setValue/_resolveValue implementation
  // since the dirty checking is more complex
  /** @internal */
  _$setValue(newListener, directiveParent = this) {
    newListener = resolveDirective(this, newListener, directiveParent, 0) ?? nothing;
    if (newListener === noChange) {
      return;
    }
    const oldListener = this._$committedValue;
    const shouldRemoveListener = newListener === nothing && oldListener !== nothing || newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive;
    const shouldAddListener = newListener !== nothing && (oldListener === nothing || shouldRemoveListener);
    debugLogEvent && debugLogEvent({
      kind: "commit event listener",
      element: this.element,
      name: this.name,
      value: newListener,
      options: this.options,
      removeListener: shouldRemoveListener,
      addListener: shouldAddListener,
      oldListener
    });
    if (shouldRemoveListener) {
      this.element.removeEventListener(this.name, this, oldListener);
    }
    if (shouldAddListener) {
      this.element.addEventListener(this.name, this, newListener);
    }
    this._$committedValue = newListener;
  }
  handleEvent(event) {
    var _a2;
    if (typeof this._$committedValue === "function") {
      this._$committedValue.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, event);
    } else {
      this._$committedValue.handleEvent(event);
    }
  }
}
class ElementPart {
  constructor(element, parent, options) {
    this.element = element;
    this.type = ELEMENT_PART;
    this._$disconnectableChildren = void 0;
    this._$parent = parent;
    this.options = options;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  _$setValue(value) {
    debugLogEvent && debugLogEvent({
      kind: "commit to element binding",
      element: this.element,
      value,
      options: this.options
    });
    resolveDirective(this, value);
  }
}
const polyfillSupport = global$1.litHtmlPolyfillSupportDevMode;
polyfillSupport == null ? void 0 : polyfillSupport(Template, ChildPart);
(global$1.litHtmlVersions ?? (global$1.litHtmlVersions = [])).push("3.2.1");
if (global$1.litHtmlVersions.length > 1) {
  issueWarning("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
}
const render = (value, container, options) => {
  if (container == null) {
    throw new TypeError(`The container to render into may not be ${container}`);
  }
  const renderId = debugLogRenderId++;
  const partOwnerNode = (options == null ? void 0 : options.renderBefore) ?? container;
  let part = partOwnerNode["_$litPart$"];
  debugLogEvent && debugLogEvent({
    kind: "begin render",
    id: renderId,
    value,
    container,
    options,
    part
  });
  if (part === void 0) {
    const endNode = (options == null ? void 0 : options.renderBefore) ?? null;
    partOwnerNode["_$litPart$"] = part = new ChildPart(container.insertBefore(createMarker(), endNode), endNode, void 0, options ?? {});
  }
  part._$setValue(value);
  debugLogEvent && debugLogEvent({
    kind: "end render",
    id: renderId,
    value,
    container,
    options,
    part
  });
  return part;
};
{
  render.setSanitizer = setSanitizer;
  render.createSanitizer = createSanitizer;
  {
    render._testOnlyClearSanitizerFactoryDoNotCallOrElse = _testOnlyClearSanitizerFactoryDoNotCallOrElse;
  }
}
const _config = {
  server: {
    host: "localhost",
    port: 3333
  },
  log: function() {
    {
      console.log(...arguments);
    }
  }
};
class AccordionModule {
  /**
   * @description Initialises accordion instances.
   *
   * @param {Element | null} [target=null] - The element to target for dynamic content
   *
   * @returns {void}
   */
  init(target = null) {
    let nodes = document.querySelectorAll(".accordion");
    if (target !== null) {
      nodes = target.querySelectorAll(".accordion");
    }
    nodes.forEach((element, index) => {
      let strict;
      if (typeof element.dataset.strict !== "undefined") {
        strict = element.dataset.strict === "true";
      }
      const btns = element.querySelectorAll(".accordion-title");
      btns.forEach((btn, i) => {
        btn.addEventListener("click", function() {
          const text = btn.nextElementSibling;
          const aria = btn.getAttribute("aria-expanded");
          if (strict) {
            const isopen = btn.classList.contains("accordion-title-open");
            closeAll(element);
            if (!isopen) {
              text.classList.toggle("accordion-body-open");
              btn.classList.toggle("accordion-title-open");
              btn.setAttribute(
                "aria-expanded",
                aria === "true" ? "false" : "true"
              );
            }
          } else {
            text.classList.toggle("accordion-body-open");
            btn.classList.toggle("accordion-title-open");
            btn.setAttribute(
              "aria-expanded",
              aria === "true" ? "false" : "true"
            );
          }
        });
      });
    });
    function closeAll(accordion) {
      const items = accordion.querySelectorAll(".accordion-item");
      items.forEach((item) => {
        const btn = item.querySelector(".accordion-title");
        const body = item.querySelector(".accordion-body");
        btn.classList.remove("accordion-title-open");
        body.classList.remove("accordion-body-open");
      });
    }
  }
}
function _some(obj, pred) {
  const keys = Object.keys(obj);
  return keys.some((key) => pred(obj[key]));
}
function _mapValues(obj, updater) {
  const keys = Object.keys(obj || {});
  return keys.reduce((acc, key) => Object.assign(Object.assign({}, acc), { [key]: updater(obj[key]) }), {});
}
function _isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}
function _cloneDeep(obj) {
  return Object.keys(obj || {}).reduce((res, key) => Object.assign(Object.assign({}, res), { [key]: _isPlainObject(obj[key]) ? _cloneDeep(obj[key]) : Array.isArray(obj[key]) ? [...obj[key]] : obj[key] }), {});
}
function __rest$1(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
function handleArray(value) {
  return function(propVal) {
    if (_isPlainObject(propVal)) {
      const _a2 = deepSet(propVal, value), field = __rest$1(_a2, ["key"]);
      return field;
    }
    return value;
  };
}
function deepSet(obj, value) {
  return _mapValues(obj, (prop) => _isPlainObject(prop) ? deepSet(prop, value) : Array.isArray(prop) ? prop.map(handleArray(value)) : value);
}
function _mergeWith(...args) {
  const customizer = args.pop();
  const _obj = args.shift();
  if (typeof _obj === "string")
    return _obj;
  const obj = _cloneDeep(_obj);
  if (args.length === 0)
    return obj;
  for (const source of args) {
    if (!source)
      continue;
    if (typeof source === "string")
      return source;
    let rsValue = customizer(obj, source);
    if (typeof rsValue !== "undefined")
      return rsValue;
    const keys = Array.from(new Set(Object.keys(obj).concat(Object.keys(source))));
    for (const key of keys) {
      rsValue = customizer(obj[key], source[key]);
      if (typeof rsValue !== "undefined") {
        obj[key] = rsValue;
      } else if (_isPlainObject(source[key]) && _isPlainObject(obj[key])) {
        obj[key] = _mergeWith(obj[key], source[key], customizer);
      } else if (Array.isArray(source[key])) {
        obj[key] = source[key].map((val, i) => {
          if (!_isPlainObject(val))
            return val;
          const newObj = Array.isArray(obj[key]) ? obj[key][i] : obj[key];
          return _mergeWith(newObj, val, customizer);
        });
      } else if (_isPlainObject(source[key])) {
        const defaultObj = deepSet(_cloneDeep(source[key]), void 0);
        obj[key] = _mergeWith(defaultObj, source[key], customizer);
      } else if (typeof source[key] !== "undefined") {
        obj[key] = source[key];
      }
    }
  }
  return obj;
}
function defaultsCustomizer(objValue, srcValue) {
  if (_isPlainObject(objValue) && _isPlainObject(srcValue))
    return;
  if (Array.isArray(srcValue)) {
    if (srcValue.some(_isPlainObject))
      return;
    const objArray = Array.isArray(objValue) ? objValue : [];
    return srcValue.map((value, index) => {
      var _a2;
      return (_a2 = objArray[index]) !== null && _a2 !== void 0 ? _a2 : value;
    });
  }
  if (typeof objValue !== "undefined")
    return objValue;
}
function _defaultsDeep(...args) {
  return _mergeWith(...args, defaultsCustomizer);
}
function _merge(...args) {
  return _mergeWith(...args, () => void 0);
}
function _get(obj, path, defaultValue) {
  const travel = (regexp) => String.prototype.split.call(path, regexp).filter(Boolean).reduce((res, key) => res !== null && res !== void 0 ? res[key] : res, obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === void 0 || result === obj ? defaultValue : result;
}
function _update(obj, path, updater) {
  if (obj)
    obj = _cloneDeep(obj);
  if (!_isPlainObject(obj))
    obj = {};
  const splitPath = !Array.isArray(path) ? path.match(/[^.[\]]+/g) || [] : path;
  const lastSection = splitPath[splitPath.length - 1];
  if (!lastSection)
    return obj;
  let property = obj;
  for (let i = 0; i < splitPath.length - 1; i++) {
    const section = splitPath[i];
    if (!property[section] || !_isPlainObject(property[section]) && !Array.isArray(property[section])) {
      const nextSection = splitPath[i + 1];
      if (isNaN(Number(nextSection))) {
        property[section] = {};
      } else {
        property[section] = [];
      }
    }
    property = property[section];
  }
  property[lastSection] = updater(property[lastSection]);
  return obj;
}
function _set(obj, path, value) {
  return _update(obj, path, () => value);
}
function _unset(obj, path) {
  if (!obj || Object(obj) !== obj)
    return;
  else if (typeof obj !== "undefined")
    obj = _cloneDeep(obj);
  const newPath = !Array.isArray(path) ? path.toString().match(/[^.[\]]+/g) || [] : path;
  const foundProp = newPath.length === 1 ? obj : _get(obj, newPath.slice(0, -1).join("."));
  if (Array.isArray(foundProp)) {
    foundProp.splice(Number(newPath[newPath.length - 1]), 1);
  } else {
    foundProp === null || foundProp === void 0 ? true : delete foundProp[newPath[newPath.length - 1]];
  }
  return obj;
}
function deepSome(obj, pred) {
  return _some(obj, (value) => _isPlainObject(value) ? deepSome(value, pred) : Array.isArray(value) ? value.length === 0 || value.every((v) => typeof v === "string") ? pred(value) : value.some((v) => _isPlainObject(v) ? deepSome(v, pred) : pred(v)) : pred(value));
}
function isInputElement(el) {
  return (el === null || el === void 0 ? void 0 : el.nodeName) === "INPUT";
}
function isTextAreaElement(el) {
  return (el === null || el === void 0 ? void 0 : el.nodeName) === "TEXTAREA";
}
function isSelectElement(el) {
  return (el === null || el === void 0 ? void 0 : el.nodeName) === "SELECT";
}
function isFieldSetElement(el) {
  return (el === null || el === void 0 ? void 0 : el.nodeName) === "FIELDSET";
}
function isFormControl(el) {
  return isInputElement(el) || isTextAreaElement(el) || isSelectElement(el);
}
function isElement(el) {
  return el.nodeType === Node.ELEMENT_NODE;
}
function getPath(el, name) {
  return name !== null && name !== void 0 ? name : isFormControl(el) ? el.name : "";
}
function shouldIgnore(el) {
  let parent = el;
  while (parent && parent.nodeName !== "FORM") {
    if (parent.hasAttribute("data-felte-ignore"))
      return true;
    parent = parent.parentElement;
  }
  return false;
}
function executeCustomizer(objValue, srcValue) {
  if (_isPlainObject(objValue) || _isPlainObject(srcValue))
    return;
  if (objValue === null || objValue === "")
    return srcValue;
  if (srcValue === null || srcValue === "")
    return objValue;
  if (!srcValue)
    return objValue;
  if (!objValue || !srcValue)
    return;
  if (Array.isArray(objValue)) {
    if (!Array.isArray(srcValue))
      return [...objValue, srcValue];
    const newErrors = [];
    const errLength = Math.max(srcValue.length, objValue.length);
    for (let i = 0; i < errLength; i++) {
      let obj = objValue[i];
      let src = srcValue[i];
      if (!_isPlainObject(obj) && !_isPlainObject(src)) {
        if (!Array.isArray(obj))
          obj = [obj];
        if (!Array.isArray(src))
          src = [src];
        newErrors.push(...obj, ...src);
      } else {
        newErrors.push(mergeErrors([obj !== null && obj !== void 0 ? obj : {}, src !== null && src !== void 0 ? src : {}]));
      }
    }
    return newErrors.filter(Boolean);
  }
  if (!Array.isArray(srcValue))
    srcValue = [srcValue];
  return [objValue, ...srcValue].reduce((acc, value) => acc.concat(value), []).filter(Boolean);
}
function mergeErrors(errors) {
  const merged = _mergeWith(...errors, executeCustomizer);
  return merged;
}
function runValidations(values, validationOrValidations) {
  if (!validationOrValidations)
    return [];
  const validations = Array.isArray(validationOrValidations) ? validationOrValidations : [validationOrValidations];
  return validations.map((v) => v(values));
}
function executeTransforms(values, transforms) {
  if (!transforms)
    return values;
  if (!Array.isArray(transforms))
    return transforms(values);
  return transforms.reduce((res, t) => t(res), values);
}
function createId(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
}
function isEqual(val1, val2) {
  if (val1 === val2)
    return true;
  if (Array.isArray(val1) && Array.isArray(val2)) {
    if (val1.length !== val2.length)
      return false;
    return val1.every((v, i) => isEqual(v, val2[i]));
  }
  if (_isPlainObject(val1) && _isPlainObject(val2)) {
    const keys1 = Object.keys(val1);
    const keys2 = Object.keys(val2);
    if (keys1.length !== keys2.length)
      return false;
    return keys1.every((k) => isEqual(val1[k], val2[k]));
  }
  return false;
}
function debounce(func, timeout, { onInit, onEnd } = {}) {
  let timer;
  return (...args) => {
    if (!timer)
      onInit === null || onInit === void 0 ? void 0 : onInit();
    if (timer)
      clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
      timer = void 0;
      onEnd === null || onEnd === void 0 ? void 0 : onEnd();
    }, timeout);
  };
}
function getFormControls(el) {
  if (isFormControl(el))
    return [el];
  if (el.childElementCount === 0)
    return [];
  const foundControls = /* @__PURE__ */ new Set();
  for (const child of el.children) {
    if (isFormControl(child))
      foundControls.add(child);
    if (isFieldSetElement(child)) {
      for (const fieldsetChild of child.elements) {
        if (isFormControl(fieldsetChild))
          foundControls.add(fieldsetChild);
      }
    }
    if (child.childElementCount > 0)
      getFormControls(child).forEach((value) => foundControls.add(value));
  }
  return Array.from(foundControls);
}
function addAttrsFromFieldset(fieldSet) {
  for (const element of fieldSet.elements) {
    if (!isFormControl(element) && !isFieldSetElement(element))
      continue;
    if (fieldSet.hasAttribute("data-felte-keep-on-remove") && !element.hasAttribute("data-felte-keep-on-remove")) {
      element.dataset.felteKeepOnRemove = fieldSet.dataset.felteKeepOnRemove;
    }
  }
}
function getInputTextOrNumber(el) {
  if (el.type.match(/^(number|range)$/)) {
    return !el.value ? null : +el.value;
  } else {
    return el.value;
  }
}
function getFormDefaultValues(node) {
  var _a2;
  let defaultData = {};
  let defaultTouched = {};
  for (const el of node.elements) {
    if (isFieldSetElement(el))
      addAttrsFromFieldset(el);
    if (!isFormControl(el) || !el.name)
      continue;
    const elName = getPath(el);
    if (isInputElement(el)) {
      if (el.type === "checkbox") {
        if (typeof _get(defaultData, elName) === "undefined") {
          const checkboxes = Array.from(node.querySelectorAll(`[name="${el.name}"]`)).filter((checkbox) => {
            if (!isFormControl(checkbox))
              return false;
            return elName === getPath(checkbox);
          });
          if (checkboxes.length === 1) {
            defaultData = _set(defaultData, elName, el.checked);
            defaultTouched = _set(defaultTouched, elName, false);
            continue;
          }
          defaultData = _set(defaultData, elName, el.checked ? [el.value] : []);
          defaultTouched = _set(defaultTouched, elName, false);
          continue;
        }
        if (Array.isArray(_get(defaultData, elName)) && el.checked) {
          defaultData = _update(defaultData, elName, (value) => [
            ...value,
            el.value
          ]);
        }
        continue;
      }
      if (el.type === "radio") {
        if (_get(defaultData, elName))
          continue;
        defaultData = _set(defaultData, elName, el.checked ? el.value : void 0);
        defaultTouched = _set(defaultTouched, elName, false);
        continue;
      }
      if (el.type === "file") {
        defaultData = _set(defaultData, elName, el.multiple ? Array.from(el.files || []) : (_a2 = el.files) === null || _a2 === void 0 ? void 0 : _a2[0]);
        defaultTouched = _set(defaultTouched, elName, false);
        continue;
      }
    } else if (isSelectElement(el)) {
      const multiple = el.multiple;
      if (!multiple) {
        defaultData = _set(defaultData, elName, el.value);
      } else {
        const selectedOptions = Array.from(el.selectedOptions).map((opt) => opt.value);
        defaultData = _set(defaultData, elName, selectedOptions);
      }
      defaultTouched = _set(defaultTouched, elName, false);
      continue;
    }
    const inputValue = getInputTextOrNumber(el);
    defaultData = _set(defaultData, elName, inputValue);
    defaultTouched = _set(defaultTouched, elName, false);
  }
  return { defaultData, defaultTouched };
}
function setControlValue(el, value) {
  var _a2;
  if (!isFormControl(el))
    return;
  const fieldValue = value;
  if (isInputElement(el)) {
    if (el.type === "checkbox") {
      const checkboxesDefaultData = fieldValue;
      if (typeof checkboxesDefaultData === "undefined" || typeof checkboxesDefaultData === "boolean") {
        el.checked = !!checkboxesDefaultData;
        return;
      }
      if (Array.isArray(checkboxesDefaultData)) {
        if (checkboxesDefaultData.includes(el.value)) {
          el.checked = true;
        } else {
          el.checked = false;
        }
      }
      return;
    }
    if (el.type === "radio") {
      const radioValue = fieldValue;
      if (el.value === radioValue)
        el.checked = true;
      else
        el.checked = false;
      return;
    }
    if (el.type === "file") {
      if (value instanceof FileList) {
        el.files = value;
      } else if (value instanceof File && typeof DataTransfer !== "undefined") {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(value);
        el.files = dataTransfer.files;
      } else if (typeof DataTransfer !== "undefined" && Array.isArray(value) && value.some((v) => v instanceof File)) {
        const dataTransfer = new DataTransfer();
        for (const file of value) {
          file instanceof File && dataTransfer.items.add(file);
        }
        el.files = dataTransfer.files;
      } else if (!value || Array.isArray(value) && !value.length) {
        el.files = null;
        el.value = "";
      }
      return;
    }
  } else if (isSelectElement(el)) {
    const multiple = el.multiple;
    if (!multiple) {
      el.value = String(fieldValue !== null && fieldValue !== void 0 ? fieldValue : "");
      for (const option of el.options) {
        if (option.value === String(fieldValue)) {
          option.selected = true;
        } else {
          option.selected = false;
        }
      }
    } else if (Array.isArray(fieldValue)) {
      el.value = String((_a2 = fieldValue[0]) !== null && _a2 !== void 0 ? _a2 : "");
      const stringValues = fieldValue.map((v) => String(v));
      for (const option of el.options) {
        if (stringValues.includes(option.value)) {
          option.selected = true;
        } else {
          option.selected = false;
        }
      }
    }
    return;
  }
  el.value = String(fieldValue !== null && fieldValue !== void 0 ? fieldValue : "");
}
function setForm(node, data) {
  for (const el of node.elements) {
    if (isFieldSetElement(el))
      addAttrsFromFieldset(el);
    if (!isFormControl(el) || !el.name)
      continue;
    const elName = getPath(el);
    setControlValue(el, _get(data, elName));
  }
}
const errorStores = {};
const warningStores = {};
class FelteValidationMessage extends HTMLElement {
  constructor() {
    super(...arguments);
    this.level = "error";
    this.messages = null;
    this._items = [];
    this._content = null;
    this._prevSiblings = [];
    this._nextSiblings = [];
    this._handleLoad = (e) => {
      var _a2;
      const target = e.currentTarget;
      const reporterId = target.dataset.felteReporterElementId;
      if (!reporterId)
        return;
      this._start(reporterId);
      (_a2 = this.formElement) === null || _a2 === void 0 ? void 0 : _a2.removeEventListener("feltereporterelement:load", this._handleLoad);
    };
  }
  static get observedAttributes() {
    return ["level", "for", "max", "templateid"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue)
      return;
    switch (name) {
      case "templateid":
        this.templateId = newValue;
        break;
      case "max":
        this.max = Number(newValue);
        break;
      default:
        this[name] = newValue;
        break;
    }
  }
  set items(value) {
    if (isEqual(value, this._items))
      return;
    this._items = value;
    this._updateItems();
  }
  /** @internal */
  get items() {
    return this._items;
  }
  /** @internal */
  _setup() {
    var _a2;
    const rootNode = this.getRootNode();
    const hostNode = (_a2 = rootNode === null || rootNode === void 0 ? void 0 : rootNode.host) === null || _a2 === void 0 ? void 0 : _a2.shadowRoot;
    const template = this.templateId ? (hostNode === null || hostNode === void 0 ? void 0 : hostNode.getElementById(this.templateId)) || document.getElementById(this.templateId) : this.querySelector("template");
    if (!template)
      return;
    this._content = document.importNode(template.content, true);
    const item = this._content.querySelector('[data-part="item"]');
    if (!item)
      return;
    this._item = item.cloneNode(true);
    this._container = item.parentElement;
    const elements = Array.from((this._container || this._content).childNodes);
    const itemIndex = elements.findIndex((el) => el === item);
    this._prevSiblings = elements.slice(0, itemIndex);
    this._nextSiblings = elements.slice(itemIndex + 1);
    (this._container || this._content).removeChild(item);
    if (this._container && this._container !== this)
      this.appendChild(this._container);
    if (!this._container)
      this._container = this;
  }
  /** @internal */
  _start(reporterId) {
    if (this.cleanup || !reporterId)
      return;
    const path = this.for;
    if (!path)
      throw new Error("<felte-validation-message> requires a `for` attribute");
    const store = this.level === "error" ? errorStores[reporterId] : warningStores[reporterId];
    this.cleanup = store.subscribe(($messages) => {
      const itemTemplate = this._item;
      if (!$messages || !itemTemplate)
        return;
      const messages = _get($messages, path);
      this.messages = messages;
      if (!messages || messages.length === 0) {
        this.items = [];
        return;
      }
      if (this.max != null)
        messages.splice(this.max);
      const newItems = [...this.items];
      messages.forEach((message, index) => {
        var _a2, _b2;
        const item = (_a2 = this.items[index]) !== null && _a2 !== void 0 ? _a2 : itemTemplate.cloneNode(true);
        const messageElement = (_b2 = item.querySelector('[data-part="message"]')) !== null && _b2 !== void 0 ? _b2 : item;
        messageElement.textContent = message;
        newItems[index] = item;
      });
      this.items = newItems.slice(0, messages.length);
    });
  }
  disconnectedCallback() {
    var _a2;
    (_a2 = this.cleanup) === null || _a2 === void 0 ? void 0 : _a2.call(this);
  }
  connectedCallback() {
    const formElement = this.closest("form");
    if (!formElement)
      throw new Error("<felte-validation-message> must be a child of a <form> element");
    this.formElement = formElement;
    setTimeout(() => {
      var _a2, _b2;
      const reporterId = (_a2 = this.formElement) === null || _a2 === void 0 ? void 0 : _a2.dataset.felteReporterElementId;
      if (!reporterId)
        (_b2 = this.formElement) === null || _b2 === void 0 ? void 0 : _b2.addEventListener("feltereporterelement:load", this._handleLoad);
      this._setup();
      if (reporterId)
        this._start(reporterId);
    });
  }
  /** @internal */
  _updateItems() {
    if (this._container) {
      for (const child of Array.from(this._container.childNodes)) {
        if (this.items.includes(child))
          continue;
        this._container.removeChild(child);
      }
      this._container.append(...this._prevSiblings, ...this.items, ...this._nextSiblings);
    }
  }
}
if (!customElements.get("felte-validation-message"))
  customElements.define("felte-validation-message", FelteValidationMessage);
function subscribe(store, ...callbacks) {
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get(store) {
  let value = void 0;
  subscribe(store, (_) => value = _)();
  return value;
}
class FelteSubmitError extends Error {
  constructor(message, response) {
    super(message);
    this.name = "FelteSubmitError";
    this.response = response;
  }
}
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
function deepSetTouched(obj, value) {
  return _mapValues(obj, (prop) => {
    if (_isPlainObject(prop))
      return deepSetTouched(prop, value);
    if (Array.isArray(prop)) {
      if (prop.length === 0 || prop.every((p) => typeof p === "string"))
        return value;
      return prop.map((p) => {
        const _a2 = deepSetTouched(p, value), field = __rest(_a2, ["key"]);
        return field;
      });
    }
    return value;
  });
}
function deepSetKey(obj) {
  if (!obj)
    return {};
  return _mapValues(obj, (prop) => {
    if (_isPlainObject(prop))
      return deepSetKey(prop);
    if (Array.isArray(prop)) {
      if (prop.length === 0 || prop.every((p) => typeof p === "string"))
        return prop;
      return prop.map((p) => {
        if (!_isPlainObject(p))
          return p;
        const field = deepSetKey(p);
        if (!field.key)
          field.key = createId();
        return field;
      });
    }
    return prop;
  });
}
function deepRemoveKey(obj) {
  if (!obj)
    return {};
  return _mapValues(obj, (prop) => {
    if (_isPlainObject(prop))
      return deepRemoveKey(prop);
    if (Array.isArray(prop)) {
      if (prop.length === 0 || prop.every((p) => typeof p === "string"))
        return prop;
      return prop.map((p) => {
        if (!_isPlainObject(p))
          return p;
        const _a2 = deepRemoveKey(p), field = __rest(_a2, ["key"]);
        return field;
      });
    }
    return prop;
  });
}
function createEventConstructors() {
  class SuccessEvent extends CustomEvent {
    constructor(detail) {
      super("feltesuccess", { detail });
    }
  }
  class ErrorEvent extends CustomEvent {
    constructor(detail) {
      super("felteerror", { detail, cancelable: true });
    }
    setErrors(errors) {
      this.preventDefault();
      this.errors = errors;
    }
  }
  class SubmitEvent extends Event {
    constructor() {
      super("feltesubmit", { cancelable: true });
    }
    handleSubmit(onSubmit) {
      this.onSubmit = onSubmit;
    }
    handleError(onError) {
      this.onError = onError;
    }
    handleSuccess(onSuccess) {
      this.onSuccess = onSuccess;
    }
  }
  return {
    createErrorEvent: (detail) => new ErrorEvent(detail),
    createSubmitEvent: () => new SubmitEvent(),
    createSuccessEvent: (detail) => new SuccessEvent(detail)
  };
}
function createDefaultSubmitHandler(form) {
  if (!form)
    return;
  return async function onSubmit() {
    let body = new FormData(form);
    const action = new URL(form.action);
    const method = form.method.toLowerCase() === "get" ? "get" : action.searchParams.get("_method") || form.method;
    let enctype = form.enctype;
    if (form.querySelector('input[type="file"]')) {
      enctype = "multipart/form-data";
    }
    if (method === "get" || enctype === "application/x-www-form-urlencoded") {
      body = new URLSearchParams(body);
    }
    let fetchOptions;
    if (method === "get") {
      body.forEach((value, key) => {
        action.searchParams.append(key, value);
      });
      fetchOptions = { method, headers: { Accept: "application/json" } };
    } else {
      fetchOptions = {
        method,
        body,
        headers: Object.assign(Object.assign({}, enctype !== "multipart/form-data" && {
          "Content-Type": enctype
        }), { Accept: "application/json" })
      };
    }
    const response = await window.fetch(action.toString(), fetchOptions);
    if (response.ok)
      return response;
    throw new FelteSubmitError("An error occurred while submitting the form", response);
  };
}
function addAtIndex(storeValue, path, value, index) {
  return _update(storeValue, path, (oldValue) => {
    if (typeof oldValue !== "undefined" && !Array.isArray(oldValue))
      return oldValue;
    if (!oldValue)
      oldValue = [];
    if (typeof index === "undefined") {
      oldValue.push(value);
    } else {
      oldValue.splice(index, 0, value);
    }
    return oldValue;
  });
}
function swapInArray(storeValue, path, from, to) {
  return _update(storeValue, path, (oldValue) => {
    if (!oldValue || !Array.isArray(oldValue))
      return oldValue;
    [oldValue[from], oldValue[to]] = [oldValue[to], oldValue[from]];
    return oldValue;
  });
}
function moveInArray(storeValue, path, from, to) {
  return _update(storeValue, path, (oldValue) => {
    if (!oldValue || !Array.isArray(oldValue))
      return oldValue;
    oldValue.splice(to, 0, oldValue.splice(from, 1)[0]);
    return oldValue;
  });
}
function isUpdater(value) {
  return typeof value === "function";
}
function createSetHelper(storeSetter) {
  const setHelper = (pathOrValue, valueOrUpdater) => {
    if (typeof pathOrValue === "string") {
      const path = pathOrValue;
      storeSetter((oldValue) => {
        const newValue = isUpdater(valueOrUpdater) ? valueOrUpdater(_get(oldValue, path)) : valueOrUpdater;
        return _set(oldValue, path, newValue);
      });
    } else {
      storeSetter((oldValue) => isUpdater(pathOrValue) ? pathOrValue(oldValue) : pathOrValue);
    }
  };
  return setHelper;
}
function createHelpers({ stores, config, validateErrors, validateWarnings, _getCurrentExtenders }) {
  var _a2;
  let formNode;
  let initialValues = deepSetKey((_a2 = config.initialValues) !== null && _a2 !== void 0 ? _a2 : {});
  const { data, touched, errors, warnings, isDirty, isSubmitting, interacted } = stores;
  const setData = createSetHelper(data.update);
  const setTouched = createSetHelper(touched.update);
  const setErrors = createSetHelper(errors.update);
  const setWarnings = createSetHelper(warnings.update);
  function updateFields(updater) {
    setData((oldData) => {
      const newData = updater(oldData);
      if (formNode)
        setForm(formNode, newData);
      return newData;
    });
  }
  const setFields = (pathOrValue, valueOrUpdater, shouldTouch) => {
    const fieldsSetter = createSetHelper(updateFields);
    fieldsSetter(pathOrValue, valueOrUpdater);
    if (typeof pathOrValue === "string" && shouldTouch) {
      setTouched(pathOrValue, true);
    }
  };
  function addField(path, value, index) {
    const touchedValue = _isPlainObject(value) ? deepSetTouched(value, false) : false;
    const errValue = _isPlainObject(touchedValue) ? deepSet(touchedValue, []) : [];
    value = _isPlainObject(value) ? Object.assign(Object.assign({}, value), { key: createId() }) : value;
    errors.update(($errors) => {
      return addAtIndex($errors, path, errValue, index);
    });
    warnings.update(($warnings) => {
      return addAtIndex($warnings, path, errValue, index);
    });
    touched.update(($touched) => {
      return addAtIndex($touched, path, touchedValue, index);
    });
    data.update(($data) => {
      const newData = addAtIndex($data, path, value, index);
      setTimeout(() => formNode && setForm(formNode, newData));
      return newData;
    });
  }
  function updateAll(updater) {
    errors.update(updater);
    warnings.update(updater);
    touched.update(updater);
    data.update(($data) => {
      const newData = updater($data);
      setTimeout(() => formNode && setForm(formNode, newData));
      return newData;
    });
  }
  function unsetField(path) {
    updateAll((storeValue) => _unset(storeValue, path));
  }
  function swapFields(path, from, to) {
    updateAll((storeValue) => swapInArray(storeValue, path, from, to));
  }
  function moveField(path, from, to) {
    updateAll((storeValue) => moveInArray(storeValue, path, from, to));
  }
  function resetField(path) {
    const initialValue = _get(initialValues, path);
    const touchedValue = _isPlainObject(initialValue) ? deepSetTouched(initialValue, false) : false;
    const errValue = _isPlainObject(touchedValue) ? deepSet(touchedValue, []) : [];
    data.update(($data) => {
      const newData = _set($data, path, initialValue);
      if (formNode)
        setForm(formNode, newData);
      return newData;
    });
    touched.update(($touched) => {
      return _set($touched, path, touchedValue);
    });
    errors.update(($errors) => {
      return _set($errors, path, errValue);
    });
    warnings.update(($warnings) => {
      return _set($warnings, path, errValue);
    });
  }
  const setIsSubmitting = createSetHelper(isSubmitting.update);
  const setIsDirty = createSetHelper(isDirty.update);
  const setInteracted = createSetHelper(interacted.update);
  async function validate() {
    const currentData = get(data);
    touched.set(deepSetTouched(currentData, true));
    interacted.set(null);
    const currentErrors = await validateErrors(currentData);
    await validateWarnings(currentData);
    return currentErrors;
  }
  function reset() {
    setFields(_cloneDeep(initialValues));
    setTouched(($touched) => deepSet($touched, false));
    interacted.set(null);
    isDirty.set(false);
  }
  function createSubmitHandler(altConfig) {
    return async function handleSubmit(event) {
      var _a3, _b2, _c, _d, _e, _f, _g;
      const { createErrorEvent, createSubmitEvent, createSuccessEvent } = createEventConstructors();
      const submitEvent = createSubmitEvent();
      formNode === null || formNode === void 0 ? void 0 : formNode.dispatchEvent(submitEvent);
      const onError = (_b2 = (_a3 = submitEvent.onError) !== null && _a3 !== void 0 ? _a3 : altConfig === null || altConfig === void 0 ? void 0 : altConfig.onError) !== null && _b2 !== void 0 ? _b2 : config.onError;
      const onSuccess = (_d = (_c = submitEvent.onSuccess) !== null && _c !== void 0 ? _c : altConfig === null || altConfig === void 0 ? void 0 : altConfig.onSuccess) !== null && _d !== void 0 ? _d : config.onSuccess;
      const onSubmit = (_g = (_f = (_e = submitEvent.onSubmit) !== null && _e !== void 0 ? _e : altConfig === null || altConfig === void 0 ? void 0 : altConfig.onSubmit) !== null && _f !== void 0 ? _f : config.onSubmit) !== null && _g !== void 0 ? _g : createDefaultSubmitHandler(formNode);
      if (!onSubmit)
        return;
      event === null || event === void 0 ? void 0 : event.preventDefault();
      if (submitEvent.defaultPrevented)
        return;
      isSubmitting.set(true);
      interacted.set(null);
      const currentData = deepRemoveKey(get(data));
      const currentErrors = await validateErrors(currentData, altConfig === null || altConfig === void 0 ? void 0 : altConfig.validate);
      const currentWarnings = await validateWarnings(currentData, altConfig === null || altConfig === void 0 ? void 0 : altConfig.warn);
      if (currentWarnings)
        warnings.set(_merge(deepSet(currentData, []), currentWarnings));
      touched.set(deepSetTouched(currentData, true));
      if (currentErrors) {
        touched.set(deepSetTouched(currentErrors, true));
        const hasErrors = deepSome(currentErrors, (error) => Array.isArray(error) ? error.length >= 1 : !!error);
        if (hasErrors) {
          await new Promise((r) => setTimeout(r));
          _getCurrentExtenders().forEach((extender) => {
            var _a4;
            return (_a4 = extender.onSubmitError) === null || _a4 === void 0 ? void 0 : _a4.call(extender, {
              data: currentData,
              errors: currentErrors
            });
          });
          isSubmitting.set(false);
          return;
        }
      }
      const context = {
        event,
        setFields,
        setData,
        setTouched,
        setErrors,
        setWarnings,
        unsetField,
        addField,
        resetField,
        reset,
        setInitialValues: publicHelpers.setInitialValues,
        moveField,
        swapFields,
        form: formNode,
        controls: formNode && Array.from(formNode.elements).filter(isFormControl),
        config: Object.assign(Object.assign({}, config), altConfig)
      };
      try {
        const response = await onSubmit(currentData, context);
        formNode === null || formNode === void 0 ? void 0 : formNode.dispatchEvent(createSuccessEvent(Object.assign({ response }, context)));
        await (onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(response, context));
      } catch (e) {
        const errorEvent = createErrorEvent(Object.assign({ error: e }, context));
        formNode === null || formNode === void 0 ? void 0 : formNode.dispatchEvent(errorEvent);
        if (!onError && !errorEvent.defaultPrevented) {
          throw e;
        }
        if (!onError && !errorEvent.errors)
          return;
        const serverErrors = errorEvent.errors || await (onError === null || onError === void 0 ? void 0 : onError(e, context));
        if (serverErrors) {
          touched.set(deepSetTouched(serverErrors, true));
          errors.set(serverErrors);
          await new Promise((r) => setTimeout(r));
          _getCurrentExtenders().forEach((extender) => {
            var _a4;
            return (_a4 = extender.onSubmitError) === null || _a4 === void 0 ? void 0 : _a4.call(extender, {
              data: currentData,
              errors: get(errors)
            });
          });
        }
      } finally {
        isSubmitting.set(false);
      }
    };
  }
  const publicHelpers = {
    setData,
    setFields,
    setTouched,
    setErrors,
    setWarnings,
    setIsSubmitting,
    setIsDirty,
    setInteracted,
    validate,
    reset,
    unsetField,
    resetField,
    addField,
    swapFields,
    moveField,
    createSubmitHandler,
    handleSubmit: createSubmitHandler(),
    setInitialValues: (values) => {
      initialValues = deepSetKey(values);
    }
  };
  const privateHelpers = {
    _setFormNode(node) {
      formNode = node;
    },
    _getInitialValues: () => initialValues
  };
  return {
    public: publicHelpers,
    private: privateHelpers
  };
}
function createFormAction({ helpers, stores, config, extender, createSubmitHandler, handleSubmit, _setFormNode, _getInitialValues, _setCurrentExtenders, _getCurrentExtenders }) {
  const { setFields, setTouched, reset, setInitialValues } = helpers;
  const { addValidator, addTransformer, validate } = helpers;
  const { data, errors, warnings, touched, isSubmitting, isDirty, interacted, isValid, isValidating } = stores;
  function form(node) {
    if (!node.requestSubmit)
      node.requestSubmit = handleSubmit;
    function callExtender(stage) {
      return function(extender2) {
        return extender2({
          form: node,
          stage,
          controls: Array.from(node.elements).filter(isFormControl),
          data,
          errors,
          warnings,
          touched,
          isValid,
          isValidating,
          isSubmitting,
          isDirty,
          interacted,
          config,
          addValidator,
          addTransformer,
          setFields,
          validate,
          reset,
          createSubmitHandler,
          handleSubmit
        });
      };
    }
    _setCurrentExtenders(extender.map(callExtender("MOUNT")));
    node.noValidate = !!config.validate;
    const { defaultData, defaultTouched } = getFormDefaultValues(node);
    _setFormNode(node);
    setInitialValues(_merge(_cloneDeep(defaultData), _getInitialValues()));
    setFields(_getInitialValues());
    touched.set(defaultTouched);
    function setCheckboxValues(target) {
      const elPath = getPath(target);
      const checkboxes = Array.from(node.querySelectorAll(`[name="${target.name}"]`)).filter((checkbox) => {
        if (!isFormControl(checkbox))
          return false;
        return elPath === getPath(checkbox);
      });
      if (checkboxes.length === 0)
        return;
      if (checkboxes.length === 1) {
        return data.update(($data) => _set($data, getPath(target), target.checked));
      }
      return data.update(($data) => {
        return _set($data, getPath(target), checkboxes.filter(isInputElement).filter((el) => el.checked).map((el) => el.value));
      });
    }
    function setRadioValues(target) {
      const radios = node.querySelectorAll(`[name="${target.name}"]`);
      const checkedRadio = Array.from(radios).find((el) => isInputElement(el) && el.checked);
      data.update(($data) => _set($data, getPath(target), checkedRadio === null || checkedRadio === void 0 ? void 0 : checkedRadio.value));
    }
    function setFileValue(target) {
      var _a2;
      const files = Array.from((_a2 = target.files) !== null && _a2 !== void 0 ? _a2 : []);
      data.update(($data) => {
        return _set($data, getPath(target), target.multiple ? files : files[0]);
      });
    }
    function setSelectValue(target) {
      if (!target.multiple) {
        data.update(($data) => {
          return _set($data, getPath(target), target.value);
        });
      } else {
        const selectedOptions = Array.from(target.selectedOptions).map((opt) => opt.value);
        data.update(($data) => {
          return _set($data, getPath(target), selectedOptions);
        });
      }
    }
    function handleInput(e) {
      const target = e.target;
      if (!target || !isFormControl(target) || isSelectElement(target) || shouldIgnore(target))
        return;
      if (["checkbox", "radio", "file"].includes(target.type))
        return;
      if (!target.name)
        return;
      isDirty.set(true);
      const inputValue = getInputTextOrNumber(target);
      interacted.set(target.name);
      data.update(($data) => {
        return _set($data, getPath(target), inputValue);
      });
    }
    function handleChange(e) {
      const target = e.target;
      if (!target || !isFormControl(target) || shouldIgnore(target))
        return;
      if (!target.name)
        return;
      setTouched(getPath(target), true);
      interacted.set(target.name);
      if (isSelectElement(target) || ["checkbox", "radio", "file", "hidden"].includes(target.type)) {
        isDirty.set(true);
      }
      if (target.type === "hidden") {
        data.update(($data) => {
          return _set($data, getPath(target), target.value);
        });
      }
      if (isSelectElement(target))
        setSelectValue(target);
      else if (!isInputElement(target))
        return;
      else if (target.type === "checkbox")
        setCheckboxValues(target);
      else if (target.type === "radio")
        setRadioValues(target);
      else if (target.type === "file")
        setFileValue(target);
    }
    function handleBlur(e) {
      const target = e.target;
      if (!target || !isFormControl(target) || shouldIgnore(target))
        return;
      if (!target.name)
        return;
      setTouched(getPath(target), true);
      interacted.set(target.name);
    }
    function handleReset(e) {
      e.preventDefault();
      reset();
    }
    const mutationOptions = { childList: true, subtree: true };
    function unsetTaggedForRemove(formControls) {
      let currentData = get(data);
      let currentTouched = get(touched);
      let currentErrors = get(errors);
      let currentWarnings = get(warnings);
      for (const control of formControls.reverse()) {
        if (control.hasAttribute("data-felte-keep-on-remove") && control.dataset.felteKeepOnRemove !== "false")
          continue;
        const fieldArrayReg = /.*(\[[0-9]+\]|\.[0-9]+)\.[^.]+$/;
        let fieldName = getPath(control);
        const shape = get(touched);
        const isFieldArray = fieldArrayReg.test(fieldName);
        if (isFieldArray) {
          const arrayPath = fieldName.split(".").slice(0, -1).join(".");
          const valueToRemove = _get(shape, arrayPath);
          if (_isPlainObject(valueToRemove) && Object.keys(valueToRemove).length <= 1) {
            fieldName = arrayPath;
          }
        }
        currentData = _unset(currentData, fieldName);
        currentTouched = _unset(currentTouched, fieldName);
        currentErrors = _unset(currentErrors, fieldName);
        currentWarnings = _unset(currentWarnings, fieldName);
      }
      data.set(currentData);
      touched.set(currentTouched);
      errors.set(currentErrors);
      warnings.set(currentWarnings);
    }
    const updateAddedNodes = debounce(() => {
      _getCurrentExtenders().forEach((extender2) => {
        var _a2;
        return (_a2 = extender2.destroy) === null || _a2 === void 0 ? void 0 : _a2.call(extender2);
      });
      _setCurrentExtenders(extender.map(callExtender("UPDATE")));
      const { defaultData: newDefaultData, defaultTouched: newDefaultTouched } = getFormDefaultValues(node);
      data.update(($data) => _defaultsDeep($data, newDefaultData));
      touched.update(($touched) => {
        return _defaultsDeep($touched, newDefaultTouched);
      });
      helpers.setFields(get(data));
    }, 0);
    let removedFormControls = [];
    const updateRemovedNodes = debounce(() => {
      _getCurrentExtenders().forEach((extender2) => {
        var _a2;
        return (_a2 = extender2.destroy) === null || _a2 === void 0 ? void 0 : _a2.call(extender2);
      });
      _setCurrentExtenders(extender.map(callExtender("UPDATE")));
      unsetTaggedForRemove(removedFormControls);
      removedFormControls = [];
    }, 0);
    function handleNodeAddition(mutation) {
      const shouldUpdate = Array.from(mutation.addedNodes).some((node2) => {
        if (!isElement(node2))
          return false;
        if (isFormControl(node2))
          return true;
        const formControls = getFormControls(node2);
        return formControls.length > 0;
      });
      if (!shouldUpdate)
        return;
      updateAddedNodes();
    }
    function handleNodeRemoval(mutation) {
      for (const removedNode of mutation.removedNodes) {
        if (!isElement(removedNode))
          continue;
        const formControls = getFormControls(removedNode);
        if (formControls.length === 0)
          continue;
        removedFormControls.push(...formControls);
        updateRemovedNodes();
      }
    }
    function mutationCallback(mutationList) {
      for (const mutation of mutationList) {
        if (mutation.type !== "childList")
          continue;
        if (mutation.addedNodes.length > 0)
          handleNodeAddition(mutation);
        if (mutation.removedNodes.length > 0)
          handleNodeRemoval(mutation);
      }
    }
    const observer = new MutationObserver(mutationCallback);
    observer.observe(node, mutationOptions);
    node.addEventListener("input", handleInput);
    node.addEventListener("change", handleChange);
    node.addEventListener("focusout", handleBlur);
    node.addEventListener("submit", handleSubmit);
    node.addEventListener("reset", handleReset);
    const unsubscribeErrors = errors.subscribe(($errors) => {
      for (const el of node.elements) {
        if (!isFormControl(el) || !el.name)
          continue;
        const fieldErrors = _get($errors, getPath(el));
        const message = Array.isArray(fieldErrors) ? fieldErrors.join("\n") : typeof fieldErrors === "string" ? fieldErrors : void 0;
        if (message === el.dataset.felteValidationMessage)
          continue;
        if (message) {
          el.dataset.felteValidationMessage = message;
          el.setAttribute("aria-invalid", "true");
        } else {
          delete el.dataset.felteValidationMessage;
          el.removeAttribute("aria-invalid");
        }
      }
    });
    return {
      destroy() {
        observer.disconnect();
        node.removeEventListener("input", handleInput);
        node.removeEventListener("change", handleChange);
        node.removeEventListener("focusout", handleBlur);
        node.removeEventListener("submit", handleSubmit);
        node.removeEventListener("reset", handleReset);
        unsubscribeErrors();
        _getCurrentExtenders().forEach((extender2) => {
          var _a2;
          return (_a2 = extender2.destroy) === null || _a2 === void 0 ? void 0 : _a2.call(extender2);
        });
      }
    };
  }
  return { form };
}
function createValidationController(priority) {
  const signal = { aborted: false, priority };
  return {
    signal,
    abort() {
      signal.aborted = true;
    }
  };
}
function errorFilterer(touchValue, errValue) {
  if (_isPlainObject(touchValue)) {
    if (!errValue || _isPlainObject(errValue) && Object.keys(errValue).length === 0) {
      return deepSet(touchValue, null);
    }
    return;
  }
  if (Array.isArray(touchValue)) {
    if (touchValue.some(_isPlainObject))
      return;
    const errArray = Array.isArray(errValue) ? errValue : [];
    return touchValue.map((value, index) => {
      const err = errArray[index];
      if (Array.isArray(err) && err.length === 0)
        return null;
      return value && err || null;
    });
  }
  if (Array.isArray(errValue) && errValue.length === 0)
    return null;
  if (Array.isArray(errValue))
    return touchValue ? errValue : null;
  return touchValue && errValue ? [errValue] : null;
}
function warningFilterer(touchValue, errValue) {
  if (_isPlainObject(touchValue)) {
    if (!errValue || _isPlainObject(errValue) && Object.keys(errValue).length === 0) {
      return deepSet(touchValue, null);
    }
    return;
  }
  if (Array.isArray(touchValue)) {
    if (touchValue.some(_isPlainObject))
      return;
    const errArray = Array.isArray(errValue) ? errValue : [];
    return touchValue.map((_, index) => {
      const err = errArray[index];
      if (Array.isArray(err) && err.length === 0)
        return null;
      return err || null;
    });
  }
  if (Array.isArray(errValue) && errValue.length === 0)
    return null;
  if (Array.isArray(errValue))
    return errValue;
  return errValue ? [errValue] : null;
}
function filterErrors([errors, touched]) {
  return _mergeWith(touched, errors, errorFilterer);
}
function filterWarnings([errors, touched]) {
  return _mergeWith(touched, errors, warningFilterer);
}
function createDerivedFactory(storeFactory) {
  return function derived(storeOrStores, deriver, initialValue) {
    const stores = Array.isArray(storeOrStores) ? storeOrStores : [storeOrStores];
    const values = new Array(stores.length);
    const derivedStore = storeFactory(initialValue);
    const storeSet = derivedStore.set;
    const storeSubscribe = derivedStore.subscribe;
    let unsubscribers;
    function startStore() {
      unsubscribers = stores.map((store, index) => {
        return store.subscribe(($store) => {
          values[index] = $store;
          storeSet(deriver(values));
        });
      });
    }
    function stopStore() {
      unsubscribers === null || unsubscribers === void 0 ? void 0 : unsubscribers.forEach((unsub) => unsub());
    }
    derivedStore.subscribe = function subscribe2(subscriber) {
      const unsubscribe = storeSubscribe(subscriber);
      return () => {
        unsubscribe();
      };
    };
    return [derivedStore, startStore, stopStore];
  };
}
function createStores(storeFactory, config) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _j;
  const derived = createDerivedFactory(storeFactory);
  const initialValues = config.initialValues = config.initialValues ? deepSetKey(executeTransforms(_cloneDeep(config.initialValues), config.transform)) : {};
  const initialTouched = deepSetTouched(deepRemoveKey(initialValues), false);
  const touched = storeFactory(initialTouched);
  const validationCount = storeFactory(0);
  const [isValidating, startIsValidating, stopIsValidating] = derived([touched, validationCount], ([$touched, $validationCount]) => {
    const isTouched = deepSome($touched, (t) => !!t);
    return isTouched && $validationCount >= 1;
  }, false);
  delete isValidating.set;
  delete isValidating.update;
  function cancellableValidation(store) {
    let activeController;
    return async function executeValidations($data, shape, validations, priority = false) {
      if (!validations || !$data)
        return;
      let current = shape && Object.keys(shape).length > 0 ? shape : deepSet($data, []);
      const controller = createValidationController(priority);
      if (!(activeController === null || activeController === void 0 ? void 0 : activeController.signal.priority) || priority) {
        activeController === null || activeController === void 0 ? void 0 : activeController.abort();
        activeController = controller;
      }
      if (activeController.signal.priority && !priority)
        return;
      validationCount.update((c) => c + 1);
      const results = runValidations(deepRemoveKey($data), validations);
      results.forEach(async (promise) => {
        const result = await promise;
        if (controller.signal.aborted)
          return;
        current = mergeErrors([current, result]);
        store.set(current);
      });
      await Promise.all(results);
      activeController = void 0;
      validationCount.update((c) => c - 1);
      return current;
    };
  }
  let storesShape = deepSet(initialTouched, []);
  const data = storeFactory(initialValues);
  const initialErrors = deepSet(initialTouched, []);
  const immediateErrors = storeFactory(initialErrors);
  const debouncedErrors = storeFactory(_cloneDeep(initialErrors));
  const [errors, startErrors, stopErrors] = derived([
    immediateErrors,
    debouncedErrors
  ], mergeErrors, _cloneDeep(initialErrors));
  const initialWarnings = deepSet(initialTouched, []);
  const immediateWarnings = storeFactory(initialWarnings);
  const debouncedWarnings = storeFactory(_cloneDeep(initialWarnings));
  const [warnings, startWarnings, stopWarnings] = derived([
    immediateWarnings,
    debouncedWarnings
  ], mergeErrors, _cloneDeep(initialWarnings));
  const [filteredErrors, startFilteredErrors, stopFilteredErrors] = derived([errors, touched], filterErrors, _cloneDeep(initialErrors));
  const [filteredWarnings, startFilteredWarnings, stopFilteredWarnings] = derived([warnings, touched], filterWarnings, _cloneDeep(initialWarnings));
  let firstCalled = false;
  const [isValid, startIsValid, stopIsValid] = derived(errors, ([$errors]) => {
    var _a3;
    if (!firstCalled) {
      firstCalled = true;
      return !config.validate && !((_a3 = config.debounced) === null || _a3 === void 0 ? void 0 : _a3.validate);
    } else {
      return !deepSome($errors, (error) => Array.isArray(error) ? error.length >= 1 : !!error);
    }
  }, !config.validate && !((_a2 = config.debounced) === null || _a2 === void 0 ? void 0 : _a2.validate));
  delete isValid.set;
  delete isValid.update;
  const isSubmitting = storeFactory(false);
  const isDirty = storeFactory(false);
  const interacted = storeFactory(null);
  const validateErrors = cancellableValidation(immediateErrors);
  const validateWarnings = cancellableValidation(immediateWarnings);
  const validateDebouncedErrors = cancellableValidation(debouncedErrors);
  const validateDebouncedWarnings = cancellableValidation(debouncedWarnings);
  const _validateDebouncedErrors = debounce(validateDebouncedErrors, (_e = (_c = (_b2 = config.debounced) === null || _b2 === void 0 ? void 0 : _b2.validateTimeout) !== null && _c !== void 0 ? _c : (_d = config.debounced) === null || _d === void 0 ? void 0 : _d.timeout) !== null && _e !== void 0 ? _e : 300, {
    onInit: () => {
      validationCount.update((c) => c + 1);
    },
    onEnd: () => {
      validationCount.update((c) => c - 1);
    }
  });
  const _validateDebouncedWarnings = debounce(validateDebouncedWarnings, (_j = (_g = (_f = config.debounced) === null || _f === void 0 ? void 0 : _f.warnTimeout) !== null && _g !== void 0 ? _g : (_h = config.debounced) === null || _h === void 0 ? void 0 : _h.timeout) !== null && _j !== void 0 ? _j : 300);
  async function executeErrorsValidation(data2, altValidate) {
    var _a3;
    const errors2 = validateErrors(data2, storesShape, altValidate !== null && altValidate !== void 0 ? altValidate : config.validate, true);
    if (altValidate)
      return errors2;
    const debouncedErrors2 = validateDebouncedErrors(data2, storesShape, (_a3 = config.debounced) === null || _a3 === void 0 ? void 0 : _a3.validate, true);
    return mergeErrors(await Promise.all([errors2, debouncedErrors2]));
  }
  async function executeWarningsValidation(data2, altWarn) {
    var _a3;
    const warnings2 = validateWarnings(data2, storesShape, altWarn !== null && altWarn !== void 0 ? altWarn : config.warn, true);
    if (altWarn)
      return warnings2;
    const debouncedWarnings2 = validateDebouncedWarnings(data2, storesShape, (_a3 = config.debounced) === null || _a3 === void 0 ? void 0 : _a3.warn, true);
    return mergeErrors(await Promise.all([warnings2, debouncedWarnings2]));
  }
  let errorsValue = initialErrors;
  let warningsValue = initialWarnings;
  function start() {
    const dataUnsubscriber = data.subscribe(($keyedData) => {
      var _a3, _b3;
      const $data = deepRemoveKey($keyedData);
      validateErrors($data, storesShape, config.validate);
      validateWarnings($data, storesShape, config.warn);
      _validateDebouncedErrors($data, storesShape, (_a3 = config.debounced) === null || _a3 === void 0 ? void 0 : _a3.validate);
      _validateDebouncedWarnings($data, storesShape, (_b3 = config.debounced) === null || _b3 === void 0 ? void 0 : _b3.warn);
    });
    const unsubscribeTouched = touched.subscribe(($touched) => {
      storesShape = deepSet($touched, []);
    });
    const unsubscribeErrors = errors.subscribe(($errors) => {
      errorsValue = $errors;
    });
    const unsubscribeWarnings = warnings.subscribe(($warnings) => {
      warningsValue = $warnings;
    });
    startErrors();
    startIsValid();
    startWarnings();
    startFilteredErrors();
    startFilteredWarnings();
    startIsValidating();
    function cleanup() {
      dataUnsubscriber();
      stopFilteredErrors();
      stopErrors();
      stopWarnings();
      stopFilteredWarnings();
      stopIsValid();
      stopIsValidating();
      unsubscribeTouched();
      unsubscribeErrors();
      unsubscribeWarnings();
    }
    return cleanup;
  }
  function publicErrorsUpdater(updater) {
    immediateErrors.set(updater(errorsValue));
    debouncedErrors.set({});
  }
  function publicWarningsUpdater(updater) {
    immediateWarnings.set(updater(warningsValue));
    debouncedWarnings.set({});
  }
  function publicErrorsSetter(value) {
    publicErrorsUpdater(() => value);
  }
  function publicWarningsSetter(value) {
    publicWarningsUpdater(() => value);
  }
  filteredErrors.set = publicErrorsSetter;
  filteredErrors.update = publicErrorsUpdater;
  filteredWarnings.set = publicWarningsSetter;
  filteredWarnings.update = publicWarningsUpdater;
  return {
    data,
    errors: filteredErrors,
    warnings: filteredWarnings,
    touched,
    isValid,
    isSubmitting,
    isDirty,
    isValidating,
    interacted,
    validateErrors: executeErrorsValidation,
    validateWarnings: executeWarningsValidation,
    cleanup: config.preventStoreStart ? () => void 0 : start(),
    start
  };
}
function createForm(config, adapters) {
  var _a2, _b2;
  (_a2 = config.extend) !== null && _a2 !== void 0 ? _a2 : config.extend = [];
  (_b2 = config.debounced) !== null && _b2 !== void 0 ? _b2 : config.debounced = {};
  if (config.validate && !Array.isArray(config.validate))
    config.validate = [config.validate];
  if (config.debounced.validate && !Array.isArray(config.debounced.validate))
    config.debounced.validate = [config.debounced.validate];
  if (config.transform && !Array.isArray(config.transform))
    config.transform = [config.transform];
  if (config.warn && !Array.isArray(config.warn))
    config.warn = [config.warn];
  if (config.debounced.warn && !Array.isArray(config.debounced.warn))
    config.debounced.warn = [config.debounced.warn];
  function addValidator(validator2, { debounced, level } = {
    debounced: false,
    level: "error"
  }) {
    var _a3;
    const prop = level === "error" ? "validate" : "warn";
    (_a3 = config.debounced) !== null && _a3 !== void 0 ? _a3 : config.debounced = {};
    const validateConfig = debounced ? config.debounced : config;
    if (!validateConfig[prop]) {
      validateConfig[prop] = [validator2];
    } else {
      validateConfig[prop] = [
        ...validateConfig[prop],
        validator2
      ];
    }
  }
  function addTransformer(transformer) {
    if (!config.transform) {
      config.transform = [transformer];
    } else {
      config.transform = [
        ...config.transform,
        transformer
      ];
    }
  }
  const extender = Array.isArray(config.extend) ? config.extend : [config.extend];
  let currentExtenders = [];
  const _getCurrentExtenders = () => currentExtenders;
  const _setCurrentExtenders = (extenders) => {
    currentExtenders = extenders;
  };
  const { isSubmitting, isValidating, data, errors, warnings, touched, isValid, isDirty, cleanup, start, validateErrors, validateWarnings, interacted } = createStores(adapters.storeFactory, config);
  const originalUpdate = data.update;
  const originalSet = data.set;
  const transUpdate = (updater) => originalUpdate((values) => deepSetKey(executeTransforms(updater(values), config.transform)));
  const transSet = (values) => originalSet(deepSetKey(executeTransforms(values, config.transform)));
  data.update = transUpdate;
  data.set = transSet;
  const helpers = createHelpers({
    extender,
    config,
    addValidator,
    addTransformer,
    validateErrors,
    validateWarnings,
    _getCurrentExtenders,
    stores: {
      data,
      errors,
      warnings,
      touched,
      isValid,
      isValidating,
      isSubmitting,
      isDirty,
      interacted
    }
  });
  const { createSubmitHandler, handleSubmit } = helpers.public;
  currentExtenders = extender.map((extender2) => extender2({
    stage: "SETUP",
    errors,
    warnings,
    touched,
    data,
    isDirty,
    isValid,
    isValidating,
    isSubmitting,
    interacted,
    config,
    addValidator,
    addTransformer,
    setFields: helpers.public.setFields,
    reset: helpers.public.reset,
    validate: helpers.public.validate,
    handleSubmit,
    createSubmitHandler
  }));
  const formActionConfig = Object.assign({
    config,
    stores: {
      data,
      touched,
      errors,
      warnings,
      isSubmitting,
      isValidating,
      isValid,
      isDirty,
      interacted
    },
    createSubmitHandler,
    handleSubmit,
    helpers: Object.assign(Object.assign({}, helpers.public), {
      addTransformer,
      addValidator
    }),
    extender,
    _getCurrentExtenders,
    _setCurrentExtenders
  }, helpers.private);
  const { form } = createFormAction(formActionConfig);
  return Object.assign({
    data,
    errors,
    warnings,
    touched,
    isValid,
    isSubmitting,
    isValidating,
    isDirty,
    interacted,
    form,
    cleanup,
    startStores: start
  }, helpers.public);
}
const subscriber_queue = [];
const noop = () => void 0;
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run(value);
    return () => {
      subscribers.delete(subscriber);
      if (stop && subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function failFor(name) {
  return function() {
    throw new TypeError(`Can't call "${name}" on HTMLFelteFormElement. The element is not ready yet.`);
  };
}
const storeKeys = [
  "data",
  "errors",
  "touched",
  "warnings",
  "isSubmitting",
  "isDirty",
  "isValid",
  "isValidating",
  "interacted"
];
function capitalizeFirst(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
class FelteForm extends HTMLElement {
  constructor() {
    super(...arguments);
    this._configuration = {};
    this._storeValues = {
      data: void 0,
      errors: void 0,
      touched: void 0,
      warnings: void 0,
      isSubmitting: false,
      isDirty: false,
      isValid: void 0,
      isValidating: false,
      interacted: null
    };
    this.setData = failFor("setData");
    this.setFields = failFor("setFields");
    this.setInitialValues = failFor("setInitialValues");
    this.addField = failFor("addField");
    this.unsetField = failFor("unsetField");
    this.swapFields = failFor("swapFields");
    this.moveField = failFor("moveField");
    this.resetField = failFor("resetField");
    this.reset = failFor("reset");
    this.submit = failFor("submit");
    this.createSubmitHandler = failFor("createSubmitHandler");
    this.setErrors = failFor("setErrors");
    this.setTouched = failFor("setTouched");
    this.setWarnings = failFor("setWarnings");
    this.setIsSubmitting = failFor("setIsSubmitting");
    this.setIsDirty = failFor("setIsDirty");
    this.setInteracted = failFor("setInteracted");
    this._ready = false;
    this.validate = failFor("validate");
    this._formElement = null;
    this._updateForm = () => {
      var _a2;
      const formElement = this.querySelector("form");
      if (!formElement || formElement === this._formElement)
        return;
      this.dispatchEvent(new Event("felteconnect", { bubbles: true, composed: true }));
      this._formElement = formElement;
      (_a2 = this._destroy) === null || _a2 === void 0 ? void 0 : _a2.call(this);
      this._destroy = void 0;
      this._createForm();
    };
  }
  set configuration(config) {
    this._configuration = config;
    if (this._destroy) {
      this._destroy();
      this._destroy = void 0;
      this._ready = false;
      this._createForm();
    }
  }
  get configuration() {
    return this._configuration;
  }
  get data() {
    return this._storeValues.data;
  }
  get errors() {
    return this._storeValues.errors;
  }
  get touched() {
    return this._storeValues.touched;
  }
  get warnings() {
    return this._storeValues.warnings;
  }
  get isSubmitting() {
    return this._storeValues.isSubmitting;
  }
  get isDirty() {
    return this._storeValues.isDirty;
  }
  get isValid() {
    return this._storeValues.isValid;
  }
  get isValidating() {
    return this._storeValues.isValidating;
  }
  get interacted() {
    return this._storeValues.interacted;
  }
  get ready() {
    return this._ready;
  }
  /** @internal */
  _createForm() {
    var _a2;
    const formElement = this._formElement;
    if (!formElement)
      return;
    const config = this.configuration;
    this.elements = formElement.elements;
    const { form, cleanup, ...rest } = createForm(config, {
      storeFactory: writable
    });
    this.setData = rest.setData;
    this.setFields = rest.setFields;
    this.setErrors = rest.setErrors;
    this.setTouched = rest.setTouched;
    this.setWarnings = rest.setWarnings;
    this.setIsSubmitting = rest.setIsSubmitting;
    this.setIsDirty = rest.setIsDirty;
    this.setInteracted = rest.setInteracted;
    this.setInitialValues = rest.setInitialValues;
    this.validate = rest.validate;
    this.addField = rest.addField;
    this.unsetField = rest.unsetField;
    this.swapFields = rest.swapFields;
    this.moveField = rest.moveField;
    this.resetField = rest.resetField;
    this.reset = rest.reset;
    this.submit = rest.handleSubmit;
    this.createSubmitHandler = rest.createSubmitHandler;
    const unsubs = storeKeys.map((key) => {
      return rest[key].subscribe(($value) => {
        if (isEqual($value, this._storeValues[key]))
          return;
        this._storeValues[key] = $value;
        const handler = this[`on${capitalizeFirst(key)}Change`];
        if (typeof handler === "function")
          handler($value);
        this.dispatchEvent(new Event(`${key.toLowerCase()}change`));
      });
    });
    const { destroy } = form(formElement);
    const { createSubmitEvent, createErrorEvent, createSuccessEvent } = createEventConstructors();
    const handleFelteSubmit = (e) => {
      const event = e;
      const submitEvent = createSubmitEvent();
      this.dispatchEvent(submitEvent);
      if (submitEvent.defaultPrevented)
        event.preventDefault();
      event.onSubmit = submitEvent.onSubmit;
      event.onSuccess = submitEvent.onSuccess;
      event.onError = submitEvent.onError;
    };
    const handleFelteSuccess = (e) => {
      const event = e;
      const successEvent = createSuccessEvent(event.detail);
      this.dispatchEvent(successEvent);
    };
    const handleFelteError = (e) => {
      const event = e;
      const errorEvent = createErrorEvent(event.detail);
      this.dispatchEvent(errorEvent);
      event.errors = errorEvent.errors;
      if (errorEvent.defaultPrevented)
        event.preventDefault();
    };
    formElement.addEventListener("feltesubmit", handleFelteSubmit);
    formElement.addEventListener("feltesuccess", handleFelteSuccess);
    formElement.addEventListener("felteerror", handleFelteError);
    this._destroy = () => {
      destroy();
      cleanup();
      formElement.removeEventListener("feltesubmit", handleFelteSubmit);
      formElement.removeEventListener("feltesuccess", handleFelteSuccess);
      formElement.removeEventListener("felteerror", handleFelteError);
      unsubs.forEach((unsub) => unsub());
    };
    this._ready = true;
    (_a2 = this.onFelteReady) === null || _a2 === void 0 ? void 0 : _a2.call(this);
    this.dispatchEvent(new Event("felteready", { bubbles: true, composed: true }));
  }
  connectedCallback() {
    setTimeout(() => {
      this._updateForm();
      this._observer = new MutationObserver(this._updateForm);
      this._observer.observe(this, { childList: true });
    });
  }
  disconnectedCallback() {
    var _a2, _b2;
    (_a2 = this._destroy) === null || _a2 === void 0 ? void 0 : _a2.call(this);
    (_b2 = this._observer) === null || _b2 === void 0 ? void 0 : _b2.disconnect();
  }
  static get observedAttributes() {
    return ["id"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue)
      return;
    switch (name) {
      case "id":
        this.id = newValue;
        break;
    }
  }
}
if (!customElements.get("felte-form")) {
  customElements.define("felte-form", FelteForm);
  window.HTMLFelteFormElement = FelteForm;
}
function reporterElement(currentForm, options) {
  const config = currentForm.config;
  if (currentForm.stage === "SETUP") {
    if (!config.__felteReporterElementId) {
      const id = createId(21);
      config.__felteReporterElementId = id;
      errorStores[id] = currentForm.errors;
      warningStores[id] = currentForm.warnings;
    }
    return {};
  }
  if (!currentForm.form.hasAttribute("data-felte-reporter-element-id")) {
    currentForm.form.dataset.felteReporterElementId = config.__felteReporterElementId;
    currentForm.form.dispatchEvent(new Event("feltereporterelement:load"));
  }
  return {
    onSubmitError() {
      var _a2;
      if (options === null || options === void 0 ? void 0 : options.preventFocusOnError)
        return;
      const firstInvalidElement = (_a2 = currentForm === null || currentForm === void 0 ? void 0 : currentForm.form) === null || _a2 === void 0 ? void 0 : _a2.querySelector('[data-felte-validation-message]:not([type="hidden"])');
      firstInvalidElement === null || firstInvalidElement === void 0 ? void 0 : firstInvalidElement.focus();
    }
  };
}
function reporter(currentFormOrOptions) {
  if (!currentFormOrOptions || "preventFocusOnError" in currentFormOrOptions) {
    return (currentForm) => reporterElement(currentForm, currentFormOrOptions);
  }
  return reporterElement(currentFormOrOptions);
}
function validateSchema(schema, options) {
  function shapeErrors(errors) {
    return errors.inner.reduce((err, value) => {
      if (!value.path)
        return err;
      return _set(err, value.path, value.message);
    }, {});
  }
  return async function validate(values) {
    return schema.validate(values, Object.assign({ strict: true, abortEarly: false }, options)).then(() => void 0).catch(shapeErrors);
  };
}
function validator({ schema, level = "error", castValues }) {
  return function extender(currentForm) {
    if (currentForm.stage !== "SETUP")
      return {};
    const validateFn = validateSchema(schema);
    currentForm.addValidator(validateFn, { level });
    if (!castValues)
      return {};
    const transformFn = (values) => {
      return schema.cast(values);
    };
    currentForm.addTransformer(transformFn);
    return {};
  };
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function Cache(maxSize) {
  this._maxSize = maxSize;
  this.clear();
}
Cache.prototype.clear = function() {
  this._size = 0;
  this._values = /* @__PURE__ */ Object.create(null);
};
Cache.prototype.get = function(key) {
  return this._values[key];
};
Cache.prototype.set = function(key, value) {
  this._size >= this._maxSize && this.clear();
  if (!(key in this._values)) this._size++;
  return this._values[key] = value;
};
var SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g, DIGIT_REGEX = /^\d+$/, LEAD_DIGIT_REGEX = /^\d/, SPEC_CHAR_REGEX = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g, CLEAN_QUOTES_REGEX = /^\s*(['"]?)(.*?)(\1)\s*$/, MAX_CACHE_SIZE = 512;
var pathCache = new Cache(MAX_CACHE_SIZE), setCache = new Cache(MAX_CACHE_SIZE), getCache = new Cache(MAX_CACHE_SIZE);
var propertyExpr = {
  Cache,
  split,
  normalizePath,
  setter: function(path) {
    var parts = normalizePath(path);
    return setCache.get(path) || setCache.set(path, function setter(obj, value) {
      var index = 0;
      var len = parts.length;
      var data = obj;
      while (index < len - 1) {
        var part = parts[index];
        if (part === "__proto__" || part === "constructor" || part === "prototype") {
          return obj;
        }
        data = data[parts[index++]];
      }
      data[parts[index]] = value;
    });
  },
  getter: function(path, safe) {
    var parts = normalizePath(path);
    return getCache.get(path) || getCache.set(path, function getter(data) {
      var index = 0, len = parts.length;
      while (index < len) {
        if (data != null || !safe) data = data[parts[index++]];
        else return;
      }
      return data;
    });
  },
  join: function(segments) {
    return segments.reduce(function(path, part) {
      return path + (isQuoted(part) || DIGIT_REGEX.test(part) ? "[" + part + "]" : (path ? "." : "") + part);
    }, "");
  },
  forEach: function(path, cb, thisArg) {
    forEach(Array.isArray(path) ? path : split(path), cb, thisArg);
  }
};
function normalizePath(path) {
  return pathCache.get(path) || pathCache.set(
    path,
    split(path).map(function(part) {
      return part.replace(CLEAN_QUOTES_REGEX, "$2");
    })
  );
}
function split(path) {
  return path.match(SPLIT_REGEX) || [""];
}
function forEach(parts, iter, thisArg) {
  var len = parts.length, part, idx, isArray2, isBracket;
  for (idx = 0; idx < len; idx++) {
    part = parts[idx];
    if (part) {
      if (shouldBeQuoted(part)) {
        part = '"' + part + '"';
      }
      isBracket = isQuoted(part);
      isArray2 = !isBracket && /^\d+$/.test(part);
      iter.call(thisArg, part, isBracket, isArray2, idx, parts);
    }
  }
}
function isQuoted(str) {
  return typeof str === "string" && str && ["'", '"'].indexOf(str.charAt(0)) !== -1;
}
function hasLeadingNumber(part) {
  return part.match(LEAD_DIGIT_REGEX) && !part.match(DIGIT_REGEX);
}
function hasSpecialChars(part) {
  return SPEC_CHAR_REGEX.test(part);
}
function shouldBeQuoted(part) {
  return !isQuoted(part) && (hasLeadingNumber(part) || hasSpecialChars(part));
}
const reWords = /[A-Z\xc0-\xd6\xd8-\xde]?[a-z\xdf-\xf6\xf8-\xff]+(?:['’](?:d|ll|m|re|s|t|ve))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde]|$)|(?:[A-Z\xc0-\xd6\xd8-\xde]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde](?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])|$)|[A-Z\xc0-\xd6\xd8-\xde]?(?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:d|ll|m|re|s|t|ve))?|[A-Z\xc0-\xd6\xd8-\xde]+(?:['’](?:D|LL|M|RE|S|T|VE))?|\d*(?:1ST|2ND|3RD|(?![123])\dTH)(?=\b|[a-z_])|\d*(?:1st|2nd|3rd|(?![123])\dth)(?=\b|[A-Z_])|\d+|(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?)*/g;
const words = (str) => str.match(reWords) || [];
const upperFirst = (str) => str[0].toUpperCase() + str.slice(1);
const join = (str, d2) => words(str).join(d2).toLowerCase();
const camelCase = (str) => words(str).reduce(
  (acc, next) => `${acc}${!acc ? next.toLowerCase() : next[0].toUpperCase() + next.slice(1).toLowerCase()}`,
  ""
);
const pascalCase = (str) => upperFirst(camelCase(str));
const snakeCase = (str) => join(str, "_");
const kebabCase = (str) => join(str, "-");
const sentenceCase = (str) => upperFirst(join(str, " "));
const titleCase = (str) => words(str).map(upperFirst).join(" ");
var tinyCase = {
  words,
  upperFirst,
  camelCase,
  pascalCase,
  snakeCase,
  kebabCase,
  sentenceCase,
  titleCase
};
var toposort$2 = { exports: {} };
toposort$2.exports = function(edges) {
  return toposort(uniqueNodes(edges), edges);
};
toposort$2.exports.array = toposort;
function toposort(nodes, edges) {
  var cursor = nodes.length, sorted = new Array(cursor), visited = {}, i = cursor, outgoingEdges = makeOutgoingEdges(edges), nodesHash = makeNodesHash(nodes);
  edges.forEach(function(edge) {
    if (!nodesHash.has(edge[0]) || !nodesHash.has(edge[1])) {
      throw new Error("Unknown node. There is an unknown node in the supplied edges.");
    }
  });
  while (i--) {
    if (!visited[i]) visit(nodes[i], i, /* @__PURE__ */ new Set());
  }
  return sorted;
  function visit(node, i2, predecessors) {
    if (predecessors.has(node)) {
      var nodeRep;
      try {
        nodeRep = ", node was:" + JSON.stringify(node);
      } catch (e) {
        nodeRep = "";
      }
      throw new Error("Cyclic dependency" + nodeRep);
    }
    if (!nodesHash.has(node)) {
      throw new Error("Found unknown node. Make sure to provided all involved nodes. Unknown node: " + JSON.stringify(node));
    }
    if (visited[i2]) return;
    visited[i2] = true;
    var outgoing = outgoingEdges.get(node) || /* @__PURE__ */ new Set();
    outgoing = Array.from(outgoing);
    if (i2 = outgoing.length) {
      predecessors.add(node);
      do {
        var child = outgoing[--i2];
        visit(child, nodesHash.get(child), predecessors);
      } while (i2);
      predecessors.delete(node);
    }
    sorted[--cursor] = node;
  }
}
function uniqueNodes(arr) {
  var res = /* @__PURE__ */ new Set();
  for (var i = 0, len = arr.length; i < len; i++) {
    var edge = arr[i];
    res.add(edge[0]);
    res.add(edge[1]);
  }
  return Array.from(res);
}
function makeOutgoingEdges(arr) {
  var edges = /* @__PURE__ */ new Map();
  for (var i = 0, len = arr.length; i < len; i++) {
    var edge = arr[i];
    if (!edges.has(edge[0])) edges.set(edge[0], /* @__PURE__ */ new Set());
    if (!edges.has(edge[1])) edges.set(edge[1], /* @__PURE__ */ new Set());
    edges.get(edge[0]).add(edge[1]);
  }
  return edges;
}
function makeNodesHash(arr) {
  var res = /* @__PURE__ */ new Map();
  for (var i = 0, len = arr.length; i < len; i++) {
    res.set(arr[i], i);
  }
  return res;
}
var toposortExports = toposort$2.exports;
const toposort$1 = /* @__PURE__ */ getDefaultExportFromCjs(toposortExports);
const toString = Object.prototype.toString;
const errorToString = Error.prototype.toString;
const regExpToString = RegExp.prototype.toString;
const symbolToString = typeof Symbol !== "undefined" ? Symbol.prototype.toString : () => "";
const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
function printNumber(val) {
  if (val != +val) return "NaN";
  const isNegativeZero = val === 0 && 1 / val < 0;
  return isNegativeZero ? "-0" : "" + val;
}
function printSimpleValue(val, quoteStrings = false) {
  if (val == null || val === true || val === false) return "" + val;
  const typeOf = typeof val;
  if (typeOf === "number") return printNumber(val);
  if (typeOf === "string") return quoteStrings ? `"${val}"` : val;
  if (typeOf === "function") return "[Function " + (val.name || "anonymous") + "]";
  if (typeOf === "symbol") return symbolToString.call(val).replace(SYMBOL_REGEXP, "Symbol($1)");
  const tag2 = toString.call(val).slice(8, -1);
  if (tag2 === "Date") return isNaN(val.getTime()) ? "" + val : val.toISOString(val);
  if (tag2 === "Error" || val instanceof Error) return "[" + errorToString.call(val) + "]";
  if (tag2 === "RegExp") return regExpToString.call(val);
  return null;
}
function printValue(value, quoteStrings) {
  let result = printSimpleValue(value, quoteStrings);
  if (result !== null) return result;
  return JSON.stringify(value, function(key, value2) {
    let result2 = printSimpleValue(this[key], quoteStrings);
    if (result2 !== null) return result2;
    return value2;
  }, 2);
}
function toArray(value) {
  return value == null ? [] : [].concat(value);
}
let _Symbol$toStringTag, _Symbol$hasInstance, _Symbol$toStringTag2;
let strReg = /\$\{\s*(\w+)\s*\}/g;
_Symbol$toStringTag = Symbol.toStringTag;
class ValidationErrorNoStack {
  constructor(errorOrErrors, value, field, type) {
    this.name = void 0;
    this.message = void 0;
    this.value = void 0;
    this.path = void 0;
    this.type = void 0;
    this.params = void 0;
    this.errors = void 0;
    this.inner = void 0;
    this[_Symbol$toStringTag] = "Error";
    this.name = "ValidationError";
    this.value = value;
    this.path = field;
    this.type = type;
    this.errors = [];
    this.inner = [];
    toArray(errorOrErrors).forEach((err) => {
      if (ValidationError.isError(err)) {
        this.errors.push(...err.errors);
        const innerErrors = err.inner.length ? err.inner : [err];
        this.inner.push(...innerErrors);
      } else {
        this.errors.push(err);
      }
    });
    this.message = this.errors.length > 1 ? `${this.errors.length} errors occurred` : this.errors[0];
  }
}
_Symbol$hasInstance = Symbol.hasInstance;
_Symbol$toStringTag2 = Symbol.toStringTag;
class ValidationError extends Error {
  static formatError(message, params) {
    const path = params.label || params.path || "this";
    if (path !== params.path) params = Object.assign({}, params, {
      path
    });
    if (typeof message === "string") return message.replace(strReg, (_, key) => printValue(params[key]));
    if (typeof message === "function") return message(params);
    return message;
  }
  static isError(err) {
    return err && err.name === "ValidationError";
  }
  constructor(errorOrErrors, value, field, type, disableStack) {
    const errorNoStack = new ValidationErrorNoStack(errorOrErrors, value, field, type);
    if (disableStack) {
      return errorNoStack;
    }
    super();
    this.value = void 0;
    this.path = void 0;
    this.type = void 0;
    this.params = void 0;
    this.errors = [];
    this.inner = [];
    this[_Symbol$toStringTag2] = "Error";
    this.name = errorNoStack.name;
    this.message = errorNoStack.message;
    this.type = errorNoStack.type;
    this.value = errorNoStack.value;
    this.path = errorNoStack.path;
    this.errors = errorNoStack.errors;
    this.inner = errorNoStack.inner;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
  static [_Symbol$hasInstance](inst) {
    return ValidationErrorNoStack[Symbol.hasInstance](inst) || super[Symbol.hasInstance](inst);
  }
}
let mixed = {
  default: "${path} is invalid",
  required: "${path} is a required field",
  defined: "${path} must be defined",
  notNull: "${path} cannot be null",
  oneOf: "${path} must be one of the following values: ${values}",
  notOneOf: "${path} must not be one of the following values: ${values}",
  notType: ({
    path,
    type,
    value,
    originalValue
  }) => {
    const castMsg = originalValue != null && originalValue !== value ? ` (cast from the value \`${printValue(originalValue, true)}\`).` : ".";
    return type !== "mixed" ? `${path} must be a \`${type}\` type, but the final value was: \`${printValue(value, true)}\`` + castMsg : `${path} must match the configured type. The validated value was: \`${printValue(value, true)}\`` + castMsg;
  }
};
let string = {
  length: "${path} must be exactly ${length} characters",
  min: "${path} must be at least ${min} characters",
  max: "${path} must be at most ${max} characters",
  matches: '${path} must match the following: "${regex}"',
  email: "${path} must be a valid email",
  url: "${path} must be a valid URL",
  uuid: "${path} must be a valid UUID",
  datetime: "${path} must be a valid ISO date-time",
  datetime_precision: "${path} must be a valid ISO date-time with a sub-second precision of exactly ${precision} digits",
  datetime_offset: '${path} must be a valid ISO date-time with UTC "Z" timezone',
  trim: "${path} must be a trimmed string",
  lowercase: "${path} must be a lowercase string",
  uppercase: "${path} must be a upper case string"
};
let number = {
  min: "${path} must be greater than or equal to ${min}",
  max: "${path} must be less than or equal to ${max}",
  lessThan: "${path} must be less than ${less}",
  moreThan: "${path} must be greater than ${more}",
  positive: "${path} must be a positive number",
  negative: "${path} must be a negative number",
  integer: "${path} must be an integer"
};
let date = {
  min: "${path} field must be later than ${min}",
  max: "${path} field must be at earlier than ${max}"
};
let boolean = {
  isValue: "${path} field must be ${value}"
};
let object = {
  noUnknown: "${path} field has unspecified keys: ${unknown}"
};
let array = {
  min: "${path} field must have at least ${min} items",
  max: "${path} field must have less than or equal to ${max} items",
  length: "${path} must have ${length} items"
};
let tuple = {
  notType: (params) => {
    const {
      path,
      value,
      spec
    } = params;
    const typeLen = spec.types.length;
    if (Array.isArray(value)) {
      if (value.length < typeLen) return `${path} tuple value has too few items, expected a length of ${typeLen} but got ${value.length} for value: \`${printValue(value, true)}\``;
      if (value.length > typeLen) return `${path} tuple value has too many items, expected a length of ${typeLen} but got ${value.length} for value: \`${printValue(value, true)}\``;
    }
    return ValidationError.formatError(mixed.notType, params);
  }
};
Object.assign(/* @__PURE__ */ Object.create(null), {
  mixed,
  string,
  number,
  date,
  object,
  array,
  boolean,
  tuple
});
const isSchema = (obj) => obj && obj.__isYupSchema__;
class Condition {
  static fromOptions(refs, config) {
    if (!config.then && !config.otherwise) throw new TypeError("either `then:` or `otherwise:` is required for `when()` conditions");
    let {
      is,
      then,
      otherwise
    } = config;
    let check = typeof is === "function" ? is : (...values) => values.every((value) => value === is);
    return new Condition(refs, (values, schema) => {
      var _branch;
      let branch = check(...values) ? then : otherwise;
      return (_branch = branch == null ? void 0 : branch(schema)) != null ? _branch : schema;
    });
  }
  constructor(refs, builder) {
    this.fn = void 0;
    this.refs = refs;
    this.refs = refs;
    this.fn = builder;
  }
  resolve(base, options) {
    let values = this.refs.map((ref) => (
      // TODO: ? operator here?
      ref.getValue(options == null ? void 0 : options.value, options == null ? void 0 : options.parent, options == null ? void 0 : options.context)
    ));
    let schema = this.fn(values, base, options);
    if (schema === void 0 || // @ts-ignore this can be base
    schema === base) {
      return base;
    }
    if (!isSchema(schema)) throw new TypeError("conditions must return a schema object");
    return schema.resolve(options);
  }
}
const prefixes = {
  context: "$",
  value: "."
};
class Reference {
  constructor(key, options = {}) {
    this.key = void 0;
    this.isContext = void 0;
    this.isValue = void 0;
    this.isSibling = void 0;
    this.path = void 0;
    this.getter = void 0;
    this.map = void 0;
    if (typeof key !== "string") throw new TypeError("ref must be a string, got: " + key);
    this.key = key.trim();
    if (key === "") throw new TypeError("ref must be a non-empty string");
    this.isContext = this.key[0] === prefixes.context;
    this.isValue = this.key[0] === prefixes.value;
    this.isSibling = !this.isContext && !this.isValue;
    let prefix = this.isContext ? prefixes.context : this.isValue ? prefixes.value : "";
    this.path = this.key.slice(prefix.length);
    this.getter = this.path && propertyExpr.getter(this.path, true);
    this.map = options.map;
  }
  getValue(value, parent, context) {
    let result = this.isContext ? context : this.isValue ? value : parent;
    if (this.getter) result = this.getter(result || {});
    if (this.map) result = this.map(result);
    return result;
  }
  /**
   *
   * @param {*} value
   * @param {Object} options
   * @param {Object=} options.context
   * @param {Object=} options.parent
   */
  cast(value, options) {
    return this.getValue(value, options == null ? void 0 : options.parent, options == null ? void 0 : options.context);
  }
  resolve() {
    return this;
  }
  describe() {
    return {
      type: "ref",
      key: this.key
    };
  }
  toString() {
    return `Ref(${this.key})`;
  }
  static isRef(value) {
    return value && value.__isYupRef;
  }
}
Reference.prototype.__isYupRef = true;
const isAbsent = (value) => value == null;
function createValidation(config) {
  function validate({
    value,
    path = "",
    options,
    originalValue,
    schema
  }, panic, next) {
    const {
      name,
      test,
      params,
      message,
      skipAbsent
    } = config;
    let {
      parent,
      context,
      abortEarly = schema.spec.abortEarly,
      disableStackTrace = schema.spec.disableStackTrace
    } = options;
    function resolve(item) {
      return Reference.isRef(item) ? item.getValue(value, parent, context) : item;
    }
    function createError(overrides = {}) {
      const nextParams = Object.assign({
        value,
        originalValue,
        label: schema.spec.label,
        path: overrides.path || path,
        spec: schema.spec,
        disableStackTrace: overrides.disableStackTrace || disableStackTrace
      }, params, overrides.params);
      for (const key of Object.keys(nextParams)) nextParams[key] = resolve(nextParams[key]);
      const error = new ValidationError(ValidationError.formatError(overrides.message || message, nextParams), value, nextParams.path, overrides.type || name, nextParams.disableStackTrace);
      error.params = nextParams;
      return error;
    }
    const invalid = abortEarly ? panic : next;
    let ctx = {
      path,
      parent,
      type: name,
      from: options.from,
      createError,
      resolve,
      options,
      originalValue,
      schema
    };
    const handleResult = (validOrError) => {
      if (ValidationError.isError(validOrError)) invalid(validOrError);
      else if (!validOrError) invalid(createError());
      else next(null);
    };
    const handleError = (err) => {
      if (ValidationError.isError(err)) invalid(err);
      else panic(err);
    };
    const shouldSkip = skipAbsent && isAbsent(value);
    if (shouldSkip) {
      return handleResult(true);
    }
    let result;
    try {
      var _result;
      result = test.call(ctx, value, ctx);
      if (typeof ((_result = result) == null ? void 0 : _result.then) === "function") {
        if (options.sync) {
          throw new Error(`Validation test of type: "${ctx.type}" returned a Promise during a synchronous validate. This test will finish after the validate call has returned`);
        }
        return Promise.resolve(result).then(handleResult, handleError);
      }
    } catch (err) {
      handleError(err);
      return;
    }
    handleResult(result);
  }
  validate.OPTIONS = config;
  return validate;
}
function getIn(schema, path, value, context = value) {
  let parent, lastPart, lastPartDebug;
  if (!path) return {
    parent,
    parentPath: path,
    schema
  };
  propertyExpr.forEach(path, (_part, isBracket, isArray2) => {
    let part = isBracket ? _part.slice(1, _part.length - 1) : _part;
    schema = schema.resolve({
      context,
      parent,
      value
    });
    let isTuple = schema.type === "tuple";
    let idx = isArray2 ? parseInt(part, 10) : 0;
    if (schema.innerType || isTuple) {
      if (isTuple && !isArray2) throw new Error(`Yup.reach cannot implicitly index into a tuple type. the path part "${lastPartDebug}" must contain an index to the tuple element, e.g. "${lastPartDebug}[0]"`);
      if (value && idx >= value.length) {
        throw new Error(`Yup.reach cannot resolve an array item at index: ${_part}, in the path: ${path}. because there is no value at that index. `);
      }
      parent = value;
      value = value && value[idx];
      schema = isTuple ? schema.spec.types[idx] : schema.innerType;
    }
    if (!isArray2) {
      if (!schema.fields || !schema.fields[part]) throw new Error(`The schema does not contain the path: ${path}. (failed at: ${lastPartDebug} which is a type: "${schema.type}")`);
      parent = value;
      value = value && value[part];
      schema = schema.fields[part];
    }
    lastPart = part;
    lastPartDebug = isBracket ? "[" + _part + "]" : "." + _part;
  });
  return {
    schema,
    parent,
    parentPath: lastPart
  };
}
class ReferenceSet extends Set {
  describe() {
    const description = [];
    for (const item of this.values()) {
      description.push(Reference.isRef(item) ? item.describe() : item);
    }
    return description;
  }
  resolveAll(resolve) {
    let result = [];
    for (const item of this.values()) {
      result.push(resolve(item));
    }
    return result;
  }
  clone() {
    return new ReferenceSet(this.values());
  }
  merge(newItems, removeItems) {
    const next = this.clone();
    newItems.forEach((value) => next.add(value));
    removeItems.forEach((value) => next.delete(value));
    return next;
  }
}
function clone(src, seen = /* @__PURE__ */ new Map()) {
  if (isSchema(src) || !src || typeof src !== "object") return src;
  if (seen.has(src)) return seen.get(src);
  let copy;
  if (src instanceof Date) {
    copy = new Date(src.getTime());
    seen.set(src, copy);
  } else if (src instanceof RegExp) {
    copy = new RegExp(src);
    seen.set(src, copy);
  } else if (Array.isArray(src)) {
    copy = new Array(src.length);
    seen.set(src, copy);
    for (let i = 0; i < src.length; i++) copy[i] = clone(src[i], seen);
  } else if (src instanceof Map) {
    copy = /* @__PURE__ */ new Map();
    seen.set(src, copy);
    for (const [k, v] of src.entries()) copy.set(k, clone(v, seen));
  } else if (src instanceof Set) {
    copy = /* @__PURE__ */ new Set();
    seen.set(src, copy);
    for (const v of src) copy.add(clone(v, seen));
  } else if (src instanceof Object) {
    copy = {};
    seen.set(src, copy);
    for (const [k, v] of Object.entries(src)) copy[k] = clone(v, seen);
  } else {
    throw Error(`Unable to clone ${src}`);
  }
  return copy;
}
class Schema {
  constructor(options) {
    this.type = void 0;
    this.deps = [];
    this.tests = void 0;
    this.transforms = void 0;
    this.conditions = [];
    this._mutate = void 0;
    this.internalTests = {};
    this._whitelist = new ReferenceSet();
    this._blacklist = new ReferenceSet();
    this.exclusiveTests = /* @__PURE__ */ Object.create(null);
    this._typeCheck = void 0;
    this.spec = void 0;
    this.tests = [];
    this.transforms = [];
    this.withMutation(() => {
      this.typeError(mixed.notType);
    });
    this.type = options.type;
    this._typeCheck = options.check;
    this.spec = Object.assign({
      strip: false,
      strict: false,
      abortEarly: true,
      recursive: true,
      disableStackTrace: false,
      nullable: false,
      optional: true,
      coerce: true
    }, options == null ? void 0 : options.spec);
    this.withMutation((s) => {
      s.nonNullable();
    });
  }
  // TODO: remove
  get _type() {
    return this.type;
  }
  clone(spec) {
    if (this._mutate) {
      if (spec) Object.assign(this.spec, spec);
      return this;
    }
    const next = Object.create(Object.getPrototypeOf(this));
    next.type = this.type;
    next._typeCheck = this._typeCheck;
    next._whitelist = this._whitelist.clone();
    next._blacklist = this._blacklist.clone();
    next.internalTests = Object.assign({}, this.internalTests);
    next.exclusiveTests = Object.assign({}, this.exclusiveTests);
    next.deps = [...this.deps];
    next.conditions = [...this.conditions];
    next.tests = [...this.tests];
    next.transforms = [...this.transforms];
    next.spec = clone(Object.assign({}, this.spec, spec));
    return next;
  }
  label(label) {
    let next = this.clone();
    next.spec.label = label;
    return next;
  }
  meta(...args) {
    if (args.length === 0) return this.spec.meta;
    let next = this.clone();
    next.spec.meta = Object.assign(next.spec.meta || {}, args[0]);
    return next;
  }
  withMutation(fn) {
    let before = this._mutate;
    this._mutate = true;
    let result = fn(this);
    this._mutate = before;
    return result;
  }
  concat(schema) {
    if (!schema || schema === this) return this;
    if (schema.type !== this.type && this.type !== "mixed") throw new TypeError(`You cannot \`concat()\` schema's of different types: ${this.type} and ${schema.type}`);
    let base = this;
    let combined = schema.clone();
    const mergedSpec = Object.assign({}, base.spec, combined.spec);
    combined.spec = mergedSpec;
    combined.internalTests = Object.assign({}, base.internalTests, combined.internalTests);
    combined._whitelist = base._whitelist.merge(schema._whitelist, schema._blacklist);
    combined._blacklist = base._blacklist.merge(schema._blacklist, schema._whitelist);
    combined.tests = base.tests;
    combined.exclusiveTests = base.exclusiveTests;
    combined.withMutation((next) => {
      schema.tests.forEach((fn) => {
        next.test(fn.OPTIONS);
      });
    });
    combined.transforms = [...base.transforms, ...combined.transforms];
    return combined;
  }
  isType(v) {
    if (v == null) {
      if (this.spec.nullable && v === null) return true;
      if (this.spec.optional && v === void 0) return true;
      return false;
    }
    return this._typeCheck(v);
  }
  resolve(options) {
    let schema = this;
    if (schema.conditions.length) {
      let conditions = schema.conditions;
      schema = schema.clone();
      schema.conditions = [];
      schema = conditions.reduce((prevSchema, condition) => condition.resolve(prevSchema, options), schema);
      schema = schema.resolve(options);
    }
    return schema;
  }
  resolveOptions(options) {
    var _options$strict, _options$abortEarly, _options$recursive, _options$disableStack;
    return Object.assign({}, options, {
      from: options.from || [],
      strict: (_options$strict = options.strict) != null ? _options$strict : this.spec.strict,
      abortEarly: (_options$abortEarly = options.abortEarly) != null ? _options$abortEarly : this.spec.abortEarly,
      recursive: (_options$recursive = options.recursive) != null ? _options$recursive : this.spec.recursive,
      disableStackTrace: (_options$disableStack = options.disableStackTrace) != null ? _options$disableStack : this.spec.disableStackTrace
    });
  }
  /**
   * Run the configured transform pipeline over an input value.
   */
  cast(value, options = {}) {
    let resolvedSchema = this.resolve(Object.assign({
      value
    }, options));
    let allowOptionality = options.assert === "ignore-optionality";
    let result = resolvedSchema._cast(value, options);
    if (options.assert !== false && !resolvedSchema.isType(result)) {
      if (allowOptionality && isAbsent(result)) {
        return result;
      }
      let formattedValue = printValue(value);
      let formattedResult = printValue(result);
      throw new TypeError(`The value of ${options.path || "field"} could not be cast to a value that satisfies the schema type: "${resolvedSchema.type}". 

attempted value: ${formattedValue} 
` + (formattedResult !== formattedValue ? `result of cast: ${formattedResult}` : ""));
    }
    return result;
  }
  _cast(rawValue, options) {
    let value = rawValue === void 0 ? rawValue : this.transforms.reduce((prevValue, fn) => fn.call(this, prevValue, rawValue, this), rawValue);
    if (value === void 0) {
      value = this.getDefault(options);
    }
    return value;
  }
  _validate(_value, options = {}, panic, next) {
    let {
      path,
      originalValue = _value,
      strict = this.spec.strict
    } = options;
    let value = _value;
    if (!strict) {
      value = this._cast(value, Object.assign({
        assert: false
      }, options));
    }
    let initialTests = [];
    for (let test of Object.values(this.internalTests)) {
      if (test) initialTests.push(test);
    }
    this.runTests({
      path,
      value,
      originalValue,
      options,
      tests: initialTests
    }, panic, (initialErrors) => {
      if (initialErrors.length) {
        return next(initialErrors, value);
      }
      this.runTests({
        path,
        value,
        originalValue,
        options,
        tests: this.tests
      }, panic, next);
    });
  }
  /**
   * Executes a set of validations, either schema, produced Tests or a nested
   * schema validate result.
   */
  runTests(runOptions, panic, next) {
    let fired = false;
    let {
      tests,
      value,
      originalValue,
      path,
      options
    } = runOptions;
    let panicOnce = (arg) => {
      if (fired) return;
      fired = true;
      panic(arg, value);
    };
    let nextOnce = (arg) => {
      if (fired) return;
      fired = true;
      next(arg, value);
    };
    let count = tests.length;
    let nestedErrors = [];
    if (!count) return nextOnce([]);
    let args = {
      value,
      originalValue,
      path,
      options,
      schema: this
    };
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      test(args, panicOnce, function finishTestRun(err) {
        if (err) {
          Array.isArray(err) ? nestedErrors.push(...err) : nestedErrors.push(err);
        }
        if (--count <= 0) {
          nextOnce(nestedErrors);
        }
      });
    }
  }
  asNestedTest({
    key,
    index,
    parent,
    parentPath,
    originalParent,
    options
  }) {
    const k = key != null ? key : index;
    if (k == null) {
      throw TypeError("Must include `key` or `index` for nested validations");
    }
    const isIndex = typeof k === "number";
    let value = parent[k];
    const testOptions = Object.assign({}, options, {
      // Nested validations fields are always strict:
      //    1. parent isn't strict so the casting will also have cast inner values
      //    2. parent is strict in which case the nested values weren't cast either
      strict: true,
      parent,
      value,
      originalValue: originalParent[k],
      // FIXME: tests depend on `index` being passed around deeply,
      //   we should not let the options.key/index bleed through
      key: void 0,
      // index: undefined,
      [isIndex ? "index" : "key"]: k,
      path: isIndex || k.includes(".") ? `${parentPath || ""}[${isIndex ? k : `"${k}"`}]` : (parentPath ? `${parentPath}.` : "") + key
    });
    return (_, panic, next) => this.resolve(testOptions)._validate(value, testOptions, panic, next);
  }
  validate(value, options) {
    var _options$disableStack2;
    let schema = this.resolve(Object.assign({}, options, {
      value
    }));
    let disableStackTrace = (_options$disableStack2 = options == null ? void 0 : options.disableStackTrace) != null ? _options$disableStack2 : schema.spec.disableStackTrace;
    return new Promise((resolve, reject) => schema._validate(value, options, (error, parsed) => {
      if (ValidationError.isError(error)) error.value = parsed;
      reject(error);
    }, (errors, validated) => {
      if (errors.length) reject(new ValidationError(errors, validated, void 0, void 0, disableStackTrace));
      else resolve(validated);
    }));
  }
  validateSync(value, options) {
    var _options$disableStack3;
    let schema = this.resolve(Object.assign({}, options, {
      value
    }));
    let result;
    let disableStackTrace = (_options$disableStack3 = options == null ? void 0 : options.disableStackTrace) != null ? _options$disableStack3 : schema.spec.disableStackTrace;
    schema._validate(value, Object.assign({}, options, {
      sync: true
    }), (error, parsed) => {
      if (ValidationError.isError(error)) error.value = parsed;
      throw error;
    }, (errors, validated) => {
      if (errors.length) throw new ValidationError(errors, value, void 0, void 0, disableStackTrace);
      result = validated;
    });
    return result;
  }
  isValid(value, options) {
    return this.validate(value, options).then(() => true, (err) => {
      if (ValidationError.isError(err)) return false;
      throw err;
    });
  }
  isValidSync(value, options) {
    try {
      this.validateSync(value, options);
      return true;
    } catch (err) {
      if (ValidationError.isError(err)) return false;
      throw err;
    }
  }
  _getDefault(options) {
    let defaultValue = this.spec.default;
    if (defaultValue == null) {
      return defaultValue;
    }
    return typeof defaultValue === "function" ? defaultValue.call(this, options) : clone(defaultValue);
  }
  getDefault(options) {
    let schema = this.resolve(options || {});
    return schema._getDefault(options);
  }
  default(def) {
    if (arguments.length === 0) {
      return this._getDefault();
    }
    let next = this.clone({
      default: def
    });
    return next;
  }
  strict(isStrict = true) {
    return this.clone({
      strict: isStrict
    });
  }
  nullability(nullable, message) {
    const next = this.clone({
      nullable
    });
    next.internalTests.nullable = createValidation({
      message,
      name: "nullable",
      test(value) {
        return value === null ? this.schema.spec.nullable : true;
      }
    });
    return next;
  }
  optionality(optional, message) {
    const next = this.clone({
      optional
    });
    next.internalTests.optionality = createValidation({
      message,
      name: "optionality",
      test(value) {
        return value === void 0 ? this.schema.spec.optional : true;
      }
    });
    return next;
  }
  optional() {
    return this.optionality(true);
  }
  defined(message = mixed.defined) {
    return this.optionality(false, message);
  }
  nullable() {
    return this.nullability(true);
  }
  nonNullable(message = mixed.notNull) {
    return this.nullability(false, message);
  }
  required(message = mixed.required) {
    return this.clone().withMutation((next) => next.nonNullable(message).defined(message));
  }
  notRequired() {
    return this.clone().withMutation((next) => next.nullable().optional());
  }
  transform(fn) {
    let next = this.clone();
    next.transforms.push(fn);
    return next;
  }
  /**
   * Adds a test function to the schema's queue of tests.
   * tests can be exclusive or non-exclusive.
   *
   * - exclusive tests, will replace any existing tests of the same name.
   * - non-exclusive: can be stacked
   *
   * If a non-exclusive test is added to a schema with an exclusive test of the same name
   * the exclusive test is removed and further tests of the same name will be stacked.
   *
   * If an exclusive test is added to a schema with non-exclusive tests of the same name
   * the previous tests are removed and further tests of the same name will replace each other.
   */
  test(...args) {
    let opts;
    if (args.length === 1) {
      if (typeof args[0] === "function") {
        opts = {
          test: args[0]
        };
      } else {
        opts = args[0];
      }
    } else if (args.length === 2) {
      opts = {
        name: args[0],
        test: args[1]
      };
    } else {
      opts = {
        name: args[0],
        message: args[1],
        test: args[2]
      };
    }
    if (opts.message === void 0) opts.message = mixed.default;
    if (typeof opts.test !== "function") throw new TypeError("`test` is a required parameters");
    let next = this.clone();
    let validate = createValidation(opts);
    let isExclusive = opts.exclusive || opts.name && next.exclusiveTests[opts.name] === true;
    if (opts.exclusive) {
      if (!opts.name) throw new TypeError("Exclusive tests must provide a unique `name` identifying the test");
    }
    if (opts.name) next.exclusiveTests[opts.name] = !!opts.exclusive;
    next.tests = next.tests.filter((fn) => {
      if (fn.OPTIONS.name === opts.name) {
        if (isExclusive) return false;
        if (fn.OPTIONS.test === validate.OPTIONS.test) return false;
      }
      return true;
    });
    next.tests.push(validate);
    return next;
  }
  when(keys, options) {
    if (!Array.isArray(keys) && typeof keys !== "string") {
      options = keys;
      keys = ".";
    }
    let next = this.clone();
    let deps = toArray(keys).map((key) => new Reference(key));
    deps.forEach((dep) => {
      if (dep.isSibling) next.deps.push(dep.key);
    });
    next.conditions.push(typeof options === "function" ? new Condition(deps, options) : Condition.fromOptions(deps, options));
    return next;
  }
  typeError(message) {
    let next = this.clone();
    next.internalTests.typeError = createValidation({
      message,
      name: "typeError",
      skipAbsent: true,
      test(value) {
        if (!this.schema._typeCheck(value)) return this.createError({
          params: {
            type: this.schema.type
          }
        });
        return true;
      }
    });
    return next;
  }
  oneOf(enums, message = mixed.oneOf) {
    let next = this.clone();
    enums.forEach((val) => {
      next._whitelist.add(val);
      next._blacklist.delete(val);
    });
    next.internalTests.whiteList = createValidation({
      message,
      name: "oneOf",
      skipAbsent: true,
      test(value) {
        let valids = this.schema._whitelist;
        let resolved = valids.resolveAll(this.resolve);
        return resolved.includes(value) ? true : this.createError({
          params: {
            values: Array.from(valids).join(", "),
            resolved
          }
        });
      }
    });
    return next;
  }
  notOneOf(enums, message = mixed.notOneOf) {
    let next = this.clone();
    enums.forEach((val) => {
      next._blacklist.add(val);
      next._whitelist.delete(val);
    });
    next.internalTests.blacklist = createValidation({
      message,
      name: "notOneOf",
      test(value) {
        let invalids = this.schema._blacklist;
        let resolved = invalids.resolveAll(this.resolve);
        if (resolved.includes(value)) return this.createError({
          params: {
            values: Array.from(invalids).join(", "),
            resolved
          }
        });
        return true;
      }
    });
    return next;
  }
  strip(strip = true) {
    let next = this.clone();
    next.spec.strip = strip;
    return next;
  }
  /**
   * Return a serialized description of the schema including validations, flags, types etc.
   *
   * @param options Provide any needed context for resolving runtime schema alterations (lazy, when conditions, etc).
   */
  describe(options) {
    const next = (options ? this.resolve(options) : this).clone();
    const {
      label,
      meta,
      optional,
      nullable
    } = next.spec;
    const description = {
      meta,
      label,
      optional,
      nullable,
      default: next.getDefault(options),
      type: next.type,
      oneOf: next._whitelist.describe(),
      notOneOf: next._blacklist.describe(),
      tests: next.tests.map((fn) => ({
        name: fn.OPTIONS.name,
        params: fn.OPTIONS.params
      })).filter((n, idx, list) => list.findIndex((c) => c.name === n.name) === idx)
    };
    return description;
  }
}
Schema.prototype.__isYupSchema__ = true;
for (const method of ["validate", "validateSync"]) Schema.prototype[`${method}At`] = function(path, value, options = {}) {
  const {
    parent,
    parentPath,
    schema
  } = getIn(this, path, value, options.context);
  return schema[method](parent && parent[parentPath], Object.assign({}, options, {
    parent,
    path
  }));
};
for (const alias of ["equals", "is"]) Schema.prototype[alias] = Schema.prototype.oneOf;
for (const alias of ["not", "nope"]) Schema.prototype[alias] = Schema.prototype.notOneOf;
const returnsTrue = () => true;
function create$8(spec) {
  return new MixedSchema(spec);
}
class MixedSchema extends Schema {
  constructor(spec) {
    super(typeof spec === "function" ? {
      type: "mixed",
      check: spec
    } : Object.assign({
      type: "mixed",
      check: returnsTrue
    }, spec));
  }
}
create$8.prototype = MixedSchema.prototype;
const isoReg = /^(\d{4}|[+-]\d{6})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:[ T]?(\d{2}):?(\d{2})(?::?(\d{2})(?:[,.](\d{1,}))?)?(?:(Z)|([+-])(\d{2})(?::?(\d{2}))?)?)?$/;
function parseIsoDate(date2) {
  const struct = parseDateStruct(date2);
  if (!struct) return Date.parse ? Date.parse(date2) : Number.NaN;
  if (struct.z === void 0 && struct.plusMinus === void 0) {
    return new Date(struct.year, struct.month, struct.day, struct.hour, struct.minute, struct.second, struct.millisecond).valueOf();
  }
  let totalMinutesOffset = 0;
  if (struct.z !== "Z" && struct.plusMinus !== void 0) {
    totalMinutesOffset = struct.hourOffset * 60 + struct.minuteOffset;
    if (struct.plusMinus === "+") totalMinutesOffset = 0 - totalMinutesOffset;
  }
  return Date.UTC(struct.year, struct.month, struct.day, struct.hour, struct.minute + totalMinutesOffset, struct.second, struct.millisecond);
}
function parseDateStruct(date2) {
  var _regexResult$7$length, _regexResult$;
  const regexResult = isoReg.exec(date2);
  if (!regexResult) return null;
  return {
    year: toNumber(regexResult[1]),
    month: toNumber(regexResult[2], 1) - 1,
    day: toNumber(regexResult[3], 1),
    hour: toNumber(regexResult[4]),
    minute: toNumber(regexResult[5]),
    second: toNumber(regexResult[6]),
    millisecond: regexResult[7] ? (
      // allow arbitrary sub-second precision beyond milliseconds
      toNumber(regexResult[7].substring(0, 3))
    ) : 0,
    precision: (_regexResult$7$length = (_regexResult$ = regexResult[7]) == null ? void 0 : _regexResult$.length) != null ? _regexResult$7$length : void 0,
    z: regexResult[8] || void 0,
    plusMinus: regexResult[9] || void 0,
    hourOffset: toNumber(regexResult[10]),
    minuteOffset: toNumber(regexResult[11])
  };
}
function toNumber(str, defaultValue = 0) {
  return Number(str) || defaultValue;
}
let rEmail = (
  // eslint-disable-next-line
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
);
let rUrl = (
  // eslint-disable-next-line
  /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
);
let rUUID = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
let yearMonthDay = "^\\d{4}-\\d{2}-\\d{2}";
let hourMinuteSecond = "\\d{2}:\\d{2}:\\d{2}";
let zOrOffset = "(([+-]\\d{2}(:?\\d{2})?)|Z)";
let rIsoDateTime = new RegExp(`${yearMonthDay}T${hourMinuteSecond}(\\.\\d+)?${zOrOffset}$`);
let isTrimmed = (value) => isAbsent(value) || value === value.trim();
let objStringTag = {}.toString();
function create$6() {
  return new StringSchema();
}
class StringSchema extends Schema {
  constructor() {
    super({
      type: "string",
      check(value) {
        if (value instanceof String) value = value.valueOf();
        return typeof value === "string";
      }
    });
    this.withMutation(() => {
      this.transform((value, _raw, ctx) => {
        if (!ctx.spec.coerce || ctx.isType(value)) return value;
        if (Array.isArray(value)) return value;
        const strValue = value != null && value.toString ? value.toString() : value;
        if (strValue === objStringTag) return value;
        return strValue;
      });
    });
  }
  required(message) {
    return super.required(message).withMutation((schema) => schema.test({
      message: message || mixed.required,
      name: "required",
      skipAbsent: true,
      test: (value) => !!value.length
    }));
  }
  notRequired() {
    return super.notRequired().withMutation((schema) => {
      schema.tests = schema.tests.filter((t) => t.OPTIONS.name !== "required");
      return schema;
    });
  }
  length(length, message = string.length) {
    return this.test({
      message,
      name: "length",
      exclusive: true,
      params: {
        length
      },
      skipAbsent: true,
      test(value) {
        return value.length === this.resolve(length);
      }
    });
  }
  min(min, message = string.min) {
    return this.test({
      message,
      name: "min",
      exclusive: true,
      params: {
        min
      },
      skipAbsent: true,
      test(value) {
        return value.length >= this.resolve(min);
      }
    });
  }
  max(max, message = string.max) {
    return this.test({
      name: "max",
      exclusive: true,
      message,
      params: {
        max
      },
      skipAbsent: true,
      test(value) {
        return value.length <= this.resolve(max);
      }
    });
  }
  matches(regex, options) {
    let excludeEmptyString = false;
    let message;
    let name;
    if (options) {
      if (typeof options === "object") {
        ({
          excludeEmptyString = false,
          message,
          name
        } = options);
      } else {
        message = options;
      }
    }
    return this.test({
      name: name || "matches",
      message: message || string.matches,
      params: {
        regex
      },
      skipAbsent: true,
      test: (value) => value === "" && excludeEmptyString || value.search(regex) !== -1
    });
  }
  email(message = string.email) {
    return this.matches(rEmail, {
      name: "email",
      message,
      excludeEmptyString: true
    });
  }
  url(message = string.url) {
    return this.matches(rUrl, {
      name: "url",
      message,
      excludeEmptyString: true
    });
  }
  uuid(message = string.uuid) {
    return this.matches(rUUID, {
      name: "uuid",
      message,
      excludeEmptyString: false
    });
  }
  datetime(options) {
    let message = "";
    let allowOffset;
    let precision;
    if (options) {
      if (typeof options === "object") {
        ({
          message = "",
          allowOffset = false,
          precision = void 0
        } = options);
      } else {
        message = options;
      }
    }
    return this.matches(rIsoDateTime, {
      name: "datetime",
      message: message || string.datetime,
      excludeEmptyString: true
    }).test({
      name: "datetime_offset",
      message: message || string.datetime_offset,
      params: {
        allowOffset
      },
      skipAbsent: true,
      test: (value) => {
        if (!value || allowOffset) return true;
        const struct = parseDateStruct(value);
        if (!struct) return false;
        return !!struct.z;
      }
    }).test({
      name: "datetime_precision",
      message: message || string.datetime_precision,
      params: {
        precision
      },
      skipAbsent: true,
      test: (value) => {
        if (!value || precision == void 0) return true;
        const struct = parseDateStruct(value);
        if (!struct) return false;
        return struct.precision === precision;
      }
    });
  }
  //-- transforms --
  ensure() {
    return this.default("").transform((val) => val === null ? "" : val);
  }
  trim(message = string.trim) {
    return this.transform((val) => val != null ? val.trim() : val).test({
      message,
      name: "trim",
      test: isTrimmed
    });
  }
  lowercase(message = string.lowercase) {
    return this.transform((value) => !isAbsent(value) ? value.toLowerCase() : value).test({
      message,
      name: "string_case",
      exclusive: true,
      skipAbsent: true,
      test: (value) => isAbsent(value) || value === value.toLowerCase()
    });
  }
  uppercase(message = string.uppercase) {
    return this.transform((value) => !isAbsent(value) ? value.toUpperCase() : value).test({
      message,
      name: "string_case",
      exclusive: true,
      skipAbsent: true,
      test: (value) => isAbsent(value) || value === value.toUpperCase()
    });
  }
}
create$6.prototype = StringSchema.prototype;
let invalidDate = /* @__PURE__ */ new Date("");
let isDate = (obj) => Object.prototype.toString.call(obj) === "[object Date]";
class DateSchema extends Schema {
  constructor() {
    super({
      type: "date",
      check(v) {
        return isDate(v) && !isNaN(v.getTime());
      }
    });
    this.withMutation(() => {
      this.transform((value, _raw, ctx) => {
        if (!ctx.spec.coerce || ctx.isType(value) || value === null) return value;
        value = parseIsoDate(value);
        return !isNaN(value) ? new Date(value) : DateSchema.INVALID_DATE;
      });
    });
  }
  prepareParam(ref, name) {
    let param;
    if (!Reference.isRef(ref)) {
      let cast = this.cast(ref);
      if (!this._typeCheck(cast)) throw new TypeError(`\`${name}\` must be a Date or a value that can be \`cast()\` to a Date`);
      param = cast;
    } else {
      param = ref;
    }
    return param;
  }
  min(min, message = date.min) {
    let limit = this.prepareParam(min, "min");
    return this.test({
      message,
      name: "min",
      exclusive: true,
      params: {
        min
      },
      skipAbsent: true,
      test(value) {
        return value >= this.resolve(limit);
      }
    });
  }
  max(max, message = date.max) {
    let limit = this.prepareParam(max, "max");
    return this.test({
      message,
      name: "max",
      exclusive: true,
      params: {
        max
      },
      skipAbsent: true,
      test(value) {
        return value <= this.resolve(limit);
      }
    });
  }
}
DateSchema.INVALID_DATE = invalidDate;
DateSchema.prototype;
function sortFields(fields, excludedEdges = []) {
  let edges = [];
  let nodes = /* @__PURE__ */ new Set();
  let excludes = new Set(excludedEdges.map(([a, b]) => `${a}-${b}`));
  function addNode(depPath, key) {
    let node = propertyExpr.split(depPath)[0];
    nodes.add(node);
    if (!excludes.has(`${key}-${node}`)) edges.push([key, node]);
  }
  for (const key of Object.keys(fields)) {
    let value = fields[key];
    nodes.add(key);
    if (Reference.isRef(value) && value.isSibling) addNode(value.path, key);
    else if (isSchema(value) && "deps" in value) value.deps.forEach((path) => addNode(path, key));
  }
  return toposort$1.array(Array.from(nodes), edges).reverse();
}
function findIndex(arr, err) {
  let idx = Infinity;
  arr.some((key, ii) => {
    var _err$path;
    if ((_err$path = err.path) != null && _err$path.includes(key)) {
      idx = ii;
      return true;
    }
  });
  return idx;
}
function sortByKeyOrder(keys) {
  return (a, b) => {
    return findIndex(keys, a) - findIndex(keys, b);
  };
}
const parseJson = (value, _, ctx) => {
  if (typeof value !== "string") {
    return value;
  }
  let parsed = value;
  try {
    parsed = JSON.parse(value);
  } catch (err) {
  }
  return ctx.isType(parsed) ? parsed : value;
};
function deepPartial(schema) {
  if ("fields" in schema) {
    const partial = {};
    for (const [key, fieldSchema] of Object.entries(schema.fields)) {
      partial[key] = deepPartial(fieldSchema);
    }
    return schema.setFields(partial);
  }
  if (schema.type === "array") {
    const nextArray = schema.optional();
    if (nextArray.innerType) nextArray.innerType = deepPartial(nextArray.innerType);
    return nextArray;
  }
  if (schema.type === "tuple") {
    return schema.optional().clone({
      types: schema.spec.types.map(deepPartial)
    });
  }
  if ("optional" in schema) {
    return schema.optional();
  }
  return schema;
}
const deepHas = (obj, p) => {
  const path = [...propertyExpr.normalizePath(p)];
  if (path.length === 1) return path[0] in obj;
  let last = path.pop();
  let parent = propertyExpr.getter(propertyExpr.join(path), true)(obj);
  return !!(parent && last in parent);
};
let isObject = (obj) => Object.prototype.toString.call(obj) === "[object Object]";
function unknown(ctx, value) {
  let known = Object.keys(ctx.fields);
  return Object.keys(value).filter((key) => known.indexOf(key) === -1);
}
const defaultSort = sortByKeyOrder([]);
function create$3(spec) {
  return new ObjectSchema(spec);
}
class ObjectSchema extends Schema {
  constructor(spec) {
    super({
      type: "object",
      check(value) {
        return isObject(value) || typeof value === "function";
      }
    });
    this.fields = /* @__PURE__ */ Object.create(null);
    this._sortErrors = defaultSort;
    this._nodes = [];
    this._excludedEdges = [];
    this.withMutation(() => {
      if (spec) {
        this.shape(spec);
      }
    });
  }
  _cast(_value, options = {}) {
    var _options$stripUnknown;
    let value = super._cast(_value, options);
    if (value === void 0) return this.getDefault(options);
    if (!this._typeCheck(value)) return value;
    let fields = this.fields;
    let strip = (_options$stripUnknown = options.stripUnknown) != null ? _options$stripUnknown : this.spec.noUnknown;
    let props = [].concat(this._nodes, Object.keys(value).filter((v) => !this._nodes.includes(v)));
    let intermediateValue = {};
    let innerOptions = Object.assign({}, options, {
      parent: intermediateValue,
      __validating: options.__validating || false
    });
    let isChanged = false;
    for (const prop of props) {
      let field = fields[prop];
      let exists = prop in value;
      if (field) {
        let fieldValue;
        let inputValue = value[prop];
        innerOptions.path = (options.path ? `${options.path}.` : "") + prop;
        field = field.resolve({
          value: inputValue,
          context: options.context,
          parent: intermediateValue
        });
        let fieldSpec = field instanceof Schema ? field.spec : void 0;
        let strict = fieldSpec == null ? void 0 : fieldSpec.strict;
        if (fieldSpec != null && fieldSpec.strip) {
          isChanged = isChanged || prop in value;
          continue;
        }
        fieldValue = !options.__validating || !strict ? (
          // TODO: use _cast, this is double resolving
          field.cast(value[prop], innerOptions)
        ) : value[prop];
        if (fieldValue !== void 0) {
          intermediateValue[prop] = fieldValue;
        }
      } else if (exists && !strip) {
        intermediateValue[prop] = value[prop];
      }
      if (exists !== prop in intermediateValue || intermediateValue[prop] !== value[prop]) {
        isChanged = true;
      }
    }
    return isChanged ? intermediateValue : value;
  }
  _validate(_value, options = {}, panic, next) {
    let {
      from = [],
      originalValue = _value,
      recursive = this.spec.recursive
    } = options;
    options.from = [{
      schema: this,
      value: originalValue
    }, ...from];
    options.__validating = true;
    options.originalValue = originalValue;
    super._validate(_value, options, panic, (objectErrors, value) => {
      if (!recursive || !isObject(value)) {
        next(objectErrors, value);
        return;
      }
      originalValue = originalValue || value;
      let tests = [];
      for (let key of this._nodes) {
        let field = this.fields[key];
        if (!field || Reference.isRef(field)) {
          continue;
        }
        tests.push(field.asNestedTest({
          options,
          key,
          parent: value,
          parentPath: options.path,
          originalParent: originalValue
        }));
      }
      this.runTests({
        tests,
        value,
        originalValue,
        options
      }, panic, (fieldErrors) => {
        next(fieldErrors.sort(this._sortErrors).concat(objectErrors), value);
      });
    });
  }
  clone(spec) {
    const next = super.clone(spec);
    next.fields = Object.assign({}, this.fields);
    next._nodes = this._nodes;
    next._excludedEdges = this._excludedEdges;
    next._sortErrors = this._sortErrors;
    return next;
  }
  concat(schema) {
    let next = super.concat(schema);
    let nextFields = next.fields;
    for (let [field, schemaOrRef] of Object.entries(this.fields)) {
      const target = nextFields[field];
      nextFields[field] = target === void 0 ? schemaOrRef : target;
    }
    return next.withMutation((s) => (
      // XXX: excludes here is wrong
      s.setFields(nextFields, [...this._excludedEdges, ...schema._excludedEdges])
    ));
  }
  _getDefault(options) {
    if ("default" in this.spec) {
      return super._getDefault(options);
    }
    if (!this._nodes.length) {
      return void 0;
    }
    let dft = {};
    this._nodes.forEach((key) => {
      var _innerOptions;
      const field = this.fields[key];
      let innerOptions = options;
      if ((_innerOptions = innerOptions) != null && _innerOptions.value) {
        innerOptions = Object.assign({}, innerOptions, {
          parent: innerOptions.value,
          value: innerOptions.value[key]
        });
      }
      dft[key] = field && "getDefault" in field ? field.getDefault(innerOptions) : void 0;
    });
    return dft;
  }
  setFields(shape, excludedEdges) {
    let next = this.clone();
    next.fields = shape;
    next._nodes = sortFields(shape, excludedEdges);
    next._sortErrors = sortByKeyOrder(Object.keys(shape));
    if (excludedEdges) next._excludedEdges = excludedEdges;
    return next;
  }
  shape(additions, excludes = []) {
    return this.clone().withMutation((next) => {
      let edges = next._excludedEdges;
      if (excludes.length) {
        if (!Array.isArray(excludes[0])) excludes = [excludes];
        edges = [...next._excludedEdges, ...excludes];
      }
      return next.setFields(Object.assign(next.fields, additions), edges);
    });
  }
  partial() {
    const partial = {};
    for (const [key, schema] of Object.entries(this.fields)) {
      partial[key] = "optional" in schema && schema.optional instanceof Function ? schema.optional() : schema;
    }
    return this.setFields(partial);
  }
  deepPartial() {
    const next = deepPartial(this);
    return next;
  }
  pick(keys) {
    const picked = {};
    for (const key of keys) {
      if (this.fields[key]) picked[key] = this.fields[key];
    }
    return this.setFields(picked, this._excludedEdges.filter(([a, b]) => keys.includes(a) && keys.includes(b)));
  }
  omit(keys) {
    const remaining = [];
    for (const key of Object.keys(this.fields)) {
      if (keys.includes(key)) continue;
      remaining.push(key);
    }
    return this.pick(remaining);
  }
  from(from, to, alias) {
    let fromGetter = propertyExpr.getter(from, true);
    return this.transform((obj) => {
      if (!obj) return obj;
      let newObj = obj;
      if (deepHas(obj, from)) {
        newObj = Object.assign({}, obj);
        if (!alias) delete newObj[from];
        newObj[to] = fromGetter(obj);
      }
      return newObj;
    });
  }
  /** Parse an input JSON string to an object */
  json() {
    return this.transform(parseJson);
  }
  noUnknown(noAllow = true, message = object.noUnknown) {
    if (typeof noAllow !== "boolean") {
      message = noAllow;
      noAllow = true;
    }
    let next = this.test({
      name: "noUnknown",
      exclusive: true,
      message,
      test(value) {
        if (value == null) return true;
        const unknownKeys = unknown(this.schema, value);
        return !noAllow || unknownKeys.length === 0 || this.createError({
          params: {
            unknown: unknownKeys.join(", ")
          }
        });
      }
    });
    next.spec.noUnknown = noAllow;
    return next;
  }
  unknown(allow = true, message = object.noUnknown) {
    return this.noUnknown(!allow, message);
  }
  transformKeys(fn) {
    return this.transform((obj) => {
      if (!obj) return obj;
      const result = {};
      for (const key of Object.keys(obj)) result[fn(key)] = obj[key];
      return result;
    });
  }
  camelCase() {
    return this.transformKeys(tinyCase.camelCase);
  }
  snakeCase() {
    return this.transformKeys(tinyCase.snakeCase);
  }
  constantCase() {
    return this.transformKeys((key) => tinyCase.snakeCase(key).toUpperCase());
  }
  describe(options) {
    const next = (options ? this.resolve(options) : this).clone();
    const base = super.describe(options);
    base.fields = {};
    for (const [key, value] of Object.entries(next.fields)) {
      var _innerOptions2;
      let innerOptions = options;
      if ((_innerOptions2 = innerOptions) != null && _innerOptions2.value) {
        innerOptions = Object.assign({}, innerOptions, {
          parent: innerOptions.value,
          value: innerOptions.value[key]
        });
      }
      base.fields[key] = value.describe(innerOptions);
    }
    return base;
  }
}
create$3.prototype = ObjectSchema.prototype;
function create(builder) {
  return new Lazy(builder);
}
class Lazy {
  constructor(builder) {
    this.type = "lazy";
    this.__isYupSchema__ = true;
    this.spec = void 0;
    this._resolve = (value, options = {}) => {
      let schema = this.builder(value, options);
      if (!isSchema(schema)) throw new TypeError("lazy() functions must return a valid schema");
      if (this.spec.optional) schema = schema.optional();
      return schema.resolve(options);
    };
    this.builder = builder;
    this.spec = {
      meta: void 0,
      optional: false
    };
  }
  clone(spec) {
    const next = new Lazy(this.builder);
    next.spec = Object.assign({}, this.spec, spec);
    return next;
  }
  optionality(optional) {
    const next = this.clone({
      optional
    });
    return next;
  }
  optional() {
    return this.optionality(true);
  }
  resolve(options) {
    return this._resolve(options.value, options);
  }
  cast(value, options) {
    return this._resolve(value, options).cast(value, options);
  }
  asNestedTest(config) {
    let {
      key,
      index,
      parent,
      options
    } = config;
    let value = parent[index != null ? index : key];
    return this._resolve(value, Object.assign({}, options, {
      value,
      parent
    })).asNestedTest(config);
  }
  validate(value, options) {
    return this._resolve(value, options).validate(value, options);
  }
  validateSync(value, options) {
    return this._resolve(value, options).validateSync(value, options);
  }
  validateAt(path, value, options) {
    return this._resolve(value, options).validateAt(path, value, options);
  }
  validateSyncAt(path, value, options) {
    return this._resolve(value, options).validateSyncAt(path, value, options);
  }
  isValid(value, options) {
    return this._resolve(value, options).isValid(value, options);
  }
  isValidSync(value, options) {
    return this._resolve(value, options).isValidSync(value, options);
  }
  describe(options) {
    return options ? this.resolve(options).describe(options) : {
      type: "lazy",
      meta: this.spec.meta,
      label: void 0
    };
  }
  meta(...args) {
    if (args.length === 0) return this.spec.meta;
    let next = this.clone();
    next.spec.meta = Object.assign(next.spec.meta || {}, args[0]);
    return next;
  }
}
const initForm = (theForm) => {
  render(
    validationMessageTemplate(),
    document.querySelector("felte-validation-message")
  );
  let doSecond = false;
  const schema = create$3().shape({
    name: create$6().required("Must have a name"),
    password: create$6().required("Must have a password"),
    second: create((value) => {
      _config.log(value);
      if (value !== void 0) {
        return create$6().required("Must have a second");
      }
      return create$8().notRequired();
    })
  });
  const felteForm = theForm;
  felteForm.configuration = {
    onSubmit: (values) => {
      const submittedSection = document.getElementById("submitted");
      submittedSection.innerHTML = `
        <h2 class="text-xl font-bold">Submitted:</h2>
        <pre>${JSON.stringify(values, null, 2)}</pre>
      `;
    },
    extend: [validator({ schema }), reporter]
  };
  const form = document.querySelector("form");
  const submitted = document.getElementById("submitted");
  form.addEventListener("reset", function() {
    submitted.innerHTML = "";
  });
  setTimeout(() => {
    render(nameTemplate("name", doSecond), theForm.querySelector("#holder"));
  }, "1000");
  document.querySelector("#second").onclick = (e) => {
    doSecond = !doSecond;
    render(nameTemplate("name", doSecond), theForm.querySelector("#holder"));
  };
  felteForm.onDataChange = () => {
    _config.log("Form data = ", felteForm.data);
  };
  felteForm.onErrorsChange = () => {
    const errors = [];
    Object.entries(felteForm.errors).forEach(([key, value]) => {
      if (value) {
        errors.push(value);
      }
    });
    _config.log(errors.flat());
    if (errors.length > 0) {
      render(errorsTemplate(errors), theForm.querySelector(".errors"));
    } else {
      render("", theForm.querySelector(".errors"));
    }
  };
  felteForm.onIsDirtyChange = () => {
    _config.log(felteForm.isDirty);
  };
};
const validationMessageTemplate = () => {
  return html`
    <template>
      <ul aria-live="polite">
        <li data-part="item"></li>
      </ul>
    </template>
  `;
};
const nameTemplate = (name, doSecond) => {
  const getSecond = () => {
    if (doSecond) {
      return html`
        <label class="block text-gray-700 text-sm font-bold mb-2" for="second">Second</label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="second" required />
        <felte-validation-message for="second">
          ${validationMessageTemplate()}
          <!-- The template for the validation message -->
        </felte-validation-message>
      `;
    } else {
      return "";
    }
  };
  return html`
    <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Name</label>
    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="${name}" required />
    <felte-validation-message for="${name}">
      ${validationMessageTemplate()}
      <!-- The template for the validation message -->
    </felte-validation-message>
    ${getSecond()}
  `;
};
const errorsTemplate = (errors) => {
  const errorTemplates = [];
  errors.forEach((error) => {
    _config.log(error);
    errorTemplates.push(html`<p>${error}</p>`);
  });
  return html`
    <h2 class="text-xl font-bold">Errors</h2>

    <!-- Render the lit-html templates for the errors. -->
    ${errorTemplates}
  `;
};
export {
  AccordionModule as A,
  _config as _,
  html as h,
  initForm as i,
  noChange as n,
  render as r
};
