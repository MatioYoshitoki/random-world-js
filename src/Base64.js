export function DecodeBase64(str) {
    // 过程：从字节流到百分比编码，再到原始字符串
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}