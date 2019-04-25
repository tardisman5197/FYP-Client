# FYP-Client

A simple web interface to communicate with the [FYP-Server](https://github.com/tardisman5197/FYP-Server) via an API.

## Table of contents
1. [Getting Started](#getting-started)
    1. [Prerequisites](#prerequisites)
2. [Running the project](#running-the-project)


## Getting Started
 
These instructions will get help you get the API up and running.

### Prerequisites

1. [Node.js](https://nodejs.org/en/)

2. Install [http-server](https://www.npmjs.com/package/http-server)

3. Setup the [server[(https://github.com/tardisman5197/FYP-Server)

## Running the project

To use the web client, navigate to the directory of the FYP-Client repository and run the following command.

```
http-server <path-to-repo> -p <port> --cors
```

An example of this command could be.

```
http-server . -p 9999 --cors
```

This command when run from within the repo, would make the web client accessible from a browser at `localhost:9999`.
