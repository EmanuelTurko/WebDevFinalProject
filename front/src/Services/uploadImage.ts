import apiClient from './api-client.ts';


const uploadImage = (file: File | null,username:string | null):Promise<string> => {
    return new Promise((resolve, reject) => {
    const formData = new FormData();
    console.log('uploading...', file);
    if(file && username){
    formData.append('file', file);
    console.log('uploading...', formData);
    const path = '/file/'+username+'/';
    apiClient.post(path, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'username': username,
        },
    }).then((res) => {
        console.log("response: ", res);
        console.log("uploaded");
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
