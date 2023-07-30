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

interface SlotProps {
  name?: string;
}

interface SlottableProps {
  slot?: string;
}

export type WithSlotsOptions = {
  /** */
  replaceSlotContent?: boolean;
};

const DEFAULT_OPTIONS: WithSlotsOptions = {
  replaceSlotContent: false,
};

const SLOT_ATTRIBUTE_NAME = "data-s-slot";
const DEFAULT_SLOT_NAME = "$DEFAULT_SLOT";

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

export const Slottable: ParentComponent<SlottableProps> = (props) => {
  return (
    <div
      data-s-slot={props.slot ?? DEFAULT_SLOT_NAME}
      style={{ display: "contents" }}
    >
      {props.children}
    </div>
  );
};

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
          if (!(child instanceof HTMLElement)) return;

          let slotName = child.getAttribute(SLOT_ATTRIBUTE_NAME);

          if (slotName === null || slotName.length === 0)
            slotName = DEFAULT_SLOT_NAME;

          if (table[slotName])
            resolvedOptions.replaceSlotContent
              ? [child]
              : table[slotName].push(child);
          else table[slotName] = [child];
        });

      return table;
    });

    return (
      <SlotContext.Provider value={{ lookupTable }}>
        <Component {...restProps} />
      </SlotContext.Provider>
    );
  };
