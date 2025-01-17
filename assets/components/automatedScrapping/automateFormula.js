import request from "request";
import cheerio from "cheerio";
import writeToSource from "../writingData/writeToSource.js";
import checkFile from "../writingData/checkIfFileIsEmpty.js";
import writeDataToGirchi from "../writingData/writeDataToGirchi.js";

const GirchiKeywords = ['გირჩი', 'იაგო ხვიჩია', 'ვახტანგ მეგრელიშვილი', 'სანდრო რაქვიაშვილი'];

function writeToFile(url) {
  request(url, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);
      const newsDiv = $(".article");
      const title = $(".news__inner__desc__title").text();
      const dataInfo = $(".news__inner__images_created").text();
      const text = newsDiv.find("p").text();
      let imgUrl = `https://formulanews.ge${$(".news__inner__main__image").find("img").attr("src")}`;
      const logoUrl = "https://upload.wikimedia.org/wikipedia/commons/7/7b/TV_Formula_-_Official_Logo.png";
      
      let isAboutGirchi = GirchiKeywords.some(keyword => title.includes(keyword));
      
      if (imgUrl === "https://formulanews.geundefined") {
        imgUrl = "https://formulanews.ge/uploads_script2/articles/2021/08/21/yjupldlo82izpkc.jpg";
      }
      if (isAboutGirchi) {
        writeDataToGirchi("formula.json", title, dataInfo, text, imgUrl, logoUrl, url);
        writeToSource("formula.json", "Formula", title, dataInfo, text, imgUrl, logoUrl, url);
      } else {
        writeToSource("formula.json", "Formula", title, dataInfo, text, imgUrl, logoUrl, url);
      }
    }
  });
}

export default function automateFormula() {
  request("https://formulanews.ge/Category/All", (err, response, html) => {
    if (!err && response.statusCode === 200) {
      const $ = cheerio.load(html);
      let obj = $("#news__box").find(".main__new__slider__desc").find("a");

      for (let i = 0; i < 10; i++) {
        checkFile(
          "./assets/data/formula.json",
          writeToFile(`https://formulanews.ge${obj[i].attribs.href}`)
        );
      }
    } else {
      console.log("Something failed!");
    }
  });
}
