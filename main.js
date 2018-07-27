var database = firebase.database().ref();

database.child('splitEventName').on('child_added',function(data){
	updateList(data);
	formHTML();
});
database.child('splitEventName').on('child_removed',function(data){
	removeList(data)
});
database.child('splitEventName').on('child_changed',function(data){
	updateChangedList(data);
	formHTML();
});

database.child('splitEventName').on("value", function(snapshot) {
  var length = snapshot.numChildren();
  if (length <= 0) {
  	$(".split-listing center").remove();
  }
})
function init(){
	formHTML();	
}

function formHTML(){
	var formwrap = $('#form-wrapper');
	var form = "<form class='bill-form' id='billForm' action='javascript:void(0);'><div class='row'>";
		form += "<div class='input-field col s12'><input id='event_name' type='text' class='validate' placeholder='Event Name' required='true' value='' autocomplete='off'></div>";
		form += "<div class='person_count'>";
		form += "<div class='input-field col s12'><input type='text' class='validate members' placeholder='Name'  required='true' value=''></div>";
		form += "<div class='input-field col s12'><input type='text' class='validate members' placeholder='Name'  required='true' value=''></div>";
		form +="</div>";
		form += "<div class='add-person-wrap'></div>";
		form += "<div class='col s12'><button class='btn waves-effect waves-light add-person' type='button' name='action' >Add Person</button></div>";
		form += "<div class='input-field col s12'><input type='number' class='validate amt' placeholder='Amount' required='true' value=''></div>";
		form += "<div class='col s12'><button class='btn waves-effect waves-light' id='savedata' type='submit'>Submit</button></div>";
		form += "</div></form>";
		formwrap.html(form);
		
}
function removeList(data){
	var eventKey = data.key;
	$('.split-listing .list').each(function(){
		var listKey = $(this).attr('data-id');
		if( listKey ==  eventKey){
			$(this).remove();
		}
	});
}
function updateChangedList(data){
	var eventData = data.val();
	var eventKey = data.key;

	var	table = "<div class='col m2'><input style='display:none' type='text' value='"+eventKey+"'><label>Event Name</label><p>"+eventData.eventName+"</p></div>";
		table += "<div class='col m4'><label>No. of Person</label>";
		table += "<p>";
			if(eventData.members){
				for( var i = 0; i < eventData.members.length; i++ ){
					table += '<span>' +eventData.members[i]+ '</span>';
				}	
			}
		table += "</p></div>";
		table += "<div class='col m4'><div class='row'><div class='col m6'><label>Total Amount</label><p class='amt'>"+eventData.amount+"</p></div><div class='col m6'><label>Per Person Amount</label><p class='amt'>"+eventData.payAmount+"</p></div></div></div>";
		table += "<div class='col s2 btns'><a data-key='"+eventKey+"' class='waves-effect waves-light btn-small edit'>Edit</a> <a data-key='"+eventKey+"' class='waves-effect waves-light btn-small delete'>Delete</a></div>";

	$('.split-listing .list').each(function(){
		var listKey = $(this).attr('data-id');
		if( listKey ==  eventKey){
			$(this).html("");
			$(this).html(table);
		}
	});
}

function updateList(data){		
	var eventData = data.val();
	var eventKey = data.key;		

	var table = "<li data-id='"+eventKey+"' class='list row'>";
		table += "<div class='col m2'><input style='display:none' type='text' value='"+eventKey+"'><label>Event Name</label><p>"+eventData.eventName+"</p></div>";
		table += "<div class='col m4'><label>No. of Person</label>";
		table += "<p>";
			if(eventData.members){
				for( var i = 0; i < eventData.members.length; i++ ){
					table += '<span>' +eventData.members[i]+ '</span>';
				}	
			}
		table += "</p></div>";
		table += "<div class='col m4'><div class='row'><div class='col m6'><label>Total Amount</label><p class='amt'>"+eventData.amount+"</p></div><div class='col m6'><label>Per Person Amount</label><p class='amt'>"+eventData.payAmount+"</p></div></div></div>";
		table += "<div class='col s2 btns'><a data-key='"+eventKey+"' class='waves-effect waves-light btn-small edit'>Edit</a> <a data-key='"+eventKey+"' class='waves-effect waves-light btn-small delete'>Delete</a></div>";
		table += "</li>";	
	$(".split-listing center").remove();
	$('.split-listing').append(table);

}

function formValue(name,amount,val,key){
	var formwrap = $('#editbox');
	var form = "<form class='col s12' id='newform' action='javascript:void(0);'><div class='row'>";
		form += "<div class='input-field col s12'><input id='event_name' type='text' class='validate' placeholder='Event Name' required='true' value='"+name+"'></div>";
		for (myval of val){

			form += "<div class='input-field col s12'><input type='text' class='validate members' placeholder='Name'  required='true' value='"+myval+"'><div class='remove-person'>x</div></div>";
		}
		form += "<div class='add-person-wrap'></div>";
		form += "<div class='col s12'><button class='btn waves-effect waves-light add-person' type='button' name='action' >Add Person</button></div>";
		form += "<div class='input-field col s12'><input id='amt' type='number' class='validate' placeholder='Amount' required='true' value='"+amount+"'></div>";
		form += "<div class='col s12'><button class='btn waves-effect waves-light' id='updateFormData' type='submit' data-key='"+key+"' >Update</button></div>";
		form += "</div></form>";
		formwrap.html(form);
}

function update_data_table(key){
		
		var eventName = $('#event_name').val();
		var totalAmount = $('#amt').val();
		var membersObj = $("#newform .members");
		var members =[];
		membersObj.each(function(){
			members.push($(this).val());
		});
		var data = {
			eventName: eventName,
			amount: totalAmount,
			members : members,
			payAmount : calculateContribution(totalAmount,members.length)
		}
		var updates = {};
		updates['splitEventName/'+key+'/'] = data;
		database.update(updates);
		$('#newform').remove();	
}

function getFormData(){
	var obj = {};
	var members = [];
	var eventName = $('#event_name').val();
	var totalAmount = $('.amt').val();
	var membersObj = $("#billForm .members");

	membersObj.each(function(){
		members.push($(this).val());
	});

	if(eventName != "" && totalAmount != "" && members != ""){

		obj.eventName = eventName;
		obj.amount = totalAmount;
		obj.members = members;
		obj.payAmount = calculateContribution(totalAmount,members.length);

		return obj;
	}
}

function calculateContribution(totalAmount,memberCount){
	var number = totalAmount/memberCount;	
	return number.toFixed(2);
	return Math.round(number); 	
}
	
function removeData(key){
	database.child('splitEventName/'+key+'/').remove();
}

function updateData(key){

	var updateRef = database.child('splitEventName/'+key+'/');
	updateRef.once('value',function(data){
		var updatedataVal = data.val();
		
		var eventNames = data.child('eventName').val();
		var amt = data.child('amount').val();
		var memVal = data.child('members').val();
		//console.log(memVal);
		formValue(eventNames,amt,memVal,key);
	})
}

function saveData(){
	var data = getFormData();
	 if(data){
		database.child('splitEventName/').push(data);
		 $('#billForm')[0].reset();
	 }
}

//Events
$(document).on("click",".add-person",function(){
	var html ="<div class='input-field col s12'>";
		html += "<input type='text' class='validate members' placeholder='Name' required='true'>";
		html += "<div class='remove-person'>X</div>"
		html += "</div>";			          					        
	$(".add-person-wrap").append(html);
	$("form .members").focus();
});
$(document).on("click",".remove-person",function(){
	$(this).parent().remove();
});
$(document).on('click','.delete',function(e){
	removeData(e.target.getAttribute('data-key'));
})
$(document).on('click','.edit',function(e){
	$('#billForm').remove();
	updateData(e.target.getAttribute('data-key'));
})
$(document).on('click','#updateFormData',function(e){
	update_data_table(e.target.getAttribute('data-key'));
})

$(document).on('click','#savedata',saveData);

init();