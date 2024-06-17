import { message } from 'antd'
import axios from 'axios'


axios.interceptors.request.use(config=>{
    // config.url = encodeURI(config.url)
    return config
})

// function mock(data){
//     function handel(Obj){
//         if(type(Obj)==='object'){
//             const keys = Object.keys(Obj)
//             keys.forEach(element => {
//                 if(typeof(Obj[element]) === 'object'){
//                     handel(Obj[element])
//                 }
//                 if(typeof(Obj[element]) === 'number'){
//                     // Obj[element] = Obj[element]*3 + Obj[element]*2 - Obj[element]*2
//                 }
//             });
//         }
//     }
//     if(data.code === 200){
//         handel(data.data)
//     }
// }
axios.interceptors.response.use(response =>{
    // console.log(response)
    if(response.headers['content-disposition']){
        return Promise.resolve(response)
    }
    // mock(response.data)
    return Promise.resolve(response.data)
}, (error) => {
    // console.log(error.response)
    if(error.response.status === 401){
        console.log(error.response.status)
        message.warning('没有权限访问，请刷新页面，或者重新登录')
        if(localStorage.getItem('isSuperLogin')){
            // window.location = `//${window.location.host}/loginSuper`;
            // localStorage.removeItem('isSuperLogin')
            
          }else{
            // window.location = `//${window.location.host}/login`;
        }
        // window.location = `//${window.location.host}/login`
    }
    // message.error(error.response.data.msg)
    return Promise.resolve(error.response.data)
})

// const env = process.env.REACT_APP_ENV
// console.log(process.env)
const env = ''
const baseURLs = {
    development: '//4s-api-test.maruzon.cn',
    production: '//4s-api.maruzon.cn',
}

const baseUrl = baseURLs[env ? env : 'production']
// const baseUrl = '//81.69.1.166:8130'
const baseUrl2 = '//81.69.1.166:8131'

const http = {
    baseUrl: 'http://49.235.185.100:8141',
    q2:function(){
        const newReq = {...this}
        newReq.baseUrl = baseUrl2
        return newReq
    },
    request: function(method, path, data){
        const token = localStorage.getItem('token')
        const config = {
            method,
            headers: {
                Authorization: 'Bearer ' + token,
            },
            baseURL: this.baseUrl,
            url: path
        }
        if(method === 'get'){
            config.params = data
        }else{
            config.data = data
        }

        return axios(config)
    },
    get(path, data){
        return this.request('get', path, data)
    },
    post(path, data){
        return this.request('post', path, data)
    },
    put(path, data){
        return this.request('put', path, data)
    },
    delete(path, data){
        return this.request('delete', path, data)
    },
    download(path, datas){
        const token = localStorage.getItem('token')
        const config = {
            method: 'get',
            headers: {
                Authorization: 'Bearer ' + token,
            },
            baseURL: baseUrl,
            url: path,
            responseType: 'arraybuffer'
        }
        config.params = datas

        return axios(config)
    },
    upload(path, params, formData){
        const token = localStorage.getItem('token')
        const config = {
            method: 'post',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'multipart/form-data',
            },
            baseURL: this.baseUrl,
            url: path,
            // responseType: 'arraybuffer'
            data:formData,
            params,
        }
        return axios(config)
    }
}


export default http