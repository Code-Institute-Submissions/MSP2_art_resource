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

Sent email querying this to the site's given email address: openaccess@metmuseum.org, on September 22nd 2020.

3. 
    4. Try to submit the form with all inputs valid and verify that a success message appears.

No success message as no valid action on submit. Method will be "POST" as there is personal information.



Testing different screen sizes:
| Chrome's Inspect emulator           | width  | breakpoint |
|-------------------------------------|--------|------------|
| Nokia Lumia                         | 320px  | (default)  |
| Nexus 7                             | 600px  | sm         |
| iPad :                              | 768px  | sm/md      |
| Kindle Fire:                        | 800px  | md         |
| iPad Pro:                           | 1024px | lg         |
| Laptop with MDPI screen             | 1280px | xl         |

Had a separate Kindle Fire to see responsiveness on all pages of changes from landscape to portrait views.
Landscape had button link navigation whilst portrait had 'hamburger' menu drop downs.

### Peer review and feedback
