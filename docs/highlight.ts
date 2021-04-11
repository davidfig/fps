import highlightJs from 'highlight.js'

// shows the code in the demo
export function highlight() {
    var client = new XMLHttpRequest()
    client.open('GET', 'index.ts')
    client.onreadystatechange = function () {
        const code = document.getElementById('code')
        code.innerHTML = highlightJs.highlightAuto(client.responseText).value
    }
    client.send()
}