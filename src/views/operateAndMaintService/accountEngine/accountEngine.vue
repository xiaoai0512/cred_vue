<!-- 用户管理 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <div class="text_title">会计审批</div>
        <div class="allcontent layui-form">
			<iframe style="width:100%;height:500px;" src="http://10.6.90.183:9301/aes/#/MainIndex/aesConvBusiSys"></iframe>
		</div>
	</div>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
  	name: 'tableList',
  	components: {
    // eslint-disable-next-line vue/no-unused-components
    	Pagination,
  	},
	data() {
      	return {
//      	/logininfo: '',
        }
    },
    created() {
        
    },
    mounted() {
      
   	},
    methods: {
        
    }
}
</script>

<style>
</style>
