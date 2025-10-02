<template>
  <view class="schedule-tab-loading">正在跳转...</view>
</template>

<script>
export default {
  onLoad() {
    const userInfo = uni.getStorageSync('userInfo');
    if (!userInfo) {
      uni.reLaunch({ url: '/pages/login/login' });
      return;
    }
    const isTeacher = userInfo.role && userInfo.role.includes('教师');
    const isAdmin = (userInfo.role && userInfo.role.includes('管理员')) || userInfo.permission === '管理员' || userInfo.permission === 'superadmin' || (userInfo.role && userInfo.role.includes('教务'));
    if (isTeacher && !isAdmin) {
      uni.redirectTo({ url: '/pages/teacher-courses/teacher-courses' });
    } else {
      uni.redirectTo({ url: '/pages/admin-teacher-schedule/admin-teacher-schedule' });
    }
  }
}
</script>

<style>
.schedule-tab-loading {
  text-align: center;
  color: #888;
  font-size: 32rpx;
  margin-top: 200rpx;
}
</style> 