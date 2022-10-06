# Magical Scroll

## Basic Usage

```javascript=
MagicalScroll.getInstance().addElement({
  target: "#scroll",
  animations: {
    opacity: {
      positions: [0, 100],
      values: [0, 1],
    },
  },
});
```

## Magic Slugs

| Slug | Description |
| - | - |
| #screenWidth | width of the screen |
| #screenHeight | height of the screen |
| #scrollWidth | width of the scroll container |
| #scrollHeight | height of the scroll container |
| #elementWidth | width of the element |
| #elementHeight | height of the element |
| #elementIn | when the element appear at the bottom of the container |
| #elementOut | when the element disappear at the top of the container |
| #elementCenter | when the element is placed center of the container |
| #parentElementWidth | width of the parent element (node) |
| #parentElementHeight | height of the parent element (node) |
| #parentElementIn | when the parent element (node) appear at the bottom of the container |
| #parentElementOut | when the parent element (node) disappear at the top of the container |
| #parentElementCenter | when the parent element (node) is placed center of the container |
| #ancestorElementWidth{1} | width of the ancestor element (node), where `{1}` means the generation(s) |
| #ancestorElementHeight{1} | height of the ancestor element (node), where `{1}` means the generation(s) |
| #ancestorElementIn{1} | when the ancestor element (node) appear at the bottom of the container, where `{1}` means the generation(s) |
| #ancestorElementOut{1} | when the ancestor element (node) disappear at the top of the container, where `{1}` means the generation(s) |
| #ancestorElementCenter{1} | when the ancestor element (node) is placed center of the container, where `{1}` means the generation(s) |

## Built-in Properties

| Name | Description |
| - | - |
| opacity ||
| scale ||
| rotate ||
| translateX ||
| translateY ||
| display | `none` or just nothing |
| visibility | `visible` or `hidden` |
| backgroundColor | calculating within values |
| color | calculating within values |

## Register/Replace your own property

### Register/Replace the value populating callback

```javascript=
const magicalScroll = MagicalScroll.getInstance();
const animationName = "myScrollAnimation";
magicalScroll.registerPropertyPopulateCallback(
  animationName,
  (currentPosition, positions, values) => {
    const index = positions.findIndex((position) => position > currentPosition);
    return index > -1 ? values[index] : values[values.length - 1];
  },
);
```

Explanation

| Name | Meaning |
| - | - |
| currentPosition | current scroll top of the container |
| positions | list of position which are already computed as a number |
| values | list of value |

You can also register a new animation with existed built-in callback

```javascript=
const magicalScroll = MagicalScroll.getInstance();
const animationName = "opacity";
magicalScroll.registerPropertyPopulateCallback(
  animationName,
  MagicalScroll.populateNumberValueCallback,
);
```

### Register/Replace the CSS generation callback

```javascript=
const magicalScroll = MagicalScroll.getInstance();
const animationName = "myScrollAnimation";
magicalScroll.registerPropertyPopulateCallback(
  animationName,
  (target, property, value) => {
    target.style.display = value ? null : "none";
  }
);
```

Explanation

| Name | Meaning |
| - | - |
| target | element target |
| property | name of the property, `animationName` as the example above |
| value | computed value |

## What the next?

1. Provide other properties something like `skew`, `brightness`.
2. `Interaction Observer API` for better performance.
3. Support multiple instances.
4. Child slug.
5. Query for element.
6. Function of toggling class by position.
7. Inertia?
8. Animation function (ease-in-out, ... etc.) support.
9. Refactor it into better architecture.
10. `Matrix` calculation.
