var carNumFlag = false;
var carIdFlag = false;
var happy = {
  carNumber: function (val) {
    carNumFlag = /^[a-z_A-Z]{1}[a-z_A-Z_0-9]{5}$/.test(val);
    return carNumFlag;
  },
  carId: function (val) {
    carIdFlag = /^[0-9]{4}$/.test(val);
    return carIdFlag;
  },
  play: function (callback) {
    if (carNumFlag && carIdFlag) {
      callback();
    } else {
      $("#dialog").attr("href", "sorryDia.html").click();
    }
  }
};