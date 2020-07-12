// smart comp resizer
var window = new Window("palette", "Smart Comp Resizer", undefined);
window.orientation = "row";
var wEditText = window.add("edittext", undefined, "1920");
wEditText.characters = 5;
var hEditText = window.add("edittext", undefined, "1080");
hEditText.characters = 5;
var methodCheckbox = window.add("checkbox", undefined, "Whole Comp");
methodCheckbox.value = true;
var applyButton = window.add("button", undefined, "Apply");

window.center();
window.show();

applyButton.onClick = function() {
     smartCompResize(methodCheckbox.value);
    }

function smartCompResize(resizeBool) {
var comp = app.project.activeItem;
app.beginUndoGroup("Smart Comp Resizer");
switch(resizeBool) {
    case true:
// method one - create new composition and properly fit comp to it
    var newComp = app.project.items.addComp(comp.name+"_NEW", parseInt(wEditText.text), parseInt(hEditText.text), 1, comp.duration, Math.floor(1/comp.frameDuration));
    var oldCompLayer = newComp.layers.add(comp);
    var myRect = oldCompLayer.sourceRectAtTime(0, false);
	var myScale = oldCompLayer.property("Scale").value;
	var myNewScale = myScale * Math.min (newComp.width / myRect.width, newComp.height / myRect.height);
	oldCompLayer.property("Scale").setValue(myNewScale);
    break;
    
    case false:
// method two - attempt to smart scale all layers
    comp.width = parseInt(wEditText.text);
    comp.height =parseInt(hEditText.text) ;
    for(var i = 1; i <= comp.numLayers; i++) {
        if(!comp.layer(i).property("Scale").isTimeVarying) {
            var myRect = comp.layer(i).sourceRectAtTime(0, false);
            var myScale = comp.layer(i).property("Scale").value;
            var myNewScale = myScale * Math.min (comp.width / myRect.width, comp.height / myRect.height);
            comp.layer(i).property("Scale").setValue(myNewScale);
            }
        }
    break;
}
newComp.openInViewer();
app.endUndoGroup();
}