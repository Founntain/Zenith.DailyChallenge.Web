const { protocol, hostname, port } = window.location;
const baseUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
const apiUrl = "https://tetrio.founntain.dev";
const imgUrl = 'res/img/'

console.log(protocol, hostname, baseUrl, apiUrl)