function PersonView(firstName, lastName, address, url, $personDiv) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.address = address;
  this.url = url;
  this.$personDiv = $personDiv;

  $(document).on("submit", "[data-behavior=update-person]", this.didSubmitPersonUpdateForm.bind(this));
  $personDiv.on("click", "[data-behavior=edit-person]", this.didClickEditLink.bind(this));
  $personDiv.on("click", "[data-behavior=delete-person]", this.didClickDeleteLink.bind(this));
  $personDiv.on("click", "[data-behavior=cancel-edit]", this.didClickCancelEditLink.bind(this));
}

PersonView.prototype.didClickEditLink = function () {
  var $html = JST['templates/person_edit']({
    first_name: this.firstName,
    last_name: this.lastName,
    address: this.address,
    url: this.url
  });
  this.$personDiv.html($html);
  return false;
};

// This function is called when a person clicks the delete link for a person
// It is responsible for:
//
//  * asking the user to confirm whether or not they really want to delete the person
//  * sending a DELETE request to the server
//  * setting up the callbacks that will be triggered when the server returns a 200 OK
//  * NOTE: we don't normally expect a failure case on delete, so we don't explicitly handle the error out of laziness
//
PersonView.prototype.didClickDeleteLink = function (event) {
  if (confirm("Are you sure?")) {
    var jqxhr = $.ajax({
      type: "DELETE",
      url: event.target.href
    });

    jqxhr.done(function () { this.$personDiv.remove();}.bind(this));
  }
  return false;
};

// This function is called when a person clicks the cancel link after clicking "edit" on a person
// It is responsible for:
//
//  * replacing the person's edit form with the "show" div for that person
//  * making sure that the new "show" div has a reference to the JSON for that person
//
PersonView.prototype.didClickCancelEditLink = function (event) {
  var $html = $(JST['templates/person_show']({
    first_name: this.firstName,
    last_name: this.lastName,
    address: this.address,
    url: this.url
  }));
  this.$personDiv.html($html);
  return false;
};

// This function is called when a person clicks the submit button on an edit person form
// It is responsible for:
//
//  * creating a json string to send to the server, based off of the form fields (first name, last name etc...)
//  * sending that json string to the server with a PATCH request
//  * setting up the callbacks that will be triggered when the server returns a 200 OK
//  * setting up the callbacks that will be triggered when the server returns with validation errors
//
PersonView.prototype.didSubmitPersonUpdateForm = function (event) {
  event.preventDefault();

  var formParams = {};
  $.each($(event.target).serializeArray(), function() {
    formParams[this.name] = this.value;
  });
  var jsonForServer = JSON.stringify(formParams);

  var jqxhr = $.ajax({
    type: "PATCH",
    url: event.target.action,
    data: jsonForServer,
    dataType: 'json',
    contentType: 'application/json'
  });

  jqxhr.done(function (object) { this.personWasUpdated(event.target, object); }.bind(this));
  jqxhr.fail(function (xhr) { this.personWasNotSaved(event.target, xhr.responseJSON); }.bind(this));
};

// This function is called when the server returns with validation errors after attempting to create or update a person
// It is responsible for:
//
//  * adding errors messages to the form
//  * adding styles to the form fields to show which ones have errors
//
PersonView.prototype.personWasNotSaved = function (form, errors) {
  var $form = $(form);
  var html = JST['templates/errors']({messages: errors.full_messages});
  $form.find("[data-container=errors]").html(html);
  $form.find(".field-with-errors").removeClass("field-with-errors");
  $.each(errors.fields, function () {
    $form.find("input[name=" + this + "]").closest(".form-row").addClass("field-with-errors");
  });
};

// This function is called when the server returns a 200 OK response after updating a person
// It is responsible for:
//
//  * replacing the "edit" view of the person with the "show" view for that person
//  * making sure that the new "show" view has a reference to the most recent data for the person
//
PersonView.prototype.personWasUpdated = function (form, person) {
  var $form = $(form);
  $form.find("[data-container=errors]").empty();
  $form.find(".field-with-errors").removeClass("field-with-errors");
  form.reset();
  var $html = $(JST['templates/person_show'](person));
  $html.data('person', person);
  $form.closest(".person").replaceWith($html);
};
