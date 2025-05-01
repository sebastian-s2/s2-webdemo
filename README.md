# Simplified Selector Demo HTTPD

This is a simplified version of the Selector demo HTTPD server that runs only on port 80 and includes minimal components.

## Building the Container

```bash
docker build -t selector-demo-httpd .
```

## Running the Container

```bash
docker run -p 8081:80 selector-demo-httpd
```

The server will be accessible at http://localhost:80

## Features

- Shows basic server information including:
  - Server IP
  - Server Port
  - Client IP
  - Request Headers
- Runs on port 80 only
- Minimal footprint using Alpine Linux base image
- TCP SYN packet flow visualization between frontend and backend
- Interactive selector diagram showing client-server communication




### URIs

```
/index.shtml: simple site
/frontend.shtml: simple frontend (for reverse-proxy demo)
/backend.shtml: simple backend
/backend/: proxy request to backend server
/website.shtml: Simple website
/headers/: Output of Client/Server HTTP headers
/headers.json: Output of client headers in JSON
/txt: NJS output of NGINX variables
/tcpflow.shtml: Interactive TCP flow visualization

================================================
  ___      _           _                _    ___ 
 / __| ___| | ___  ___| |_ ___ _ __    /_\  |_ _|
 \__ \/ _ \ |/ _ \/ __| __/ _ \ '__|  / _ \  | | 
 |___/\___/_|\___/\__|\__\___/_|     /_/ \_\|___|
================================================

      Node Name: Selector Docker vLab
     Short Name: 41fd19e86e9a

      Server IP: 172.17.0.2
    Server Port: 80

      Client IP: 172.17.0.1
    Client Port: 45664

Client Protocol: HTTP
 Request Method: GET
    Request URI: /txt

    host_header: localhost
     user-agent: curl/7.29.0
x-forwarded-for: 192.168.1.187


```