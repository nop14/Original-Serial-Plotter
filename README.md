# オリジナルのシリアルプロッタ
Arduinoのシリアルプロッタではいろいろ不十分なので作った

# インストール
1. Node.jsのLTSをパソコンにインストールする
2. 初期設定(pip installみたいな感じ)
   1. README.mdがある階層で以下コマンドを実行
      1. 'npm install'
   2. my-app以下で以下のコマンドを実行
      1. 'npm install'
3. サーバ起動
   1. README.mdがある階層で以下コマンドを実行
      1. 'npm run dev'

# 要件定義

以下を機能として持つ物を作る

- X軸Y軸
  - 範囲指定
  - 単位変換
- データ出力
  - 範囲指定
  - CSV出力

# 技術概要
※Webアプリとして公開することは特に考えていない

構成は以下の通り
- Backend
  - センサからのSerial通信を受け取る部分
  - 適切な処理をしてFrontendにSerial通信で得たデータを渡す
- Frontend
  - Backendから渡されたデータをブラウザ上に表示する処理を行う部分
    - というかブラウザに表示するためのHTMLやらJSを生成する部分
    - 表示処理自体はブラウザが担う

以下のようにWebSocket通信を使いデータをリアルタイムで反映できるようにする

センサ<=(Serial通信)=>Backend<=(WebSocket通信)=>Frontend

> もしWebアプリとして公開するならWebSocket通信を行う処理内のHostの記述をlocalhostからBackendのドメインにする必要がある。
> 
> 加えて、手元のセンサの値を取りたいなら抜本的にFrontendの構成を変える&ブラウザでローカルのSerialPortを使う為の権限を取る必要がある。
>
> Arduinoのオンラインエディタではできてるのでおそらく可能ではある。

# 構成詳細
## ファイル構成
.
├── my-app
│   ├── public
|   |   ├── favicon.ico
|   |   |   **ブラウザのタブに出るアイコン**
|   |   ├── index.html
|   |   |   **表示されるサイトのひな型**
|   |   ├── logo192.png
|   |   ├── logo512.png
|   |   ├── manifest.json
│   │   └── robot.txt
│   ├── src
|   |   ├── App.css
|   |   |   **Frontendのグラフなどの装飾**
|   |   ├── App.js
|   |   |   **Frontendのグラフ等処理**
|   |   ├── App.test.js
|   |   ├── index.css
|   |   |   **Frontendの基本装飾**
|   |   ├── index.js
|   |   |   **Frontendの基本処理**
|   |   ├── logo.svg
|   |   ├── reportWebVitals.js
|   |   ├── setupTests.js
|   |   └── useInterval.js
|   |       **App.jsで試用するタイマー処理**
│   ├── package.json
│   │   **Frontendの設定の全て**
│   └── .gitignore
|       **Gitで使われるファイル**
├── index.js
|   **Backendの処理の全て**
└── package.json
    **Backendの設定の全て**

## Backend
以下のモジュールを使って地道に実装

- Serial通信
  - serialportモジュール 
- WebSocket通信
  - wsモジュール

解説はソースコードindex.jsのコメントに任せる

## Frontend
create-react-appを使ってひな型を生成し、それを少し変更して使用