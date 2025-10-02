<template>
	<view></view>
</template>

<script>
export default {
	onLoad() {
		const userInfo = uni.getStorageSync('userInfo');
		uni.redirectTo({
			url: `/pages/admin-teacher-schedule/admin-teacher-schedule?isSelf=true&teacherId=${userInfo._id}`
		});
	}
}
</script> 