<template>
  <view class="permission-delete-container">
    <view class="top-bar-no-bg">
      <view class="top-nav-flex">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">‹</text>
          <text class="back-text">返回</text>
        </view>
        <view class="page-title-center">删除教师功能</view>
      </view>
    </view>
    <view class="desc">请选择要删除功能的教师账号。</view>
    <picker :range="memberList" range-key="teacherName" @change="onMemberChange">
      <view class="member-picker">
        <text>{{ selectedMember ? selectedMember.teacherName + '（' + (selectedMember.role || selectedMember.username) + '）' : '请选择成员' }}</text>
      </view>
    </picker>
    <view v-if="selectedMember" class="feature-list">
      <checkbox-group v-model="featuresToDelete">
        <checkbox
          v-for="feature in selectedMemberFeatures"
          :key="feature.key"
          :value="String(feature.key)"
        >
          {{ feature.name }}
        </checkbox>
      </checkbox-group>
      <button class="delete-btn" :disabled="deleteLoading" @click="deleteFeatures">
        <text v-if="!deleteLoading">删除所选功能</text>
        <text v-else>删除中...</text>
      </button>
    </view>
  </view>
</template>

<script>
import featureListConfig from '@/utils/featureList.js';
export default {
  data() {
    return {
      memberList: [],
      selectedMember: null,
      selectedMemberFeatures: [], // 当前账号已有功能点（对象数组）
      featuresToDelete: [], // 选中要删除的功能key
      deleteLoading: false
    };
  },
  onShow() {
    this.initData();
  },
  methods: {
    goBack() {
      if (getCurrentPages().length > 1) {
        uni.navigateBack();
      } else {
        uni.reLaunch({ url: '/pages/home/home' });
      }
    },
    async initData() {
      const userInfo = uni.getStorageSync('userInfo');
      // 只显示权限为普通用户的账号
      const res = await uniCloud.callFunction({
        name: 'user-center',
        data: { action: 'get-accounts' }
      });
      if (res.result && res.result.code === 200) {
        this.memberList = res.result.data.filter(acc => {
          const isParent = acc.role && (Array.isArray(acc.role) ? acc.role.includes('家长') : acc.role === '家长');
          const isSelf = acc._id === userInfo._id;
          const isNormal = acc.permission === '普通用户';
          return !isParent && !isSelf && isNormal;
        });
      }
      this.selectedMember = null;
      this.selectedMemberFeatures = [];
      this.featuresToDelete = [];
    },
    onMemberChange(e) {
      const idx = e.detail.value;
      this.selectedMember = this.memberList[idx];
      // 只展示该账号已有的功能点（对象数组）
      this.selectedMemberFeatures = featureListConfig.filter(f =>
        Array.isArray(this.selectedMember.featureList) && this.selectedMember.featureList.includes(f.key)
      );
      // 默认全选已有功能
      this.featuresToDelete = this.selectedMemberFeatures.map(f => String(f.key));
    },
    async deleteFeatures() {
      if (!this.selectedMember) return;
      if (!this.featuresToDelete.length) {
        uni.showToast({ title: '请选择要删除的功能', icon: 'none' });
        return;
      }
      this.deleteLoading = true;
      // 删除选中的功能点
      const remainFeatures = (this.selectedMember.featureList || []).filter(f => !this.featuresToDelete.includes(f));
      const res = await uniCloud.callFunction({
        name: 'user-center',
        data: {
          action: 'update-account',
          params: {
            id: this.selectedMember._id,
            featureList: remainFeatures
          }
        }
      });
      this.deleteLoading = false;
      uni.showToast({ title: '删除成功', icon: 'success' });
      this.initData();
    },
    goToIndex() {
      uni.reLaunch({ url: '/pages/permission-assign/index' });
    }
  }
}
</script>

<style scoped>
.permission-delete-container {
  padding: 60rpx 30rpx 30rpx 30rpx;
  min-height: 100vh;
  background: #f8f8f8;
  position: relative;
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
.desc {
  font-size: 30rpx;
  color: #555;
  margin-bottom: 30rpx;
}
.member-picker {
  padding: 24rpx 30rpx;
  background: #fff;
  border-radius: 16rpx;
  font-size: 32rpx;
  color: #1976D2;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.06);
}
.feature-list {
  margin-bottom: 30rpx;
}
.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  color: #333;
}
.feature-name {
  margin-left: 18rpx;
  font-size: 30rpx;
}
.delete-btn {
  width: 100%;
  background: linear-gradient(90deg, #f56c6c 0%, #ffb199 100%);
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  border: none;
  border-radius: 50rpx;
  box-shadow: 0 8rpx 24rpx rgba(245,108,108,0.15);
  padding: 28rpx 0;
  transition: background 0.3s;
  margin-top: 30rpx;
}
.delete-btn:active {
  background: linear-gradient(90deg, #ffb199 0%, #f56c6c 100%);
  opacity: 0.85;
}
.delete-btn[disabled] {
  opacity: 0.6;
}
</style> 