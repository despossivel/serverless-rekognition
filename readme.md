### Reconhecimento de imagens em Serverless com AWS Rekognition

![https://i.ytimg.com/vi/0X38pVYtAfE/maxresdefault.jpg](https://i.ytimg.com/vi/0X38pVYtAfE/maxresdefault.jpg)

### O Objetivo desse projeto é fazer o reconhecimento de imagens e traduzir o resultado para a linguagem de escolha do usuário

### Requisitos

1. Conta na AWS
2. Serverless CLI instalado

### Modo de uso

Faça a instalação das dependências
```bash
    yarn install 
```
ou
```bash
    npm install
```

Agora veja se tudo esta rodando supimpa em ambiente local
```bash
    sls invoke local -f img-analysis --path request.json
```

> O arquivo request.json contem os parâmetros necessários para simular a requisição a serviço, criei no package um script resumido para executar esse teste
```bash
    yarn local
```

Se rodou tudo belezura, agora é hora de fazer o deploy para a AWS
```bash
    sls deploy
```
Quando o deploy for finalizado o comando vai lhe retornar um endpoint, algo como 
```bash
    https://xr1zj3k69f.execute-api.us-east-1.amazonaws.com/dev/analyse
```

Agora para testarmos se tudo esta rodando filé na AWS podemos testar via CLI ou pelo nosso endpoint 
```bash
    sls invoke -f img-analysis --path request.json
```
ou
```bash
    <seu end point>?language=pt&imageUrl=https://www.osaogoncalo.com.br/img/normal/70000/1_0-15012564_00076985_0.jpg
```

**OBS:**  Para que a analise da imagem aconteça com sucesso é necessário informar a URL da imagem a ser analisada. essa URL deve ser um caminho direto ao arquivo da mesma, ou seja terminando em png, jpg e etc.