class Analysis {

  constructor({ rekoSvc, translatorSvc, getImageBuffer }) {
    this.rekoSvc = rekoSvc
    this.translatorSvc = translatorSvc
    this.getImageBuffer = getImageBuffer
    this.language = 'pt';
  }



  async detectImageLabels(buffer) {

    const result = await this.rekoSvc.detectLabels({
      Image: {
        Bytes: buffer
      }
    }).promise();

    const workingItems = result.Labels.filter(({ Confidence }) => Confidence > 80);
    const names = workingItems.map(({ Name }) => Name).join(' and ')

    return {
      names,
      workingItems
    }

  }


  async translateText(text) {
    let params = {
      SourceLanguageCode: 'en',
      TargetLanguageCode: this.language,
      Text: text
    };

    const { TranslatedText } = await this.translatorSvc.translateText(params).promise()
    return TranslatedText

  }

  confidenceFormat = (value) => value.toFixed(2);

  async translateWorkingItems(workingItems) {
    for (const indexItem in workingItems) {
      let name = workingItems[indexItem].Name;
      name = await this.translateText(name)
      workingItems[indexItem].Name = name;
      workingItems[indexItem].Confidence = this.confidenceFormat(workingItems[indexItem].Confidence)
      workingItems[indexItem].Parents = await this.translateParents(workingItems[indexItem].Parents)
    }
    return workingItems;
  }

  async translateParents(parents) {
    for (const indexParents in parents) {
      let name = parents[indexParents].Name;
      name = await this.translateText(name)
      parents[indexParents].Name = name;
    }
    return parents;
  }


  async main(event) {
    try {
      const {
        imageUrl,
        language,
        responseType = 'textConfidence'
      } = event.queryStringParameters;

      this.language = language;

      console.log('Donwloading image...')
      const buffer = await this.getImageBuffer(imageUrl)
      console.log('Detecting labels...')
      const { names, workingItems } = await this.detectImageLabels(buffer)

      console.log(`Translation to ${this.language}`)
      const texts = await this.translateText(names)
      const workingItemsFinal = await this.translateWorkingItems(workingItems)
      console.log('Finishing...')

      return {
        statusCode: 200,
        body: JSON.stringify({
          text:texts,
          items: workingItemsFinal
        })
      }


    } catch (error) {
      console.error('Error:', error.stack)
      return {
        statusCode: 500,
        body: error.stack
      }
    }
  }

}


module.exports = Analysis;