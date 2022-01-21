let queue = []

function add(val){
    queue.push(val)
}
function remove(){
    return queue.shift()
}
function queueLength(){
    return queue.length
}
export {queue, add, remove, queueLength}