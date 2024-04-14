const getContent = (ApiEndPoint, setState) =>{
    window.Recebe = function(data){
        if (data.sucesso){
            console.log(`requisicao feita com sucesso: ${ApiEndPoint}` )
            setState(data);}
        else{
            console.log(`requisicao sem sucesso ${ApiEndPoint}`)
        }
    };

    window.$.ajax({
        url: ApiEndPoint,
        type:  'GET',
        crossDomain: true,
        dataType: 'jsonp',
        async : true,
        timeout: 45000,
        cache: false,
        error: (e)=>{
            console.log(`erro na requisicao: ${ApiEndPoint} :`)
        },
    });
    return () => delete window.Recebe;
}
export default getContent;
