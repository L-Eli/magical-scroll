type HEX = `#${string}`;
type Color = HEX;

interface ConstructorOptions {
  target: String | HTMLElement;
  animations: unknown;
}

interface targetCallbackNumberType {
  (
    currentPosition: Number,
    positions: Array<Number>,
    values: Array<Number>
  ): Number;
}
interface targetCallbackBooleanType {
  (
    currentPosition: Number,
    positions: Array<Number>,
    values: Array<Boolean>
  ): Boolean;
}
interface targetCallbackHexType {
  (currentPosition: Number, positions: Array<Number>, values: Array<HEX>): HEX;
}
interface valueCallbackStringType {
  (target: HTMLElement, _: any, value: String): void;
}
interface valueCallbackNumberType {
  (target: HTMLElement, _: any, value: Number): void;
}

interface propertyCallbacksType {
  display: targetCallbackBooleanType;
  visibility: targetCallbackBooleanType;
  translateX: targetCallbackNumberType;
  translateY: targetCallbackNumberType;
  backgroundColor: targetCallbackHexType;
  color: targetCallbackHexType;
}
interface propertyCssCallbacksType {
  display: valueCallbackStringType;
  visibility: valueCallbackStringType;
  translateX: valueCallbackNumberType;
  translateY: valueCallbackNumberType;
  left: valueCallbackNumberType;
  right: valueCallbackNumberType;
  top: valueCallbackNumberType;
  bottom: valueCallbackNumberType;
}

declare class MagicalScroll {
  constructor(options?: ConstructorOptions);

  container: HTMLElement;
  eventContainer: Window;

  scrollTop: Number;
  elements: Array<HTMLElement>;

  static defaultPopulateValueCallback: targetCallbackNumberType;
  static propertyPopulateCallbacks: propertyCallbacksType;
  static propertyCssCallbacks: propertyCssCallbacksType;
  static defaultPropertyCssCallback:
    | valueCallbackStringType
    | valueCallbackNumberType;
  static supportValueSlugProperties: Map<String, Boolean>;

  static getInstance(options?: ConstructorOptions): MagicalScroll;

  parseSlug(element: HTMLElement, slug: String, bounds: DOMRect): HTMLElement;
  addElement(element: ConstructorOptions): void;
  registerPropertyPopulateCallback(
    property: String,
    populateCallback:
      | targetCallbackNumberType
      | targetCallbackBooleanType
      | targetCallbackHexType
  ): void;
  registerPropertyCssCallback(
    property: String,
    propertyCssCallback: valueCallbackStringType | valueCallbackNumberType
  ): void;
  refresh(initialize: Boolean): void;

  static populateNumberValueCallback(
    currentPosition: Number,
    positions: Array<Number>,
    values: Array<Number>
  ): Number;

  static populateBooleanValueCallback(
    currentPosition: Number,
    positions: Array<Number>,
    values: Array<Boolean>
  ): Boolean;

  static populateColorValueCallback(
    currentPosition: Number,
    positions: Array<Number>,
    values: Array<Color>
  ): Color;
}
