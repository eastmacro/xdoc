# xdoc

一个专为互秀而生的前端文档生成器
-----

## Install

Install xdoc with npm:

    $ npm install xdoc -g

## Usage

init the documentation: 

    $ xdoc init

Build the documentation:

    $ xdoc build [options]


Start a server at 127.0.0.1:8000:

    $ xdoc server

Start a server at 127.0.0.1:8000, watching the source files change:

    $ xdoc watch

Publish documentation to spmjs.org:

    $ spm doc publish [options]

Clean the _site folder:

    $ xdoc clean

## Themes

The default theme path is `~/.spm/themes`.

Install a theme:

    git clone https://github.com/elover/xdoc-theme ~/.spm/themes/cmd

> The default theme [xdoc-theme](https://github.com/elover/xdoc-theme) would be installed when spm-doc is installed.

## How to write a document

Follow the instruction in [nico-cmd](https://github.com/spmjs/nico-cmd).

## Changelog

### 0.0.1

