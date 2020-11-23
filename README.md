# WASM TYPESCRIPT TINYGO

A sample project that uses Tinygo WASM and Typescript.  To get started with this project install:

1. Yarn - [installation instructions](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
2. Tinygo - [installation instructions](https://tinygo.org/getting-started/)

Then when installed you can build the project with:

```bash
make install
make all
```

## Client

We use React, and Typescript for a simple web interface.  We have built our own webpack build configuration to allow us to circumvent the opinionated build system of CRA and enable the use of Go WASM files.

## Webassembly

The core calculations in the widget are done using webassembly.  Tinygo is required to be installed.  The wasm file can be compiled as follows:

```bash
tinygo build -o ../server/dist/wasm.wasm -target wasm main.go
```

## Server

A simple go based web server that uses the air module to do live reloads.  The server can be started with the following:

```bash
air
```

Air is pretty awesome for rapid development with Go.  Check it out: [Air](https://github.com/cosmtrek/air).

## Setup

To set this up one must have Tinygo installed and must update the location to the wasm_exec.js file.  This will be in a path such as on mac and needs to be copied into the server/dist directory:

```bash
cp /usr/local/Cellar/tinygo/0.15.0/targets/wasm_exec.js server/dist
```

For this project I have copied my wasm_exec.js file into the client/src directory; it then gets built into the final project.

### References

This project only exists because of the following articles:

1. [WASM with React](https://brightinventions.pl/blog/using-wasm-with-react)
2. [Webpack Golang WASM loader](https://github.com/aaronpowell/webpack-golang-wasm-async-loader)
3. [WASM Go with React](https://medium.com/free-code-camp/taking-off-with-webassembly-for-go-in-react-7c099bd907fa)
4. [Tic Tac Toe WASM Go](https://blog.logrocket.com/how-to-make-a-tic-tac-toe-bot-with-webassembly-for-go-e01800a874c9/)
5. [Webpack React Tutorial](https://www.toptal.com/react/webpack-react-tutorial-pt-1)
6. [Webpack with Typescript](https://www.toptal.com/react/webpack-config-tutorial-pt-2)
7. **IMPORTANT** [TS WASM REACT GO](https://www.aaron-powell.com/posts/2019-02-12-golang-wasm-6-typescript-react/)
8. [Webpack WASM loader Github](https://github.com/aaronpowell/webpack-golang-wasm-async-loader)
9. [Tinygo FinalizeRef Fix](https://github.com/tinygo-org/tinygo/issues/1140)
10. [Tinygo WASM examples](https://github.com/tinygo-org/tinygo/tree/master/src/examples/wasm)