import {
  children,
  createContext,
  createMemo,
  splitProps,
  useContext,
  type Accessor,
  type ParentComponent,
  type VoidComponent,
} from "solid-js";
import { type ResolvedJSXElement } from "solid-js/types/reactive/signal";
import { Dynamic } from "solid-js/web";

interface SlotProps {
  name?: string;
}

interface SlotableProps {
  /**
   * HTML tagname for the wrapper
   * @default div
   */
  tag?: string;
  /** Slot name */
  slot?: string;
}

export type WithSlotsOptions = {
  /**
   * Suitable for cases when there are several children with the same slot name.
   * If set to false it will render only last resolved child with the same slot name.
   * If set to true (default) it will render all children with the same slot name.
   * @default true
   */
  mergeChildren?: boolean;
};

const DEFAULT_OPTIONS: WithSlotsOptions = {
  mergeChildren: true,
};

const SLOT_ATTRIBUTE_NAME = "data-s-slot";
const DEFAULT_SLOT_NAME = "$DEFAULT_SLOT";
const DEFAULT_SLOTABLE_TAG = "div";

const SlotContext = createContext<{
  lookupTable: Accessor<Record<string, ResolvedJSXElement[]>>;
}>();

export const Slot: ParentComponent<SlotProps> = (props) => {
  const context = useContext(SlotContext);

  if (!context) {
    console.warn(
      "solid-slots: Slot components must be inside a component wrapped with `withSlots`!"
    );

    return props.children;
  }

  return (
    <>
      {context.lookupTable()[props.name ?? DEFAULT_SLOT_NAME] ?? props.children}
    </>
  );
};

export const Slotable: ParentComponent<SlotableProps> = (props) => (
  <Dynamic
    component={props.tag ?? DEFAULT_SLOTABLE_TAG}
    data-s-slot={props.slot ?? DEFAULT_SLOT_NAME}
    style={{ display: "contents" }}
  >
    {props.children}
  </Dynamic>
);

export const withSlots =
  <T extends {}>(
    Component: VoidComponent<T>,
    options?: WithSlotsOptions
  ): ParentComponent<T> =>
  (props) => {
    const resolvedOptions = Object.assign(DEFAULT_OPTIONS, options);

    const [childrenProps, restProps] = splitProps(props, ["children"]);

    const lookupTable = createMemo(() => {
      const table: Record<string, ResolvedJSXElement[]> = {};

      children(() => childrenProps.children)
        .toArray()
        .forEach((child) => {
          if (child instanceof HTMLElement) {
            let slotName = child.getAttribute(SLOT_ATTRIBUTE_NAME);

            if (slotName === null || slotName.length === 0)
              slotName = DEFAULT_SLOT_NAME;

            if (table[slotName])
              resolvedOptions.mergeChildren
                ? table[slotName].push(child)
                : [child];
            else table[slotName] = [child];
          } else {
            if (table[DEFAULT_SLOT_NAME]) table[DEFAULT_SLOT_NAME].push(child);
            else table[DEFAULT_SLOT_NAME] = [child];
          }
        });

      return table;
    });

    return (
      <SlotContext.Provider value={{ lookupTable }}>
        <Component {...restProps} />
      </SlotContext.Provider>
    );
  };
