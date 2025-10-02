<template>
  <view class="reset-password-page">
    <view class="header">
      <image class="back-icon" src="/static/back-cartoon.svg" mode="widthFix" @click="goBack" />
      <text class="title">重置密码</text>
    </view>
    <view class="input-group">
      <view class="input-item">
        <input
          :type="showNewPassword ? 'text' : 'password'"
          v-model="newPassword"
          maxlength="20"
          placeholder="请输入6-20位数字新密码"
          class="input"
          @input="onInputNumber('newPassword', $event)"
        />
        <text class="eye-icon" @click="toggleShowNewPassword">{{ showNewPassword ? '🙈' : '👁️' }}</text>
      </view>
      <view class="input-item">
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="confirmPassword"
          maxlength="20"
          placeholder="请确认新密码"
          class="input"
          @input="onInputNumber('confirmPassword', $event)"
        />
        <text class="eye-icon" @click="toggleShowConfirmPassword">{{ showConfirmPassword ? '🙈' : '👁️' }}</text>
      </view>
    </view>
    <button class="reset-btn" :disabled="!canSubmit" @click="handleReset">重置密码</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      showNewPassword: false,
      showConfirmPassword: false,
      loading: false
    }
  },
  computed: {
    canSubmit() {
      return (
        this.newPassword.length >= 6 &&
        this.newPassword.length <= 20 &&
        this.confirmPassword.length >= 6 &&
        this.confirmPassword.length <= 20 &&
        this.newPassword === this.confirmPassword &&
        /^\d{6,20}$/.test(this.newPassword) &&
        !this.loading
      );
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    toggleShowNewPassword() {
      this.showNewPassword = !this.showNewPassword;
    },
    toggleShowConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    onInputNumber(field, e) {
      this[field] = e.detail.value.replace(/[^0-9]/g, '').slice(0, 20);
    },
    async handleReset() {
      if (!this.canSubmit) return;
      this.loading = true;
      try {
        const userInfo = uni.getStorageSync('userInfo');
        if (!userInfo) throw new Error('用户信息不存在');
        const res = await uniCloud.callFunction({
          name: 'user-center',
          data: {
            action: 'update-password',
            params: {
              username: userInfo.username,
              newPassword: this.newPassword
            }
          }
        });
        if (res.result && res.result.code === 200) {
          uni.showToast({ title: '密码重置成功', icon: 'success' });
          setTimeout(() => {
            uni.navigateBack({ delta: 2 });
          }, 1500);
        } else {
          uni.showToast({ title: res.result.message || '重置失败', icon: 'none' });
        }
      } catch (e) {
        uni.showToast({ title: e.message || '重置失败', icon: 'none' });
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.reset-password-page {
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
.input-group {
  margin-bottom: 60rpx;
}
.input-item {
  position: relative;
  margin-bottom: 40rpx;
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
.reset-btn {
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
.reset-btn:active {
  background: #e13c3e;
}
.reset-btn:disabled {
  background: #eee;
  color: #aaa;
}
</style> 