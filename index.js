function computedStyleToInlineStyle(element) {

    if (!element) {
        throw new Error("No element specified.");
    }

    const clone = element.cloneNode(false);
    const mockup = document.createElement(element.tagName);
    document.body.appendChild(mockup);

    let innerHTML = '';

    if(!element.childElementCount){
        innerHTML = element.innerHTML;
    }

    for(let child of element.children) {
        innerHTML += computedStyleToInlineStyle(child);
    }

    const computedStyle = getComputedStyle(element);
    const defaultStyles = getComputedStyle(mockup);

    // calculating the difference
    for(let property of computedStyle) {
        const computed = computedStyle.getPropertyValue(property);
        const defaultValue = defaultStyles.getPropertyValue(property);
        if( computed !== defaultValue){
            clone.style[property] = computed;
        }
    }
    mockup.remove();

    let elementHTML = getHTML(clone);
    switch (element.tagName.toLowerCase()){
        case 'area':
        case 'base':
        case 'br':
        case 'col':
        case 'embed':
        case 'hr':
        case 'img':
        case 'input':
        case 'keygen':
        case 'param':
        case 'source':
        case 'track':
        case 'track':
        case 'img':
        case 'img': {
            elementHTML += '</' + element.tagName.toLowerCase() + '>';
        }
    }

    if(innerHTML){
        const parts = elementHTML.split('><');
        elementHTML = parts.join('>' + innerHTML + '<')
    }

    return elementHTML;
}

function toSVG(element, callback){
    const html = computedStyleToInlineStyle(element); 

    const clientWidth = element.clientWidth;
    const clientHeight = element.clientHeight;

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d');

    canvas.width = clientWidth;
    canvas.height = clientHeight;

    const tempImg = document.createElement('img')
    tempImg.addEventListener('load', onTempImageLoad)
    // tempImg.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">' + html + '</div></foreignObject></svg>')
    tempImg.src = 'data:image/svg+xml,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${clientWidth}px" height="${clientHeight}px">
            <foreignObject width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml">
                    ${html}
                </div>
            </foreignObject>
        </svg>`);

    function onTempImageLoad(e){
        ctx.drawImage(e.target, 0, 0)
        callback(canvas.toDataURL())
    }
}

function getHTML(element){
    var wrap = document.createElement('div');
    wrap.appendChild(element.cloneNode(true));
    var innerHTML = wrap.innerHTML;

    return innerHTML;
}