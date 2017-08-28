var express = require("express");
var fetchRestaurants = require("../common/fetch-restaurants");
var router = express.Router();
const searchTresh = 0.8;
const url =
  "http://helagotland.se/lunchguiden/?city=TWsm&rest=hMTp_sLUa_VfSA_VfS9_tCUE_qqvn_gxSp_cPVn_VfRl_qZGW_VfRs_VEN7_VfRy_wGaL_wrB1_qr0n_VEN3_nqA8_YyJR_VfSD_jswO_wAoz_Vxe5_VfRu_jeTu_VEN5_omZp_VfS3_VfS8";
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

/* GET users listing. */
router.post("/", function(req, res, next) {
  fetchRestaurants(url).then(x => {
    var search = x.map((e, i) => similarity(e.name, req.body.name)).reduce((
      prev,
      next,
      i
    ) => {
      return next > prev.likeness ? { likeness: next, index: i } : prev;
    }, { likeness: -1, index: -1 });

    if (search.likeness >= searchTresh) {
      res.json(x[search.index]);
    } else {
      res.sendStatus(404);
    }
  });
});

module.exports = router;
