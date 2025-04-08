#!/bin/bash

# Rename index.csr.html to index.html so http-server serves it as the entry point
mv /app/dist/index.csr.html /app/dist/index.html

# Start the http-server
http-server /app/dist -p 80
