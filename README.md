- [MSP2_art_resource](#msp2-art-resource)
  * [UX](#ux)
    + [Strategy](#strategy)
    + [Scope](#scope)
    + [Structure](#structure)
    + [Skeleton](#skeleton)
    + [Surface](#surface)
  * [Features](#features)
    + [Metropolitan Museum of Art's Collection API](#metropolitan-museum-of-art-s-collection-api)
    + [Existing Features](#existing-features)
    + [Features Left to Implement](#features-left-to-implement)
  * [Technologies Used](#technologies-used)
  * [Testing](#testing)
  * [Deployment](#deployment)
  * [Credits](#credits)
    + [Content](#content)
    + [Media](#media)
    + [Acknowledgements](#acknowledgements)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

# MSP2_art_resource

[Code Institute's](https://codeinstitute.net/) Milestone Project 2.

Using New York Metropolitan Museum of Art's JSON API of their collection as an illustrative art resource for an art club. Utilising the API's search tool to search out art objects for reference and education of all members and visitors to the art club.
 
## UX
 
User Stories:
- as a member of the hosting site's art club, they will use page to access New York's Museum of Art's collection for reference.
- as a general art-loving browser will be able to easily search the collection with appropriate parameters.
- easily read details of the objects found will be displayed for reference.

### Strategy
To provide an easier-to-use application for the Museum's provided API portal of it's collections.

### Scope
By the nature of art collections the core will be display of images of the collection, corresponding to the functionality provided by the Application Programming Interface (API).
- The museum's departments can be listed using their API [Departments endpoint](https://collectionapi.metmuseum.org/public/collection/v1/departments).
- The search criteria used by the API search [Search endpoint](https://collectionapi.metmuseum.org/public/collection/v1/search).
- The found art work details are then displayed on screen, using [Object endpoint](https://collectionapi.metmuseum.org/public/collection/v1/objects/[objectID]).

### Structure
The information structure is led by the Museum's API data structures.
A class of found works are identified by their individual, key field 'object id's' and so can be stored as such for further display.
The information structure of these objects have been documented by the Museums API on their [page](https://metmuseum.github.io/). 


### Skeleton
There will be one page containing two modal forms.
One will display the department list over the main page when needed, selected by a button.
The other modal form prompts for search criteria to be set, again by a button.
Meanwhile, on document load, a query has been raised to find the total objects currently recorded for the collection.
This uses the API [Objects endpoint](https://collectionapi.metmuseum.org/public/collection/v1/objects)
This total is displayed near the start of the page, to advise on careful selection by the user.
Once a selection has been made, a button is displayed to show the works selected.

### Surface
A neutral, pastel blue has been selected as a uniform background colour for the main page. (#D9E6F3).
The typeface has been chosen, font family 'Roboto' with backup font family of 'Arial'.


[Wireframes mockup](assets/docs/MSP2_art_resource.pdf)
A PDF format version can be found within the project's Assets/docs subdirectory.


## Features

### Metropolitan Museum of Art's Collection API
An application Programming Interface specifically for documenting New York's vast collection af artifacts. 
[Metropolitan Museum of Art API](https://metmuseum.github.io/)
 
### Existing Features
- Feature 1 - allows users to see the museum's current departmental structure.
- Feature 2 - allows interested viewers to select areas of interest from the Museum's collection.
- Feature 3 - displays the selected works, if found, 5 works at a time.
- Feature 4 - Department names to be selected rather than their numeric 'departmentId' within the search form. 
              The corresponding departmentId will be looked up in the background and used for the search within the API's endpoint.

### Features Left to Implement

- A facility to download or print found works and their details.
- Display a work's additional images as thumbnails, possibly on a carousel.
- Incorporate the resource page into a wider art club website.
- Sort found works on a selected object field.

## Technologies Used

In this section, you should mention all of the languages, frameworks, libraries, and any other tools that you have used to construct this project. 
For each, provide its name, a link to its official site and a short sentence of why it was used.

- [Bootstrap](https://getbootstrap.com/) to provide a mobile-first responsive framework for the site.
- [Font Awesome](https://fontawesome.com/) to provide additional icons
- [JQuery](https://jquery.com)
    - The project uses **JQuery** to simplify DOM manipulation.
- [TOC for markdown](https://ecotrust-canada.github.io/markdown-toc/) to generate table of contents for README


## Testing

For the sake of brevity, see separate link for testing procedures :
[Testing](assets/docs/TESTING.md)

### HTML Validated
[W3.org Validator](https://validator.w3.org/nu/?doc=https://mikedjgreen.github.io/MSP2_art_resource/index.html).

### CSS Validated
[W3C Validator](http://jigsaw.w3.org/css-validator/validator?uri=https://mikedjgreen.github.io/MSP2_art_resource/assets/css/stylesheet.css).

## Deployment

Developed on GitPod using git and GitHub.
Selected Repository : mikedjgreen/MSP2_art_resource
Generated from:[Code Institute template]( https://github.com/Code-Institute-Org/gitpod-full-template)

Deployment steps:
- opened up GitHub
- signed in
- selected repository mikedjgreen/MSP1_art_club
- navigated to repository
- selected 'settings'
- scrolled to GitHub pages area
- selected 'Master Branch' from the source drop down menu
- confirmed selected
Now live on GitHub pages.

To run this code on your local machine, you would go to my repository at https://github.com/mikedjgreen/MSP2_art_resource and on the home page on the right hand side just above all the files, you will see a green button that says, "Clone or download", this button will give you options to clone with HTTPS, open in desktop or download as a zip file.
To continue with cloning, you would:
- Open Git Bash
- Change the current working directory to the location where you want the cloned directory to be made.
- Type git clone, and then paste this URL: https://github.com/mikedjgreen/MSP2_art_resource.git Press Enter. Your local clone will be created.

For more information about the above process; https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository


The project is built to a master branch deployed to: 
https://mikedjgreen.github.io/MSP2_art_resource/ .
There is no separate git branch.

## Credits

### Content
- The details and images are directly attributable to the New York Metropolitan Museum of Art [Metropolitan Museaum Art Collection](https://www.metmuseum.org/art/collection)

### Media
- The photos used in this site again were obtained from Metropolitan Museum of Art.

### Acknowledgements

- I received inspiration for this project from [programmableweb](https://www.programmableweb.com/api-university) 
- More technical help on javascript from [w3schools](https://www.w3schools.com/js/default.asp)
