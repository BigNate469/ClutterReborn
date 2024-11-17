var plist = document.getElementById("project-list");
var frame = document.getElementById("frame");
var pre = document.getElementById("prev");
var nex = document.getElementById("next");
pre.style.visibility = "hidden";
const list = [];
var slide = 0;
let input = document.getElementById("input");
let mostRecent;
async function get(url) {
  let obj = await fetch(url);
  let out = await obj.text();
  let json = JSON.parse(out);
  plist.innerHTML = plist.innerHTML + json.title + ", ";
  console.log('updated HTML');
  mostRecent = json.title;
}
let projectTitle = document.getElementById('currentProject');
function updateProjectTitle(refresh = false) {
  if(refresh === true) {
    get(list[slide]);
  };
  projectTitle.innerText = json.title;
};
//console.log(get("https://api.allorigins.win/raw?url=https://api.scratch.mit.edu/"))
function getStringBetween(str, startStr, endStr) {
  const startIndex = str.indexOf(startStr) + startStr.length;
  const endIndex = str.indexOf(endStr, startIndex);
  console.log('got string', str.substring(startIndex, endIndex));
  return str.substring(startIndex, endIndex);
}
async function getFromStudio(id = input.value) {
  let projectURLs = [];
  let response = await fetch(`https://trampoline.turbowarp.org/api/studios/${id}/projects/`)
  let json = await response.json()
  json.forEach((project) => {
    projectURLs.push(project.id);
  });
  console.log('fetched studio data', projectURLs);
  return projectURLs;
};
async function add(id = input.value) {
  if (input.value.startsWith("https://scratch.mit.edu/projects")) {
    list.push(input.value);
    slide = 0;
    frame.src = list[slide] + "embed";
    if (list.length > 1) {
      nex.style.visibility = "visible";
    }
    updateProjectTitle();
    let id = getStringBetween(
      input.value,
      "https://scratch.mit.edu/projects/",
      "/"
    );
    get(
      "https://trampoline.turbowarp.org/api/projects/" +
        id
    );
    /*let json = get("https://api.codetabs.com/v1/proxy/?quest=https://api.scratch.mit.edu/projects/" + id);
          console.log(json.PromiseResult);
          let o = JSON.parse(json);
          plist.innerHTML = plist.innerHTML + ", " + o.title["0"];
          */
  } else if (input.value.startsWith("https://scratch.mit.edu/studios")) {
    let id = getStringBetween(
      input.value,
      "https://scratch.mit.edu/studios/",
      "/"
    );
    let studioProjects = await getFromStudio(id);
    for(let i = 0; i < studioProjects.length; i++) {
      console.log(studioProjects[i]);
      get('https://trampoline.turbowarp.org/api/projects/' + studioProjects[i]);
      list.push('https://scratch.mit.edu/projects/' + studioProjects[i] + '/');
      if (list.length > 1) {
        nex.style.visibility = "visible";
      }
    };
    frame.src = list[0] + "embed";
    slide = 0;
    updateProjectTitle();
  } else {
    console.warn('invalid URL', input.value);
    alert("You can only submit valid Scratch project links.");
  }
}

if (list.length !== 0) {
  frame.src = list[slide] + "embed";
} else {
  nex.style.visibility = "hidden";
}
updateProjectTitle(true);
function next() {
  slide++;
  if (slide == list.length - 1) {
    slide = list.length - 1;
    nex.style.visibility = "hidden";
  }
  frame.src = list[slide] + "embed";
  if (slide == 0) {
    pre.style.visibility = "hidden";
    nex.style.visibility = "visible";
  }
  if (slide !== 0) {
    pre.style.visibility = "visible";
  }
  updateProjectTitle();
}
function prev() {
  slide--;
  if (slide == list.length - 1) {
    slide = list.length - 1;
    nex.style.visibility = "hidden";
  } else {
    nex.style.visibility = "visible";
  }
  frame.src = list[slide] + "embed";
  if (slide == 0) {
    pre.style.visibility = "hidden";
    nex.style.visibility = "visible";
  }
  if (slide !== 0) {
    pre.style.visibility = "visible";
  }
  updateProjectTitle();
}
