<template>
  <view class="about-container">
    <view class="about-header">
      <button class="about-back" @click="goBack">返回</button>
      <image class="about-logo" src="/static/b3318194914f809af324de8884bd906.png" mode="aspectFit"></image>
    </view>
    <view class="about-title">新欣火教育咨询有限公司</view>
    <view class="about-version">版本：1.0.1</view>
    <view class="about-desc">
      本小程序由新欣火教育咨询有限公司开发，致力于老师更便捷办公
    </view>
    <view class="about-dev">开发者：新欣火科技咨询有限公司（小严）</view>
  </view>
</template>

<script>
export default {
  name: 'AboutUs',
  methods: {
    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style scoped>
.about-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 40rpx 0 40rpx;
  background: #f7f7f7;
  min-height: 100vh;
}
.about-header {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  position: relative;
  margin-bottom: 0;
}
.about-back {
  position: absolute;
  left: 0;
  top: 10rpx;
  font-size: 28rpx;
  background: #1976D2;
  color: #fff;
  border-radius: 32rpx;
  padding: 10rpx 32rpx;
  border: none;
  z-index: 10;
}
.about-logo {
  width: 180rpx;
  height: 180rpx;
  margin: 0 auto 40rpx auto;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
  display: block;
}
.about-title {
  font-size: 44rpx;
  font-weight: bold;
  color: #1976D2;
  margin-bottom: 20rpx;
}
.about-version {
  font-size: 28rpx;
  color: #888;
  margin-bottom: 30rpx;
}
.about-desc {
  font-size: 32rpx;
  color: #333;
  text-align: center;
  margin-bottom: 40rpx;
  line-height: 1.7;
}
.about-dev {
  font-size: 28rpx;
  color: #999;
  margin-top: 60rpx;
}
</style> 