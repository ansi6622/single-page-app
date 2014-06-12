# Single Page App Exercise

* `bundle`
* `rake db:create db:migrate db:seed`

Run specs with `rspec`.

Run the app locally with `rails s`.

# Setup

* Import stories from `resources/stories.csv`

# Project

You work at an organization where there is a back-end team that writes APIs, and an front-end team that writes 
javascript apps.  You are on the team that writes the js app.
 
The only API documentation is the specs that they write, which in this case are located in `spec/requests/api_spec.rb`.

## URLs

The only endpoint you need is the `/api/people` route.  All the other API endpoints are included in the API responses.

For more information on hypermedia APIs, see http://tools.ietf.org/html/draft-kelly-json-hal-03

## Setup

* Make sure that Firefox is installed (used for running Selenium tests)
* Add the `ejs` gem (see http://embeddedjs.com/ for more details)
* Add the `ejs` plugin to RubyMine
    * Go to Preferences > Plugins > Browse Repositories 
    * Search EJS
    * Right-click to install
    * Restart Rubymine)
* Be sure to restart your server after adding the `ejs` gem
* Add a file which will store your people app, and initialize the app in the view
* Create a `app/assets/javascripts/templates` directory and add your `.jst.ejs` templates in that directory

# HTML / CSS

This project includes some pre-built HTML / CSS if you want to use it.  Visit `/styles` to see them in action.

# Goals

Software developers are good at taking requirements, breaking them down into small pieces, and then writing software
 to meet the requirements.  The primary goal of this project is to give you another opportunity to break a problem
 down into smaller pieces and make steady progress.  While writing this code, try to:
 
* Keep a positive disposition
* Focus on shipping software first, in small increments
* After each finished story, discuss things that you don't fully understand, and refactor code that smells

The technical goals of this project are to introduce you to some of the basic concepts of single-page js apps, such as:

* javascript templates
* jQuery event binding
* jQuery ajax, generating and sending JSON requests
* gracefully, handling UI concerns, like cancel buttons and validation errors
