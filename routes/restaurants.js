var express = require("express");
var fetchRestaurants = require("../common/fetch-restaurants");
var router = express.Router();

var url =
  "http://helagotland.se/lunchguiden/?city=TWsm&rest=hMTp_sLUa_VfSA_VfS9_tCUE_qqvn_gxSp_cPVn_VfRl_qZGW_VfRs_VEN7_VfRy_wGaL_wrB1_qr0n_VEN3_nqA8_YyJR_VfSD_jswO_wAoz_Vxe5_VfRu_jeTu_VEN5_omZp_VfS3_VfS8";

/* GET users listing. */
router.get("/", function(req, res, next) {
  fetchRestaurants(url).then(x => res.json(x));
});

module.exports = router;
