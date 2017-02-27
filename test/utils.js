// shared test utility functions
function visible(element) {
  return element && (element.offsetWidth > 0 || element.offsetHeight > 0);
}

function isVisible(assert, element, message, not) {
  if (!message) {
    message = "[vista=\""+element.getAttribute('vista')+"\"] should "+
              (not ? "not " : "") +
              "be visible when location is "+location.href;
  }
  var shown = visible(element);
  if (not) {
    assert.equal(shown, false, message);
  } else {
    assert.ok(shown, message);
  }
}
function isNotVisible(assert, element, message) {
  isVisible(assert, element, message, true);
}
window.visible = visible;
window.isVisible = isVisible;
window.isNotVisible = isNotVisible;
