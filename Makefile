clean:
	rm build/*
	rm public/*

build:
	tsc src/app.ts --outDir build
	browserify build/app.js -o public/app.js
	slm --input src/index.slim --output public/index.html
	cp src/*.css public/
	cp src/*.ico public/

serve: clean build
	http-server

setup:
	npm install
	npm link slm-cli
	npm link http-server
