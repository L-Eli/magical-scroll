class MagicalScroll {
  static populateNumberValueCallback(currentPosition, positions, values) {
    const index = positions.findIndex((position) => position > currentPosition);
    if (index > 0) {
      const startsFrom = values[index - 1];
      const delta = currentPosition - positions[index - 1];
      const positionRange = positions[index] - positions[index - 1];
      const valueRange = values[index] - values[index - 1];
      return startsFrom + (delta * valueRange) / positionRange;
    }
    if (index === 0) {
      return values[0];
    }
    return values[values.length - 1];
  }

  static populateBooleanValueCallback(currentPosition, positions, values) {
    const index = positions.findIndex((position) => position > currentPosition);
    return index > -1 ? values[index] : values[values.length - 1];
  }

  static populateColorValueCallback(currentPosition, positions, values) {
    const index = positions.findIndex((position) => position > currentPosition);
    if (index > 0) {
      const colorPattern =
        /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?/i;
      const delta = currentPosition - positions[index - 1];
      const positionRange = positions[index] - positions[index - 1];
      const fromColor = values[index - 1].toUpperCase();
      const toColor = values[index].toUpperCase();
      const fromMatches = fromColor.match(colorPattern);
      const [fromR, fromG, fromB, fromA] = fromMatches
        .slice(1, 5)
        .map((value) => (value ? parseInt(value, 16) : 255));
      const toMatches = toColor.match(colorPattern);
      const [toR, toG, toB, toA] = toMatches
        .slice(1, 5)
        .map((value) => (value ? parseInt(value, 16) : 255));
      const valueRangeR = toR - fromR;
      const valueRangeG = toG - fromG;
      const valueRangeB = toB - fromB;
      const valueRangeA = toA - fromA;
      const result = `#${Math.round(
        fromR + (delta * valueRangeR) / positionRange
      )
        .toString(16)
        .padStart(2, "0")}${Math.round(
        fromG + (delta * valueRangeG) / positionRange
      )
        .toString(16)
        .padStart(2, "0")}${Math.round(
        fromB + (delta * valueRangeB) / positionRange
      )
        .toString(16)
        .padStart(2, "0")}${Math.round(
        fromA + (delta * valueRangeA) / positionRange
      )
        .toString(16)
        .padStart(2, "0")}`;
      return result;
    }
    if (index === 0) {
      return values[0];
    }
    return values[values.length - 1];
  }

  static defaultPopulateValueCallback =
    MagicalScroll.populateNumberValueCallback;

  static propertyPopulateCallbacks = {
    display: MagicalScroll.populateBooleanValueCallback,
    visibility: MagicalScroll.populateBooleanValueCallback,
    translateX: MagicalScroll.populateNumberValueCallback,
    translateY: MagicalScroll.populateNumberValueCallback,
    backgroundColor: MagicalScroll.populateColorValueCallback,
    color: MagicalScroll.populateColorValueCallback,
  };

  // effect css utils
  static propertyCssCallbacks = {
    display: (target, _, value) => {
      target.style.display = value ? null : "none";
    },
    visibility: (target, _, value) => {
      target.style.visibility = value ? "visible" : "hidden";
    },
    translateX: (target, _, value) => {
      const translateXPattern = /translateX\([^)]*\)/i;
      const translatePattern = /translate\(([^)]*),\ ?([^)]*)\)/i;
      let translateX = `translateX(${value}px)`;
      if (
        target.style.transform.match(translateXPattern) ||
        target.style.transform.match(translatePattern)
      ) {
        target.style.transform = target.style.transform
          .replace(translateXPattern, `translateX(${value}px)`)
          .replace(translatePattern, `translate($1, ${value}px)`);
      } else {
        target.style.transform += translateX;
      }
    },
    translateY: (target, _, value) => {
      const translateYPattern = /translateY\([^)]*\)/i;
      const translatePattern = /translate\(([^)]*),\ ?([^)]*)\)/i;
      let translateY = `translateY(${value}px)`;
      if (
        target.style.transform.match(translateYPattern) ||
        target.style.transform.match(translatePattern)
      ) {
        target.style.transform = target.style.transform
          .replace(translateYPattern, `translateY(${value}px)`)
          .replace(translatePattern, `translate($1, ${value}px)`);
      } else {
        target.style.transform += translateY;
      }
    },
    left: (target, _, value) => {
      target.style.left = `${value}px`;
    },
    right: (target, _, value) => {
      target.style.right = `${value}px`;
    },
    top: (target, _, value) => {
      target.style.top = `${value}px`;
    },
    bottom: (target, _, value) => {
      target.style.bottom = `${value}px`;
    },
  };

  static defaultPropertyCssCallback = (target, property, value) => {
    target.style[property] = value;
  };

  // support value slug
  static supportValueSlugProperties = {
    left: true,
    right: true,
    top: true,
    bottom: true,
    translateX: true,
    translateY: true,
  };

  static getInstance(options) {
    if (!this.instance) {
      this.instance = new MagicalScroll(options);
    }

    return this.instance;
  }

  constructor(options = {}) {
    this.container =
      document.compatMode === "CSS1Compat"
        ? document.documentElement
        : document.body;
    this.eventContainer = window;
    if (options["target"]) {
      let element =
        typeof options["target"] === "string"
          ? document.querySelector(options["target"])
          : options["target"];
      if (element) {
        this.container = this.eventContainer = element;
      }
    }
    this.scrollTop = 0;
    this.elements = [];

    // resize event
    let timeout = null;
    const resizeObserver = new ResizeObserver(() => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        this.elements.forEach(this.preProcess.bind(this));
        this.refresh();
      }, 16);
    });
    resizeObserver.observe(this.container);

    // scroll event
    this.eventContainer.onscroll = this.refresh.bind(this);
  }

  parseSlug(element, slug, bounds) {
    let ancestorElement = element.target.parentElement;
    let matches = null;
    // TODO: child
    while (
      (matches = slug.match(
        /#ancestorElement(In|Center|Out|Width|Height){(\d+)}/i
      ))
    ) {
      ancestorElement = element.target.parentElement;
      const generations = parseInt(matches[2]);
      for (let i = 1; i < generations; i++) {
        ancestorElement = ancestorElement.parentElement;
      }
      slug = slug.replace(matches[0], `#ancestorElement${matches[1]}`);
    }

    // TODO: https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API
    const ancestorElementBounds = ancestorElement.getBoundingClientRect();

    const scrollWidth = this.container.scrollHeight;
    const scrollHeight = this.container.scrollHeight;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const elementTop = bounds.top + this.scrollTop;
    const elementBottom = elementTop + bounds.height;
    const ancestorElementTop = ancestorElementBounds.top + this.scrollTop;
    const ancestorElementBottom =
      ancestorElementTop + ancestorElementBounds.height;

    return eval(
      slug
        // size
        .replace(/#scrollHeight/g, scrollHeight)
        .replace(/#scrollWidth/g, scrollWidth)
        .replace(/#screenHeight/g, screenHeight)
        .replace(/#screenWidth/g, screenWidth)
        .replace(/#parentElement/g, "#ancestorElement")
        .replace(/#ancestorElementWidth/g, ancestorElementBounds.width)
        .replace(/#ancestorElementHeight/g, ancestorElementBounds.height)
        .replace(/#elementWidth/g, bounds.width)
        .replace(/#elementHeight/g, bounds.height)
        // relative position
        .replace(/#ancestorElementIn/g, ancestorElementTop - screenHeight)
        .replace(
          /#ancestorElementCenter/g,
          ancestorElementTop -
            screenHeight / 2 +
            ancestorElementBounds.height / 2
        )
        .replace(/#ancestorElementOut/g, ancestorElementBottom)
        .replace(/#elementIn/g, elementTop - screenHeight)
        .replace(
          /#elementCenter/g,
          elementTop - screenHeight / 2 + bounds.height / 2
        )
        .replace(/#elementOut/g, elementBottom)
    );
  }

  preProcess(element) {
    const bounds = element.target.getBoundingClientRect();
    Object.entries(element.animations).forEach(([property, animation]) => {
      animation.originalPositions = animation.originalPositions || [
        ...animation.positions,
      ];
      animation.originalPositions.forEach((position, index) => {
        if (typeof position === "string") {
          animation.positions[index] = this.parseSlug(
            element,
            position,
            bounds
          );
        }
      });

      if (MagicalScroll.supportValueSlugProperties[property]) {
        animation.values.forEach((value, index) => {
          if (typeof value === "string") {
            animation.values[index] = this.parseSlug(element, value, bounds);
          }
        });
      }
    });
  }
  addElement(element = {}) {
    if (typeof element.target === "string") {
      element.target = document.querySelector(element.target);
    }

    this.preProcess(element);
    this.elements.push(element);
  }

  registerPropertyPopulateCallback(property, populateCallback) {
    MagicalScroll.propertyPopulateCallbacks[property] = populateCallback;
  }

  registerPropertyCssCallback(property, propertyCssCallback) {
    MagicalScroll.propertyCssCallbacks[property] = propertyCssCallback;
  }

  refresh(initialize = true) {
    if (initialize || this.scrollTop !== this.container.scrollTop) {
      this.scrollTop = this.container.scrollTop;
      this.elements.forEach((element) => {
        Object.entries(element.animations).forEach(([property, animation]) => {
          // populate value;
          let populateValueFunction =
            MagicalScroll.defaultPopulateValueCallback;
          if (animation.populateValueCallback) {
            populateValueFunction = animation.populateValueCallback;
          } else if (
            MagicalScroll.propertyPopulateCallbacks.hasOwnProperty(property)
          ) {
            populateValueFunction =
              MagicalScroll.propertyPopulateCallbacks[property];
          }
          const value = populateValueFunction(
            this.scrollTop,
            animation.positions,
            animation.values
          );

          // effect css
          let cssFunction = MagicalScroll.defaultPropertyCssCallback;
          if (animation.cssCallback) {
            cssFunction = animation.cssCallback;
          } else if (
            MagicalScroll.propertyCssCallbacks.hasOwnProperty(property)
          ) {
            cssFunction = MagicalScroll.propertyCssCallbacks[property];
          }
          cssFunction(element.target, property, value);
        });
      });
    }
  }
}

export default MagicalScroll;
