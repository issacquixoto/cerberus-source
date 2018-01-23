/*
 * Cerberus Copyright (C) 2013 - 2017 cerberustesting
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This file is part of Cerberus.
 *
 * Cerberus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Cerberus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Cerberus.  If not, see <http://www.gnu.org/licenses/>.
 */

var imagePasteFromClipboard = undefined;//stock the picture if the user chose to upload it from his clipboard

function openModalManualFile(action,manualFile,mode,idex,file){
	
	if ($('#editManualFileModal').data("initLabel") === undefined){	
		initModalManualFile(file, mode)
		$('#editManualFileModal').data("initLabel", true);
	}
	
	if (mode === "EDIT"){
		editManualFileClick(file);
	}else if (mode == "ADD"){
		addManualFileClick(file);
	}
	
	$("#editManualFileButton").off("click");
	$("#editManualFileButton").click(function() {
		confirmManualFileModalHandler(action,manualFile,"EDIT",idex,file);
	});
	$("#addManualFileButton").off("click");
	$("#addManualFileButton").click(function() {
		confirmManualFileModalHandler(action,manualFile,"ADD",idex,file);
	});
	$("#deleteManualFileButton").off("click");
	$("#deleteManualFileButton").click(function() {
		confirmManualFileModalHandler(action,manualFile,"DELETE",idex,file);
	});
}

function initModalManualFile(file, mode){
	console.info("init");
	var doc = new Doc();
	$("[name='buttonClose']").html(
			doc.getDocLabel("page_global", "buttonClose"));
	$("[name='buttonAdd']").html(doc.getDocLabel("page_global", "btn_add"));	
	$("[name='buttonEdit']").html(doc.getDocLabel("page_global", "btn_edit"));
	
	if(mode === "EDIT"){
		displayInvariantList("type", "FILETYPE",false, file.fileType, "");
	}else{
		displayInvariantList("type", "FILETYPE",false, undefined, "");
	}
	
	setUpDragAndDrop('#editManualFileModal');
    hidePasteMessageIfNotOnFirefox()
}

function editManualFileClick(manualFile){
	
	clearResponseMessage($('#editManualFileModal'));

	$('#editManualFileButton').attr('class', 'btn btn-primary');
	$('#editManualFileButton').removeProp('hidden');
	
	$('#deleteManualFileButton').attr('class', 'btn btn-danger');
	$('#deleteManualFileButton').removeProp('hidden');

	$('#addManualFileButton').attr('class', '');
	$('#addManualFileButton').attr('hidden', 'hidden');

	$('#editManualFileModalForm select[name="idname"]').off("change");
	$('#editManualFileModalForm input[name="value"]').off("change");

	feedManualFileModal(manualFile,"editManualFileModal", "EDIT");
	listennerForInputTypeFile('#editManualFileModal')
	pasteListennerForClipboardPicture('#editManualFileModal');
}

function addManualFileClick(manualFile){
	
	clearResponseMessage($('#editManualFileModal'));

	$('#editManualFileButton').attr('class', '');
	$('#editManualFileButton').attr('hidden', 'hidden');
	
	$('#deleteManualFileButton').attr('class', '');
	$('#deleteManualFileButton').attr('hidden', 'hidden');
	
	$('#addManualFileButton').attr('class', 'btn btn-primary');
	$('#addManualFileButton').removeProp('hidden');

	$('#editManualFileModalForm select[name="idname"]').off("change");
	$('#editManualFileModalForm input[name="value"]').off("change");
	
	
	feedManualFileModal(manualFile, "editManualFileModal", "ADD");
	listennerForInputTypeFile('#editManualFileModal');
	pasteListennerForClipboardPicture('#editManualFileModal');
}

function confirmManualFileModalHandler(action,manualFile, mode, idex, myFile) {
	clearResponseMessage($('#editManualFileModal'));
	
	var formEdit = $('#editManualFileModal #editManualFileModalForm');
	formEdit.find("#type").attr("disabled", false);

	var sa = formEdit.serializeArray();	
	var formData = new FormData();

    for (var i in sa) {
        formData.append(sa[i].name, sa[i].value);
    }
    
    try{
        if( imagePasteFromClipboard !== undefined ){//imagePasteFromClipboard is undefined, the picture to upload should be taken inside the input
            formData.append("file",imagePasteFromClipboard);
        }else{
            var file = $("#editManualFileModal input[type=file]");
            formData.append("file",file.prop("files")[0]);
        };
        
        var temp = [];
    	temp.push(manualFile)
        
        if(action){       	
        	formData.append("action",JSON.stringify(temp))
        }else{
        	formData.append("control",JSON.stringify(temp))
        }
        formData.append("idex",idex)
        formData.append("fileName", $("#editManualFileModal").find("#dropzoneText").text())
        formData.append("fileID", myFile.id)
    }
    catch(e){
    	
    } 
    
    var myServlet = "CreateUpdateTestCaseExecutionFile"
    
    if(mode == "DELETE"){
    	var myServlet = "DeleteTestCaseExecutionFile?fileID="+myFile.id;
    }

	// Get the header data from the form.
	
	showLoaderInModal('#editManualFileModal');
	
	$.ajax({
		url : myServlet,
		async : true,
		method : "POST",
		data : formData,
		processData: false,
        contentType: false,
		success : function(data) {
			// data = JSON.parse(data);
			if (getAlertType(data.messageType) === "success") {
				$('#editManualFileModal').data("Saved", true);
				$('#editManualFileModal').modal('hide');
				saveExecution(null)	
							
			} else {
				showMessage(data, $('#editManualFileModal'));
			}
			
			hideLoaderInModal('#editManualFileModal');
		},
		error : showUnexpectedError
	});
	
}

function feedManualFileModal(manualFile, modalId, mode) {
	clearResponseMessageMainPage();

	var formEdit = $('#' + modalId);

	if (mode === "EDIT") {
		var hasPermissions = true;
		feedManualFileModalData(manualFile, modalId, mode, hasPermissions);
		formEdit.modal('show');
	} else {
		var manualFile1 = {};
		manualFile1.fileType = "";
		manualFile1.fileDesc = "";
		manualFile1.fileName = "Drag and drop Files";
		var hasPermissions = true;
		feedManualFileModalData(manualFile1, modalId, mode, hasPermissions);
		formEdit.modal('show');
	}

}

function feedManualFileModalData(manualFile, modalId, mode, hasPermissionsUpdate) {
	var formEdit = $('#' + modalId);
	var doc = new Doc();
	var isEditable = (((hasPermissionsUpdate) && (mode === "EDIT"))
			|| (mode === "ADD"));

	// Data Feed.
	if (mode === "EDIT") {
		$("[name='editManualFileField']").html(
				doc.getDocOnline("page_global", "btn_edit"));
		formEdit.find("#application").attr("disabled", true);
		formEdit.find("#object").prop("readonly", true);
	} else if (mode === "ADD") { // DUPLICATE or ADD
		$("[name='editApplicationObjectField']").html(
				doc.getDocOnline("page_global", "btn_add"));
		formEdit.find("#application").attr("readonly", false);
		formEdit.find("#object").prop("readonly", false );
	}

	if (isEmpty(manualFile)) {
		formEdit.find("#type")[0].selectedIndex = "";
		formEdit.find("#desc").prop("value", "");
		formEdit.find("#inputFile").val("Drag and drop Files");
		
	} else{
		formEdit.find("#type").val(manualFile.fileType);
		formEdit.find("#desc").prop("value", manualFile.fileDesc);
		
		if(manualFile.fileName == ""){
			updateDropzone("Drag and drop Files","#" + modalId);
		}else{
			updateDropzone(manualFile.fileName,"#" + modalId);
		}
	}
		
	
	if (isEditable) { // If readonly, we readonly all fields
		formEdit.find("#type").prop("readonly", false);
		formEdit.find("#desc").attr("disabled", false);
		formEdit.find("#inputFile").attr("disabled", false);
	} else {
		formEdit.find("#type").prop("readonly", true);
		formEdit.find("#desc").attr("disabled", true);
		formEdit.find("#inputFile").attr("disabled", true);
		$('#editManualFileButton').attr('class', '');
        $('#editManualFileButton').attr('hidden', 'hidden');
	}
}

/**
 * add a listenner for a paste event to catch clipboard if it's a picture
 * @returns {void}
 */
function pasteListennerForClipboardPicture( idModal) {
    var _self = this;
    //handlers
    document.addEventListener('paste', function (e) { _self.paste_auto(e); }, false);
    
    //on paste
    this.paste_auto = function (e) {
        //handle paste event if the user do not select an input
        if (e.clipboardData && !$(e.target).is( "input" )) {
            var items = e.clipboardData.items;
            handlePictureSend(items, idModal);
            e.preventDefault();
        }
    };
    
}


/**
 * set up the event listenner to make a drag and drop dropzone
 * @returns {void}
 */
function setUpDragAndDrop(idModal){
    var dropzone = $(idModal).find("#dropzone")[0];
    dropzone.addEventListener("dragenter", dragenter, false);
    dropzone.addEventListener("dragover", dragover, false);
    dropzone.addEventListener("drop", function(event) { drop(event, idModal); } );
}

/**
 * prevent the browser to open the file drag into an other tab
 * @returns {void}
 */
function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
}
  
/**
 * prevent the browser to open the file drag into an other tab
 * @returns {void}
 */
function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}

/**
 * prevent the browser to open the file drag into an other tab and handle the file when the user put his file
 * @returns {void}
 */
function drop(e, idModal) {
  e.stopPropagation();
  e.preventDefault();
  
  var dt = e.dataTransfer;
  var items = dt.items;
  handlePictureSend(items,idModal);
}

/**
 * get the picture from items and update the label with the name of the 
 * return a boolean if whether or not it succeed to handle the file 
 * @param {DataTransferItemList} items 
 * @returns {boolean}
 */
function handlePictureSend(items,idModal){
    if (!items) return false;
     //access data directly
    for (var i = 0; i < items.length; i++) {
        ///check if the input is an image
            //image from clipboard found
        var blob = items[i].getAsFile();
        imagePasteFromClipboard =blob;
        var URLObj = window.URL || window.webkitURL;
        var source = URLObj.createObjectURL(blob);
        var nameToDisplay =blob.name;
        updateDropzone(nameToDisplay, idModal);
        return true;
    }
}

function hidePasteMessageIfNotOnFirefox(){
    var isOnFirefox = typeof InstallTrigger !== 'undefined';
    if ( !isOnFirefox ){
        for (var i =0; i < $('[id*="DropzoneClipboardPasteMessage"]').length; i++ ){
            $('[id*="DropzoneClipboardPasteMessage"]')[i].style.display = 'none';
        }
    } 
}


/* functions used by both modal */

/**
 * add a listenner for an input type file
 * @returns {void}
 */

function listennerForInputTypeFile(idModal){
    
    var inputs = $(idModal).find("#inputFile");
    inputs[0].addEventListener( 'change', function( e ){
    //check if the input is an image
        var fileName = '';
        if( this.files && this.files.length > 1 )
            fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
        else
            fileName = e.target.value.split( '\\' ).pop();

        if( fileName ){
            updateDropzone(fileName, idModal);
        }
    });
    
}


/**
 * change the text inside the label specified and add the attribute uploadSources
 * @param {string} id of the input the label link to
 * @param {string} message that will put inside the label
 * @param {boolean} is the picture upload should be taken from the clipboard
 * @returns {void}
 */
function updateDropzone(messageToDisplay, idModal){
    
    var dropzoneText = $(idModal).find("#dropzoneText");
    var glyphIconUpload = "<span class='glyphicon glyphicon-download-alt'></span>";
    dropzoneText.html(messageToDisplay +" "+ glyphIconUpload);
    if( imagePasteFromClipboard !== undefined ){
        //reset value inside the input
        var inputs = $(idModal).find("#inputFile")[0];
        inputs.value = "";
    }
    else{
        //reset value for the var that stock the picture inside the clipboard
        imagePasteFromClipboard = undefined;
    }
}
	
