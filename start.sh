#!/bin/bash

mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html

nginx -g "daemon off;"
