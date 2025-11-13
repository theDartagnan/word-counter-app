/* eslint-disable no-console */

async function wait(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms, true));
}

export default async function processFileData(fileData, textProcessController) {
  console.log('SIMULTATE PROCESS PDF TEXT !');
  const nbSimulatedPages = 10;
  let errorOnPage = -1;
  if (Math.random() > 0.9) {
    errorOnPage = Math.floor(Math.random() * nbSimulatedPages) + 1;
  }
  await wait(2000);
  textProcessController.onDocumentOpened(nbSimulatedPages);
  for (let i = 1; i <= nbSimulatedPages; i++) {
    textProcessController.onPageProcessing(i);
    await wait(1000);
    const nbTexts = Math.round(Math.random() * 10) + 10;
    for (let j = 0; j < nbTexts; j++) {
      await wait(50);
      textProcessController.onText('du texte à traiter ; c\'est super !');
    }
    if (i === errorOnPage) {
      throw new Error('Ahaha une erreur test');
    }
  }
  textProcessController.onDocumentProcessed();
  return true;
}
