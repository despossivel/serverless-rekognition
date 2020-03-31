![https://i0.wp.com/www.websystemer.no/wp-content/uploads/rekognition-image-video-analysis.png?w=600&ssl=1](https://i0.wp.com/www.websystemer.no/wp-content/uploads/rekognition-image-video-analysis.png?w=600&ssl=1)

### O Objetivo desse projeto é fazer o reconhecimento coisas em imagens e comparar duas faces, traduzindo o resultado para a linguagem de escolha do usuário.

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

> #### Este serverless possui duas functions 
> img-analysis e compare-faces
> img-analysis vai lhe retornar todas as coisas que foram encontradas na imagem forcedida, com no minimo 80% de confiança.
> compare-face vai lhe retornar uma string com a porcentagem de similaridade entre as duas imagens fornecidas.


Agora veja se tudo esta rodando supimpa em ambiente local.
```bash
    sls invoke local -f <nome da function> --path <diretorio da function>/request.json
```

> O arquivo request.json contem os parâmetros necessários para simular a requisição ao serviço.
```bash
    yarn local
```

Se rodou tudo belezura, agora é hora de fazer o deploy para a AWS.
```bash
    sls deploy
```
Quando o deploy terminar, será retornado os endpoints, algo começando com 
```bash
    https://xr1zj3k69f.execute-api.us-east-1.amazonaws.com
```

Agora para testarmos se tudo esta rodando filé na AWS, podemos testar via CLI
```bash
    sls invoke -f <nome da function> --path <diretorio da function>/request.json
```
ou pelo nosso endpoint fornecedos os query parameters necessários 

### Query parameters das functions

img-analysis
```bash
    <seu endPoint>/dev/analyse?language=<idioma da resposta>&imageUrl=<image para ser analisada>
```
exemplo
```bash
https://xr1zj3k69f.execute-api.us-east-1.amazonaws.com/dev/analyse?language=pt&imageUrl=https://www.osaogoncalo.com.br/img/normal/70000/1_0-15012564_00076985_0.jpg
```


compare-faces
```bash
<seu endPoint>/dev/compare?language=<idioma da resposta>&source=<image fonte>&target=<image a ser comparada>
```
exemplo

```bash
https://xr1zj3k69f.execute-api.us-east-1.amazonaws.com/dev/compare?language=ru&source=https://staticr1.blastingcdn.com/media/photogallery/2020/2/5/660x290/b_1200x680/ator-johnny-depp-esta-com-problemas-financeiros-segundo-revista-arquivo-blasting-news_2395461.jpg&target=https://upload.wikimedia.org/wikipedia/commons/5/5f/Johnny_Depp_Alice_Through_the_Looking_Glass_premiere.jpg
```


**OBS:**  Para que a analise da imagem aconteça com sucesso é necessário informar a URL da imagem a ser analisada. essa URL deve ser um caminho direto ao arquivo da mesma, ou seja, terminando em png, jpg e etc.