build:
	tsc src/app.ts --outDir public
	slm --input src/index.slim --output public/index.html
	cp src/style.css public/style.css

serve: build
	http-server
