async function handleRequest(request) {
    const parsedUrl = new URL(request.url)
    let path = parsedUrl.pathname;
    if (path.endsWith(".jpg")){
        const value = await IMAGE_CACHE.get(path, "stream");
        if (value === null) {
            let result = await fetch(ORIGIN_URL + path);
            let rs = await result.clone().body
            await IMAGE_CACHE.put(path, rs);
            return result.clone(); 
        }
        let response = new Response(value); 
        response.headers.set('Content-Type', 'image/jpeg')
        return response;
    }else{
        return fetch(ORIGIN_URL + path);
    }
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})
