class CompareFaces {
  constructor({
    rekoSvc,
    translatorSvc,
    getImageBuffer
  }) {
    this.rekoSvc = rekoSvc
    this.translatorSvc = translatorSvc
    this.getImageBuffer = getImageBuffer;
    this.language = 'pt';
  }

  async compareFaces(sourceBuffer, targetBuffer) {

    const result = await this.rekoSvc.compareFaces({
      SourceImage: {
        Bytes: sourceBuffer
      },
      TargetImage: {
        Bytes: targetBuffer
      },
      SimilarityThreshold: 70
    }).promise();

    return result.FaceMatches;

  }

  async translateText(text) {
    const params = {
      SourceLanguageCode: 'en',
      TargetLanguageCode: this.language,
      Text: text
    };

    const { TranslatedText } = await this.translatorSvc.translateText(params).promise()

    return TranslatedText;

  }

  async formatTextResults({ Similarity, Face }) {
    const textMiddle = await this.translateText("in similatrity");
    const text = `${Similarity.toFixed(2)}% ${textMiddle}`;
    return text;
  }


  async main(event) {
    try {

      const {
        source,
        target,
        language
      } = event.queryStringParameters;

      this.language = language;

      const [sourceBuffer, targetBuffer] = await Promise.all([this.getImageBuffer(source),
                                                        this.getImageBuffer(target)])

      const result = await this.compareFaces(sourceBuffer, targetBuffer);

      if (result.length == 0) return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: {
          text: await this.translateText("Similarity rate between images is very low!")
        }
      }

      const [resultSimilarity] = result;
      const finalText = await this.formatTextResults(resultSimilarity)
      resultSimilarity.Similarity = resultSimilarity.Similarity.toFixed(2)

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify({
          Text: finalText,
          ...resultSimilarity
        })
      }

    } catch (error) {
      console.error('Error:', error.stack)
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: 'Ops! Aconteceu alguma coisa, tente novamente mais tarde.'
      }
    }

  }


}

module.exports = CompareFaces;