const rootElement = document.documentElement;

// Create the interface *in* each web page
// This should be added to browser UI instead... but it was easier to implement this way...
let container;
function createUI() {
  container = document.createElement("div");
  container.setAttribute("style", "position: absolute; z-index: 100000; top: 5px; left: 5px; background: transparent; right: 5px; bottom: 5px; pointer-events: none");
  container.contentEditable = "false";
  rootElement.appendChild(container);

  const shadow = container.attachShadow({mode: 'open'});

  const edit = document.createElement("button");
  edit.textContent = "edit";
  edit.addEventListener("click", toggleEdit);
  edit.setAttribute("style", "position: absolute; top: 10px; right: 10px; pointer-events: auto;");
  shadow.appendChild(edit);

  const publish = document.createElement("button");
  publish.textContent = "publish";
  publish.addEventListener("click", doPublish.bind(null, undefined));
  publish.setAttribute("style", "position: absolute; top: 50px; right: 10px; pointer-events: auto;");
  shadow.appendChild(publish);

  const copy = document.createElement("button");
  copy.textContent = "copy";
  copy.addEventListener("click", copyTo);
  copy.setAttribute("style", "position: absolute; top: 100px; right: 10px; pointer-events: auto;");
  shadow.appendChild(copy);

  const remove = document.createElement("button");
  remove.textContent = "delete";
  remove.addEventListener("click", doDelete);
  remove.setAttribute("style", "position: absolute; top: 150px; right: 10px; pointer-events: auto;");
  shadow.appendChild(remove);
}
createUI();

// Check for 404 pages, in order to strip its content when editing for the first time
let checkedIfPageNotFound = false;
async function checkIfPageNotFound() {
  if (checkedIfPageNotFound) {
    return;
  }
  checkedIfPageNotFound = true;
  const response = await fetch(window.location.href, { method: "HEAD" });
  if (response.status == 404) {
    rootElement.innerHTML = "";
    createUI();
  }
}

// Toggle edit mode.
// For now solely based on `contentEditable`
async function toggleEdit() {
  await checkIfPageNotFound();

  const newState = rootElement.contentEditable === "true" ? "false" : "true";
  rootElement.contentEditable = newState;

  if (newState === "true") {
    container.style.border = "2px dashed gray";
  } else {
    container.style.border = "0";
  }
}

// Publish the document via WebDAV, using a PUT request
// This will only update the document and none of its resources (images, css, js, ...)
async function doPublish(destination = window.location.href) {
  // Remove UI and contentEditable in order to prevent it from being recorder on http server
  container.remove();
  const oldState = rootElement.contentEditable;
  rootElement.contentEditable = "false";

  // Fetch current page's content
  const body = rootElement.outerHTML;
  // XMLSerializer includes content that did not exist in the page
  //const body = new XMLSerializer().serializeToString(document);
  
  // Restore UI and contentEditable
  rootElement.appendChild(container);
  rootElement.contentEditable = oldState;

  // Do a PUT request to update the content on the http server
  const response = await fetch(destination, {
    method: "PUT",
    body,
  });
  // The status code will typically be:
  // * 201 when creating the page
  // * 204 when updating it
  alert("Published!\n Http code:" + response.status + " - " + response.statusText);
}

async function copyTo() {
  const destination = prompt("Copy to which URL?");
  await doPublish(destination);
  window.location = destination;
}

async function doDelete() {
  const response = await fetch(window.location.href, {
    method: "DELETE",
  });
  alert("Deleted!\n Http code:" + response.status + " - " + response.statusText);
  window.location.reload();
}
