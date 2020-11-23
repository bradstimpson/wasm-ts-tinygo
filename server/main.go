package main

import (
	"log"
	"net/http"
	"strings"
)

func main() {
	// if len(os.Args) != 2 {
	// 	log.Fatal("Not enough arguments provided. Please provide the file serving directory.")
	// }
	dir := "dist/"
	fs := http.FileServer(http.Dir(dir))
	log.Print("Serving " + dir + " on http://localhost:8080")
	http.ListenAndServe(":8080", http.HandlerFunc(func(resp http.ResponseWriter, req *http.Request) {
		log.Println(req.URL)
		resp.Header().Add("Cache-Control", "no-cache")
		if strings.HasSuffix(req.URL.Path, ".wasm") {
			resp.Header().Set("content-type", "application/wasm")
		}
		resp.Header().Set("Access-Control-Allow-Origin", "*")
		fs.ServeHTTP(resp, req)
	}))
}