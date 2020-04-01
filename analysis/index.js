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
    const newList = [];

    for (const { Name, Confidence, Parents } of workingItems) {

      const [name, parents] = await Promise.all([
        this.translateText(Name),
        this.translateParents(Parents)
      ])

      const confidence = this.confidenceFormat(Confidence);

      newList.push({
        Name: name,
        Parents: parents,
        Confidence: confidence
      })
    }
    return newList;

  }

  async translateParents(parents) {

    const newParents = [];
    for (const { Name } of parents) {
      const name = await this.translateText(Name)

      newParents.push({
        Name: name,
        ...parents
      })

    }


    return newParents;
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
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          //'Access-Control-Allow-Credentials': false, // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({
          text: texts,
          items: workingItemsFinal
        })
      }


    } catch (error) {
      console.error('Error:', error.stack)
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          //'Access-Control-Allow-Credentials': false, // Required for cookies, authorization headers with HTTPS
        },
        body: 'Ops! Aconteceu alguma coisa, tente novamente mais tarde.'
      }
    }
  }

}


module.exports = Analysis;