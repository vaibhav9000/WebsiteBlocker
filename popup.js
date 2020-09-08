let input = document.querySelector("input")
let ul = document.querySelector("ul")
let button = document.querySelector(".btn")

button.addEventListener("click", async function(){
    let toBeBlocked = input.value;
    if(toBeBlocked){
        await sendMessage(toBeBlocked)
        addToList(toBeBlocked)
    }
})

async function init(){
    let blocklist = await sendMessage({type:"getList", link: undefined})
    for(let i=0; i<blocklist.length; i++){
        addToList(blocklist[i].site)
    }
}

init()

function addToList(toBeBlocked){
    let li = document.createElement("li")
    li.setAttribute("class", "list-group-item")
    li.innerHTML = toBeBlocked + '<i class="fas fa-times"></i>'
    ul.appendChild(li)
    input.value = ''
    let i = li.querySelector("i")
    i.addEventListener("click", function(){
        i.parentNode.remove()
    })
}

function sendMessage(message){
    return new Promise(function(resolve, reject){
        chrome.runtime.sendMessage({
            type: message.type,
            link: message
        }, function(response){
            resolve(response)
        })
    })
}