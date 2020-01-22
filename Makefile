clean:
	- rm public/*

build:
	npm run build

server:
	npm run server

setup:
	npm install
	npm link slm-cli
	npm link http-server
	npm link browserify

watch:
	npm run watch