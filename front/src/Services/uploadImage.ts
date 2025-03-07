import apiClient from './api-client.ts';


const uploadImage = (file: File | null,username:string | null):Promise<string> => {
    return new Promise((resolve, reject) => {
    const formData = new FormData();
    if(file && username){
    formData.append('file', file);
    const path = '/file/'+username+'/';
    apiClient.post(path, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'username': username,
        },
    }).then((res) => {
        const url = res.data.url;
        resolve(url);
    }).catch((err) => {
        console.error(err);
        reject(err);
        });
    }
    });
}
export default uploadImage;
