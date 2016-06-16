var SoupeBpmnViewer = window.SoupeBpmnJS;

// create modeler
var bpmnViewer = new SoupeBpmnViewer({
  container: '#canvas'
});

// import function
function importDiagram(xml) {
  // import diagram
  bpmnViewer.importXML(xml, function (err) {

    if (err) {
      return console.error('could not import BPMN 2.0 diagram', err);
    }

    var canvas = bpmnViewer.get('canvas');

    // zoom to fit full viewport
    canvas.zoom('fit-viewport');
  });
}

function toggleFullScreen() {
  var element = document.querySelector('html');

  if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

function setEncoded(link, name, data) {
  var encodedData = encodeURIComponent(data);

  if (data) {
    link.attr({
      'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
      'download': name
    });
  }
}

function saveSVG(done) {
  bpmnViewer.saveSVG(done);
}

function saveDiagram(done) {
  bpmnViewer.saveXML({format: true}, function (err, xml) {
    done(err, xml);
  });
}

function getProcess() {
  var root = bpmnViewer.get('canvas').getRootElement();
  var process = root.businessObject;
  return process;
}

$(document).on('ready', function () {
  fileInput = $('<input type="file" />').appendTo(document.body).css({
    width: 1,
    height: 1,
    display: 'none',
    overflow: 'hidden'
  }).on('change', function (e) {
    openFile(e.target.files[0], importDiagram);
  });

  var toggleFullScreenButton = document.querySelector('#toggleFullScreen-button');

  toggleFullScreenButton.addEventListener('click', function () {
    toggleFullScreen();
  });

  var downloadXMLLink = $('#downloadXMLLink');

  downloadXMLLink.on('click', function () {
    saveDiagram(function (err, xml) {
      var process = getProcess();
      setEncoded(downloadXMLLink, (process.name || process.id) + '.bpmn',  err ? null : xml);
    });
  });

  var downloadSVGLink = $('#downloadSVGLink');

  downloadSVGLink.on('click', function () {
    saveSVG(function (err, svg) {
      var process = getProcess();
      setEncoded(downloadSVGLink, (process.name || process.id) + '.svg', err ? null : svg);
    });
  });

});
