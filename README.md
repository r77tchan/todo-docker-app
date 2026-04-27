### build (イメージ作成)

```
docker build .
```

### 名前付きbuild (名前:タグ) (タグ省略時のデフォルトはlatest)

```
docker build -t tutorial:1.0 .
```

### image確認

```
docker images
```

### image削除 (コンテナがある場合は削除不可)

```
docker rmi イメージ名:タグ
```

### image 起動 (新規コンテナ作成)

```
docker run tutorial:1.0
```

### --rm 停止と当時に自動的にコンテナ削除 --name コンテナ名 -p ポートのマッピング(ローカル:docker)

```
docker run --rm --name my-container -p 3001:5173 tutorial:1.0
```

### 起動中コンテナ確認

```
docker ps
```

### コンテナ停止

```
docker stop ${CONTAINER ID}
```

### 起動していないコンテナを含め、全コンテナ確認

```
docker ps -a
```

### コンテナ削除

```
docker rm ${CONTAINER ID}
```
