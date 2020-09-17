# Edit - Publish ( - Broadcast )

WebExtension to make the web yours:
* Edit page right in your browser (via contentEditable)
* Create, Modify and Delete pages easily on your HTTP hosting (via WebDAV and PUT/DELETE HTTP methods)
* Copy an existing web page to your host

## How to test it?

### Install the add-on:

* Open about:debugging
* Select "This Firefox/Nightly"
* Click on "Load temporary Add-on..."
* Select the "manifest.json" file of this repo

### Edit a new page

* Open your HTTP hosting URL, to a new file, like http://myhosting.com/foo
* Click "edit" button, the page is now editable
* Click "publish" button, the page has been updated on your HTTP hosting (assuming your have WebDAV enabled on your hosting)

### Copy a page

* Open the page you want to copy
* Click "publish" button, give the url of your hosting where you want to copy it: http://myhosting.com/bar
* The page has been copied to your hosting, you can now edit it!

## How that works

### Edit

This simply toggles `contentEditable` on the page:
https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable
And you can edit text as you want, but for now there is no styling possible. You can only write text.
It would be interesting to work on a specification(s) on how to edit styles, paragraph, semantics, ...
We may focus more on content edition than styling/layout here.
This may be the place where to focus on microformats, markdown versus html, ...

### Publish

This simply uses WebDAV and emit a PUT HTTP request to your hosting, which replace the file refered by the current URL with the request's body you just sent.
For now, `document.documentElement.outerHTML` is being sent and it is sub-optimal.
This connect with edit which may modify HTML content in an unexpected way. The HTML content should be significantly different from the original version and only contains user modifications.
For now, this doesn't support nested resources like JS,CSS,Images,...

### Broadcast

To be done.
RSS? Decentralized Web? ActivityPub?
