var memberNumber = 0;

//go thorugh the form, add alert for unfilled fields and remove alert for filled fields
function checkInput() {

	  memberNumber = 0;
	  var inputcheck = true;

	$(".familyinput").each(function() {
		if (!$(this).find(".icon-selector input:checked").val() ||
			!$(this).find(".familyname").val() ||
			!$(this).find(".familyrelationship").val()
		) {
			$(this).find(".alert").show();
			inputcheck = false;
		} else {
			$(this).find(".alert").hide();
		}
		  memberNumber++;
	});
	if (!$("input[name=familyiconme]:checked").val()) {
		$(".meinput").find(".alert").show();
		inputcheck = false;
	} else if ($("input[name=familyiconme]:checked").val()) {
		$(".meinput").find(".alert").hide();
	}
	  return inputcheck;
}


//add input field
function addNewMember() {
	if (checkInput() && memberNumber < 10) {
		//will not render new position if no input is given
		$(".iconselector-container").append(
			"<fieldset>" +
			"<div class='card-body  familyinput' id='familyinput-" + memberNumber + "'>" +
			'<button  class="btn btn-danger" onclick="removeMember(this)">Remove</button>' +
			'<div class="form-row">' +
			'<div class="col">' +
			"<label for='familyname-" + memberNumber + "'>Name:</label><br>" +
			"<input type='text' class='familyname form-control' id='familyname-" + memberNumber + "'>" +
			'</div>' +
			' <div class="col">' +
			"<label for='familyrelationship-" + memberNumber + "'>This person is my:</label><br>" +
			"<input type='text'  id='familyrelationship-" + memberNumber + "' class='familyrelationship form-control'>" +
			'</div>' +
			' <div class="col">' +
			'<label for="icon-selector-' + memberNumber + '">Choose an avatar from below</label>' +
			'<div class="icon-selector">' +
            '<img src="icon-1.png" alt="">'+
			'<input id="familyicon-0' + memberNumber + '" type="radio" name="familyicon' + memberNumber + '" value="familyicon-0" />' +
			'<label class="iconlabel familyicon-0" for="familyicon-0' + memberNumber + '"></label>' +
            '<img src="icon-2.png" alt="">'+
			'<input id="familyicon-1' + memberNumber + '" type="radio" name="familyicon' + memberNumber + '" value="familyicon-1" />' +
			'<label class="iconlabel familyicon-1"for="familyicon-1' + memberNumber + '"></label>' +
            '<img src="icon-3.png" alt="">'+
			'<input id="familyicon-2' + memberNumber + '" type="radio" name="familyicon' + memberNumber + '" value="familyicon-2" />' +
			'<label class="iconlabel familyicon-2"for="familyicon-2' + memberNumber + '"></label>' +
            '<img src="icon-4.png" alt="">'+
			'<input id="familyicon-3' + memberNumber + '" type="radio" name="familyicon' + memberNumber + '" value="familyicon-3" />' +
			'<label class="iconlabel familyicon-3"for="familyicon-3' + memberNumber + '"></label>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div class="alert alert-danger" role="alert" id="alert-' + memberNumber + '" style="display:none">' +
			' Plese input your family member\'s information!' +
			' </div>' +
			"</div>" +
			"</fieldset>"

		);

		//new position of the add button
		$('#addnewinput').remove();
		$(".iconselector-container").append(
			'  <div class="form-row">' +
			'<div class="col-lg-4" ></div>' +
			'   <button onclick="addNewMember()" id="addnewinput">Add another family member</button>' +
			'</div>' +
			' </div>'
		);

	}
}


//remove a family member's input field when it is not wanted
function removeMember(a) {
	  $(a).parent().parent().remove();
}

//prepare the data for the mapping, check the input and start the mapping
function start() {
	checkInput();
	if (checkInput()) {
		var id = 0;
		var x = 200;
		var y = 200;

		//initialise user's data
		var meData = {
			name: "me",
			relationship: "N/A",
			id: 0,
			x: 400 - 25,
			y: 300 - 25, //half the width and height of the image
			avatar: 0

		};
		var meIcon = $("input[name=familyiconme]:checked").val();
		avatar = meIcon.match(/familyicon-(\d+)/)[1];
		meData.avatar = Number(avatar);
		data.nodes.push(meData);

		id = 0; //0 is me, family members start from 1



		// initialise the family member's data
		$(".familyinput").each(function() {
			id++;
			//init the temporary data
			var familymemberData = {
				name: "",
				relationship: "",
				id: 0,
				x: 0,
				y: 0,
				avatar: 0
			};
			var serial = $(this).find('.familyname').attr("id").match(/familyname-(\d+)/)[1];
			var selectedicon = $('input[name=familyicon' + serial + ']:checked').val();
			avatar = selectedicon.match(/familyicon-(\d+)/)[1];
			avatar = Number(avatar);
			familymemberData.avatar = avatar;
			familymemberData.name = $(this).find('.familyname').val();
			familymemberData.relationship = $(this).find('.familyrelationship').val();
			familymemberData.id = id;
			data.nodes.push(familymemberData);


		});


		// startMapping
		$(".iconselector-container").remove();
		startMapping();
	}
}


// d3v4
//data for nodes and links
var data = {
	nodes: [],
	links: []
};
//avatar urls
var familyimages = ["icon-1.png", "icon-2.png", "icon-3.png", "icon-4.png"];
var tempLink = {
	firstNode: null,
	secondNode: null
};
//svg elements
var svg, layer0, layer1, layer2, links, nodes, texts;

//main function
function startMapping() {
	$("#familymappingsubmit").show();
	$('#familytutorial').show();

	//append our main element for all the graphics
	svg = d3.select(".svg-container")
		.append("svg")
		.attr("width", 800)
		.attr("height", 600);


	//group the elements
	layer0 = svg.append('g');
	layer1 = svg.append('g');
	layer2 = svg.append('g');
	layer3 = svg.append('g');



	//append the arrow
	svg.append("defs").selectAll("marker")
		.data(["arrow"]) //used for id
		.enter()
		.append("marker")
		.attr("id", function(d) {
			return d;
		})
		.attr("viewBox", "0 -5 10 10")
		.attr("refX", 30)
		.attr("refY", 0)
		.attr("markerWidth", 10)
		.attr("markerHeight", 10)
		.attr("orient", "auto")
		.append("path")
		.attr("d", "M0,-5L10,0L0,5");



	// data to generate the target: three circles
	//origin:(400,300)
	var targetData = [{
		cx: 400,
		cy: 300,
		r: 300,
		color: '#D4DDE5 '

	}, {
		cx: 400,
		cy: 300,
		r: 200,
		color: '#90A4C1'

	}, {
		cx: 400,
		cy: 300,
		r: 80,
		color: '#2685D4' //deepest color in the middle, representing the closest relationship tp the people in that area

	}];



	//draw the target, origin:500,300
	target = layer0.selectAll("circle")
		.data(targetData)
		.enter()
		.append('circle')
		.attr("cx", function(d, i) {
			  return d.cx;
		})
		.attr("cy", function(d, i) {
			  return d.cy;
		})
		.attr("r", function(d, i) {
			  return d.r;
		})
		    .attr("fill", function(d, i) {
			      return d.color;
		});



	//place the limited area in a rectangle
	canvas = layer0
		.append('rect')
		.attr("height", 600)
		.attr("width", 800)
		.attr("x", 0)
		.attr("y", 0)
		.attr("fill", "none")
		.attr("stroke", "gray");



	//draw the nodes/family members
	nodes = layer2.selectAll("node")
		.data(data.nodes)
		.enter()
		.append('image')
		.attr('xlink:href', function(d, i) {
			return familyimages[d.avatar];
		})
		.attr("width", 50)
		.attr("height", 50)
		.attr("x", function(d, i) {
			if (i > 5) {
				  return d.x += 80;
			} else {
				  return d.x;
			}

		})
		.attr("y", function(d, i) {

			if (i > 5) {
				  return d.y += (i - 5) * 80;
			} else {
				  return d.y += i * 80;
			}
		})
		.on('click', function() {
			//store the temporary nodes
			if (tempLink.firstNode === null) {
				tempLink.firstNode = d3.select(this).datum().id;
			} else if (tempLink.firstNode != null && tempLink.secondNode === null && tempLink.firstNode != d3.select(this).datum().id) {

				tempLink.secondNode = d3.select(this).datum().id;
				//redraw the links
				if (data.links.length == 0) {
					var newlink = {
						source: tempLink.firstNode,
						target: tempLink.secondNode
					};
					data.links.push(newlink);
					drawLinks();
					tempLink.firstNode = null;
					tempLink.secondNode = null;
				} else if (data.links.length != 0) {

					links.each(function(l, li) {
						if ((l.source == tempLink.firstNode && l.target == tempLink.secondNode) || (l.source == tempLink.secondNode && l.target == tempLink.firstNode)) {
							// this.remove();
							data.links.splice(li, 1); //remove the link in the data array
							layer1.selectAll("line").remove().exit();
							redrawLinks();
							tempLink = {
								firstNode: null,
								secondNode: null
							};
						} else if (li == data.links.length - 1 && tempLink.firstNode != null) {
							layer1.selectAll("line").remove().exit();
							var newlink = {
								source: tempLink.firstNode,
								target: tempLink.secondNode
							};
							data.links.push(newlink);
							redrawLinks();
							tempLink.firstNode = null;
							tempLink.secondNode = null;
						}
					});

				}



			}

		})



		.call(d3.drag().on("drag", function(d, i) {

			x = d3.event.x;
			y = d3.event.y;

			if (x > 0 && y > 0 && x < 800 && y < 600) {

				//change data.nodes
				d3.select(this).datum().x = d3.event.x;
				d3.select(this).datum().y = d3.event.y;
				//change texts position
				texts.remove().exit();
				reDrawTexts();
				d3.select(this).attr("x", x).attr("y", y);
				//change link position
				thisNode = d3.select(this).datum().id;
				d3.selectAll('line').each(function(l, i) {
					if (l.source == thisNode) {
						d3.select(this).attr("x1", x).attr("y1", y);
					} else if (l.target == thisNode) {
						d3.select(this).attr("x2", x).attr("y2", y);
					}
				});



			}


		}));


	texts = layer3.selectAll("text")
		.data(data.nodes)
		.enter()
		.append('text')
		.text(function(d, i) {
			return d.name;
		})
        .attr('fill','#FCB4BC')
        .attr('font-size','20px')
		.attr("x", function(d, i) {
			  return d.x;
		})
		.attr("y", function(d, i) {
			  return d.y;
		});


}

//draw the connections
function drawLinks() {
	links = layer1.selectAll("link")
		.data(data.links)
		.enter()
		.append("line")
		.attr("class", "link")
		.attr("x1", function(l) {
			var sourceNode = data.nodes.filter(function(d, i) {
				  return i == l.source;
			})[0];
			d3.select(this).attr("y1", sourceNode.y);
			  return sourceNode.x;
		})
		.attr("x2", function(l) {
			var targetNode = data.nodes.filter(function(d, i) {
				  return i == l.target;
			})[0];
			d3.select(this).attr("y2", targetNode.y);
			  return targetNode.x;
		})
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("stroke-width", 2)
		.attr("transform", "translate(" + 30 + "," + 30 + ")")
		.attr("marker-end", "url(#arrow)");
}
//redraw the texts using name
function reDrawTexts() {
	texts = layer3.selectAll("text")
		.data(data.nodes)
		.enter()
		.append('text')
		.text(function(d, i) {
			return d.name;
		})
        .attr('fill','#FCB4BC')
        .attr('font-size','20px')
		.attr("x", function(d, i) {
			  return d.x;
		})
		.attr("y", function(d, i) {
			  return d.y;
		});
}

function redrawLinks() {
	links = layer1.selectAll("node")
		.data(data.links)
		.enter()
		.append("line")
		.attr("class", "link")
		.attr("x1", function(l) {
			var sourceNode = data.nodes.filter(function(d, i) {
				  return i == l.source;
			})[0];
			d3.select(this).attr("y1", sourceNode.y);
			  return sourceNode.x;
		})
		.attr("x2", function(l) {
			var targetNode = data.nodes.filter(function(d, i) {
				  return i == l.target;
			})[0];
			d3.select(this).attr("y2", targetNode.y);
			  return targetNode.x;
		})
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("stroke-width", 2)
		.attr("transform", "translate(" + 30 + "," + 30 + ")")
		.attr("marker-end", "url(#arrow)");
}


// //redraw the texts using relationships
// function reDrawTextsUseRelation() {
// 	texts = layer3.selectAll("text")
// 		.data(data.nodes)
// 		.enter()
// 		.append('text')
// 		.text(function(d, i) {
// 			return d.relationship;
// 		})
// 		.attr("x", function(d, i) {
// 			return d.x
// 		})
// 		.attr("y", function(d, i) {
// 			return d.y
// 		});
//
// }