
const parseHtml = (rawData) => {
    let titleObj = rawData[0];
    let postTitle = titleObj.data.text;
    let postDescription = '';
    let postDescriptionGrabFlag = false;
    let postThumbnail = '';
    let postThumbnailGrabFlag = false;
    let parsedHtml = '';
    rawData.shift();
    rawData.forEach((obj) => {
        switch (obj.type) {
            case 'header':
                parsedHtml += `<div class='mt-4'><h${obj.data.level} class='font-semibold'>${obj.data.text}</h${obj.data.level}></div>`;
                break;
            case 'paragraph':
                if (!postDescriptionGrabFlag) {
                    postDescription = obj.data.text;
                    postDescriptionGrabFlag = true;
                }
                parsedHtml += `<div class="mt-4"><p class="text-sm font-serif font-normal">${obj.data.text}</p></div>`;
                break;
            case 'list':
                if (obj.data.style === 'ordered') {
                    parsedHtml += `<div class="mt-2"><ol class="list-decimal">`;
                    obj.data.items.forEach((item) => {
                        parsedHtml += `<li>${item}</li>`;
                    });
                    parsedHtml += `</ol></div>`;
                } else if (obj.data.style === 'unordered') {
                    parsedHtml += `<div class="mt-2"><ul class="list-disc">`;
                    obj.data.items.forEach((item) => {
                        parsedHtml += `<li>${item}</li>`;
                    });
                    parsedHtml += `</ul></div>`;
                }
                break;
            case 'delimiter':
                parsedHtml += `<div class="mt-4 text-center"><p class="font-bold">***</p></div>`;
                break;
            case 'image':
                if (!postThumbnailGrabFlag) {
                    postThumbnail = obj.data.file.url;
                    postThumbnailGrabFlag = true;
                }
                let imageUrl = obj.data.file.url;
                let imageCaption = obj.data.caption;
                let className = '';
                if (obj.data.withBorder) {
                    className = 'border-1 border-black';
                }
                let imageHtml = `<div class="mt-4"><img src="${imageUrl}" alt="${imageCaption}" class="w-full ${className}"></div>`;
                parsedHtml += imageHtml;
                break;
            case 'embed':
                let embedHtml = `<div class="mt-4"><iframe src="${obj.data.embed}" width="${obj.data.width}" height="${obj.data.height}" allowfullscreen></iframe></div>`;
                parsedHtml += embedHtml;
                break;
            case 'code':
                let codeHtml = `<div class="mt-4"><pre><code>${obj.data.code}</code></pre></div>`;
                parsedHtml += codeHtml;
                break;
            case 'quote':
                let quoteHtml = `<div class="mt-4"><blockquote class="border-l-4 border-cyan-600 bg-gray-200 italic pl-4">${obj.data.text}</blockquote></div>`;
                parsedHtml += quoteHtml;
                break;
            case 'linkTool':
                let linkHtml = `<div class="mt-4"><a href="${obj.data.link}" class="text-blue-600 hover:underline">${obj.data.meta.title}</a></div>`;
                parsedHtml += linkHtml;
                break;
            default:
                break;
        }
    });
    let finalHtmlObj = {
        thumbnail: postThumbnail,
        title: postTitle,
        description: postDescription,
        content: parsedHtml
    };
    return finalHtmlObj;
};

module.exports = parseHtml;



// case 'table':
//     let tableHtml = `<div class="mt-4"><table class="table-auto"><thead><tr>`;
//     obj.data.content[0].forEach((item)=>{
//         tableHtml += `<th class="border px-4 py-2">${item}</th>`;
//     })
//     tableHtml += `</tr></thead><tbody>`;
//     obj.data.content.shift();
//     obj.data.content.forEach((row)=>{
//         tableHtml += `<tr>`;
//         row.forEach((item)=>{
//             tableHtml += `<td class="border px-4 py-2">${item}</td>`;
//         })
//         tableHtml += `</tr>`;
//     })
//     tableHtml += `</tbody></table></div>`;
//     parsedHtml += tableHtml;
//     break;