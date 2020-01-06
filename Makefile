clean:
	- rm build/*
	- rm public/*

build:
	tsc src/*.ts --outDir build
	browserify build/app.js -o public/app.js
	slm --input src/index.slim --output public/index.html
	cp src/*.css public/
	cp src/*.ico public/
	cp src/*.js public/

serve: clean build
	http-server --port 80

setup:
	npm install
	npm link slm-cli
	npm link http-server
