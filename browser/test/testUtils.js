(function() {
"use strict";
  var TestUtils = {
    setInputValue: function(field, value) {
      field.value = value;
      field.commit();
    },
    testCredentials: {
      email: "test0@test.com",
      password: '12345678'
    }

  }
  window.TestUtils = TestUtils;
})();
