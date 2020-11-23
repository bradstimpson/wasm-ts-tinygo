.PHONY: install compile build run all

install:
	cd client/ && yarn install

run:
	cd server/ && air

compile:
	cd wasm/ && tinygo build -o ../server/dist/wasm.wasm -target wasm main.go

build:
	cd client/ && yarn build

clean:
	rm -rf server/tmp/* server/dist/* client/node_modules

all: compile build run