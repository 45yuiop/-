<template>
  <view class="system-setting-page">
    <view class="setting-header">
      <image class="back-icon" src="/static/back-cartoon.svg" mode="widthFix" @click="goBack" />
      <text class="setting-title">系统设置</text>
    </view>
    
    <!-- 登录密码重设入口 -->
    <view v-if="showChangePassword" class="password-setting-row">
      <view class="password-setting-left">
        <view class="password-icon-bg"><text class="password-icon">🔒</text></view>
        <text class="password-label">登录密码</text>
      </view>
      <view class="password-setting-right">
        <button class="password-reset-btn" @click="goToChangePassword">重设</button>
      </view>
    </view>
    
    <view class="logout-btn-modern" @click="confirmLogout">
      <text class="logout-icon">&#128274;</text>
      <text class="logout-text">退出登录</text>
    </view>
  </view>
</template>

<script>
export default {
  computed: {
    showChangePassword() {
      const userInfo = uni.getStorageSync('userInfo');
      if (!userInfo) return false;
      
      // 超级管理员不显示修改密码功能
      return userInfo.permission !== 'superadmin';
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    goToChangePassword() {
      uni.navigateTo({
        url: '/pages/change-password/change-password'
      });
    },
    confirmLogout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        confirmText: '退出',
        confirmColor: '#ff4d4f',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.logout();
          }
        }
      });
    },
    logout() {
      uni.removeStorageSync('userInfo');
      uni.reLaunch({ url: '/pages/login/login' });
    }
  }
}
</script>

<style>
.system-setting-page {
  background: #f7f7f7;
  min-height: 100vh;
  padding-top: 100rpx;
}
.setting-header {
  display: flex;
  align-items: center;
  margin-bottom: 60rpx;
  padding: 0 20rpx;
}
.back-icon {
  width: 44rpx;
  height: 44rpx;
  margin-right: 20rpx;
  cursor: pointer;
}
.setting-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  text-align: left;
}

.password-setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 40rpx 20rpx 40rpx;
  padding: 32rpx 24rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}
.password-setting-left {
  display: flex;
  align-items: center;
}
.password-setting-right {
  display: flex;
  align-items: center;
  margin-left: 20rpx;
}
.password-icon-bg {
  width: 56rpx;
  height: 56rpx;
  background: #ff7043;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}
.password-icon {
  font-size: 32rpx;
  color: #fff;
}
.password-label {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}
.password-reset-btn {
  background: #fff4ee;
  color: #ff7043;
  border: none;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
  padding: 12rpx 36rpx;
  box-shadow: 0 2rpx 8rpx rgba(255,112,67,0.08);
}
.password-reset-btn:active {
  background: #ffe5db;
}

.logout-btn-modern {
  margin: 60rpx 40rpx 0 40rpx;
  padding: 24rpx 0;
  background: #ff4d4f;
  color: #fff;
  text-align: center;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: bold;
  box-shadow: 0 2rpx 8rpx rgba(255,77,79,0.08);
  transition: background 0.2s;
}
.logout-btn-modern:active {
  background: #e13c3e;
}
.logout-icon {
  font-size: 36rpx;
  margin-right: 16rpx;
}
.logout-text {
  font-size: 32rpx;
}
</style> 