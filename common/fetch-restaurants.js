var request = require("request-promise");
var cheerio = require("cheerio");

const fetchRestaurants = url => {
  var restaurants = [];

  request(url).then(b => {
    $ = cheerio.load(b);
    $(".ResultMainPanel").find(".RestRMAINP.Resturant").each((i, e) => {
      var temp = {
        name: $(e).find(".RestLB.Rub1").text().trim(),
        meals: $(e)
          .find(".RestLNAME.LNAME.Btex")
          .map((i, e) => $(e).text())
          .get()
      };
      restaurants.push(temp);
    });
    return restaurants;
  });
};

module.exports = rests;
