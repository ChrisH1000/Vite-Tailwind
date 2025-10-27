var _a, _b;
import { r as render, n as noChange, h as html, _ as _config, i as initForm, A as AccordionModule } from "../FelteFormsModule-CpxpagSq.js";
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const NODE_MODE = false;
const global$2 = globalThis;
const supportsAdoptingStyleSheets = global$2.ShadowRoot && (global$2.ShadyCSS === void 0 || global$2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
const constructionToken = Symbol();
const cssTagCache = /* @__PURE__ */ new WeakMap();
class CSSResult {
  constructor(cssText, strings, safeToken) {
    this["_$cssResult$"] = true;
    if (safeToken !== constructionToken) {
      throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    }
    this.cssText = cssText;
    this._strings = strings;
  }
  // This is a getter so that it's lazy. In practice, this means stylesheets
  // are not created until the first element instance is made.
  get styleSheet() {
    let styleSheet = this._styleSheet;
    const strings = this._strings;
    if (supportsAdoptingStyleSheets && styleSheet === void 0) {
      const cacheable = strings !== void 0 && strings.length === 1;
      if (cacheable) {
        styleSheet = cssTagCache.get(strings);
      }
      if (styleSheet === void 0) {
        (this._styleSheet = styleSheet = new CSSStyleSheet()).replaceSync(this.cssText);
        if (cacheable) {
          cssTagCache.set(strings, styleSheet);
        }
      }
    }
    return styleSheet;
  }
  toString() {
    return this.cssText;
  }
}
const unsafeCSS = (value) => new CSSResult(typeof value === "string" ? value : String(value), void 0, constructionToken);
const adoptStyles = (renderRoot, styles) => {
  if (supportsAdoptingStyleSheets) {
    renderRoot.adoptedStyleSheets = styles.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  } else {
    for (const s of styles) {
      const style = document.createElement("style");
      const nonce = global$2["litNonce"];
      if (nonce !== void 0) {
        style.setAttribute("nonce", nonce);
      }
      style.textContent = s.cssText;
      renderRoot.appendChild(style);
    }
  }
};
const cssResultFromStyleSheet = (sheet) => {
  let cssText = "";
  for (const rule of sheet.cssRules) {
    cssText += rule.cssText;
  }
  return unsafeCSS(cssText);
};
const getCompatibleStyle = supportsAdoptingStyleSheets || NODE_MODE ? (s) => s : (s) => s instanceof CSSStyleSheet ? cssResultFromStyleSheet(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is, defineProperty, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, getPrototypeOf } = Object;
const global$1 = globalThis;
let issueWarning$1;
const trustedTypes = global$1.trustedTypes;
const emptyStringForBooleanAttribute = trustedTypes ? trustedTypes.emptyScript : "";
const polyfillSupport$1 = global$1.reactiveElementPolyfillSupportDevMode;
{
  const issuedWarnings = global$1.litIssuedWarnings ?? (global$1.litIssuedWarnings = /* @__PURE__ */ new Set());
  issueWarning$1 = (code, warning) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!issuedWarnings.has(warning)) {
      console.warn(warning);
      issuedWarnings.add(warning);
    }
  };
  issueWarning$1("dev-mode", `Lit is in dev mode. Not recommended for production!`);
  if (((_a = global$1.ShadyDOM) == null ? void 0 : _a.inUse) && polyfillSupport$1 === void 0) {
    issueWarning$1("polyfill-support-missing", `Shadow DOM is being polyfilled via \`ShadyDOM\` but the \`polyfill-support\` module has not been loaded.`);
  }
}
const debugLogEvent = (event) => {
  const shouldEmit = global$1.emitLitDebugLogEvents;
  if (!shouldEmit) {
    return;
  }
  global$1.dispatchEvent(new CustomEvent("lit-debug", {
    detail: event
  }));
};
const JSCompiler_renameProperty$1 = (prop, _obj) => prop;
const defaultConverter = {
  toAttribute(value, type) {
    switch (type) {
      case Boolean:
        value = value ? emptyStringForBooleanAttribute : null;
        break;
      case Object:
      case Array:
        value = value == null ? value : JSON.stringify(value);
        break;
    }
    return value;
  },
  fromAttribute(value, type) {
    let fromValue = value;
    switch (type) {
      case Boolean:
        fromValue = value !== null;
        break;
      case Number:
        fromValue = value === null ? null : Number(value);
        break;
      case Object:
      case Array:
        try {
          fromValue = JSON.parse(value);
        } catch (e) {
          fromValue = null;
        }
        break;
    }
    return fromValue;
  }
};
const notEqual = (value, old) => !is(value, old);
const defaultPropertyDeclaration = {
  attribute: true,
  type: String,
  converter: defaultConverter,
  reflect: false,
  hasChanged: notEqual
};
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata"));
global$1.litPropertyMetadata ?? (global$1.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class ReactiveElement extends HTMLElement {
  /**
   * Adds an initializer function to the class that is called during instance
   * construction.
   *
   * This is useful for code that runs against a `ReactiveElement`
   * subclass, such as a decorator, that needs to do work for each
   * instance, such as setting up a `ReactiveController`.
   *
   * ```ts
   * const myDecorator = (target: typeof ReactiveElement, key: string) => {
   *   target.addInitializer((instance: ReactiveElement) => {
   *     // This is run during construction of the element
   *     new MyController(instance);
   *   });
   * }
   * ```
   *
   * Decorating a field will then cause each instance to run an initializer
   * that adds a controller:
   *
   * ```ts
   * class MyElement extends LitElement {
   *   @myDecorator foo;
   * }
   * ```
   *
   * Initializers are stored per-constructor. Adding an initializer to a
   * subclass does not add it to a superclass. Since initializers are run in
   * constructors, initializers will run in order of the class hierarchy,
   * starting with superclasses and progressing to the instance's class.
   *
   * @nocollapse
   */
  static addInitializer(initializer) {
    this.__prepare();
    (this._initializers ?? (this._initializers = [])).push(initializer);
  }
  /**
   * Returns a list of attributes corresponding to the registered properties.
   * @nocollapse
   * @category attributes
   */
  static get observedAttributes() {
    this.finalize();
    return this.__attributeToPropertyMap && [...this.__attributeToPropertyMap.keys()];
  }
  /**
   * Creates a property accessor on the element prototype if one does not exist
   * and stores a {@linkcode PropertyDeclaration} for the property with the
   * given options. The property setter calls the property's `hasChanged`
   * property option or uses a strict identity check to determine whether or not
   * to request an update.
   *
   * This method may be overridden to customize properties; however,
   * when doing so, it's important to call `super.createProperty` to ensure
   * the property is setup correctly. This method calls
   * `getPropertyDescriptor` internally to get a descriptor to install.
   * To customize what properties do when they are get or set, override
   * `getPropertyDescriptor`. To customize the options for a property,
   * implement `createProperty` like this:
   *
   * ```ts
   * static createProperty(name, options) {
   *   options = Object.assign(options, {myOption: true});
   *   super.createProperty(name, options);
   * }
   * ```
   *
   * @nocollapse
   * @category properties
   */
  static createProperty(name, options = defaultPropertyDeclaration) {
    if (options.state) {
      options.attribute = false;
    }
    this.__prepare();
    this.elementProperties.set(name, options);
    if (!options.noAccessor) {
      const key = (
        // Use Symbol.for in dev mode to make it easier to maintain state
        // when doing HMR.
        Symbol.for(`${String(name)} (@property() cache)`)
      );
      const descriptor = this.getPropertyDescriptor(name, key, options);
      if (descriptor !== void 0) {
        defineProperty(this.prototype, name, descriptor);
      }
    }
  }
  /**
   * Returns a property descriptor to be defined on the given named property.
   * If no descriptor is returned, the property will not become an accessor.
   * For example,
   *
   * ```ts
   * class MyElement extends LitElement {
   *   static getPropertyDescriptor(name, key, options) {
   *     const defaultDescriptor =
   *         super.getPropertyDescriptor(name, key, options);
   *     const setter = defaultDescriptor.set;
   *     return {
   *       get: defaultDescriptor.get,
   *       set(value) {
   *         setter.call(this, value);
   *         // custom action.
   *       },
   *       configurable: true,
   *       enumerable: true
   *     }
   *   }
   * }
   * ```
   *
   * @nocollapse
   * @category properties
   */
  static getPropertyDescriptor(name, key, options) {
    const { get, set } = getOwnPropertyDescriptor(this.prototype, name) ?? {
      get() {
        return this[key];
      },
      set(v) {
        this[key] = v;
      }
    };
    if (get == null) {
      if ("value" in (getOwnPropertyDescriptor(this.prototype, name) ?? {})) {
        throw new Error(`Field ${JSON.stringify(String(name))} on ${this.name} was declared as a reactive property but it's actually declared as a value on the prototype. Usually this is due to using @property or @state on a method.`);
      }
      issueWarning$1("reactive-property-without-getter", `Field ${JSON.stringify(String(name))} on ${this.name} was declared as a reactive property but it does not have a getter. This will be an error in a future version of Lit.`);
    }
    return {
      get() {
        return get == null ? void 0 : get.call(this);
      },
      set(value) {
        const oldValue = get == null ? void 0 : get.call(this);
        set.call(this, value);
        this.requestUpdate(name, oldValue, options);
      },
      configurable: true,
      enumerable: true
    };
  }
  /**
   * Returns the property options associated with the given property.
   * These options are defined with a `PropertyDeclaration` via the `properties`
   * object or the `@property` decorator and are registered in
   * `createProperty(...)`.
   *
   * Note, this method should be considered "final" and not overridden. To
   * customize the options for a given property, override
   * {@linkcode createProperty}.
   *
   * @nocollapse
   * @final
   * @category properties
   */
  static getPropertyOptions(name) {
    return this.elementProperties.get(name) ?? defaultPropertyDeclaration;
  }
  /**
   * Initializes static own properties of the class used in bookkeeping
   * for element properties, initializers, etc.
   *
   * Can be called multiple times by code that needs to ensure these
   * properties exist before using them.
   *
   * This method ensures the superclass is finalized so that inherited
   * property metadata can be copied down.
   * @nocollapse
   */
  static __prepare() {
    if (this.hasOwnProperty(JSCompiler_renameProperty$1("elementProperties"))) {
      return;
    }
    const superCtor = getPrototypeOf(this);
    superCtor.finalize();
    if (superCtor._initializers !== void 0) {
      this._initializers = [...superCtor._initializers];
    }
    this.elementProperties = new Map(superCtor.elementProperties);
  }
  /**
   * Finishes setting up the class so that it's ready to be registered
   * as a custom element and instantiated.
   *
   * This method is called by the ReactiveElement.observedAttributes getter.
   * If you override the observedAttributes getter, you must either call
   * super.observedAttributes to trigger finalization, or call finalize()
   * yourself.
   *
   * @nocollapse
   */
  static finalize() {
    if (this.hasOwnProperty(JSCompiler_renameProperty$1("finalized"))) {
      return;
    }
    this.finalized = true;
    this.__prepare();
    if (this.hasOwnProperty(JSCompiler_renameProperty$1("properties"))) {
      const props = this.properties;
      const propKeys = [
        ...getOwnPropertyNames(props),
        ...getOwnPropertySymbols(props)
      ];
      for (const p of propKeys) {
        this.createProperty(p, props[p]);
      }
    }
    const metadata = this[Symbol.metadata];
    if (metadata !== null) {
      const properties = litPropertyMetadata.get(metadata);
      if (properties !== void 0) {
        for (const [p, options] of properties) {
          this.elementProperties.set(p, options);
        }
      }
    }
    this.__attributeToPropertyMap = /* @__PURE__ */ new Map();
    for (const [p, options] of this.elementProperties) {
      const attr = this.__attributeNameForProperty(p, options);
      if (attr !== void 0) {
        this.__attributeToPropertyMap.set(attr, p);
      }
    }
    this.elementStyles = this.finalizeStyles(this.styles);
    {
      if (this.hasOwnProperty("createProperty")) {
        issueWarning$1("no-override-create-property", "Overriding ReactiveElement.createProperty() is deprecated. The override will not be called with standard decorators");
      }
      if (this.hasOwnProperty("getPropertyDescriptor")) {
        issueWarning$1("no-override-get-property-descriptor", "Overriding ReactiveElement.getPropertyDescriptor() is deprecated. The override will not be called with standard decorators");
      }
    }
  }
  /**
   * Takes the styles the user supplied via the `static styles` property and
   * returns the array of styles to apply to the element.
   * Override this method to integrate into a style management system.
   *
   * Styles are deduplicated preserving the _last_ instance in the list. This
   * is a performance optimization to avoid duplicated styles that can occur
   * especially when composing via subclassing. The last item is kept to try
   * to preserve the cascade order with the assumption that it's most important
   * that last added styles override previous styles.
   *
   * @nocollapse
   * @category styles
   */
  static finalizeStyles(styles) {
    const elementStyles = [];
    if (Array.isArray(styles)) {
      const set = new Set(styles.flat(Infinity).reverse());
      for (const s of set) {
        elementStyles.unshift(getCompatibleStyle(s));
      }
    } else if (styles !== void 0) {
      elementStyles.push(getCompatibleStyle(styles));
    }
    return elementStyles;
  }
  /**
   * Returns the property name for the given attribute `name`.
   * @nocollapse
   */
  static __attributeNameForProperty(name, options) {
    const attribute = options.attribute;
    return attribute === false ? void 0 : typeof attribute === "string" ? attribute : typeof name === "string" ? name.toLowerCase() : void 0;
  }
  constructor() {
    super();
    this.__instanceProperties = void 0;
    this.isUpdatePending = false;
    this.hasUpdated = false;
    this.__reflectingProperty = null;
    this.__initialize();
  }
  /**
   * Internal only override point for customizing work done when elements
   * are constructed.
   */
  __initialize() {
    var _a2;
    this.__updatePromise = new Promise((res) => this.enableUpdating = res);
    this._$changedProperties = /* @__PURE__ */ new Map();
    this.__saveInstanceProperties();
    this.requestUpdate();
    (_a2 = this.constructor._initializers) == null ? void 0 : _a2.forEach((i) => i(this));
  }
  /**
   * Registers a `ReactiveController` to participate in the element's reactive
   * update cycle. The element automatically calls into any registered
   * controllers during its lifecycle callbacks.
   *
   * If the element is connected when `addController()` is called, the
   * controller's `hostConnected()` callback will be immediately called.
   * @category controllers
   */
  addController(controller) {
    var _a2;
    (this.__controllers ?? (this.__controllers = /* @__PURE__ */ new Set())).add(controller);
    if (this.renderRoot !== void 0 && this.isConnected) {
      (_a2 = controller.hostConnected) == null ? void 0 : _a2.call(controller);
    }
  }
  /**
   * Removes a `ReactiveController` from the element.
   * @category controllers
   */
  removeController(controller) {
    var _a2;
    (_a2 = this.__controllers) == null ? void 0 : _a2.delete(controller);
  }
  /**
   * Fixes any properties set on the instance before upgrade time.
   * Otherwise these would shadow the accessor and break these properties.
   * The properties are stored in a Map which is played back after the
   * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
   * (<=41), properties created for native platform properties like (`id` or
   * `name`) may not have default values set in the element constructor. On
   * these browsers native properties appear on instances and therefore their
   * default value will overwrite any element default (e.g. if the element sets
   * this.id = 'id' in the constructor, the 'id' will become '' since this is
   * the native platform default).
   */
  __saveInstanceProperties() {
    const instanceProperties = /* @__PURE__ */ new Map();
    const elementProperties = this.constructor.elementProperties;
    for (const p of elementProperties.keys()) {
      if (this.hasOwnProperty(p)) {
        instanceProperties.set(p, this[p]);
        delete this[p];
      }
    }
    if (instanceProperties.size > 0) {
      this.__instanceProperties = instanceProperties;
    }
  }
  /**
   * Returns the node into which the element should render and by default
   * creates and returns an open shadowRoot. Implement to customize where the
   * element's DOM is rendered. For example, to render into the element's
   * childNodes, return `this`.
   *
   * @return Returns a node into which to render.
   * @category rendering
   */
  createRenderRoot() {
    const renderRoot = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    adoptStyles(renderRoot, this.constructor.elementStyles);
    return renderRoot;
  }
  /**
   * On first connection, creates the element's renderRoot, sets up
   * element styling, and enables updating.
   * @category lifecycle
   */
  connectedCallback() {
    var _a2;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot());
    this.enableUpdating(true);
    (_a2 = this.__controllers) == null ? void 0 : _a2.forEach((c) => {
      var _a3;
      return (_a3 = c.hostConnected) == null ? void 0 : _a3.call(c);
    });
  }
  /**
   * Note, this method should be considered final and not overridden. It is
   * overridden on the element instance with a function that triggers the first
   * update.
   * @category updates
   */
  enableUpdating(_requestedUpdate) {
  }
  /**
   * Allows for `super.disconnectedCallback()` in extensions while
   * reserving the possibility of making non-breaking feature additions
   * when disconnecting at some point in the future.
   * @category lifecycle
   */
  disconnectedCallback() {
    var _a2;
    (_a2 = this.__controllers) == null ? void 0 : _a2.forEach((c) => {
      var _a3;
      return (_a3 = c.hostDisconnected) == null ? void 0 : _a3.call(c);
    });
  }
  /**
   * Synchronizes property values when attributes change.
   *
   * Specifically, when an attribute is set, the corresponding property is set.
   * You should rarely need to implement this callback. If this method is
   * overridden, `super.attributeChangedCallback(name, _old, value)` must be
   * called.
   *
   * See [using the lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks)
   * on MDN for more information about the `attributeChangedCallback`.
   * @category attributes
   */
  attributeChangedCallback(name, _old, value) {
    this._$attributeToProperty(name, value);
  }
  __propertyToAttribute(name, value) {
    var _a2;
    const elemProperties = this.constructor.elementProperties;
    const options = elemProperties.get(name);
    const attr = this.constructor.__attributeNameForProperty(name, options);
    if (attr !== void 0 && options.reflect === true) {
      const converter = ((_a2 = options.converter) == null ? void 0 : _a2.toAttribute) !== void 0 ? options.converter : defaultConverter;
      const attrValue = converter.toAttribute(value, options.type);
      if (this.constructor.enabledWarnings.includes("migration") && attrValue === void 0) {
        issueWarning$1("undefined-attribute-value", `The attribute value for the ${name} property is undefined on element ${this.localName}. The attribute will be removed, but in the previous version of \`ReactiveElement\`, the attribute would not have changed.`);
      }
      this.__reflectingProperty = name;
      if (attrValue == null) {
        this.removeAttribute(attr);
      } else {
        this.setAttribute(attr, attrValue);
      }
      this.__reflectingProperty = null;
    }
  }
  /** @internal */
  _$attributeToProperty(name, value) {
    var _a2;
    const ctor = this.constructor;
    const propName = ctor.__attributeToPropertyMap.get(name);
    if (propName !== void 0 && this.__reflectingProperty !== propName) {
      const options = ctor.getPropertyOptions(propName);
      const converter = typeof options.converter === "function" ? { fromAttribute: options.converter } : ((_a2 = options.converter) == null ? void 0 : _a2.fromAttribute) !== void 0 ? options.converter : defaultConverter;
      this.__reflectingProperty = propName;
      this[propName] = converter.fromAttribute(
        value,
        options.type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      );
      this.__reflectingProperty = null;
    }
  }
  /**
   * Requests an update which is processed asynchronously. This should be called
   * when an element should update based on some state not triggered by setting
   * a reactive property. In this case, pass no arguments. It should also be
   * called when manually implementing a property setter. In this case, pass the
   * property `name` and `oldValue` to ensure that any configured property
   * options are honored.
   *
   * @param name name of requesting property
   * @param oldValue old value of requesting property
   * @param options property options to use instead of the previously
   *     configured options
   * @category updates
   */
  requestUpdate(name, oldValue, options) {
    if (name !== void 0) {
      if (name instanceof Event) {
        issueWarning$1(``, `The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()`);
      }
      options ?? (options = this.constructor.getPropertyOptions(name));
      const hasChanged = options.hasChanged ?? notEqual;
      const newValue = this[name];
      if (hasChanged(newValue, oldValue)) {
        this._$changeProperty(name, oldValue, options);
      } else {
        return;
      }
    }
    if (this.isUpdatePending === false) {
      this.__updatePromise = this.__enqueueUpdate();
    }
  }
  /**
   * @internal
   */
  _$changeProperty(name, oldValue, options) {
    if (!this._$changedProperties.has(name)) {
      this._$changedProperties.set(name, oldValue);
    }
    if (options.reflect === true && this.__reflectingProperty !== name) {
      (this.__reflectingProperties ?? (this.__reflectingProperties = /* @__PURE__ */ new Set())).add(name);
    }
  }
  /**
   * Sets up the element to asynchronously update.
   */
  async __enqueueUpdate() {
    this.isUpdatePending = true;
    try {
      await this.__updatePromise;
    } catch (e) {
      Promise.reject(e);
    }
    const result = this.scheduleUpdate();
    if (result != null) {
      await result;
    }
    return !this.isUpdatePending;
  }
  /**
   * Schedules an element update. You can override this method to change the
   * timing of updates by returning a Promise. The update will await the
   * returned Promise, and you should resolve the Promise to allow the update
   * to proceed. If this method is overridden, `super.scheduleUpdate()`
   * must be called.
   *
   * For instance, to schedule updates to occur just before the next frame:
   *
   * ```ts
   * override protected async scheduleUpdate(): Promise<unknown> {
   *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
   *   super.scheduleUpdate();
   * }
   * ```
   * @category updates
   */
  scheduleUpdate() {
    const result = this.performUpdate();
    if (this.constructor.enabledWarnings.includes("async-perform-update") && typeof (result == null ? void 0 : result.then) === "function") {
      issueWarning$1("async-perform-update", `Element ${this.localName} returned a Promise from performUpdate(). This behavior is deprecated and will be removed in a future version of ReactiveElement.`);
    }
    return result;
  }
  /**
   * Performs an element update. Note, if an exception is thrown during the
   * update, `firstUpdated` and `updated` will not be called.
   *
   * Call `performUpdate()` to immediately process a pending update. This should
   * generally not be needed, but it can be done in rare cases when you need to
   * update synchronously.
   *
   * @category updates
   */
  performUpdate() {
    var _a2;
    if (!this.isUpdatePending) {
      return;
    }
    debugLogEvent == null ? void 0 : debugLogEvent({ kind: "update" });
    if (!this.hasUpdated) {
      this.renderRoot ?? (this.renderRoot = this.createRenderRoot());
      {
        const ctor = this.constructor;
        const shadowedProperties = [...ctor.elementProperties.keys()].filter((p) => this.hasOwnProperty(p) && p in getPrototypeOf(this));
        if (shadowedProperties.length) {
          throw new Error(`The following properties on element ${this.localName} will not trigger updates as expected because they are set using class fields: ${shadowedProperties.join(", ")}. Native class fields and some compiled output will overwrite accessors used for detecting changes. See https://lit.dev/msg/class-field-shadowing for more information.`);
        }
      }
      if (this.__instanceProperties) {
        for (const [p, value] of this.__instanceProperties) {
          this[p] = value;
        }
        this.__instanceProperties = void 0;
      }
      const elementProperties = this.constructor.elementProperties;
      if (elementProperties.size > 0) {
        for (const [p, options] of elementProperties) {
          if (options.wrapped === true && !this._$changedProperties.has(p) && this[p] !== void 0) {
            this._$changeProperty(p, this[p], options);
          }
        }
      }
    }
    let shouldUpdate = false;
    const changedProperties = this._$changedProperties;
    try {
      shouldUpdate = this.shouldUpdate(changedProperties);
      if (shouldUpdate) {
        this.willUpdate(changedProperties);
        (_a2 = this.__controllers) == null ? void 0 : _a2.forEach((c) => {
          var _a3;
          return (_a3 = c.hostUpdate) == null ? void 0 : _a3.call(c);
        });
        this.update(changedProperties);
      } else {
        this.__markUpdated();
      }
    } catch (e) {
      shouldUpdate = false;
      this.__markUpdated();
      throw e;
    }
    if (shouldUpdate) {
      this._$didUpdate(changedProperties);
    }
  }
  /**
   * Invoked before `update()` to compute values needed during the update.
   *
   * Implement `willUpdate` to compute property values that depend on other
   * properties and are used in the rest of the update process.
   *
   * ```ts
   * willUpdate(changedProperties) {
   *   // only need to check changed properties for an expensive computation.
   *   if (changedProperties.has('firstName') || changedProperties.has('lastName')) {
   *     this.sha = computeSHA(`${this.firstName} ${this.lastName}`);
   *   }
   * }
   *
   * render() {
   *   return html`SHA: ${this.sha}`;
   * }
   * ```
   *
   * @category updates
   */
  willUpdate(_changedProperties) {
  }
  // Note, this is an override point for polyfill-support.
  // @internal
  _$didUpdate(changedProperties) {
    var _a2;
    (_a2 = this.__controllers) == null ? void 0 : _a2.forEach((c) => {
      var _a3;
      return (_a3 = c.hostUpdated) == null ? void 0 : _a3.call(c);
    });
    if (!this.hasUpdated) {
      this.hasUpdated = true;
      this.firstUpdated(changedProperties);
    }
    this.updated(changedProperties);
    if (this.isUpdatePending && this.constructor.enabledWarnings.includes("change-in-update")) {
      issueWarning$1("change-in-update", `Element ${this.localName} scheduled an update (generally because a property was set) after an update completed, causing a new update to be scheduled. This is inefficient and should be avoided unless the next update can only be scheduled as a side effect of the previous update.`);
    }
  }
  __markUpdated() {
    this._$changedProperties = /* @__PURE__ */ new Map();
    this.isUpdatePending = false;
  }
  /**
   * Returns a Promise that resolves when the element has completed updating.
   * The Promise value is a boolean that is `true` if the element completed the
   * update without triggering another update. The Promise result is `false` if
   * a property was set inside `updated()`. If the Promise is rejected, an
   * exception was thrown during the update.
   *
   * To await additional asynchronous work, override the `getUpdateComplete`
   * method. For example, it is sometimes useful to await a rendered element
   * before fulfilling this Promise. To do this, first await
   * `super.getUpdateComplete()`, then any subsequent state.
   *
   * @return A promise of a boolean that resolves to true if the update completed
   *     without triggering another update.
   * @category updates
   */
  get updateComplete() {
    return this.getUpdateComplete();
  }
  /**
   * Override point for the `updateComplete` promise.
   *
   * It is not safe to override the `updateComplete` getter directly due to a
   * limitation in TypeScript which means it is not possible to call a
   * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
   * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
   * This method should be overridden instead. For example:
   *
   * ```ts
   * class MyElement extends LitElement {
   *   override async getUpdateComplete() {
   *     const result = await super.getUpdateComplete();
   *     await this._myChild.updateComplete;
   *     return result;
   *   }
   * }
   * ```
   *
   * @return A promise of a boolean that resolves to true if the update completed
   *     without triggering another update.
   * @category updates
   */
  getUpdateComplete() {
    return this.__updatePromise;
  }
  /**
   * Controls whether or not `update()` should be called when the element requests
   * an update. By default, this method always returns `true`, but this can be
   * customized to control when to update.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  shouldUpdate(_changedProperties) {
    return true;
  }
  /**
   * Updates the element. This method reflects property values to attributes.
   * It can be overridden to render and keep updated element DOM.
   * Setting properties inside this method will *not* trigger
   * another update.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  update(_changedProperties) {
    this.__reflectingProperties && (this.__reflectingProperties = this.__reflectingProperties.forEach((p) => this.__propertyToAttribute(p, this[p])));
    this.__markUpdated();
  }
  /**
   * Invoked whenever the element is updated. Implement to perform
   * post-updating tasks via DOM APIs, for example, focusing an element.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  updated(_changedProperties) {
  }
  /**
   * Invoked when the element is first updated. Implement to perform one time
   * work on the element after update.
   *
   * ```ts
   * firstUpdated() {
   *   this.renderRoot.getElementById('my-text-area').focus();
   * }
   * ```
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  firstUpdated(_changedProperties) {
  }
}
ReactiveElement.elementStyles = [];
ReactiveElement.shadowRootOptions = { mode: "open" };
ReactiveElement[JSCompiler_renameProperty$1("elementProperties")] = /* @__PURE__ */ new Map();
ReactiveElement[JSCompiler_renameProperty$1("finalized")] = /* @__PURE__ */ new Map();
polyfillSupport$1 == null ? void 0 : polyfillSupport$1({ ReactiveElement });
{
  ReactiveElement.enabledWarnings = [
    "change-in-update",
    "async-perform-update"
  ];
  const ensureOwnWarnings = function(ctor) {
    if (!ctor.hasOwnProperty(JSCompiler_renameProperty$1("enabledWarnings"))) {
      ctor.enabledWarnings = ctor.enabledWarnings.slice();
    }
  };
  ReactiveElement.enableWarning = function(warning) {
    ensureOwnWarnings(this);
    if (!this.enabledWarnings.includes(warning)) {
      this.enabledWarnings.push(warning);
    }
  };
  ReactiveElement.disableWarning = function(warning) {
    ensureOwnWarnings(this);
    const i = this.enabledWarnings.indexOf(warning);
    if (i >= 0) {
      this.enabledWarnings.splice(i, 1);
    }
  };
}
(global$1.reactiveElementVersions ?? (global$1.reactiveElementVersions = [])).push("2.0.4");
if (global$1.reactiveElementVersions.length > 1) {
  issueWarning$1("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const JSCompiler_renameProperty = (prop, _obj) => prop;
let issueWarning;
{
  const issuedWarnings = globalThis.litIssuedWarnings ?? (globalThis.litIssuedWarnings = /* @__PURE__ */ new Set());
  issueWarning = (code, warning) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!issuedWarnings.has(warning)) {
      console.warn(warning);
      issuedWarnings.add(warning);
    }
  };
}
class LitElement extends ReactiveElement {
  constructor() {
    super(...arguments);
    this.renderOptions = { host: this };
    this.__childPart = void 0;
  }
  /**
   * @category rendering
   */
  createRenderRoot() {
    var _a2;
    const renderRoot = super.createRenderRoot();
    (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = renderRoot.firstChild);
    return renderRoot;
  }
  /**
   * Updates the element. This method reflects property values to attributes
   * and calls `render` to render DOM via lit-html. Setting properties inside
   * this method will *not* trigger another update.
   * @param changedProperties Map of changed properties with old values
   * @category updates
   */
  update(changedProperties) {
    const value = this.render();
    if (!this.hasUpdated) {
      this.renderOptions.isConnected = this.isConnected;
    }
    super.update(changedProperties);
    this.__childPart = render(value, this.renderRoot, this.renderOptions);
  }
  /**
   * Invoked when the component is added to the document's DOM.
   *
   * In `connectedCallback()` you should setup tasks that should only occur when
   * the element is connected to the document. The most common of these is
   * adding event listeners to nodes external to the element, like a keydown
   * event handler added to the window.
   *
   * ```ts
   * connectedCallback() {
   *   super.connectedCallback();
   *   addEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * Typically, anything done in `connectedCallback()` should be undone when the
   * element is disconnected, in `disconnectedCallback()`.
   *
   * @category lifecycle
   */
  connectedCallback() {
    var _a2;
    super.connectedCallback();
    (_a2 = this.__childPart) == null ? void 0 : _a2.setConnected(true);
  }
  /**
   * Invoked when the component is removed from the document's DOM.
   *
   * This callback is the main signal to the element that it may no longer be
   * used. `disconnectedCallback()` should ensure that nothing is holding a
   * reference to the element (such as event listeners added to nodes external
   * to the element), so that it is free to be garbage collected.
   *
   * ```ts
   * disconnectedCallback() {
   *   super.disconnectedCallback();
   *   window.removeEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * An element may be re-connected after being disconnected.
   *
   * @category lifecycle
   */
  disconnectedCallback() {
    var _a2;
    super.disconnectedCallback();
    (_a2 = this.__childPart) == null ? void 0 : _a2.setConnected(false);
  }
  /**
   * Invoked on each update to perform rendering tasks. This method may return
   * any value renderable by lit-html's `ChildPart` - typically a
   * `TemplateResult`. Setting properties inside this method will *not* trigger
   * the element to update.
   * @category rendering
   */
  render() {
    return noChange;
  }
}
LitElement["_$litElement$"] = true;
LitElement[JSCompiler_renameProperty("finalized")] = true;
(_b = globalThis.litElementHydrateSupport) == null ? void 0 : _b.call(globalThis, { LitElement });
const polyfillSupport = globalThis.litElementPolyfillSupportDevMode;
polyfillSupport == null ? void 0 : polyfillSupport({ LitElement });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.1.0");
if (globalThis.litElementVersions.length > 1) {
  issueWarning("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
}
var define_process_env_default = {};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _e = (r) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(r, e);
  }) : customElements.define(r, e);
};
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ye = globalThis, Ge = ye.ShadowRoot && (ye.ShadyCSS === void 0 || ye.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ut = Symbol(), Je = /* @__PURE__ */ new WeakMap();
let Tt = class {
  constructor(e, t, n) {
    if (this._$cssResult$ = true, n !== ut) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Ge && e === void 0) {
      const n = t !== void 0 && t.length === 1;
      n && (e = Je.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && Je.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ot = (r) => new Tt(typeof r == "string" ? r : r + "", void 0, ut), At = (r, e) => {
  if (Ge) r.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const n = document.createElement("style"), o = ye.litNonce;
    o !== void 0 && n.setAttribute("nonce", o), n.textContent = t.cssText, r.appendChild(n);
  }
}, Ke = Ge ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const n of e.cssRules) t += n.cssText;
  return Ot(t);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Mt, defineProperty: Ft, getOwnPropertyDescriptor: $t, getOwnPropertyNames: Rt, getOwnPropertySymbols: jt, getPrototypeOf: Nt } = Object, Q = globalThis, Xe = Q.trustedTypes, zt = Xe ? Xe.emptyScript : "", Ae = Q.reactiveElementPolyfillSupport, he = (r, e) => r, Ce = { toAttribute(r, e) {
  switch (e) {
    case Boolean:
      r = r ? zt : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, e) {
  let t = r;
  switch (e) {
    case Boolean:
      t = r !== null;
      break;
    case Number:
      t = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(r);
      } catch {
        t = null;
      }
  }
  return t;
} }, We = (r, e) => !Mt(r, e), Ze = { attribute: true, type: String, converter: Ce, reflect: false, hasChanged: We };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Q.litPropertyMetadata ?? (Q.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class ue extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Ze) {
    if (t.state && (t.attribute = false), this._$Ei(), this.elementProperties.set(e, t), !t.noAccessor) {
      const n = Symbol(), o = this.getPropertyDescriptor(e, n, t);
      o !== void 0 && Ft(this.prototype, e, o);
    }
  }
  static getPropertyDescriptor(e, t, n) {
    const { get: o, set: i } = $t(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get() {
      return o == null ? void 0 : o.call(this);
    }, set(a) {
      const s = o == null ? void 0 : o.call(this);
      i.call(this, a), this.requestUpdate(e, s, n);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ze;
  }
  static _$Ei() {
    if (this.hasOwnProperty(he("elementProperties"))) return;
    const e = Nt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(he("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(he("properties"))) {
      const t = this.properties, n = [...Rt(t), ...jt(t)];
      for (const o of n) this.createProperty(o, t[o]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [n, o] of t) this.elementProperties.set(n, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, n] of this.elementProperties) {
      const o = this._$Eu(t, n);
      o !== void 0 && this._$Eh.set(o, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const n = new Set(e.flat(1 / 0).reverse());
      for (const o of n) t.unshift(Ke(o));
    } else e !== void 0 && t.push(Ke(e));
    return t;
  }
  static _$Eu(e, t) {
    const n = t.attribute;
    return n === false ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return At(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (e = this._$EO) == null || e.forEach((t) => {
      var n;
      return (n = t.hostConnected) == null ? void 0 : n.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var n;
      return (n = t.hostDisconnected) == null ? void 0 : n.call(t);
    });
  }
  attributeChangedCallback(e, t, n) {
    this._$AK(e, n);
  }
  _$EC(e, t) {
    var i;
    const n = this.constructor.elementProperties.get(e), o = this.constructor._$Eu(e, n);
    if (o !== void 0 && n.reflect === true) {
      const a = (((i = n.converter) == null ? void 0 : i.toAttribute) !== void 0 ? n.converter : Ce).toAttribute(t, n.type);
      this._$Em = e, a == null ? this.removeAttribute(o) : this.setAttribute(o, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var i;
    const n = this.constructor, o = n._$Eh.get(e);
    if (o !== void 0 && this._$Em !== o) {
      const a = n.getPropertyOptions(o), s = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((i = a.converter) == null ? void 0 : i.fromAttribute) !== void 0 ? a.converter : Ce;
      this._$Em = o, this[o] = s.fromAttribute(t, a.type), this._$Em = null;
    }
  }
  requestUpdate(e, t, n) {
    if (e !== void 0) {
      if (n ?? (n = this.constructor.getPropertyOptions(e)), !(n.hasChanged ?? We)(this[e], t)) return;
      this.P(e, t, n);
    }
    this.isUpdatePending === false && (this._$ES = this._$ET());
  }
  P(e, t, n) {
    this._$AL.has(e) || this._$AL.set(e, t), n.reflect === true && this._$Em !== e && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(e);
  }
  async _$ET() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var n;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [i, a] of this._$Ep) this[i] = a;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [i, a] of o) a.wrapped !== true || this._$AL.has(i) || this[i] === void 0 || this.P(i, this[i], a);
    }
    let e = false;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (n = this._$EO) == null || n.forEach((o) => {
        var i;
        return (i = o.hostUpdate) == null ? void 0 : i.call(o);
      }), this.update(t)) : this._$EU();
    } catch (o) {
      throw e = false, this._$EU(), o;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((n) => {
      var o;
      return (o = n.hostUpdated) == null ? void 0 : o.call(n);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(e)), this.updated(e);
  }
  _$EU() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return true;
  }
  update(e) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((t) => this._$EC(t, this[t]))), this._$EU();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
}
ue.elementStyles = [], ue.shadowRootOptions = { mode: "open" }, ue[he("elementProperties")] = /* @__PURE__ */ new Map(), ue[he("finalized")] = /* @__PURE__ */ new Map(), Ae == null || Ae({ ReactiveElement: ue }), (Q.reactiveElementVersions ?? (Q.reactiveElementVersions = [])).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const It = { attribute: true, type: String, converter: Ce, reflect: false, hasChanged: We }, Lt = (r = It, e, t) => {
  const { kind: n, metadata: o } = t;
  let i = globalThis.litPropertyMetadata.get(o);
  if (i === void 0 && globalThis.litPropertyMetadata.set(o, i = /* @__PURE__ */ new Map()), i.set(t.name, r), n === "accessor") {
    const { name: a } = t;
    return { set(s) {
      const u = e.get.call(this);
      e.set.call(this, s), this.requestUpdate(a, u, r);
    }, init(s) {
      return s !== void 0 && this.P(a, void 0, r), s;
    } };
  }
  if (n === "setter") {
    const { name: a } = t;
    return function(s) {
      const u = this[a];
      e.call(this, s), this.requestUpdate(a, u, r);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function V(r) {
  return (e, t) => typeof t == "object" ? Lt(r, e, t) : ((n, o, i) => {
    const a = o.hasOwnProperty(i);
    return o.constructor.createProperty(i, a ? { ...n, wrapped: true } : n), a ? Object.getOwnPropertyDescriptor(o, i) : void 0;
  })(r, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Vt(r) {
  return V({ ...r, state: true, attribute: false });
}
const Y = {
  server: {
    host: "localhost",
    port: 5173
  },
  log: function() {
    console.log(...arguments);
  }
}, Dt = `*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:currentColor}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}:root{--color-teal: 169deg 65% 42%;--color-plum: 324deg 72% 40%;--color-black: 0deg 0 0}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.static{position:static}.absolute{position:absolute}.relative{position:relative}.inset-0{top:0;right:0;bottom:0;left:0}.left-1\\/2{left:50%}.top-1\\/2{top:50%}.m-0{margin:0}.mx-auto{margin-left:auto;margin-right:auto}.-ml-8{margin-left:-2rem}.-mt-8{margin-top:-2rem}.ml-2{margin-left:.5rem}.mr-2{margin-right:.5rem}.mt-2{margin-top:.5rem}.block{display:block}.inline{display:inline}.flex{display:flex}.hidden{display:none}.h-0{height:0px}.h-16{height:4rem}.h-full{height:100%}.h-screen{height:100vh}.w-16{width:4rem}.w-full{width:100%}.max-w-full{max-width:100%}.max-w-max{max-width:-moz-max-content;max-width:max-content}.max-w-screen-sm{max-width:576px}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.gap-2{gap:.5rem}.gap-8{gap:2rem}.gap-x-4{-moz-column-gap:1rem;column-gap:1rem}.gap-y-2{row-gap:.5rem}.overflow-hidden{overflow:hidden}.rounded-full{border-radius:9999px}.border{border-width:1px}.border-2{border-width:2px}.border-b-2{border-bottom-width:2px}.border-current{border-color:currentColor}.border-teal{border-color:hsl(var(--color-teal) / 1)}.bg-black{background-color:hsl(var(--color-black) / 1)}.bg-primary,.bg-teal{background-color:hsl(var(--color-teal) / 1)}.bg-white{background-color:hsl(0deg 0 100% / 100%)}.object-cover{-o-object-fit:cover;object-fit:cover}.p-2{padding:.5rem}.p-4{padding:1rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.px-5{padding-left:1.25rem;padding-right:1.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-4{padding-top:1rem;padding-bottom:1rem}.pb-\\[56\\.25\\%\\]{padding-bottom:56.25%}.pr-7{padding-right:1.75rem}.text-left{text-align:left}.text-center{text-align:center}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.font-bold{font-weight:700}.font-semibold{font-weight:600}.text-black{color:hsl(var(--color-black) / 1)}.text-current{color:currentColor}.text-white{color:hsl(0deg 0 100% / 100%)}.underline{text-decoration-line:underline}.no-underline{text-decoration-line:none}.underline-offset-4{text-underline-offset:4px}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}*:focus{outline:2px solid transparent;outline-offset:2px}*:focus-visible{outline-width:2px;outline-color:hsl(var(--color-plum) / 1);outline-offset:4px}.before\\:absolute:before{content:var(--tw-content);position:absolute}.before\\:right-2:before{content:var(--tw-content);right:.5rem}.before\\:top-1\\/2:before{content:var(--tw-content);top:50%}.before\\:h-\\[0\\.125rem\\]:before{content:var(--tw-content);height:.125rem}.before\\:w-\\[0\\.8125rem\\]:before{content:var(--tw-content);width:.8125rem}.before\\:-translate-y-1\\/2:before{content:var(--tw-content);--tw-translate-y: -50%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.before\\:bg-teal:before{content:var(--tw-content);background-color:hsl(var(--color-teal) / 1)}.before\\:content-\\[\\'\\'\\]:before{--tw-content: "";content:var(--tw-content)}.after\\:absolute:after{content:var(--tw-content);position:absolute}.after\\:right-\\[0\\.825rem\\]:after{content:var(--tw-content);right:.825rem}.after\\:top-1\\/2:after{content:var(--tw-content);top:50%}.after\\:h-\\[0\\.125rem\\]:after{content:var(--tw-content);height:.125rem}.after\\:h-\\[0\\.8125rem\\]:after{content:var(--tw-content);height:.8125rem}.after\\:w-\\[0\\.125rem\\]:after{content:var(--tw-content);width:.125rem}.after\\:-translate-y-1\\/2:after{content:var(--tw-content);--tw-translate-y: -50%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.after\\:bg-teal:after{content:var(--tw-content);background-color:hsl(var(--color-teal) / 1)}.hover\\:bg-black-50:hover{background-color:hsl(0deg 0 90% / 100%)}.hover\\:bg-black-700:hover{background-color:hsl(0deg 0 20% / 100%)}.hover\\:bg-teal-100:hover{background-color:#b8e5dd}.hover\\:bg-teal-200:hover{background-color:#92d8cb}.hover\\:no-underline:hover{text-decoration-line:none}.hover\\:brightness-75:hover{--tw-brightness: brightness(.75);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}@media (min-width: 576px){.sm\\:w-max{width:-moz-max-content;width:max-content}.sm\\:flex-row{flex-direction:row}.sm\\:flex-wrap{flex-wrap:wrap}}@media (min-width: 960px){.md\\:px-12{padding-left:3rem;padding-right:3rem}.md\\:py-12{padding-top:3rem;padding-bottom:3rem}}@media (min-width: 1440px){.lg\\:px-20{padding-left:5rem;padding-right:5rem}.lg\\:py-24{padding-top:6rem;padding-bottom:6rem}}@media (prefers-color-scheme: dark){.dark\\:bg-white{background-color:hsl(0deg 0 100% / 100%)}.dark\\:text-black{color:hsl(var(--color-black) / 1)}.dark\\:text-white{color:hsl(0deg 0 100% / 100%)}.dark\\:antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.dark\\:hover\\:bg-black-50:hover{background-color:hsl(0deg 0 90% / 100%)}.dark\\:hover\\:bg-black-800:hover{background-color:hsl(0deg 0 10% / 100%)}.dark\\:hover\\:bg-teal-800:hover{background-color:#13584c}}`, Ut = unsafeCSS(Dt), Te = (r) => {
  var e;
  return e = class extends LitElement {
  }, e.styles = [Ut, unsafeCSS(r)], e;
}, dt = ":host{display:flex;flex-direction:column}";
var qt = Object.defineProperty, Gt = Object.getOwnPropertyDescriptor, se = (r, e, t, n) => {
  for (var o = n > 1 ? void 0 : n ? Gt(e, t) : e, i = r.length - 1, a; i >= 0; i--)
    (a = r[i]) && (o = (n ? a(e, t, o) : a(o)) || o);
  return n && o && qt(e, t, o), o;
};
let ee = class extends Te(dt) {
  constructor() {
    super(...arguments), this.showbtn = false, this.strict = false, this.open = false, this.count = 0, this.numOpened = 0;
  }
  /**
   * On connected look for opened items and update numOpened
   */
  connectedCallback() {
    if (super.connectedCallback(), this.shadowRoot !== null) {
      const r = this.querySelectorAll("accordion-item");
      this.count = r.length, r.forEach((e) => {
        e.getAttribute("show") === "true" && this.numOpened++;
      });
    }
  }
  /**
   * Render show all button if property is true
   *
   * @returns {TemplateResult}
   */
  showallTemplate() {
    if (this.showbtn)
      return html`
        <p>Count = ${this.count} -- Num opened = ${this.numOpened}</p>
        <button class="mt-2 p-2 border border-2 border-teal max-w-max" @click="${this._toggleOpen}">${this.open ? "Close all accordion items" : "Open all accordion items"}<i class="fa-solid fa-folder-open mr-2"></i></button>
      `;
  }
  /**
   * Render accordion element
   *
   * @returns {TemplateResult}
   */
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  render() {
    return html`
      ${this.showallTemplate()}
      <ul class="max-w-full" @opened=${this._openedHandler}>
        <slot></slot>
      </ul>
      `;
  }
  /**
   * Opens and closes all accordion items when button is clicked
   *
   * @param e Event
   */
  _toggleOpen(r) {
    const e = this.querySelectorAll("ecu-accordion-item");
    Y.log(e), this.open ? (this.open = false, this.numOpened = 0, e.forEach((t) => {
      t.removeAttribute("show");
    })) : (this.open = true, this.numOpened = this.count, e.forEach((t) => {
      t.setAttribute("show", "true");
    }));
  }
  /**
   * Listens for accordion item opened event
   *
   * @param e CustomEvent
   */
  _openedHandler(r) {
    if (r.preventDefault(), this.strict) {
      this.open = true;
      const t = new Event("empty");
      this._toggleOpen(t);
    }
    Y.log(r.detail.opened), r.detail.opened ? this.numOpened++ : this.numOpened--, this.numOpened === this.count ? this.open = true : this.open = false;
  }
};
se([
  V({ type: Boolean })
], ee.prototype, "showbtn", 2);
se([
  V({ type: Boolean })
], ee.prototype, "strict", 2);
se([
  V({ type: Boolean })
], ee.prototype, "open", 2);
se([
  V({ type: Number })
], ee.prototype, "count", 2);
se([
  V({ type: Number })
], ee.prototype, "numOpened", 2);
ee = se([
  _e("ecu-accordion-element")
], ee);
var Wt = Object.defineProperty, Bt = Object.getOwnPropertyDescriptor, Be = (r, e, t, n) => {
  for (var o = n > 1 ? void 0 : n ? Bt(e, t) : e, i = r.length - 1, a; i >= 0; i--)
    (a = r[i]) && (o = (n ? a(e, t, o) : a(o)) || o);
  return n && o && Wt(e, t, o), o;
};
let Pe = class extends Te(dt) {
  constructor() {
    super(...arguments), this.title = "Accordion element title", this.show = false;
  }
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * Render accordion element
   *
   * @returns {TemplateResult}
   */
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  render() {
    return html`
      <li class="relative max-w-full border-b-2 border-teal">
        <button
          @click="${this._toggleVisible}"
          class="relative block w-full max-w-container m-0 py-2 pr-7 text-left text-current font-semibold transition before:content-[''] before:absolute before:right-2 before:top-1/2 before:h-[0.125rem] before:w-[0.8125rem] before:bg-teal before:-translate-y-1/2 after:absolute after:right-[0.825rem] after:top-1/2 ${this.show ? "after:h-[0.125rem]" : "after:h-[0.8125rem]"} after:w-[0.125rem] after:bg-teal after:-translate-y-1/2"
          aria-expanded="${this.show ? "true" : "false"}"
        >${this.title}</button>
        <div class="py-2 ${this.show ? "block" : "hidden"}">
          <slot></slot>
        </div>
      </li>
      `;
  }
  /**
   * Toggle visibility of accordion element and call custom event
   * @param e Event
   */
  _toggleVisible(r) {
    this.show = !this.show, this._dispatchEvent();
  }
  /**
   * Dispatch custom event to parent element so it can track number of opened items
   */
  _dispatchEvent() {
    const r = { opened: this.show }, e = new CustomEvent("opened", { detail: r, bubbles: true, composed: true, cancelable: true });
    this.dispatchEvent(e);
  }
};
Be([
  V({ type: String })
], Pe.prototype, "title", 2);
Be([
  V({ type: Boolean, reflect: true })
], Pe.prototype, "show", 2);
Pe = Be([
  _e("ecu-accordion-item")
], Pe);
const Ye = "-", Yt = (r) => {
  const e = Ht(r), {
    conflictingClassGroups: t,
    conflictingClassGroupModifiers: n
  } = r;
  return {
    getClassGroupId: (a) => {
      const s = a.split(Ye);
      return s[0] === "" && s.length !== 1 && s.shift(), ft(s, e) || Qt(a);
    },
    getConflictingClassGroupIds: (a, s) => {
      const u = t[a] || [];
      return s && n[a] ? [...u, ...n[a]] : u;
    }
  };
}, ft = (r, e) => {
  var a;
  if (r.length === 0)
    return e.classGroupId;
  const t = r[0], n = e.nextPart.get(t), o = n ? ft(r.slice(1), n) : void 0;
  if (o)
    return o;
  if (e.validators.length === 0)
    return;
  const i = r.join(Ye);
  return (a = e.validators.find(({
    validator: s
  }) => s(i))) == null ? void 0 : a.classGroupId;
}, et = /^\[(.+)\]$/, Qt = (r) => {
  if (et.test(r)) {
    const e = et.exec(r)[1], t = e == null ? void 0 : e.substring(0, e.indexOf(":"));
    if (t)
      return "arbitrary.." + t;
  }
}, Ht = (r) => {
  const {
    theme: e,
    prefix: t
  } = r, n = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Kt(Object.entries(r.classGroups), t).forEach(([i, a]) => {
    Re(a, n, i, e);
  }), n;
}, Re = (r, e, t, n) => {
  r.forEach((o) => {
    if (typeof o == "string") {
      const i = o === "" ? e : tt(e, o);
      i.classGroupId = t;
      return;
    }
    if (typeof o == "function") {
      if (Jt(o)) {
        Re(o(n), e, t, n);
        return;
      }
      e.validators.push({
        validator: o,
        classGroupId: t
      });
      return;
    }
    Object.entries(o).forEach(([i, a]) => {
      Re(a, tt(e, i), t, n);
    });
  });
}, tt = (r, e) => {
  let t = r;
  return e.split(Ye).forEach((n) => {
    t.nextPart.has(n) || t.nextPart.set(n, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), t = t.nextPart.get(n);
  }), t;
}, Jt = (r) => r.isThemeGetter, Kt = (r, e) => e ? r.map(([t, n]) => {
  const o = n.map((i) => typeof i == "string" ? e + i : typeof i == "object" ? Object.fromEntries(Object.entries(i).map(([a, s]) => [e + a, s])) : i);
  return [t, o];
}) : r, Xt = (r) => {
  if (r < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let e = 0, t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  const o = (i, a) => {
    t.set(i, a), e++, e > r && (e = 0, n = t, t = /* @__PURE__ */ new Map());
  };
  return {
    get(i) {
      let a = t.get(i);
      if (a !== void 0)
        return a;
      if ((a = n.get(i)) !== void 0)
        return o(i, a), a;
    },
    set(i, a) {
      t.has(i) ? t.set(i, a) : o(i, a);
    }
  };
}, pt = "!", Zt = (r) => {
  const {
    separator: e,
    experimentalParseClassName: t
  } = r, n = e.length === 1, o = e[0], i = e.length, a = (s) => {
    const u = [];
    let c = 0, l = 0, d;
    for (let k = 0; k < s.length; k++) {
      let S = s[k];
      if (c === 0) {
        if (S === o && (n || s.slice(k, k + i) === e)) {
          u.push(s.slice(l, k)), l = k + i;
          continue;
        }
        if (S === "/") {
          d = k;
          continue;
        }
      }
      S === "[" ? c++ : S === "]" && c--;
    }
    const h = u.length === 0 ? s : s.substring(l), v = h.startsWith(pt), w = v ? h.substring(1) : h, C = d && d > l ? d - l : void 0;
    return {
      modifiers: u,
      hasImportantModifier: v,
      baseClassName: w,
      maybePostfixModifierPosition: C
    };
  };
  return t ? (s) => t({
    className: s,
    parseClassName: a
  }) : a;
}, er = (r) => {
  if (r.length <= 1)
    return r;
  const e = [];
  let t = [];
  return r.forEach((n) => {
    n[0] === "[" ? (e.push(...t.sort(), n), t = []) : t.push(n);
  }), e.push(...t.sort()), e;
}, tr = (r) => ({
  cache: Xt(r.cacheSize),
  parseClassName: Zt(r),
  ...Yt(r)
}), rr = /\s+/, nr = (r, e) => {
  const {
    parseClassName: t,
    getClassGroupId: n,
    getConflictingClassGroupIds: o
  } = e, i = [], a = r.trim().split(rr);
  let s = "";
  for (let u = a.length - 1; u >= 0; u -= 1) {
    const c = a[u], {
      modifiers: l,
      hasImportantModifier: d,
      baseClassName: h,
      maybePostfixModifierPosition: v
    } = t(c);
    let w = !!v, C = n(w ? h.substring(0, v) : h);
    if (!C) {
      if (!w) {
        s = c + (s.length > 0 ? " " + s : s);
        continue;
      }
      if (C = n(h), !C) {
        s = c + (s.length > 0 ? " " + s : s);
        continue;
      }
      w = false;
    }
    const k = er(l).join(":"), S = d ? k + pt : k, g = S + C;
    if (i.includes(g))
      continue;
    i.push(g);
    const m = o(C, w);
    for (let y = 0; y < m.length; ++y) {
      const E = m[y];
      i.push(S + E);
    }
    s = c + (s.length > 0 ? " " + s : s);
  }
  return s;
};
function or() {
  let r = 0, e, t, n = "";
  for (; r < arguments.length; )
    (e = arguments[r++]) && (t = ht(e)) && (n && (n += " "), n += t);
  return n;
}
const ht = (r) => {
  if (typeof r == "string")
    return r;
  let e, t = "";
  for (let n = 0; n < r.length; n++)
    r[n] && (e = ht(r[n])) && (t && (t += " "), t += e);
  return t;
};
function ir(r, ...e) {
  let t, n, o, i = a;
  function a(u) {
    const c = e.reduce((l, d) => d(l), r());
    return t = tr(c), n = t.cache.get, o = t.cache.set, i = s, s(u);
  }
  function s(u) {
    const c = n(u);
    if (c)
      return c;
    const l = nr(u, t);
    return o(u, l), l;
  }
  return function() {
    return i(or.apply(null, arguments));
  };
}
const F = (r) => {
  const e = (t) => t[r] || [];
  return e.isThemeGetter = true, e;
}, gt = /^\[(?:([a-z-]+):)?(.+)\]$/i, ar = /^\d+\/\d+$/, sr = /* @__PURE__ */ new Set(["px", "full", "screen"]), lr = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, cr = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, ur = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/, dr = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, fr = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, q = (r) => ne(r) || sr.has(r) || ar.test(r), W = (r) => le(r, "length", wr), ne = (r) => !!r && !Number.isNaN(Number(r)), Me = (r) => le(r, "number", ne), de = (r) => !!r && Number.isInteger(Number(r)), pr = (r) => r.endsWith("%") && ne(r.slice(0, -1)), O = (r) => gt.test(r), B = (r) => lr.test(r), hr = /* @__PURE__ */ new Set(["length", "size", "percentage"]), gr = (r) => le(r, hr, mt), mr = (r) => le(r, "position", mt), br = /* @__PURE__ */ new Set(["image", "url"]), vr = (r) => le(r, br, xr), yr = (r) => le(r, "", kr), fe = () => true, le = (r, e, t) => {
  const n = gt.exec(r);
  return n ? n[1] ? typeof e == "string" ? n[1] === e : e.has(n[1]) : t(n[2]) : false;
}, wr = (r) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  cr.test(r) && !ur.test(r)
), mt = () => false, kr = (r) => dr.test(r), xr = (r) => fr.test(r), Cr = () => {
  const r = F("colors"), e = F("spacing"), t = F("blur"), n = F("brightness"), o = F("borderColor"), i = F("borderRadius"), a = F("borderSpacing"), s = F("borderWidth"), u = F("contrast"), c = F("grayscale"), l = F("hueRotate"), d = F("invert"), h = F("gap"), v = F("gradientColorStops"), w = F("gradientColorStopPositions"), C = F("inset"), k = F("margin"), S = F("opacity"), g = F("padding"), m = F("saturate"), y = F("scale"), E = F("sepia"), _ = F("skew"), A = F("space"), P = F("translate"), R = () => ["auto", "contain", "none"], N = () => ["auto", "hidden", "clip", "visible", "scroll"], H = () => ["auto", O, e], f = () => [O, e], p = () => ["", q, W], b = () => ["auto", ne, O], T = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], x = () => ["solid", "dashed", "dotted", "double", "none"], M = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], $ = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], j = () => ["", "0", O], z = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], I = () => [ne, O];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [fe],
      spacing: [q, W],
      blur: ["none", "", B, O],
      brightness: I(),
      borderColor: [r],
      borderRadius: ["none", "", "full", B, O],
      borderSpacing: f(),
      borderWidth: p(),
      contrast: I(),
      grayscale: j(),
      hueRotate: I(),
      invert: j(),
      gap: f(),
      gradientColorStops: [r],
      gradientColorStopPositions: [pr, W],
      inset: H(),
      margin: H(),
      opacity: I(),
      padding: f(),
      saturate: I(),
      scale: I(),
      sepia: j(),
      skew: I(),
      space: f(),
      translate: f()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", O]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [B]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": z()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": z()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [...T(), O]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: N()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": N()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": N()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: R()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": R()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": R()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [C]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [C]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [C]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [C]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [C]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [C]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [C]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [C]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [C]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ["auto", de, O]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: H()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", O]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: j()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: j()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", de, O]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [fe]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", de, O]
        }, O]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": b()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": b()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [fe]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [de, O]
        }, O]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": b()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": b()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ["auto", "min", "max", "fr", O]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", O]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [h]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [h]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [h]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...$()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...$(), "baseline"]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [...$(), "baseline"]
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [g]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [g]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [g]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [g]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [g]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [g]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [g]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [g]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [g]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [k]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [k]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [k]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [k]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [k]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [k]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [k]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [k]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [k]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [A]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [A]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", O, e]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [O, e, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [O, e, "none", "full", "min", "max", "fit", "prose", {
          screen: [B]
        }, B]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [O, e, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [O, e, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [O, e, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [O, e, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", B, W]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", Me]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [fe]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractons"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", O]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", ne, Me]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", q, O]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", O]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", O]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [r]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [S]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [r]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [S]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...x(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", q, W]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", q, O]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [r]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: f()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", O]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", O]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [S]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [...T(), mr]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", gr]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, vr]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [r]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [w]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [w]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [w]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [v]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [v]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [v]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [i]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [i]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [i]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [i]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [i]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [i]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [i]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [i]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [i]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [i]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [i]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [i]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [i]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [i]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [i]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [s]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [s]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [s]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [s]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [s]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [s]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [s]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [s]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [s]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [S]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...x(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [s]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [s]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [S]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: x()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [o]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [o]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [o]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [o]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [o]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [o]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [o]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [o]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [o]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [o]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...x()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [q, O]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [q, W]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [r]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: p()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [r]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [S]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [q, W]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [r]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", B, yr]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [fe]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [S]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...M(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": M()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [t]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [n]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [u]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", B, O]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [c]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [l]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [d]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [m]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [E]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [t]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [n]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [u]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [c]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [l]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [d]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [S]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [m]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [E]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": [a]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [a]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [a]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", O]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: I()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", O]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: I()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", O]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [y]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [y]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [y]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [de, O]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [P]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [P]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [_]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [_]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", O]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", r]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", O]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [r]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": f()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": f()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": f()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": f()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": f()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": f()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": f()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": f()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": f()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": f()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": f()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": f()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": f()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": f()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": f()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": f()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": f()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": f()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", O]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [r, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [q, W, Me]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [r, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
}, Pr = /* @__PURE__ */ ir(Cr), Er = ":host{display:flex}";
var Sr = Object.defineProperty, _r = Object.getOwnPropertyDescriptor, be = (r, e, t, n) => {
  for (var o = n > 1 ? void 0 : n ? _r(e, t) : e, i = r.length - 1, a; i >= 0; i--)
    (a = r[i]) && (o = (n ? a(e, t, o) : a(o)) || o);
  return n && o && Sr(e, t, o), o;
};
let ie = class extends Te(Er) {
  constructor() {
    super(...arguments), this.title = "Button text", this.btnStyle = "", this.url = "#", this.group = false;
  }
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * Render accordion element
   *
   * @returns {TemplateResult}
   */
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  render() {
    return html`
      <a
        href=${this.url}
        class=${Pr(this._getStyle() + (this.group ? "w-full sm:w-max text-center" : "max-w-max"))}
        @click="${this._doClick}"
      >
        <slot name="start"></slot>
        ${this.title}
        <slot name="end"></slot>
      </a>
    `;
  }
  /**
   * Output relevant Tailwind classes based on background, border and text.
   *
   * @returns {String}
   */
  _getStyle() {
    let r = "";
    switch (this.btnStyle) {
      case "primary-conversion":
        r = "rounded-full px-5 py-3 bg-teal hover:bg-teal-200 text-black no-underline ";
        break;
      case "secondary-conversion":
        r = "rounded-full px-3 py-2 border-2 border-teal hover:bg-teal-100 text-current no-underline dark:hover:bg-teal-800 ";
        break;
      case "primary-standard":
        r = "rounded-full px-5 py-3 bg-black hover:bg-black-700 text-white antialiased dark:bg-white dark:hover:bg-black-50 dark:text-black no-underline ";
        break;
      case "text-only":
        r = "py-2 text-black dark:text-white dark:antialiased underline hover:no-underline underline-offset-4 ";
        break;
      case "form-submit":
        r = "rounded-full px-3 py-2 border-2 border-teal hover:bg-teal-100 text-current no-underline dark:hover:bg-teal-800 ";
        break;
      default:
        r = "rounded-full px-3 py-2 border-2 hover:bg-black-50 border-current text-current no-underline dark:hover:bg-black-800 ";
    }
    return r;
  }
  /**
   * Applies prevent default if no URL is set.
   *
   * @param e Event
   */
  _doClick(r) {
    this.url === "#" && r.preventDefault();
  }
};
be([
  V({ type: String })
], ie.prototype, "title", 2);
be([
  V({ type: String })
], ie.prototype, "btnStyle", 2);
be([
  V({ type: String })
], ie.prototype, "url", 2);
be([
  V({ type: Boolean })
], ie.prototype, "group", 2);
ie = be([
  _e("ecu-button")
], ie);
/*! @vimeo/player v2.24.0 | (c) 2024 Vimeo | MIT License | https://github.com/vimeo/player.js */
function rt(r, e) {
  var t = Object.keys(r);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(r);
    e && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(r, o).enumerable;
    })), t.push.apply(t, n);
  }
  return t;
}
function nt(r) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2 ? rt(Object(t), true).forEach(function(n) {
      we(r, n, t[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(t)) : rt(Object(t)).forEach(function(n) {
      Object.defineProperty(r, n, Object.getOwnPropertyDescriptor(t, n));
    });
  }
  return r;
}
function L() {
  L = function() {
    return r;
  };
  var r = {}, e = Object.prototype, t = e.hasOwnProperty, n = Object.defineProperty || function(f, p, b) {
    f[p] = b.value;
  }, o = typeof Symbol == "function" ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", s = o.toStringTag || "@@toStringTag";
  function u(f, p, b) {
    return Object.defineProperty(f, p, {
      value: b,
      enumerable: true,
      configurable: true,
      writable: true
    }), f[p];
  }
  try {
    u({}, "");
  } catch {
    u = function(p, b, T) {
      return p[b] = T;
    };
  }
  function c(f, p, b, T) {
    var x = p && p.prototype instanceof h ? p : h, M = Object.create(x.prototype), $ = new R(T || []);
    return n(M, "_invoke", {
      value: E(f, b, $)
    }), M;
  }
  function l(f, p, b) {
    try {
      return {
        type: "normal",
        arg: f.call(p, b)
      };
    } catch (T) {
      return {
        type: "throw",
        arg: T
      };
    }
  }
  r.wrap = c;
  var d = {};
  function h() {
  }
  function v() {
  }
  function w() {
  }
  var C = {};
  u(C, i, function() {
    return this;
  });
  var k = Object.getPrototypeOf, S = k && k(k(N([])));
  S && S !== e && t.call(S, i) && (C = S);
  var g = w.prototype = h.prototype = Object.create(C);
  function m(f) {
    ["next", "throw", "return"].forEach(function(p) {
      u(f, p, function(b) {
        return this._invoke(p, b);
      });
    });
  }
  function y(f, p) {
    function b(x, M, $, j) {
      var z = l(f[x], f, M);
      if (z.type !== "throw") {
        var I = z.arg, ce = I.value;
        return ce && typeof ce == "object" && t.call(ce, "__await") ? p.resolve(ce.__await).then(function(J) {
          b("next", J, $, j);
        }, function(J) {
          b("throw", J, $, j);
        }) : p.resolve(ce).then(function(J) {
          I.value = J, $(I);
        }, function(J) {
          return b("throw", J, $, j);
        });
      }
      j(z.arg);
    }
    var T;
    n(this, "_invoke", {
      value: function(x, M) {
        function $() {
          return new p(function(j, z) {
            b(x, M, j, z);
          });
        }
        return T = T ? T.then($, $) : $();
      }
    });
  }
  function E(f, p, b) {
    var T = "suspendedStart";
    return function(x, M) {
      if (T === "executing") throw new Error("Generator is already running");
      if (T === "completed") {
        if (x === "throw") throw M;
        return H();
      }
      for (b.method = x, b.arg = M; ; ) {
        var $ = b.delegate;
        if ($) {
          var j = _($, b);
          if (j) {
            if (j === d) continue;
            return j;
          }
        }
        if (b.method === "next") b.sent = b._sent = b.arg;
        else if (b.method === "throw") {
          if (T === "suspendedStart") throw T = "completed", b.arg;
          b.dispatchException(b.arg);
        } else b.method === "return" && b.abrupt("return", b.arg);
        T = "executing";
        var z = l(f, p, b);
        if (z.type === "normal") {
          if (T = b.done ? "completed" : "suspendedYield", z.arg === d) continue;
          return {
            value: z.arg,
            done: b.done
          };
        }
        z.type === "throw" && (T = "completed", b.method = "throw", b.arg = z.arg);
      }
    };
  }
  function _(f, p) {
    var b = p.method, T = f.iterator[b];
    if (T === void 0) return p.delegate = null, b === "throw" && f.iterator.return && (p.method = "return", p.arg = void 0, _(f, p), p.method === "throw") || b !== "return" && (p.method = "throw", p.arg = new TypeError("The iterator does not provide a '" + b + "' method")), d;
    var x = l(T, f.iterator, p.arg);
    if (x.type === "throw") return p.method = "throw", p.arg = x.arg, p.delegate = null, d;
    var M = x.arg;
    return M ? M.done ? (p[f.resultName] = M.value, p.next = f.nextLoc, p.method !== "return" && (p.method = "next", p.arg = void 0), p.delegate = null, d) : M : (p.method = "throw", p.arg = new TypeError("iterator result is not an object"), p.delegate = null, d);
  }
  function A(f) {
    var p = {
      tryLoc: f[0]
    };
    1 in f && (p.catchLoc = f[1]), 2 in f && (p.finallyLoc = f[2], p.afterLoc = f[3]), this.tryEntries.push(p);
  }
  function P(f) {
    var p = f.completion || {};
    p.type = "normal", delete p.arg, f.completion = p;
  }
  function R(f) {
    this.tryEntries = [{
      tryLoc: "root"
    }], f.forEach(A, this), this.reset(true);
  }
  function N(f) {
    if (f) {
      var p = f[i];
      if (p) return p.call(f);
      if (typeof f.next == "function") return f;
      if (!isNaN(f.length)) {
        var b = -1, T = function x() {
          for (; ++b < f.length; ) if (t.call(f, b)) return x.value = f[b], x.done = false, x;
          return x.value = void 0, x.done = true, x;
        };
        return T.next = T;
      }
    }
    return {
      next: H
    };
  }
  function H() {
    return {
      value: void 0,
      done: true
    };
  }
  return v.prototype = w, n(g, "constructor", {
    value: w,
    configurable: true
  }), n(w, "constructor", {
    value: v,
    configurable: true
  }), v.displayName = u(w, s, "GeneratorFunction"), r.isGeneratorFunction = function(f) {
    var p = typeof f == "function" && f.constructor;
    return !!p && (p === v || (p.displayName || p.name) === "GeneratorFunction");
  }, r.mark = function(f) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(f, w) : (f.__proto__ = w, u(f, s, "GeneratorFunction")), f.prototype = Object.create(g), f;
  }, r.awrap = function(f) {
    return {
      __await: f
    };
  }, m(y.prototype), u(y.prototype, a, function() {
    return this;
  }), r.AsyncIterator = y, r.async = function(f, p, b, T, x) {
    x === void 0 && (x = Promise);
    var M = new y(c(f, p, b, T), x);
    return r.isGeneratorFunction(p) ? M : M.next().then(function($) {
      return $.done ? $.value : M.next();
    });
  }, m(g), u(g, s, "Generator"), u(g, i, function() {
    return this;
  }), u(g, "toString", function() {
    return "[object Generator]";
  }), r.keys = function(f) {
    var p = Object(f), b = [];
    for (var T in p) b.push(T);
    return b.reverse(), function x() {
      for (; b.length; ) {
        var M = b.pop();
        if (M in p) return x.value = M, x.done = false, x;
      }
      return x.done = true, x;
    };
  }, r.values = N, R.prototype = {
    constructor: R,
    reset: function(f) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = false, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(P), !f) for (var p in this) p.charAt(0) === "t" && t.call(this, p) && !isNaN(+p.slice(1)) && (this[p] = void 0);
    },
    stop: function() {
      this.done = true;
      var f = this.tryEntries[0].completion;
      if (f.type === "throw") throw f.arg;
      return this.rval;
    },
    dispatchException: function(f) {
      if (this.done) throw f;
      var p = this;
      function b(z, I) {
        return M.type = "throw", M.arg = f, p.next = z, I && (p.method = "next", p.arg = void 0), !!I;
      }
      for (var T = this.tryEntries.length - 1; T >= 0; --T) {
        var x = this.tryEntries[T], M = x.completion;
        if (x.tryLoc === "root") return b("end");
        if (x.tryLoc <= this.prev) {
          var $ = t.call(x, "catchLoc"), j = t.call(x, "finallyLoc");
          if ($ && j) {
            if (this.prev < x.catchLoc) return b(x.catchLoc, true);
            if (this.prev < x.finallyLoc) return b(x.finallyLoc);
          } else if ($) {
            if (this.prev < x.catchLoc) return b(x.catchLoc, true);
          } else {
            if (!j) throw new Error("try statement without catch or finally");
            if (this.prev < x.finallyLoc) return b(x.finallyLoc);
          }
        }
      }
    },
    abrupt: function(f, p) {
      for (var b = this.tryEntries.length - 1; b >= 0; --b) {
        var T = this.tryEntries[b];
        if (T.tryLoc <= this.prev && t.call(T, "finallyLoc") && this.prev < T.finallyLoc) {
          var x = T;
          break;
        }
      }
      x && (f === "break" || f === "continue") && x.tryLoc <= p && p <= x.finallyLoc && (x = null);
      var M = x ? x.completion : {};
      return M.type = f, M.arg = p, x ? (this.method = "next", this.next = x.finallyLoc, d) : this.complete(M);
    },
    complete: function(f, p) {
      if (f.type === "throw") throw f.arg;
      return f.type === "break" || f.type === "continue" ? this.next = f.arg : f.type === "return" ? (this.rval = this.arg = f.arg, this.method = "return", this.next = "end") : f.type === "normal" && p && (this.next = p), d;
    },
    finish: function(f) {
      for (var p = this.tryEntries.length - 1; p >= 0; --p) {
        var b = this.tryEntries[p];
        if (b.finallyLoc === f) return this.complete(b.completion, b.afterLoc), P(b), d;
      }
    },
    catch: function(f) {
      for (var p = this.tryEntries.length - 1; p >= 0; --p) {
        var b = this.tryEntries[p];
        if (b.tryLoc === f) {
          var T = b.completion;
          if (T.type === "throw") {
            var x = T.arg;
            P(b);
          }
          return x;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function(f, p, b) {
      return this.delegate = {
        iterator: N(f),
        resultName: p,
        nextLoc: b
      }, this.method === "next" && (this.arg = void 0), d;
    }
  }, r;
}
function ot(r, e, t, n, o, i, a) {
  try {
    var s = r[i](a), u = s.value;
  } catch (c) {
    t(c);
    return;
  }
  s.done ? e(u) : Promise.resolve(u).then(n, o);
}
function X(r) {
  return function() {
    var e = this, t = arguments;
    return new Promise(function(n, o) {
      var i = r.apply(e, t);
      function a(u) {
        ot(i, n, o, a, s, "next", u);
      }
      function s(u) {
        ot(i, n, o, a, s, "throw", u);
      }
      a(void 0);
    });
  };
}
function bt(r, e) {
  if (!(r instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function Tr(r, e) {
  for (var t = 0; t < e.length; t++) {
    var n = e[t];
    n.enumerable = n.enumerable || false, n.configurable = true, "value" in n && (n.writable = true), Object.defineProperty(r, wt(n.key), n);
  }
}
function vt(r, e, t) {
  return e && Tr(r.prototype, e), Object.defineProperty(r, "prototype", {
    writable: false
  }), r;
}
function we(r, e, t) {
  return e = wt(e), e in r ? Object.defineProperty(r, e, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : r[e] = t, r;
}
function Or(r, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function");
  r.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: r,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(r, "prototype", {
    writable: false
  }), e && me(r, e);
}
function ge(r) {
  return ge = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, ge(r);
}
function me(r, e) {
  return me = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, o) {
    return n.__proto__ = o, n;
  }, me(r, e);
}
function yt() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return false;
  if (typeof Proxy == "function") return true;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), true;
  } catch {
    return false;
  }
}
function ke(r, e, t) {
  return yt() ? ke = Reflect.construct.bind() : ke = function(o, i, a) {
    var s = [null];
    s.push.apply(s, i);
    var u = Function.bind.apply(o, s), c = new u();
    return a && me(c, a.prototype), c;
  }, ke.apply(null, arguments);
}
function Ar(r) {
  return Function.toString.call(r).indexOf("[native code]") !== -1;
}
function je(r) {
  var e = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
  return je = function(n) {
    if (n === null || !Ar(n)) return n;
    if (typeof n != "function")
      throw new TypeError("Super expression must either be null or a function");
    if (typeof e < "u") {
      if (e.has(n)) return e.get(n);
      e.set(n, o);
    }
    function o() {
      return ke(n, arguments, ge(this).constructor);
    }
    return o.prototype = Object.create(n.prototype, {
      constructor: {
        value: o,
        enumerable: false,
        writable: true,
        configurable: true
      }
    }), me(o, n);
  }, je(r);
}
function xe(r) {
  if (r === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return r;
}
function Mr(r, e) {
  if (e && (typeof e == "object" || typeof e == "function"))
    return e;
  if (e !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return xe(r);
}
function Fr(r) {
  var e = yt();
  return function() {
    var n = ge(r), o;
    if (e) {
      var i = ge(this).constructor;
      o = Reflect.construct(n, arguments, i);
    } else
      o = n.apply(this, arguments);
    return Mr(this, o);
  };
}
function $r(r, e) {
  if (typeof r != "object" || r === null) return r;
  var t = r[Symbol.toPrimitive];
  if (t !== void 0) {
    var n = t.call(r, e);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(r);
}
function wt(r) {
  var e = $r(r, "string");
  return typeof e == "symbol" ? e : String(e);
}
var kt = typeof global < "u" && {}.toString.call(global) === "[object global]";
function it(r, e) {
  return r.indexOf(e.toLowerCase()) === 0 ? r : "".concat(e.toLowerCase()).concat(r.substr(0, 1).toUpperCase()).concat(r.substr(1));
}
function Rr(r) {
  return !!(r && r.nodeType === 1 && "nodeName" in r && r.ownerDocument && r.ownerDocument.defaultView);
}
function jr(r) {
  return !isNaN(parseFloat(r)) && isFinite(r) && Math.floor(r) == r;
}
function te(r) {
  return /^(https?:)?\/\/((((player|www)\.)?vimeo\.com)|((player\.)?[a-zA-Z0-9-]+\.(videoji\.(hk|cn)|vimeo\.work)))(?=$|\/)/.test(r);
}
function xt(r) {
  var e = /^https:\/\/player\.((vimeo\.com)|([a-zA-Z0-9-]+\.(videoji\.(hk|cn)|vimeo\.work)))\/video\/\d+/;
  return e.test(r);
}
function Nr(r) {
  for (var e = (r || "").match(/^(?:https?:)?(?:\/\/)?([^/?]+)/), t = (e && e[1] || "").replace("player.", ""), n = [".videoji.hk", ".vimeo.work", ".videoji.cn"], o = 0, i = n; o < i.length; o++) {
    var a = i[o];
    if (t.endsWith(a))
      return t;
  }
  return "vimeo.com";
}
function Ct() {
  var r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, e = r.id, t = r.url, n = e || t;
  if (!n)
    throw new Error("An id or url must be passed, either in an options object or as a data-vimeo-id or data-vimeo-url attribute.");
  if (jr(n))
    return "https://vimeo.com/".concat(n);
  if (te(n))
    return n.replace("http:", "https:");
  throw e ? new TypeError("“".concat(e, "” is not a valid video id.")) : new TypeError("“".concat(n, "” is not a vimeo.com url."));
}
var at = function(e, t, n) {
  var o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "addEventListener", i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : "removeEventListener", a = typeof t == "string" ? [t] : t;
  return a.forEach(function(s) {
    e[o](s, n);
  }), {
    cancel: function() {
      return a.forEach(function(u) {
        return e[i](u, n);
      });
    }
  };
}, zr = typeof Array.prototype.indexOf < "u", Ir = typeof window < "u" && typeof window.postMessage < "u";
if (!kt && (!zr || !Ir))
  throw new Error("Sorry, the Vimeo Player API is not available in this browser.");
var oe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Lr(r, e) {
  return e = { exports: {} }, r(e, e.exports), e.exports;
}
/*!
 * weakmap-polyfill v2.0.4 - ECMAScript6 WeakMap polyfill
 * https://github.com/polygonplanet/weakmap-polyfill
 * Copyright (c) 2015-2021 polygonplanet <polygon.planet.aqua@gmail.com>
 * @license MIT
 */
(function(r) {
  if (r.WeakMap)
    return;
  var e = Object.prototype.hasOwnProperty, t = Object.defineProperty && function() {
    try {
      return Object.defineProperty({}, "x", {
        value: 1
      }).x === 1;
    } catch {
    }
  }(), n = function(i, a, s) {
    t ? Object.defineProperty(i, a, {
      configurable: true,
      writable: true,
      value: s
    }) : i[a] = s;
  };
  r.WeakMap = function() {
    function i() {
      if (this === void 0)
        throw new TypeError("Constructor WeakMap requires 'new'");
      if (n(this, "_id", s("_WeakMap")), arguments.length > 0)
        throw new TypeError("WeakMap iterable is not supported");
    }
    n(i.prototype, "delete", function(c) {
      if (a(this, "delete"), !o(c))
        return false;
      var l = c[this._id];
      return l && l[0] === c ? (delete c[this._id], true) : false;
    }), n(i.prototype, "get", function(c) {
      if (a(this, "get"), !!o(c)) {
        var l = c[this._id];
        if (l && l[0] === c)
          return l[1];
      }
    }), n(i.prototype, "has", function(c) {
      if (a(this, "has"), !o(c))
        return false;
      var l = c[this._id];
      return !!(l && l[0] === c);
    }), n(i.prototype, "set", function(c, l) {
      if (a(this, "set"), !o(c))
        throw new TypeError("Invalid value used as weak map key");
      var d = c[this._id];
      return d && d[0] === c ? (d[1] = l, this) : (n(c, this._id, [c, l]), this);
    });
    function a(c, l) {
      if (!o(c) || !e.call(c, "_id"))
        throw new TypeError(l + " method called on incompatible receiver " + typeof c);
    }
    function s(c) {
      return c + "_" + u() + "." + u();
    }
    function u() {
      return Math.random().toString().substring(2);
    }
    return n(i, "_polyfill", true), i;
  }();
  function o(i) {
    return Object(i) === i;
  }
})(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : oe);
var U = Lr(function(r) {
  /*! Native Promise Only
      v0.8.1 (c) Kyle Simpson
      MIT License: http://getify.mit-license.org
  */
  (function(t, n, o) {
    n[t] = n[t] || o(), r.exports && (r.exports = n[t]);
  })("Promise", oe, function() {
    var t, n, o, i = Object.prototype.toString, a = typeof setImmediate < "u" ? function(m) {
      return setImmediate(m);
    } : setTimeout;
    try {
      Object.defineProperty({}, "x", {}), t = function(m, y, E, _) {
        return Object.defineProperty(m, y, {
          value: E,
          writable: true,
          configurable: _ !== false
        });
      };
    } catch {
      t = function(y, E, _) {
        return y[E] = _, y;
      };
    }
    o = /* @__PURE__ */ function() {
      var m, y, E;
      function _(A, P) {
        this.fn = A, this.self = P, this.next = void 0;
      }
      return {
        add: function(P, R) {
          E = new _(P, R), y ? y.next = E : m = E, y = E, E = void 0;
        },
        drain: function() {
          var P = m;
          for (m = y = n = void 0; P; )
            P.fn.call(P.self), P = P.next;
        }
      };
    }();
    function s(g, m) {
      o.add(g, m), n || (n = a(o.drain));
    }
    function u(g) {
      var m, y = typeof g;
      return g != null && (y == "object" || y == "function") && (m = g.then), typeof m == "function" ? m : false;
    }
    function c() {
      for (var g = 0; g < this.chain.length; g++)
        l(this, this.state === 1 ? this.chain[g].success : this.chain[g].failure, this.chain[g]);
      this.chain.length = 0;
    }
    function l(g, m, y) {
      var E, _;
      try {
        m === false ? y.reject(g.msg) : (m === true ? E = g.msg : E = m.call(void 0, g.msg), E === y.promise ? y.reject(TypeError("Promise-chain cycle")) : (_ = u(E)) ? _.call(E, y.resolve, y.reject) : y.resolve(E));
      } catch (A) {
        y.reject(A);
      }
    }
    function d(g) {
      var m, y = this;
      if (!y.triggered) {
        y.triggered = true, y.def && (y = y.def);
        try {
          (m = u(g)) ? s(function() {
            var E = new w(y);
            try {
              m.call(g, function() {
                d.apply(E, arguments);
              }, function() {
                h.apply(E, arguments);
              });
            } catch (_) {
              h.call(E, _);
            }
          }) : (y.msg = g, y.state = 1, y.chain.length > 0 && s(c, y));
        } catch (E) {
          h.call(new w(y), E);
        }
      }
    }
    function h(g) {
      var m = this;
      m.triggered || (m.triggered = true, m.def && (m = m.def), m.msg = g, m.state = 2, m.chain.length > 0 && s(c, m));
    }
    function v(g, m, y, E) {
      for (var _ = 0; _ < m.length; _++)
        (function(P) {
          g.resolve(m[P]).then(function(N) {
            y(P, N);
          }, E);
        })(_);
    }
    function w(g) {
      this.def = g, this.triggered = false;
    }
    function C(g) {
      this.promise = g, this.state = 0, this.triggered = false, this.chain = [], this.msg = void 0;
    }
    function k(g) {
      if (typeof g != "function")
        throw TypeError("Not a function");
      if (this.__NPO__ !== 0)
        throw TypeError("Not a promise");
      this.__NPO__ = 1;
      var m = new C(this);
      this.then = function(E, _) {
        var A = {
          success: typeof E == "function" ? E : true,
          failure: typeof _ == "function" ? _ : false
        };
        return A.promise = new this.constructor(function(R, N) {
          if (typeof R != "function" || typeof N != "function")
            throw TypeError("Not a function");
          A.resolve = R, A.reject = N;
        }), m.chain.push(A), m.state !== 0 && s(c, m), A.promise;
      }, this.catch = function(E) {
        return this.then(void 0, E);
      };
      try {
        g.call(void 0, function(E) {
          d.call(m, E);
        }, function(E) {
          h.call(m, E);
        });
      } catch (y) {
        h.call(m, y);
      }
    }
    var S = t(
      {},
      "constructor",
      k,
      /*configurable=*/
      false
    );
    return k.prototype = S, t(
      S,
      "__NPO__",
      0,
      /*configurable=*/
      false
    ), t(k, "resolve", function(m) {
      var y = this;
      return m && typeof m == "object" && m.__NPO__ === 1 ? m : new y(function(_, A) {
        if (typeof _ != "function" || typeof A != "function")
          throw TypeError("Not a function");
        _(m);
      });
    }), t(k, "reject", function(m) {
      return new this(function(E, _) {
        if (typeof E != "function" || typeof _ != "function")
          throw TypeError("Not a function");
        _(m);
      });
    }), t(k, "all", function(m) {
      var y = this;
      return i.call(m) != "[object Array]" ? y.reject(TypeError("Not an array")) : m.length === 0 ? y.resolve([]) : new y(function(_, A) {
        if (typeof _ != "function" || typeof A != "function")
          throw TypeError("Not a function");
        var P = m.length, R = Array(P), N = 0;
        v(y, m, function(f, p) {
          R[f] = p, ++N === P && _(R);
        }, A);
      });
    }), t(k, "race", function(m) {
      var y = this;
      return i.call(m) != "[object Array]" ? y.reject(TypeError("Not an array")) : new y(function(_, A) {
        if (typeof _ != "function" || typeof A != "function")
          throw TypeError("Not a function");
        v(y, m, function(R, N) {
          _(N);
        }, A);
      });
    }), k;
  });
}), G = /* @__PURE__ */ new WeakMap();
function pe(r, e, t) {
  var n = G.get(r.element) || {};
  e in n || (n[e] = []), n[e].push(t), G.set(r.element, n);
}
function Ee(r, e) {
  var t = G.get(r.element) || {};
  return t[e] || [];
}
function Se(r, e, t) {
  var n = G.get(r.element) || {};
  if (!n[e])
    return true;
  if (!t)
    return n[e] = [], G.set(r.element, n), true;
  var o = n[e].indexOf(t);
  return o !== -1 && n[e].splice(o, 1), G.set(r.element, n), n[e] && n[e].length === 0;
}
function Vr(r, e) {
  var t = Ee(r, e);
  if (t.length < 1)
    return false;
  var n = t.shift();
  return Se(r, e, n), n;
}
function Dr(r, e) {
  var t = G.get(r);
  G.set(e, t), G.delete(r);
}
function Oe(r) {
  if (typeof r == "string")
    try {
      r = JSON.parse(r);
    } catch (e) {
      return console.warn(e), {};
    }
  return r;
}
function K(r, e, t) {
  if (!(!r.element.contentWindow || !r.element.contentWindow.postMessage)) {
    var n = {
      method: e
    };
    t !== void 0 && (n.value = t);
    var o = parseFloat(navigator.userAgent.toLowerCase().replace(/^.*msie (\d+).*$/, "$1"));
    o >= 8 && o < 10 && (n = JSON.stringify(n)), r.element.contentWindow.postMessage(n, r.origin);
  }
}
function Ur(r, e) {
  e = Oe(e);
  var t = [], n;
  if (e.event) {
    if (e.event === "error") {
      var o = Ee(r, e.data.method);
      o.forEach(function(a) {
        var s = new Error(e.data.message);
        s.name = e.data.name, a.reject(s), Se(r, e.data.method, a);
      });
    }
    t = Ee(r, "event:".concat(e.event)), n = e.data;
  } else if (e.method) {
    var i = Vr(r, e.method);
    i && (t.push(i), n = e.value);
  }
  t.forEach(function(a) {
    try {
      if (typeof a == "function") {
        a.call(r, n);
        return;
      }
      a.resolve(n);
    } catch {
    }
  });
}
var qr = ["airplay", "audio_tracks", "autopause", "autoplay", "background", "byline", "cc", "chapter_id", "chapters", "chromecast", "color", "colors", "controls", "dnt", "end_time", "fullscreen", "height", "id", "interactive_params", "keyboard", "loop", "maxheight", "maxwidth", "muted", "play_button_position", "playsinline", "portrait", "progress_bar", "quality_selector", "responsive", "speed", "start_time", "texttrack", "title", "transcript", "transparent", "unmute_button", "url", "vimeo_logo", "volume", "watch_full_video", "width"];
function Pt(r) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return qr.reduce(function(t, n) {
    var o = r.getAttribute("data-vimeo-".concat(n));
    return (o || o === "") && (t[n] = o === "" ? 1 : o), t;
  }, e);
}
function Qe(r, e) {
  var t = r.html;
  if (!e)
    throw new TypeError("An element must be provided");
  if (e.getAttribute("data-vimeo-initialized") !== null)
    return e.querySelector("iframe");
  var n = document.createElement("div");
  return n.innerHTML = t, e.appendChild(n.firstChild), e.setAttribute("data-vimeo-initialized", "true"), e.querySelector("iframe");
}
function Et(r) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, t = arguments.length > 2 ? arguments[2] : void 0;
  return new Promise(function(n, o) {
    if (!te(r))
      throw new TypeError("“".concat(r, "” is not a vimeo.com url."));
    var i = Nr(r), a = "https://".concat(i, "/api/oembed.json?url=").concat(encodeURIComponent(r));
    for (var s in e)
      e.hasOwnProperty(s) && (a += "&".concat(s, "=").concat(encodeURIComponent(e[s])));
    var u = "XDomainRequest" in window ? new XDomainRequest() : new XMLHttpRequest();
    u.open("GET", a, true), u.onload = function() {
      if (u.status === 404) {
        o(new Error("“".concat(r, "” was not found.")));
        return;
      }
      if (u.status === 403) {
        o(new Error("“".concat(r, "” is not embeddable.")));
        return;
      }
      try {
        var c = JSON.parse(u.responseText);
        if (c.domain_status_code === 403) {
          Qe(c, t), o(new Error("“".concat(r, "” is not embeddable.")));
          return;
        }
        n(c);
      } catch (l) {
        o(l);
      }
    }, u.onerror = function() {
      var c = u.status ? " (".concat(u.status, ")") : "";
      o(new Error("There was an error fetching the embed code from Vimeo".concat(c, ".")));
    }, u.send();
  });
}
function Gr() {
  var r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document, e = [].slice.call(r.querySelectorAll("[data-vimeo-id], [data-vimeo-url]")), t = function(o) {
    "console" in window && console.error && console.error("There was an error creating an embed: ".concat(o));
  };
  e.forEach(function(n) {
    try {
      if (n.getAttribute("data-vimeo-defer") !== null)
        return;
      var o = Pt(n), i = Ct(o);
      Et(i, o, n).then(function(a) {
        return Qe(a, n);
      }).catch(t);
    } catch (a) {
      t(a);
    }
  });
}
function Wr() {
  var r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document;
  if (!window.VimeoPlayerResizeEmbeds_) {
    window.VimeoPlayerResizeEmbeds_ = true;
    var e = function(n) {
      if (te(n.origin) && !(!n.data || n.data.event !== "spacechange")) {
        for (var o = r.querySelectorAll("iframe"), i = 0; i < o.length; i++)
          if (o[i].contentWindow === n.source) {
            var a = o[i].parentElement;
            a.style.paddingBottom = "".concat(n.data.data[0].bottom, "px");
            break;
          }
      }
    };
    window.addEventListener("message", e);
  }
}
function Br() {
  var r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document;
  if (!window.VimeoSeoMetadataAppended) {
    window.VimeoSeoMetadataAppended = true;
    var e = function(n) {
      if (te(n.origin)) {
        var o = Oe(n.data);
        if (!(!o || o.event !== "ready"))
          for (var i = r.querySelectorAll("iframe"), a = 0; a < i.length; a++) {
            var s = i[a], u = s.contentWindow === n.source;
            if (xt(s.src) && u) {
              var c = new He(s);
              c.callMethod("appendVideoMetadata", window.location.href);
            }
          }
      }
    };
    window.addEventListener("message", e);
  }
}
function Yr() {
  var r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document;
  if (!window.VimeoCheckedUrlTimeParam) {
    window.VimeoCheckedUrlTimeParam = true;
    var e = function(o) {
      "console" in window && console.error && console.error("There was an error getting video Id: ".concat(o));
    }, t = function(o) {
      if (te(o.origin)) {
        var i = Oe(o.data);
        if (!(!i || i.event !== "ready"))
          for (var a = r.querySelectorAll("iframe"), s = function() {
            var l = a[u], d = l.contentWindow === o.source;
            if (xt(l.src) && d) {
              var h = new He(l);
              h.getVideoId().then(function(v) {
                var w = new RegExp("[?&]vimeo_t_".concat(v, "=([^&#]*)")).exec(window.location.href);
                if (w && w[1]) {
                  var C = decodeURI(w[1]);
                  h.setCurrentTime(C);
                }
              }).catch(e);
            }
          }, u = 0; u < a.length; u++)
            s();
      }
    };
    window.addEventListener("message", t);
  }
}
function Qr() {
  var r = function() {
    for (var n, o = [
      ["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
      // New WebKit
      ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"],
      // Old WebKit
      ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"],
      ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"],
      ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]
    ], i = 0, a = o.length, s = {}; i < a; i++)
      if (n = o[i], n && n[1] in document) {
        for (i = 0; i < n.length; i++)
          s[o[0][i]] = n[i];
        return s;
      }
    return false;
  }(), e = {
    fullscreenchange: r.fullscreenchange,
    fullscreenerror: r.fullscreenerror
  }, t = {
    request: function(o) {
      return new Promise(function(i, a) {
        var s = function c() {
          t.off("fullscreenchange", c), i();
        };
        t.on("fullscreenchange", s), o = o || document.documentElement;
        var u = o[r.requestFullscreen]();
        u instanceof Promise && u.then(s).catch(a);
      });
    },
    exit: function() {
      return new Promise(function(o, i) {
        if (!t.isFullscreen) {
          o();
          return;
        }
        var a = function u() {
          t.off("fullscreenchange", u), o();
        };
        t.on("fullscreenchange", a);
        var s = document[r.exitFullscreen]();
        s instanceof Promise && s.then(a).catch(i);
      });
    },
    on: function(o, i) {
      var a = e[o];
      a && document.addEventListener(a, i);
    },
    off: function(o, i) {
      var a = e[o];
      a && document.removeEventListener(a, i);
    }
  };
  return Object.defineProperties(t, {
    isFullscreen: {
      get: function() {
        return !!document[r.fullscreenElement];
      }
    },
    element: {
      enumerable: true,
      get: function() {
        return document[r.fullscreenElement];
      }
    },
    isEnabled: {
      enumerable: true,
      get: function() {
        return !!document[r.fullscreenEnabled];
      }
    }
  }), t;
}
var Hr = {
  role: "viewer",
  autoPlayMuted: true,
  allowedDrift: 0.3,
  maxAllowedDrift: 1,
  minCheckInterval: 0.1,
  maxRateAdjustment: 0.2,
  maxTimeToCatchUp: 1
}, Jr = /* @__PURE__ */ function(r) {
  Or(t, r);
  var e = Fr(t);
  function t(n, o) {
    var i, a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, s = arguments.length > 3 ? arguments[3] : void 0;
    return bt(this, t), i = e.call(this), we(xe(i), "logger", void 0), we(xe(i), "speedAdjustment", 0), we(xe(i), "adjustSpeed", /* @__PURE__ */ function() {
      var u = X(/* @__PURE__ */ L().mark(function c(l, d) {
        var h;
        return L().wrap(function(w) {
          for (; ; ) switch (w.prev = w.next) {
            case 0:
              if (i.speedAdjustment !== d) {
                w.next = 2;
                break;
              }
              return w.abrupt("return");
            case 2:
              return w.next = 4, l.getPlaybackRate();
            case 4:
              return w.t0 = w.sent, w.t1 = i.speedAdjustment, w.t2 = w.t0 - w.t1, w.t3 = d, h = w.t2 + w.t3, i.log("New playbackRate:  ".concat(h)), w.next = 12, l.setPlaybackRate(h);
            case 12:
              i.speedAdjustment = d;
            case 13:
            case "end":
              return w.stop();
          }
        }, c);
      }));
      return function(c, l) {
        return u.apply(this, arguments);
      };
    }()), i.logger = s, i.init(o, n, nt(nt({}, Hr), a)), i;
  }
  return vt(t, [{
    key: "disconnect",
    value: function() {
      this.dispatchEvent(new Event("disconnect"));
    }
    /**
     * @param {TimingObject} timingObject
     * @param {PlayerControls} player
     * @param {TimingSrcConnectorOptions} options
     * @return {Promise<void>}
     */
  }, {
    key: "init",
    value: function() {
      var n = X(/* @__PURE__ */ L().mark(function i(a, s, u) {
        var c = this, l, d, h;
        return L().wrap(function(w) {
          for (; ; ) switch (w.prev = w.next) {
            case 0:
              return w.next = 2, this.waitForTOReadyState(a, "open");
            case 2:
              if (u.role !== "viewer") {
                w.next = 10;
                break;
              }
              return w.next = 5, this.updatePlayer(a, s, u);
            case 5:
              l = at(a, "change", function() {
                return c.updatePlayer(a, s, u);
              }), d = this.maintainPlaybackPosition(a, s, u), this.addEventListener("disconnect", function() {
                d.cancel(), l.cancel();
              }), w.next = 14;
              break;
            case 10:
              return w.next = 12, this.updateTimingObject(a, s);
            case 12:
              h = at(s, ["seeked", "play", "pause", "ratechange"], function() {
                return c.updateTimingObject(a, s);
              }, "on", "off"), this.addEventListener("disconnect", function() {
                return h.cancel();
              });
            case 14:
            case "end":
              return w.stop();
          }
        }, i, this);
      }));
      function o(i, a, s) {
        return n.apply(this, arguments);
      }
      return o;
    }()
    /**
     * Sets the TimingObject's state to reflect that of the player
     *
     * @param {TimingObject} timingObject
     * @param {PlayerControls} player
     * @return {Promise<void>}
     */
  }, {
    key: "updateTimingObject",
    value: function() {
      var n = X(/* @__PURE__ */ L().mark(function i(a, s) {
        return L().wrap(function(c) {
          for (; ; ) switch (c.prev = c.next) {
            case 0:
              return c.t0 = a, c.next = 3, s.getCurrentTime();
            case 3:
              return c.t1 = c.sent, c.next = 6, s.getPaused();
            case 6:
              if (!c.sent) {
                c.next = 10;
                break;
              }
              c.t2 = 0, c.next = 13;
              break;
            case 10:
              return c.next = 12, s.getPlaybackRate();
            case 12:
              c.t2 = c.sent;
            case 13:
              c.t3 = c.t2, c.t4 = {
                position: c.t1,
                velocity: c.t3
              }, c.t0.update.call(c.t0, c.t4);
            case 16:
            case "end":
              return c.stop();
          }
        }, i);
      }));
      function o(i, a) {
        return n.apply(this, arguments);
      }
      return o;
    }()
    /**
     * Sets the player's timing state to reflect that of the TimingObject
     *
     * @param {TimingObject} timingObject
     * @param {PlayerControls} player
     * @param {TimingSrcConnectorOptions} options
     * @return {Promise<void>}
     */
  }, {
    key: "updatePlayer",
    value: function() {
      var n = X(/* @__PURE__ */ L().mark(function i(a, s, u) {
        var c, l, d;
        return L().wrap(function(v) {
          for (; ; ) switch (v.prev = v.next) {
            case 0:
              if (c = a.query(), l = c.position, d = c.velocity, typeof l == "number" && s.setCurrentTime(l), typeof d != "number") {
                v.next = 25;
                break;
              }
              if (d !== 0) {
                v.next = 11;
                break;
              }
              return v.next = 6, s.getPaused();
            case 6:
              if (v.t0 = v.sent, v.t0 !== false) {
                v.next = 9;
                break;
              }
              s.pause();
            case 9:
              v.next = 25;
              break;
            case 11:
              if (!(d > 0)) {
                v.next = 25;
                break;
              }
              return v.next = 14, s.getPaused();
            case 14:
              if (v.t1 = v.sent, v.t1 !== true) {
                v.next = 19;
                break;
              }
              return v.next = 18, s.play().catch(/* @__PURE__ */ function() {
                var w = X(/* @__PURE__ */ L().mark(function C(k) {
                  return L().wrap(function(g) {
                    for (; ; ) switch (g.prev = g.next) {
                      case 0:
                        if (!(k.name === "NotAllowedError" && u.autoPlayMuted)) {
                          g.next = 5;
                          break;
                        }
                        return g.next = 3, s.setMuted(true);
                      case 3:
                        return g.next = 5, s.play().catch(function(m) {
                          return console.error("Couldn't play the video from TimingSrcConnector. Error:", m);
                        });
                      case 5:
                      case "end":
                        return g.stop();
                    }
                  }, C);
                }));
                return function(C) {
                  return w.apply(this, arguments);
                };
              }());
            case 18:
              this.updatePlayer(a, s, u);
            case 19:
              return v.next = 21, s.getPlaybackRate();
            case 21:
              if (v.t2 = v.sent, v.t3 = d, v.t2 === v.t3) {
                v.next = 25;
                break;
              }
              s.setPlaybackRate(d);
            case 25:
            case "end":
              return v.stop();
          }
        }, i, this);
      }));
      function o(i, a, s) {
        return n.apply(this, arguments);
      }
      return o;
    }()
    /**
     * Since video players do not play with 100% time precision, we need to closely monitor
     * our player to be sure it remains in sync with the TimingObject.
     *
     * If out of sync, we use the current conditions and the options provided to determine
     * whether to re-sync via setting currentTime or adjusting the playbackRate
     *
     * @param {TimingObject} timingObject
     * @param {PlayerControls} player
     * @param {TimingSrcConnectorOptions} options
     * @return {{cancel: (function(): void)}}
     */
  }, {
    key: "maintainPlaybackPosition",
    value: function(o, i, a) {
      var s = this, u = a.allowedDrift, c = a.maxAllowedDrift, l = a.minCheckInterval, d = a.maxRateAdjustment, h = a.maxTimeToCatchUp, v = Math.min(h, Math.max(l, c)) * 1e3, w = /* @__PURE__ */ function() {
        var k = X(/* @__PURE__ */ L().mark(function S() {
          var g, m, y, E, _;
          return L().wrap(function(P) {
            for (; ; ) switch (P.prev = P.next) {
              case 0:
                if (P.t0 = o.query().velocity === 0, P.t0) {
                  P.next = 6;
                  break;
                }
                return P.next = 4, i.getPaused();
              case 4:
                P.t1 = P.sent, P.t0 = P.t1 === true;
              case 6:
                if (!P.t0) {
                  P.next = 8;
                  break;
                }
                return P.abrupt("return");
              case 8:
                return P.t2 = o.query().position, P.next = 11, i.getCurrentTime();
              case 11:
                if (P.t3 = P.sent, g = P.t2 - P.t3, m = Math.abs(g), s.log("Drift: ".concat(g)), !(m > c)) {
                  P.next = 22;
                  break;
                }
                return P.next = 18, s.adjustSpeed(i, 0);
              case 18:
                i.setCurrentTime(o.query().position), s.log("Resync by currentTime"), P.next = 29;
                break;
              case 22:
                if (!(m > u)) {
                  P.next = 29;
                  break;
                }
                return y = m / h, E = d, _ = y < E ? (E - y) / 2 : E, P.next = 28, s.adjustSpeed(i, _ * Math.sign(g));
              case 28:
                s.log("Resync by playbackRate");
              case 29:
              case "end":
                return P.stop();
            }
          }, S);
        }));
        return function() {
          return k.apply(this, arguments);
        };
      }(), C = setInterval(function() {
        return w();
      }, v);
      return {
        cancel: function() {
          return clearInterval(C);
        }
      };
    }
    /**
     * @param {string} msg
     */
  }, {
    key: "log",
    value: function(o) {
      var i;
      (i = this.logger) === null || i === void 0 || i.call(this, "TimingSrcConnector: ".concat(o));
    }
  }, {
    key: "waitForTOReadyState",
    value: (
      /**
       * @param {TimingObject} timingObject
       * @param {TConnectionState} state
       * @return {Promise<void>}
       */
      function(o, i) {
        return new Promise(function(a) {
          var s = function u() {
            o.readyState === i ? a() : o.addEventListener("readystatechange", u, {
              once: true
            });
          };
          s();
        });
      }
    )
  }]), t;
}(/* @__PURE__ */ je(EventTarget)), re = /* @__PURE__ */ new WeakMap(), Fe = /* @__PURE__ */ new WeakMap(), D = {}, He = /* @__PURE__ */ function() {
  function r(e) {
    var t = this, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (bt(this, r), window.jQuery && e instanceof jQuery && (e.length > 1 && window.console && console.warn && console.warn("A jQuery object with multiple elements was passed, using the first element."), e = e[0]), typeof document < "u" && typeof e == "string" && (e = document.getElementById(e)), !Rr(e))
      throw new TypeError("You must pass either a valid element or a valid id.");
    if (e.nodeName !== "IFRAME") {
      var o = e.querySelector("iframe");
      o && (e = o);
    }
    if (e.nodeName === "IFRAME" && !te(e.getAttribute("src") || ""))
      throw new Error("The player element passed isn’t a Vimeo embed.");
    if (re.has(e))
      return re.get(e);
    this._window = e.ownerDocument.defaultView, this.element = e, this.origin = "*";
    var i = new U(function(s, u) {
      if (t._onMessage = function(d) {
        if (!(!te(d.origin) || t.element.contentWindow !== d.source)) {
          t.origin === "*" && (t.origin = d.origin);
          var h = Oe(d.data), v = h && h.event === "error", w = v && h.data && h.data.method === "ready";
          if (w) {
            var C = new Error(h.data.message);
            C.name = h.data.name, u(C);
            return;
          }
          var k = h && h.event === "ready", S = h && h.method === "ping";
          if (k || S) {
            t.element.setAttribute("data-ready", "true"), s();
            return;
          }
          Ur(t, h);
        }
      }, t._window.addEventListener("message", t._onMessage), t.element.nodeName !== "IFRAME") {
        var c = Pt(e, n), l = Ct(c);
        Et(l, c, e).then(function(d) {
          var h = Qe(d, e);
          return t.element = h, t._originalElement = e, Dr(e, h), re.set(t.element, t), d;
        }).catch(u);
      }
    });
    if (Fe.set(this, i), re.set(this.element, this), this.element.nodeName === "IFRAME" && K(this, "ping"), D.isEnabled) {
      var a = function() {
        return D.exit();
      };
      this.fullscreenchangeHandler = function() {
        D.isFullscreen ? pe(t, "event:exitFullscreen", a) : Se(t, "event:exitFullscreen", a), t.ready().then(function() {
          K(t, "fullscreenchange", D.isFullscreen);
        });
      }, D.on("fullscreenchange", this.fullscreenchangeHandler);
    }
    return this;
  }
  return vt(r, [{
    key: "callMethod",
    value: function(t) {
      var n = this, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return new U(function(i, a) {
        return n.ready().then(function() {
          pe(n, t, {
            resolve: i,
            reject: a
          }), K(n, t, o);
        }).catch(a);
      });
    }
    /**
     * Get a promise for the value of a player property.
     *
     * @param {string} name The property name
     * @return {Promise}
     */
  }, {
    key: "get",
    value: function(t) {
      var n = this;
      return new U(function(o, i) {
        return t = it(t, "get"), n.ready().then(function() {
          pe(n, t, {
            resolve: o,
            reject: i
          }), K(n, t);
        }).catch(i);
      });
    }
    /**
     * Get a promise for setting the value of a player property.
     *
     * @param {string} name The API method to call.
     * @param {mixed} value The value to set.
     * @return {Promise}
     */
  }, {
    key: "set",
    value: function(t, n) {
      var o = this;
      return new U(function(i, a) {
        if (t = it(t, "set"), n == null)
          throw new TypeError("There must be a value to set.");
        return o.ready().then(function() {
          pe(o, t, {
            resolve: i,
            reject: a
          }), K(o, t, n);
        }).catch(a);
      });
    }
    /**
     * Add an event listener for the specified event. Will call the
     * callback with a single parameter, `data`, that contains the data for
     * that event.
     *
     * @param {string} eventName The name of the event.
     * @param {function(*)} callback The function to call when the event fires.
     * @return {void}
     */
  }, {
    key: "on",
    value: function(t, n) {
      if (!t)
        throw new TypeError("You must pass an event name.");
      if (!n)
        throw new TypeError("You must pass a callback function.");
      if (typeof n != "function")
        throw new TypeError("The callback must be a function.");
      var o = Ee(this, "event:".concat(t));
      o.length === 0 && this.callMethod("addEventListener", t).catch(function() {
      }), pe(this, "event:".concat(t), n);
    }
    /**
     * Remove an event listener for the specified event. Will remove all
     * listeners for that event if a `callback` isn’t passed, or only that
     * specific callback if it is passed.
     *
     * @param {string} eventName The name of the event.
     * @param {function} [callback] The specific callback to remove.
     * @return {void}
     */
  }, {
    key: "off",
    value: function(t, n) {
      if (!t)
        throw new TypeError("You must pass an event name.");
      if (n && typeof n != "function")
        throw new TypeError("The callback must be a function.");
      var o = Se(this, "event:".concat(t), n);
      o && this.callMethod("removeEventListener", t).catch(function(i) {
      });
    }
    /**
     * A promise to load a new video.
     *
     * @promise LoadVideoPromise
     * @fulfill {number} The video with this id or url successfully loaded.
     * @reject {TypeError} The id was not a number.
     */
    /**
     * Load a new video into this embed. The promise will be resolved if
     * the video is successfully loaded, or it will be rejected if it could
     * not be loaded.
     *
     * @param {number|string|object} options The id of the video, the url of the video, or an object with embed options.
     * @return {LoadVideoPromise}
     */
  }, {
    key: "loadVideo",
    value: function(t) {
      return this.callMethod("loadVideo", t);
    }
    /**
     * A promise to perform an action when the Player is ready.
     *
     * @todo document errors
     * @promise LoadVideoPromise
     * @fulfill {void}
     */
    /**
     * Trigger a function when the player iframe has initialized. You do not
     * need to wait for `ready` to trigger to begin adding event listeners
     * or calling other methods.
     *
     * @return {ReadyPromise}
     */
  }, {
    key: "ready",
    value: function() {
      var t = Fe.get(this) || new U(function(n, o) {
        o(new Error("Unknown player. Probably unloaded."));
      });
      return U.resolve(t);
    }
    /**
     * A promise to add a cue point to the player.
     *
     * @promise AddCuePointPromise
     * @fulfill {string} The id of the cue point to use for removeCuePoint.
     * @reject {RangeError} the time was less than 0 or greater than the
     *         video’s duration.
     * @reject {UnsupportedError} Cue points are not supported with the current
     *         player or browser.
     */
    /**
     * Add a cue point to the player.
     *
     * @param {number} time The time for the cue point.
     * @param {object} [data] Arbitrary data to be returned with the cue point.
     * @return {AddCuePointPromise}
     */
  }, {
    key: "addCuePoint",
    value: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.callMethod("addCuePoint", {
        time: t,
        data: n
      });
    }
    /**
     * A promise to remove a cue point from the player.
     *
     * @promise AddCuePointPromise
     * @fulfill {string} The id of the cue point that was removed.
     * @reject {InvalidCuePoint} The cue point with the specified id was not
     *         found.
     * @reject {UnsupportedError} Cue points are not supported with the current
     *         player or browser.
     */
    /**
     * Remove a cue point from the video.
     *
     * @param {string} id The id of the cue point to remove.
     * @return {RemoveCuePointPromise}
     */
  }, {
    key: "removeCuePoint",
    value: function(t) {
      return this.callMethod("removeCuePoint", t);
    }
    /**
     * A representation of a text track on a video.
     *
     * @typedef {Object} VimeoTextTrack
     * @property {string} language The ISO language code.
     * @property {string} kind The kind of track it is (captions or subtitles).
     * @property {string} label The human‐readable label for the track.
     */
    /**
     * A promise to enable a text track.
     *
     * @promise EnableTextTrackPromise
     * @fulfill {VimeoTextTrack} The text track that was enabled.
     * @reject {InvalidTrackLanguageError} No track was available with the
     *         specified language.
     * @reject {InvalidTrackError} No track was available with the specified
     *         language and kind.
     */
    /**
     * Enable the text track with the specified language, and optionally the
     * specified kind (captions or subtitles).
     *
     * When set via the API, the track language will not change the viewer’s
     * stored preference.
     *
     * @param {string} language The two‐letter language code.
     * @param {string} [kind] The kind of track to enable (captions or subtitles).
     * @return {EnableTextTrackPromise}
     */
  }, {
    key: "enableTextTrack",
    value: function(t, n) {
      if (!t)
        throw new TypeError("You must pass a language.");
      return this.callMethod("enableTextTrack", {
        language: t,
        kind: n
      });
    }
    /**
     * A promise to disable the active text track.
     *
     * @promise DisableTextTrackPromise
     * @fulfill {void} The track was disabled.
     */
    /**
     * Disable the currently-active text track.
     *
     * @return {DisableTextTrackPromise}
     */
  }, {
    key: "disableTextTrack",
    value: function() {
      return this.callMethod("disableTextTrack");
    }
    /**
     * A promise to pause the video.
     *
     * @promise PausePromise
     * @fulfill {void} The video was paused.
     */
    /**
     * Pause the video if it’s playing.
     *
     * @return {PausePromise}
     */
  }, {
    key: "pause",
    value: function() {
      return this.callMethod("pause");
    }
    /**
     * A promise to play the video.
     *
     * @promise PlayPromise
     * @fulfill {void} The video was played.
     */
    /**
     * Play the video if it’s paused. **Note:** on iOS and some other
     * mobile devices, you cannot programmatically trigger play. Once the
     * viewer has tapped on the play button in the player, however, you
     * will be able to use this function.
     *
     * @return {PlayPromise}
     */
  }, {
    key: "play",
    value: function() {
      return this.callMethod("play");
    }
    /**
     * Request that the player enters fullscreen.
     * @return {Promise}
     */
  }, {
    key: "requestFullscreen",
    value: function() {
      return D.isEnabled ? D.request(this.element) : this.callMethod("requestFullscreen");
    }
    /**
     * Request that the player exits fullscreen.
     * @return {Promise}
     */
  }, {
    key: "exitFullscreen",
    value: function() {
      return D.isEnabled ? D.exit() : this.callMethod("exitFullscreen");
    }
    /**
     * Returns true if the player is currently fullscreen.
     * @return {Promise}
     */
  }, {
    key: "getFullscreen",
    value: function() {
      return D.isEnabled ? U.resolve(D.isFullscreen) : this.get("fullscreen");
    }
    /**
     * Request that the player enters picture-in-picture.
     * @return {Promise}
     */
  }, {
    key: "requestPictureInPicture",
    value: function() {
      return this.callMethod("requestPictureInPicture");
    }
    /**
     * Request that the player exits picture-in-picture.
     * @return {Promise}
     */
  }, {
    key: "exitPictureInPicture",
    value: function() {
      return this.callMethod("exitPictureInPicture");
    }
    /**
     * Returns true if the player is currently picture-in-picture.
     * @return {Promise}
     */
  }, {
    key: "getPictureInPicture",
    value: function() {
      return this.get("pictureInPicture");
    }
    /**
     * A promise to prompt the viewer to initiate remote playback.
     *
     * @promise RemotePlaybackPromptPromise
     * @fulfill {void}
     * @reject {NotFoundError} No remote playback device is available.
     */
    /**
     * Request to prompt the user to initiate remote playback.
     *
     * @return {RemotePlaybackPromptPromise}
     */
  }, {
    key: "remotePlaybackPrompt",
    value: function() {
      return this.callMethod("remotePlaybackPrompt");
    }
    /**
     * A promise to unload the video.
     *
     * @promise UnloadPromise
     * @fulfill {void} The video was unloaded.
     */
    /**
     * Return the player to its initial state.
     *
     * @return {UnloadPromise}
     */
  }, {
    key: "unload",
    value: function() {
      return this.callMethod("unload");
    }
    /**
     * Cleanup the player and remove it from the DOM
     *
     * It won't be usable and a new one should be constructed
     *  in order to do any operations.
     *
     * @return {Promise}
     */
  }, {
    key: "destroy",
    value: function() {
      var t = this;
      return new U(function(n) {
        if (Fe.delete(t), re.delete(t.element), t._originalElement && (re.delete(t._originalElement), t._originalElement.removeAttribute("data-vimeo-initialized")), t.element && t.element.nodeName === "IFRAME" && t.element.parentNode && (t.element.parentNode.parentNode && t._originalElement && t._originalElement !== t.element.parentNode ? t.element.parentNode.parentNode.removeChild(t.element.parentNode) : t.element.parentNode.removeChild(t.element)), t.element && t.element.nodeName === "DIV" && t.element.parentNode) {
          t.element.removeAttribute("data-vimeo-initialized");
          var o = t.element.querySelector("iframe");
          o && o.parentNode && (o.parentNode.parentNode && t._originalElement && t._originalElement !== o.parentNode ? o.parentNode.parentNode.removeChild(o.parentNode) : o.parentNode.removeChild(o));
        }
        t._window.removeEventListener("message", t._onMessage), D.isEnabled && D.off("fullscreenchange", t.fullscreenchangeHandler), n();
      });
    }
    /**
     * A promise to get the autopause behavior of the video.
     *
     * @promise GetAutopausePromise
     * @fulfill {boolean} Whether autopause is turned on or off.
     * @reject {UnsupportedError} Autopause is not supported with the current
     *         player or browser.
     */
    /**
     * Get the autopause behavior for this player.
     *
     * @return {GetAutopausePromise}
     */
  }, {
    key: "getAutopause",
    value: function() {
      return this.get("autopause");
    }
    /**
     * A promise to set the autopause behavior of the video.
     *
     * @promise SetAutopausePromise
     * @fulfill {boolean} Whether autopause is turned on or off.
     * @reject {UnsupportedError} Autopause is not supported with the current
     *         player or browser.
     */
    /**
     * Enable or disable the autopause behavior of this player.
     *
     * By default, when another video is played in the same browser, this
     * player will automatically pause. Unless you have a specific reason
     * for doing so, we recommend that you leave autopause set to the
     * default (`true`).
     *
     * @param {boolean} autopause
     * @return {SetAutopausePromise}
     */
  }, {
    key: "setAutopause",
    value: function(t) {
      return this.set("autopause", t);
    }
    /**
     * A promise to get the buffered property of the video.
     *
     * @promise GetBufferedPromise
     * @fulfill {Array} Buffered Timeranges converted to an Array.
     */
    /**
     * Get the buffered property of the video.
     *
     * @return {GetBufferedPromise}
     */
  }, {
    key: "getBuffered",
    value: function() {
      return this.get("buffered");
    }
    /**
     * @typedef {Object} CameraProperties
     * @prop {number} props.yaw - Number between 0 and 360.
     * @prop {number} props.pitch - Number between -90 and 90.
     * @prop {number} props.roll - Number between -180 and 180.
     * @prop {number} props.fov - The field of view in degrees.
     */
    /**
     * A promise to get the camera properties of the player.
     *
     * @promise GetCameraPromise
     * @fulfill {CameraProperties} The camera properties.
     */
    /**
     * For 360° videos get the camera properties for this player.
     *
     * @return {GetCameraPromise}
     */
  }, {
    key: "getCameraProps",
    value: function() {
      return this.get("cameraProps");
    }
    /**
     * A promise to set the camera properties of the player.
     *
     * @promise SetCameraPromise
     * @fulfill {Object} The camera was successfully set.
     * @reject {RangeError} The range was out of bounds.
     */
    /**
     * For 360° videos set the camera properties for this player.
     *
     * @param {CameraProperties} camera The camera properties
     * @return {SetCameraPromise}
     */
  }, {
    key: "setCameraProps",
    value: function(t) {
      return this.set("cameraProps", t);
    }
    /**
     * A representation of a chapter.
     *
     * @typedef {Object} VimeoChapter
     * @property {number} startTime The start time of the chapter.
     * @property {object} title The title of the chapter.
     * @property {number} index The place in the order of Chapters. Starts at 1.
     */
    /**
     * A promise to get chapters for the video.
     *
     * @promise GetChaptersPromise
     * @fulfill {VimeoChapter[]} The chapters for the video.
     */
    /**
     * Get an array of all the chapters for the video.
     *
     * @return {GetChaptersPromise}
     */
  }, {
    key: "getChapters",
    value: function() {
      return this.get("chapters");
    }
    /**
     * A promise to get the currently active chapter.
     *
     * @promise GetCurrentChaptersPromise
     * @fulfill {VimeoChapter|undefined} The current chapter for the video.
     */
    /**
     * Get the currently active chapter for the video.
     *
     * @return {GetCurrentChaptersPromise}
     */
  }, {
    key: "getCurrentChapter",
    value: function() {
      return this.get("currentChapter");
    }
    /**
     * A promise to get the accent color of the player.
     *
     * @promise GetColorPromise
     * @fulfill {string} The hex color of the player.
     */
    /**
     * Get the accent color for this player. Note this is deprecated in place of `getColorTwo`.
     *
     * @return {GetColorPromise}
     */
  }, {
    key: "getColor",
    value: function() {
      return this.get("color");
    }
    /**
     * A promise to get all colors for the player in an array.
     *
     * @promise GetColorsPromise
     * @fulfill {string[]} The hex colors of the player.
     */
    /**
     * Get all the colors for this player in an array: [colorOne, colorTwo, colorThree, colorFour]
     *
     * @return {GetColorPromise}
     */
  }, {
    key: "getColors",
    value: function() {
      return U.all([this.get("colorOne"), this.get("colorTwo"), this.get("colorThree"), this.get("colorFour")]);
    }
    /**
     * A promise to set the accent color of the player.
     *
     * @promise SetColorPromise
     * @fulfill {string} The color was successfully set.
     * @reject {TypeError} The string was not a valid hex or rgb color.
     * @reject {ContrastError} The color was set, but the contrast is
     *         outside of the acceptable range.
     * @reject {EmbedSettingsError} The owner of the player has chosen to
     *         use a specific color.
     */
    /**
     * Set the accent color of this player to a hex or rgb string. Setting the
     * color may fail if the owner of the video has set their embed
     * preferences to force a specific color.
     * Note this is deprecated in place of `setColorTwo`.
     *
     * @param {string} color The hex or rgb color string to set.
     * @return {SetColorPromise}
     */
  }, {
    key: "setColor",
    value: function(t) {
      return this.set("color", t);
    }
    /**
     * A promise to set all colors for the player.
     *
     * @promise SetColorsPromise
     * @fulfill {string[]} The colors were successfully set.
     * @reject {TypeError} The string was not a valid hex or rgb color.
     * @reject {ContrastError} The color was set, but the contrast is
     *         outside of the acceptable range.
     * @reject {EmbedSettingsError} The owner of the player has chosen to
     *         use a specific color.
     */
    /**
     * Set the colors of this player to a hex or rgb string. Setting the
     * color may fail if the owner of the video has set their embed
     * preferences to force a specific color.
     * The colors should be passed in as an array: [colorOne, colorTwo, colorThree, colorFour].
     * If a color should not be set, the index in the array can be left as null.
     *
     * @param {string[]} colors Array of the hex or rgb color strings to set.
     * @return {SetColorsPromise}
     */
  }, {
    key: "setColors",
    value: function(t) {
      if (!Array.isArray(t))
        return new U(function(i, a) {
          return a(new TypeError("Argument must be an array."));
        });
      var n = new U(function(i) {
        return i(null);
      }), o = [t[0] ? this.set("colorOne", t[0]) : n, t[1] ? this.set("colorTwo", t[1]) : n, t[2] ? this.set("colorThree", t[2]) : n, t[3] ? this.set("colorFour", t[3]) : n];
      return U.all(o);
    }
    /**
     * A representation of a cue point.
     *
     * @typedef {Object} VimeoCuePoint
     * @property {number} time The time of the cue point.
     * @property {object} data The data passed when adding the cue point.
     * @property {string} id The unique id for use with removeCuePoint.
     */
    /**
     * A promise to get the cue points of a video.
     *
     * @promise GetCuePointsPromise
     * @fulfill {VimeoCuePoint[]} The cue points added to the video.
     * @reject {UnsupportedError} Cue points are not supported with the current
     *         player or browser.
     */
    /**
     * Get an array of the cue points added to the video.
     *
     * @return {GetCuePointsPromise}
     */
  }, {
    key: "getCuePoints",
    value: function() {
      return this.get("cuePoints");
    }
    /**
     * A promise to get the current time of the video.
     *
     * @promise GetCurrentTimePromise
     * @fulfill {number} The current time in seconds.
     */
    /**
     * Get the current playback position in seconds.
     *
     * @return {GetCurrentTimePromise}
     */
  }, {
    key: "getCurrentTime",
    value: function() {
      return this.get("currentTime");
    }
    /**
     * A promise to set the current time of the video.
     *
     * @promise SetCurrentTimePromise
     * @fulfill {number} The actual current time that was set.
     * @reject {RangeError} the time was less than 0 or greater than the
     *         video’s duration.
     */
    /**
     * Set the current playback position in seconds. If the player was
     * paused, it will remain paused. Likewise, if the player was playing,
     * it will resume playing once the video has buffered.
     *
     * You can provide an accurate time and the player will attempt to seek
     * to as close to that time as possible. The exact time will be the
     * fulfilled value of the promise.
     *
     * @param {number} currentTime
     * @return {SetCurrentTimePromise}
     */
  }, {
    key: "setCurrentTime",
    value: function(t) {
      return this.set("currentTime", t);
    }
    /**
     * A promise to get the duration of the video.
     *
     * @promise GetDurationPromise
     * @fulfill {number} The duration in seconds.
     */
    /**
     * Get the duration of the video in seconds. It will be rounded to the
     * nearest second before playback begins, and to the nearest thousandth
     * of a second after playback begins.
     *
     * @return {GetDurationPromise}
     */
  }, {
    key: "getDuration",
    value: function() {
      return this.get("duration");
    }
    /**
     * A promise to get the ended state of the video.
     *
     * @promise GetEndedPromise
     * @fulfill {boolean} Whether or not the video has ended.
     */
    /**
     * Get the ended state of the video. The video has ended if
     * `currentTime === duration`.
     *
     * @return {GetEndedPromise}
     */
  }, {
    key: "getEnded",
    value: function() {
      return this.get("ended");
    }
    /**
     * A promise to get the loop state of the player.
     *
     * @promise GetLoopPromise
     * @fulfill {boolean} Whether or not the player is set to loop.
     */
    /**
     * Get the loop state of the player.
     *
     * @return {GetLoopPromise}
     */
  }, {
    key: "getLoop",
    value: function() {
      return this.get("loop");
    }
    /**
     * A promise to set the loop state of the player.
     *
     * @promise SetLoopPromise
     * @fulfill {boolean} The loop state that was set.
     */
    /**
     * Set the loop state of the player. When set to `true`, the player
     * will start over immediately once playback ends.
     *
     * @param {boolean} loop
     * @return {SetLoopPromise}
     */
  }, {
    key: "setLoop",
    value: function(t) {
      return this.set("loop", t);
    }
    /**
     * A promise to set the muted state of the player.
     *
     * @promise SetMutedPromise
     * @fulfill {boolean} The muted state that was set.
     */
    /**
     * Set the muted state of the player. When set to `true`, the player
     * volume will be muted.
     *
     * @param {boolean} muted
     * @return {SetMutedPromise}
     */
  }, {
    key: "setMuted",
    value: function(t) {
      return this.set("muted", t);
    }
    /**
     * A promise to get the muted state of the player.
     *
     * @promise GetMutedPromise
     * @fulfill {boolean} Whether or not the player is muted.
     */
    /**
     * Get the muted state of the player.
     *
     * @return {GetMutedPromise}
     */
  }, {
    key: "getMuted",
    value: function() {
      return this.get("muted");
    }
    /**
     * A promise to get the paused state of the player.
     *
     * @promise GetLoopPromise
     * @fulfill {boolean} Whether or not the video is paused.
     */
    /**
     * Get the paused state of the player.
     *
     * @return {GetLoopPromise}
     */
  }, {
    key: "getPaused",
    value: function() {
      return this.get("paused");
    }
    /**
     * A promise to get the playback rate of the player.
     *
     * @promise GetPlaybackRatePromise
     * @fulfill {number} The playback rate of the player on a scale from 0 to 2.
     */
    /**
     * Get the playback rate of the player on a scale from `0` to `2`.
     *
     * @return {GetPlaybackRatePromise}
     */
  }, {
    key: "getPlaybackRate",
    value: function() {
      return this.get("playbackRate");
    }
    /**
     * A promise to set the playbackrate of the player.
     *
     * @promise SetPlaybackRatePromise
     * @fulfill {number} The playback rate was set.
     * @reject {RangeError} The playback rate was less than 0 or greater than 2.
     */
    /**
     * Set the playback rate of the player on a scale from `0` to `2`. When set
     * via the API, the playback rate will not be synchronized to other
     * players or stored as the viewer's preference.
     *
     * @param {number} playbackRate
     * @return {SetPlaybackRatePromise}
     */
  }, {
    key: "setPlaybackRate",
    value: function(t) {
      return this.set("playbackRate", t);
    }
    /**
     * A promise to get the played property of the video.
     *
     * @promise GetPlayedPromise
     * @fulfill {Array} Played Timeranges converted to an Array.
     */
    /**
     * Get the played property of the video.
     *
     * @return {GetPlayedPromise}
     */
  }, {
    key: "getPlayed",
    value: function() {
      return this.get("played");
    }
    /**
     * A promise to get the qualities available of the current video.
     *
     * @promise GetQualitiesPromise
     * @fulfill {Array} The qualities of the video.
     */
    /**
     * Get the qualities of the current video.
     *
     * @return {GetQualitiesPromise}
     */
  }, {
    key: "getQualities",
    value: function() {
      return this.get("qualities");
    }
    /**
     * A promise to get the current set quality of the video.
     *
     * @promise GetQualityPromise
     * @fulfill {string} The current set quality.
     */
    /**
     * Get the current set quality of the video.
     *
     * @return {GetQualityPromise}
     */
  }, {
    key: "getQuality",
    value: function() {
      return this.get("quality");
    }
    /**
     * A promise to set the video quality.
     *
     * @promise SetQualityPromise
     * @fulfill {number} The quality was set.
     * @reject {RangeError} The quality is not available.
     */
    /**
     * Set a video quality.
     *
     * @param {string} quality
     * @return {SetQualityPromise}
     */
  }, {
    key: "setQuality",
    value: function(t) {
      return this.set("quality", t);
    }
    /**
     * A promise to get the remote playback availability.
     *
     * @promise RemotePlaybackAvailabilityPromise
     * @fulfill {boolean} Whether remote playback is available.
     */
    /**
     * Get the availability of remote playback.
     *
     * @return {RemotePlaybackAvailabilityPromise}
     */
  }, {
    key: "getRemotePlaybackAvailability",
    value: function() {
      return this.get("remotePlaybackAvailability");
    }
    /**
     * A promise to get the current remote playback state.
     *
     * @promise RemotePlaybackStatePromise
     * @fulfill {string} The state of the remote playback: connecting, connected, or disconnected.
     */
    /**
     * Get the current remote playback state.
     *
     * @return {RemotePlaybackStatePromise}
     */
  }, {
    key: "getRemotePlaybackState",
    value: function() {
      return this.get("remotePlaybackState");
    }
    /**
     * A promise to get the seekable property of the video.
     *
     * @promise GetSeekablePromise
     * @fulfill {Array} Seekable Timeranges converted to an Array.
     */
    /**
     * Get the seekable property of the video.
     *
     * @return {GetSeekablePromise}
     */
  }, {
    key: "getSeekable",
    value: function() {
      return this.get("seekable");
    }
    /**
     * A promise to get the seeking property of the player.
     *
     * @promise GetSeekingPromise
     * @fulfill {boolean} Whether or not the player is currently seeking.
     */
    /**
     * Get if the player is currently seeking.
     *
     * @return {GetSeekingPromise}
     */
  }, {
    key: "getSeeking",
    value: function() {
      return this.get("seeking");
    }
    /**
     * A promise to get the text tracks of a video.
     *
     * @promise GetTextTracksPromise
     * @fulfill {VimeoTextTrack[]} The text tracks associated with the video.
     */
    /**
     * Get an array of the text tracks that exist for the video.
     *
     * @return {GetTextTracksPromise}
     */
  }, {
    key: "getTextTracks",
    value: function() {
      return this.get("textTracks");
    }
    /**
     * A promise to get the embed code for the video.
     *
     * @promise GetVideoEmbedCodePromise
     * @fulfill {string} The `<iframe>` embed code for the video.
     */
    /**
     * Get the `<iframe>` embed code for the video.
     *
     * @return {GetVideoEmbedCodePromise}
     */
  }, {
    key: "getVideoEmbedCode",
    value: function() {
      return this.get("videoEmbedCode");
    }
    /**
     * A promise to get the id of the video.
     *
     * @promise GetVideoIdPromise
     * @fulfill {number} The id of the video.
     */
    /**
     * Get the id of the video.
     *
     * @return {GetVideoIdPromise}
     */
  }, {
    key: "getVideoId",
    value: function() {
      return this.get("videoId");
    }
    /**
     * A promise to get the title of the video.
     *
     * @promise GetVideoTitlePromise
     * @fulfill {number} The title of the video.
     */
    /**
     * Get the title of the video.
     *
     * @return {GetVideoTitlePromise}
     */
  }, {
    key: "getVideoTitle",
    value: function() {
      return this.get("videoTitle");
    }
    /**
     * A promise to get the native width of the video.
     *
     * @promise GetVideoWidthPromise
     * @fulfill {number} The native width of the video.
     */
    /**
     * Get the native width of the currently‐playing video. The width of
     * the highest‐resolution available will be used before playback begins.
     *
     * @return {GetVideoWidthPromise}
     */
  }, {
    key: "getVideoWidth",
    value: function() {
      return this.get("videoWidth");
    }
    /**
     * A promise to get the native height of the video.
     *
     * @promise GetVideoHeightPromise
     * @fulfill {number} The native height of the video.
     */
    /**
     * Get the native height of the currently‐playing video. The height of
     * the highest‐resolution available will be used before playback begins.
     *
     * @return {GetVideoHeightPromise}
     */
  }, {
    key: "getVideoHeight",
    value: function() {
      return this.get("videoHeight");
    }
    /**
     * A promise to get the vimeo.com url for the video.
     *
     * @promise GetVideoUrlPromise
     * @fulfill {number} The vimeo.com url for the video.
     * @reject {PrivacyError} The url isn’t available because of the video’s privacy setting.
     */
    /**
     * Get the vimeo.com url for the video.
     *
     * @return {GetVideoUrlPromise}
     */
  }, {
    key: "getVideoUrl",
    value: function() {
      return this.get("videoUrl");
    }
    /**
     * A promise to get the volume level of the player.
     *
     * @promise GetVolumePromise
     * @fulfill {number} The volume level of the player on a scale from 0 to 1.
     */
    /**
     * Get the current volume level of the player on a scale from `0` to `1`.
     *
     * Most mobile devices do not support an independent volume from the
     * system volume. In those cases, this method will always return `1`.
     *
     * @return {GetVolumePromise}
     */
  }, {
    key: "getVolume",
    value: function() {
      return this.get("volume");
    }
    /**
     * A promise to set the volume level of the player.
     *
     * @promise SetVolumePromise
     * @fulfill {number} The volume was set.
     * @reject {RangeError} The volume was less than 0 or greater than 1.
     */
    /**
     * Set the volume of the player on a scale from `0` to `1`. When set
     * via the API, the volume level will not be synchronized to other
     * players or stored as the viewer’s preference.
     *
     * Most mobile devices do not support setting the volume. An error will
     * *not* be triggered in that situation.
     *
     * @param {number} volume
     * @return {SetVolumePromise}
     */
  }, {
    key: "setVolume",
    value: function(t) {
      return this.set("volume", t);
    }
    /** @typedef {import('./lib/timing-object.types').TimingObject} TimingObject */
    /** @typedef {import('./lib/timing-src-connector.types').TimingSrcConnectorOptions} TimingSrcConnectorOptions */
    /** @typedef {import('./lib/timing-src-connector').TimingSrcConnector} TimingSrcConnector */
    /**
     * Connects a TimingObject to the video player (https://webtiming.github.io/timingobject/)
     *
     * @param {TimingObject} timingObject
     * @param {TimingSrcConnectorOptions} options
     *
     * @return {Promise<TimingSrcConnector>}
     */
  }, {
    key: "setTimingSrc",
    value: function() {
      var e = X(/* @__PURE__ */ L().mark(function n(o, i) {
        var a = this, s;
        return L().wrap(function(c) {
          for (; ; ) switch (c.prev = c.next) {
            case 0:
              if (o) {
                c.next = 2;
                break;
              }
              throw new TypeError("A Timing Object must be provided.");
            case 2:
              return c.next = 4, this.ready();
            case 4:
              return s = new Jr(this, o, i), K(this, "notifyTimingObjectConnect"), s.addEventListener("disconnect", function() {
                return K(a, "notifyTimingObjectDisconnect");
              }), c.abrupt("return", s);
            case 8:
            case "end":
              return c.stop();
          }
        }, n, this);
      }));
      function t(n, o) {
        return e.apply(this, arguments);
      }
      return t;
    }()
  }]), r;
}();
kt || (D = Qr(), Gr(), Wr(), Br(), Yr());
function Kr(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var Ne = { exports: {} }, St;
/**
* @link https://github.com/gajus/sister for the canonical source repository
* @license https://github.com/gajus/sister/blob/master/LICENSE BSD 3-Clause
*/
St = function() {
  var r = {}, e = {};
  return r.on = function(t, n) {
    var o = { name: t, handler: n };
    return e[t] = e[t] || [], e[t].unshift(o), o;
  }, r.off = function(t) {
    var n = e[t.name].indexOf(t);
    n !== -1 && e[t.name].splice(n, 1);
  }, r.trigger = function(t, n) {
    var o = e[t], i;
    if (o)
      for (i = o.length; i--; )
        o[i].handler(n);
  }, r;
};
var Xr = St, ze = { exports: {} }, Ie = { exports: {} }, $e, st;
function Zr() {
  if (st) return $e;
  st = 1;
  var r = 1e3, e = r * 60, t = e * 60, n = t * 24, o = n * 7, i = n * 365.25;
  $e = function(l, d) {
    d = d || {};
    var h = typeof l;
    if (h === "string" && l.length > 0)
      return a(l);
    if (h === "number" && isFinite(l))
      return d.long ? u(l) : s(l);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(l)
    );
  };
  function a(l) {
    if (l = String(l), !(l.length > 100)) {
      var d = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        l
      );
      if (d) {
        var h = parseFloat(d[1]), v = (d[2] || "ms").toLowerCase();
        switch (v) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return h * i;
          case "weeks":
          case "week":
          case "w":
            return h * o;
          case "days":
          case "day":
          case "d":
            return h * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return h * t;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return h * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return h * r;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return h;
          default:
            return;
        }
      }
    }
  }
  function s(l) {
    var d = Math.abs(l);
    return d >= n ? Math.round(l / n) + "d" : d >= t ? Math.round(l / t) + "h" : d >= e ? Math.round(l / e) + "m" : d >= r ? Math.round(l / r) + "s" : l + "ms";
  }
  function u(l) {
    var d = Math.abs(l);
    return d >= n ? c(l, d, n, "day") : d >= t ? c(l, d, t, "hour") : d >= e ? c(l, d, e, "minute") : d >= r ? c(l, d, r, "second") : l + " ms";
  }
  function c(l, d, h, v) {
    var w = d >= h * 1.5;
    return Math.round(l / h) + " " + v + (w ? "s" : "");
  }
  return $e;
}
function en(r) {
  t.debug = t, t.default = t, t.coerce = u, t.disable = i, t.enable = o, t.enabled = a, t.humanize = Zr(), t.destroy = c, Object.keys(r).forEach((l) => {
    t[l] = r[l];
  }), t.names = [], t.skips = [], t.formatters = {};
  function e(l) {
    let d = 0;
    for (let h = 0; h < l.length; h++)
      d = (d << 5) - d + l.charCodeAt(h), d |= 0;
    return t.colors[Math.abs(d) % t.colors.length];
  }
  t.selectColor = e;
  function t(l) {
    let d, h = null, v, w;
    function C(...k) {
      if (!C.enabled)
        return;
      const S = C, g = Number(/* @__PURE__ */ new Date()), m = g - (d || g);
      S.diff = m, S.prev = d, S.curr = g, d = g, k[0] = t.coerce(k[0]), typeof k[0] != "string" && k.unshift("%O");
      let y = 0;
      k[0] = k[0].replace(/%([a-zA-Z%])/g, (_, A) => {
        if (_ === "%%")
          return "%";
        y++;
        const P = t.formatters[A];
        if (typeof P == "function") {
          const R = k[y];
          _ = P.call(S, R), k.splice(y, 1), y--;
        }
        return _;
      }), t.formatArgs.call(S, k), (S.log || t.log).apply(S, k);
    }
    return C.namespace = l, C.useColors = t.useColors(), C.color = t.selectColor(l), C.extend = n, C.destroy = t.destroy, Object.defineProperty(C, "enabled", {
      enumerable: true,
      configurable: false,
      get: () => h !== null ? h : (v !== t.namespaces && (v = t.namespaces, w = t.enabled(l)), w),
      set: (k) => {
        h = k;
      }
    }), typeof t.init == "function" && t.init(C), C;
  }
  function n(l, d) {
    const h = t(this.namespace + (typeof d > "u" ? ":" : d) + l);
    return h.log = this.log, h;
  }
  function o(l) {
    t.save(l), t.namespaces = l, t.names = [], t.skips = [];
    let d;
    const h = (typeof l == "string" ? l : "").split(/[\s,]+/), v = h.length;
    for (d = 0; d < v; d++)
      h[d] && (l = h[d].replace(/\*/g, ".*?"), l[0] === "-" ? t.skips.push(new RegExp("^" + l.slice(1) + "$")) : t.names.push(new RegExp("^" + l + "$")));
  }
  function i() {
    const l = [
      ...t.names.map(s),
      ...t.skips.map(s).map((d) => "-" + d)
    ].join(",");
    return t.enable(""), l;
  }
  function a(l) {
    if (l[l.length - 1] === "*")
      return true;
    let d, h;
    for (d = 0, h = t.skips.length; d < h; d++)
      if (t.skips[d].test(l))
        return false;
    for (d = 0, h = t.names.length; d < h; d++)
      if (t.names[d].test(l))
        return true;
    return false;
  }
  function s(l) {
    return l.toString().substring(2, l.toString().length - 2).replace(/\.\*\?$/, "*");
  }
  function u(l) {
    return l instanceof Error ? l.stack || l.message : l;
  }
  function c() {
    console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
  }
  return t.enable(t.load()), t;
}
var tn = en;
(function(r, e) {
  e.formatArgs = n, e.save = o, e.load = i, e.useColors = t, e.storage = a(), e.destroy = /* @__PURE__ */ (() => {
    let u = false;
    return () => {
      u || (u = true, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
    };
  })(), e.colors = [
    "#0000CC",
    "#0000FF",
    "#0033CC",
    "#0033FF",
    "#0066CC",
    "#0066FF",
    "#0099CC",
    "#0099FF",
    "#00CC00",
    "#00CC33",
    "#00CC66",
    "#00CC99",
    "#00CCCC",
    "#00CCFF",
    "#3300CC",
    "#3300FF",
    "#3333CC",
    "#3333FF",
    "#3366CC",
    "#3366FF",
    "#3399CC",
    "#3399FF",
    "#33CC00",
    "#33CC33",
    "#33CC66",
    "#33CC99",
    "#33CCCC",
    "#33CCFF",
    "#6600CC",
    "#6600FF",
    "#6633CC",
    "#6633FF",
    "#66CC00",
    "#66CC33",
    "#9900CC",
    "#9900FF",
    "#9933CC",
    "#9933FF",
    "#99CC00",
    "#99CC33",
    "#CC0000",
    "#CC0033",
    "#CC0066",
    "#CC0099",
    "#CC00CC",
    "#CC00FF",
    "#CC3300",
    "#CC3333",
    "#CC3366",
    "#CC3399",
    "#CC33CC",
    "#CC33FF",
    "#CC6600",
    "#CC6633",
    "#CC9900",
    "#CC9933",
    "#CCCC00",
    "#CCCC33",
    "#FF0000",
    "#FF0033",
    "#FF0066",
    "#FF0099",
    "#FF00CC",
    "#FF00FF",
    "#FF3300",
    "#FF3333",
    "#FF3366",
    "#FF3399",
    "#FF33CC",
    "#FF33FF",
    "#FF6600",
    "#FF6633",
    "#FF9900",
    "#FF9933",
    "#FFCC00",
    "#FFCC33"
  ];
  function t() {
    return typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs) ? true : typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/) ? false : typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
    typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
    typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  }
  function n(u) {
    if (u[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + u[0] + (this.useColors ? "%c " : " ") + "+" + r.exports.humanize(this.diff), !this.useColors)
      return;
    const c = "color: " + this.color;
    u.splice(1, 0, c, "color: inherit");
    let l = 0, d = 0;
    u[0].replace(/%[a-zA-Z%]/g, (h) => {
      h !== "%%" && (l++, h === "%c" && (d = l));
    }), u.splice(d, 0, c);
  }
  e.log = console.debug || console.log || (() => {
  });
  function o(u) {
    try {
      u ? e.storage.setItem("debug", u) : e.storage.removeItem("debug");
    } catch {
    }
  }
  function i() {
    let u;
    try {
      u = e.storage.getItem("debug");
    } catch {
    }
    return !u && typeof process < "u" && "env" in process && (u = define_process_env_default.DEBUG), u;
  }
  function a() {
    try {
      return localStorage;
    } catch {
    }
  }
  r.exports = tn(e);
  const { formatters: s } = r.exports;
  s.j = function(u) {
    try {
      return JSON.stringify(u);
    } catch (c) {
      return "[UnexpectedJSONParseError]: " + c.message;
    }
  };
})(Ie, Ie.exports);
var rn = Ie.exports, Le = { exports: {} }, Ve = { exports: {} };
(function(r, e) {
  Object.defineProperty(e, "__esModule", {
    value: true
  }), e.default = {
    BUFFERING: 3,
    ENDED: 0,
    PAUSED: 2,
    PLAYING: 1,
    UNSTARTED: -1,
    VIDEO_CUED: 5
  }, r.exports = e.default;
})(Ve, Ve.exports);
var nn = Ve.exports;
(function(r, e) {
  Object.defineProperty(e, "__esModule", {
    value: true
  });
  var t = nn, n = o(t);
  function o(i) {
    return i && i.__esModule ? i : { default: i };
  }
  e.default = {
    pauseVideo: {
      acceptableStates: [n.default.ENDED, n.default.PAUSED],
      stateChangeRequired: false
    },
    playVideo: {
      acceptableStates: [n.default.ENDED, n.default.PLAYING],
      stateChangeRequired: false
    },
    seekTo: {
      acceptableStates: [n.default.ENDED, n.default.PLAYING, n.default.PAUSED],
      stateChangeRequired: true,
      // TRICKY: `seekTo` may not cause a state change if no buffering is
      // required.
      // eslint-disable-next-line unicorn/numeric-separators-style
      timeout: 3e3
    }
  }, r.exports = e.default;
})(Le, Le.exports);
var on = Le.exports, De = { exports: {} };
(function(r, e) {
  Object.defineProperty(e, "__esModule", {
    value: true
  }), e.default = ["ready", "stateChange", "playbackQualityChange", "playbackRateChange", "error", "apiChange", "volumeChange"], r.exports = e.default;
})(De, De.exports);
var an = De.exports, Ue = { exports: {} };
(function(r, e) {
  Object.defineProperty(e, "__esModule", {
    value: true
  }), e.default = ["cueVideoById", "loadVideoById", "cueVideoByUrl", "loadVideoByUrl", "playVideo", "pauseVideo", "stopVideo", "getVideoLoadedFraction", "cuePlaylist", "loadPlaylist", "nextVideo", "previousVideo", "playVideoAt", "setShuffle", "setLoop", "getPlaylist", "getPlaylistIndex", "setOption", "mute", "unMute", "isMuted", "setVolume", "getVolume", "seekTo", "getPlayerState", "getPlaybackRate", "setPlaybackRate", "getAvailablePlaybackRates", "getPlaybackQuality", "setPlaybackQuality", "getAvailableQualityLevels", "getCurrentTime", "getDuration", "removeEventListener", "getVideoUrl", "getVideoEmbedCode", "getOptions", "getOption", "addEventListener", "destroy", "setSize", "getIframe", "getSphericalProperties", "setSphericalProperties"], r.exports = e.default;
})(Ue, Ue.exports);
var sn = Ue.exports;
(function(r, e) {
  Object.defineProperty(e, "__esModule", {
    value: true
  });
  var t = rn, n = l(t), o = on, i = l(o), a = an, s = l(a), u = sn, c = l(u);
  function l(v) {
    return v && v.__esModule ? v : { default: v };
  }
  const d = (0, n.default)("youtube-player"), h = {};
  h.proxyEvents = (v) => {
    const w = {};
    for (const C of s.default) {
      const k = "on" + C.slice(0, 1).toUpperCase() + C.slice(1);
      w[k] = (S) => {
        d('event "%s"', k, S), v.trigger(C, S);
      };
    }
    return w;
  }, h.promisifyPlayer = (v, w = false) => {
    const C = {};
    for (const k of c.default)
      w && i.default[k] ? C[k] = (...S) => v.then((g) => {
        const m = i.default[k], y = g.getPlayerState(), E = g[k].apply(g, S);
        return m.stateChangeRequired || // eslint-disable-next-line no-extra-parens
        Array.isArray(m.acceptableStates) && !m.acceptableStates.includes(y) ? new Promise((_) => {
          const A = () => {
            const P = g.getPlayerState();
            let R;
            typeof m.timeout == "number" && (R = setTimeout(() => {
              g.removeEventListener("onStateChange", A), _();
            }, m.timeout)), Array.isArray(m.acceptableStates) && m.acceptableStates.includes(P) && (g.removeEventListener("onStateChange", A), clearTimeout(R), _());
          };
          g.addEventListener("onStateChange", A);
        }).then(() => E) : E;
      }) : C[k] = (...S) => v.then((g) => g[k].apply(g, S));
    return C;
  }, e.default = h, r.exports = e.default;
})(ze, ze.exports);
var ln = ze.exports, qe = { exports: {} }, cn = function(e, t, n) {
  var o = document.head || document.getElementsByTagName("head")[0], i = document.createElement("script");
  typeof t == "function" && (n = t, t = {}), t = t || {}, n = n || function() {
  }, i.type = t.type || "text/javascript", i.charset = t.charset || "utf8", i.async = "async" in t ? !!t.async : true, i.src = e, t.attrs && un(i, t.attrs), t.text && (i.text = "" + t.text);
  var a = "onload" in i ? lt : dn;
  a(i, n), i.onload || lt(i, n), o.appendChild(i);
};
function un(r, e) {
  for (var t in e)
    r.setAttribute(t, e[t]);
}
function lt(r, e) {
  r.onload = function() {
    this.onerror = this.onload = null, e(null, r);
  }, r.onerror = function() {
    this.onerror = this.onload = null, e(new Error("Failed to load " + this.src), r);
  };
}
function dn(r, e) {
  r.onreadystatechange = function() {
    this.readyState != "complete" && this.readyState != "loaded" || (this.onreadystatechange = null, e(null, r));
  };
}
(function(r, e) {
  Object.defineProperty(e, "__esModule", {
    value: true
  });
  var t = cn, n = o(t);
  function o(i) {
    return i && i.__esModule ? i : { default: i };
  }
  e.default = (i) => new Promise((s) => {
    if (window.YT && window.YT.Player && window.YT.Player instanceof Function) {
      s(window.YT);
      return;
    } else {
      const c = window.location.protocol === "http:" ? "http:" : "https:";
      (0, n.default)(c + "//www.youtube.com/iframe_api", (l) => {
        l && i.trigger("error", l);
      });
    }
    const u = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      u && u(), s(window.YT);
    };
  }), r.exports = e.default;
})(qe, qe.exports);
var fn = qe.exports;
(function(r, e) {
  Object.defineProperty(e, "__esModule", {
    value: true
  });
  var t = Xr, n = u(t), o = ln, i = u(o), a = fn, s = u(a);
  function u(l) {
    return l && l.__esModule ? l : { default: l };
  }
  let c;
  e.default = (l, d = {}, h = false) => {
    const v = (0, n.default)();
    if (c || (c = (0, s.default)(v)), d.events)
      throw new Error("Event handlers cannot be overwritten.");
    if (typeof l == "string" && !document.getElementById(l))
      throw new Error('Element "' + l + '" does not exist.');
    d.events = i.default.proxyEvents(v);
    const w = new Promise((k) => {
      typeof l == "object" && l.playVideo instanceof Function ? k(l) : c.then((S) => {
        const g = new S.Player(l, d);
        return v.on("ready", () => {
          k(g);
        }), null;
      });
    }), C = i.default.promisifyPlayer(w, h);
    return C.on = v.on, C.off = v.off, C;
  }, r.exports = e.default;
})(Ne, Ne.exports);
var pn = Ne.exports;
const hn = /* @__PURE__ */ Kr(pn), gn = `:host iframe{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;background-color:transparent;height:100%}:host .video-play{background-image:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="49" fill="%238885e7"/><path fill="%23fff" d="M74.1 50.2 34.9 73.7V26.6z"/></svg>')}`;
var mn = Object.defineProperty, bn = Object.getOwnPropertyDescriptor, ve = (r, e, t, n) => {
  for (var o = n > 1 ? void 0 : n ? bn(e, t) : e, i = r.length - 1, a; i >= 0; i--)
    (a = r[i]) && (o = (n ? a(e, t, o) : a(o)) || o);
  return n && o && mn(e, t, o), o;
};
let ae = class extends Te(gn) {
  constructor() {
    super(...arguments), this.videoid = "", this.playlistid = "", this.vimeo = false, this._player = "", this._handleKeyDown = (r) => {
      (r.key === "Enter" || r.key === " ") && this._loadYoutubeVideo(r);
    }, this._handlePauseVideo = (r) => {
      this.closest(`#${r.detail}`) !== null && typeof this._player < "u" && (this.vimeo ?? false ? this._player.pause() : this._player.pauseVideo());
    };
  }
  // Add event listener to document
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("keydown", this._handleKeyDown), window.addEventListener("pausevideo", this._handlePauseVideo);
  }
  // Remove event listener from document
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("keydown", this._handleKeyDown), window.removeEventListener("pausevideo", this._handlePauseVideo);
  }
  // Call load vimeo on first render.
  firstUpdated() {
    (this.vimeo ?? false) && this._loadVimeoVideo();
  }
  /**
   * Render youTube poster
   *
   * @returns {TemplateResult}
   */
  youtubeTemplate() {
    return html`
      <div id="ecu-yt"
        @click=${this._loadYoutubeVideo}
        class="relative pb-[56.25%] h-0 w-full overflow-hidden"
      >
        <div>
          <img
            src="//i.ytimg.com/vi/${this.videoid}/sddefault.jpg"
            class="absolute block inset-0 w-full h-full object-cover cursor-pointer transition-all hover:brightness-75"
            alt=""
            aria-hidden="true"
          >
          <div class="absolute top-1/2 left-1/2 h-16 w-16 cursor-pointer -mt-8 -ml-8 video-play"></div>
        </div>
      </div>
    `;
  }
  /**
   * Render youTube poster
   *
   * @returns {TemplateResult}
   */
  vimeoTemplate() {
    return html`
      <div
        id="ecu-vimeo"
        class="relative pb-[56.25%] h-0 w-full overflow-hidden"
      ></div>
    `;
  }
  /**
   * Render accordion element
   *
   * @returns {TemplateResult}
   */
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  render() {
    return html`
      ${this.vimeo ?? false ? this.vimeoTemplate() : this.youtubeTemplate()}
      <slot></slot>
    `;
  }
  /**
   * Load YT video and events
   * @param e Event
   */
  _loadYoutubeVideo(r) {
    const e = this.shadowRoot.querySelector("#ecu-yt > div"), t = window.location, n = t.protocol + "//" + t.host, o = {
      rel: 0,
      origin: n,
      host: n,
      listType: this.playlistid !== "" ? "playlist" : null,
      list: this.playlistid !== "" ? this.playlistid : null
    };
    this._player = hn(e, {
      videoId: this.videoid,
      playerVars: o
    }), this._player.playVideo(), this._player.on("stateChange", (i) => {
      const a = i.data;
      a === 0 ? Y.log("stopped") : a === 1 ? Y.log("play") : a === 2 && Y.log("pause");
    });
  }
  /**
   * Load Vimeo video and events
   */
  _loadVimeoVideo() {
    const r = this.shadowRoot.getElementById("ecu-vimeo");
    Y.log(r), this._player = new He(r, {
      id: this.videoid
    }), this._player.on("play", (e) => {
      Y.log("play");
    }), this._player.on("pause", (e) => {
      Y.log("pause");
    });
  }
};
ve([
  V({ type: String })
], ae.prototype, "videoid", 2);
ve([
  V({ type: String })
], ae.prototype, "playlistid", 2);
ve([
  V({ type: Boolean })
], ae.prototype, "vimeo", 2);
ve([
  Vt()
], ae.prototype, "_player", 2);
ae = ve([
  _e("ecu-video")
], ae);
_config.log("main is running");
document.addEventListener("DOMContentLoaded", () => {
  _config.log("DOMContentLoaded");
  const accordionModule = new AccordionModule();
  accordionModule.init();
  const form = document.querySelector("felte-form");
  if (form != null) {
    initForm(form);
  }
});
