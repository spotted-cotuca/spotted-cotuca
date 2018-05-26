# Spotted Cotuca

## Requirements

For development, you will only need Node.js installed on your environement.

### Node

[Node](http://nodejs.org/) is really easy to install & include [NPM](https://npmjs.org/).
You should be able to run the following command after the installation procedure
below.

    $ node --version
    v9.2.0

    $ npm --version
    5.5.1

#### Node installation on Windows

Just go on [official Node.js website](http://nodejs.org/) & grab the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it.

### Yarn installation

After installing node, this project will need yarn too, so just run the following command.

    $ npm install -g yarn

---

## Install

    $ git clone https://github.com/Igormandello/spotted-cotuca
    $ cd spotted-cotuca
    $ yarn install

### Configure app

Open `src/config.json` then edit it with the url where you have setup:

- backend api
- proxy
- firebase configuration object

## Start & watch

    $ yarn start

## Simple build for production

    $ yarn build