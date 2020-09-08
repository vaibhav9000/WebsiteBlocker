let blockList = []

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.type=="getList"){
        console.log(blockList)
        return sendResponse(blockList)
    } else {
        blockList.push({site: request.link, time: 10})
        sendResponse(true)
    }
})

async function init(){
    if(blockList.length<=0) return
    let tab = await getTab()
    //console.log(tab)
    if(!tab) return
    let url = tab.url
    for(let i=0; i<blockList.length; i++){
        let isUsing = url.includes(blockList[i].site)
        if(isUsing){
            blockList[i].time--
            chrome.browserAction.setBadgeText({text:blockList[i].time+" "})
            if(blockList[i].time<=0){
                chrome.browserAction.setBadgeText({text:blockList[i].time+" "})
                await removeTab(tab)
                //console.log("tab closed")
            }
        }
    }
}

setInterval(init, 1000)

function getTab(){
    return new Promise(function(resolve, reject){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            resolve(tabs[0])
        })
    })
}

function removeTab(tab){
    return new Promise(function(resolve, reject){
        chrome.tabs.remove(tab.id, function(){
            resolve()
        })
    })
}