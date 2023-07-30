import { Show, VoidComponent, createSignal } from "solid-js";
import { Slot, Slottable, withSlots } from "./lib";

interface Props {
  textColor: string;
}

/**
 * Step 1:
 * Wrap your component with `withSlots`.
 * It will allow the component to properly work with Slot components.
 *
 * Important: Your component should be VoidComponent (so you either work with props.children or with Slot components)
 */
const Layout: VoidComponent<Props> = (props) => (
  <div style={{ color: props.textColor }}>
    <Slot name="header" />
    {/** The name prop for slots is optional! */}
    <Slot>
      <div>This is a fallback to content</div>
    </Slot>
    <Slot name="footer" />
    {/** This is not allowed */}
    {/** props.children */}
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
        <Slottable slot="footer">Footer</Slottable>
      </SlottedLayout>
    </main>
  );
};

export default App;
