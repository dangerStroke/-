import {fetch} from './api'
export function uploadImg (file,callback){
        let that = this
        let splic = file.name.split(".");
        let baseUploadUrl = 'http://upload.qiniup.com'  //上传七牛云的七牛云存储区域
        let baseuploadImgUrl = 'http://static2.jd-gz.com/' //七牛云的空间域名
        console.log(splic)
        if (
            splic[splic.length - 1] == "png" ||
            splic[splic.length - 1] == "jpg" ||
            splic[splic.length - 1] == "gif" ||
            splic[splic.length - 1] == "jpeg"
        ) {
            let formData = new FormData();
            formData.append("file", file);
            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };
            //获取七牛云token
            fetch('/admin/index/get-upload-token').then(res => {
                // console.log(res)
                if (res.code == 200) {
                    formData.append("token", res.data)
                    that.$post( baseUploadUrl + '/fileUpload', formData, config).then(res => {
                        console.log(res)
                        if (res.key) {
                            //上传成功
                            // that.uploadXszImgUrl = baseuploadImgUrl + res.key
                            that.uploadImgUrl = baseuploadImgUrl + res.key
                            // console.log(that.uploadImgUrl)
                            callback(that.uploadImgUrl) 
                        } else {
                            that.$Message.error('上传图片失败')
                        }
                    }).catch(() => {});
                }
            })
        }
}