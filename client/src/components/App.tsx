import React, { Component } from "react";
import NumberInput from "./NumberInput";

declare global {
  interface WasmAPI {
    wasmVal: string;
    // [K: string]: <T = any, R = any>(...params: T[]) => Promise<R>;
    add<T = any, R = any>(...vals: number[]): number;
    ping(): void;
    raiseError(cb: any): void;
  }
}

const g = global || window || self;

if (!g.__wasm__) {
  // @ts-ignore
  g.__wasm__ = {};
}

const bridge = g.__wasm__;

let wasm;

type ERROR = { errorType: string; errorText: string };

class Failure {
  constructor(public value: ERROR) {}

  get errorText(): string {
    return this.value.errorText;
  }
}

// the clock's state has one field: The current time, based upon the
// JavaScript class Date
type AppState = {
  time: Date;
  isLoading: boolean;
  values: number[];
  result: number;
  error: Failure | undefined;
  wasmVal: string;
};

// Clock has no properties, but the current state is of type ClockState
// The generic parameters in the Component typing allow to pass props
// and state. Since we don't have props, we pass an empty object.
export class App extends Component<{}, AppState> {
  // static defaultProps = {
  //   isLoading: true,
  // };

  constructor() {
    super({});
    this.state = {
      time: new Date(),
      isLoading: true,
      values: [0, 0],
      result: 0,
      error: undefined,
      wasmVal: "",
    };
  }

  // The tick function sets the current state. TypeScript will let us know
  // which ones we are allowed to set.
  tick() {
    this.setState({
      time: new Date(),
    });
  }

  // Before the component mounts, we initialise our state
  componentWillMount() {
    this.tick();
  }

  // After the component did mount, we set the state each second.
  componentDidMount() {
    setInterval(() => this.tick(), 1000);
    const path = "wasm.wasm";
    const go = new g.Go();
    if ("instantiateStreaming" in WebAssembly) {
      WebAssembly.instantiateStreaming(fetch(path), go.importObject).then(
        async (obj) => {
          wasm = obj.instance;
          go.run(obj.instance);
          let value = bridge.wasmVal;
          this.setState({ isLoading: false, wasmVal: value });
        }
      );
    } else {
      fetch(path)
        .then((resp) => resp.arrayBuffer())
        .then((bytes) =>
          WebAssembly.instantiate(bytes, go.importObject).then(function (obj) {
            wasm = obj.instance;
            go.run(wasm);
            // this.setState({ isLoading: false });
          })
        );
    }
  }

  async updateValue(index: number, value: number) {
    let newValues = this.state.values.slice();
    newValues[index] = value;
    let result = await bridge.add<number, number>(...newValues);
    this.setState({ values: newValues, result });
  }

  async raiseError() {
    try {
      let _ = await bridge.raiseError((error: string) => {
        throw new Error(error);
      });
    } catch (e) {
      const failure = new Failure({
        errorType: "WASMERROR",
        errorText: e,
      });
      this.setState({
        error: failure,
      });
    }
  }

  // render will know everything!
  render() {
    const errorMessage = this.state.error ? "AN ERROR OCCURRED": null;
    return (
      <div>
        {this.state.isLoading ? (
          <div>Loading</div>
        ) : (
          <div>
            <button onClick={() => bridge.ping()}>
              Let's ping the console!
            </button>
          </div>
        )}
        <p>The current time is {this.state.time.toLocaleTimeString()}</p>
        <div>
          <p>
            Enter a number in the box below, on change it will add all the
            numbers together. Click the button to add more input boxes.
          </p>
          {this.state.values.map((value, index) => (
            <NumberInput
              key={index}
              value={value}
              onChange={(i: number) => this.updateValue(index, i)}
            />
          ))}
          <button
            type="button"
            onClick={() => this.setState({ values: [...this.state.values, 0] })}
          >
            More inputs!
          </button>
          <p>Value now is {this.state.result}</p>
          <div>
            <p>
              Click this button to simulate an error:{" "}
              <button type="button" onClick={() => this.raiseError()}>
                Make error!
              </button>
            </p>
            {this.state.error ? (
              <div>
                <p style={{ color: "#f00" }}>{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => this.setState({ error: undefined })}
                >
                  Dismiss
                </button>
              </div>
            ) : null}
          </div>
          <div>
            <p>Here's a static value: {this.state.wasmVal}</p>
          </div>
        </div>
      </div>
    );
  }
}
