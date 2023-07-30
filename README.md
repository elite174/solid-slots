# solid-slots

Bring slots to solid-js!

## Example

```tsx
import { Show, VoidComponent, createSignal } from "solid-js";
import { Slot, Slotable, withSlots } from "solid-slots";

/**
 * Step 1:
 * Wrap your component with `withSlots`.
 * It will allow the component to properly work with Slot components.
 *
 * Important: Your component should be VoidComponent (so you either work with props.children or with Slot components)
 */
interface Props {
  textColor: string;
}

const Layout: VoidComponent<Props> = (props) => (
  <div style={{ color: props.textColor }}>
    <Slot name="header" />
    {/** The name prop for slots is optional! */}
    <Slot>
      <div>This is a fallback to content</div>
    </Slot>
    <Slot name="footer" />
    {/** It's not allowed to render props.children inside components wrapped with `withSlots` */}
  </div>
);

const SlottedLayout = withSlots(Layout);

const App = () => {
  const [isHeaderVisible, setIsHeaderVisible] = createSignal(false);

  return (
    <main>
      <button onClick={() => setIsHeaderVisible((v) => !v)}>
        Toggle header content
      </button>
      {/**
       * Step 2:
       * Pass some children to your slottable component.
       */}
      <SlottedLayout textColor="red">
        {/** You can also show dynamic content! */}
        <Show when={isHeaderVisible()}>
          {/**
           * If you work with DOM nodes directly
           * you may add data-s-slot attribute to the dom node.
           */}
          <div data-s-slot="header">
            <span>Nice header</span>
          </div>
        </Show>
        <section>This section goes directly to default slot</section>
        {/**
         * If you need to pass a component or some primitive to some slot
         * you may use <Slottable> component
         */}
        <Slotable slot="footer">Footer</Slotable>
      </SlottedLayout>
    </main>
  );
};
```

## Docs

### `withSlots`

Wraps a `VoidComponent` to allow working with `Slot` components.

#### Definition

```tsx
import { type VoidComponent } from "solid-js";

type WithSlotsOptions = {
  /**
   * Suitable for cases when there are several children with the same slot name.
   * If set to false it will render only last resolved child with the same slot name.
   * If set to true (default) it will render all children with the same slot name.
   * @default true
   */
  mergeChildren?: boolean;
};

export declare const withSlots: <T extends {}>(
  Component: VoidComponent<T>,
  options?: WithSlotsOptions
) => ParentComponent<T>;
```

### `Slot`

A component which renders the content

#### Definition

```tsx
import { type ParentComponent } from "solid-js";

interface SlotProps {
  name?: string;
}

export declare const Slot: ParentComponent<SlotProps>;
```

### `Slotable`

A component which helps to render primitives or another components to slots. It will wrap the content into a HTML element (by default it's a `div`) with `display: contents`.

#### Definition

```tsx
import { type ParentComponent } from "solid-js";

interface SlotableProps {
  /**
   * HTML tagname for the wrapper
   * @default div
   */
  tag?: string;
  /** Slot name */
  slot?: string;
}

export declare const Slotable: ParentComponent<SlotableProps>;
```
