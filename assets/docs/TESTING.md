## Testing

1. Open the resource page and read introduction informing viewer of its purpose. 




2. Check that the Metropolitan Museum of Art's API search request produces the same number of objects as the search criteria given by the form.

### Museums search API invoked
![Museums API search](../images/project_screenshots/Testing_searchAPI.jpg)

### Form's criteria search invoked
![Forms search](../images/project_screenshots/Testing_searchFORM.jpg)

For the given criteria both give a total of 13 objects found in the Metropolitan Museum of Art's collection.

### Anomaly found in API's search function.
Unfortunately found that when reversing the order of the criteria in the API call, I received only one object returned.
![Museum API reversed order search](../images/project_screenshots/Testing_searchAPIanomaly.jpg)

Added issue #36 on 7th October to API's Github and given email address: openaccess@metmuseum.org, on September 22nd 2020.
![Issue 36](../images/project_screenshots/API_Issue_36.jpg)

3. Check that a blank search term works.

### Museums search API invoked with blank 'q'

![Museums API blank search](../images/project_screenshots/Test_SearchAPI_dept21_q_blank.jpg)

### Form's criteria search invoked with blank 'q'

![Forms Search with blank q](../images/project_screenshots/Test_SearchFORM_dept21_q_blank.jpg)

### Museums search API invoked with empty quotes 'q'

![Museums API q quotes search](../images/project_screenshots/Test_SearchAPI_dept21_q_emptyquotes.jpg)

### Form's search invoked with empty quotes 'q'

![Forms Search empty quotes q](../images/project_screenshots/Test_SearchFORM_q_emptyquotes.jpg)

Although both API and Form searches match results, I believe that the returned result for blank search term 'q' to be misleading. 
Proposing to intercept blank search terms on form and replace with empty quotes.


    4. Try to submit the form with all inputs valid and verify that a success message appears.

No success message as no valid action on submit. Method will be "POST" as there is personal information.

### Responsiveness on search results

Using [Am I Responsive](http://ami.responsivedesign.is/)

At first the search results looked OK, but wider viewports could utilise the right hand side for the artwork's details, whilst the left hand side is left for the image(s).

![Found objects responsive](../images/project_screenshots/Testing_responsive_2020-10-07.jpg)

Testing different screen sizes:
| Chrome's Inspect emulator           | width  | breakpoint |
|-------------------------------------|--------|------------|
| Nokia Lumia                         | 320px  | (default)  |
| Nexus 7                             | 600px  | sm         |
| iPad :                              | 768px  | sm/md      |
| Kindle Fire:                        | 800px  | md         |
| iPad Pro:                           | 1024px | lg         |
| Laptop with MDPI screen             | 1280px | xl         |


### Peer review and feedback
