<template>
  <view class="change-password-page">
    <view class="header">
      <image class="back-icon" src="/static/back-cartoon.svg" mode="widthFix" @click="goBack" />
      <text class="title">登录密码</text>
    </view>
    <view class="input-item">
      <input
        :type="showPassword ? 'text' : 'password'"
        v-model="currentPassword"
        maxlength="20"
        placeholder="请输入登录密码"
        class="input"
        @input="onInputNumber('currentPassword', $event)"
      />
      <text class="eye-icon" @click="toggleShowPassword">{{ showPassword ? '🙈' : '👁️' }}</text>
    </view>
    <button class="next-btn" :disabled="!canSubmit" @click="handleNext">下一步</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentPassword: '',
      showPassword: false,
      loading: false
    }
  },
  computed: {
    canSubmit() {
      return this.currentPassword.length >= 6 && this.currentPassword.length <= 20 && !this.loading && /^\d{6,20}$/.test(this.currentPassword);
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    onInputNumber(field, e) {
      this[field] = e.detail.value.replace(/[^0-9]/g, '').slice(0, 20);
    },
    async handleNext() {
      if (!this.canSubmit) return;
      this.loading = true;
      try {
        const userInfo = uni.getStorageSync('userInfo');
        if (!userInfo) throw new Error('用户信息不存在');
        const res = await uniCloud.callFunction({
          name: 'user-center',
          data: {
            action: 'verify-password',
            params: {
              username: userInfo.username,
              password: this.currentPassword
            }
          }
        });
        if (res.result && res.result.code === 200) {
          uni.navigateTo({ url: '/pages/change-password/new-password' });
        } else {
          uni.showToast({ title: res.result.message || '验证失败', icon: 'none' });
        }
      } catch (e) {
        uni.showToast({ title: e.message || '验证失败', icon: 'none' });
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.change-password-page {
  background: #fff;
  min-height: 100vh;
  padding: 80rpx 40rpx 0 40rpx;
}
.header {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}
.back-icon {
  width: 44rpx;
  height: 44rpx;
  margin-right: 20rpx;
  cursor: pointer;
}
.title {
  font-size: 44rpx;
  font-weight: bold;
  color: #333;
}
.input-item {
  position: relative;
  margin-bottom: 60rpx;
}
.input {
  width: 100%;
  height: 88rpx;
  background: #f7f7f7;
  border: none;
  border-radius: 16rpx;
  padding: 0 100rpx 0 24rpx;
  font-size: 30rpx;
  color: #333;
  box-sizing: border-box;
}
.eye-icon {
  position: absolute;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 40rpx;
  color: #bbb;
  z-index: 2;
}
.next-btn {
  width: 100%;
  height: 88rpx;
  background: #ff7043;
  color: #fff;
  border: none;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 20rpx;
  transition: all 0.2s;
}
.next-btn:active {
  background: #e13c3e;
}
.next-btn:disabled {
  background: #eee;
  color: #aaa;
}
</style> 