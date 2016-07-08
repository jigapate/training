$(document).ready( function () {

			//EVENT DRAGABLE
			$("#event-modal").draggable({
				handle: ".modal-header"
			});
			 
			//DATE PICKER CONFIGURATION 
			if(jQuery().datepicker) {
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                format: 'yyyy-mm-dd',
                orientation: "left",
                autoclose: true,
                todayBtn: "linked",
                todayHighlight: true
            });
            }

			$('.timepicker-no-seconds').timepicker({
                autoclose: true,
                minuteStep: 5
            });
           
            //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
		
            if (!jQuery().fullCalendar) {
                return;
            }

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            var h = {};

            if (Metronic.isRTL()) {
                if ($('#calendar').parents(".portlet").width() <= 720) {
                    $('#calendar').addClass("mobile");
                    h = {
                        right: 'title, prev, next',
                        center: '',
                        left: 'agendaDay, agendaWeek, month, today'
                    };
                } else {
                    $('#calendar').removeClass("mobile");
                    h = {
                        right: 'title',
                        center: '',
                        left: 'agendaDay, agendaWeek, month, today, prev,next'
                    };
                }
            } else {
                if ($('#calendar').parents(".portlet").width() <= 720) {
                    $('#calendar').addClass("mobile");
                    h = {
                        left: 'title, prev, next',
                        center: '',
                        right: 'today,month,agendaWeek,agendaDay'
                    };
                } else {
                    $('#calendar').removeClass("mobile");
                    h = {
                        left: 'title',
                        center: '',
                        right: 'prev,next,today,month,agendaWeek,agendaDay'
                    };
                }
            }

            var initDrag = function(el) {
                // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                // it doesn't need to have a start or end
                var eventObject = {
                    title: $.trim(el.text()) // use the element's text as the event title
                };
                // store the Event Object in the DOM element so we can get to it later
                el.data('eventObject', eventObject);
                // make the event draggable using jQuery UI
                el.draggable({
                    zIndex: 999,
                    revert: true, // will cause the event to go back to its
                    revertDuration: 0 //  original position after the drag
                });
            };

            


            $('#calendar').fullCalendar('destroy'); // destroy the calendar
            $('#calendar').fullCalendar({ //re-initialize the calendar
                header: h,
				weekNumbers: true,
				timeFormat: 'hh(:mm) A',
                defaultView: 'month', // change default view with available options from http://arshaw.com/fullcalendar/docs/views/Available_Views/ 
                slotMinutes: 15,
				
				selectable: true,
				
                editable: true,
				
                droppable: true, // this allows things to be dropped onto the calendar !!!
				/*eventMouseover :function (calEvent, jsEvent, view) {
					
					jQuery.ajax({
						url: baseURL + "index.php/agent/calendar/editEvent",
						data: {event_id:calEvent.event_id},
						type: "POST",
						success:function(data){	
						var objData = jQuery.parseJSON(data);
						
								//Bootup Model
								$('#event-modal').modal({
									//backdrop: 'static'
									
								});
							
							$("#event_id").val(objData.event_id);
							$("#event_name").val(objData.event_name);
							$("#event_category").select2("val", objData.event_category);
							$("#event_startdate").val(moment(objData.event_startdate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
							$("#event_starttime").val(moment(objData.event_starttime, 'HH:mm:ss').format('h:mm A'));
							$("#event_enddate").val(moment(objData.event_enddate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
							$("#event_endtime").val(moment(objData.event_endtime, 'HH:mm:ss').format('h:mm A'));
							$("#event_note").val(objData.event_note);
							
							Metronic.unblockUI();
								} //Success End
					}); //AJAX End
				},*/

				drop: function(date, allDay) { // this function is called when something is dropped

                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = $(this).data('eventObject');
                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = $.extend({}, originalEventObject);

                    // assign it the date that was reported
                    copiedEventObject.start = date;
                    copiedEventObject.allDay = allDay;
                    copiedEventObject.className = $(this).attr("data-class");

                    // render the event on the calendar
                    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                    $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

                    // is the "remove after drop" checkbox checked?
                    if ($('#drop-remove').is(':checked')) {
                        // if so, remove the element from the "Draggable Events" list
                        $(this).remove();
                    }
                },
				
			
				//CLICK ON EXISTING EVENT
				eventClick:function (calEvent, jsEvent, view) {
					
					jQuery.ajax({
						url: baseURL + "MyCalendar/editEvent",
						data: {event_id:calEvent.event_id},
						type: "POST",
						success:function(data){
						var objData = jQuery.parseJSON(data);
						
								//Bootup Model
								$('#event-modal').modal({
									//backdrop: 'static'
									
								});
							
							$("#event_id").val(objData.event_id);
							$("#event_name").val(objData.event_name);
							$("#event_category").select2("val", objData.event_category);
							$("#event_startdate").val(moment(objData.event_startdate, 'YYYY-MM-DD').format('YYYY-MM-DD'));
							$("#event_starttime").val(moment(objData.event_starttime, 'HH:mm:ss').format('h:mm A'));
							$("#event_enddate").val(moment(objData.event_enddate, 'YYYY-MM-DD').format('YYYY-MM-DD'));
							$("#event_endtime").val(moment(objData.event_endtime, 'HH:mm:ss').format('h:mm A'));
							$("#event_note").val(objData.event_note);
							
							Metronic.unblockUI();
								} //Success End
					}); //AJAX End
				},
				
				//CLICK AND ADD EVENT
				select: function (start, end, allDay) {
					//Set defaults	
					$("#event_id").val('');
					$("#event_name").val('');
					$("#event_category").select2("val", '');
					$("#event_startdate").val(moment(start).format('YYYY-MM-DD'));
					$("#event_enddate").val(moment(start).format('YYYY-MM-DD'));
					$("#event_note").val('');
					//Bootup Model
					$('#event-modal').modal({
					backdrop: 'static'
					});
				},
				
				eventResize: function(calEvent, delta, revertFunc) {

					alert(calEvent.title + " end is now " + calEvent.end.format());
			
					if (!confirm("is this okay?")) {
						revertFunc();
					}
			
				},
					
				events: baseURL + "MyCalendar/getEvents"
}); //Calendar intialization End


//ADD/UPDATE EVENT VALIDATION
				
                var form1 = $('#event_fm');
				var error = $('.alert-danger', form1);
				var success = $('.alert-success', form1);

				form1.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",  // validate all fields including form hidden input
               
                rules: {
                    event_name: {
                        required: true
                    },
					event_startdate: {
                        required: true
                    },
					event_enddate: {
                        required: true
                    },
                },

                invalidHandler: function (event, validator) { //display error alert on form submit              
                    success.hide();
                    error.show();
                    Metronic.scrollTo(error, -200);
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.form-group').addClass('has-error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.form-group').removeClass('has-error'); // set error class to the control group
                },

                success: function (label) {
                    label
                        .closest('.form-group').removeClass('has-error'); // set success class to the control group
                },
				
				submitHandler: function(form, calEvent) {
					
					event_id = $('#event_id').val();
                    title = $('#event_name').val();
					event_category = $('#event_category').val();
					event_note = $('#event_note').val();
					startdate = $('#event_startdate').val();
					enddate = $('#event_enddate').val();
					starttime = $('#event_starttime').val();
					endtime = $('#event_endtime').val();
				
					//Moment must be used predefined format, https://github.com/moment/moment/issues/1407
					var event_startdate = moment(startdate, "YYYY-MM-DD").format('YYYY-MM-DD');
					var event_enddate = moment(enddate, "YYYY-MM-DD").format('YYYY-MM-DD');
					var event_starttime = moment(starttime, "H:mm A").format('HH:mm:ss');
					var event_endtime = moment(endtime, "H:mm A").format('HH:mm:ss');
					
					if(event_id === '') //Add Event
					{
					
					jQuery.ajax({
					url: baseURL + "index.php/MyCalendar/addEvent",
					data: {event_name:title, event_category:event_category, event_startdate:event_startdate, event_starttime:event_starttime, event_enddate:event_enddate, event_endtime:event_endtime,  event_note:event_note },
					type: "POST",
					success: function(data){
						var objData = jQuery.parseJSON(data);
						
						$('#calendar').fullCalendar('renderEvent', {
								event_id: objData.event_id,
								title: objData.event_name,
								start: objData.event_startdate +'T'+ objData.event_starttime,
								end: objData.event_enddate +'T'+ objData.event_endtime,
								backgroundColor: objData.event_category,
								allDay: false,
								editable:true,}, true);
					
							$('#event-modal').modal('hide');
							$('#todayevents').append(objData.today_event);
							//return false;  
							$('#calendar').fullCalendar('unselect');
							} //Success End..
						});//AJAX End..
					}
					else //Update Event
					{
					
					jQuery.ajax({
					url: baseURL + "index.php/MyCalendar/addEvent",
					data: {event_id:event_id, event_name:title, event_category:event_category, event_startdate:event_startdate, event_starttime:event_starttime, event_enddate:event_enddate, event_endtime:event_endtime,  event_note:event_note },
					type: "POST",
					success: function(data){
							var objData = jQuery.parseJSON(data);
							//Here will refetch complete calendar from server, http://stackoverflow.com/questions/14842629/removing-specific-events-with-removeevents-method
							//Comparing event_id with return ID, if both same then that event will be deleted, here is one which we edited.
							$('#calendar').fullCalendar('removeEvents', function (objData) {
									if(event_id == objData.event_id)
									{
											return true;
									}
							});
										
							$('#calendar').fullCalendar('renderEvent', {
							event_id: objData.event_id,
							title: objData.event_name,
							start: objData.event_startdate +'T'+ objData.event_starttime,
							end: objData.event_enddate +'T'+ objData.event_endtime,
							backgroundColor: objData.event_category,
							allDay: false,
							editable:true,
							}, true);

							$('#event-modal').modal('hide');
							$('#calendar').fullCalendar('unselect');
							} //Success End..
					});//AJAX End..		
					}
			}//Submit handler End
				
	});//Form submit validation End
	
//DELETE EVENT
$('#delete_event').on( 'click',function () {
	event_id = $('#event_id').val();
		jQuery.ajax({
		url: baseURL + "MyCalendar/deleteEvent",
		data: {event_id:event_id },
		type: "POST",
		success: function(data){
				var objData = jQuery.parseJSON(data);
				//Here will refetch complete calendar from server, http://stackoverflow.com/questions/14842629/removing-specific-events-with-removeevents-method
				//Comparing event_id with return ID, if both same then that event will be deleted, here is one which we edited.
				$('#calendar').fullCalendar('removeEvents', function (objData) {
						if(event_id == objData.event_id)
						{
							return true;
						}
				});
				$('#event_'+ event_id).remove();
				$('#event-modal').modal('hide');
				 
				$('#calendar').fullCalendar('unselect');
			} //Success End..
		});//AJAX End..	
	
});

}); //Document loading ready end