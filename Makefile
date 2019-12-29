build:
	tsc src/app.ts --outDir public
	slm --input src/index.slim --output public/index.html

serve: build
	http-server