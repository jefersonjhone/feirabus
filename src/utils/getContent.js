const getContent = (ApiEndPoint, setState) =>{
    fetch(ApiEndPoint).then(e => e.json()).then(e => setState(e))

}

export default getContent;
