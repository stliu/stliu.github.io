title: Mac 初始化指南
date: 2015-06-02 17:16:16
tags: 
	- mac
	- brew
	- vim
---

### 安装xcode command line

    xcode-select --install

### 安装[rvm](http://rvm.io)

    curl -sSL https://get.rvm.io | bash -s stable   
    
### 安装[brew](http://brew.sh)    

    ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
    
### 安装[brew cask](http://caskroom.io)    

    brew install caskroom/cask/brew-cask
    
### 通过brew安装的工具

    brew install ansible
    brew install ctags
    brew install git
    brew install libev
    brew install libyaml
    brew install readline
    brew install vim
    brew install ant
    brew install curl
    brew install gmp4
    brew install libevent
    brew install maven
    brew install redis
    brew install wget
    brew install autoconf
    brew install dos2unix
    brew install gnu-sed
    brew install libgpg-error
    brew install mpfr2
    brew install scala
    brew install wxmac
    brew install automake
    brew install ejabberd
    brew install go
    brew install libksba
    brew install openssl
    brew install sqlite
    brew install xz
    brew install boost
    brew install erlang
    brew install gradle
    brew install libmpc08
    brew install pcre
    brew install ssh-copy-id
    brew install brew-cask
    brew install gcc46
    brew install htop-osx
    brew install libpng
    brew install pkg-config
    brew install thrift
    brew install cassandra
    brew install gdbm
    brew install jpeg
    brew install libtiff
    brew install ppl011
    brew install tmux
    brew install cloog-ppl015
    brew install gettext
    brew install legit
    brew install libtool
    brew install python3
    brew install unixodbc    
    
### 通过brew cask安装应用程序

    brew cask install adium
    brew cask install firefox
    brew cask install limechat
    brew cask install skype
    brew cask install xquartz
    brew cask install alfred
    brew cask install github
    brew cask install mou
    brew cask install textmate
    brew cask install youdao
    brew cask install android-file-transfer
    brew cask install google-chrome
    brew cask install mplayerx
    brew cask install thunder
    brew cask install bittorrent-sync
    brew cask install onyx
    brew cask install vagrant
    brew cask install emacs
    brew cask install intellij-idea
    brew cask install picasa
    brew cask install virtualbox
    brew cask install evernote
    brew cask install libreoffice
    brew cask install qq
    brew cask install wechat
    
### 配置zsh

我使用的是[oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)的配置

### 配置vim
    
vim我选择的是[amix的配置](https://github.com/amix/vimrc)

### 配置tmux

这个基本上就是标准配置了, 只不过改了快捷键