const getContent = (ApiEndPoint, setState, id) =>{
    fetch(ApiEndPoint).then(e => e.json()).then(e => setState(e))

}

export default getContent;
