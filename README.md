
# Agrimonitor Web UI

Raspberry Pi を使った農場監視システムの Web UI


## クイックスタート

### Raspberry Pi サーバの準備

Raspberry Pi で監視サーバが動いている前提のアプリケーションのため、
事前に [Agrimonitor Raspi](https://github.com/grassfieldk/agrimonitor-raspi) を起動しておくこと

なおインターネットを使用して Raspberry Pi へ接続する場合、[CloudFlare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) が便利

### 本アプリケーションの起動

1. パッケージのインストール
   ```
   npm install
   ```

2. [.env.example](.env.example) をコピーして .env を作成し、各値を設定

3. 起動
   ```bash
   npm run dev
   ```
