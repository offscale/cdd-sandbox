clean:
	- rm build/*
	- rm public/*

build:
	tsc -sourcemap src/*.ts --outDir build
	browserify --debug build/app.js -o public/app.js
	slm --input src/index.slim --output public/index.html
	- cp src/*.css public/ 2> /dev/null
	- cp src/*.ico public/ 2> /dev/null
	- cp src/*.js public/ 2>/dev/null
	- cp src/*.svg public/ 2>/dev/null
	- cp build/*.map public/ 2>/dev/null

server: clean build
	http-server --port 8888

setup:
	npm install
	npm link slm-cli
	npm link http-server
	npm link browserify

watch:
	tsc -w src/*.ts --outDir build