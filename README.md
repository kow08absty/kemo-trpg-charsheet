てーぶるちほーの大冒険 フレンズシート入力フォーム
====

Forked from http://mihikari.sakura.ne.jp/kemonofriends/1/charactersheet/
(original made by [@HillTop_TRPG](https://twitter.com/HillTop_TRPG))

## Description

HillTop さん（[@HillTop_TRPG](https://twitter.com/HillTop_TRPG)）が作成したフレンズシート入力フォームを改良したよ。

+ データベース機能と連携して URL だけでやりとりできる
+ 一部 UI をちょいちょいといじってる
+ 一部データの扱い方をちょいちょいといじってる

とくに目立った機能追加はしていないから、使いやすいほうの入力フォームを使ってね。

かさねて HillTop さんありがとう！

## Tested environments

サーバOS:

+ Ubuntu 18.04 - Bionic Beaver (Windows 10 WSL is also available and tested)
+ Debian 9.0 - Stretch

ソフトウェア:

+ Apache 2.4
+ PHP 7.1 or above
+ SQLite 3.22
+ node v10.15.0
+ npm 6.4.1

ブラウザ:

+ Google Chrome 68 or above

## Install

```
$ git clone --recursive https://github.com/kow08absty/kemo-trpg-charsheet.git
$ cd kemo-trpg-charsheet
$ sh lib/dump-autoload
```

PHP PDO ラッパーライブラリの一部、php-sqlite3 が必要です

```
$ sudo apt install php-sqlite3  # based on Debian distro

$ sudo yum install php-sqlite3  # based on RedHat distro
```

Windows で PHP 拡張機能を有効化する場合、```php.ini``` を編集し、```extention=php_sqlite3.dll``` をアンコメントしてください

Sass コンパイル環境を整える場合、

```
$ npm install
```

sass -> css コンパイル時、

```
$ npm run build-css
```

## Licence

Apache 2.0

## Author

[kow08absty](https://github.com/kow08absty)

[@KOW_public](https://twitter.com/KOW_public)
