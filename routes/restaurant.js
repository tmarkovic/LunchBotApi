var request = require('request');
var cheerio = require('cheerio');
var searchTresh = 0.8;
var url =
  'http://helagotland.se/lunchguiden/?city=TWsm&rest=hMTp_sLUa_VfSA_VfS9_tCUE_qqvn_gxSp_cPVn_VfRl_qZGW_VfRs_VEN7_VfRy_wGaL_wrB1_qr0n_VEN3_nqA8_YyJR_VfSD_jswO_wAoz_Vxe5_VfRu_jeTu_VEN5_omZp_VfS3_VfS8';
module.exports = (context, req) => {
  console.log(req.body.name);
  context.log('JavaScript HTTP trigger function processed a request.');
  if (req.query.name || (req.body && req.body.name)) {
    var restaurants = [];
    request(url, (e, r, b) => {
      if (!e) {
        $ = cheerio.load(b);
        $('.ResultMainPanel').find('.RestRMAINP.Resturant').each((i, e) => {
          var temp = {
            name: $(e).find('.RestLB.Rub1').text().trim(),
            meals: $(e)
              .find('.RestLNAME.LNAME.Btex')
              .map((i, e) => $(e).text())
              .get()
          };

          restaurants.push(temp);
          // console.log($(e).has('.RestLB.Rub1').text().trim());
          // console.log($(e).has('.RestLNAME.LNAME.Btex').text().trim());
        });
      }
      var search = restaurants
        .map((e, i) => similarity(e.name, req.body.name))
        .reduce(
          (prev, next, i) => {
            return next > prev.likeness ? { likeness: next, index: i } : prev;
          },
          { likeness: -1, index: -1 }
        );

      if (search.likeness >= searchTresh) {
        context.res = {
          body: restaurants[search.index]
        };
      } else {
        context.res = {
          status: 404,
          body: "not found"
        };
      }

      context.done();
    });
  } else {
    context.res = {
      status: 400,
      body: 'Please pass a name on the query string or in the request body'
    };
    context.done();
  }

  function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (
      (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
    );
  }

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0) costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }
};
