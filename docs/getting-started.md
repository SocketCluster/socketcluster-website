---
id: getting-started
title: Getting started
sidebar_label: Getting started
---

## Requirements

- Node.js v10 (can work with older versions but you won't be able to use the `for-await-of` loop to consume streams). [Download Node.js](https://nodejs.org/en/).

### Optional dependencies

- `docker` CLI for containerization. [Install Docker](https://docs.docker.com/install/).
- `kubectl` CLI for deployment. [Install Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

---

## CLI overview

### Install the CLI tool

The easiest way to get started with Asyngular is to install the CLI tool from npm (you may need to add `sudo` at the front of the command):

```bash
npm install -g asyngular
```

Use this command to check if the installation was successful:

```bash
asyngular --help
```

^ This should display a list of all available subcommands.

### Create an app

```bash
asyngular create myapp
```

^ This will create a new project directory called `myapp`.

### Start the app with Node.js

From inside your `myapp` directory, run:

```bash
node server
```

!! You can interact with the app by opening http://localhost:8000/ in your browser.

### Start the app with Docker

If you have `docker` installed, you can also run your Asyngular app inside a container on your local machine using the following shortcut command (make sure that `myapp/` is your working directory):

```bash
asyngular run
```

!! You can interact with the app by opening http://localhost:8000/ in your browser.

### Stop the app container

The app docker container runs in the background. To stop it, use:

```bash
asyngular stop
```
