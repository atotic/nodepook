(function() {
"use strict";
  var TestUtils = {
    setInputValue: function(field, value) {
      field.value = value;
      field.commit();
    }
  }
  window.TestUtils = TestUtils;
})();
