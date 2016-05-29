var SoupeBpmnModeler = window.SoupeBpmnJS;

// create modeler
var bpmnModeler = new SoupeBpmnModeler({
  container: '#canvas',
  propertiesPanel: {
    parent: '#js-properties-panel'
  }
});

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

// import function
function importDiagram(xml) {
  // import diagram
  bpmnModeler.importXML(xml, function (err) {

    if (err) {
      return console.error('could not import BPMN 2.0 diagram', err);
    }

    var canvas = bpmnModeler.get('canvas');

    // zoom to fit full viewport
    canvas.zoom('fit-viewport');
  });
}

function createDiagram() {
  // a diagram to display
  //
  // see index-async.js on how to load the diagram asynchronously from a url.
  // (requires a running webserver)
  var diagramXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<bpmn2:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:bpmn2=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" xsi:schemaLocation=\"http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd\" id=\"sample-diagram\" targetNamespace=\"http://bpmn.io/schema/bpmn\">\n  <bpmn2:process id=\"Process_1\" isExecutable=\"false\">\n    <bpmn2:startEvent id=\"StartEvent_1\"/>\n  </bpmn2:process>\n  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_1\">\n      <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_1\">\n        <dc:Bounds height=\"36.0\" width=\"36.0\" x=\"100.0\" y=\"200.0\"/>\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn2:definitions>";

  // import xml
  importDiagram(diagramXML);
}

function openFile(file, callback) {

  // check file api availability
  if (!window.FileReader) {
    return window.alert(
      'Looks like you use an older browser that does not support drag and drop. ' +
      'Try using a modern browser such as Chrome, Firefox or Internet Explorer > 10.');
  }

  // no file chosen
  if (!file) {
    return;
  }

  var reader = new FileReader();

  reader.onload = function (e) {

    var xml = e.target.result;

    callback(xml);
  };

  reader.readAsText(file);
}


var fileInput;

function openDiagram() {
  $(fileInput).trigger('click');
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
  bpmnModeler.saveSVG(done);
}

function saveDiagram(done) {
  bpmnModeler.saveXML({format: true}, function (err, xml) {
    done(err, xml);
  });
}

function getProcess() {
  var root = bpmnModeler.get('canvas').getRootElement();
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

  var createBTN = document.querySelector('#createBTN');

  createBTN.addEventListener('click', function () {
    createDiagram();
  });

  var openFileBTN = document.querySelector('#openFileBTN');

  openFileBTN.addEventListener('click', function () {
    openDiagram();
  });

  // $('.io-import-export a').click(function (e) {
  //   if (!$(this).is('.active')) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //   }
  // });

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
