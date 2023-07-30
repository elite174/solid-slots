import { Show, type Component, createSignal } from "solid-js";

import { Slot, Slottable, withSlots } from "./lib";

interface Props {
  textColor: string;
}

const Layout = withSlots<Props>((props) => {
  return (
    <div style={{ color: props.textColor }}>
      <Slot name="header" />
      <Slot name="content">
        <div>This is a fallback to content</div>
      </Slot>
      <Slot name="footer" />
    </div>
  );
});

const App: Component = () => {
  const [isHeaderVisible, setIsHeaderVisible] = createSignal(false);

  return (
    <main>
      <button onClick={() => setIsHeaderVisible((v) => !v)}>
        Toggle header content
      </button>

      <Layout textColor="red">
        <Show when={isHeaderVisible()}>
          <div data-s-slot="header">
            <div>a</div>
          </div>
        </Show>
        <Slottable slot="footer">123</Slottable>
      </Layout>
    </main>
  );
};

export default App;
