package main

import (
	"syscall/js"
	"strconv"
	"regexp"
	"errors"
)

type jsfnerr func(this js.Value, args []js.Value) (interface{}, error)

const (
	bridgeName = "__wasm__"
)

var bridgeRoot js.Value

func RegisterCallback(name string, callback js.Func) {
	bridgeRoot.Set(name, callback)
}

func RegisterErrorCallback(name string, callback jsfnerr) {
	fn := js.FuncOf(func(this js.Value, args []js.Value) interface{}{
		val, err := callback(this,args)
		if err != nil {
			args[0].Invoke(err.Error())
			return nil
		}
		return val
	})
	bridgeRoot.Set(name, fn)
}

func RegisterValue(name string, value interface{}) {
	bridgeRoot.Set(name, value)
}

func init() {	
	bridgeRoot = js.Global().Get(bridgeName)
}

// This calls a JS function from Go.
func main() {

	wait := make(chan struct{}, 0)
	RegisterCallback("ping", pingCB())
	RegisterCallback("add", addCB())
	RegisterErrorCallback("raiseError", err)
	RegisterValue("wasmVal", "Hello World")

	<-wait
}

// This function is imported from JavaScript, as it doesn't define a body.
// You should define a function named 'main.add' in the WebAssembly 'env'
// module from JavaScript.
func add(x, y int) int

func err(this js.Value, args []js.Value) (interface{}, error) {
	return nil, errors.New("This is an error")
}

func pingCB() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		pingN(10)
		return nil
	})
}

func pingN(n int) {
	for i:=0;i<n;i++ {
		println("PONG!!!")
	}
}

func addCB() js.Func {
	return js.FuncOf(func(this js.Value, i []js.Value) interface{} {
		re := regexp.MustCompile(`[-]?\d[\d,]*[\.]?[\d{2}]*`)
		ret := 0
		for _, item := range i {
			if re.MatchString(item.String()) {
				val, _ := strconv.Atoi(re.FindAllString(item.String(), -1)[0])
				ret += val
			}
		}
		return ret
	})
}