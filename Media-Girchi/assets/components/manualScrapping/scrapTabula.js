import request from 'request';
import cheerio from 'cheerio'; 
import writeDataToGirchi from '../writingData/writeDataToGirchi.js';
import writeDataToImportants from '../writingData/writeDataToImportants.js';
import writeToSource from '../writingData/writeToSource.js';


export default function scrapTabula(url, accept, accept1, sourceImgUrl) {
  request(url, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);
      const newsDiv = $('.om-main')
      const title = newsDiv.find('h1').text();
      const dataInfo = $('.ArticleHeaderDefault_metaItem__1OQi4').text();
      const text = newsDiv.find('p').text();
      const imgUrl = newsDiv.find('img').attr("src");

      const writeGirchi = () => writeDataToGirchi("tabula.json", title, dataInfo, text, imgUrl, sourceImgUrl, url);
      const writeImportants = () => writeDataToImportants("tabula.json", title, dataInfo, text, imgUrl, sourceImgUrl, url);
      const writeSource = () => writeToSource("tabula.json", "Tabula", title, dataInfo, text, imgUrl, sourceImgUrl, url);
      
      if (accept === "on" && accept1 === "on") {
        writeGirchi();
        writeImportants();
        writeSource();

      } else if (accept === "on") {
        writeImportants();
        writeSource();

      } else if (accept1 === "on") {
        writeGirchi();
        writeSource();
      } else {
        writeSource();
      }
    }
  });
}
