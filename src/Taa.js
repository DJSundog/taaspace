// API v0.6.0
var Emitter = require('component-emitter');
var loadimages = require('loadimages');

var NOOP = function () {};

var Taa = function (imgSrc, onLoaded) {
  // Parameters
  //   imgSrc
  //   onLoaded(err, taa)
  //     optional, function (taa)
  Emitter(this);
  var this2 = this;

  // onLoaded is optional
  if (typeof onLoaded !== 'function') {
    onLoaded = NOOP;
  }

  // This object will be replaced by a real Image object but before that
  // src is needed in SpaceView.
  this.image = { src: imgSrc };

  // If the image is cached, the 'load' event of Image element is
  // fired instantly when calling loadimages. If we did not care
  // about this, the on('loaded', fn) listeners would experience
  // different execution order depending whether the images was
  // cached or not.
  var notCached = false;

  loadimages(imgSrc, function (err, image) {
    var emiterr, emittaa;
    if (err) {
      emiterr = err;
      emittaa = null;
    } else {
      this2.image = image;
      emiterr = null;
      emittaa = this2;
    }

    if (notCached) {
      this2.emit('loaded', emiterr, emittaa);
      onLoaded(emiterr, emittaa);
    } else {
      // Postpone emitting of the loaded event
      setTimeout(function () {
        this2.emit('loaded', emiterr, emittaa);
        onLoaded(emiterr, emittaa);
      }, 0);
    }
  });

  notCached = true;
};

module.exports = Taa;
