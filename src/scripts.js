function progressControlScroll(event, callback) {
  let slider = event.target;
  let newVal = Number(slider.value) + Math.sign(-event.deltaY) * 5;
  slider.value = newVal;
  callback(newVal);
}

function volumeControlScroll(event, callback) {
  let slider = event.target;
  let newVal = Math.min(320, Number(slider.value) + Math.sign(-event.deltaY) * 5);
  slider.value = newVal;
  callback(newVal);
}

document.onkeydown = function (event) {
  // Na vyhledávácím poli klávesy nechytej
  if (document.activeElement === document.getElementById("search-input") ||
    document.activeElement === document.getElementById("search-playlist-input"))
    return true;

  const keyName = event.key;
  let consume = true;

  switch (keyName) {
    case " ":
    case "MediaPlayPause":
      ajaxCall("pause");
      break;
    case "MediaTrackPrevious":
      ajaxCall("prev");
      break;
    case "MediaTrackNext":
      ajaxCall("next");
      break;
    default:
      consume = false;
  }

  if (!consume)
    return true;

  if (typeof event.stopPropagation != "undefined") {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
  event.preventDefault();
  return false;
};
