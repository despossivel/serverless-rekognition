class CompareFaces {
  constructor({
    rekoSvc,
    translatorSvc,
    getImageBuffer
  }) {
    this.rekoSvc = rekoSvc
    this.translatorSvc = translatorSvc
    this.getImageBuffer = getImageBuffer;
  }

  async compareFaces(sourceBuffer, targetBuffer) {

    const result = await this.rekoSvc.compareFaces({
      SourceImage: {
        Bytes: sourceBuffer
      },
      TargetImage: {
        Bytes: targetBuffer
      },
     // SimilarityThreshold: 70
    }).promise();

    return result.FaceMatches;

  }

  async translateText(text, language = 'pt') {
    const params = {
      SourceLanguageCode: 'en',
      TargetLanguageCode: language,
      Text: text
    };

    const { TranslatedText } = await this.translatorSvc.translateText(params).promise()

    return TranslatedText;

  }

  async formatTextResults({ Similarity, Face }, language) {
    const textMiddle = await this.translateText("in similatrity", language);
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

      const sourceBuffer = await this.getImageBuffer(source);
      const targetBuffer = await this.getImageBuffer(target);

      const [result] = await this.compareFaces(sourceBuffer, targetBuffer);

      const finalText = await this.formatTextResults(result, language)

      return {
        statusCode: 200,
        body: finalText
      }


    } catch (error) {
      return {
        statusCode: 500,
        body: error.stack
      }
    }

  }


}

module.exports = CompareFaces;