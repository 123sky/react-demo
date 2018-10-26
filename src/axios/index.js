import JsonP from 'jsonp'
import axios from 'axios'
import { Modal } from 'antd'
export default class Axios {
    static jsonp(options) {
        return new Promise((resolve, reject) => {
            JsonP(options.url, {
                param: 'callback'
            }, function (err, response) {
                if (response.status === 'success') {
                    resolve(response);
                } else {
                    reject(response.messsage);
                }
            })
        })
    }

    static ajax(options){
        /* let loading;
        if (options.data && options.data.isShowLoading !== false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        } */
        let baseApi = 'https://class.h3c.com:8001/chat/';
        return new Promise((resolve,reject)=>{
            let config = {
                headers: {
                    Authorization: 'Token o5dHD5CANL93X_RUPDKotAQ9k5t4'
                },
                url:options.url,
                method:'GET',
                baseURL:baseApi,
                timeout:5000,
                params: '',
                data: {}
            }
            config = Object.assign(config, options)
            axios(config).then((response)=>{
                /* if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                } */
                if (response.status === 200){
                    let res = response.data;
                    if (res.code === 0){
                        resolve(res.data);
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.msg
                        })
                    }
                }else{
                    reject(response.data);
                }
            })
        });
    }
}