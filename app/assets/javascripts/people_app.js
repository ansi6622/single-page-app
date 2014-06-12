// DISCLAIMER:
//
// This is just one implementation of many, many possible implementations.
// This was written specifically to highlight some specific techniques, such as:
//
//  * generating json strings from forms
//  * iterating through data in templates (errors.jst.ejs) as well as in javascript (renderInitialPage)
//  * storing the JSON data along with DOM elements
//
// We don't necessarily endorse any of these techniques as best-practices for building apps, but we do think they
// are concepts that can be helpful to understand.
//

window.PeopleApp = {

  initialize: function (path) {
    $.getJSON(path, this.renderInitialPage);
    $(document).on("submit", "[data-behavior=create-person]", this.didSubmitPersonCreateForm.bind(this));
  },

  // This function is called with data from GET /people
  // It is responsible for:
  //
  //  * appending the new-person-form to the page
  //  * iterating through each person appending the person-show dom to the page
  //
  renderInitialPage: function (response) {
    var html = JST['templates/person_new']({
      url: response._links.self.href,
      first_name: response._embedded.person.first_name,
      last_name: response._embedded.person.last_name,
      address: response._embedded.person.address
    });
    $("[data-container=main]").append(html);

    $.each(response._embedded.people, function () {
      var $personDiv = $("<div class=person></div>");
      $personDiv.append($(JST['templates/person_show'](this)));
      $("[data-container=people]").append($personDiv);

      var person = new PersonView(
        this.first_name,
        this.last_name,
        this.address,
        this._links.self.href,
        $personDiv
      );
    });
  },

  // This function is called when a person clicks the submit button on the new person form
  // It is responsible for:
  //
  //  * creating a json string to send to the server, based off of the form fields (first name, last name etc...)
  //  * posting that json string to the server
  //  * setting up the callbacks that will be triggered when the server returns a 200 OK
  //  * setting up the callbacks that will be triggered when the server returns with validation errors
  //
  didSubmitPersonCreateForm: function (event) {
    event.preventDefault();

    var formParams = {};
    $.each($(event.target).serializeArray(), function (object) {
      formParams[this.name] = this.value;
    });
    var jsonForServer = JSON.stringify(formParams);

    var jqxhr = $.ajax({
      type: "POST",
      url: event.target.action,
      data: jsonForServer,
      dataType: 'json',
      contentType: 'application/json'
    });

    jqxhr.done(function (object) {
      this.personWasCreated(event.target, object);
    }.bind(this));

    jqxhr.fail(function (xhr) {
      this.personWasNotSaved(event.target, xhr.responseJSON);
    }.bind(this));
  },

  // This function is called when the server returns a 200 after creating a person
  // It is responsible for:
  //
  //  * resetting the "new" form (removing error messages, clearing the fields etc...)
  //  * appending a new person to the list of people
  //
  personWasCreated: function (form, person) {
    $("[data-container=errors]").empty();
    $(".field-with-errors").removeClass("field-with-errors");
    form.reset();
    var $html = $(JST['templates/person_show'](person));
    $("[data-container=people]").append($html);
  },

  // This function is called when the server returns with validation errors after attempting to create or update a person
  // It is responsible for:
  //
  //  * adding errors messages to the form
  //  * adding styles to the form fields to show which ones have errors
  //
  personWasNotSaved: function (form, errors) {
    var $form = $(form);
    var html = JST['templates/errors']({messages: errors.full_messages});
    $form.find("[data-container=errors]").html(html);
    $form.find(".field-with-errors").removeClass("field-with-errors");
    $.each(errors.fields, function () {
      $form.find("input[name=" + this + "]").closest(".form-row").addClass("field-with-errors");
    });
  }

};