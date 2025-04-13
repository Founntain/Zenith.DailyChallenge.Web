#!/bin/bash

rm index.html
mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html

nginx -g "daemon off;"
