<template>
    <div class="add_box">
        <div class="add_single">
            <p class="single_left">排序</p>
            <Input placeholder="请输入排序"  :maxlength="20" v-model="projectInfo.top"/>
        </div>
         <div class="add_single">
            <p class="single_left">标题：</p>
            <Input placeholder="请输入标题"  :maxlength="20" v-model="projectInfo.title"/>
        </div>
         <div class="add_single">
            <p class="single_left">副标题：</p>
            <Input placeholder="请输入副标题："  :maxlength="20" v-model="projectInfo.desc"/>
        </div>
         <div class="add_single">
            <p class="single_left">封面图片：</p>
            <div class="image_box">
                <div class="upload_box" >
                    <Upload ref="upload" :format="['jpg', 'jpeg', 'png']" accept="'jpg', 'jpeg', 'png'"  name="file" :data="upData" :on-success="handleSuccess" action="http://up-z0.qiniup.com" class="upload_btn"    :show-upload-list="false" :max-size="2048" >
                        <Icon type="ios-add"  class="upload_icon" />
                        <!-- <img class="img" > </img> -->
                         <img :src="projectInfo.cover" class="img" v-if="projectInfo.cover">
                    </Upload>
                </div>
            </div>
        </div>
        <div class="add_single">
            <p class="single_left">详情图片：</p>
            <div class="upload_content">
            <div class="image_box ">
                <div class="upload_box" >
                    <Upload ref="upload" :format="['jpg', 'jpeg', 'png']" accept="'jpg', 'jpeg', 'png'"  name="file" :data="upData" :on-success="handleSuccessList" action="http://up-z0.qiniup.com" class="upload_btn"    :show-upload-list="false"  >
                        <!-- <Button icon="ios-cloud-upload-outline">Upload files</Button> -->
                        <Icon type="ios-add"  class="upload_icon" />
                        <!-- <img :src="projectInfo.image" class="img" v-if="projectInfo.image"> </img> -->
                    </Upload>
                </div>
              
            </div>
            <div class="image_box upload_image_box" v-for="(item,index) in img_json" :key="index"  @mouseenter="showDelete(index, 'enter')"
                        @mouseleave="showDelete(index, 'out')">
                <div class="upload_box" >
                    <img :src="item" alt="">
                </div>
                <Icon
                @click="deletaImg(index)"
                    type="ios-trash-outline"
                    size="80"
                    :id="'delete' + index"
                    class="delete_icon"
                  ></Icon>
            </div>
            </div>
        </div> 
        <div class="add_single">
            <p class="single_left">出发地点：</p>
            <Input placeholder="请输入标题"  :maxlength="20" v-model="projectInfo.location_start" />
        </div> 
        <div class="add_single">
            <p class="single_left">集合地点：</p>
            <Input placeholder="请输入标题"  :maxlength="20" v-model="projectInfo.location_assemble" />
        </div> 
        <div class="add_single">
            <p class="single_left">解散地点：</p>
            <Input placeholder="请输入标题"  :maxlength="20" v-model="projectInfo.location_dismiss" />
        </div> 
        <div class="add_single">
            <p class="single_left">亮点：</p>
            <Input placeholder="请输入标题" type="textarea" :maxlength="1000" v-model="projectInfo.focus" />
        </div> 
        <div class="add_single">
            <p class="single_left">出游地详情：</p>
            <Input placeholder="请输入标题" type="textarea" :maxlength="1000" v-model="projectInfo.desc2" />
        </div> 
         <div class="add_single">
            <p class="single_left">活动费用：</p>
            <Input placeholder="请输入标题" type="textarea"  :maxlength="1000" v-model="projectInfo.price_info"/>
        </div>
         <div class="add_single">
            <p class="single_left">活动须知：</p>
            <Input placeholder="请输入标题" type="textarea" :maxlength="1000" v-model="projectInfo.notice" />
        </div>

         <div class="add_single">
            <p class="single_left">成人价：</p>
            <Input placeholder="请输入标题"  :maxlength="20" v-model="projectInfo.price" />
        </div>
         <div class="add_single">
            <p class="single_left">儿童价：</p>
            <Input placeholder="请输入标题"  :maxlength="20" v-model="projectInfo.price_child" />
        </div> 
        <UE :defaultMsg=defaultMsg :config=config ref="ue"></UE>
        <!-- <UE :defaultMsg="projectInfo.location_travel" :config=config ref="ue"></UE> -->
        <div class="btn_box">
            <Button type="dashed" class="coo_btn" @click="goback" v-if="!isDetail">取消</Button>
            <Button type="primary"  class="coo_btn" @click ="submit" v-if="!isDetail">保存</Button>
            <!-- <Button type="primary"  class="coo_btn" @click ="isOK" v-if="!isDetail">确定</Button> -->
        </div>
    </div>
</template>
<script>
import addProduct from './addProduct'
export default addProduct
</script>
<style lang="less">
@import url('./addProduct.less');
</style>


