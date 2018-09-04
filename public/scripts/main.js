const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);
var Travis, travis;
Travis = require('travis');
travis = new Travis;

travis.config(function(config) {
  console.log(config);
});

$( document ).ready(function() {
	// $.when(createTables("veg").promise()).done(createTables("fruits").promise());
	createTables("veg");
	createTables("fruits");
});


function createTables(collectionName) {
	var i = 1;
	var tableNum = 1;
	var tableIDName = "vegTable";
	var title = "שם הירק";
	var divName = "vegMaindiv";
	if (collectionName == "fruits") {
		tableIDName = "fruitTable";
		title = "שם הפרי";
		divName = "fruitMaindiv";
	}
	var markup = "<div class=\"column right-div\"> <table id=\"" + tableIDName + tableNum + "\" class=\"strip table table-bordered\"> <thead> <tr class=\"table-success\"> <td class=\"thick\">" + title + "</td> <td class=\"thick\">מחיר</td> </tr> </thead> <tbody> </tbody> </table> </div>";
	$('#'+divName).append(markup);


	db.collection(collectionName).orderBy("name", "asc").get().then(function(querySnapshot) {
	    querySnapshot.forEach(function(doc) {
	        var j = i;
            i++;
	        var name = doc.data().name;
	        var price = doc.data().price;
	        var id = doc.id;
	        var trClass = "table-primary";
	        if (j%2 == 0) trClass = "table-secondary";
	        
	        var markupCell = "<tr class=\""+ trClass + "\"><td>" + name + "</td><td onclick='updateVal(event);' id=\"" + id + "\" class=\"" + collectionName + "\">" + price + "</td></tr>";
            var tableID = tableIDName + tableNum;
            $('#' + tableID).append(markupCell);
            
            if (j%20==0) {
            	tableNum++;
            	markup = "<div class=\"column right-div\"> <table id=\"" + tableIDName + tableNum + "\" class=\"strip table table-bordered\"> <thead> <tr class=\"table-success\"> <td class=\"thick\">" + title + "</td> <td class=\"thick\">מחיר</td> </tr> </thead> <tbody> </tbody> </table> </div>";
            	$('#' + divName).append(markup);
            }
	    });
	});
};

function updateVal(event) {
	console.log("editable click");
	var i = 0;
	var elem = $(event.target).closest("td");
	event.stopPropagation(); //<-------stop the bubbling of the event here
	var value = elem.html();

	if ( $('input:focus').length > 0 ) {  return; }

	$(elem).html('<input class="thVal" maxlength="6" type="text" width="2" value="' + value + '" />');
	$(".thVal").focus();
	$(".thVal").select();
	$(".thVal").keyup(function(event) {
		if (event.keyCode == 13) {
			$(elem).html($(".thVal").val().trim());
			update(elem);
		}
	});

	$(".thVal").focusout(function() { // you can use $('html')
		$(elem).html($(".thVal").val().trim());
		update(elem);
	});
};

function update(elem) {
	var text = elem.html();
	var id = elem.attr('id');
	var collectionName = elem.attr('class');
	var firestoreDoc = db.collection(collectionName).doc(id);
	firestoreDoc.update({ price: text });
}