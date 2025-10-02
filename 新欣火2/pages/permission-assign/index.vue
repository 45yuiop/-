<template>
  <view class="permission-assign-index-container" style="padding-top: 50rpx;">
    <view class="fixed-back-btn" style="top: 100rpx;">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">‹</text>
        <text class="back-text">返回</text>
      </view>
    </view>
    <view class="top-bar-no-bg" style="margin-top: 50rpx;">
      <view class="top-nav-flex">
        <view class="page-title-center">权限分配</view>
      </view>
    </view>
    <view class="btn-group">
      <button class="main-btn" @click="goToAdd">添加教师功能</button>
      <button class="main-btn" @click="goToDelete">删除教师功能</button>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    goToAdd() {
      uni.navigateTo({ url: '/pages/permission-assign/add' });
    },
    goToDelete() {
      uni.navigateTo({ url: '/pages/permission-assign/delete' });
    },
    goBack() {
      if (getCurrentPages().length > 1) {
        uni.navigateBack();
      } else {
        uni.reLaunch({ url: '/pages/home/home' });
      }
    }
  }
}
</script>

<style scoped>
.permission-assign-index-container {
  padding: 60rpx 30rpx 30rpx 30rpx;
  min-height: 100vh;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #1976D2;
  margin-bottom: 60rpx;
  margin-top: 40rpx;
}
.btn-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40rpx;
  align-items: center;
}
.main-btn {
  width: 80%;
  background: linear-gradient(90deg, #667eea 0%, #4fc3f7 100%);
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  border: none;
  border-radius: 50rpx;
  box-shadow: 0 8rpx 24rpx rgba(76,195,247,0.15);
  padding: 28rpx 0;
  transition: background 0.3s;
}
.main-btn:active {
  background: linear-gradient(90deg, #4fc3f7 0%, #667eea 100%);
  opacity: 0.85;
}
.top-bar-no-bg {
  background: none;
  box-shadow: none;
}
.top-nav-flex {
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 0;
  margin-bottom: 30rpx;
}
.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}
.back-btn:active {
  transform: translateY(1px);
  box-shadow: 0 1px 4px rgba(102, 126, 234, 0.3);
}
.back-icon {
  font-size: 18px;
  font-weight: bold;
}
.back-text {
  font-size: 14px;
  font-weight: 500;
}
.page-title-center {
  flex: 1;
  text-align: center;
  font-size: 40rpx;
  font-weight: bold;
  color: #1976D2;
  margin-left: -40rpx;
}
.fixed-back-btn {
  position: fixed;
  top: 30rpx;
  left: 30rpx;
  z-index: 10;
}
</style> 