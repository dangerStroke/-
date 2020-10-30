<template>
    <div class="trainAdd_box">
        <div class="add_single">
            <p class="single_left">项目标题：</p>
            <Input v-model="projectInfo.title" placeholder="请输入项目名称"  :maxlength="20" :readonly="type==='detail'" />
        </div>
        <div class="add_single">
            <p class="single_left">详情宣言：</p>
            <Input v-model="projectInfo.details" placeholder="请输入详情宣言" :maxlength="20" :readonly="type==='detail'" />
        </div>
        <div class="add_single">
            <p class="single_left">项目详情：</p>
            <Input type="textarea" v-model="projectInfo.project" placeholder="请输入项目名称" :maxlength="800"  :readonly="type==='detail'"/>
        </div>
        <div class="add_single">
            <p class="single_left">项目图片：</p>
            <div class="image_box">
                <div class="upload_box" >
                    <Upload :disabled ="type==='detail'" ref="upload" :format="['jpg', 'jpeg', 'png']" accept="'jpg', 'jpeg', 'png'"  name="file" :data="upData" :on-success="handleSuccess" action="http://up-z0.qiniup.com" class="upload_btn"    :show-upload-list="false" :max-size="2048" >
                        <!-- <Button icon="ios-cloud-upload-outline">Upload files</Button> -->
                        <Icon type="ios-add"  class="upload_icon" />
                        <img :src="projectInfo.image" class="img" v-if="projectInfo.image"> </img>
                    </Upload>
                </div>
                <!-- <div class="upload_box" >
                    <img :src="projectInfo.image" class="img"> </img>
                </div> -->

            </div>
        </div>
        <div class="add_single">
            <p class="single_left">banner图片：</p>
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
            <p class="single_left">项目价格：</p>
            <Input v-model="projectInfo.price" placeholder="请输入项目价格"  :readonly="type==='detail'" />
        </div>
        <div class="add_single">
            <p class="single_left">人均价格：</p>
            <Input v-model="projectInfo.unit_price" placeholder="请输入人均价格"  />
        </div>
        <div class="add_single">
            <p class="single_left">关联班次：</p>
            <div class="timer_box">
                <Tree :data="treeData" show-checkbox multiple @on-check-change="treeChange" ref="tree"></Tree>
            </div>
        </div>
        <div class="btn_box" v-if="type==='modify'">
            <Button type="dashed" class="coo_btn" @click="cancleSubmit">取消</Button>
            <Button type="primary"  class="coo_btn" @click="saveSetting">保存</Button>
        </div>
        <div class="btn_box" v-else>
            <Button type="dashed" class="coo_btn" @click="cancleSubmit">返回</Button>
        </div>
    </div>
</template>
<script>
import trainDetail from "./trainDetail"
export default trainDetail
</script>
<style lang="less">
@import url("./trainDetail.less"); 
</style>


