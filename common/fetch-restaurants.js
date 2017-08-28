var request = require("request-promise");
var cheerio = require("cheerio");

const fetchRestaurants = url => {
  return request(url).then(b => {
    $ = cheerio.load(b);
    return $(".ResultMainPanel")
      .find(".RestRMAINP.Resturant")
      .map((i, e) => {
        return {
          name: $(e).find(".RestLB.Rub1").text().trim(),
          meals: $(e)
            .find(".RestLNAME.LNAME.Btex")
            .map((i, e) => $(e).text())
            .get()
        };
      })
      .get();
  });
};

module.exports = fetchRestaurants;
